import { useEffect, useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';

const SENS = 0.0028;
const PW = 320;
const PH = 420;

const rightCards = [
  {
    icon: '⚡',
    label: 'EXPLORING',
    title: 'AI Applications & Automation',
  },
  {
    icon: '</>',
    label: 'BUILDING',
    title: 'Full Stack Web Products',
  },
  {
    icon: '✦',
    label: 'FOCUSED ON',
    title: 'Automation • Backend Systems • UX',
  },
];

export default function ScrollExpandHero({
  mediaSrc, bgImageSrc, children,
}: { mediaSrc: string; bgImageSrc?: string; children?: ReactNode }) {
  const pRef = useRef(0);
  const lockedRef = useRef(true);
  const spring = useSpring(0, { stiffness: 60, damping: 20, mass: 0.9 });
  const [clip, setClip] = useState({ cx: 0, cy: 0, r: 24, v: 0 });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pw = Math.min(PW, vw - 40);
    const ph = Math.min(PH, vh - 100);
    setClip({ cx: (vw - pw) / 2, cy: (vh - ph) / 2, r: 24, v: 0 });

    return spring.on('change', (v) => {
      const pw2 = Math.min(PW, vw - 40);
      const ph2 = Math.min(PH, vh - 100);
      setClip({
        cx: ((vw - pw2) / 2) * (1 - v),
        cy: ((vh - ph2) / 2) * (1 - v),
        r: 24 * (1 - v),
        v,
      });
    });
  }, [spring]);

  const advance = useCallback((delta: number) => {
    const next = Math.min(Math.max(pRef.current + delta * SENS, 0), 1);
    pRef.current = next;
    spring.set(next);
    if (next >= 1 && lockedRef.current) {
      lockedRef.current = false;
      setExpanded(true);
      document.body.style.overflow = '';
    }
    if (lockedRef.current) window.scrollTo(0, 0);
  }, [spring]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (lockedRef.current) {
        e.preventDefault();
        advance(e.deltaY);
      } else if (e.deltaY < 0 && window.scrollY === 0) {
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
    const ts = (e: TouchEvent) => { ty = e.touches[0].clientY; };
    const tm = (e: TouchEvent) => {
      if (!lockedRef.current) return;
      e.preventDefault();
      const d = ty - e.touches[0].clientY;
      ty = e.touches[0].clientY;
      advance(d);
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
    return () => { document.body.style.overflow = ''; };
  }, []);

  const { v } = clip;
  const fade = Math.max(0, 1 - v * 2.4);

  return (
    <div style={{ position: 'relative', background: '#000000', minHeight: '100svh' }}>
      {/* Subtle neural bg */}
      {bgImageSrc && (
        <div style={{
          position: 'fixed', inset: '-10%', zIndex: 0,
          backgroundImage: `url(${bgImageSrc})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.07 * (1 - v), filter: 'blur(12px)',
          willChange: 'opacity',
        }} />
      )}

      {/* Vignette */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.97) 100%)',
      }} />

      {/* ─── Portrait ─── */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: PW + (window.innerWidth - PW) * v,
        height: PH + (window.innerHeight - PH) * v,
        borderRadius: 24 * (1 - v),
        overflow: 'hidden',
        zIndex: 10,
        boxShadow: `0 0 60px rgba(125,211,252,${0.25 * (1 - v)}), 0 30px 60px rgba(0,0,0,${0.8 * (1 - v)})`,
        border: `1px solid rgba(125,211,252,${0.15 * (1 - v)})`,
        willChange: 'width, height, border-radius',
      }}>
        <img
          src={mediaSrc}
          alt="Pranit Kumar portrait"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
        />
        {/* Portrait bottom gradient */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)',
          opacity: Math.max(0, 1 - v * 2),
        }} />
        {/* Name inside portrait bottom */}
        <motion.div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '1.5rem',
          opacity: fade,
          y: v * 20,
          zIndex: 5,
        }}>
          <h2 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            color: '#F5F7FA',
            letterSpacing: '-0.01em',
            lineHeight: 1,
            marginBottom: '0.2rem',
            fontWeight: 400,
          }}>Pranit Kumar <span style={{ color: '#60a5fa', fontSize: '0.6em' }}>•</span></h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.7rem',
            color: '#60a5fa',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontWeight: 600,
          }}>AI Engineer & Full Stack Developer</p>
        </motion.div>
      </div>

      {/* ─── LEFT: Editorial Headline ─── */}
      <motion.div 
        className="fixed z-20 pointer-events-none max-w-[520px] left-[5vw] lg:left-[5vw] right-[5vw] lg:right-auto text-center lg:text-left"
        style={{
          top: 'calc(50% - 210px)',
          opacity: fade,
          x: -v * 80,
        }}
      >
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '11px',
          color: '#60a5fa',
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          fontWeight: 600,
          marginBottom: '1.5rem',
        }}>MERN STACK & AI DEVELOPER</p>

        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(4rem, 6vw, 7rem)',
          fontWeight: 700,
          fontStyle: 'normal',
          letterSpacing: '-0.04em',
          lineHeight: 0.92,
          marginBottom: '2rem',
          background: 'linear-gradient(to bottom, #ffffff, #dbeafe)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block',
        }}>
          Building<br />
          Intelligent<br />
          Systems.
        </h1>

        <p style={{
          fontFamily: "'Lora', serif",
          fontSize: '16px',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.7,
          maxWidth: '380px',
          marginBottom: '2rem',
        }}>
          Building scalable web applications, AI-powered tools, and intelligent systems focused on real-world impact.
        </p>
      </motion.div>

      {/* ─── RIGHT: Info Cards ─── */}
      <motion.div 
        className="fixed z-20 pointer-events-none w-[20vw] min-w-[220px] right-[5vw] hidden lg:flex flex-col gap-0"
        style={{
          top: 'calc(50% - 210px)',
          opacity: fade,
          x: v * 80,
        }}>
        {rightCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: fade, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            style={{
              padding: '1.25rem 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '10px',
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: '0.6rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}>
              <span style={{ color: '#60a5fa', fontSize: '11px', fontFamily: 'monospace' }}>{card.icon}</span>
              {card.label}
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '20px',
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 500,
              lineHeight: 1.3,
              whiteSpace: 'pre-line',
            }}>{card.title}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ─── Scroll indicator (below portrait) ─── */}
      <motion.div style={{
        position: 'fixed',
        top: `calc(50% + ${PH / 2}px + 20px)`,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 25,
        pointerEvents: 'none',
        opacity: fade * 0.7,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        {/* Scroll circle + mouse icon */}
        <div style={{
          width: 24, height: 38,
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '6px 0',
        }}>
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            style={{ width: 3, height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.5)' }}
          />
        </div>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.55rem',
          color: '#60a5fa',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
        }}>Scroll to Explore</span>
      </motion.div>


      {/* Progress bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'rgba(255,255,255,0.05)', zIndex: 50,
      }}>
        <div style={{
          height: '100%', width: `${v * 100}%`,
          background: 'linear-gradient(90deg, #3b82f6, #93c5fd)',
          boxShadow: '0 0 8px rgba(147,197,253,0.6)',
          transition: 'width 0.04s linear',
        }} />
      </div>

      {/* Revealed content */}
      <AnimatePresence>
        {expanded && children && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginTop: '100svh', position: 'relative', zIndex: 30, background: '#000000' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
