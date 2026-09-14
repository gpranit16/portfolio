import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Send, RefreshCw, X, Sparkles, FileText, Square, GripHorizontal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AMBER = '#C8820A';
const AMBER_LIGHT = '#D4960F';

// Custom Distinctive AI Intelligence Glyph (Abstract intelligence mark with orbit ring and nodes)
const AiGlyph = ({ size = 20, color = AMBER_LIGHT }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Subtle outer dashed orbit ring */}
    <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1" strokeOpacity="0.45" strokeDasharray="3 2" />
    {/* Central 4-point diamond spark nucleus */}
    <path
      d="M12 4L13.8 10.2L20 12L13.8 13.8L12 20L10.2 13.8L4 12L10.2 10.2L12 4Z"
      fill={color}
      fillOpacity="0.9"
    />
    {/* Core node */}
    <circle cx="12" cy="12" r="2.2" fill="#F5EFE0" />
    {/* 4 Connected orbit micro-nodes */}
    <circle cx="12" cy="2.5" r="1.2" fill={color} />
    <circle cx="21.5" cy="12" r="1.2" fill={color} />
    <circle cx="12" cy="21.5" r="1.2" fill={color} />
    <circle cx="2.5" cy="12" r="1.2" fill={color} />
  </svg>
);

interface SourceCitation {
  source: string;
  title: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceCitation[];
  isStreaming?: boolean;
}

const suggestedPrompts = [
  "Why should we hire Pranit?",
  "What are his strongest projects?",
  "What is TARK AI?",
  "What are his strongest AI skills?",
  "What roles is he looking for?",
];

interface ProjectAssistantModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialQuery?: string;
}

