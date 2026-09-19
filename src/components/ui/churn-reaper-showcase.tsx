import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Layers, Maximize2, Terminal, ExternalLink } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import ChurnAssistant from './churn-assistant';

const AMBER = '#C8820A';
const AMBER_LIGHT = '#D4960F';

interface ChurnScreenshot {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  tag: string;
}

const churnScreenshots: ChurnScreenshot[] = [
  {
    id: 'retention',
    title: 'CHURN REAPER — RETENTION & ECONOMICS',
    subtitle: 'Deterministic financial evaluation of candidate retention strategies and profit-at-risk',
    src: '/assets/churn_retention.png',
    tag: 'RETENTION & ECONOMICS',
  },
  {
    id: 'hero',
    title: 'CHURN REAPER — PRODUCT CHURN',
    subtitle: 'Executive intelligence platform overview combining regularized XGBoost & NVIDIA Nemotron',
    src: '/assets/churn_hero.png',
    tag: 'PRODUCT CHURN',
  },
  {
    id: 'dataset',
    title: 'CHURN REAPER — MODEL / SIMULATION',
    subtitle: 'Dataset churn analysis studio with automated target detection & single customer inspection',
    src: '/assets/churn_dataset.png',
    tag: 'MODEL / SIMULATION',
  },
];

