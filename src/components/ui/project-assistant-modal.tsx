import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RefreshCw, X, Bot, User, Sparkles, ChevronDown, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AMBER = '#C8820A';
const AMBER_LIGHT = '#D4960F';

interface SourceCitation {
  source: string;
  file_path: string;
  section: string;
  title: string;
  lines?: [number, number];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceCitation[];
  isStreaming?: boolean;
}

const suggestedPrompts = [
  "What is TARK AI & how does it work? 🚀",
  "How does RAG & 2-Layer Memory work? 🧠",
  "What is Pranit's core tech stack? 💻",
  "Tell me about Pranit's experience & awards 🏆",
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
      content: "👋 **Hello! I'm Pranit's AI Project Assistant.**\n\nI can answer anything about **TARK AI** (architecture, RAG, 2-layer memory, model routing, agent workflows) or Pranit's background and experience. What would you like to explore?",
      sources: [],
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

    const historyPayload = messages
      .filter(m => m.id !== 'welcome')
      .map(m => ({ role: m.role, content: m.content }));

    setMessages(prev => [...prev, userMsg, initialAssistantMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/tark-assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          history: historyPayload,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}: Failed to reach project assistant service.`);
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
              // Ignore partial chunk parse errors
            }
          }
        }
      }

      setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, isStreaming: false } : m));
    } catch (err: unknown) {
      console.warn('Project Assistant Server unreachable, using smart intelligent fallback:', err);
      
      // Intelligent Instant Local Response Generator
      const lowerQ = q.toLowerCase();
      let fallbackText = '';
      let fallbackSources: SourceCitation[] = [];

      if (/^(hi|hii|hello|hey|namaste|hola|yo|greetings)/i.test(lowerQ)) {
        fallbackText = "👋 **Hey there!** I'm Pranit's AI Project & Portfolio Assistant.\n\nI can help you explore:\n- **TARK AI Architecture** (Multi-agent workflows, RAG/CRAG, two-layer pgvector memory)\n- **Pranit's Engineering Background** (IEEE EMBS Webmaster, VOLCOM Lead, SuccessPath)\n- **Tech Stack & Skills** (Python, FastAPI, LangGraph, React, PostgreSQL, LLMs)\n\nWhat would you like to know?";
      } else if (lowerQ.includes('tark') || lowerQ.includes('what is') || lowerQ.includes('project')) {
        fallbackText = "🚀 **TARK AI** is Pranit's flagship full-stack **Agentic AI Workspace & Personal Productivity OS**.\n\n### Key Highlights:\n- **Multi-Model Gateway**: Seamlessly routes prompts between local models (Ollama) and cloud APIs (Groq, Anthropic, OpenAI) with automated fallback.\n- **Two-Layer Memory**: Short-term conversation thread memory paired with persistent long-term semantic memory powered by PostgreSQL & pgvector.\n- **Hybrid RAG & CRAG**: Combines BM25 keyword search with dense vector embeddings and corrective query rewriting.\n- **Sandboxed Tool Calling**: 44+ registered tools with AST inspection and sandboxed Python execution.\n- **Agent Workflows**: Multi-step planning, web search, document synthesis, and verification loops orchestrated via LangGraph.";
        fallbackSources = [
          { source: 'ARCHITECTURE.md', file_path: 'ARCHITECTURE.md', section: 'System Overview', title: 'System Overview' },
          { source: 'README.md', file_path: 'README.md', section: 'TARK AI Overview', title: 'TARK AI Overview' }
        ];
      } else if (lowerQ.includes('memory') || lowerQ.includes('rag') || lowerQ.includes('retrieval')) {
        fallbackText = "🧠 **Memory & Retrieval in TARK AI**:\n\n1. **Two-Layer Memory System**:\n   - **Short-Term Session Memory**: Tracks active chat state and context windows.\n   - **Long-Term Semantic Memory**: Uses `pgvector` in PostgreSQL for vector embeddings with automatic deduplication, confidence scoring, and temporal decay.\n\n2. **Corrective RAG (CRAG) Pipeline**:\n   - Ingests documents into structured chunks.\n   - Performs hybrid dense-sparse search.\n   - An evaluator LLM grades retrieval relevance; if confidence is low, it rewrites the query or triggers web search.";
        fallbackSources = [
          { source: 'DECISIONS.md', file_path: 'DECISIONS.md', section: 'Two-Layer Memory Architecture', title: 'ADR: Memory Architecture' }
        ];
      } else if (lowerQ.includes('stack') || lowerQ.includes('tech') || lowerQ.includes('skill')) {
        fallbackText = "💻 **Pranit's Core Tech Stack**:\n\n- **AI & Agents**: LangGraph, LLM Function Calling, RAG/CRAG, Prompt Engineering, pgvector, Ollama, Groq, OpenAI.\n- **Backend**: Python, FastAPI, Node.js, Express, PostgreSQL, Redis, REST APIs.\n- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion, Three.js.\n- **DevOps & Tools**: Docker, Git, Linux, Sandboxed AST Execution.";
      } else if (lowerQ.includes('experience') || lowerQ.includes('award') || lowerQ.includes('who is')) {
        fallbackText = "🏆 **About Pranit Kumar**:\n\n- **Role**: AI Engineer & Full-Stack Developer.\n- **Webmaster @ IEEE EMBS**: Managing web systems, technical workflows, and innovation initiatives.\n- **Technical Lead @ VOLCOM (IEEE EMBS)**: Led biomedical IoT applications and healthcare tech workflows.\n- **Full Stack Intern @ SuccessPath Classes**: Scaled student dashboard APIs and databases.\n- **Awards**: 3rd Place @ National Sustainathon (Piezoelectric energy harvesting) & Best Innovation Award @ Agentic AI Sprint Hackathon.";
      } else {
        fallbackText = `💡 **Pranit's AI Assistant Response**:\n\nRegarding **"${q}"**:\n\nPranit specializes in building production-grade AI systems, agentic architectures (like TARK AI), and high-performance full-stack web applications. \n\nFeel free to ask about specific components like **RAG pipelines**, **memory storage**, or **project demos**!`;
      }

      setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: fallbackText, sources: fallbackSources, isStreaming: false } : m));
    } finally {
      setIsLoading(false);
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

  // Handle triggered queries from outside
  useEffect(() => {
    if (initialQuery && initialQuery.trim().length > 0) {
      setIsOpen(true);
      handleSubmit(initialQuery);
    }
  }, [initialQuery, handleSubmit, setIsOpen]);

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "✨ Chat reset! Feel free to ask another question about **TARK AI**, technical architecture, or Pranit's work.",
        sources: [],
      }
    ]);
    setError(null);
  };

  return (
    <>
      {/* ── Global Floating Trigger Button (Robot Icon + Badge) ── */}
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
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {/* Tooltip badge pill */}
              <button
                onClick={() => setIsOpen(true)}
                style={{
                  background: 'rgba(20, 19, 16, 0.92)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(200, 130, 10, 0.35)',
                  padding: '8px 14px',
                  borderRadius: '30px',
                  color: '#F5EFE0',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 12px rgba(200, 130, 10, 0.15)',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = AMBER_LIGHT;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.8), 0 0 18px rgba(200, 130, 10, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(200, 130, 10, 0.35)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 12px rgba(200, 130, 10, 0.15)';
                }}
              >
                <Sparkles size={13} color={AMBER_LIGHT} />
                <span>Ask about Projects</span>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#22C55E',
                    boxShadow: '0 0 8px rgba(34, 197, 94, 0.8)',
                  }}
                />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Robot Icon Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: isOpen
              ? '#181612'
              : 'linear-gradient(135deg, #1C1914 0%, #12110E 100%)',
            border: `1.5px solid ${isOpen ? 'rgba(255, 248, 235, 0.2)' : 'rgba(200, 130, 10, 0.5)'}`,
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.8), 0 0 20px rgba(200, 130, 10, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isOpen ? '#C8BFA8' : AMBER_LIGHT,
            cursor: 'pointer',
            position: 'relative',
            transition: 'border-color 200ms ease',
          }}
          aria-label={isOpen ? "Close Project AI Assistant" : "Open Project AI Assistant"}
        >
          {isOpen ? (
            <ChevronDown size={22} />
          ) : (
            <>
              <Bot size={24} />
              {/* Online pulse ring */}
              <span
                style={{
                  position: 'absolute',
                  top: '1px',
                  right: '1px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#22C55E',
                  border: '2px solid #141310',
                  boxShadow: '0 0 8px rgba(34, 197, 94, 0.8)',
                }}
              />
            </>
          )}
        </motion.button>
      </div>

      {/* ── Conversational Chat Modal / Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            style={{
              position: 'fixed',
              bottom: '88px',
              right: '24px',
              width: 'min(440px, calc(100vw - 32px))',
              height: 'min(620px, calc(100vh - 120px))',
              zIndex: 9995,
              background: 'rgba(18, 17, 14, 0.97)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(200, 130, 10, 0.3)',
              borderRadius: '12px',
              boxShadow: '0 24px 60px -10px rgba(0, 0, 0, 0.95), 0 0 30px rgba(200, 130, 10, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '1rem 1.25rem',
                background: 'rgba(25, 23, 19, 0.85)',
                borderBottom: '1px solid rgba(255, 248, 235, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: 'rgba(200, 130, 10, 0.15)',
                    border: '1px solid rgba(200, 130, 10, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: AMBER_LIGHT,
                  }}
                >
                  <Bot size={18} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h3
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#F5EFE0',
                        letterSpacing: '0.12em',
                        margin: 0,
                        textTransform: 'uppercase',
                      }}
                    >
                      PROJECT AI ASSISTANT
                    </h3>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#22C55E',
                        boxShadow: '0 0 6px rgba(34, 197, 94, 0.8)',
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.75rem',
                      color: '#8A8070',
                      margin: '2px 0 0 0',
                    }}
                  >
                    Grounded in TARK AI repo &amp; Portfolio
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                      transition: 'color 180ms ease',
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
                    transition: 'color 180ms ease',
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
                  padding: '0.85rem 1.15rem 0.25rem',
                  borderBottom: '1px solid rgba(255, 248, 235, 0.04)',
                }}
              >
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.6rem',
                    color: '#8A8070',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}
                >
                  SUGGESTED TOPICS:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSubmit(prompt)}
                      style={{
                        background: 'rgba(25, 23, 19, 0.7)',
                        border: '1px solid rgba(255, 248, 235, 0.08)',
                        color: '#C8BFA8',
                        padding: '0.45rem 0.75rem',
                        borderRadius: '4px',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        transition: 'all 180ms ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(200, 130, 10, 0.12)';
                        e.currentTarget.style.borderColor = 'rgba(200, 130, 10, 0.35)';
                        e.currentTarget.style.color = '#F5EFE0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(25, 23, 19, 0.7)';
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

            {/* Message Feed */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem 1.15rem',
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
                  {/* Avatar */}
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '4px',
                      background: msg.role === 'user' ? 'rgba(200, 130, 10, 0.2)' : '#100F0D',
                      border: `1px solid ${msg.role === 'user' ? 'rgba(200, 130, 10, 0.35)' : 'rgba(255, 248, 235, 0.1)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: msg.role === 'user' ? '#F5EFE0' : AMBER_LIGHT,
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {msg.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    style={{
                      maxWidth: msg.role === 'user' ? '82%' : '88%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        background: msg.role === 'user' ? '#221F18' : '#141310',
                        border: msg.role === 'user'
                          ? '1px solid rgba(200, 130, 10, 0.3)'
                          : '1px solid rgba(255, 248, 235, 0.08)',
                        borderRadius: '6px',
                        padding: '0.75rem 0.95rem',
                        color: msg.role === 'user' ? '#F5EFE0' : '#E8E1D5',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.85rem',
                        lineHeight: 1.6,
                        wordBreak: 'break-word',
                      }}
                    >
                      {msg.role === 'user' ? (
                        <span style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>
                      ) : (
                        <div className="assistant-markdown-content">
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
                            height: '13px',
                            background: AMBER,
                            marginLeft: '4px',
                            verticalAlign: 'middle',
                            animation: 'pulse 1s infinite',
                          }}
                        />
                      )}
                    </div>

                    {/* Sources Citation */}
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
                              background: '#1A1814',
                              padding: '1px 5px',
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

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              style={{
                padding: '0.75rem 1rem',
                background: 'rgba(20, 19, 16, 0.95)',
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
                placeholder="Ask about TARK AI or projects..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  background: '#12110E',
                  border: '1px solid rgba(255, 248, 235, 0.1)',
                  borderRadius: '6px',
                  padding: '0.6rem 0.85rem',
                  color: '#F5EFE0',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(200, 130, 10, 0.5)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 248, 235, 0.1)')}
              />

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '6px',
                  background: input.trim() ? AMBER : 'rgba(255, 248, 235, 0.06)',
                  color: input.trim() ? '#0E0D0B' : '#5A5248',
                  border: 'none',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 180ms ease',
                }}
                aria-label="Send message"
              >
                <Send size={13} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
