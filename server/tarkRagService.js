import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KNOWLEDGE_PATH = path.resolve(__dirname, '../data/tark_knowledge_index.json');

let knowledgeBase = null;

export function loadKnowledgeBase() {
  try {
    if (fs.existsSync(KNOWLEDGE_PATH)) {
      const raw = fs.readFileSync(KNOWLEDGE_PATH, 'utf8');
      knowledgeBase = JSON.parse(raw);
      console.log(`[TARK RAG] Knowledge base loaded with ${knowledgeBase.total_chunks || knowledgeBase.chunks.length} chunks.`);
    } else {
      console.warn(`[TARK RAG] Knowledge base not found at ${KNOWLEDGE_PATH}.`);
    }
  } catch (err) {
    console.error('[TARK RAG] Error loading knowledge base:', err.message);
  }
}

// Initial load
loadKnowledgeBase();

const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'the', 'this', 'but', 'they', 'have', 'had', 'what', 'when',
  'where', 'who', 'which', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
  'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don',
  'should', 'now', 'tell', 'me', 'about', 'explain', 'give', 'does', 'work',
  'tark', 'ai', 'project', 'system', 'built'
]);

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOPWORDS.has(t));
}

const GREETING_PATTERNS = [
  /^(hi|hii|hiii|hello|hey|heyy|namaste|hola|yo|sup|greetings)(\s+.*)?$/i,
  /^(who\s+are\s+you|what\s+can\s+you\s+do|who\s+made\s+you|tell\s+me\s+about\s+yourself)(\s+.*)?$/i,
  /^(kya\s+haal\s+hai|kaise\s+ho|kon\s+ho\s+tum)(\s+.*)?$/i,
];

export function isGreetingQuery(query) {
  if (!query) return false;
  const clean = query.trim().toLowerCase();
  return GREETING_PATTERNS.some(pattern => pattern.test(clean));
}

export function retrieveRelevantChunks(query, topK = 5) {
  if (!knowledgeBase || !knowledgeBase.chunks) {
    loadKnowledgeBase();
    if (!knowledgeBase) return { chunks: [], sources: [] };
  }

  const lowerQuery = query.toLowerCase().trim();
  const isGreeting = isGreetingQuery(lowerQuery);

  if (isGreeting) {
    // For greetings, we don't need heavy code chunks
    return { chunks: [], sources: [] };
  }

  const queryTokens = tokenize(query);
  const isAskingAboutTests = lowerQuery.includes('test') || lowerQuery.includes('pytest') || lowerQuery.includes('eval');

  if (queryTokens.length === 0) {
    // If query only has stopwords (e.g. "What is TARK AI?"), match core overview docs
    const coreDocs = knowledgeBase.chunks.filter(c => 
      ['README.md', 'PROJECT_CONTEXT.md', 'ARCHITECTURE.md'].includes(c.source)
    ).slice(0, topK);
    return {
      chunks: coreDocs,
      sources: coreDocs.map(c => ({
        source: c.source,
        file_path: c.file_path,
        section: c.section,
        title: c.title,
        lines: c.lines || [1, 50]
      }))
    };
  }

  const totalDocs = knowledgeBase.total_chunks || knowledgeBase.chunks.length;
  const avgDocLen = knowledgeBase.avg_doc_length || 100;
  const docFreq = knowledgeBase.doc_freq || {};
  const k1 = 1.2;
  const b = 0.75;

  // Score each chunk using BM25 with priority boosters
  const scoredChunks = knowledgeBase.chunks.map(chunk => {
    let score = 0;
    const docLen = chunk.docLength || (chunk.tokens ? chunk.tokens.length : 80);
    const filePathLower = (chunk.file_path || '').toLowerCase();
    const sourceLower = (chunk.source || '').toLowerCase();

    // FILTER: Severely penalize unit test files unless user specifically asked about tests
    const isTestFile = filePathLower.includes('test') || sourceLower.includes('test') || sourceLower.startsWith('test_');
    if (isTestFile && !isAskingAboutTests) {
      return { chunk, score: 0 };
    }

    queryTokens.forEach(term => {
      const df = docFreq[term] || 1;
      const idf = Math.log(1 + (totalDocs - df + 0.5) / (df + 0.5));
      const tf = chunk.tf ? (chunk.tf[term] || 0) : (chunk.content.toLowerCase().split(term).length - 1);

      if (tf > 0) {
        const bm25 = idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (docLen / avgDocLen))));
        score += bm25;
      }
    });

    // Section title / header match bonus
    const titleLower = (chunk.title || '').toLowerCase();
    const sectionLower = (chunk.section || '').toLowerCase();

    queryTokens.forEach(term => {
      if (titleLower.includes(term) || sectionLower.includes(term)) {
        score += 3.5;
      }
      if (filePathLower.includes(term)) {
        score += 2.0;
      }
    });

    // Exact phrase match bonus
    const contentLower = chunk.content.toLowerCase();
    if (contentLower.includes(lowerQuery)) {
      score += 8.0;
    }

    // Architecture & Core doc prioritization
    if (['README.md', 'ARCHITECTURE.md', 'PROJECT_CONTEXT.md', 'DECISIONS.md'].includes(chunk.source)) {
      score *= 1.6;
    }

    return { chunk, score };
  });

  // Sort descending by relevance score
  scoredChunks.sort((a, b) => b.score - a.score);

  const topResults = scoredChunks
    .filter(item => item.score > 0.4)
    .slice(0, topK)
    .map(item => item.chunk);

  const sources = topResults.map(c => ({
    source: c.source,
    file_path: c.file_path,
    section: c.section,
    title: c.title,
    lines: c.lines || [1, 50]
  }));

  return { chunks: topResults, sources };
}

