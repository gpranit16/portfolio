import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { retrieveRelevantChunks, buildSystemPrompt, loadKnowledgeBase } from './server/tarkRagService.js';
import { retrieveSyncoraChunks, buildSyncoraSystemPrompt, loadSyncoraKnowledge } from './server/syncoraRagService.js';
import { retrieveChurnChunks, buildChurnSystemPrompt, loadChurnKnowledge } from './server/churnRagService.js';
import { retrieveGlobalPranitChunks, buildGlobalPranitSystemPrompt } from './server/globalPranitRagService.js';
import { checkDomainScope } from './server/domainGuardrails.js';

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

  const emailUser = (process.env.EMAIL_USER || '').trim();
  const emailPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');

  if (!emailUser || !emailPass) {
    console.error('Email credentials missing: EMAIL_USER or EMAIL_PASS not set in .env');
    return res.status(500).json({ error: 'Email configuration is missing on server.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  try {
    // 1. Email to Pranit
    await transporter.sendMail({
      from: `"${name}" <${emailUser}>`,
      replyTo: email,
      to: emailUser,
      subject: `[Portfolio Query] New Message from ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 24px; color: #1a1a1a; max-width: 600px; border: 1px solid #e5e0d8; border-radius: 8px; background: #ffffff;">
          <h2 style="color: #C8820A; margin-top: 0; font-size: 20px;">New Portfolio Inquiry</h2>
          <p style="margin: 8px 0;"><strong>Sender Name:</strong> ${name}</p>
          <p style="margin: 8px 0;"><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #C8820A;">${email}</a></p>
          <p style="margin: 16px 0 8px 0;"><strong>Message / Query:</strong></p>
          <div style="padding: 16px; border-left: 4px solid #C8820A; background: #fbf9f5; border-radius: 4px; font-size: 15px; line-height: 1.6; color: #222;">
            ${query.replace(/\n/g, '<br/>')}
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0 16px;" />
          <p style="font-size: 12px; color: #888; margin: 0;">Sent directly from your portfolio contact form.</p>
        </div>
      `,
    });

    // 2. Auto-reply to the sender
    await transporter.sendMail({
      from: `"Pranit Kumar" <${emailUser}>`,
      to: email,
      subject: `Thank you for connecting, ${name}!`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 24px; color: #1a1a1a; max-width: 600px; border: 1px solid #e5e0d8; border-radius: 8px; background: #ffffff;">
          <h2 style="color: #C8820A; margin-top: 0; font-size: 20px;">Thank You for Reaching Out!</h2>
          <p style="font-size: 15px; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.6;">Thank you for getting in touch through my portfolio. I've received your query and will get back to you shortly.</p>
          <div style="padding: 14px 18px; border-left: 3px solid #C8820A; background: #fbf9f5; margin: 18px 0; font-style: italic; color: #444; border-radius: 4px;">
            "${query.replace(/\n/g, '<br/>')}"
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #555;">In the meantime, feel free to explore my open-source projects or connect on LinkedIn and GitHub.</p>
          <br/>
          <p style="margin-bottom: 4px; font-size: 15px;">Best regards,</p>
          <p style="margin-top: 0; font-size: 15px;"><strong>Pranit Kumar</strong><br/><span style="color: #8A8070; font-size: 13px;">AI Systems &amp; Full Stack Developer</span></p>
        </div>
      `,
    });

    console.log(`[Contact API] Successfully processed message and sent auto-reply to ${email}`);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send message. Please check server logs.' });
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

  // 0. Strict Domain Boundary Guardrail
  const scopeCheck = checkDomainScope('tark', question);
  if (!scopeCheck.inScope) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.write(`data: ${JSON.stringify({ type: 'sources', sources: [] })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: 'delta', delta: scopeCheck.refusal })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
    return;
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
    process.env.GROQ_MODEL,
    'qwen/qwen3.6-27b',
    'openai/gpt-oss-20b',
    'qwen/qwen3.8-27b',
    'openai/gpt-oss-120b',
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

  // 0. Strict Domain Boundary Guardrail
  const scopeCheck = checkDomainScope('syncora', question);
  if (!scopeCheck.inScope) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.write(`data: ${JSON.stringify({ type: 'sources', sources: [] })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: 'delta', delta: scopeCheck.refusal })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
    return;
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
    process.env.GROQ_MODEL,
    'qwen/qwen3.6-27b',
    'openai/gpt-oss-20b',
    'qwen/qwen3.8-27b',
    'openai/gpt-oss-120b',
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

  // 0. Strict Domain Boundary Guardrail
  const scopeCheck = checkDomainScope('churn', question);
  if (!scopeCheck.inScope) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.write(`data: ${JSON.stringify({ type: 'sources', sources: [] })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: 'delta', delta: scopeCheck.refusal })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
    return;
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
    process.env.GROQ_MODEL,
    'qwen/qwen3.6-27b',
    'openai/gpt-oss-20b',
    'qwen/qwen3.8-27b',
    'openai/gpt-oss-120b',
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

// ── GLOBAL ASK PRANIT AI Portfolio Assistant (RAG Chat with Streaming) ──
app.post('/api/pranit-assistant/chat', async (req, res) => {
  const queryText = req.body.question || req.body.message || '';
  const history = req.body.history || [];

  if (!queryText || typeof queryText !== 'string' || queryText.trim().length === 0) {
    return res.status(400).json({ error: 'A question is required.' });
  }
  const question = queryText.trim();
  console.log(`[ASK PRANIT] Request received: "${question}"`);

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: GROQ_API_KEY not found.' });
  }

  // 1. Build clean message history (up to last 8 turns for contextual follow-up awareness)
  const cleanHistory = (Array.isArray(history) ? history : [])
    .slice(-8)
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content }));

  // 2. Context-aware RAG Retrieval incorporating query + history
  const { chunks, sources } = retrieveGlobalPranitChunks(question, cleanHistory, 4);
  console.log(`[ASK PRANIT] Retrieved ${chunks.length} chunks:`, chunks.map(c => c.title));

  const systemPrompt = buildGlobalPranitSystemPrompt(chunks);

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Send retrieved sources metadata
  res.write(`data: ${JSON.stringify({ type: 'sources', sources })}\n\n`);

  const messages = [
    { role: 'system', content: systemPrompt },
    ...cleanHistory,
    { role: 'user', content: question }
  ];

  const candidateModels = [
    process.env.GROQ_MODEL,
    'qwen/qwen3.6-27b',
    'openai/gpt-oss-20b',
    'qwen/qwen3.8-27b',
    'openai/gpt-oss-120b',
  ].filter(Boolean);

  let groqResponse = null;
  let usedModel = '';

  for (const model of candidateModels) {
    try {
      console.log(`[ASK PRANIT] Attempting model call: ${model}`);
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.35,
          max_tokens: 750,
          stream: true,
        }),
      });

      if (response.ok) {
        groqResponse = response;
        usedModel = model;
        console.log(`[ASK PRANIT] Model connection established: ${model}`);
        break;
      } else {
        const err = await response.text();
        console.warn(`[ASK PRANIT] Model ${model} returned ${response.status}:`, err);
      }
    } catch (e) {
      console.warn(`[ASK PRANIT] Error attempting model ${model}:`, e.message);
    }
  }

  if (!groqResponse || !groqResponse.body) {
    console.error('[ASK PRANIT] All candidate models failed to respond.');
    res.write(`data: ${JSON.stringify({ type: 'error', error: 'ASK PRANIT AI service currently unavailable. Please try again shortly.' })}\n\n`);
    res.end();
    return;
  }

  try {
    const reader = groqResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let inThinkTag = false;
    let firstTokenLogged = false;

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
              if (!firstTokenLogged) {
                console.log('[ASK PRANIT] First token received');
                firstTokenLogged = true;
              }
              res.write(`data: ${JSON.stringify({ type: 'delta', delta })}\n\n`);
            }
          } catch {
            // Ignore partial JSON parse chunks
          }
        }
      }
    }

    console.log('[ASK PRANIT] Stream completed successfully');
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error) {
    console.error('[ASK PRANIT] Streaming Error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', error: error.message || 'Stream disrupted' })}\n\n`);
    res.end();
  }
});

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Portfolio Server running on port ${PORT}`);
  });
}

export default app;
