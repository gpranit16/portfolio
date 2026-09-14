import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KNOWLEDGE_PATH = path.resolve(__dirname, '../data/churn_knowledge_index.json');

let knowledgeBase = null;

export function loadChurnKnowledge() {
  try {
    if (fs.existsSync(KNOWLEDGE_PATH)) {
      const raw = fs.readFileSync(KNOWLEDGE_PATH, 'utf8');
      knowledgeBase = JSON.parse(raw);
      console.log(`[Churn RAG] Knowledge base loaded with ${knowledgeBase.total_chunks || knowledgeBase.chunks.length} chunks.`);
    } else {
      console.warn(`[Churn RAG] Knowledge base not found at ${KNOWLEDGE_PATH}.`);
    }
  } catch (err) {
    console.error('[Churn RAG] Error loading knowledge base:', err.message);
  }
}

// Initial load
loadChurnKnowledge();

const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'the', 'this', 'but', 'they', 'have', 'had', 'what', 'when',
  'where', 'who', 'which', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
  'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should',
  'now', 'tell', 'me', 'about', 'explain', 'give', 'does', 'work', 'churn', 'reaper'
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
];

export function isChurnGreeting(query) {
  if (!query) return false;
  return GREETING_PATTERNS.some(p => p.test(query.trim().toLowerCase()));
}

export function retrieveChurnChunks(query, topK = 5) {
  if (!knowledgeBase || !knowledgeBase.chunks) {
    loadChurnKnowledge();
    if (!knowledgeBase) return { chunks: [], sources: [] };
  }

  const lowerQuery = query.toLowerCase().trim();

  if (isChurnGreeting(lowerQuery)) {
    return { chunks: [], sources: [] };
  }

  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) {
    const coreDocs = knowledgeBase.chunks.slice(0, topK);
    return {
      chunks: coreDocs,
      sources: coreDocs.map(c => ({
        source: c.source,
        file_path: c.file_path,
        section: c.section,
        title: c.title,
        lines: c.lines || [1, 50],
      })),
    };
  }

  const totalDocs = knowledgeBase.total_chunks || knowledgeBase.chunks.length;
  const avgDocLen = knowledgeBase.avg_doc_length || 100;
  const docFreq = knowledgeBase.doc_freq || {};
  const k1 = 1.2;
  const b = 0.75;

  const scoredChunks = knowledgeBase.chunks.map(chunk => {
    let score = 0;
    const docLen = chunk.docLength || (chunk.tokens ? chunk.tokens.length : 80);

    queryTokens.forEach(term => {
      const df = docFreq[term] || 1;
      const idf = Math.log(1 + (totalDocs - df + 0.5) / (df + 0.5));
      const tf = chunk.tf ? (chunk.tf[term] || 0) : 0;

      if (tf > 0) {
        const bm25 = idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (docLen / avgDocLen))));
        score += bm25;
      }
    });

    const titleLower = (chunk.title || '').toLowerCase();
    const sectionLower = (chunk.section || '').toLowerCase();
    const filePathLower = (chunk.file_path || '').toLowerCase();

    queryTokens.forEach(term => {
      if (titleLower.includes(term) || sectionLower.includes(term)) {
        score += 3.5;
      }
      if (filePathLower.includes(term)) {
        score += 2.0;
      }
    });

    if (chunk.content.toLowerCase().includes(lowerQuery)) {
      score += 7.0;
    }

    return { chunk, score };
  });

  scoredChunks.sort((a, b) => b.score - a.score);

  const topResults = scoredChunks
    .filter(item => item.score > 0.1)
    .slice(0, topK)
    .map(item => item.chunk);

  const sources = topResults.map(c => ({
    source: c.source,
    file_path: c.file_path,
    section: c.section,
    title: c.title,
    lines: c.lines || [1, 50],
  }));

  return { chunks: topResults, sources };
}

export function buildChurnSystemPrompt(contextChunks) {
  let contextBlock = '';
  if (contextChunks && contextChunks.length > 0) {
    contextBlock = contextChunks.map((c, i) => {
      return `[CONTEXT CHUNK ${i + 1}] Source: ${c.file_path} | Section: ${c.section}\n${c.content}\n`;
    }).join('\n----------------------------------------\n');
  } else {
    contextBlock = 'General Churn Reaper project inquiry.';
  }

  return `You are the official Churn Reaper AI Project Assistant.

Churn Reaper is an AI-assisted customer churn intelligence and retention decision system.
Core Pipeline: Predict (XGBoost) → Explain (TreeSHAP) → Recommend (NVIDIA Nemotron) → Evaluate (Deterministic Financial Engine).

REPOSITORY & DEPLOYMENTS:
- GitHub Repository: https://github.com/gpranit16/churn-reaper
- Live Demo: https://churn-reaper-y1d3.vercel.app (React, Vite, Tailwind)
- Backend: FastAPI, XGBoost, TreeSHAP, OpenRouter NVIDIA Nemotron 30B

CORE RULES & TRUTHS (MANDATORY):
1. **Never invent metrics or features**:
   - ROC-AUC: 84.81% (Baseline: 82.06%)
   - Recall: 71.66% (Baseline: 61.23% — +39 churners caught, missed down from 145 to 106)
   - F1-Score: 63.13% (Baseline: 58.94%)
   - Classification Threshold: 0.35 (tuned for sensitive churn detection)
   - Dataset: 7,043 Telco customer accounts benchmark
2. **Deterministic Financial Formulas**:
   - Remaining Lifetime: $R = \\max(24 - \\text{Tenure}, 0)$
   - Future Revenue: $F = \\text{MonthlyCharges} \\times R$
   - Revenue at Risk: $A = F \\times \\text{ChurnProbability}$
   - Profit at Risk ($60\\%$ Gross Margin): $P = A \\times 0.60$
   - Value Protected: $V = P \\times \\text{ScenarioSuccessRate}$ ($20\\%$ for discount, $15\\%$ for support, $25\\%$ for contract)
   - Net Benefit: $N = V - \\text{RetentionCost}$
   - ROI: $ROI = N / \\text{RetentionCost}$
   - Decision Rule: $N > 0 \\implies \\text{RETAIN CUSTOMER}$ else $\\text{DO NOT SPEND}$.
3. **AI Proposes, Backend Calculates**:
   - NVIDIA Nemotron proposes candidate retention offers.
   - Backend policy guardrails clamp/validate constraints (Max 15% discount, max 3 mo, max ₹30/mo support, max ₹150 contract upgrade).
   - Financial math is calculated deterministically by the Python engine, NOT by the LLM.
4. **Resilience & Fallback**:
   - If NVIDIA API fails or rate-limits, a rule-based fallback generates compliant offers without 500 crashes.
5. **Transparent Assumptions**:
   - Scenario success rates are configured planning assumptions, not causal treatment effects.
6. **Scope Isolation**:
   - Strictly scoped to the Churn Reaper project. Decline unrelated outside questions politely.
7. **No Internal Chain-of-Thought / No Think Tags**:
   - Never output <think> or hidden reasoning. Provide clean, user-facing output.

CONVERSATIONAL STYLE:
- Direct, senior ML/finance engineer tone.
- Start with 1-2 direct sentences, then break down logic with crisp markdown, bold headers, and formula math.

VERIFIED KNOWLEDGE & REPOSITORY CONTEXT:
==================================================
${contextBlock}
==================================================`;
}
