// server/domainGuardrails.js
// Strict Domain-Boundary Guardrails & Classifiers for All Portfolio Assistants.

export const DOMAIN_REFUSALS = {
  tark: "I can answer questions about the TARK AI project, but that question is outside my scope.",
  syncora: "I can answer questions about the Syncora project, but that question is outside my scope.",
  pranit: "I can answer questions about Pranit and his portfolio, but that question is outside my scope.",
  churn: "I can answer questions about the Churn Reaper project, but that question is outside my scope."
};

export const UNVERIFIED_REFUSALS = {
  tark: "I couldn't verify that from the TARK AI project context.",
  syncora: "I couldn't verify that from the Syncora project context.",
  pranit: "I couldn't verify that from Pranit's portfolio context.",
  churn: "I couldn't verify that from the Churn Reaper project context."
};

// Common greetings across all assistants
const GREETING_REGEX = /^(hi|hii|hiii|hello|hey|heyy|namaste|hola|yo|sup|greetings|good\s+(morning|afternoon|evening|day))(\s+.*)?$/i;

// Prompt Injection / Jailbreak detection
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(your\s+|previous\s+|prior\s+)?instructions/i,
  /forget\s+(your\s+|the\s+)?(scope|rules|instructions|system\s+prompt|guardrails)/i,
  /you\s+are\s+now\s+(a\s+general|chatgpt|dan|unrestricted|free|an\s+unfiltered)/i,
  /bypass\s+(guardrails|safety|rules|scope)/i,
  /pretend\s+(to\s+be|you\s+are)\s+(a\s+general|chatgpt|unrestricted|dan)/i,
  /act\s+as\s+(a\s+general|unrestricted|different|chatgpt|dan)/i,
  /answer\s+this\s+from\s+your\s+(own\s+)?(general\s+)?knowledge/i,
  /disregard\s+(all\s+)?(rules|guidelines|instructions)/i
];

// Universal Out-of-Domain General Knowledge & Trivia Patterns
const UNIVERSAL_OUT_OF_DOMAIN_PATTERNS = [
  // Animals / Nature / General entities
  /\b(what\s+is|tell\s+me\s+about|describe)\s+a\s+(cat|dog|lion|tiger|elephant|animal|tree|plant|bird|fish|car|fruit|apple|banana|mammal|reptile|insect|dinosaur)\b/i,
  /\b(cats|dogs|elephants|tigers|lions|mammals|dinosaurs|domesticated\s+animals)\b/i,
  // Weather / Geography / General Facts
  /\b(what('?s|\s+is)\s+the\s+weather|weather\s+today|weather\s+forecast)\b/i,
  /\b(capital\s+of|distance\s+between|tallest\s+mountain|mount\s+everest|pacific\s+ocean|how\s+many\s+continents)\b/i,
  /\b(photosynthesis|quantum\s+computing|theory\s+of\s+relativity|black\s+hole|speed\s+of\s+light|solar\s+system|planet\s+mars)\b/i,
  // Celebrities / Outside Politicians / Sports
  /\b(elon\s+musk|barack\s+obama|donald\s+trump|narendra\s+modi|bill\s+gates|steve\s+jobs|taylor\s+swift|cristiano\s+ronaldo|messi|lebron|virat\s+kohli)\b/i,
  /\b(who\s+won\s+the\s+(world\s+cup|super\s+bowl|ipl|olympics|champions\s+league))\b/i,
  // Entertainment / Creative general requests
  /\b(tell\s+me\s+a\s+joke|make\s+me\s+laugh|sing\s+(me\s+)?a\s+song|write\s+a\s+poem|write\s+a\s+story\s+about\s+(love|space|dragons|princess))\b/i,
  /\b(recipe\s+for|how\s+to\s+cook|how\s+to\s+bake|ingredients\s+for)\b/i,
  // Medical / Legal / Financial general advice
  /\b(symptoms\s+of|cure\s+for|medical\s+advice|legal\s+advice|diagnose\s+me|investment\s+advice|buy\s+crypto|stocks\s+to\s+buy)\b/i,
  // Generic coding homework / LeetCode (not about the actual project architecture/stack)
  /\b(solve\s+binary\s+search|write\s+a\s+binary\s+search|invert\s+(a\s+)?binary\s+tree|quicksort\s+in\s+java|leetcode\s+\d+|fibonacci\s+in\s+c\+\+)\b/i
];

/**
 * Checks if a query is an injection or universally out of domain
 */
export function isUniversalOutOfDomain(query) {
  if (!query || typeof query !== 'string') return true;
  const clean = query.trim();

  // Check injection
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(clean)) return true;
  }

  // Check universal out of domain
  for (const pattern of UNIVERSAL_OUT_OF_DOMAIN_PATTERNS) {
    if (pattern.test(clean)) return true;
  }

  return false;
}

