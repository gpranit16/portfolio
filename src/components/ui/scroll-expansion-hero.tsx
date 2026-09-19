import { useEffect, useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  const handleNavClick = useCallback((href: string) => {
    setMobileMenuOpen(false);
    if (href === '#' || href === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (lockedRef.current) {
      lockedRef.current = false;
      setExpanded(true);
      pRef.current = 1;
      spring.set(1);
      document.body.style.overflow = '';
    }

    const id = href.replace('#', '');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const navHeight = 70;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: Math.max(0, elementPosition - navHeight),
          behavior: 'smooth',
        });
      }
    }, 60);
  }, [spring]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        lockedRef.current = false;
        setExpanded(true);
        document.body.style.overflow = '';
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    return spring.on('change', (v) => {
      setProgress(v);
    });
  }, [spring]);

  const advance = useCallback((delta: number) => {
    if (isMobile) return;
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
  }, [spring, isMobile]);

  useEffect(() => {
    if (isMobile) return;
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
  }, [advance, isMobile]);

  useEffect(() => {
    if (isMobile) {
      lockedRef.current = false;
      setExpanded(true);
      document.body.style.overflow = '';
      return;
    }

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
  }, [advance, isMobile]);

  useEffect(() => {
    if (!isMobile) {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile]);

  const v = progress;
  const fade = Math.max(0, 1 - v * 2.2);

  const objectPosY = `${53 - v * 2.5}%`;
  const warmOverlayOpacity = v > 0.4 ? Math.min(1, (v - 0.4) / 0.55) : 0;

  // Desktop portrait dimensions
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
            opacity: isMobile ? 0.04 : 0.03 * (1 - v),
            filter: 'blur(24px) saturate(0.2)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ─── Refined Ambient Lighting Concentrated Strictly Around Portrait (Desktop) ─── */}
      {!isMobile && (
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
          {/* Soft amber radial glow */}
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
            <path
              d="M 140,580 C 130,400 180,180 340,110 C 440,65 540,120 570,240 C 600,360 560,540 460,640"
              stroke="rgba(200, 130, 10, 0.22)"
              strokeWidth="1.2"
              strokeDasharray="4 2"
              opacity="0.75"
            />
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
      )}

      {/* ─── Top Navigation Header ─── */}
      <motion.nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: '64px',
          padding: '0 clamp(1rem, 3vw, 3.5rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(14, 13, 11, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 248, 235, 0.07)',
          opacity: isMobile ? 1 : Math.max(0.6, 1 - v * 0.4),
        }}
      >
        {/* Wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#');
          }}
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

        {/* Center navigation links (Desktop) */}
        <div className="hidden lg:flex" style={{ gap: '2rem', alignItems: 'center' }}>
          {[
            { label: 'ABOUT', href: '#about' },
            { label: 'TECH STACK', href: '#tech-stack' },
            { label: 'WORK', href: '#work' },
            { label: 'EXPERIENCE', href: '#experience' },
            { label: 'ACHIEVEMENTS', href: '#achievements' },
            { label: 'CONTACT', href: '#contact' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.72rem',
                fontWeight: 500,
                color: 'rgba(245, 239, 224, 0.55)',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
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

        {/* Right Section: Social Links + CTA + Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Subtle Social Links (Desktop) */}
          <div className="hidden sm:flex items-center gap-3 pr-2 border-r border-[rgba(255,248,235,0.08)]">
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
          </div>

          {/* Contact CTA */}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contact');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.95rem',
              background: 'rgba(14, 13, 11, 0.95)',
              border: '1px solid rgba(212, 150, 15, 0.45)',
              borderRadius: '9999px',
              color: '#F5EFE0',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.72rem',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textDecoration: 'none',
              transition: 'all 200ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: AMBER,
                display: 'inline-block',
                boxShadow: `0 0 8px ${AMBER}`,
              }}
            />
            Let's Talk
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="flex lg:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            style={{
              background: 'rgba(255, 248, 235, 0.05)',
              border: '1px solid rgba(255, 248, 235, 0.1)',
              borderRadius: '4px',
              color: '#F5EFE0',
              cursor: 'pointer',
              padding: '6px 8px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {mobileMenuOpen ? <X size={18} color={AMBER} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: '64px',
                left: 0,
                right: 0,
                background: 'rgba(14, 13, 11, 0.98)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderBottom: '1px solid rgba(255, 248, 235, 0.1)',
                padding: '1.25rem 1.5rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.9rem',
                zIndex: 99,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.9)',
              }}
            >
              {[
                { label: 'ABOUT', href: '#about' },
                { label: 'TECH STACK', href: '#tech-stack' },
                { label: 'WORK', href: '#work' },
                { label: 'EXPERIENCE', href: '#experience' },
                { label: 'ACHIEVEMENTS', href: '#achievements' },
                { label: 'CONTACT', href: '#contact' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'rgba(245, 239, 224, 0.9)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    textDecoration: 'none',
                    padding: '0.45rem 0',
                    borderBottom: '1px solid rgba(255, 248, 235, 0.06)',
                  }}
                >
                  {item.label}
                </a>
              ))}
              <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '0.75rem', alignItems: 'center' }}>
                <a
                  href="https://github.com/gpranit16"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: AMBER, textDecoration: 'none', fontSize: '0.8rem', fontFamily: "'JetBrains Mono', monospace" }}
                >
                  GitHub ↗
                </a>
                <a
                  href="https://linkedin.com/in/pranit-kumar-378342357"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: AMBER, textDecoration: 'none', fontSize: '0.8rem', fontFamily: "'JetBrains Mono', monospace" }}
                >
                  LinkedIn ↗
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ─── MOBILE DEDICATED RESPONSIVE HERO (< 1024px) ─── */}
      {isMobile ? (
        <div
          style={{
            position: 'relative',
            zIndex: 20,
            paddingTop: '80px',
            paddingBottom: '3.5rem',
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem',
            maxWidth: '680px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Role eyebrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              marginBottom: '1rem',
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.68rem',
                fontWeight: 600,
                color: AMBER_ACCENT,
              }}
            >
              01
            </span>
            <span style={{ width: 20, height: 1.5, background: AMBER_ACCENT, display: 'inline-block' }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.68rem',
                color: '#F5EFE0',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              AI ENGINEER × FULL STACK DEVELOPER
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.4rem, 8.5vw, 3.8rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.02,
              color: '#F5EFE0',
              marginBottom: '1.5rem',
            }}
          >
            Building <span style={{ fontStyle: 'italic', fontWeight: 400, color: AMBER }}>Intelligent</span> Systems<span style={{ color: AMBER }}>.</span>
          </h1>

          {/* Centered Mobile Portrait Card (Separated from text, perfectly proportioned) */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '300px',
              aspectRatio: '3 / 4',
              margin: '0.5rem auto 1.75rem',
            }}
          >
            {/* Tilted frame backdrop */}
            <div
              style={{
                position: 'absolute',
                inset: -8,
                borderRadius: '18px',
                border: '1px solid rgba(200, 130, 10, 0.35)',
                transform: 'rotate(-3deg)',
                background: 'rgba(200, 130, 10, 0.03)',
                boxShadow: '0 0 25px rgba(200, 130, 10, 0.12)',
                pointerEvents: 'none',
              }}
            />

            {/* Main photo frame */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(200, 130, 10, 0.4)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9)',
                background: '#141310',
              }}
            >
              <img
                src={mediaSrc}
                alt="Pranit Kumar"
                loading="eager"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 50%',
                  display: 'block',
                  filter: 'brightness(1.08) contrast(1.03)',
                }}
              />

              {/* Vignette */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: 'linear-gradient(to top, rgba(14,13,11,0.75) 0%, transparent 40%)',
                }}
              />

              {/* Minimal metadata badges on card */}
              <div
                style={{
                  position: 'absolute',
                  top: '0.85rem',
                  left: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: '#F5EFE0', letterSpacing: '0.16em', fontWeight: 600 }}>
                  PRANIT
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: '#F5EFE0', letterSpacing: '0.16em', fontWeight: 600 }}>
                  KUMAR
                </span>
              </div>

              <div style={{ position: 'absolute', top: '0.85rem', right: '0.85rem' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: 'rgba(245, 239, 224, 0.8)', letterSpacing: '0.16em', fontWeight: 500 }}>
                  01 / 04
                </span>
              </div>

              <div style={{ position: 'absolute', bottom: '0.85rem', left: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: AMBER_ACCENT }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.52rem', color: 'rgba(245, 239, 224, 0.9)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>
                  BENGALURU, INDIA
                </span>
              </div>
            </div>
          </div>

          {/* Bio paragraph */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.95rem',
              color: '#C8BFA8',
              lineHeight: 1.55,
              maxWidth: '460px',
              marginBottom: '1.75rem',
              letterSpacing: '-0.01em',
            }}
          >
            I turn complex problems into <span style={{ color: '#E8E1D5', fontWeight: 500 }}>real-world software</span> — from <span style={{ color: '#E8E1D5', fontWeight: 500 }}>AI</span> and <span style={{ color: '#E8E1D5', fontWeight: 500 }}>retrieval systems</span> to <span style={{ color: '#E8E1D5', fontWeight: 500 }}>full-stack engineering</span>.
          </p>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#work');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.8rem 1.6rem',
                background: AMBER,
                color: '#0E0D0B',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.76rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                borderRadius: '6px',
                textDecoration: 'none',
                boxShadow: '0 4px 18px rgba(212, 150, 15, 0.3)',
                flex: '1 1 140px',
                maxWidth: '200px',
              }}
            >
              VIEW WORK →
            </a>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.8rem 1.4rem',
                background: 'rgba(20, 19, 16, 0.85)',
                color: '#F5EFE0',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.76rem',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: '1px solid rgba(255, 248, 235, 0.15)',
                borderRadius: '6px',
                textDecoration: 'none',
                flex: '1 1 140px',
                maxWidth: '200px',
              }}
            >
              RESUME ↗
            </a>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
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
              }}
            >
              ASK PRANIT AI →
            </a>
          </div>

          {/* Mobile capabilities overview */}
          <div
            style={{
              width: '100%',
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 248, 235, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: AMBER_ACCENT, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
                WHAT I BUILD
              </span>
              <span style={{ width: 24, height: 1, background: AMBER_ACCENT, display: 'inline-block' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {capabilities.map((cap) => (
                <div
                  key={cap.num}
                  style={{
                    background: 'rgba(20, 19, 16, 0.6)',
                    border: '1px solid rgba(255, 248, 235, 0.07)',
                    borderRadius: '4px',
                    padding: '0.85rem 1rem',
                  }}
                >
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: AMBER_ACCENT, fontWeight: 600 }}>
                    {cap.num}
                  </span>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', color: '#F5EFE0', margin: '0.2rem 0' }}>
                    {cap.title}
                  </h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#B5AB9B', letterSpacing: '0.04em', textTransform: 'uppercase', margin: 0 }}>
                    {cap.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ─── DESKTOP 3-ZONE SCROLL EXPANSION HERO (≥ 1024px) ─── */
        <>
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
            <div className="flex-1 grid grid-cols-12 gap-8 items-center w-full min-h-0 my-auto">
              {/* Left Column (Cols 1-4) */}
              <motion.div
                className="col-span-4 flex flex-col justify-center text-left pointer-events-auto"
                style={{ x: -v * 60 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', fontWeight: 600, color: AMBER_ACCENT }}>
                    01
                  </span>
                  <span style={{ width: 26, height: 1.5, background: AMBER_ACCENT, display: 'inline-block' }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#F5EFE0', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}>
                    AI ENGINEER × FULL STACK DEVELOPER
                  </span>
                </div>

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
                  <span style={{ display: 'block', fontStyle: 'italic', fontWeight: 400, color: AMBER, textShadow: '0 0 35px rgba(212, 150, 15, 0.25)' }}>
                    Intelligent
                  </span>
                  <span style={{ display: 'block' }}>
                    Systems<span style={{ color: AMBER }}>.</span>
                  </span>
                </h1>

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

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <a
                    href="#work"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('#work');
                    }}
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

                  <a
                    href="/resume.pdf"
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

                <div style={{ marginTop: '0.85rem' }}>
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('#contact');
                    }}
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

              {/* Center Spacer for Portrait (Cols 5-8) */}
              <div className="col-span-4 xl:col-span-5 h-full" />

              {/* Right Column: WHAT I BUILD (Cols 9-12) */}
              <motion.div
                className="col-span-4 xl:col-span-3 flex flex-col justify-center text-left pointer-events-auto pl-4 pr-2"
                style={{ x: v * 60 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: AMBER_ACCENT, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600 }}>
                    WHAT I BUILD
                  </span>
                  <span style={{ width: 32, height: 1, background: AMBER_ACCENT, display: 'inline-block' }} />
                </div>

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
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', fontWeight: 600, color: AMBER_ACCENT, lineHeight: 1 }}>
                        {cap.num}
                      </span>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.35rem', fontWeight: 600, color: '#F5EFE0', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                        {cap.title}
                      </h3>
                      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: '#B5AB9B', letterSpacing: '0.06em', lineHeight: 1.4, textTransform: 'uppercase' }}>
                        {cap.sub}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 248, 235, 0.08)' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: AMBER_ACCENT, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.4rem' }}>
                    AVAILABLE FOR
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#C8BFA8', lineHeight: 1.4, letterSpacing: '-0.01em' }}>
                    Internships · Projects · Collaborations
                  </p>
                </div>

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: AMBER_ACCENT }} />
                  <div style={{ width: 1, height: 16, background: 'rgba(200, 130, 10, 0.6)' }} />
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke={AMBER_ACCENT} strokeWidth="1.5">
                    <path d="M1 4.5L5 8.5L9 4.5" />
                  </svg>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: 'rgba(245, 239, 224, 0.5)', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500 }}>
                  SCROLL TO EXPLORE
                </span>
              </div>
            </div>
          </div>

          {/* ─── Layered Portrait Presentation (Desktop) ─── */}
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

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: 'linear-gradient(to top, rgba(14,13,11,0.7) 0%, transparent 35%)',
                  opacity: Math.max(0, 1 - v * 1.5),
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: 'linear-gradient(to bottom, rgba(14,13,11,0.5) 0%, transparent 25%)',
                  opacity: Math.max(0, 1 - v * 1.5),
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: '#0E0D0B',
                  opacity: warmOverlayOpacity,
                }}
              />

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
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: '#F5EFE0', letterSpacing: '0.18em', fontWeight: 600, lineHeight: 1.2 }}>
                  PRANIT
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: '#F5EFE0', letterSpacing: '0.18em', fontWeight: 600, lineHeight: 1.2 }}>
                  KUMAR
                </span>
              </div>

              <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', opacity: fade, zIndex: 5 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: 'rgba(245, 239, 224, 0.75)', letterSpacing: '0.18em', fontWeight: 500 }}>
                  01 / 04
                </span>
              </div>

              <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', opacity: fade, zIndex: 5, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: AMBER_ACCENT }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: 'rgba(245, 239, 224, 0.85)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500 }}>
                  BENGALURU, INDIA
                </span>
              </div>
            </div>
          </div>

          {/* Scroll Progress Bottom Line */}
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
        </>
      )}

      {/* ─── Revealed Content after Hero ─── */}
      <AnimatePresence>
        {(isMobile || expanded) && children && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              marginTop: isMobile ? '0' : '100svh',
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