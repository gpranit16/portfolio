import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Layers, Maximize2, Terminal } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import TarkAssistant from './tark-assistant';

const AMBER = '#C8820A';
const AMBER_LIGHT = '#D4960F';

interface ProjectScreenshot {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  tag: string;
}

const screenshots: ProjectScreenshot[] = [
  {
    id: 'workspace',
    title: 'TARK AI — WORKSPACE',
    subtitle: 'Conversational AI · Contextual multi-model workspace · Active session',
    src: '/assets/tark_workspace.png',
    tag: 'WORKSPACE',
  },
  {
    id: 'auth',
    title: 'TARK AI — AUTH',
    subtitle: 'Encrypted session authentication & user onboarding experience',
    src: '/assets/tark_auth.png',
    tag: 'AUTH',
  },
  {
    id: 'myspace',
    title: 'TARK AI — MY SPACE',
    subtitle: 'Synchronized intelligence pulse & AI daily planning engine',
    src: '/assets/tark_myspace.png',
    tag: 'MY SPACE',
  },
  {
    id: 'knowledge',
    title: 'TARK AI — KNOWLEDGE BASE',
    subtitle: 'Hybrid semantic & keyword search · RAG document indexing',
    src: '/assets/tark_knowledge.png',
    tag: 'KNOWLEDGE',
  },
  {
    id: 'tools',
    title: 'TARK AI — TOOL INFRASTRUCTURE',
    subtitle: '44 registered tools · AST sandboxing & dynamic tool execution',
    src: '/assets/tark_tools.png',
    tag: 'TOOLS',
  },
  {
    id: 'tasks',
    title: 'TARK AI — TASKS & PLANNING',
    subtitle: 'Personal OS · smart task scheduling & automated workflows',
    src: '/assets/tark_tasks.png',
    tag: 'TASKS',
  },
];