/**
 * TARK AI Domain Classifier
 */
const TARK_IN_DOMAIN_KEYWORDS = [
  'tark', 'agent', 'agentic', 'langgraph', 'memory', '2-layer', 'short-term', 'long-term',
  'pgvector', 'vector', 'embedding', 'crag', 'rag', 'retrieval', 'rerank', 'bm25',
  'mcp', 'model context protocol', 'tool', 'tools', 'sandbox', 'ast', 'python sandbox',
  'model routing', 'gateway', 'ollama', 'fastapi', 'architecture', 'react', 'postgres',
  'deep research', 'google calendar', 'google tasks', 'github mcp', 'dataset', 'latency',
  'benchmark', 'eval', 'test', 'repo', 'codebase', 'pranit', 'creator', 'author',
  'personal os', 'workspace', 'llm', 'groq', 'claude', 'openai', 'gemini'
];

export function checkTarkScope(query) {
  if (!query || typeof query !== 'string') {
    return { inScope: false, refusal: DOMAIN_REFUSALS.tark };
  }
  const clean = query.trim().toLowerCase();

  if (GREETING_REGEX.test(clean)) {
    return { inScope: true, isGreeting: true };
  }

  if (isUniversalOutOfDomain(clean)) {
    return { inScope: false, refusal: DOMAIN_REFUSALS.tark };
  }

  // Check if specifically asking about Syncora or Churn Reaper without any TARK context
  if ((clean.includes('syncora') || clean.includes('webrtc') || clean.includes('churn reaper') || clean.includes('treeshap')) && !clean.includes('tark')) {
    return { inScope: false, refusal: DOMAIN_REFUSALS.tark };
  }

  // Check for TARK domain keywords
  const hasTarkKeyword = TARK_IN_DOMAIN_KEYWORDS.some(kw => clean.includes(kw));
  if (hasTarkKeyword) {
    return { inScope: true };
  }

  // Check general questions about the system/project capabilities
  const capabilityPatterns = [
    /how\s+does\s+(it|this|the\s+system|the\s+app|the\s+project)\s+work/i,
    /what\s+can\s+(it|this|tark|the\s+assistant)\s+do/i,
    /what\s+technologies\s+are\s+used/i,
    /explain\s+the\s+architecture/i,
    /how\s+is\s+it\s+built/i,
    /who\s+built\s+this/i,
    /features/i,
    /deployment/i
  ];

  if (capabilityPatterns.some(p => p.test(clean))) {
    return { inScope: true };
  }

  // Otherwise, outside TARK scope
  return { inScope: false, refusal: DOMAIN_REFUSALS.tark };
}

/**
 * SYNCORA Domain Classifier
 */
const SYNCORA_IN_DOMAIN_KEYWORDS = [
  'syncora', 'meeting', 'meetings', 'webrtc', 'socket.io', 'socket', 'voice', 'video',
  'channel', 'channels', 'direct message', 'direct messages', 'dm', 'dms', 'chat', 'messaging',
  'nemotron', 'nvidia', 'transcript', 'transcripts', 'summary', 'summaries', 'kanban',
  'task', 'tasks', 'tidb', 'mysql', 'jwt', 'rbac', 'role', 'roles', 'auth', 'authentication',
  'host', 'host controls', 'mesh', 'peer', 'p2p', 'web speech', 'express', 'node', 'react',
  'collaboration', 'workspace', 'action item', 'action items', 'decision', 'blocker', 'render',
  'vercel', 'architecture', 'codebase', 'repo', 'features', 'implementation', 'pranit'
];

