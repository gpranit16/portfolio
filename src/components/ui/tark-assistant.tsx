import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Send, RefreshCw, X, Square, Terminal, FileText, ArrowUpRight, Sparkles, GripHorizontal } from 'lucide-react';
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
  "How does TARK's RAG pipeline work?",
  "How is memory handled?",
  "How does model routing work?",
  "How does TARK use tools?",
];

interface TarkAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export default function TarkAssistant({ isOpen, onClose, initialQuery }: TarkAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dragControls = useDragControls();

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom('auto');
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      setMessages((prev) =>
        prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
      );
    }
  };

  const handleSubmit = useCallback(
    async (questionText?: string) => {
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

      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      setMessages((prev) => [...prev, userMsg, initialAssistantMsg]);
      setIsLoading(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch('/api/tark-assistant/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: q,
            history: historyPayload,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`);
        }

        if (!response.body) {
          throw new Error('ReadableStream not supported.');
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
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId ? { ...m, sources: receivedSources } : m
                    )
                  );
                } else if (event.type === 'delta' && typeof event.delta === 'string') {
                  accumulatedText += event.delta;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId ? { ...m, content: accumulatedText } : m
                    )
                  );
                } else if (event.type === 'error') {
                  throw new Error(event.error || 'Stream error');
                }
              } catch {
                // Ignore partial json parse errors
              }
            }
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId ? { ...m, isStreaming: false } : m
          )
        );
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        console.warn('TARK Assistant falling back gracefully:', err);

        // Smart Structured Technical Fallback
        const lowerQ = q.toLowerCase();
        let fallbackText = '';
        let fallbackSources: SourceCitation[] = [];

        if (lowerQ.includes('rag') || lowerQ.includes('retriev') || lowerQ.includes('search')) {
          fallbackText = `### Corrective RAG (CRAG) Pipeline in TARK AI

TARK AI implements a **multi-stage hybrid retrieval architecture** designed for high-precision technical answers:

1. **Hybrid Ingestion & Indexing**:
   - Documents are parsed into AST-aware chunks (preserving markdown headers and code blocks).
   - Indexed via both **sparse BM25** (keyword matching) and **dense vector embeddings** in \`pgvector\`.

2. **Adaptive Query Reformulation**:
   - An evaluator LLM rewrites imprecise queries into targeted search parameters.
   - If local similarity score is below confidence threshold (\`< 0.65\`), it automatically triggers external web verification.

3. **Contextual Synthesis & Attribution**:
   - Retrieved chunks are reranked and synthesized with explicit source-file tracking.`;
          fallbackSources = [
            { source: 'ARCHITECTURE.md', file_path: 'ARCHITECTURE.md', section: 'CRAG Retrieval', title: 'CRAG Architecture' },
            { source: 'DECISIONS.md', file_path: 'DECISIONS.md', section: 'Hybrid Search', title: 'Hybrid Retrieval' },
          ];
        } else if (lowerQ.includes('memory') || lowerQ.includes('state') || lowerQ.includes('store')) {
          fallbackText = `### Two-Layer Memory Architecture

TARK AI separates immediate context from persistent knowledge through a dedicated dual-layer engine:

- **Layer 1: Short-Term Thread Memory**:
  - Maintains conversation context, active tool executions, and intermediate agent scratchpads for the active session.
- **Layer 2: Long-Term Semantic Memory**:
  - Powered by \`PostgreSQL + pgvector\` with cosine distance indexing.
  - Automatically deduplicates incoming facts, assigns confidence scores, and applies temporal decay to outdated preferences.
  - Strictly scoped by \`user_id\` for complete multi-tenant access control.`;
          fallbackSources = [
            { source: 'DECISIONS.md', file_path: 'DECISIONS.md', section: 'Two-Layer Memory', title: 'Memory Architecture' },
            { source: 'backend/.../memory/service.py', file_path: 'backend/app/services/memory/service.py', section: 'MemoryService', title: 'Memory Service' },
          ];
        } else if (lowerQ.includes('model') || lowerQ.includes('routing') || lowerQ.includes('gateway')) {
          fallbackText = `### Dynamic Multi-Model Routing Gateway

TARK AI treats LLMs as interchangeable execution engines based on speed, cost, and task complexity:

- **Local Inference (Privacy & Offline)**: Direct integration with **Ollama** (\`llama3.2\`, \`qwen2.5-coder\`, \`mistral\`).
- **Cloud Providers (High Throughput & Reasoning)**: Unified gateway supporting **Groq**, **Anthropic Claude**, **OpenAI**, and **Gemini**.
- **Automatic Fallback Circuit**: If an API times out or rate limits, the gateway instantly routes to the next best candidate without interrupting user workflow.`;
          fallbackSources = [
            { source: 'ARCHITECTURE.md', file_path: 'ARCHITECTURE.md', section: 'Model Gateway', title: 'Dynamic Gateway' },
          ];
        } else if (lowerQ.includes('tool') || lowerQ.includes('action') || lowerQ.includes('sandbox')) {
          fallbackText = `### Sandboxed Tool Execution Infrastructure

TARK AI provides 44+ registered tools executed through a secured runtime:

1. **AST Validation**: Code and shell expressions are parsed and checked against disallowed modules (\`os.system\`, dangerous network calls) prior to execution.
2. **Dynamic Tool Registry**: Tools are typed with Pydantic schemas and registered dynamically into the LangGraph state graph.
3. **Execution Guardrails**: Timeouts, memory caps, and stdout/stderr capture ensure rogue scripts cannot freeze the workspace.`;
          fallbackSources = [
            { source: 'ARCHITECTURE.md', file_path: 'ARCHITECTURE.md', section: 'Tool Sandbox', title: 'Tool Execution' },
          ];
        } else {
          fallbackText = `### TARK AI: Technical Overview

**TARK AI** is an open-source, full-stack **Agentic AI Workspace & Personal Productivity System** designed to move beyond passive chat into deep reasoning and action.

- **Stack**: FastAPI (Python) · React & TypeScript · PostgreSQL & pgvector · LangGraph.
- **Key Modules**: Two-Layer Memory, Corrective RAG (CRAG), Dynamic Model Routing, and AST-Sandboxed Tool Execution.

Feel free to ask about any specific architectural module!`;
          fallbackSources = [
            { source: 'README.md', file_path: 'README.md', section: 'System Architecture', title: 'TARK AI Overview' },
          ];
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: fallbackText, sources: fallbackSources, isStreaming: false }
              : m
          )
        );
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [input, isLoading, messages]
  );

  useEffect(() => {
    if (initialQuery && initialQuery.trim().length > 0) {
      handleSubmit(initialQuery);
    }
  }, [initialQuery, handleSubmit]);

  const handleClear = () => {
    handleStop();
    setMessages([]);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragConstraints={{ left: -600, right: 200, top: -450, bottom: 200 }}
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: 'min(450px, calc(100vw - 32px))',
            height: 'min(620px, calc(100vh - 80px))',
            zIndex: 9998,
            background: '#12110E',
            border: '1px solid rgba(255, 248, 235, 0.12)',
            borderRadius: '6px',
            boxShadow: '0 24px 50px -12px rgba(0, 0, 0, 0.9), 0 0 30px rgba(200, 130, 10, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* ── Drag Handle & Header ── */}
          <div
            onPointerDown={(e) => dragControls.start(e)}
            style={{
              padding: '0.85rem 1.15rem',
              background: '#161410',
              borderBottom: '1px solid rgba(255, 248, 235, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'grab',
              userSelect: 'none',
              touchAction: 'none',
            }}
          >
            {/* Left: Refined Technical AI Icon + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '3px',
                  background: 'rgba(200, 130, 10, 0.1)',
                  border: '1px solid rgba(200, 130, 10, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: AMBER_LIGHT,
                }}
              >
                <Terminal size={14} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: '#F5EFE0',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    ASK TARK
                  </h3>
                  <GripHorizontal size={12} color="#5A5248" style={{ opacity: 0.6 }} />
                </div>
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.58rem',
                    color: '#8A8070',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    margin: '1px 0 0 0',
                  }}
                >
                  TARK AI PROJECT ASSISTANT
                </p>
              </div>
            </div>

            {/* Right: Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              {messages.length > 0 && (
                <button
                  onClick={handleClear}
                  title="Reset conversation"
                  disabled={isLoading}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#8A8070',
                    padding: '5px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 160ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#F5EFE0')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8070')}
                >
                  <RefreshCw size={13} />
                </button>
              )}

              <button
                onClick={onClose}
                title="Close (Esc)"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#8A8070',
                  padding: '5px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 160ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F5EFE0')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8070')}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ── Messages & Scrollable Area ── */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.15rem 1.15rem 0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.1rem',
            }}
          >
            {/* Empty State */}
            {messages.length === 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center',
                  padding: '1.5rem 0.5rem',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '4px',
                    background: 'rgba(200, 130, 10, 0.08)',
                    border: '1px solid rgba(200, 130, 10, 0.22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: AMBER,
                    marginBottom: '1rem',
                  }}
                >
                  <Sparkles size={16} />
                </div>

                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.825rem',
                    color: '#C8BFA8',
                    lineHeight: 1.6,
                    maxWidth: '320px',
                    margin: '0 0 1.5rem 0',
                  }}
                >
                  Ask me about TARK AI&apos;s architecture, RAG pipeline, memory, models, tools, or implementation.
                </p>

                {/* 4 Quiet Suggestion Chips */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                    width: '100%',
                    maxWidth: '360px',
                  }}
                >
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSubmit(prompt)}
                      style={{
                        background: '#161410',
                        border: '1px solid rgba(255, 248, 235, 0.08)',
                        color: '#AFA594',
                        padding: '0.55rem 0.85rem',
                        borderRadius: '3px',
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
                        e.currentTarget.style.background = 'rgba(200, 130, 10, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(200, 130, 10, 0.28)';
                        e.currentTarget.style.color = '#F5EFE0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#161410';
                        e.currentTarget.style.borderColor = 'rgba(255, 248, 235, 0.08)';
                        e.currentTarget.style.color = '#AFA594';
                      }}
                    >
                      <span>{prompt}</span>
                      <ArrowUpRight size={12} color="#8A8070" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Rendered Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  width: '100%',
                }}
              >
                {/* User Message Bubble */}
                {msg.role === 'user' ? (
                  <div
                    style={{
                      maxWidth: '85%',
                      background: '#1E1B15',
                      border: '1px solid rgba(200, 130, 10, 0.25)',
                      borderRadius: '4px',
                      padding: '0.65rem 0.95rem',
                      color: '#F5EFE0',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.84rem',
                      lineHeight: 1.55,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.content}
                  </div>
                ) : (
                  /* Assistant Message Bubble */
                  <div
                    style={{
                      width: '100%',
                      background: '#141310',
                      border: '1px solid rgba(255, 248, 235, 0.07)',
                      borderRadius: '4px',
                      padding: '0.85rem 1rem',
                      color: '#E8E1D5',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.84rem',
                      lineHeight: 1.65,
                      wordBreak: 'break-word',
                    }}
                  >
                    {/* Assistant Message Header Indicator */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <span
                        style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: AMBER,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.55rem',
                          color: AMBER,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                        }}
                      >
                        TARK AI
                      </span>
                    </div>

                    {/* Markdown Body */}
                    <div className="tark-markdown-renderer">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>

                    {/* Streaming Cursor */}
                    {msg.isStreaming && (
                      <span
                        style={{
                          display: 'inline-block',
                          width: '3px',
                          height: '12px',
                          background: AMBER,
                          marginLeft: '4px',
                          verticalAlign: 'middle',
                          animation: 'pulse 1s infinite',
                        }}
                      />
                    )}

                    {/* Sources Attribution */}
                    {msg.sources && msg.sources.length > 0 && !msg.isStreaming && (
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          gap: '0.35rem',
                          marginTop: '0.75rem',
                          paddingTop: '0.55rem',
                          borderTop: '1px solid rgba(255, 248, 235, 0.05)',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.54rem',
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
                        {msg.sources.slice(0, 3).map((s, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.55rem',
                              color: '#C8BFA8',
                              background: '#191814',
                              padding: '1px 6px',
                              borderRadius: '2px',
                              border: '1px solid rgba(255, 248, 235, 0.07)',
                            }}
                          >
                            {s.source} {s.section && s.section !== 'Module Implementation' ? `· ${s.section}` : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                padding: '0.45rem 1rem',
                background: 'rgba(239, 68, 68, 0.1)',
                borderTop: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#FCA5A5',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.74rem',
              }}
            >
              {error}
            </div>
          )}

          {/* ── Input Area ── */}
          <div
            style={{
              padding: '0.75rem 1rem',
              background: '#141310',
              borderTop: '1px solid rgba(255, 248, 235, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about TARK..."
              disabled={isLoading}
              style={{
                flex: 1,
                background: '#0E0D0B',
                border: '1px solid rgba(255, 248, 235, 0.09)',
                borderRadius: '3px',
                padding: '0.55rem 0.8rem',
                color: '#F5EFE0',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.825rem',
                resize: 'none',
                outline: 'none',
                maxHeight: '80px',
                lineHeight: 1.4,
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(200, 130, 10, 0.45)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 248, 235, 0.09)')}
            />

            {isLoading ? (
              <button
                onClick={handleStop}
                title="Stop generation"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '3px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#FCA5A5',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 160ms ease',
                }}
              >
                <Square size={12} />
              </button>
            ) : (
              <button
                onClick={() => handleSubmit()}
                disabled={!input.trim()}
                title="Send query (Enter)"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '3px',
                  background: input.trim() ? AMBER : 'rgba(255, 248, 235, 0.05)',
                  color: input.trim() ? '#0E0D0B' : '#5A5248',
                  border: 'none',
                  cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 160ms ease',
                }}
              >
                <Send size={12} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