export default function TarkAiShowcase() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [direction, setDirection] = useState<number>(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const prevImage = useCallback(() => {
    setDirection(-1);
    setActiveIdx((curr) => {
      if (curr === null) return 0;
      return (curr - 1 + screenshots.length) % screenshots.length;
    });
  }, []);

  const nextImage = useCallback(() => {
    setDirection(1);
    setActiveIdx((curr) => {
      if (curr === null) return 0;
      return (curr + 1) % screenshots.length;
    });
  }, []);

  const openViewer = useCallback((idx: number) => {
    setDirection(0);
    setActiveIdx(idx);
  }, []);

  const closeModal = useCallback(() => {
    setActiveIdx(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIdx !== null) {
        if (e.key === 'ArrowLeft') {
          prevImage();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        } else if (e.key === 'Escape') {
          closeModal();
        }
      } else if (isOpen && e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx, isOpen, prevImage, nextImage, closeModal]);

  // Touch / Pan handling for modal
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    // Vertical swipe down -> close
    if (info.offset.y > 80 || info.velocity.y > 350) {
      closeModal();
      return;
    }
    // Horizontal swipe -> navigate
    if (info.offset.x > 60 || info.velocity.x > 250) {
      prevImage();
    } else if (info.offset.x < -60 || info.velocity.x < -250) {
      nextImage();
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : dir < 0 ? -30 : 0,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : dir < 0 ? 30 : 0,
      opacity: 0,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <section 
      id="tark-ai" 
      style={{
        position: 'relative',
        padding: '7.5rem 2rem 7.5rem',
        background: '#0E0D0B',
        overflow: 'hidden',
      }}
    >
      {/* Subtle ambient lighting consistent with site */}
      <div 
        style={{
          position: 'absolute',
          top: '35%',
          right: '20%',
          transform: 'translate(50%, -35%)',
          width: '750px',
          height: '500px',
          background: 'radial-gradient(ellipse at center, rgba(200, 130, 10, 0.035) 0%, rgba(200, 130, 10, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }} 
      />

      <div style={{ maxWidth: '1240px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
        
        {/* 2-Part Editorial Composition */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.05fr) minmax(360px, 1.25fr)',
            gap: '4rem',
            alignItems: 'center',
          }}
          className="tark-layout"
        >
          <style>{`
            @media (max-width: 960px) {
              .tark-layout {
                grid-template-columns: 1fr !important;
                gap: 3.5rem !important;
              }
            }
          `}</style>

          {/* ── LEFT COLUMN: Information & Positioning ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {/* Section label */}
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6875rem',
                color: AMBER,
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                fontWeight: 500,
                margin: 0,
              }}
            >
              03 / FEATURED WORK
            </p>

            {/* Title & Subtitle */}
            <div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(2.6rem, 4.5vw, 4rem)',
                  fontWeight: 700,
                  color: '#F5EFE0',
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  margin: '0 0 0.5rem 0',
                }}
              >
                TARK AI
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(1.05rem, 1.35vw, 1.2rem)',
                  color: '#C8BFA8',
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Agentic AI Workspace &amp; Personal Productivity System
              </p>
            </div>

            {/* Beyond Chat Line */}
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9375rem',
                color: '#AFA594',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Beyond chat — a full-stack AI system for reasoning, retrieval, memory, research and action.
            </p>

            {/* Short Project Description */}
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '1rem',
                lineHeight: 1.7,
                color: '#C8BFA8',
                margin: 0,
              }}
            >
              A full-stack AI workspace bringing conversational AI, RAG, persistent memory, research, coding and productivity workflows into one system.
            </p>

            {/* Technical Lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.25rem' }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.6875rem',
                  color: AMBER_LIGHT,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                RAG · AGENTS · MEMORY · RESEARCH · TOOL CALLING
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.625rem',
                  color: '#8A8070',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                PYTHON · FASTAPI · REACT · POSTGRESQL · PGVECTOR · LANGGRAPH
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.4rem',
                  background: '#141310',
                  border: `1px solid rgba(200, 130, 10, 0.35)`,
                  color: '#F5EFE0',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  transition: 'background 200ms ease, border-color 200ms ease, transform 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(200, 130, 10, 0.1)';
                  e.currentTarget.style.borderColor = AMBER_LIGHT;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#141310';
                  e.currentTarget.style.borderColor = 'rgba(200, 130, 10, 0.35)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <Layers size={14} color={AMBER_LIGHT} />
                <span>{isOpen ? 'COLLAPSE ARCHIVE' : 'EXPAND ARCHIVE'}</span>
              </button>

              <a
                href="https://github.com/gpranit16/tark-ai"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.4rem',
                  background: 'transparent',
                  border: '1px solid rgba(255, 248, 235, 0.12)',
                  color: '#C8BFA8',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  borderRadius: '3px',
                  textDecoration: 'none',
                  transition: 'border-color 200ms ease, color 200ms ease, transform 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 248, 235, 0.3)';
                  e.currentTarget.style.color = '#F5EFE0';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 248, 235, 0.12)';
                  e.currentTarget.style.color = '#C8BFA8';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <SiGithub size={13} />
                <span>GITHUB ↗</span>
              </a>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN: Tactile Interactive Folder Archive ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '440px',
            }}
          >
            {/* Interactive Folder Container */}
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => {
                if (!isOpen) setIsOpen(true);
              }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '560px',
                aspectRatio: '16 / 10.5',
                cursor: 'pointer',
              }}
            >
              {/* Folder Top Tab */}
              <div
                style={{
                  position: 'absolute',
                  top: '-24px',
                  left: '0px',
                  height: '26px',
                  padding: '0 1.25rem',
                  background: '#141310',
                  border: '1px solid rgba(255, 248, 235, 0.10)',
                  borderBottom: 'none',
                  borderTopLeftRadius: '5px',
                  borderTopRightRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  zIndex: 2,
                  boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div 
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: AMBER,
                    boxShadow: '0 0 6px rgba(200, 130, 10, 0.6)',
                  }} 
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: '#F5EFE0',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                  }}
                >
                  TARK AI / WORKSPACE
                </span>
              </div>

              {/* Folder Base Backplate */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#141310',
                  borderRadius: '0 6px 6px 6px',
                  border: '1px solid rgba(255, 248, 235, 0.10)',
                  boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.8)',
                  overflow: 'hidden',
                  zIndex: 1,
                }}
              >
                <div 
                  style={{
                    position: 'absolute',
                    inset: '6px',
                    border: '1px dashed rgba(255, 248, 235, 0.04)',
                    borderRadius: '4px',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* Stacked / Fanned Screenshots Container */}
              <div
                style={{
                  position: 'absolute',
                  inset: '12px 14px',
                  zIndex: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* 3rd Screenshot: My Space (Subtle deep layer) */}
                <motion.div
                  animate={
                    isOpen
                      ? { x: -110, y: -45, rotate: -10, scale: 0.88, opacity: 0.85 }
                      : isHovered
                      ? { x: -45, y: -22, rotate: -5, scale: 0.92, opacity: 0.6 }
                      : { x: -14, y: -10, rotate: -2.5, scale: 0.94, opacity: 0.4 }
                  }
                  transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openViewer(2);
                  }}
                  style={{
                    position: 'absolute',
                    width: '80%',
                    aspectRatio: '16 / 9',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 248, 235, 0.10)',
                    boxShadow: '0 12px 24px -8px rgba(0, 0, 0, 0.7)',
                    background: '#0E0D0B',
                    cursor: 'pointer',
                    zIndex: 3,
                  }}
                  whileHover={{ scale: 0.92, opacity: 1, borderColor: 'rgba(200, 130, 10, 0.3)' }}
                >
                  <img
                    src={screenshots[2].src}
                    alt={screenshots[2].title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </motion.div>

                {/* 2nd Screenshot: Auth (Secondary layer) */}
                <motion.div
                  animate={
                    isOpen
                      ? { x: -75, y: -24, rotate: -5.5, scale: 0.94, opacity: 1 }
                      : isHovered
                      ? { x: -28, y: -14, rotate: -3, scale: 0.96, opacity: 0.9 }
                      : { x: -7, y: -5, rotate: -1.2, scale: 0.97, opacity: 0.8 }
                  }
                  transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openViewer(1);
                  }}
                  style={{
                    position: 'absolute',
                    width: '83%',
                    aspectRatio: '16 / 9',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 248, 235, 0.12)',
                    boxShadow: '0 16px 32px -10px rgba(0, 0, 0, 0.75)',
                    background: '#0E0D0B',
                    cursor: 'pointer',
                    zIndex: 4,
                  }}
                  whileHover={{ scale: isOpen ? 0.98 : 0.97, borderColor: 'rgba(200, 130, 10, 0.35)' }}
                >
                  <img
                    src={screenshots[1].src}
                    alt={screenshots[1].title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '6px',
                      left: '8px',
                      background: 'rgba(14, 13, 11, 0.85)',
                      backdropFilter: 'blur(4px)',
                      padding: '2px 6px',
                      borderRadius: '2px',
                      border: '1px solid rgba(255, 248, 235, 0.08)',
                    }}
                  >
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5625rem', color: '#C8BFA8', letterSpacing: '0.08em' }}>
                      AUTH
                    </span>
                  </div>
                </motion.div>

                {/* 1st Screenshot: Primary Workspace Hero */}
                <motion.div
                  animate={
                    isOpen
                      ? { x: 55, y: -38, rotate: 2.8, scale: 1.03 }
                      : isHovered
                      ? { x: 12, y: -12, rotate: 0.8, scale: 1.01 }
                      : { x: 0, y: 0, rotate: 0, scale: 1 }
                  }
                  transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openViewer(0);
                  }}
                  style={{
                    position: 'absolute',
                    width: '88%',
                    aspectRatio: '16 / 9',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 248, 235, 0.16)',
                    boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.9), 0 0 20px rgba(200, 130, 10, 0.04)',
                    background: '#0E0D0B',
                    cursor: 'pointer',
                    zIndex: 5,
                  }}
                  whileHover={{ scale: isOpen ? 1.05 : 1.02, borderColor: 'rgba(200, 130, 10, 0.45)' }}
                >
                  <img
                    src={screenshots[0].src}
                    alt={screenshots[0].title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '10px',
                      background: 'rgba(14, 13, 11, 0.88)',
                      backdropFilter: 'blur(6px)',
                      padding: '3px 8px',
                      borderRadius: '2px',
                      border: '1px solid rgba(200, 130, 10, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: AMBER }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5875rem', fontWeight: 600, color: '#F5EFE0', letterSpacing: '0.08em' }}>
                      WORKSPACE
                    </span>
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '3px',
                      background: 'rgba(14, 13, 11, 0.75)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255, 248, 235, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C8BFA8',
                    }}
                  >
                    <Maximize2 size={12} />
                  </div>
                </motion.div>
              </div>

              {/* Folder Front Lip */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '38%',
                  background: 'linear-gradient(180deg, rgba(20, 19, 16, 0.7) 0%, rgba(20, 19, 16, 0.96) 100%)',
                  borderTop: '1px solid rgba(255, 248, 235, 0.08)',
                  borderRadius: '0 0 6px 6px',
                  zIndex: 6,
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1.25rem',
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.5625rem',
                    color: '#8A8070',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  {isOpen ? '● ARCHIVE OPEN — CLICK IMAGE TO PREVIEW' : 'CLICK TO EXPAND ARCHIVE'}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.5625rem',
                    color: AMBER,
                    letterSpacing: '0.12em',
                    fontWeight: 600,
                  }}
                >
                  {screenshots.length} ASSETS
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── TARK AI Project Intelligence CTA Strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            marginTop: '3.5rem',
            background: 'linear-gradient(180deg, #151410 0%, #11100E 100%)',
            border: '1px solid rgba(255, 248, 235, 0.08)',
            borderLeft: `2px solid ${AMBER}`,
            borderRadius: '4px',
            padding: '1rem 1.35rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Left info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '3px',
                background: 'rgba(200, 130, 10, 0.08)',
                border: '1px solid rgba(200, 130, 10, 0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: AMBER_LIGHT,
                flexShrink: 0,
              }}
            >
              <Terminal size={14} />
            </div>

            <div>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#F5EFE0',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                CURIOUS ABOUT TARK AI?
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8125rem',
                  color: '#8A8070',
                  margin: '2px 0 0 0',
                  lineHeight: 1.4,
                }}
              >
                Ask about its architecture, RAG pipeline, memory, models, tools and implementation.
              </p>
            </div>
          </div>

          {/* Right CTA Button */}
          <button
            onClick={() => setIsChatOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1.15rem',
              background: '#1A1813',
              border: `1px solid rgba(200, 130, 10, 0.35)`,
              color: '#F5EFE0',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              borderRadius: '3px',
              cursor: 'pointer',
              transition: 'all 180ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(200, 130, 10, 0.15)';
              e.currentTarget.style.borderColor = AMBER_LIGHT;
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1A1813';
              e.currentTarget.style.borderColor = 'rgba(200, 130, 10, 0.35)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <span>ASK TARK</span>
            <span style={{ color: AMBER_LIGHT }}>↗</span>
          </button>
        </motion.div>

        {/* ── TARK Dedicated Movable Floating Assistant ── */}
        <TarkAssistant
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />

      </div>

      {/* ── Focused Image Viewer Modal with True Navigation ── */}
      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeModal}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(10, 9, 8, 0.95)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              cursor: 'zoom-out',
            }}
          >
            {/* Modal Dialog Card with Pan/Swipe Handling */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.6}
              onDragEnd={handleDragEnd}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: '1140px',
                width: '100%',
                maxHeight: '92vh',
                background: '#141310',
                borderRadius: '6px',
                border: '1px solid rgba(255, 248, 235, 0.12)',
                boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.95), 0 0 30px rgba(200, 130, 10, 0.05)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'default',
              }}
            >
              {/* Modal Header Bar with Counter */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1.4rem',
                  borderBottom: '1px solid rgba(255, 248, 235, 0.08)',
                  background: '#100F0D',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: AMBER }} />
                  <div>
                    <h4
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: '#F5EFE0',
                        letterSpacing: '0.08em',
                        margin: 0,
                      }}
                    >
                      {screenshots[activeIdx].title}
                    </h4>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.75rem',
                        color: '#8A8070',
                        margin: '0.15rem 0 0 0',
                      }}
                    >
                      {screenshots[activeIdx].subtitle}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Dynamic Image Counter */}
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.75rem',
                      color: AMBER_LIGHT,
                      letterSpacing: '0.12em',
                      fontWeight: 600,
                    }}
                  >
                    {String(activeIdx + 1).padStart(2, '0')} / {String(screenshots.length).padStart(2, '0')}
                  </span>

                  {/* Close Button */}
                  <button
                    onClick={closeModal}
                    style={{
                      background: 'rgba(255, 248, 235, 0.05)',
                      border: '1px solid rgba(255, 248, 235, 0.1)',
                      borderRadius: '4px',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C8BFA8',
                      cursor: 'pointer',
                      transition: 'background 200ms ease, color 200ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(200, 130, 10, 0.15)';
                      e.currentTarget.style.color = '#F5EFE0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 248, 235, 0.05)';
                      e.currentTarget.style.color = '#C8BFA8';
                    }}
                    aria-label="Close Preview"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Main Image Stage with Functional Arrow Controls */}
              <div
                style={{
                  position: 'relative',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#0E0D0B',
                  minHeight: '480px',
                  maxHeight: 'calc(88vh - 120px)',
                  overflow: 'hidden',
                }}
              >
                {/* Previous Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(14, 13, 11, 0.88)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255, 248, 235, 0.15)',
                    color: '#F5EFE0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background 200ms ease, border-color 200ms ease, transform 150ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(200, 130, 10, 0.25)';
                    e.currentTarget.style.borderColor = AMBER_LIGHT;
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(14, 13, 11, 0.88)';
                    e.currentTarget.style.borderColor = 'rgba(255, 248, 235, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>

                {/* Animated Image with Directional Crossfade Transition */}
                <AnimatePresence custom={direction} mode="wait">
                  <motion.img
                    key={screenshots[activeIdx].id}
                    src={screenshots[activeIdx].src}
                    alt={screenshots[activeIdx].title}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '72vh',
                      objectFit: 'contain',
                      borderRadius: '3px',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.9)',
                      display: 'block',
                    }}
                  />
                </AnimatePresence>

                {/* Next Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  style={{
                    position: 'absolute',
                    right: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(14, 13, 11, 0.88)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255, 248, 235, 0.15)',
                    color: '#F5EFE0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background 200ms ease, border-color 200ms ease, transform 150ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(200, 130, 10, 0.25)';
                    e.currentTarget.style.borderColor = AMBER_LIGHT;
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(14, 13, 11, 0.88)';
                    e.currentTarget.style.borderColor = 'rgba(255, 248, 235, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Modal Footer Controls & Thumbnails */}
              <div
                style={{
                  padding: '0.65rem 1.4rem',
                  background: '#100F0D',
                  borderTop: '1px solid rgba(255, 248, 235, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.625rem',
                      color: '#8A8070',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    ← → navigate · ESC or drag down to close
                  </span>
                </div>

                {/* Thumbnails Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {screenshots.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => openViewer(i)}
                      style={{
                        padding: '3px 7px',
                        borderRadius: '2px',
                        background: activeIdx === i ? 'rgba(200, 130, 10, 0.2)' : 'transparent',
                        border: `1px solid ${activeIdx === i ? AMBER_LIGHT : 'rgba(255, 248, 235, 0.08)'}`,
                        color: activeIdx === i ? '#F5EFE0' : '#8A8070',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.5625rem',
                        cursor: 'pointer',
                        letterSpacing: '0.06em',
                        transition: 'all 180ms ease',
                      }}
                    >
                      {s.tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