export function buildSystemPrompt(contextChunks, isGreeting = false) {
  let contextBlock = '';
  if (contextChunks && contextChunks.length > 0) {
    contextBlock = contextChunks.map((c, i) => {
      return `[CONTEXT CHUNK ${i + 1}] File: ${c.file_path} | Section: ${c.section}\n${c.content}\n`;
    }).join('\n----------------------------------------\n');
  } else {
    contextBlock = 'No specific low-level code chunks required for this general query.';
  }

  return `You are the specialized AI Project Assistant for TARK AI (created by Pranit Kumar, https://github.com/gpranit16/tark-ai).

ROLE & PURPOSE:
- You represent TARK AI — a full-stack, research-grade Agentic AI Workspace & Personal Productivity OS.
- You explain its architecture, 2-layer memory system, RAG/CRAG pipelines, model routing gateway, sandboxed tool execution, and engineering decisions.

ANSWER STRUCTURE & STYLE (MANDATORY):
1. **THOUGHTFUL & ELEGANT STRUCTURE**:
   - Start with a direct, compelling 1-2 sentence high-level overview.
   - Break technical concepts into 2-4 structured bullet points with clear bold headings.
   - Conclude with a brief note on how it benefits the user or the underlying tech decision (e.g. pgvector, LangGraph, AST sandboxing).
2. **BEAUTIFULLY FORMATTED MARKDOWN**:
   - Use standard Markdown: \`**bold**\` for key terms, \`\`code\`\` for tech names/methods, clean bullet lists (\`-\`), and fenced code blocks when demonstrating code.
   - NEVER output raw unrendered syntax or raw doc indicators like \`[Document 1^L112-L124]\` or \`Source: Test D...\`.
3. **TONE**:
   - Senior AI Engineer / Architect: articulate, precise, clear, warm, and helpful.
   - Avoid overwhelming jargon without explanation; explain the "why" and "how" simply.
4. **GREETINGS**:
   - When greeted (e.g. "hi", "hello"), respond warmly as the TARK AI Project Assistant and suggest 2-3 specific architectural questions to explore.
5. **NO THINK TAGS**:
   - Do NOT output <think> or </think> tags.

FLAGSHIP PROJECTS KNOWLEDGE:
1. TARK AI (https://github.com/gpranit16/tark-ai):
   - Full-stack Agentic AI Workspace & Personal Productivity OS.
   - Architecture: React Frontend + FastAPI Backend + PostgreSQL / pgvector + LangGraph Agent Runtime.
   - Two-Layer Memory: Per-thread short-term session buffer + Long-term pgvector semantic memory with cosine similarity, deduplication, confidence scores, and temporal decay.
   - RAG & CRAG: Hybrid keyword (BM25) + dense vector search with corrective query rewriting and relevance grading.
   - Dynamic Model Gateway: Unified routing layer across local Ollama models and cloud APIs (Groq, Anthropic, OpenAI) with automatic fallback.
   - Sandboxed Tool Calling: 44+ tools with AST inspection and sandboxed Python execution.

2. SYNCORA (https://github.com/gpranit16/syncora | Live: https://syncora-rho.vercel.app):
   - Real-Time Team Collaboration & Productivity Workspace.
   - Core Capabilities: Real-time channel messaging, voice meeting transcripts, direct conversations, and integrated sprint task workflows.

- Creator: Pranit Kumar (AI Engineer & Full Stack Developer).

PROJECT REPOSITORY CONTEXT:
==================================================
${contextBlock}
==================================================`;
}