export default function ProjectAssistantModal({
  isOpen: controlledIsOpen,
  onOpenChange,
  initialQuery,
}: ProjectAssistantModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (onOpenChange) {
        onOpenChange(open);
      } else {
        setInternalIsOpen(open);
      }
    },
    [onOpenChange]
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "👋 **Hello! I'm Pranit's Portfolio Assistant.**\n\nAsk me about Pranit's skills, experience, projects (**TARK AI**, **Syncora**, **Churn Reaper**), education, or technical background.",
      sources: [],
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const dragControls = useDragControls();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setMessages(prev => prev.map(m => m.isStreaming ? { ...m, isStreaming: false } : m));
  };

  const handleSubmit = useCallback(async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || isLoading) return;

    setInput('');
    setError(null);

    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `assistant-${Date.now()}`;

    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: q,
    };

    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      isStreaming: true,
      sources: [],
    };

    // Clean conversation history for multi-turn context
    const historyPayload = messages
      .filter(m => m.id !== 'welcome')
      .slice(-6)
      .map(m => ({ role: m.role, content: m.content }));

    setMessages(prev => [...prev, userMsg, initialAssistantMsg]);
    setIsLoading(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const apiEndpoints = [
        '/api/pranit-assistant/chat',
        'http://localhost:3001/api/pranit-assistant/chat'
      ];

      let response: Response | null = null;

      for (const endpoint of apiEndpoints) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              question: q,
              history: historyPayload,
            }),
            signal: abortController.signal,
          });

          if (res.ok) {
            response = res;
            break;
          }
        } catch {
          // Try next endpoint
        }
      }

      if (!response || !response.ok) {
        throw new Error('Failed to connect to ASK PRANIT AI backend service.');
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported in response.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedText = '';
      let receivedSources: SourceCitation[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6).trim();
            if (dataStr === '[DONE]') continue;

            try {
              const event = JSON.parse(dataStr);
              if (event.type === 'sources' && Array.isArray(event.sources)) {
                receivedSources = event.sources;
                setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, sources: receivedSources } : m));
              } else if (event.type === 'delta' && typeof event.delta === 'string') {
                accumulatedText += event.delta;
                setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: accumulatedText } : m));
              } else if (event.type === 'error') {
                throw new Error(event.error || 'Assistant response error');
              }
            } catch {
              // Ignore partial JSON parse chunks
            }
          }
        }
      }

      setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, isStreaming: false } : m));
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('[ASK PRANIT AI] Request aborted by user');
        return;
      }

      console.warn('ASK PRANIT AI Server fallback engaged:', err);

      // Deterministic Verified Knowledge Fallback (Concise, structured, non-jargony)
      const lowerQ = q.toLowerCase();
      const isSecondPerson = lowerQ.includes('yourself') || lowerQ.includes('you ') || lowerQ.includes('your ');
      let fallbackText = '';
      let fallbackSources: SourceCitation[] = [];

      if (/^(hi|hii|hello|hey|namaste|hola|yo|greetings)/i.test(lowerQ)) {
        fallbackText = "👋 **Hello! I'm Pranit's Portfolio Assistant.**\n\nI can answer questions regarding:\n- **Candidate Profile** (Skills, B.E. at BMSIT&M, Internships at VeloxCodeAgency & SuccessPath)\n- **TARK AI** (Agentic AI Workspace, multi-model routing, RAG/CRAG, MCP tools)\n- **SYNCORA** (Real-time team collaboration, WebRTC video/audio, AI meeting intelligence)\n- **CHURN REAPER** (Machine learning, XGBoost, TreeSHAP explainability, retention ROI)\n\nWhat would you like to explore?";
        fallbackSources = [{ source: 'PORTFOLIO · Candidate Profile', title: 'Candidate Profile & Background' }];
      } else if (lowerQ.includes('yourself') || (lowerQ.includes('tell me') && lowerQ.includes('about you'))) {
        fallbackText = `I am a Computer Science undergraduate at BMSIT&M, Bengaluru (CGPA: 8.72), focused on engineering practical AI systems and full-stack software.

My core work centers on:
- **Agentic AI & Retrieval**: Building **TARK AI**, a personal OS with LangGraph, hybrid RAG/CRAG, pgvector, and 21 GitHub MCP tools.
- **Real-Time Full-Stack Systems**: Developing **Syncora**, a collaboration platform with Socket.io, WebRTC audio/video, and NVIDIA Nemotron meeting intelligence.
- **Applied Machine Learning**: Creating **Churn Reaper**, an XGBoost customer churn engine with TreeSHAP explainability and financial retention modeling.

I enjoy taking systems from architectural design to deployed, production-ready software.`;
        fallbackSources = [{ source: 'PORTFOLIO · Candidate Profile', title: 'Candidate Profile & Background' }];
      } else if (lowerQ.includes('why') && (lowerQ.includes('hire') || lowerQ.includes('hire him') || lowerQ.includes('good fit') || lowerQ.includes('choose'))) {
        if (isSecondPerson) {
          fallbackText = `### Why Hire Me?

My strongest edge is that I build both the AI models/agent workflows and the complete product around them:

- **AI Engineering Depth**: Built **TARK AI**, an Agentic AI workspace with dynamic multi-model LLM routing, hybrid RAG/CRAG with pgvector, and 21 GitHub MCP tools.
- **Full-Stack Execution**: Engineered **Syncora**, a real-time collaboration platform with Socket.io, WebRTC conferencing, and automated meeting minutes powered by NVIDIA Nemotron.
- **Applied Machine Learning**: Developed **Churn Reaper**, connecting XGBoost predictions with TreeSHAP explainability and Customer Lifetime Value (CLV) economics.
- **Proven Initiative**: B.E. in CSE at BMSIT&M (CGPA: 8.72), IEEE EMBS Webmaster, and National Sustainathon winner.`;
        } else {
          fallbackText = `### Why Hire Pranit Kumar?

Pranit's core edge is that he builds both the AI models/workflows and the complete full-stack product around them:

- **AI Engineering Depth**: Built **TARK AI**, an Agentic AI workspace with dynamic multi-model LLM routing, hybrid RAG/CRAG with pgvector, and 21 GitHub MCP tools.
- **Full-Stack Execution**: Engineered **Syncora**, a real-time collaboration platform with Socket.io, WebRTC conferencing, and NVIDIA Nemotron meeting intelligence.
- **Applied Machine Learning**: Developed **Churn Reaper**, connecting XGBoost predictions with TreeSHAP explainability and Customer Lifetime Value (CLV) economics.
- **Strong Foundation**: Computer Science undergraduate at BMSIT&M (CGPA: 8.72), IEEE EMBS Webmaster, and National Sustainathon winner.`;
        }
        fallbackSources = [{ source: 'PORTFOLIO · Candidate Evaluation', title: 'Why Hire Pranit / Candidate Value Proposition' }];
      } else if (lowerQ.includes('strength') || lowerQ.includes('weakness') || lowerQ.includes('best at') || lowerQ.includes('improve')) {
        fallbackText = `### Strengths & Growth Areas

**Top Strengths:**
1. **Agentic AI & RAG Architecture**: Proficient in LangGraph, hybrid sparse-dense retrieval (BM25 + pgvector), and Model Context Protocol (MCP) integrations (TARK AI).
2. **Full-Stack Product Delivery**: Delivers end-to-end applications from database schemas to reactive React frontends and low-latency APIs (Syncora).
3. **Applied ML & Explainability**: Connects predictive models (XGBoost) with business decision metrics via TreeSHAP (Churn Reaper).

**Growth Area:**
- Continues to deepen hands-on expertise in large-scale distributed systems orchestration and high-throughput multi-region database replication as systems scale.`;
        fallbackSources = [{ source: 'PORTFOLIO · Candidate Evaluation', title: 'Strengths & Growth Areas' }];
      } else if (lowerQ.includes('why ai') || lowerQ.includes('motivation') || lowerQ.includes('why software') || lowerQ.includes('why did')) {
        fallbackText = `### Career Motivation & Why AI

Pranit is motivated by transforming software from static tools into proactive, intelligent systems that can reason, synthesize knowledge, and perform real-world actions for users.

He aims to work in environments that prioritize technical rigor and product ownership, building practical AI systems and full-stack platforms that solve concrete user problems.`;
        fallbackSources = [{ source: 'PORTFOLIO · Career Direction', title: 'Career Direction, Motivation & Why AI' }];
      } else if (lowerQ.includes('strongest project') || lowerQ.includes('best project') || lowerQ.includes('most challenging') || (lowerQ.includes('which project') && lowerQ.includes('demonstrate'))) {
        fallbackText = `### Strongest Projects by Domain

- **Agentic AI & Systems**: **TARK AI** is his most technically challenging project, featuring dynamic multi-model LLM routing, hybrid RAG/CRAG, pgvector search, persistent 2-layer memory, and 21 GitHub MCP tools.
- **Real-Time Full-Stack**: **Syncora** demonstrates real-time communication at scale with Socket.io, WebRTC audio/video conferencing, and automated meeting intelligence.
- **Machine Learning**: **Churn Reaper** demonstrates applied ML with XGBoost tabular classification, TreeSHAP feature attribution, and customer retention economics.`;
        fallbackSources = [{ source: 'PORTFOLIO · Project Synthesis', title: 'Project Comparison & Domain Strengths' }];
      } else if (lowerQ.includes('challenge') || lowerQ.includes('problem') || lowerQ.includes('went wrong') || lowerQ.includes('how does he learn') || lowerQ.includes('debugging')) {
        fallbackText = `### Technical Problem Solving & Behavioral Context

- **Solving RAG Context Drift in TARK AI**: When standard RAG returned noisy chunks for complex queries, Pranit implemented Corrective RAG (CRAG) with query rewriting, evaluator scoring, and hybrid dense-sparse retrieval (BM25 + pgvector) to validate context before generation.
- **Low-Latency Signaling in Syncora**: To prevent meeting transcript processing from stalling high-throughput Socket.io chat events, he decoupled media signaling and offloaded transcription processing asynchronously.
- **Learning New Tech**: Learns by studying official specifications, RFCs, and building working prototypes rather than relying only on surface-level tutorials.`;
        fallbackSources = [{ source: 'PORTFOLIO · Engineering Approach', title: 'Behavioral Questions & Technical Problem Solving' }];
      } else if (lowerQ.includes('role') || lowerQ.includes('ai engineer') || lowerQ.includes('full-stack') || lowerQ.includes('looking for')) {
        fallbackText = `### Target Roles & Candidate Fit

Pranit brings a strong dual capability across AI and software engineering:
- **AI / GenAI Engineer**: Strong depth in LangGraph, hybrid RAG/CRAG, pgvector vector search, dynamic LLM routing, and MCP tool loops (demonstrated in **TARK AI**).
- **Full-Stack Developer**: High competence in React, FastAPI, Node.js/Express, PostgreSQL, Socket.io, and WebRTC (demonstrated in **Syncora**).
- **Applied ML Engineer**: Hands-on experience with XGBoost classification, TreeSHAP explainability, and financial metrics (demonstrated in **Churn Reaper**).`;
        fallbackSources = [{ source: 'PORTFOLIO · Career Direction', title: 'Career Direction, Motivation & Why AI' }];
      } else if (lowerQ.includes('tark')) {
        fallbackText = `### TARK AI — Agentic AI Workspace & Personal OS

TARK AI is Pranit's full-stack personal AI workspace designed for research, coding, and automated task execution:

- **Dynamic Multi-Model Routing**: Routes prompts dynamically between high-reasoning and fast models.
- **Hybrid RAG & CRAG**: Combines BM25 sparse search and pgvector semantic embeddings with active hallucination controls.
- **Persistent 2-Layer Memory**: Tracks session context alongside long-term semantic knowledge.
- **Real-World Tool Loops**: Authenticated integrations with Google Workspace and 21 GitHub MCP tools for automated scheduling and repo management.`;
        fallbackSources = [{ source: 'TARK AI · Architecture & RAG', title: 'TARK AI — Agentic AI Workspace & Personal OS' }];
      } else if (lowerQ.includes('syncora')) {
        fallbackText = `### SYNCORA — AI-Powered Team Collaboration Platform

Syncora is a real-time collaboration platform designed for modern engineering teams:

- **Real-Time Communication**: Socket.io channels, direct messaging, and MySQL relational integrity.
- **WebRTC Audio & Video**: Low-latency peer-to-peer conferencing and screen sharing.
- **AI Meeting Intelligence**: Powered by NVIDIA Nemotron to convert meeting transcripts into structured executive summaries, decisions, blockers, and assignable Kanban tasks.`;
        fallbackSources = [{ source: 'SYNCORA · Meeting Intelligence', title: 'SYNCORA — Team Collaboration Platform' }];
      } else if (lowerQ.includes('churn') || lowerQ.includes('ml') || lowerQ.includes('machine learning')) {
        fallbackText = `### CHURN REAPER — Customer Retention & Churn Intelligence

Churn Reaper is an applied ML platform that predicts customer churn and prescribes ROI-optimized retention interventions:

- **XGBoost Pipeline**: High-accuracy gradient-boosted classification with automated feature engineering.
- **TreeSHAP Explainability**: Provides mathematical attribution for why specific accounts are at risk (tenure, pricing changes, usage velocity).
- **Retention ROI Engine**: Deterministic financial model calculating CLV, expected profit-at-risk, and projected retention ROI.`;
        fallbackSources = [{ source: 'CHURN REAPER · Retention Engine', title: 'CHURN REAPER — Customer Retention & Churn Intelligence' }];
      } else if (lowerQ.includes('experience') || lowerQ.includes('internship') || lowerQ.includes('work') || lowerQ.includes('velox') || lowerQ.includes('successpath')) {
        fallbackText = `### Professional Experience & Internships

- **VeloxCodeAgency** — Full-Stack Development Intern *(01 Jun 2026 – 30 Jun 2026)*: Contributed to full-stack application development, debugging, and delivery. Verified certificate available in portfolio.
- **SuccessPath Classes (Remote)** — Full Stack Developer Intern *(19 Jan 2026 – 18 Feb 2026)*: Built application features across frontend and backend workflows. Verified certificate available in portfolio.
- **IEEE EMBS, BMSIT&M** — Webmaster (Leadership & College Community) *(Nov 2025 – Present)*: Leading web architecture, digital workflows, and engineered an AI-powered MRI verification system.`;
        fallbackSources = [{ source: 'RESUME · Experience', title: 'Professional Internships & Experience' }];
      } else if (lowerQ.includes('education') || lowerQ.includes('study') || lowerQ.includes('college') || lowerQ.includes('cgpa')) {
        fallbackText = `### Education & Academic Record

- **BMS Institute of Technology and Management (BMSIT&M), Bengaluru**
  - Bachelor of Engineering (B.E.) in Computer Science and Engineering
  - Duration: Sep 2024 – Sep 2028 | **CGPA: 8.72**

- **Ms Memorial Public School, India**
  - Higher Secondary Education (CBSE)
  - Duration: Apr 2022 – Apr 2024 | **Score: 91%**`;
        fallbackSources = [{ source: 'RESUME · Education', title: 'Education & Academic Record' }];
      } else if (lowerQ.includes('skill') || lowerQ.includes('tech') || lowerQ.includes('stack') || lowerQ.includes('language')) {
        fallbackText = `### Approved Technical Arsenal

- **Languages**: C, C++, Python, JavaScript
- **AI & GenAI**: LangChain, LangGraph, OpenAI SDK, RAG / CRAG, pgvector, Vector Search, Multi-Model Routing
- **Backend & Databases**: FastAPI, Node.js, Express.js, PostgreSQL, MongoDB, REST APIs
- **Machine Learning**: XGBoost, Scikit-Learn, TreeSHAP, Predictive Analytics, CLV Modeling
- **Real-Time & Media**: Socket.io, WebRTC, Server-Sent Events (SSE)
- **Infrastructure & Tools**: Docker, Git, GitHub, Vercel, Render, Postman`;
        fallbackSources = [{ source: 'PORTFOLIO · Technical Arsenal', title: 'Approved Technical Stack & Expertise' }];
      } else {
        const isOutOfScope =
          /\b(cat|cats|dog|dogs|animal|weather|elon\s+musk|joke|binary\s+search|quantum\s+computing|recipe|president|capital\s+of|continents)\b/i.test(lowerQ) ||
          lowerQ.startsWith('what is a ') ||
          (lowerQ.startsWith('who is ') && !lowerQ.includes('pranit'));

        if (isOutOfScope) {
          fallbackText = "I can answer questions about Pranit and his portfolio, but that question is outside my scope.";
          fallbackSources = [];
        } else {
          fallbackText = "I couldn't verify that from Pranit's portfolio context.";
          fallbackSources = [];
        }
      }

      setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: fallbackText, sources: fallbackSources, isStreaming: false } : m));
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [input, isLoading, messages]);

  useEffect(() => {
    const handleCustomOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ query?: string }>;
      setIsOpen(true);
      if (customEvent.detail?.query) {
        handleSubmit(customEvent.detail.query);
      }
    };

    window.addEventListener('open-project-assistant', handleCustomOpen);
    return () => window.removeEventListener('open-project-assistant', handleCustomOpen);
  }, [handleSubmit, setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim().length > 0) {
      setIsOpen(true);
      handleSubmit(initialQuery);
    }
  }, [initialQuery, handleSubmit, setIsOpen]);

  const handleClear = () => {
    handleStopGeneration();
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "✨ Chat reset! Ask me anything about Pranit's skills, background, projects, or why he is a strong candidate for your team.",
        sources: [],
      }
    ]);
    setError(null);
  };

  return (
    <>
      <style>{`
        .ask-pranit-markdown {
          font-family: 'Inter', sans-serif;
          color: #E8E1D5;
          font-size: 0.855rem;
          line-height: 1.65;
        }
        .ask-pranit-markdown h1,
        .ask-pranit-markdown h2,
        .ask-pranit-markdown h3 {
          font-family: 'Playfair Display', serif;
          color: #F5EFE0;
          margin-top: 0.75rem;
          margin-bottom: 0.35rem;
          font-weight: 700;
          letter-spacing: -0.01em;
        }
        .ask-pranit-markdown h1 { font-size: 1.15rem; }
        .ask-pranit-markdown h2 { font-size: 1.05rem; }
        .ask-pranit-markdown h3 { font-size: 0.95rem; }
        .ask-pranit-markdown p {
          margin: 0.35rem 0 0.5rem;
          line-height: 1.65;
          color: #E8E1D5;
        }
        .ask-pranit-markdown ul,
        .ask-pranit-markdown ol {
          margin: 0.35rem 0 0.6rem 1.15rem;
          padding: 0;
          color: #E8E1D5;
        }
        .ask-pranit-markdown li {
          margin-bottom: 0.3rem;
          line-height: 1.55;
        }
        .ask-pranit-markdown strong {
          color: #F5EFE0;
          font-weight: 600;
        }
        .ask-pranit-markdown code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          background: rgba(200, 130, 10, 0.12);
          color: #D4960F;
          padding: 2px 5px;
          border-radius: 3px;
          border: 1px solid rgba(200, 130, 10, 0.2);
        }
        .ask-pranit-markdown pre {
          background: #0E0D0B;
          border: 1px solid rgba(255, 248, 235, 0.1);
          border-radius: 6px;
          padding: 0.75rem;
          overflow-x: auto;
          margin: 0.5rem 0;
        }
        .ask-pranit-markdown pre code {
          background: transparent;
          border: none;
          padding: 0;
          color: #F5EFE0;
        }
        .ask-pranit-markdown a {
          color: #D4960F;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        /* Table rendering safeguard: prevents vertical column collapse */
        .ask-pranit-markdown table {
          width: 100%;
          border-collapse: collapse;
          margin: 0.75rem 0;
          font-size: 0.8rem;
          display: block;
          overflow-x: auto;
          white-space: nowrap;
        }
        .ask-pranit-markdown th,
        .ask-pranit-markdown td {
          padding: 6px 10px;
          border: 1px solid rgba(255, 248, 235, 0.1);
          text-align: left;
        }
        .ask-pranit-markdown th {
          background: #181612;
          color: #F5EFE0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          text-transform: uppercase;
        }
      `}</style>

      {/* ── Global Floating Trigger Launcher (ALWAYS VISIBLE "ASK PRANIT AI") ── */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9990,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {/* Floating Custom AI Glyph Pill Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: isOpen ? '0.75rem 1.15rem' : '0.75rem 1.35rem 0.75rem 1rem',
            borderRadius: '9999px',
            background: isOpen
              ? '#1A1814'
              : 'radial-gradient(circle at 35% 35%, #24201A 0%, #141310 100%)',
            border: `1.5px solid ${isOpen ? 'rgba(255, 248, 235, 0.25)' : 'rgba(200, 130, 10, 0.45)'}`,
            boxShadow: isOpen
              ? '0 8px 24px rgba(0, 0, 0, 0.8)'
              : '0 12px 32px rgba(0, 0, 0, 0.85), 0 0 18px rgba(200, 130, 10, 0.22)',
            color: '#F5EFE0',
            cursor: 'pointer',
            transition: 'border-color 200ms ease, box-shadow 200ms ease, background 200ms ease',
          }}
          aria-label={isOpen ? "Close ASK PRANIT AI" : "Open ASK PRANIT AI"}
        >
          {isOpen ? (
            <>
              <X size={18} color="#C8BFA8" />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#C8BFA8',
                }}
              >
                Close
              </span>
            </>
          ) : (
            <>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(200, 130, 10, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AiGlyph size={18} color={AMBER_LIGHT} />
              </div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#F5EFE0',
                }}
              >
                ASK PRANIT AI
              </span>
            </>
          )}
        </motion.button>
      </div>

      {/* ── Draggable Conversational Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag={!isMobile}
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            dragElastic={0.05}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              bottom: isMobile ? '0' : '88px',
              right: isMobile ? '0' : '24px',
              left: isMobile ? '0' : 'auto',
              width: isMobile ? '100vw' : 'min(500px, calc(100vw - 32px))',
              height: isMobile ? 'min(620px, calc(100vh - 40px))' : 'min(650px, calc(100vh - 100px))',
              maxHeight: isMobile ? '90vh' : '680px',
              zIndex: 9995,
              background: '#0E0D0B',
              border: isMobile ? 'none' : '1px solid rgba(255, 248, 235, 0.1)',
              borderTop: isMobile ? '1px solid rgba(200, 130, 10, 0.3)' : '1px solid rgba(255, 248, 235, 0.1)',
              borderRadius: isMobile ? '16px 16px 0 0' : '12px',
              boxShadow: '0 24px 64px -10px rgba(0, 0, 0, 0.96), 0 0 24px rgba(200, 130, 10, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header (Draggable Handle on Desktop) */}
            <div
              onPointerDown={(e) => {
                if (!isMobile) dragControls.start(e);
              }}
              style={{
                padding: '0.9rem 1.25rem',
                background: '#141310',
                borderBottom: '1px solid rgba(255, 248, 235, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: isMobile ? 'default' : 'grab',
                userSelect: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(200, 130, 10, 0.12)',
                    border: '1px solid rgba(200, 130, 10, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <AiGlyph size={18} color={AMBER_LIGHT} />
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#F5EFE0',
                      letterSpacing: '0.12em',
                      margin: 0,
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span>✦ ASK PRANIT AI</span>
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.72rem',
                      color: '#8A8070',
                      margin: '1px 0 0 0',
                    }}
                  >
                    Personal portfolio assistant
                  </p>
                </div>
              </div>

              {/* Header Right Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {!isMobile && (
                  <div
                    title="Drag window"
                    style={{
                      color: '#5A5248',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px',
                      cursor: 'grab',
                    }}
                  >
                    <GripHorizontal size={15} />
                  </div>
                )}

                {messages.length > 1 && (
                  <button
                    onClick={handleClear}
                    title="Reset Conversation"
                    disabled={isLoading}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#8A8070',
                      padding: '6px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 160ms ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#F5EFE0')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8070')}
                  >
                    <RefreshCw size={14} />
                  </button>
                )}

                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#8A8070',
                    padding: '6px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 160ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#F5EFE0')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8070')}
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Quick Suggestions Chips (when clean chat) */}
            {messages.length <= 1 && (
              <div
                style={{
                  padding: '0.85rem 1.25rem 0.35rem',
                  borderBottom: '1px solid rgba(255, 248, 235, 0.05)',
                  background: 'rgba(20, 19, 16, 0.4)',
                }}
              >
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.6rem',
                    color: '#8A8070',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                    fontWeight: 600,
                  }}
                >
                  SUGGESTED QUESTIONS:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSubmit(prompt)}
                      style={{
                        background: '#141310',
                        border: '1px solid rgba(255, 248, 235, 0.08)',
                        color: '#C8BFA8',
                        padding: '0.48rem 0.8rem',
                        borderRadius: '4px',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        transition: 'all 160ms ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(200, 130, 10, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(200, 130, 10, 0.35)';
                        e.currentTarget.style.color = '#F5EFE0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#141310';
                        e.currentTarget.style.borderColor = 'rgba(255, 248, 235, 0.08)';
                        e.currentTarget.style.color = '#C8BFA8';
                      }}
                    >
                      <span>{prompt}</span>
                      <Sparkles size={11} color={AMBER_LIGHT} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Feed Area */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    gap: '0.65rem',
                    alignItems: 'flex-start',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  }}
                >
                  {/* Small Avatar Marker */}
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      background: msg.role === 'user' ? 'rgba(200, 130, 10, 0.15)' : '#141310',
                      border: `1px solid ${msg.role === 'user' ? 'rgba(200, 130, 10, 0.35)' : 'rgba(255, 248, 235, 0.1)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '3px',
                    }}
                  >
                    {msg.role === 'user' ? (
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#F5EFE0', fontWeight: 700 }}>U</span>
                    ) : (
                      <AiGlyph size={14} color={AMBER_LIGHT} />
                    )}
                  </div>

                  {/* Message Bubble (Wide, Comfortable Line Length) */}
                  <div
                    style={{
                      maxWidth: msg.role === 'user' ? '82%' : '92%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        background: msg.role === 'user' ? '#221F18' : '#141310',
                        border: msg.role === 'user'
                          ? '1px solid rgba(200, 130, 10, 0.28)'
                          : '1px solid rgba(255, 248, 235, 0.08)',
                        borderRadius: '6px',
                        padding: '0.75rem 1rem',
                        color: msg.role === 'user' ? '#F5EFE0' : '#E8E1D5',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.855rem',
                        lineHeight: 1.65,
                        wordBreak: 'break-word',
                      }}
                    >
                      {msg.role === 'user' ? (
                        <span style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>
                      ) : (
                        <div className="ask-pranit-markdown">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      )}

                      {msg.isStreaming && (
                        <span
                          style={{
                            display: 'inline-block',
                            width: '4px',
                            height: '14px',
                            background: AMBER_LIGHT,
                            marginLeft: '4px',
                            verticalAlign: 'middle',
                            animation: 'pulse 1s infinite',
                          }}
                        />
                      )}
                    </div>

                    {/* Compact Source References */}
                    {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && !msg.isStreaming && (
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          gap: '0.35rem',
                          marginTop: '0.4rem',
                          paddingLeft: '0.2rem',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.55rem',
                            color: '#8A8070',
                            letterSpacing: '0.08em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          <FileText size={9} color={AMBER} />
                          SOURCES:
                        </span>
                        {msg.sources.slice(0, 2).map((s, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.55rem',
                              color: '#C8BFA8',
                              background: '#181612',
                              padding: '2px 6px',
                              borderRadius: '2px',
                              border: '1px solid rgba(255, 248, 235, 0.08)',
                            }}
                          >
                            {s.source}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Error Notification */}
            {error && (
              <div
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(239, 68, 68, 0.12)',
                  borderTop: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#FCA5A5',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.75rem',
                }}
              >
                {error}
              </div>
            )}

            {/* Input Form Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              style={{
                padding: '0.75rem 1rem',
                background: '#141310',
                borderTop: '1px solid rgba(255, 248, 235, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Pranit..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  background: '#0E0D0B',
                  border: '1px solid rgba(255, 248, 235, 0.1)',
                  borderRadius: '6px',
                  padding: '0.65rem 0.9rem',
                  color: '#F5EFE0',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.84rem',
                  outline: 'none',
                  transition: 'border-color 160ms ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(200, 130, 10, 0.5)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 248, 235, 0.1)')}
              />

              {isLoading ? (
                <button
                  type="button"
                  onClick={handleStopGeneration}
                  title="Stop generation"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    background: 'rgba(200, 130, 10, 0.15)',
                    color: AMBER_LIGHT,
                    border: '1px solid rgba(200, 130, 10, 0.35)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 160ms ease',
                  }}
                  aria-label="Stop generation"
                >
                  <Square size={12} fill={AMBER_LIGHT} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    background: input.trim() ? AMBER : 'rgba(255, 248, 235, 0.06)',
                    color: input.trim() ? '#0E0D0B' : '#5A5248',
                    border: 'none',
                    cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 160ms ease',
                  }}
                  aria-label="Send message"
                >
                  <Send size={13} />
                </button>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