export function checkSyncoraScope(query) {
  if (!query || typeof query !== 'string') {
    return { inScope: false, refusal: DOMAIN_REFUSALS.syncora };
  }
  const clean = query.trim().toLowerCase();

  if (GREETING_REGEX.test(clean)) {
    return { inScope: true, isGreeting: true };
  }

  if (isUniversalOutOfDomain(clean)) {
    return { inScope: false, refusal: DOMAIN_REFUSALS.syncora };
  }

  // Check if specifically asking about TARK or Churn Reaper without Syncora context
  if ((clean.includes('tark') || clean.includes('pgvector') || clean.includes('crag') || clean.includes('churn reaper') || clean.includes('treeshap')) && !clean.includes('syncora')) {
    return { inScope: false, refusal: DOMAIN_REFUSALS.syncora };
  }

  const hasSyncoraKeyword = SYNCORA_IN_DOMAIN_KEYWORDS.some(kw => clean.includes(kw));
  if (hasSyncoraKeyword) {
    return { inScope: true };
  }

  const capabilityPatterns = [
    /how\s+does\s+(it|this|the\s+system|the\s+app|the\s+platform)\s+work/i,
    /what\s+can\s+(it|this|syncora|the\s+assistant)\s+do/i,
    /what\s+technologies\s+are\s+used/i,
    /explain\s+the\s+architecture/i,
    /how\s+is\s+it\s+built/i,
    /who\s+built\s+this/i,
    /features/i,
    /deployment/i
  ];

  if (capabilityPatterns.some(p => p.test(clean))) {
    return { inScope: true };
  }

  return { inScope: false, refusal: DOMAIN_REFUSALS.syncora };
}

/**
 * CHURN REAPER Domain Classifier
 */
const CHURN_IN_DOMAIN_KEYWORDS = [
  'churn', 'reaper', 'xgboost', 'treeshap', 'shap', 'explainability', 'retention', 'roi',
  'profit at risk', 'revenue at risk', 'clv', 'customer lifetime value', 'formula', 'telco',
  'auc', 'roc', 'recall', 'f1', 'precision', 'threshold', 'nemotron', 'discount', 'support',
  'contract', 'feature engineering', 'decision engine', 'fastapi', 'react', 'tailwind',
  'financial', 'profitability', 'intervention', 'predictive', 'customer', 'risk', 'pranit'
];

export function checkChurnScope(query) {
  if (!query || typeof query !== 'string') {
    return { inScope: false, refusal: DOMAIN_REFUSALS.churn };
  }
  const clean = query.trim().toLowerCase();

  if (GREETING_REGEX.test(clean)) {
    return { inScope: true, isGreeting: true };
  }

  if (isUniversalOutOfDomain(clean)) {
    return { inScope: false, refusal: DOMAIN_REFUSALS.churn };
  }

  // Check if specifically asking about unrelated projects without Churn context
  if ((clean.includes('tark') || clean.includes('webrtc') || clean.includes('syncora')) && !clean.includes('churn')) {
    return { inScope: false, refusal: DOMAIN_REFUSALS.churn };
  }

  const hasChurnKeyword = CHURN_IN_DOMAIN_KEYWORDS.some(kw => clean.includes(kw));
  if (hasChurnKeyword) {
    return { inScope: true };
  }

  const capabilityPatterns = [
    /how\s+does\s+(it|this|the\s+engine|the\s+system|the\s+model)\s+work/i,
    /what\s+can\s+(it|this|churn\s+reaper)\s+do/i,
    /explain\s+the\s+(model|pipeline|formulas|architecture)/i,
    /how\s+is\s+it\s+built/i,
    /metrics/i
  ];

  if (capabilityPatterns.some(p => p.test(clean))) {
    return { inScope: true };
  }

  return { inScope: false, refusal: DOMAIN_REFUSALS.churn };
}

/**
 * ASK PRANIT AI (Global Portfolio & Candidate Assistant) Classifier
 */
