import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Layers, Maximize2, ExternalLink } from 'lucide-react';
import { SiGithub } from 'react-icons/si';

const AMBER = '#C8820A';
const AMBER_LIGHT = '#D4960F';

interface SyncoraScreenshot {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  tag: string;
  aspect?: string;
}

const syncoraScreenshots: SyncoraScreenshot[] = [
  {
    id: 'channels',
    title: 'SYNCORA — TEAM CHANNELS & CHAT',
    subtitle: 'Real-time channel messaging, voice meeting transcripts & interactive team workspace',
    src: '/assets/syncora_chat.png',
    tag: 'CHANNELS & CHAT',
  },
  {
    id: 'tasks',
    title: 'SYNCORA — TASKS WORKSPACE',
    subtitle: 'Integrated task tracking with pending, in-progress, and completed status workflows',
    src: '/assets/syncora_tasks.png',
    tag: 'TASKS & SPRINT',
  },
  {
    id: 'dm',
    title: 'SYNCORA — DIRECT MESSAGES & CALLS',
    subtitle: 'Direct peer-to-peer conversations with voice call status and video meeting integration',
    src: '/assets/syncora_dm.png',
    tag: 'DIRECT MESSAGING',
  },
  {
    id: 'auth',
    title: 'SYNCORA — AUTHENTICATION',
    subtitle: 'Secure workspace access & team collaboration login portal',
    src: '/assets/syncora_auth.png',
    tag: 'AUTHENTICATION',
  },
];

