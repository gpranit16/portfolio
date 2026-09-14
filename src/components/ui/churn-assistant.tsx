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

const churnSuggestedPrompts = [
  "How does Churn Reaper predict churn risk?",
  "How does TreeSHAP explain customer risk drivers?",
  "How does the deterministic financial engine calculate ROI?",
  "What retention offers does NVIDIA Nemotron generate?",
];

interface ChurnAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export default function ChurnAssistant({ isOpen, onClose, initialQuery }: ChurnAssistantProps) {
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
      }, 150);
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
        const response = await fetch('/api/churn-assistant/chat', {
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
        let accumulatedSources: SourceCitation[] = [];

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

                if (parsed.type === 'sources') {
                  accumulatedSources = parsed.sources || [];
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId
                        ? { ...m, sources: accumulatedSources }
                        : m
                    )
                  );
                } else if (parsed.type === 'delta') {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId
                        ? { ...m, content: m.content + parsed.delta }
                        : m
                    )
                  );
                } else if (parsed.type === 'done') {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId ? { ...m, isStreaming: false } : m
                    )
                  );
                } else if (parsed.type === 'error') {
                  setError(parsed.error || 'Streaming error occurred');
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId ? { ...m, isStreaming: false } : m
                    )
                  );
                }
              } catch {
                // Ignore parse errors on partial chunks
              }
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Stopped by user
        } else {
          console.warn('Churn Assistant fallback:', err);
          const lowerQ = q.toLowerCase().trim();
          const isOutOfScope =
            /\b(cat|cats|dog|dogs|animal|weather|elon\s+musk|joke|binary\s+search|quantum\s+computing|movie|recipe|president|capital\s+of)\b/i.test(lowerQ) ||
            lowerQ.startsWith('what is a ') ||
            lowerQ.startsWith('who is ') && !lowerQ.includes('pranit') ||
            ((lowerQ.includes('tark') || lowerQ.includes('syncora')) && !lowerQ.includes('churn'));

          const fallbackText = isOutOfScope
            ? "I can answer questions about the Churn Reaper project, but that question is outside my scope."
            : "I couldn't verify that from the Churn Reaper project context.";

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: m.content || fallbackText,
                    sources: [],
                    isStreaming: false,
                  }
                : m
            )
          );
        }
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
            zIndex: 9999,
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
            onPointerDown={(e) => {
              const target = e.target as HTMLElement;
              if (target.closest('button')) return;
              dragControls.start(e);
            }}
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
                    ASK CHURN REAPER
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
                  RETENTION INTELLIGENCE ASSISTANT
                </p>
              </div>
            </div>

            {/* Right: Controls */}
            <div
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'default' }}
            >
              {messages.length > 0 && (
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
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
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
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
                  Ask me about Churn Reaper&apos;s XGBoost tuning, SHAP attribution, NVIDIA Nemotron, or deterministic financial ROI engine.
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
                  {churnSuggestedPrompts.map((prompt) => (
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

            {/* Render Chat Messages */}
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
                  gap: '0.35rem',
                }}
              >
                {/* Message Bubble */}
                <div
                  style={{
                    maxWidth: '92%',
                    padding: m.role === 'user' ? '0.65rem 0.95rem' : '0.85rem 1.1rem',
                    borderRadius: m.role === 'user' ? '4px 4px 1px 4px' : '4px 4px 4px 1px',
                    background: m.role === 'user' ? 'rgba(200, 130, 10, 0.12)' : '#161410',
                    border: m.role === 'user' ? '1px solid rgba(200, 130, 10, 0.28)' : '1px solid rgba(255, 248, 235, 0.08)',
                    color: m.role === 'user' ? '#F5EFE0' : '#E8E1D1',
                    fontSize: '0.825rem',
                    lineHeight: 1.65,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {m.role === 'user' ? (
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{m.content}</p>
                  ) : (
                    <div>
                      {m.content ? (
                        <div className="markdown-content">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {m.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8A8070', padding: '4px 0' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: AMBER, animation: 'pulse 1.2s infinite' }} />
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem' }}>Analyzing Churn Reaper knowledge...</span>
                        </div>
                      )}

                      {/* Source Chips */}
                      {m.sources && m.sources.length > 0 && !m.isStreaming && (
                        <div
                          style={{
                            marginTop: '0.75rem',
                            paddingTop: '0.6rem',
                            borderTop: '1px solid rgba(255, 248, 235, 0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.35rem',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.58rem',
                              color: '#5A5248',
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                            }}
                          >
                            Verified Sources
                          </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                            {m.sources.slice(0, 3).map((src, i) => (
                              <span
                                key={i}
                                style={{
                                  fontFamily: "'JetBrains Mono', monospace",
                                  fontSize: '0.6rem',
                                  color: '#AFA594',
                                  background: 'rgba(255, 248, 235, 0.04)',
                                  border: '1px solid rgba(255, 248, 235, 0.08)',
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: '2px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <FileText size={9} color={AMBER_LIGHT} />
                                <span>{src.title || src.source}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {error && (
              <div
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '3px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#f87171',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.72rem',
                }}
              >
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input Bar ── */}
          <div
            style={{
              padding: '0.75rem 1rem 0.85rem',
              background: '#161410',
              borderTop: '1px solid rgba(255, 248, 235, 0.08)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '0.5rem',
                background: '#0E0D0B',
                border: '1px solid rgba(255, 248, 235, 0.1)',
                borderRadius: '4px',
                padding: '0.45rem 0.65rem',
                transition: 'border-color 160ms ease',
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Churn Reaper (e.g. ROI formula, SHAP)..."
                rows={1}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#F5EFE0',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8rem',
                  lineHeight: 1.5,
                  resize: 'none',
                  maxHeight: '80px',
                }}
              />

              {isLoading ? (
                <button
                  onClick={handleStop}
                  title="Stop generation"
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    padding: '6px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Square size={12} />
                </button>
              ) : (
                <button
                  onClick={() => handleSubmit()}
                  disabled={!input.trim()}
                  title="Send (Enter)"
                  style={{
                    background: input.trim() ? AMBER : 'rgba(200, 130, 10, 0.15)',
                    border: 'none',
                    color: input.trim() ? '#0E0D0B' : '#8A8070',
                    padding: '6px',
                    borderRadius: '3px',
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

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '0.45rem',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.55rem',
                color: '#5A5248',
                letterSpacing: '0.04em',
              }}
            >
              <span>Grounded in Churn Reaper repo</span>
              <span>Enter ↵ send · Esc close</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
