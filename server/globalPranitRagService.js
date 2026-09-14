// server/globalPranitRagService.js
// Verified Knowledge Base & RAG retrieval for the Global "ASK PRANIT AI" Assistant.

export const PRANIT_GLOBAL_KNOWLEDGE = [
  {
    id: 'candidate-profile',
    category: 'PROFILE',
    title: 'Candidate Profile & Background',
    source: 'PORTFOLIO · Candidate Profile',
    keywords: ['who is pranit', 'tell me about pranit', 'about pranit', 'bio', 'background', 'profile', 'pranit kumar', 'introduction', 'summary', 'tell me about yourself', 'walk me through your background', 'who are you', 'currently doing'],
    content: `PRANIT KUMAR — CANDIDATE OVERVIEW & INTRODUCTION:
- Academic Foundation: Computer Science and Engineering undergraduate at BMS Institute of Technology and Management (BMSIT&M), Bengaluru (Sep 2024 – Sep 2028, CGPA: 8.72). Completed CBSE Higher Secondary with 91% at Ms Memorial Public School.
- Engineering Focus: Specializes in turning complex software challenges into deployed, real-world systems spanning Agentic AI architectures, hybrid RAG/CRAG pipelines, and high-concurrency full-stack platforms.
- Core Edge: Builds both the AI logic (LangGraph, multi-model routing, pgvector) and the complete production application around it (FastAPI, React, WebRTC, Socket.io).
- Contact: guptapranit34@gmail.com | +91-9508746855 | Bengaluru, India | LinkedIn: linkedin.com/in/pranit-kumar-378342357 | GitHub: github.com/gpranit16.`
  },
  {
    id: 'candidate-education',
    category: 'EDUCATION',
    title: 'Education & Academic Record',
    source: 'RESUME · Education',
    keywords: ['education', 'degree', 'college', 'university', 'bmsit', 'cgpa', 'school', 'marks', 'percentage', 'studying', 'year', 'branch', 'academic'],
    content: `EDUCATION & ACADEMICS:
1. BMS Institute of Technology and Management (BMSIT&M), Bengaluru, India
   - Degree: Bachelor of Engineering (B.E.) in Computer Science and Engineering
   - Duration: Sep 2024 – Sep 2028 | CGPA: 8.72
2. Ms Memorial Public School, India
   - Higher Secondary Education (CBSE)
   - Duration: Apr 2022 – Apr 2024 | Percentage: 91%`
  },
  {
    id: 'approved-tech-stack',
    category: 'SKILLS',
    title: 'Approved Technical Stack & Expertise',
    source: 'PORTFOLIO · Technical Arsenal',
    keywords: ['skills', 'tech stack', 'technologies', 'tools', 'languages', 'python', 'javascript', 'c++', 'fastapi', 'react', 'docker', 'postgresql', 'mongodb', 'langchain', 'langgraph', 'rag', 'crag', 'vector search', 'expertise'],
    content: `TECHNICAL SKILLS & ARSENAL:
- Programming Languages: C, C++, Python, JavaScript
- AI & Agentic Frameworks: LangChain, LangGraph, OpenAI SDK, RAG (Retrieval-Augmented Generation), CRAG (Corrective RAG), Embeddings, Vector Search, pgvector, Multi-Model LLM Routing, Agentic Tool Loops, Memory Architecture
- Backend & Data: FastAPI, Node.js, Express.js, PostgreSQL, MongoDB, pgvector, REST APIs
- Machine Learning & Analytics: XGBoost, Scikit-Learn, TreeSHAP (Feature Attribution & Explainability), Predictive Analytics, Customer Retention Modeling, Financial Decision Support
- Real-Time & Media Systems: WebRTC (Audio/Video peer-to-peer), Socket.io (Bi-directional event streaming), Server-Sent Events (SSE real-time streaming)
- Infrastructure & Developer Tools: Docker, Git, GitHub, Vercel, Render, Postman
- NOTE ON CONSTRAINTS: Only the verified technologies above are part of Pranit's approved portfolio technical stack.`
  },
  {
    id: 'internships-experience',
    category: 'EXPERIENCE',
    title: 'Professional Internships & Experience',
    source: 'RESUME · Experience',
    keywords: ['experience', 'internships', 'velox', 'veloxcodagency', 'successpath', 'successpath classes', 'work history', 'jobs', 'roles', 'intern', 'learned from experience'],
    content: `PROFESSIONAL EXPERIENCE & INTERNSHIPS:
1. Full-Stack Development Intern — VeloxCodeAgency
   - Period: 01 Jun 2026 — 30 Jun 2026
   - Focus: Worked across full-stack development workflows during a focused internship, contributing to project implementation, feature development, debugging, and delivery. Verified certificate available in portfolio.
2. Full Stack Developer (Intern) — SuccessPath Classes (Remote)
   - Period: 19 Jan 2026 — 18 Feb 2026
   - Focus: Contributed to full-stack development work across feature implementation, debugging, and deployment workflows. Verified certificate available in portfolio.
3. Webmaster (Leadership & College Community) — IEEE EMBS, BMSIT&M
   - Period: Nov 2025 — Present
   - Role: Leading digital presence and web architecture for IEEE EMBS; developed an AI-powered MRI verification system using AI/ML and image processing.`
  },
  {
    id: 'project-tark-ai',
    category: 'PROJECTS',
    title: 'TARK AI — Agentic AI Workspace & Personal OS',
    source: 'TARK AI · Architecture & RAG',
    keywords: ['tark', 'tark ai', 'agentic', 'personal os', 'crag', 'rag', 'mcp', 'tools', 'google calendar', 'github mcp', 'memory', 'routing', 'deep research', 'sse', 'chatbot'],
    content: `PROJECT 01: TARK AI — Agentic AI Workspace & Personal OS
- Identity: Agentic AI / Personal OS / Multi-Model LLM Routing / RAG & CRAG / Tool Loops
- Purpose: A full-stack Agentic AI Workspace and Personal OS engineered for conversational AI, real-time web search, Deep Research, code execution assistance, multimodal document understanding, and real-world task execution.
- Key Capabilities:
  1. Multi-Model LLM Routing: Dynamically routes prompts between high-reasoning models and fast-inference models based on task complexity.
  2. RAG & CRAG (Corrective RAG): Hybrid retrieval combining BM25 keyword search, semantic embeddings, pgvector reranking, query rewriting, and active hallucination validation controls.
  3. 2-Layer Persistent Memory: Maintains short-term conversational context and long-term semantic knowledge per user.
  4. Real-World Tool Actions: Deeply integrated with OAuth-gated Google Workspace (Google Calendar, Tasks, Reminders, Goals) and 21 GitHub MCP tools.
- Stack: React, Python, FastAPI, PostgreSQL, pgvector, LangGraph, LLM APIs, Model Context Protocol (MCP), Docker.`
  },
  {
    id: 'project-syncora',
    category: 'PROJECTS',
    title: 'SYNCORA — AI-Powered Team Collaboration & Productivity Platform',
    source: 'SYNCORA · Meeting Intelligence',
    keywords: ['syncora', 'collaboration', 'messaging', 'webrtc', 'socket.io', 'nemotron', 'meeting intelligence', 'summaries', 'transcripts', 'kanban', 'tasks', 'real-time'],
    content: `PROJECT 02: SYNCORA — AI-Powered Team Collaboration & Productivity Platform
- Identity: Real-Time Communication / Team Collaboration / Meeting Intelligence / Full-Stack Systems
- Purpose: A full-stack team collaboration platform uniting real-time channel & direct messaging, WebRTC audio/video meetings, Kanban task boards, and AI-assisted meeting intelligence into a single cohesive workspace.
- Key Capabilities:
  1. High-Concurrency Messaging: Bi-directional event streaming via Socket.io, JWT-based authentication, Role-Based Access Control (RBAC), and MySQL data integrity.
  2. WebRTC Audio/Video: Peer-to-peer real-time conferencing with low-latency media signaling and screen-sharing support.
  3. AI Meeting Intelligence Pipeline: Powered by NVIDIA Nemotron LLM; converts meeting transcripts and chat logs into structured summaries, decisions, blockers, and auto-generates assignable Kanban tasks.
- Stack: React, Node.js, Express, MySQL, Socket.io, WebRTC, NVIDIA Nemotron LLM, REST APIs, JWT.`
  },
  {
    id: 'project-churn-reaper',
    category: 'PROJECTS',
    title: 'CHURN REAPER — Customer Retention & Churn Intelligence System',
    source: 'CHURN REAPER · Retention Engine',
    keywords: ['churn reaper', 'churn', 'machine learning', 'ml', 'xgboost', 'treeshap', 'explainability', 'retention', 'clv', 'profit at risk', 'roi', 'financial model'],
    content: `PROJECT 03: CHURN REAPER — Customer Retention & Churn Intelligence System
- Identity: Applied Machine Learning / Predictive Analytics / TreeSHAP Explainability / Financial Decision Modeling
- Purpose: An end-to-end customer churn intelligence platform that ingests behavioral and transactional customer data to predict churn risk, diagnose underlying root causes, and prescribe ROI-optimized retention strategies.
- Key Capabilities:
  1. XGBoost Classification Pipeline: High-accuracy gradient-boosted tree model trained with automated data preprocessing and feature engineering.
  2. TreeSHAP Mathematical Explainability: Generates local and global feature attribution for every customer, showing exactly why an account is at risk (tenure, pricing changes, usage velocity).
  3. AI-Assisted Retention Engine: Integrates deterministic financial models calculating Customer Lifetime Value (CLV), expected profit-at-risk, and net projected ROI for tailored retention offers.
- Stack: Python, FastAPI, XGBoost, Scikit-Learn, TreeSHAP, NVIDIA Nemotron LLM, React, Tailwind CSS.`
  },
  {
    id: 'recruiter-why-hire',
    category: 'RECRUITER',
    title: 'Why Hire Pranit / Candidate Value Proposition',
    source: 'PORTFOLIO · Candidate Evaluation',
    keywords: ['why hire', 'why should we hire', 'why hire pranit', 'why hire you', 'value', 'fit', 'strengths', 'stand out', 'different', 'candidate', 'recruiter', 'hire him', 'why choose', 'what differentiates'],
    content: `WHY HIRE PRANIT KUMAR:
1. Deep AI Engineering Foundation:
   - Built production-grade Agentic AI architectures, multi-model LLM routing, hybrid RAG/CRAG pipelines with pgvector, and tool-calling systems (TARK AI).
2. End-to-End Full-Stack Systems:
   - Builds complete applications from frontend to backend with real-time Socket.io streaming, WebRTC conferencing, FastAPI, Express, and PostgreSQL/MySQL (Syncora).
3. Machine Learning & Business Economics:
   - Connects predictive ML models (XGBoost) with explainability (TreeSHAP) and Customer Lifetime Value (CLV) economics (Churn Reaper).
4. Authentic Systems Over Demos:
   - Implements OAuth authentication, granular MCP permission gating, Docker containerization, and structured APIs.
5. High Agility & Academic Record:
   - B.E. in CSE at BMSIT&M (CGPA: 8.72), IEEE EMBS Webmaster, National Sustainathon 3rd place winner, and Best Innovation Award recipient at Agentic AI Sprint Hackathon.`
  },
  {
    id: 'strengths-growth-areas',
    category: 'RECRUITER',
    title: 'Strengths & Growth Areas',
    source: 'PORTFOLIO · Candidate Evaluation',
    keywords: ['strengths', 'weaknesses', 'growth areas', 'best at', 'biggest strength', 'areas improving', 'where improve', 'weakness'],
    content: `STRENGTHS & GROWTH AREAS:
- Core Strengths:
  1. AI & Agentic Systems Architecture: High competence in LangGraph, hybrid RAG/CRAG, pgvector vector search, and Model Context Protocol (MCP) integrations.
  2. Full-Stack Product Delivery: Able to take an idea from system design and database schemas to reactive UI and deployed infrastructure.
  3. Practical ML & Explainability: Deep understanding of bridging predictive ML models with business decision support.
- Growth Areas (Grounded & Authentic):
  Pranit continues to deepen his expertise in large-scale distributed systems orchestration and high-throughput multi-region database replication as he transitions his applications to larger enterprise multi-tenant scales.`
  },
  {
    id: 'career-motivation',
    category: 'RECRUITER',
    title: 'Career Direction, Motivation & Why AI',
    source: 'PORTFOLIO · Career Direction',
    keywords: ['why ai', 'why software engineering', 'why computer science', 'motivation', 'motivate', 'roles looking for', 'career direction', 'interests', 'what kind of work', 'environment suits'],
    content: `CAREER MOTIVATION & TARGET ROLES:
- Why AI & Software Engineering:
  Pranit is driven by turning software from static tools into proactive, intelligent systems that can reason, synthesize knowledge, and perform real-world actions for users.
- Target Positions:
  1. AI Engineer / GenAI Engineer (LangGraph, RAG/CRAG, LLM routing, vector retrieval).
  2. Full-Stack Developer (React, FastAPI, Node.js/Express, PostgreSQL, Socket.io).
  3. Intelligent Systems / Applied ML Engineer (predictive modeling, explainability, real-time data).
- Work Environment: Thrives in high-ownership, product-focused teams that value shipping working software with technical rigor.`
  },
  {
    id: 'behavioral-problem-solving',
    category: 'BEHAVIORAL',
    title: 'Behavioral Questions & Technical Problem Solving (STAR)',
    source: 'PORTFOLIO · Engineering Approach',
    keywords: ['challenging project', 'problem solved', 'something went wrong', 'approach problems', 'learn new technologies', 'ambiguity', 'debugging', 'prioritize', 'star'],
    content: `BEHAVIORAL & PROBLEM SOLVING EXAMPLES (STAR SYNTHESIS):
1. Solving RAG Hallucination & Context Drift (TARK AI):
   - Challenge: Early RAG setups returned irrelevant chunks when user queries were vague or multi-intent.
   - Action: Architected a Corrective RAG (CRAG) pipeline with query rewriting, dynamic evaluator scoring, and hybrid dense-sparse retrieval (BM25 + pgvector).
   - Result: Significantly improved context accuracy and enabled reliable tool execution across Google Workspace and GitHub.
2. Low-Latency Real-Time Signaling (Syncora):
   - Challenge: Coordinating WebRTC peer connections and real-time meeting transcription without blocking high-volume Socket.io chat events.
   - Action: Separated media signaling from chat event loops and implemented asynchronous background transcript chunk processing with NVIDIA Nemotron.
   - Result: Low-latency video calling and automatic generation of structured Kanban tasks from meeting summaries.
3. How He Learns New Technologies:
   - Focuses on official specifications, RFCs, and building working production prototypes (e.g. Model Context Protocol, WebRTC, LangGraph) rather than relying solely on tutorials.`
  },
  {
    id: 'project-comparisons',
    category: 'PROJECTS',
    title: 'Project Comparison & Domain Strengths',
    source: 'PORTFOLIO · Project Synthesis',
    keywords: ['compare', 'difference between', 'which project', 'strongest project', 'best project', 'tark vs syncora', 'ml project', 'genai project', 'real time project', 'what has he built', 'built'],
    content: `PROJECT COMPARISONS & DOMAIN STRENGTHS:
- Strongest AI / Agentic Project: TARK AI — Autonomous tool loops, multi-model routing, hybrid RAG/CRAG, pgvector search, persistent 2-layer memory, and 21 GitHub MCP tools.
- Strongest Real-Time / Full-Stack Project: SYNCORA — Multi-user collaboration with Socket.io, WebRTC audio/video meetings, Kanban boards, and meeting transcript intelligence.
- Strongest Machine Learning Project: CHURN REAPER — Gradient-boosted tabular classification (XGBoost), TreeSHAP feature attribution, and deterministic financial retention modeling.

Summary:
- TARK AI = Personal AI OS / Agentic Workspace for research, coding, and tools.
- SYNCORA = Team collaboration platform for real-time messaging, video meetings, and automated minutes.
- CHURN REAPER = Predictive ML system for enterprise customer retention and churn diagnosis.`
  },
  {
    id: 'achievements-awards',
    category: 'ACHIEVEMENTS',
    title: 'Hackathons, Awards & Recognition',
    source: 'RESUME · Achievements',
    keywords: ['achievements', 'awards', 'hackathon', 'sustainathon', 'prize', 'winner', 'best innovation', 'genai club', 'recognition', 'piezoelectric'],
    content: `AWARDS & RECOGNITIONS:
1. Best Innovation Award — Agentic AI Sprint Workshop + Hackathon
   - Organized by GenAI Club, BMSIT&M. Recognized for innovation in AI agent systems and intelligent automation engineering.
2. 3rd Place & ₹10,000 Cash Prize — National-Level Sustainathon
   - Secured 3rd place nationwide for developing a piezoelectric energy-harvesting system.
3. Project Recognition for Churn Reaper
   - Commended for engineering an AI-powered customer churn prediction engine with applied financial analytics.`
  }
];

