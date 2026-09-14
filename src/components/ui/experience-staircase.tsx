import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Globe } from 'lucide-react';

// Restrained 3-Accent System (Warm Metallics)
const COLOR_01_AMBER = '#C8820A';
const COLOR_02_COPPER = '#B86F3D';
const COLOR_03_GOLD = '#D4A84F';

interface Milestone {
  id: string;
  stepNumber: string;
  role: string;
  org: string;
  accentColor: string;
  category: string;
  period: string;
  isCurrent?: boolean;
  description: string;
  tags: string[];
  actionText: string;
  actionUrl: string;
  actionType: 'website' | 'certificate';
}

const milestones: Milestone[] = [
  {
    id: 'ieee-embs',
    stepNumber: '01',
    role: 'Webmaster',
    org: 'IEEE EMBS — BMSIT&M',
    accentColor: COLOR_01_AMBER,
    category: 'COLLEGE COMMUNITY',
    period: 'Nov 2025 — Present',
    isCurrent: true,
    description:
      'Leading and maintaining the digital presence of IEEE EMBS through production-level web experiences, technical collaboration, event systems and intelligent digital workflows.',
    tags: ['Web Systems', 'Frontend Architecture', 'Community Tech'],
    actionText: 'VISIT WEBSITE ↗',
    actionUrl: 'https://embs-swart.vercel.app/',
    actionType: 'website',
  },
  {
    id: 'velox',
    stepNumber: '02',
    role: 'Full-Stack Development Intern',
    org: 'VeloxCodeAgency',
    accentColor: COLOR_02_COPPER,
    category: 'INTERNSHIP',
    period: '01 Jun 2026 — 30 Jun 2026',
    description:
      'Worked across full-stack development workflows during a focused internship, contributing to project implementation, learning and delivery.',
    tags: ['Full-Stack', 'Component Architecture', 'Delivery'],
    actionText: 'VIEW CERTIFICATE ↗',
    actionUrl: 'https://drive.google.com/file/d/1MJuRGNHNQLjjpQ9AkhTeTl3RlBvZgKb6/view?usp=sharing',
    actionType: 'certificate',
  },
  {
    id: 'successpath',
    stepNumber: '03',
    role: 'Full Stack Developer (Intern)',
    org: 'SuccessPath Classes',
    accentColor: COLOR_03_GOLD,
    category: 'INTERNSHIP',
    period: '19 Jan 2026 — 18 Feb 2026',
    description:
      'Contributed to assigned full-stack development work, building and improving application features while working across frontend and backend workflows.',
    tags: ['Application Features', 'Frontend & Backend', 'Workflows'],
    actionText: 'VIEW CERTIFICATE ↗',
    actionUrl: 'https://drive.google.com/file/d/193ISjwIzy7bkkUmtbc-QTjghxW0ASUvi/view?usp=sharing',
    actionType: 'certificate',
  },
];

// Desktop Path: Node 01 (0, 605) -> Node 02 (240, 325) -> Node 03 (480, 45)
const DESKTOP_PATH_D = "M 0 710 L 0 605 L 0 465 Q 0 445 20 445 L 220 445 Q 240 445 240 425 L 240 325 L 240 185 Q 240 165 260 165 L 460 165 Q 480 165 480 145 L 480 45 L 480 0";