const PRANIT_IN_DOMAIN_KEYWORDS = [
  'pranit', 'kumar', 'portfolio', 'yourself', 'background', 'education', 'college', 'university',
  'bmsit', 'bms', 'cgpa', 'school', 'marks', 'percentage', 'cbse', '10th', '12th', 'study',
  'studying', 'degree', 'branch', 'b.e.', 'cse', 'computer science',
  // Skills & Tech
  'skill', 'skills', 'tech', 'stack', 'technologies', 'tools', 'languages', 'c++', 'python',
  'javascript', 'fastapi', 'node', 'express', 'react', 'postgres', 'postgresql', 'mongodb',
  'langchain', 'langgraph', 'rag', 'crag', 'vector', 'pgvector', 'socket.io', 'webrtc',
  'xgboost', 'treeshap', 'docker', 'git', 'github',
  // Experience & Internships
  'experience', 'internship', 'internships', 'velox', 'veloxcodeagency', 'successpath',
  'ieee', 'embs', 'webmaster', 'work', 'job', 'leadership',
  // Projects
  'project', 'projects', 'tark', 'syncora', 'churn', 'churn reaper', 'built', 'showcase',
  'mri', 'piezoelectric',
  // Achievements
  'award', 'awards', 'achievement', 'achievements', 'hackathon', 'sustainathon', 'prize',
  'innovation', 'certificate', 'certifications',
  // HR & Recruiter & Career & Behavioral
  'hire', 'hiring', 'fit', 'candidate', 'strengths', 'strength', 'weakness', 'weaknesses',
  'growth', 'improve', 'motivate', 'motivation', 'why ai', 'why software', 'why full-stack',
  'role', 'roles', 'looking for', 'proud', 'challenge', 'challenging', 'problem', 'solved',
  'went wrong', 'learn', 'debugging', 'prioritize', 'compare', 'best project', 'strongest project',
  'contact', 'email', 'phone', 'resume', 'linkedin', 'github', 'reach out', 'connect'
];

export function checkPranitScope(query) {
  if (!query || typeof query !== 'string') {
    return { inScope: false, refusal: DOMAIN_REFUSALS.pranit };
  }
  const clean = query.trim().toLowerCase();

  // Greetings
  if (GREETING_REGEX.test(clean)) {
    return { inScope: true, isGreeting: true };
  }

  // Prompt Injections are always rejected
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(clean)) {
      return { inScope: false, refusal: DOMAIN_REFUSALS.pranit };
    }
  }

  // Check for universal out of domain (e.g. cats, weather, quantum computing, Elon Musk)
  for (const pattern of UNIVERSAL_OUT_OF_DOMAIN_PATTERNS) {
    if (pattern.test(clean)) {
      return { inScope: false, refusal: DOMAIN_REFUSALS.pranit };
    }
  }

  // Check HR and Candidate question patterns
  const hrPatterns = [
    /tell\s+me\s+about\s+(yourself|you|pranit)/i,
    /who\s+(are\s+you|is\s+pranit)/i,
    /walk\s+me\s+through\s+(your|his)\s+background/i,
    /why\s+should\s+we\s+hire\s+(you|pranit|him)/i,
    /why\s+(are\s+you|is\s+pranit|is\s+he)\s+a\s+good\s+fit/i,
    /what\s+are\s+(your|his|pranit'?s?)\s+strengths/i,
    /what\s+are\s+(your|his|pranit'?s?)\s+weaknesses/i,
    /why\s+ai(\s+engineering)?/i,
    /why\s+(software|computer\s+science|full\s*stack)/i,
    /what\s+(kind\s+of\s+)?roles\s+(are\s+you|is\s+he)\s+looking\s+for/i,
    /which\s+project\s+(are\s+you|is\s+he)\s+(most\s+proud\s+of|strongest)/i,
    /what\s+has\s+(pranit|he|you)\s+(built|done)/i,
    /tell\s+me\s+about\s+(a\s+challenging|your\s+experience|his\s+experience)/i,
    /how\s+do\s+you\s+approach/i,
    /how\s+does\s+(pranit|he)\s+approach/i,
    /favorite\s+(movie|food|song|color|actor|game)/i
  ];

  for (const p of hrPatterns) {
    if (p.test(clean)) {
      return { inScope: true };
    }
  }

  // Check Pranit domain keywords
  const hasKeyword = PRANIT_IN_DOMAIN_KEYWORDS.some(kw => clean.includes(kw));
  if (hasKeyword) {
    return { inScope: true };
  }

  // Questions starting with "who", "what", "how", "tell me" that have no portfolio keywords are out-of-domain
  return { inScope: false, refusal: DOMAIN_REFUSALS.pranit };
}

/**
 * Universal dispatcher
 */
export function checkDomainScope(domain, query) {
  switch (domain) {
    case 'tark':
      return checkTarkScope(query);
    case 'syncora':
      return checkSyncoraScope(query);
    case 'churn':
      return checkChurnScope(query);
    case 'pranit':
    default:
      return checkPranitScope(query);
  }
}