// Tokenizer & Stopwords
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'this', 'they', 'have', 'had', 'what', 'when',
  'where', 'who', 'which', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
  'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'can', 'just', 'should', 'now',
  'tell', 'me', 'about', 'explain', 'give', 'does', 'work', 'pranit'
]);

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOPWORDS.has(t));
}

export function retrieveGlobalPranitChunks(query, topK = 4) {
  if (!query || typeof query !== 'string') {
    return { chunks: [], sources: [] };
  }

  const cleanQuery = query.trim().toLowerCase();
  const tokens = tokenize(cleanQuery);

  const scored = PRANIT_GLOBAL_KNOWLEDGE.map(item => {
    let score = 0;
    const itemText = (item.title + ' ' + item.category + ' ' + item.content + ' ' + item.keywords.join(' ')).toLowerCase();

    for (const kw of item.keywords) {
      if (cleanQuery.includes(kw)) {
        score += 9.0;
      }
    }

    for (const token of tokens) {
      if (itemText.includes(token)) {
        score += 2.5;
      }
      if (item.title.toLowerCase().includes(token)) {
        score += 3.5;
      }
    }

    // Specific intent boosts
    if ((cleanQuery.includes('hire') || cleanQuery.includes('why should') || cleanQuery.includes('candidate')) && item.id === 'recruiter-why-hire') {
      score += 12.0;
    }
    if ((cleanQuery.includes('strength') || cleanQuery.includes('weakness') || cleanQuery.includes('best at')) && item.id === 'strengths-growth-areas') {
      score += 12.0;
    }
    if ((cleanQuery.includes('why ai') || cleanQuery.includes('motivation') || cleanQuery.includes('role')) && item.id === 'career-motivation') {
      score += 12.0;
    }
    if ((cleanQuery.includes('challenge') || cleanQuery.includes('problem') || cleanQuery.includes('approach') || cleanQuery.includes('learn')) && item.id === 'behavioral-problem-solving') {
      score += 12.0;
    }
    if ((cleanQuery.includes('yourself') || cleanQuery.includes('who is') || cleanQuery.includes('background') || cleanQuery.includes('introduction')) && item.id === 'candidate-profile') {
      score += 12.0;
    }
    if ((cleanQuery.includes('tark') || cleanQuery.includes('agentic')) && item.id === 'project-tark-ai') {
      score += 10.0;
    }
    if ((cleanQuery.includes('syncora') || cleanQuery.includes('meeting') || cleanQuery.includes('collab')) && item.id === 'project-syncora') {
      score += 10.0;
    }
    if ((cleanQuery.includes('churn') || cleanQuery.includes('ml') || cleanQuery.includes('xgboost')) && item.id === 'project-churn-reaper') {
      score += 10.0;
    }
    if ((cleanQuery.includes('intern') || cleanQuery.includes('experience') || cleanQuery.includes('velox') || cleanQuery.includes('successpath')) && item.id === 'internships-experience') {
      score += 10.0;
    }

    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const topResults = scored.filter(s => s.score > 0).slice(0, topK).map(s => s.item);
  const finalChunks = topResults.length > 0 ? topResults : PRANIT_GLOBAL_KNOWLEDGE.slice(0, 3);

  const sources = finalChunks.map(c => ({
    title: c.title,
    source: c.source,
  }));

  return { chunks: finalChunks, sources };
}

/**
 * System prompt generator for the Global "ASK PRANIT AI" Assistant
 */
export function buildGlobalPranitSystemPrompt(retrievedChunks) {
  const contextBlock = retrievedChunks.length > 0
    ? retrievedChunks.map((c, i) => `[VERIFIED CONTEXT ${i + 1}: ${c.title} (${c.source})]\n${c.content}`).join('\n\n')
    : 'No specific context retrieved. Rely strictly on verified portfolio facts.';

  return `You are "ASK PRANIT AI", the intelligent candidate and portfolio assistant for Pranit Kumar.

MISSION:
Intelligently handle common HR, recruiter, behavioral, career, and candidate-evaluation questions naturally using verified portfolio context.

CRITICAL INTENT & PERSPECTIVE RULES:
1. DYNAMIC PERSPECTIVE:
   - If the user asks in second-person ("Tell me about yourself", "Why should we hire you?", "What are your strengths?"), answer in natural FIRST-PERSON ("I am...", "My strongest advantage is...").
   - If the user asks in third-person ("Tell me about Pranit", "Why should we hire Pranit?"), answer in THIRD-PERSON ("Pranit is...", "Pranit's strongest edge is...").
   - Do NOT mix perspectives awkwardly.

2. CONCISE & STRUCTURED LENGTH CONTROL:
   - Default HR / Recruiter answer: 60–130 words.
   - "Tell me about yourself": 100–140 words (Education + Current focus + Core edge + Projects).
   - "Why should we hire you/him?": 80–120 words (Lead with the conclusion, followed by 3 concise supporting bullets connecting TARK, Syncora, Churn Reaper).
   - Strengths / Weaknesses: 60–100 words (3 concrete strengths; growth areas framed as scaling distributed architecture).
   - Behavioral / Situational: Concise STAR-style flow (Context → Action → Result) without explicitly labeling letters.
   - Simple factual question: 20–50 words.
   - DO NOT write huge walls of text. Keep answers scannable and punchy.

3. NATURAL TONE & NO JARGON STACKING:
   - Sound like an informed, technically sharp engineering candidate or assistant.
   - Avoid buzzwords ("world-class", "visionary", "rare blend").
   - DO NOT generate markdown tables unless specifically requested. Use clean bullet points.
   - NEVER start with robotic filler like "As an AI assistant..." or "Sure, I can help with that...". Answer directly.

4. STRICT TRUTH & ANTI-HALLUCINATION:
   - Use ONLY verified portfolio facts.
   - If asked about unverified details (e.g. favorite movie, salary expectations, unverified companies):
     Explicitly say: "I couldn't verify that from Pranit's portfolio context."

5. DISTINCT PROJECT IDENTITIES:
   - TARK AI: Agentic AI Workspace & Personal OS (LangGraph, hybrid RAG/CRAG, pgvector, multi-model LLM routing, 2-layer memory, Google Workspace + 21 GitHub MCP tools).
   - SYNCORA: Real-time team collaboration platform (Node.js, Express, MySQL, Socket.io, WebRTC conferencing, NVIDIA Nemotron meeting intelligence to Kanban).
   - CHURN REAPER: Applied ML customer retention system (XGBoost tabular classification, TreeSHAP feature attribution, deterministic CLV & retention ROI modeling).

6. APPROVED TECH STACK:
   - Languages: C, C++, Python, JavaScript.
   - AI / GenAI: LangChain, LangGraph, OpenAI SDK, RAG / CRAG, Embeddings, Vector Search, pgvector.
   - Backend & Databases: FastAPI, Node.js, Express.js, PostgreSQL, MongoDB, REST APIs.
   - Real-Time & ML: Socket.io, WebRTC, XGBoost, Scikit-Learn, TreeSHAP.
   - (Do NOT claim TypeScript or CrewAI as part of the approved stack).

VERIFIED KNOWLEDGE RETRIEVED:
==================================================
${contextBlock}
==================================================`;
}
