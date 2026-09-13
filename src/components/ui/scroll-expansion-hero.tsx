import { useEffect, useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';

const SENS = 0.0025;
const AMBER = '#D4960F';
const AMBER_ACCENT = '#C8820A';

interface Capability {
  num: string;
  title: string;
  sub: string;
}

const capabilities: Capability[] = [
  {
    num: '01',
    title: 'AI Systems',
    sub: 'RAG · AGENTS · LLM WORKFLOWS',
  },
  {
    num: '02',
    title: 'Product Engineering',
    sub: 'FULL STACK · BACKEND · DATABASES',
  },
  {
    num: '03',
    title: 'Automation',
    sub: 'WORKFLOWS · APIS · AI-POWERED TOOLS',
  },
];

export default function ScrollExpandHero({
  mediaSrc,
  bgImageSrc,
  children,
}: {
  mediaSrc: string;
  bgImageSrc?: string;
  children?: ReactNode;
}) {
  const pRef = useRef(0);
  const lockedRef = useRef(true);
  const spring = useSpring(0, { stiffness: 55, damping: 22, mass: 0.9 });
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    return spring.on('change', (v) => {
      setProgress(v);
    });
  }, [spring]);

  const advance = useCallback((delta: number) => {
    const next = Math.min(Math.max(pRef.current + delta * SENS, 0), 1);
    pRef.current = next;
    spring.set(next);
    if (next >= 0.98 && lockedRef.current) {
      lockedRef.current = false;
      setExpanded(true);
      document.body.style.overflow = '';
    }
    if (lockedRef.current) {
      window.scrollTo(0, 0);
    }
  }, [spring]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (lockedRef.current) {
        e.preventDefault();
        advance(e.deltaY);
      } else if (e.deltaY < 0 && window.scrollY <= 5) {
        e.preventDefault();
        lockedRef.current = true;
        setExpanded(false);
        document.body.style.overflow = 'hidden';
        advance(e.deltaY);
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [advance]);

  useEffect(() => {
    let ty = 0;
    const ts = (e: TouchEvent) => {
      ty = e.touches[0].clientY;
    };
    const tm = (e: TouchEvent) => {
      if (!lockedRef.current) return;
      e.preventDefault();
      const d = ty - e.touches[0].clientY;
      ty = e.touches[0].clientY;
      advance(d * 1.5);
    };
    window.addEventListener('touchstart', ts, { passive: true });
    window.addEventListener('touchmove', tm, { passive: false });
    return () => {
      window.removeEventListener('touchstart', ts);
      window.removeEventListener('touchmove', tm);
    };
  }, [advance]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const v = progress;
  const fade = Math.max(0, 1 - v * 2.2);

  // Exact focal point locked on Pranit's face & upper body (face is centered at 53% in the original photo)
  // Subtle 2% micro-shift gives smooth depth motion without losing the face.
  const objectPosY = `${53 - v * 2.5}%`;
  const warmOverlayOpacity = v > 0.4
    ? Math.min(1, ((v - 0.4) / 0.55))
    : 0;

  // Prominent central portrait dimensions: Proportional expansion prevents bitmap stretching & blur
  const cardW = 380;
  const cardH = 530;
  const maxW = typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.88, 560) : 560;
  const maxH = typeof window !== 'undefined' ? Math.min(window.innerHeight * 0.88, 780) : 780;
  const currentW = cardW + (maxW - cardW) * v;
  const currentH = cardH + (maxH - cardH) * v;

  return (
    <div style={{ position: 'relative', background: '#0E0D0B', minHeight: '100svh' }}>
      {/* ─── Global Background Atmosphere ─── */}
      {bgImageSrc && (
        <div
          style={{
            position: 'fixed',
            inset: '-10%',
            zIndex: 0,
            backgroundImage: `url(${bgImageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.03 * (1 - v),
            filter: 'blur(24px) saturate(0.2)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ─── Refined Ambient Lighting Concentrated Strictly Around Portrait ─── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: Math.max(0, 1 - v * 1.5),
          overflow: 'hidden',
        }}
      >
        {/* Soft amber radial glow concentrated tightly behind the central portrait */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '560px',
            height: '680px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(200, 130, 10, 0.16) 0%, rgba(200, 130, 10, 0.05) 45%, transparent 70%)',
            filter: 'blur(55px)',
          }}
        />

        {/* Subtle secondary aura around portrait frame edges */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '440px',
            height: '580px',
            borderRadius: '30px',
            background: 'radial-gradient(circle, rgba(212, 150, 15, 0.1) 0%, transparent 65%)',
            filter: 'blur(35px)',
          }}
        />

        {/* Delicate curved halo arcs confined strictly behind the portrait */}
        <svg
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '640px',
            height: '740px',
            pointerEvents: 'none',
          }}
          viewBox="0 0 640 740"
          fill="none"
        >
          {/* Subtle curved arc looping gracefully around the upper right corner of portrait */}
          <path
            d="M 140,580 C 130,400 180,180 340,110 C 440,65 540,120 570,240 C 600,360 560,540 460,640"
            stroke="rgba(200, 130, 10, 0.22)"
            strokeWidth="1.2"
            strokeDasharray="4 2"
            opacity="0.75"
          />
          {/* Soft luminous arc around the frame perimeter */}
          <path
            d="M 180,620 C 120,480 150,260 280,150 C 390,60 520,100 560,260"
            stroke="url(#portrait-halo-grad)"
            strokeWidth="1.5"
            opacity="0.85"
          />
          <defs>
            <linearGradient id="portrait-halo-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C8820A" stopOpacity="0.0" />
              <stop offset="40%" stopColor="#D4960F" stopOpacity="0.55" />
              <stop offset="80%" stopColor="#C8820A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#C8820A" stopOpacity="0.0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ─── Top Navigation Header ─── */}
      <motion.nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: '64px',
          padding: '0 clamp(1.5rem, 4vw, 3.5rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(14, 13, 11, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 248, 235, 0.07)',
          opacity: Math.max(0.6, 1 - v * 0.4),
        }}
      >
        {/* Wordmark */}
        <a
          href="#"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.35rem',
            fontWeight: 700,
            color: '#F5EFE0',
            letterSpacing: '-0.02em',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'baseline',
          }}
        >
          Pranit<span style={{ color: AMBER, fontSize: '1.5rem', lineHeight: 0 }}>.</span>
        </a>

        {/* Center navigation links */}
        <div className="hidden md:flex" style={{ gap: '2.5rem', alignItems: 'center' }}>
          {[
            { label: 'WORK', href: '#work' },
            { label: 'ABOUT', href: '#about' },
            { label: 'TECH STACK', href: '#tech-stack' },
            { label: 'CONTACT', href: '#contact' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.72rem',
                fontWeight: 500,
                color: 'rgba(245, 239, 224, 0.55)',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                textDecoration: 'none',
                transition: 'color 200ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#F5EFE0')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245, 239, 224, 0.55)')}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right Section: Subtle Social Links + CTA + Theme icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Subtle Social Links */}
          <div className="hidden sm:flex items-center gap-3.5 pr-2 border-r border-[rgba(255,248,235,0.08)]">
            <a
              href="https://github.com/gpranit16"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              style={{ color: 'rgba(245, 239, 224, 0.45)', transition: 'color 200ms ease', display: 'flex' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = AMBER)}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245, 239, 224, 0.45)')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/pranit-kumar-378342357"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              style={{ color: 'rgba(245, 239, 224, 0.45)', transition: 'color 200ms ease', display: 'flex' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = AMBER)}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245, 239, 224, 0.45)')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="mailto:guptapranit34@gmail.com"
              aria-label="Email"
              style={{ color: 'rgba(245, 239, 224, 0.45)', transition: 'color 200ms ease', display: 'flex' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = AMBER)}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245, 239, 224, 0.45)')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
            </a>
          </div>

          {/* Contact CTA */}
          <a
            href="#contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.45rem 1.15rem',
              background: 'rgba(14, 13, 11, 0.95)',
              border: '1px solid rgba(212, 150, 15, 0.45)',
              borderRadius: '9999px',
              color: '#F5EFE0',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textDecoration: 'none',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = AMBER;
              e.currentTarget.style.boxShadow = `0 0 15px rgba(212, 150, 15, 0.35)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212, 150, 15, 0.45)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: AMBER,
                display: 'inline-block',
                boxShadow: `0 0 8px ${AMBER}`,
              }}
            />
            Let's Talk
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M2.5 9.5L9.5 2.5M4 2.5h5.5V8" />
            </svg>
          </a>

          {/* Theme toggle icon */}
          <button
            type="button"
            aria-label="Theme toggle"
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(245, 239, 224, 0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              transition: 'color 200ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#F5EFE0')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245, 239, 224, 0.4)')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* ─── Hero 3-Zone Viewport Grid Container (34% / 38% / 28% proportions) ─── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1480px',
          padding: '76px clamp(1.5rem, 3.5vw, 3.5rem) 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 20,
          pointerEvents: fade > 0.1 ? 'auto' : 'none',
          opacity: fade,
        }}
      >
        {/* Main Content Row */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center w-full min-h-0 my-auto">

          {/* ════════ LEFT COLUMN (34% width / Cols 1-4) ════════ */}
          <motion.div
            className="lg:col-span-4 xl:col-span-4 flex flex-col justify-center text-left pointer-events-auto"
            style={{
              x: -v * 60,
            }}
          >
            {/* Highly Visible Role Tag */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: AMBER_ACCENT,
                }}
              >
                01
              </span>
              <span style={{ width: 26, height: 1.5, background: AMBER_ACCENT, display: 'inline-block' }} />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.72rem',
                  color: '#F5EFE0',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                AI ENGINEER × FULL STACK DEVELOPER
              </span>
            </div>

            {/* Powerful Display Headline */}
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2.85rem, 4.4vw, 4.85rem)',
                fontWeight: 700,
                letterSpacing: '-0.035em',
                lineHeight: 0.92,
                color: '#F5EFE0',
                marginBottom: '1.35rem',
              }}
            >
              <span style={{ display: 'block' }}>Building</span>
              <span
                style={{
                  display: 'block',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: AMBER,
                  textShadow: '0 0 35px rgba(212, 150, 15, 0.25)',
                }}
              >
                Intelligent
              </span>
              <span style={{ display: 'block' }}>
                Systems<span style={{ color: AMBER }}>.</span>
              </span>
            </h1>

            {/* Refined Modern Inter Paragraph with Subtle Typographic Emphasis */}
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(1rem, 1.1vw, 1.06rem)',
                color: '#C8BFA8',
                lineHeight: 1.5,
                maxWidth: '425px',
                marginBottom: '1.75rem',
                letterSpacing: '-0.01em',
              }}
            >
              I turn complex problems into <span style={{ color: '#E8E1D5', fontWeight: 500 }}>real-world software</span> — from <span style={{ color: '#E8E1D5', fontWeight: 500 }}>AI</span> and <span style={{ color: '#E8E1D5', fontWeight: 500 }}>retrieval systems</span> to <span style={{ color: '#E8E1D5', fontWeight: 500 }}>full-stack engineering</span>.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Primary: VIEW MY WORK */}
              <a
                href="#work"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.8rem 1.75rem',
                  background: AMBER,
                  color: '#0E0D0B',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(212, 150, 15, 0.28)',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#E5A020';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(212, 150, 15, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = AMBER;
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(212, 150, 15, 0.28)';
                }}
              >
                VIEW MY WORK →
              </a>

              {/* Secondary: VIEW RESUME */}
              <a
                href="/assets/resume_up.pdf"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.8rem 1.6rem',
                  background: 'rgba(20, 19, 16, 0.65)',
                  color: '#F5EFE0',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.76rem',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(255, 248, 235, 0.15)',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(245, 239, 224, 0.4)';
                  e.currentTarget.style.background = 'rgba(30, 28, 24, 0.8)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 248, 235, 0.15)';
                  e.currentTarget.style.background = 'rgba(20, 19, 16, 0.65)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                VIEW RESUME ↗
              </a>
            </div>

            {/* Intentional tight spacing for ASK PRANIT AI text link */}
            <div style={{ marginTop: '0.85rem' }}>
              <a
                href="#contact"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem',
                  color: AMBER,
                  textDecoration: 'none',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'color 200ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F5EFE0')}
                onMouseLeave={(e) => (e.currentTarget.style.color = AMBER)}
              >
                ASK PRANIT AI →
              </a>
            </div>
          </motion.div>

          {/* ════════ CENTER COLUMN SPACER (38% width / Cols 5-8) ════════ */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-5 h-full" />

          {/* ════════ RIGHT COLUMN: WHAT I BUILD (28% width / Cols 9-12) ════════ */}
          <motion.div
            className="hidden lg:flex lg:col-span-4 xl:col-span-3 flex-col justify-center text-left pointer-events-auto pl-4 pr-2"
            style={{
              x: v * 60,
            }}
          >
            {/* Header: WHAT I BUILD with amber accent line matching reference */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.75rem',
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem',
                  color: AMBER_ACCENT,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                WHAT I BUILD
              </span>
              <span style={{ width: 32, height: 1, background: AMBER_ACCENT, display: 'inline-block' }} />
            </div>

            {/* Capability items with Playfair serif titles & clean dividers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {capabilities.map((cap, idx) => (
                <div
                  key={cap.num}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    paddingBottom: idx < capabilities.length - 1 ? '1.25rem' : '0',
                    borderBottom: idx < capabilities.length - 1 ? '1px solid rgba(255, 248, 235, 0.06)' : 'none',
                  }}
                >
                  {/* Number */}
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: AMBER_ACCENT,
                      lineHeight: 1,
                    }}
                  >
                    {cap.num}
                  </span>

                  {/* Title in Playfair serif */}
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.35rem',
                      fontWeight: 600,
                      color: '#F5EFE0',
                      lineHeight: 1.2,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {cap.title}
                  </h3>

                  {/* Sub in JetBrains Mono */}
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.68rem',
                      color: '#B5AB9B',
                      letterSpacing: '0.06em',
                      lineHeight: 1.4,
                      textTransform: 'uppercase',
                    }}
                  >
                    {cap.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* Availability Section */}
            <div style={{ marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 248, 235, 0.08)' }}>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.68rem',
                  color: AMBER_ACCENT,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  marginBottom: '0.4rem',
                }}
              >
                AVAILABLE FOR
              </div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.88rem',
                  color: '#C8BFA8',
                  lineHeight: 1.4,
                  letterSpacing: '-0.01em',
                }}
              >
                Internships · Projects · Collaborations
              </p>
            </div>

            {/* Signature: Build Ship Improve Repeat. (Positioned in lower-right with whitespace) */}
            <div
              style={{
                marginTop: '2rem',
                fontFamily: "'Caveat', cursive",
                fontSize: '1.55rem',
                lineHeight: 1.15,
                color: 'rgba(245, 239, 224, 0.64)',
                transform: 'rotate(-4.5deg)',
                transformOrigin: 'left bottom',
                userSelect: 'none',
              }}
            >
              Build<br />
              Ship<br />
              Improve<br />
              Repeat.
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar: Scroll Indicator */}
        <div className="flex items-center justify-between w-full pointer-events-auto">
          {/* Bottom Left Scroll to Explore */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: AMBER_ACCENT }} />
              <div style={{ width: 1, height: 16, background: 'rgba(200, 130, 10, 0.6)' }} />
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke={AMBER_ACCENT} strokeWidth="1.5">
                <path d="M1 4.5L5 8.5L9 4.5" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.58rem',
                color: 'rgba(245, 239, 224, 0.5)',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              SCROLL TO EXPLORE
            </span>
          </div>
        </div>
      </div>

      {/* ─── Layered Portrait Presentation Matching Approved Reference ─── */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: currentW,
          height: currentH,
          zIndex: 15,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: Math.max(0, 1 - Math.max(0, (v - 0.88) / 0.12)),
        }}
      >
        {/* Layer 1: Visible, elegant tilted amber frame behind main portrait (depth + glow) */}
        <div
          style={{
            position: 'absolute',
            inset: -14,
            borderRadius: '24px',
            border: '1px solid rgba(200, 130, 10, 0.35)',
            transform: 'rotate(-3.5deg)',
            boxShadow: '0 0 35px rgba(200, 130, 10, 0.15), inset 0 0 15px rgba(200, 130, 10, 0.04)',
            background: 'rgba(200, 130, 10, 0.015)',
            opacity: Math.max(0, 1 - v * 2.5),
            pointerEvents: 'none',
            transition: 'opacity 0.2s ease',
          }}
        />

        {/* Layer 2: Secondary bottom-right subtle offset frame */}
        <div
          style={{
            position: 'absolute',
            bottom: -18,
            right: -18,
            width: '210px',
            height: '280px',
            borderRadius: '20px',
            border: '1px solid rgba(200, 130, 10, 0.18)',
            transform: 'rotate(5deg)',
            opacity: Math.max(0, 1 - v * 2.5),
            pointerEvents: 'none',
          }}
        />

        {/* Main Photo Card Container with Refined Thin Borders & Soft Depth */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: `${20 * (1 - v)}px`,
            overflow: 'hidden',
            border: `1px solid rgba(200, 130, 10, 0.35)`,
            boxShadow: `0 30px 80px rgba(0,0,0,0.92)`,
            background: '#141310',
          }}
        >
          {/* Authentic photo of Pranit - No AI alteration, +5% brightness on face/upper body/shirt */}
          <img
            src={mediaSrc}
            alt="Pranit Kumar"
            loading="eager"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: `center ${objectPosY}`,
              display: 'block',
              filter: 'brightness(1.08) contrast(1.03)',
              transition: 'object-position 0.1s linear',
            }}
          />

          {/* Vignette / dark overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: 'linear-gradient(to top, rgba(14,13,11,0.7) 0%, transparent 35%)',
              opacity: Math.max(0, 1 - v * 1.5),
            }}
          />

          {/* Top-down subtle vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: 'linear-gradient(to bottom, rgba(14,13,11,0.5) 0%, transparent 25%)',
              opacity: Math.max(0, 1 - v * 1.5),
            }}
          />

          {/* Smooth dark transition overlay on full expansion */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: '#0E0D0B',
              opacity: warmOverlayOpacity,
            }}
          />

          {/* Minimal metadata: PRANIT KUMAR */}
          <div
            style={{
              position: 'absolute',
              top: '1.25rem',
              left: '1.25rem',
              opacity: fade,
              zIndex: 5,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.62rem',
                color: '#F5EFE0',
                letterSpacing: '0.18em',
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              PRANIT
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.62rem',
                color: '#F5EFE0',
                letterSpacing: '0.18em',
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              KUMAR
            </span>
          </div>

          {/* Minimal metadata: 01 / 04 */}
          <div
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              opacity: fade,
              zIndex: 5,
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.62rem',
                color: 'rgba(245, 239, 224, 0.75)',
                letterSpacing: '0.18em',
                fontWeight: 500,
              }}
            >
              01 / 04
            </span>
          </div>

          {/* Location tag on bottom left inside photo */}
          <div
            style={{
              position: 'absolute',
              bottom: '1.25rem',
              left: '1.25rem',
              opacity: fade,
              zIndex: 5,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: AMBER_ACCENT }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.55rem',
                color: 'rgba(245, 239, 224, 0.85)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              BENGALURU, INDIA
            </span>
          </div>
        </div>
      </div>

      {/* ─── Scroll Progress Bottom Line ─── */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'rgba(255, 248, 235, 0.05)',
          zIndex: 50,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${v * 100}%`,
            background: AMBER,
            boxShadow: `0 0 10px ${AMBER}`,
            transition: 'width 0.04s linear',
          }}
        />
      </div>

      {/* ─── Revealed Content after Hero ─── */}
      <AnimatePresence>
        {expanded && children && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              marginTop: '100svh',
              position: 'relative',
              zIndex: 30,
              background: '#0E0D0B',
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}