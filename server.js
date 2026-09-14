import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { retrieveRelevantChunks, buildSystemPrompt, loadKnowledgeBase } from './server/tarkRagService.js';
import { retrieveSyncoraChunks, buildSyncoraSystemPrompt, loadSyncoraKnowledge } from './server/syncoraRagService.js';
import { retrieveChurnChunks, buildChurnSystemPrompt, loadChurnKnowledge } from './server/churnRagService.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ── Contact API ──
app.post('/api/contact', async (req, res) => {
  const { name, email, query } = req.body;

  if (!name || !email || !query) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // 1. Email to Pranit
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `[Portfolio] New Message from ${name}`,
      html: `
        <h3>New Query from Portfolio</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Query:</strong></p>
        <p style="padding: 12px; border-left: 4px solid #C8820A; background: #f9f9f9; color: #333;">${query}</p>
      `,
    });

    // 2. Auto-reply to the sender
    await transporter.sendMail({
      from: `"Pranit Kumar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank you for connecting, ${name}!`,
      html: `
        <div style="font-family: sans-serif; color: #1a1a1a;">
          <p>Hi ${name},</p>
          <p>Thank you for reaching out! I've received your message and will get back to you as soon as I can.</p>
          <p>Best regards,<br/><strong>Pranit Kumar</strong><br/>AI Engineer & Full Stack Developer</p>
        </div>
      `,
    });

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// ── TARK AI Project Knowledge Assistant (RAG Chat with Streaming) ──
app.post('/api/tark-assistant/chat', async (req, res) => {
  const { question, history = [] } = req.body;

  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return res.status(400).json({ error: 'A question is required.' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: GROQ_API_KEY not found.' });
  }

  // 1. Retrieve relevant project context
  const { chunks, sources } = retrieveRelevantChunks(question, 5);
  const systemPrompt = buildSystemPrompt(chunks);

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Immediately send retrieved sources metadata
  res.write(`data: ${JSON.stringify({ type: 'sources', sources })}\n\n`);

  // Build message history
  const cleanHistory = (Array.isArray(history) ? history : [])
    .slice(-4)
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content }));

  const messages = [
    { role: 'system', content: systemPrompt },
    ...cleanHistory,
    { role: 'user', content: question.trim() }
  ];

  const candidateModels = [
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'qwen/qwen3.6-27b',
    'qwen/qwen3.8-27b',
    process.env.GROQ_MODEL,
  ].filter(Boolean);

  let groqResponse = null;
  let usedModel = '';

  for (const model of candidateModels) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.4,
          max_tokens: 800,
          stream: true,
        }),
      });

      if (response.ok) {
        groqResponse = response;
        usedModel = model;
        break;
      } else {
        const err = await response.text();
        console.warn(`[TARK Assistant] Model ${model} failed (${response.status}):`, err);
      }
    } catch (e) {
      console.warn(`[TARK Assistant] Error attempting model ${model}:`, e.message);
    }
  }

  if (!groqResponse || !groqResponse.body) {
    res.write(`data: ${JSON.stringify({ type: 'error', error: 'TARK RAG service currently unavailable. Please try again shortly.' })}\n\n`);
    res.end();
    return;
  }

  try {
    const reader = groqResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let inThinkTag = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const payload = trimmed.slice(6).trim();
          if (payload === '[DONE]') {
            continue;
          }
          try {
            const parsed = JSON.parse(payload);
            let delta = parsed.choices?.[0]?.delta?.content || '';

            // Strip out <think> tags if model includes them
            if (delta.includes('<think>')) {
              inThinkTag = true;
              delta = delta.replace(/<think>[\s\S]*?<\/think>/g, '').replace(/<think>[\s\S]*/g, '');
            } else if (inThinkTag) {
              if (delta.includes('</think>')) {
                inThinkTag = false;
                delta = delta.split('</think>')[1] || '';
              } else {
                delta = '';
              }
            }

            if (delta) {
              res.write(`data: ${JSON.stringify({ type: 'delta', delta })}\n\n`);
            }
          } catch (e) {
            // Ignore parse errors on partial chunks
          }
        }
      }
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error) {
    console.error('[TARK Assistant] Streaming Error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', error: error.message || 'Stream disrupted' })}\n\n`);
    res.end();
  }
});

// ── Refresh Knowledge Index ──
app.post('/api/tark-assistant/reindex', async (req, res) => {
  try {
    loadKnowledgeBase();
    res.json({ message: 'TARK Knowledge index reloaded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── SYNCORA Project Knowledge Assistant (RAG Chat with Streaming) ──
app.post('/api/syncora-assistant/chat', async (req, res) => {
  const { question, history = [] } = req.body;

  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return res.status(400).json({ error: 'A question is required.' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: GROQ_API_KEY not found.' });
  }

  // 1. Retrieve relevant Syncora context
  const { chunks, sources } = retrieveSyncoraChunks(question, 5);
  const systemPrompt = buildSyncoraSystemPrompt(chunks);

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Send retrieved sources metadata
  res.write(`data: ${JSON.stringify({ type: 'sources', sources })}\n\n`);

  // Build message history
  const cleanHistory = (Array.isArray(history) ? history : [])
    .slice(-4)
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content }));

  const messages = [
    { role: 'system', content: systemPrompt },
    ...cleanHistory,
    { role: 'user', content: question.trim() }
  ];

  const candidateModels = [
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'qwen/qwen3.6-27b',
    'qwen/qwen3.8-27b',
    process.env.GROQ_MODEL,
  ].filter(Boolean);

  let groqResponse = null;

  for (const model of candidateModels) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.3,
          max_tokens: 800,
          stream: true,
        }),
      });

      if (response.ok) {
        groqResponse = response;
        break;
      } else {
        const err = await response.text();
        console.warn(`[Syncora Assistant] Model ${model} failed (${response.status}):`, err);
      }
    } catch (e) {
      console.warn(`[Syncora Assistant] Error attempting model ${model}:`, e.message);
    }
  }

  if (!groqResponse || !groqResponse.body) {
    res.write(`data: ${JSON.stringify({ type: 'error', error: 'Syncora Assistant service currently unavailable. Please try again shortly.' })}\n\n`);
    res.end();
    return;
  }

  try {
    const reader = groqResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let inThinkTag = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const payload = trimmed.slice(6).trim();
          if (payload === '[DONE]') continue;

          try {
            const parsed = JSON.parse(payload);
            let delta = parsed.choices?.[0]?.delta?.content || '';

            // Strip out <think> tags if model includes them
            if (delta.includes('<think>')) {
              inThinkTag = true;
              delta = delta.replace(/<think>[\s\S]*?<\/think>/g, '').replace(/<think>[\s\S]*/g, '');
            } else if (inThinkTag) {
              if (delta.includes('</think>')) {
                inThinkTag = false;
                delta = delta.split('</think>')[1] || '';
              } else {
                delta = '';
              }
            }

            if (delta) {
              res.write(`data: ${JSON.stringify({ type: 'delta', delta })}\n\n`);
            }
          } catch {
            // Ignore parse errors on partial chunks
          }
        }
      }
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error) {
    console.error('[Syncora Assistant] Streaming Error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', error: error.message || 'Stream disrupted' })}\n\n`);
    res.end();
  }
});

