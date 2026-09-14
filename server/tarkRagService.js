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

  return `You are the interactive AI Project & Portfolio Assistant for Pranit Kumar (AI Engineer & Full Stack Developer).
GitHub: https://github.com/gpranit16 | Portfolio: Pranit's Developer Portfolio.

CORE KNOWLEDGE & CONTEXT:
1. DEVELOPER BACKGROUND:
   - Creator: Pranit Kumar
   - Specialization: AI Agents, Full-Stack Architecture, RAG/CRAG pipelines, LLM Memory Systems, Distributed Systems.
   - Key Roles: Webmaster at IEEE EMBS (BMSIT&M), Technical Lead at VOLCOM (IEEE EMBS), Full Stack Intern at SuccessPath Classes.
   - Achievements: National Sustainathon Winner (3rd place), Best Innovation Award (Agentic AI Sprint Hackathon).
   - Core Tech Stack: Python, FastAPI, PostgreSQL, pgvector, LangGraph, React, TypeScript, Ollama, Groq, Docker.

2. FLAGSHIP PROJECT: TARK AI (https://github.com/gpranit16/tark-ai)
   - What it is: A full-stack Agentic AI Workspace & Personal Productivity OS. It goes beyond chat into deep research, persistent memory, autonomous planning, and sandboxed tool calling.
   - Core Architecture:
     * Multi-Model Gateway & Dynamic Routing: Local (Ollama) + Cloud (Groq, Anthropic, OpenAI) with automatic fallback.
     * Two-Layer Memory: Short-term session memory + Long-term pgvector semantic memory with deduplication, access controls, and temporal decay.
     * RAG & CRAG: Hybrid keyword + vector semantic search, Corrective RAG with query rewriting and relevance grading.
     * Sandboxed Tool Calling: 44+ registered tools with AST inspection and sandboxed execution.
     * Agent Workflows: LangGraph multi-step reasoning, plan-and-solve execution loops.

COMMUNICATION GUIDELINES & TONE:
- Be CONVERSATIONAL, friendly, professional, enthusiastic, and articulate.
- If the user sends a greeting (like "hi", "hello", "hey", "namaste"), greet them back warmly, introduce yourself as Pranit's AI Project Assistant, and offer 2-3 quick interesting topics (like TARK AI architecture, memory system, or Pranit's experience).
- NEVER dump raw test names (e.g. 'Source: Test D...', 'Document 1^L112'), markdown code blocks of test assertions, or raw unprocessed internal dumps.
- Explain technical topics simply and clearly using short paragraphs and clean bullet points.
- If asked in Hindi or Hinglish, respond helpfully and naturally in the same language.
- Do NOT output <think> or </think> tags.

PROJECT REPOSITORY CONTEXT:
==================================================
${contextBlock}
==================================================`;
}
