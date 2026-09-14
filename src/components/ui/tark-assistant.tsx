import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, RefreshCw, FileText, AlertCircle, Bot, User } from 'lucide-react';

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
  "What is TARK AI & why was it built?",
  "How does the RAG & CRAG pipeline work?",
  "How is persistent memory managed?",
  "How does dynamic model routing work?",
];

export default function TarkAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm the TARK AI Project Assistant. I can explain the architecture, RAG/CRAG retrieval, two-layer memory, model routing, and sandboxed tool execution. What would you like to know?",
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        throw new Error(`Server returned ${response.status}: Failed to reach TARK RAG service.`);
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
                throw new Error(event.error || 'RAG response error');
              }
            } catch (e) {
              // Ignore partial JSON chunks
            }
          }
        }
      }

      setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, isStreaming: false } : m));
    } catch (err: unknown) {
      console.error('TARK Assistant Error:', err);
      const errMsg = err instanceof Error ? err.message : 'Failed to connect to TARK RAG assistant.';
      setError(errMsg);
      setMessages(prev => prev.filter(m => m.id !== assistantMsgId));
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Conversation reset. Feel free to ask another question about TARK AI!",
        sources: [],
      }
    ]);
    setError(null);
  };

  return (
    <div 
      id="ask-tark-chat"
      style={{
        maxWidth: '1240px',
        margin: '3.5rem auto 0',
        width: '100%',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        style={{
          background: '#141310',
          border: '1px solid rgba(255, 248, 235, 0.08)',
          borderRadius: '6px',
          padding: '2rem 1.85rem 1.75rem',
          boxShadow: '0 24px 48px -15px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Header Bar */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid rgba(255, 248, 235, 0.06)',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                background: 'rgba(200, 130, 10, 0.12)',
                border: '1px solid rgba(200, 130, 10, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: AMBER_LIGHT,
              }}
            >
              <Bot size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#F5EFE0',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    margin: 0,
                  }}
                >
                  ASK AI ABOUT THIS PROJECT
                </h3>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#22C55E',
                    boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)',
                  }}
                />
              </div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8125rem',
                  color: '#8A8070',
                  margin: '0.15rem 0 0 0',
                }}
              >
                Grounded in the real TARK AI repository · Powered by RAG
              </p>
            </div>
          </div>

          {messages.length > 1 && (
            <button
              onClick={handleClear}
              disabled={isLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'transparent',
                border: '1px solid rgba(255, 248, 235, 0.1)',
                color: '#8A8070',
                padding: '0.35rem 0.75rem',
                borderRadius: '3px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.625rem',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 180ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#F5EFE0';
                e.currentTarget.style.borderColor = 'rgba(255, 248, 235, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#8A8070';
                e.currentTarget.style.borderColor = 'rgba(255, 248, 235, 0.1)';
              }}
            >
              <RefreshCw size={11} />
              <span>NEW CHAT</span>
            </button>
          )}
        </div>

        {/* Quick Suggested Questions Chips */}
        {messages.length <= 1 && (
          <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.625rem',
                color: '#8A8070',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '0.65rem',
              }}
            >
              SUGGESTED QUESTIONS:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSubmit(prompt)}
                  style={{
                    background: '#181612',
                    border: '1px solid rgba(255, 248, 235, 0.08)',
                    color: '#C8BFA8',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '3px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    transition: 'all 180ms ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(200, 130, 10, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(200, 130, 10, 0.35)';
                    e.currentTarget.style.color = '#F5EFE0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#181612';
                    e.currentTarget.style.borderColor = 'rgba(255, 248, 235, 0.08)';
                    e.currentTarget.style.color = '#C8BFA8';
                  }}
                >
                  <Sparkles size={12} color={AMBER_LIGHT} />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages Feed */}
        <div 
          style={{
            maxHeight: '440px',
            overflowY: 'auto',
            padding: '1rem 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '0.85rem',
                alignItems: 'flex-start',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '3px',
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
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>

              {/* Message Bubble */}
              <div
                style={{
                  maxWidth: msg.role === 'user' ? '75%' : '88%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    background: msg.role === 'user' ? '#1E1C17' : '#0F0E0C',
                    border: msg.role === 'user' 
                      ? '1px solid rgba(200, 130, 10, 0.28)' 
                      : '1px solid rgba(255, 248, 235, 0.07)',
                    borderRadius: '4px',
                    padding: '0.85rem 1.15rem',
                    color: msg.role === 'user' ? '#F5EFE0' : '#E8E1D5',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.925rem',
                    lineHeight: 1.68,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.content}
                  {msg.isStreaming && (
                    <span 
                      style={{
                        display: 'inline-block',
                        width: '5px',
                        height: '14px',
                        background: AMBER,
                        marginLeft: '5px',
                        verticalAlign: 'middle',
                        animation: 'pulse 1s infinite',
                      }} 
                    />
                  )}
                </div>

                {/* Compact Sources Citation */}
                {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && !msg.isStreaming && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '0.45rem',
                      marginTop: '0.45rem',
                      paddingLeft: '0.25rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.5875rem',
                        color: '#8A8070',
                        letterSpacing: '0.08em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <FileText size={10} color={AMBER} />
                      SOURCES:
                    </span>
                    {msg.sources.slice(0, 3).map((s, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.5875rem',
                          color: '#C8BFA8',
                          background: '#181612',
                          padding: '1px 6px',
                          borderRadius: '2px',
                          border: '1px solid rgba(255, 248, 235, 0.07)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {s.source} {s.section && s.section !== 'Module Implementation' ? `· ${s.section}` : ''}
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
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderRadius: '3px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#FCA5A5',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.8125rem',
              marginTop: '0.75rem',
            }}
          >
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          style={{
            marginTop: '1.15rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: '#0E0D0B',
            border: '1px solid rgba(255, 248, 235, 0.1)',
            borderRadius: '4px',
            padding: '0.35rem 0.5rem 0.35rem 1rem',
            transition: 'border-color 200ms ease',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about TARK AI (e.g. How does RAG work? How is memory built?)..."
            disabled={isLoading}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#F5EFE0',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.875rem',
            }}
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: '3px',
              background: input.trim() ? AMBER : 'rgba(255, 248, 235, 0.05)',
              color: input.trim() ? '#0E0D0B' : '#5A5248',
              border: 'none',
              cursor: input.trim() && !isLoading ? 'pointer' : 'default',
              transition: 'all 180ms ease',
            }}
            aria-label="Send query"
          >
            <Send size={14} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