// ── Refresh Syncora Knowledge Index ──
app.post('/api/syncora-assistant/reindex', async (req, res) => {
  try {
    loadSyncoraKnowledge();
    res.json({ message: 'Syncora Knowledge index reloaded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CHURN REAPER Project Knowledge Assistant (RAG Chat with Streaming) ──
app.post('/api/churn-assistant/chat', async (req, res) => {
  const { question, history = [] } = req.body;

  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return res.status(400).json({ error: 'A question is required.' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: GROQ_API_KEY not found.' });
  }

  // 1. Retrieve relevant Churn Reaper context
  const { chunks, sources } = retrieveChurnChunks(question, 5);
  const systemPrompt = buildChurnSystemPrompt(chunks);

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Send retrieved sources metadata
  res.write(`data: ${JSON.stringify({ type: 'sources', sources })}\n\n`);

  // Build message history
  const cleanHistory = (Array.isArray(history) ? history : [])
    .slice(-4)
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content }));

  const messages = [
    { role: 'system', content: systemPrompt },
    ...cleanHistory,
    { role: 'user', content: question.trim() }
  ];

  const candidateModels = [
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'qwen/qwen3.6-27b',
    'qwen/qwen3.8-27b',
    process.env.GROQ_MODEL,
  ].filter(Boolean);

  let groqResponse = null;

  for (const model of candidateModels) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.25,
          max_tokens: 850,
          stream: true,
        }),
      });

      if (response.ok) {
        groqResponse = response;
        break;
      } else {
        const err = await response.text();
        console.warn(`[Churn Assistant] Model ${model} failed (${response.status}):`, err);
      }
    } catch (e) {
      console.warn(`[Churn Assistant] Error attempting model ${model}:`, e.message);
    }
  }

  if (!groqResponse || !groqResponse.body) {
    res.write(`data: ${JSON.stringify({ type: 'error', error: 'Churn Reaper Assistant service currently unavailable. Please try again shortly.' })}\n\n`);
    res.end();
    return;
  }

  try {
    const reader = groqResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let inThinkTag = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const payload = trimmed.slice(6).trim();
          if (payload === '[DONE]') continue;

          try {
            const parsed = JSON.parse(payload);
            let delta = parsed.choices?.[0]?.delta?.content || '';

            // Strip out <think> tags if model includes them
            if (delta.includes('<think>')) {
              inThinkTag = true;
              delta = delta.replace(/<think>[\s\S]*?<\/think>/g, '').replace(/<think>[\s\S]*/g, '');
            } else if (inThinkTag) {
              if (delta.includes('</think>')) {
                inThinkTag = false;
                delta = delta.split('</think>')[1] || '';
              } else {
                delta = '';
              }
            }

            if (delta) {
              res.write(`data: ${JSON.stringify({ type: 'delta', delta })}\n\n`);
            }
          } catch {
            // Ignore parse errors on partial chunks
          }
        }
      }
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error) {
    console.error('[Churn Assistant] Streaming Error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', error: error.message || 'Stream disrupted' })}\n\n`);
    res.end();
  }
});

// ── Refresh Churn Knowledge Index ──
app.post('/api/churn-assistant/reindex', async (req, res) => {
  try {
    loadChurnKnowledge();
    res.json({ message: 'Churn Reaper Knowledge index reloaded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Portfolio Server running on port ${PORT}`);
  });
}

export default app;