export default function ChurnReaperShowcase() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [direction, setDirection] = useState<number>(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Body scroll locking when full lightbox is active
  useEffect(() => {
    if (activeIdx !== null) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [activeIdx]);

  const prevImage = useCallback(() => {
    setDirection(-1);
    setActiveIdx((curr) => {
      if (curr === null) return 0;
      return (curr - 1 + churnScreenshots.length) % churnScreenshots.length;
    });
  }, []);

  const nextImage = useCallback(() => {
    setDirection(1);
    setActiveIdx((curr) => {
      if (curr === null) return 0;
      return (curr + 1) % churnScreenshots.length;
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

  // Touch / Pan handling for lightbox modal
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
      id="churn-reaper"
      style={{
        position: 'relative',
        padding: 'clamp(3.5rem, 6vw, 5.5rem) clamp(1rem, 3vw, 2rem)',
        background: '#0E0D0B',
      }}
    >
      {/* Ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '20%',
          transform: 'translate(-50%, -35%)',
          width: '750px',
          height: '500px',
          background: 'radial-gradient(ellipse at center, rgba(200, 130, 10, 0.03) 0%, rgba(200, 130, 10, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: '1240px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}
      >
        {/* 2-Part Editorial Composition */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1.25fr)',
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'center',
          }}
          className="churn-layout"
        >
          <style>{`
            @media (max-width: 960px) {
              .churn-layout {
                grid-template-columns: 1fr !important;
                gap: 2.5rem !important;
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
            {/* Project Index & Category Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.65rem',
                  color: AMBER_LIGHT,
                  background: 'rgba(200, 130, 10, 0.1)',
                  border: '1px solid rgba(200, 130, 10, 0.28)',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  letterSpacing: '0.12em',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                PROJECT 03 / 03
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.65rem',
                  color: '#8A8070',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  fontWeight: 500,
                }}
              >
                APPLIED ML &amp; RETENTION INTELLIGENCE
              </span>
            </div>

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
                CHURN REAPER
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(1.05rem, 1.35vw, 1.2rem)',
                  color: '#57D4A2',
                  margin: 0,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                }}
              >
                AI-Assisted Retention Intelligence Platform
              </p>
            </div>

            {/* Positioning Line */}
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9375rem',
                color: '#D4C9B4',
                lineHeight: 1.6,
                margin: 0,
                maxWidth: '520px',
              }}
            >
              Where <span style={{ color: '#57D4A2', fontWeight: 600 }}>predictive machine learning</span>, <span style={{ color: '#E8A838', fontWeight: 600 }}>TreeSHAP risk attribution</span>, and <span style={{ color: '#68B5E8', fontWeight: 600 }}>retention economics</span> come together.
            </p>

            {/* Description */}
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9375rem',
                lineHeight: 1.75,
                color: '#AFA594',
                margin: 0,
                maxWidth: '540px',
              }}
            >
              Combines a <span style={{ color: '#57D4A2', fontWeight: 500 }}>regularized XGBoost model (84.81% ROC-AUC)</span>, <span style={{ color: '#E8A838', fontWeight: 500 }}>TreeSHAP risk drivers</span>, and <span style={{ color: '#A78BFA', fontWeight: 500 }}>NVIDIA Nemotron 30B</span> with a <span style={{ color: '#F5EFE0', fontWeight: 500 }}>deterministic financial engine</span> to validate net ROI before spending retention capital.
            </p>

            {/* Colorful Capabilities Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.25rem' }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.625rem',
                  color: '#57D4A2',
                  background: 'rgba(87, 212, 162, 0.08)',
                  border: '1px solid rgba(87, 212, 162, 0.25)',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                REGULARIZED XGBOOST · 84.81% AUC
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.625rem',
                  color: '#E8A838',
                  background: 'rgba(232, 168, 56, 0.08)',
                  border: '1px solid rgba(232, 168, 56, 0.25)',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                TREESHAP ATTRIBUTION
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.625rem',
                  color: '#A78BFA',
                  background: 'rgba(167, 139, 250, 0.08)',
                  border: '1px solid rgba(167, 139, 250, 0.25)',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                NVIDIA NEMOTRON 30B
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.625rem',
                  color: '#68B5E8',
                  background: 'rgba(104, 181, 232, 0.08)',
                  border: '1px solid rgba(104, 181, 232, 0.25)',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                DETERMINISTIC ROI ENGINE
              </span>
            </div>

            {/* Actions (Single Unified Row) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.7rem 1.25rem',
                  background: '#141310',
                  border: `1px solid rgba(200, 130, 10, 0.35)`,
                  color: '#F5EFE0',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
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
                href="https://churn-reaper-y1d3.vercel.app"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.7rem 1.25rem',
                  background: 'transparent',
                  border: '1px solid rgba(255, 248, 235, 0.12)',
                  color: '#C8BFA8',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  borderRadius: '3px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
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
                <ExternalLink size={13} color={AMBER_LIGHT} />
                <span>VIEW PROJECT ↗</span>
              </a>

              <a
                href="https://github.com/gpranit16/churn-reaper"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.7rem 1.25rem',
                  background: 'transparent',
                  border: '1px solid rgba(255, 248, 235, 0.12)',
                  color: '#C8BFA8',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  borderRadius: '3px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
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
                  CHURN REAPER / WORKSPACE
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
                {/* 3rd Screenshot: Dataset Studio (Deepest layer) */}
                <motion.div
                  animate={
                    isOpen
                      ? { x: isMobile ? -35 : -110, y: isMobile ? -18 : -45, rotate: isMobile ? -5 : -10, scale: 0.88, opacity: 0.85 }
                      : isHovered
                      ? { x: isMobile ? -16 : -45, y: isMobile ? -10 : -22, rotate: -5, scale: 0.92, opacity: 0.6 }
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
                    src={churnScreenshots[2].src}
                    alt={churnScreenshots[2].title}
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
                      MODEL / SIMULATION
                    </span>
                  </div>
                </motion.div>

                {/* 2nd Screenshot: Product Overview (Secondary layer) */}
                <motion.div
                  animate={
                    isOpen
                      ? { x: isMobile ? -20 : -75, y: isMobile ? -10 : -24, rotate: -5.5, scale: 0.94, opacity: 1 }
                      : isHovered
                      ? { x: isMobile ? -12 : -28, y: -14, rotate: -3, scale: 0.96, opacity: 0.9 }
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
                    src={churnScreenshots[1].src}
                    alt={churnScreenshots[1].title}
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
                      PRODUCT CHURN
                    </span>
                  </div>
                </motion.div>

                {/* 1st Screenshot: Dominant Retention & Economics Hero */}
                <motion.div
                  animate={
                    isOpen
                      ? { x: isMobile ? 20 : 55, y: isMobile ? -14 : -38, rotate: 2.8, scale: 1.03 }
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
                    src={churnScreenshots[0].src}
                    alt={churnScreenshots[0].title}
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
                      RETENTION &amp; ECONOMICS
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

              {/* Folder Front Lip Pocket (Matches Syncora Exact Style) */}
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
                  03 ASSETS
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── CHURN REAPER AI Project Intelligence CTA Strip (Exact Syncora/TARK Style) ── */}
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
                CURIOUS ABOUT CHURN REAPER?
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
                Ask about its architecture, XGBoost tuning, TreeSHAP attribution, Nemotron, and financial ROI engine.
              </p>
            </div>
          </div>

          {/* Right CTA Button */}
          <button
            onClick={() => setIsChatOpen(true)}
            style={{
              padding: '0.65rem 1.25rem',
              background: 'rgba(200, 130, 10, 0.12)',
              border: '1px solid rgba(200, 130, 10, 0.35)',
              color: '#F5EFE0',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              borderRadius: '3px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background 200ms ease, border-color 200ms ease, transform 200ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = AMBER;
              e.currentTarget.style.color = '#0E0D0B';
              e.currentTarget.style.borderColor = AMBER;
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(200, 130, 10, 0.12)';
              e.currentTarget.style.color = '#F5EFE0';
              e.currentTarget.style.borderColor = 'rgba(200, 130, 10, 0.35)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <span>ASK CHURN REAPER ↗</span>
          </button>
        </motion.div>
      </motion.div>

      {/* ── FOCUSED SCREENSHOT LIGHTBOX VIEWER ── */}
      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5, 5, 4, 0.94)',
              backdropFilter: 'blur(12px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '1100px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                background: '#141310',
                borderRadius: '6px',
                border: '1px solid rgba(255, 248, 235, 0.12)',
                boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.95)',
                overflow: 'hidden',
              }}
            >
              {/* Lightbox Header Bar */}
              <div
                style={{
                  padding: '0.85rem 1.25rem',
                  borderBottom: '1px solid rgba(255, 248, 235, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#0E0D0B',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: AMBER_LIGHT,
                      letterSpacing: '0.1em',
                    }}
                  >
                    {String(activeIdx + 1).padStart(2, '0')} / {String(churnScreenshots.length).padStart(2, '0')}
                  </span>
                  <span style={{ color: 'rgba(255, 248, 235, 0.2)' }}>|</span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      color: '#F5EFE0',
                    }}
                  >
                    {churnScreenshots[activeIdx].title}
                  </span>
                </div>

                <button
                  onClick={closeModal}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#8A8070',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '3px',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Main Image Stage */}
              <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={handleDragEnd}
                style={{
                  position: 'relative',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  minHeight: '360px',
                  maxHeight: 'calc(90vh - 120px)',
                  background: '#0E0D0B',
                  overflow: 'hidden',
                }}
              >
                <AnimatePresence custom={direction} mode="wait">
                  <motion.img
                    key={activeIdx}
                    src={churnScreenshots[activeIdx].src}
                    alt={churnScreenshots[activeIdx].title}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    style={{
                      maxWidth: '100%',
                      maxHeight: 'calc(80vh - 120px)',
                      objectFit: 'contain',
                      borderRadius: '3px',
                      border: '1px solid rgba(255, 248, 235, 0.06)',
                    }}
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(20, 19, 16, 0.8)',
                    border: '1px solid rgba(255, 248, 235, 0.15)',
                    color: '#F5EFE0',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(6px)',
                    transition: 'border-color 200ms ease, background 200ms ease',
                  }}
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={nextImage}
                  style={{
                    position: 'absolute',
                    right: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(20, 19, 16, 0.8)',
                    border: '1px solid rgba(255, 248, 235, 0.15)',
                    color: '#F5EFE0',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(6px)',
                    transition: 'border-color 200ms ease, background 200ms ease',
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </motion.div>

              {/* Lightbox Footer Caption */}
              <div
                style={{
                  padding: '0.75rem 1.25rem',
                  borderTop: '1px solid rgba(255, 248, 235, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#141310',
                }}
              >
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.75rem',
                    color: '#8A8070',
                    margin: 0,
                  }}
                >
                  {churnScreenshots[activeIdx].subtitle}
                </p>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.625rem',
                    color: '#5A5248',
                    letterSpacing: '0.08em',
                  }}
                >
                  ESC TO CLOSE · ← / → ARROWS
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Dedicated Floating Project Assistant ── */}
      <ChurnAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </section>
  );
}