export default function ExperienceStaircase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: '-60px' });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section
      id="experience"
      ref={containerRef}
      style={{
        position: 'relative',
        padding: '5.5rem 2rem 5rem',
        background: '#0E0D0B',
        overflow: 'hidden',
        minHeight: '980px',
      }}
    >
      <style>{`
        .staircase-desktop-layout {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2.5rem;
          position: relative;
          width: 100%;
          min-height: 820px;
        }
        .staircase-left-col {
          flex: 0 0 320px;
          max-width: 340px;
          position: sticky;
          top: 100px;
          z-index: 10;
        }
        .staircase-right-col {
          flex: 1 1 920px;
          max-width: 950px;
          height: 800px;
          position: relative;
        }
        .staircase-mobile-canvas {
          display: none;
        }
        @media (max-width: 1140px) {
          .staircase-desktop-layout {
            display: none !important;
          }
          .staircase-mobile-canvas {
            display: flex !important;
            flex-direction: column;
            gap: 2.5rem;
            position: relative;
            padding-left: 1.5rem;
            margin-top: 2rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Subtle ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          right: '15%',
          width: '700px',
          height: '500px',
          background: 'radial-gradient(ellipse at center, rgba(200, 130, 10, 0.035) 0%, rgba(200, 130, 10, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div style={{ maxWidth: '1320px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
        
        {/* ── DESKTOP STAIRCASE 2-COLUMN LAYOUT ── */}
        <div className="staircase-desktop-layout">
          
          {/* 1. LEFT INTRO COLUMN */}
          <div className="staircase-left-col">
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6875rem',
                color: COLOR_01_AMBER,
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                fontWeight: 600,
                margin: '0 0 1.15rem 0',
              }}
            >
              05 / WHERE I&apos;VE BUILT
            </motion.p>

            {/* Main heading */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2.5rem, 3.8vw, 3.5rem)',
                fontWeight: 700,
                fontStyle: 'italic',
                color: '#F5EFE0',
                lineHeight: 1.08,
                letterSpacing: '-0.025em',
                margin: '0 0 0.85rem 0',
              }}
            >
              Where I&apos;ve Built.
            </motion.h2>

            {/* Sub-label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.625rem',
                color: '#5A5248',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                margin: '0 0 1.85rem 0',
              }}
            >
              ENGINEERING · INTELLIGENT SYSTEMS · PRODUCT
            </motion.p>

            {/* Supporting Copy with Amber Left Border Bar */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.45, delay: 0.22 }}
              style={{
                borderLeft: `2px solid ${COLOR_01_AMBER}`,
                paddingLeft: '1.15rem',
                marginBottom: '2.5rem',
              }}
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.88rem',
                  lineHeight: 1.65,
                  color: '#C8BFA8',
                  margin: 0,
                }}
              >
                A journey through the teams, communities and projects where I&apos;ve built, learned and shipped impactful systems.
              </p>
            </motion.div>

            {/* Left Editorial Detail */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                opacity: 0.7,
              }}
            >
              <div style={{ width: '18px', height: '1.5px', background: COLOR_01_AMBER }} />
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.58rem',
                  lineHeight: 1.45,
                  color: '#5A5248',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                BETTER SYSTEMS.<br />
                FOR A BRIGHTER TOMORROW.
              </p>
            </div>
          </div>

          {/* 2. RIGHT STAIRCASE CANVAS */}
          <div className="staircase-right-col">
            
            {/* CONTINUOUS SVG STAIRCASE CIRCUIT PATH & 2-WAY TRAVELING LIGHT */}
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 2,
                overflow: 'visible',
              }}
            >
              <defs>
                <filter id="staircaseGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="pathGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={COLOR_01_AMBER} stopOpacity="0.6" />
                  <stop offset="50%" stopColor={COLOR_02_COPPER} stopOpacity="0.6" />
                  <stop offset="100%" stopColor={COLOR_03_GOLD} stopOpacity="0.6" />
                </linearGradient>
              </defs>

              {/* Base Staircase Path */}
              <motion.path
                id="desktopStaircasePath"
                d={DESKTOP_PATH_D}
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 0.75 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 1.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Traveling Light (Continuous 2-Way Loop: 01 -> 02 -> 03 -> 02 -> 01) */}
              {isInView && (
                <g>
                  {/* Outer glow */}
                  <circle r="6" fill={COLOR_01_AMBER} opacity="0.45" filter="url(#staircaseGlow)">
                    <animateMotion
                      dur="6.4s"
                      begin="0.2s"
                      repeatCount="indefinite"
                      path={DESKTOP_PATH_D}
                      keyPoints="0;1;0"
                      keyTimes="0;0.5;1"
                      calcMode="linear"
                    />
                    <animate
                      attributeName="fill"
                      values={`${COLOR_01_AMBER};${COLOR_02_COPPER};${COLOR_03_GOLD};${COLOR_02_COPPER};${COLOR_01_AMBER}`}
                      keyTimes="0;0.25;0.5;0.75;1"
                      dur="6.4s"
                      begin="0.2s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Crisp center core */}
                  <circle r="2.5" fill="#F5EFE0">
                    <animateMotion
                      dur="6.4s"
                      begin="0.2s"
                      repeatCount="indefinite"
                      path={DESKTOP_PATH_D}
                      keyPoints="0;1;0"
                      keyTimes="0;0.5;1"
                      calcMode="linear"
                    />
                  </circle>
                </g>
              )}
            </svg>

            {/* ── STEP 01: IEEE EMBS (Lowest / Left-most Step) ── */}
            {/* Top: 570px, Left: 24px, Width: 410px. Zero overlap with Step 02 (Top: 285px) */}
            <div
              style={{
                position: 'absolute',
                top: '570px',
                left: '24px',
                width: '410px',
                zIndex: 5,
              }}
            >
              {/* Node 01 */}
              <div style={{ position: 'absolute', left: '-24px', top: '35px', transform: 'translate(-50%, -50%)', zIndex: 8 }}>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  transition={{ duration: 0.45, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.6875rem',
                      color: COLOR_01_AMBER,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                    }}
                  >
                    01
                  </span>
                  <div
                    style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      background: COLOR_01_AMBER,
                      boxShadow: `0 0 8px ${COLOR_01_AMBER}, 0 0 2px #F5EFE0`,
                    }}
                  />
                </motion.div>
              </div>

              {/* Card 01 */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredIdx(0)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  background: '#141310',
                  border: `1px solid ${hoveredIdx === 0 ? 'rgba(200, 130, 10, 0.4)' : 'rgba(200, 130, 10, 0.15)'}`,
                  borderRadius: '4px',
                  padding: '1.25rem 1.45rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.7rem',
                  boxShadow: hoveredIdx === 0
                    ? '0 16px 36px -10px rgba(0, 0, 0, 0.8), 0 0 16px rgba(200, 130, 10, 0.08)'
                    : '0 10px 24px -10px rgba(0, 0, 0, 0.6)',
                  transition: 'border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease',
                  transform: hoveredIdx === 0 ? 'translateY(-2px)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: '#F5EFE0',
                        lineHeight: 1.2,
                        letterSpacing: '-0.01em',
                        margin: '0 0 0.2rem 0',
                      }}
                    >
                      Webmaster
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.85rem',
                        color: COLOR_01_AMBER,
                        fontWeight: 600,
                        margin: 0,
                      }}
                    >
                      IEEE EMBS — BMSIT&amp;M
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'rgba(200, 130, 10, 0.08)',
                      border: '1px solid rgba(200, 130, 10, 0.25)',
                      padding: '3px 8px',
                      borderRadius: '3px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: COLOR_01_AMBER, boxShadow: `0 0 5px ${COLOR_01_AMBER}` }} />
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.6rem',
                        color: COLOR_01_AMBER,
                        letterSpacing: '0.06em',
                        fontWeight: 600,
                      }}
                    >
                      Nov 2025 — Present
                    </span>
                  </div>
                </div>

                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.82rem',
                    lineHeight: 1.6,
                    color: '#C8BFA8',
                    margin: 0,
                  }}
                >
                  {milestones[0].description}
                </p>

                {/* Skill Chips */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {milestones[0].tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.56rem',
                        color: COLOR_01_AMBER,
                        background: 'rgba(200, 130, 10, 0.05)',
                        border: '1px solid rgba(200, 130, 10, 0.15)',
                        padding: '2px 5px',
                        borderRadius: '3px',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ paddingTop: '0.35rem', borderTop: '1px solid rgba(255, 248, 235, 0.06)' }}>
                  <a
                    href="https://embs-swart.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: '#8A8070',
                      textDecoration: 'none',
                      letterSpacing: '0.06em',
                      transition: 'color 160ms ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = COLOR_01_AMBER)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8070')}
                  >
                    <Globe size={12} color={COLOR_01_AMBER} />
                    <span>VISIT WEBSITE ↗</span>
                  </a>
                </div>
              </motion.div>
            </div>

            {/* ── STEP 02: VeloxCodeAgency (Middle Step) ── */}
            {/* Top: 285px, Left: 264px, Width: 410px. Zero overlap with Step 03 (Top: 0px) and Step 01 (Top: 570px) */}
            <div
              style={{
                position: 'absolute',
                top: '285px',
                left: '264px',
                width: '410px',
                zIndex: 6,
              }}
            >
              {/* Node 02 */}
              <div style={{ position: 'absolute', left: '-24px', top: '35px', transform: 'translate(-50%, -50%)', zIndex: 8 }}>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  transition={{ duration: 0.45, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.6875rem',
                      color: COLOR_02_COPPER,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                    }}
                  >
                    02
                  </span>
                  <div
                    style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      background: COLOR_02_COPPER,
                      boxShadow: `0 0 8px ${COLOR_02_COPPER}, 0 0 2px #F5EFE0`,
                    }}
                  />
                </motion.div>
              </div>

              {/* Card 02 */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredIdx(1)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  background: '#141310',
                  border: `1px solid ${hoveredIdx === 1 ? 'rgba(184, 111, 61, 0.4)' : 'rgba(184, 111, 61, 0.15)'}`,
                  borderRadius: '4px',
                  padding: '1.25rem 1.45rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.7rem',
                  boxShadow: hoveredIdx === 1
                    ? '0 16px 36px -10px rgba(0, 0, 0, 0.8), 0 0 16px rgba(184, 111, 61, 0.08)'
                    : '0 10px 24px -10px rgba(0, 0, 0, 0.6)',
                  transition: 'border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease',
                  transform: hoveredIdx === 1 ? 'translateY(-2px)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: '#F5EFE0',
                        lineHeight: 1.2,
                        letterSpacing: '-0.01em',
                        margin: '0 0 0.2rem 0',
                      }}
                    >
                      Full-Stack Development Intern
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.85rem',
                        color: COLOR_02_COPPER,
                        fontWeight: 600,
                        margin: 0,
                      }}
                    >
                      VeloxCodeAgency
                    </p>
                  </div>

                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.6rem',
                      color: '#8A8070',
                      letterSpacing: '0.06em',
                      background: 'rgba(255, 248, 235, 0.04)',
                      border: '1px solid rgba(255, 248, 235, 0.1)',
                      padding: '3px 8px',
                      borderRadius: '3px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    01 Jun 2026 — 30 Jun 2026
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.82rem',
                    lineHeight: 1.6,
                    color: '#C8BFA8',
                    margin: 0,
                  }}
                >
                  {milestones[1].description}
                </p>

                {/* Skill Chips */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {milestones[1].tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.56rem',
                        color: COLOR_02_COPPER,
                        background: 'rgba(184, 111, 61, 0.05)',
                        border: '1px solid rgba(184, 111, 61, 0.15)',
                        padding: '2px 5px',
                        borderRadius: '3px',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ paddingTop: '0.35rem', borderTop: '1px solid rgba(255, 248, 235, 0.06)' }}>
                  <a
                    href={milestones[1].actionUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      color: '#8A8070',
                      textDecoration: 'none',
                      letterSpacing: '0.06em',
                      transition: 'color 160ms ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = COLOR_02_COPPER)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8070')}
                  >
                    <Award size={12} color="#5A5248" />
                    <span>VIEW CERTIFICATE ↗</span>
                  </a>
                </div>
              </motion.div>
            </div>

            {/* ── STEP 03: SuccessPath Classes (Highest Step) ── */}
            {/* Top: 0px, Left: 504px, Width: 410px. Zero overlap with Step 02 (Top: 285px) */}
            <div
              style={{
                position: 'absolute',
                top: '0px',
                left: '504px',
                width: '410px',
                zIndex: 7,
              }}
            >
              {/* Node 03 */}
              <div style={{ position: 'absolute', left: '-24px', top: '35px', transform: 'translate(-50%, -50%)', zIndex: 8 }}>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  transition={{ duration: 0.45, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.6875rem',
                      color: COLOR_03_GOLD,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                    }}
                  >
                    03
                  </span>
                  <div
                    style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      background: COLOR_03_GOLD,
                      boxShadow: `0 0 8px ${COLOR_03_GOLD}, 0 0 2px #F5EFE0`,
                    }}
                  />
                </motion.div>
              </div>

              {/* Card 03 */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.5, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredIdx(2)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  background: '#141310',
                  border: `1px solid ${hoveredIdx === 2 ? 'rgba(212, 168, 79, 0.4)' : 'rgba(212, 168, 79, 0.15)'}`,
                  borderRadius: '4px',
                  padding: '1.25rem 1.45rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.7rem',
                  boxShadow: hoveredIdx === 2
                    ? '0 16px 36px -10px rgba(0, 0, 0, 0.8), 0 0 16px rgba(212, 168, 79, 0.08)'
                    : '0 10px 24px -10px rgba(0, 0, 0, 0.6)',
                  transition: 'border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease',
                  transform: hoveredIdx === 2 ? 'translateY(-2px)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: '#F5EFE0',
                        lineHeight: 1.2,
                        letterSpacing: '-0.01em',
                        margin: '0 0 0.2rem 0',
                      }}
                    >
                      Full Stack Developer (Intern)
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.85rem',
                        color: COLOR_03_GOLD,
                        fontWeight: 600,
                        margin: 0,
                      }}
                    >
                      SuccessPath Classes
                    </p>
                  </div>

                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.6rem',
                      color: '#8A8070',
                      letterSpacing: '0.06em',
                      background: 'rgba(255, 248, 235, 0.04)',
                      border: '1px solid rgba(255, 248, 235, 0.1)',
                      padding: '3px 8px',
                      borderRadius: '3px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    19 Jan 2026 — 18 Feb 2026
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.82rem',
                    lineHeight: 1.6,
                    color: '#C8BFA8',
                    margin: 0,
                  }}
                >
                  {milestones[2].description}
                </p>

                {/* Skill Chips */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {milestones[2].tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.56rem',
                        color: COLOR_03_GOLD,
                        background: 'rgba(212, 168, 79, 0.05)',
                        border: '1px solid rgba(212, 168, 79, 0.15)',
                        padding: '2px 5px',
                        borderRadius: '3px',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ paddingTop: '0.35rem', borderTop: '1px solid rgba(255, 248, 235, 0.06)' }}>
                  <a
                    href={milestones[2].actionUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      color: '#8A8070',
                      textDecoration: 'none',
                      letterSpacing: '0.06em',
                      transition: 'color 160ms ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = COLOR_03_GOLD)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8070')}
                  >
                    <Award size={12} color="#5A5248" />
                    <span>VIEW CERTIFICATE ↗</span>
                  </a>
                </div>
              </motion.div>
            </div>

          </div>

        </div>

        {/* ── MOBILE PROGRESSIVE TIMELINE ── */}
        <div className="staircase-mobile-canvas">
          {/* Mobile Section Header */}
          <div>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6875rem',
                color: COLOR_01_AMBER,
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                fontWeight: 600,
                margin: '0 0 0.85rem 0',
              }}
            >
              05 / WHERE I&apos;VE BUILT
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2.5rem',
                fontWeight: 700,
                fontStyle: 'italic',
                color: '#F5EFE0',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                margin: '0 0 0.65rem 0',
              }}
            >
              Where I&apos;ve Built.
            </h2>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.58rem',
                color: '#5A5248',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                margin: '0 0 1.25rem 0',
              }}
            >
              ENGINEERING · INTELLIGENT SYSTEMS · PRODUCT
            </p>
            <div style={{ borderLeft: `2px solid ${COLOR_01_AMBER}`, paddingLeft: '1rem' }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', lineHeight: 1.6, color: '#C8BFA8', margin: 0 }}>
                A journey through the teams, communities and projects where I&apos;ve built, learned and shipped impactful systems.
              </p>
            </div>
          </div>

          {/* Stepped Timeline on Mobile */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <svg
              style={{
                position: 'absolute',
                left: '-1rem',
                top: '1rem',
                bottom: '1rem',
                width: '6px',
                height: 'calc(100% - 2rem)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              <line x1="1" y1="0" x2="1" y2="100%" stroke={COLOR_01_AMBER} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              {isInView && (
                <circle r="3" fill="#F5EFE0">
                  <animateMotion
                    dur="5.5s"
                    repeatCount="indefinite"
                    path="M 1 0 L 1 500"
                    keyPoints="0;1;0"
                    keyTimes="0;0.5;1"
                    calcMode="linear"
                  />
                </circle>
              )}
            </svg>

            {milestones.map((m, idx) => {
              const mobileIndent = idx === 0 ? '0px' : idx === 1 ? '10px' : '20px';

              return (
                <div
                  key={m.id}
                  style={{
                    position: 'relative',
                    transform: `translateX(${mobileIndent})`,
                  }}
                >
                  {/* Step node dot */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-1.45rem',
                      top: '1.25rem',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: '#141310',
                      border: `1.5px solid ${m.accentColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 3,
                    }}
                  >
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: m.accentColor }} />
                  </div>

                  {/* Card Content */}
                  <div
                    style={{
                      background: '#141310',
                      border: `1px solid ${m.accentColor}25`,
                      borderRadius: '4px',
                      padding: '1.3rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: m.accentColor, fontWeight: 700 }}>
                        STEP {m.stepNumber}
                      </span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.56rem', color: '#8A8070' }}>
                        {m.period}
                      </span>
                    </div>

                    <div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', color: '#F5EFE0', margin: '0 0 0.25rem 0' }}>
                        {m.role}
                      </h3>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: m.accentColor, margin: 0, fontWeight: 600 }}>
                        {m.org}
                      </p>
                    </div>

                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.82rem', lineHeight: 1.6, color: '#C8BFA8', margin: 0 }}>
                      {m.description}
                    </p>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {m.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.56rem',
                            color: m.accentColor,
                            background: `${m.accentColor}10`,
                            border: `1px solid ${m.accentColor}25`,
                            padding: '2px 5px',
                            borderRadius: '3px',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div style={{ paddingTop: '0.35rem', borderTop: '1px solid rgba(255, 248, 235, 0.06)' }}>
                      <a
                        href={m.actionUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.65rem',
                          color: '#8A8070',
                          textDecoration: 'none',
                          fontWeight: 600,
                        }}
                      >
                        {m.actionType === 'website' ? <Globe size={11} color={m.accentColor} /> : <Award size={11} color="#5A5248" />}
                        <span>{m.actionText}</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── FOOTER SCROLL CUE & INDEX ── */}
        <div
          style={{
            marginTop: '3.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '1.5rem',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Bottom-left: Mouse pill icon + scroll text + line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '14px',
                height: '22px',
                borderRadius: '8px',
                border: '1.5px solid #5A5248',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '3px',
              }}
            >
              <div
                style={{
                  width: '2px',
                  height: '4px',
                  borderRadius: '1px',
                  background: COLOR_01_AMBER,
                }}
              />
            </div>

            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.58rem',
                color: '#5A5248',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                lineHeight: 1.3,
              }}
            >
              SCROLL<br />TO EXPLORE
            </span>

            <div style={{ width: '45px', height: '1px', background: '#3A342D', marginLeft: '0.5rem' }} />
          </div>

          {/* Bottom-right: [ 05 / 05 ] */}
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.625rem',
              color: '#5A5248',
              letterSpacing: '0.12em',
            }}
          >
            [ 05 / 05 ]
          </span>
        </div>

      </div>
    </section>
  );
}