export default function SyncoraShowcase() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [direction, setDirection] = useState<number>(0);

  const prevImage = useCallback(() => {
    setDirection(-1);
    setActiveIdx((curr) => {
      if (curr === null) return 0;
      return (curr - 1 + syncoraScreenshots.length) % syncoraScreenshots.length;
    });
  }, []);

  const nextImage = useCallback(() => {
    setDirection(1);
    setActiveIdx((curr) => {
      if (curr === null) return 0;
      return (curr + 1) % syncoraScreenshots.length;
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
    if (info.offset.y > 80 || info.velocity.y > 350) {
      closeModal();
      return;
    }
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
      id="syncora"
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
          top: '40%',
          left: '15%',
          transform: 'translate(-50%, -40%)',
          width: '700px',
          height: '480px',
          background: 'radial-gradient(ellipse at center, rgba(200, 130, 10, 0.03) 0%, rgba(200, 130, 10, 0) 70%)',
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
            gap: '4.5rem',
            alignItems: 'center',
          }}
          className="syncora-layout"
        >
          <style>{`
            @media (max-width: 960px) {
              .syncora-layout {
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
              04 / PROJECT WORK
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
                SYNCORA
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
                Real-Time Team Collaboration &amp; Productivity Workspace
              </p>
            </div>

            {/* Positioning Line */}
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9375rem',
                color: '#AFA594',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              A unified workspace for communication, collaboration and team productivity.
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
              Syncora brings team messaging, channels, direct conversations, tasks and live meetings into one collaborative workspace.
            </p>

            {/* Core Capabilities */}
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
                REAL-TIME COLLABORATION · MESSAGING · TASKS · MEETINGS
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href="https://syncora-rho.vercel.app"
                target="_blank"
                rel="noreferrer"
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
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'background 200ms ease, border-color 200ms ease, transform 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(200, 130, 10, 0.12)';
                  e.currentTarget.style.borderColor = AMBER_LIGHT;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#141310';
                  e.currentTarget.style.borderColor = 'rgba(200, 130, 10, 0.35)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <ExternalLink size={13} color={AMBER_LIGHT} />
                <span>VIEW PROJECT ↗</span>
              </a>

              <a
                href="https://github.com/gpranit16/syncora"
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

              <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.75rem 1.15rem',
                  background: 'transparent',
                  border: '1px solid rgba(255, 248, 235, 0.08)',
                  color: '#8A8070',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  borderRadius: '3px',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#F5EFE0';
                  e.currentTarget.style.borderColor = 'rgba(255, 248, 235, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#8A8070';
                  e.currentTarget.style.borderColor = 'rgba(255, 248, 235, 0.08)';
                }}
              >
                <Layers size={13} />
                <span>{isOpen ? 'COLLAPSE ARCHIVE' : 'EXPAND ARCHIVE'}</span>
              </button>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN: Layered Product Showcase ── */}
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
              minHeight: '420px',
            }}
          >
            {/* Interactive Showcase Container */}
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => openViewer(0)}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '560px',
                aspectRatio: '16 / 10',
                cursor: 'pointer',
              }}
            >
              {/* Layer 3: Direct Messages & Voice Call (Deep Background Layer) */}
              <motion.div
                animate={
                  isHovered
                    ? { x: -38, y: -24, rotate: -3.5, scale: 0.94, opacity: 0.85 }
                    : { x: -14, y: -10, rotate: -1.5, scale: 0.96, opacity: 0.5 }
                }
                transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                onClick={(e) => {
                  e.stopPropagation();
                  openViewer(2);
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 248, 235, 0.08)',
                  boxShadow: '0 16px 32px -10px rgba(0, 0, 0, 0.8)',
                  background: '#12110E',
                  zIndex: 2,
                }}
              >
                <img
                  src={syncoraScreenshots[2].src}
                  alt={syncoraScreenshots[2].title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </motion.div>

              {/* Layer 2: Tasks Workspace (Mid Layer) */}
              <motion.div
                animate={
                  isHovered
                    ? { x: 32, y: -18, rotate: 2.5, scale: 0.97, opacity: 0.95 }
                    : { x: 12, y: -6, rotate: 1.2, scale: 0.98, opacity: 0.75 }
                }
                transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                onClick={(e) => {
                  e.stopPropagation();
                  openViewer(1);
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 248, 235, 0.12)',
                  boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.85)',
                  background: '#12110E',
                  zIndex: 3,
                }}
              >
                <img
                  src={syncoraScreenshots[1].src}
                  alt={syncoraScreenshots[1].title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '10px',
                    background: 'rgba(14, 13, 11, 0.88)',
                    backdropFilter: 'blur(4px)',
                    padding: '2px 7px',
                    borderRadius: '2px',
                    border: '1px solid rgba(255, 248, 235, 0.08)',
                  }}
                >
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5625rem', color: '#C8BFA8', letterSpacing: '0.08em' }}>
                    TASKS
                  </span>
                </div>
              </motion.div>

              {/* Layer 1: Dominant Primary Showcase (Team Channels & Chat) */}
              <motion.div
                animate={
                  isHovered
                    ? { x: 0, y: -4, scale: 1.01 }
                    : { x: 0, y: 0, scale: 1 }
                }
                transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 248, 235, 0.16)',
                  boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.95), 0 0 20px rgba(200, 130, 10, 0.04)',
                  background: '#12110E',
                  zIndex: 4,
                }}
              >
                {/* Header Window Bar */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '26px',
                    background: 'rgba(18, 17, 14, 0.92)',
                    backdropFilter: 'blur(8px)',
                    borderBottom: '1px solid rgba(255, 248, 235, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 10px',
                    zIndex: 2,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: AMBER }} />
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.58rem',
                        fontWeight: 600,
                        color: '#F5EFE0',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      SYNCORA / WORKSPACE
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8A8070' }}>
                    <Maximize2 size={11} />
                  </div>
                </div>

                <img
                  src={syncoraScreenshots[0].src}
                  alt={syncoraScreenshots[0].title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', paddingTop: '26px' }}
                />

                {/* Bottom status badge */}
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
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.5875rem',
                      fontWeight: 600,
                      color: '#F5EFE0',
                      letterSpacing: '0.08em',
                    }}
                  >
                    CHANNELS &amp; CHAT
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Bottom Caption Pill */}
            <div
              style={{
                marginTop: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#8A8070',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.625rem',
                letterSpacing: '0.08em',
              }}
            >
              <span>{syncoraScreenshots.length} PRODUCT WORKSPACES</span>
              <span>·</span>
              <span style={{ color: AMBER }}>CLICK TO EXPAND VIEWER</span>
            </div>
          </motion.div>
        </div>

        {/* ── Expandable Screenshot Archive Grid ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: '3.5rem' }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div
                style={{
                  padding: '2rem 1.75rem',
                  background: '#141310',
                  border: '1px solid rgba(255, 248, 235, 0.08)',
                  borderRadius: '6px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.65rem',
                      color: AMBER,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    SYNCORA / PRODUCT ARCHIVE ({syncoraScreenshots.length} VIEWS)
                  </span>

                  <button
                    onClick={() => setIsOpen(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#8A8070',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.625rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <X size={12} />
                    <span>CLOSE ARCHIVE</span>
                  </button>
                </div>

                {/* 4-Grid Archive Cards */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.25rem',
                  }}
                >
                  {syncoraScreenshots.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      onClick={() => openViewer(idx)}
                      whileHover={{ y: -3, borderColor: 'rgba(200, 130, 10, 0.35)' }}
                      style={{
                        background: '#0E0D0B',
                        border: '1px solid rgba(255, 248, 235, 0.08)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'border-color 200ms ease',
                      }}
                    >
                      <div style={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden' }}>
                        <img
                          src={item.src}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            background: 'rgba(14, 13, 11, 0.85)',
                            padding: '2px 5px',
                            borderRadius: '2px',
                            border: '1px solid rgba(255, 248, 235, 0.08)',
                            color: '#8A8070',
                          }}
                        >
                          <Maximize2 size={10} />
                        </div>
                      </div>

                      <div style={{ padding: '0.85rem 1rem' }}>
                        <p
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.625rem',
                            color: AMBER_LIGHT,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            margin: '0 0 0.35rem 0',
                            fontWeight: 600,
                          }}
                        >
                          {item.tag}
                        </p>
                        <p
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.78rem',
                            color: '#8A8070',
                            margin: 0,
                            lineHeight: 1.4,
                          }}
                        >
                          {item.subtitle}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Focused Image Lightbox / Modal ── */}
      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(10, 9, 8, 0.96)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1.5rem',
            }}
          >
            {/* Modal Top Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: '1.5rem',
                left: '2rem',
                right: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.72rem',
                    color: AMBER,
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                  }}
                >
                  0{activeIdx + 1} / 0{syncoraScreenshots.length}
                </span>
                <span style={{ color: '#5A5248' }}>·</span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.6875rem',
                    color: '#F5EFE0',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {syncoraScreenshots[activeIdx].tag}
                </span>
              </div>

              <button
                onClick={closeModal}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(255, 248, 235, 0.05)',
                  border: '1px solid rgba(255, 248, 235, 0.12)',
                  color: '#F5EFE0',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '3px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 160ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 248, 235, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 248, 235, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 248, 235, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 248, 235, 0.12)';
                }}
              >
                <X size={13} />
                <span>ESC</span>
              </button>
            </div>

            {/* Modal Image Display with Slide Animation */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '1020px',
                maxHeight: '75vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={activeIdx}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    maxHeight: '72vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={syncoraScreenshots[activeIdx].src}
                    alt={syncoraScreenshots[activeIdx].title}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '68vh',
                      objectFit: 'contain',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 248, 235, 0.12)',
                      boxShadow: '0 24px 60px -15px rgba(0, 0, 0, 0.95)',
                    }}
                  />

                  {/* Caption */}
                  <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: '#F5EFE0',
                        margin: '0 0 0.25rem 0',
                      }}
                    >
                      {syncoraScreenshots[activeIdx].title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.825rem',
                        color: '#8A8070',
                        margin: 0,
                      }}
                    >
                      {syncoraScreenshots[activeIdx].subtitle}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next Nav Buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                style={{
                  position: 'absolute',
                  left: '-1.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(20, 19, 16, 0.85)',
                  border: '1px solid rgba(255, 248, 235, 0.12)',
                  color: '#F5EFE0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 20,
                  transition: 'all 160ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = AMBER_LIGHT;
                  e.currentTarget.style.background = 'rgba(20, 19, 16, 0.95)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 248, 235, 0.12)';
                  e.currentTarget.style.background = 'rgba(20, 19, 16, 0.85)';
                }}
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                style={{
                  position: 'absolute',
                  right: '-1.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(20, 19, 16, 0.85)',
                  border: '1px solid rgba(255, 248, 235, 0.12)',
                  color: '#F5EFE0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 20,
                  transition: 'all 160ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = AMBER_LIGHT;
                  e.currentTarget.style.background = 'rgba(20, 19, 16, 0.95)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 248, 235, 0.12)';
                  e.currentTarget.style.background = 'rgba(20, 19, 16, 0.85)';
                }}
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
