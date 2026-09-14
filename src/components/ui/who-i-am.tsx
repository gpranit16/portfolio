import { motion } from 'framer-motion';

const AMBER_PROMPT = '#C8820A';
const AMBER_PRIMARY = '#D79A25';
const AMBER_BRIGHT = '#E8B54A';
const AMBER_MUTED = '#9E8050';

const terminalStatements = [
  "Building AI-powered products, intelligent automation systems, and scalable full-stack applications.",
  "Working with RAG, agentic AI, retrieval systems, LLM workflows, and modern backend architecture.",
  "Turning complex technical ideas into reliable, user-focused digital products.",
];

const approachSteps = [
  {
    num: '01',
    title: 'UNDERSTAND',
    desc: 'Start with the problem, not the implementation.',
  },
  {
    num: '02',
    title: 'BUILD',
    desc: 'Turn the idea into a working system.',
  },
  {
    num: '03',
    title: 'SIMPLIFY',
    desc: "Remove what doesn't need to be there.",
  },
];

export default function WhoIAm() {
  return (
    <section
      id="about"
      style={{
        position: 'relative',
        background: '#0E0D0B',
        color: '#F5EFE0',
        padding: 'clamp(5rem, 8vw, 8.5rem) clamp(1.5rem, 4vw, 4rem)',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* ─── Section Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 'clamp(3rem, 5vw, 4.5rem)' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.85rem',
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.72rem',
                color: AMBER_PROMPT,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              02 / WHO I AM
            </span>
            <span
              style={{
                width: 32,
                height: 1,
                background: 'rgba(200, 130, 10, 0.4)',
                display: 'inline-block',
              }}
            />
          </div>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              color: '#F5EFE0',
            }}
          >
            WHO I AM
          </h2>
        </motion.div>

        {/* ─── Main 2-Column Grid (Left: Terminal ≈ 56%, Right: Personal Card ≈ 44%) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* ════════ LEFT COLUMN: WARM AMBER TERMINAL PROFILE (56% / Cols 1-7) ════════ */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 flex flex-col"
          >
            <div
              style={{
                position: 'relative',
                background: '#0B0D0A',
                border: '1px solid rgba(215, 154, 37, 0.16)',
                borderRadius: '6px',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.85), inset 0 0 25px rgba(215, 154, 37, 0.02)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Subtle CRT Scanline Texture */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%)',
                  backgroundSize: '100% 4px',
                  pointerEvents: 'none',
                  zIndex: 4,
                  opacity: 0.45,
                }}
              />

              {/* Terminal Title Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px 20px',
                  background: 'rgba(18, 17, 14, 0.85)',
                  borderBottom: '1px solid rgba(215, 154, 37, 0.1)',
                  position: 'relative',
                  zIndex: 5,
                }}
              >
                {/* Window controls */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56', opacity: 0.85 }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e', opacity: 0.85 }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f', opacity: 0.85 }} />
                </div>

                <span
                  style={{
                    marginLeft: '14px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.72rem',
                    color: 'rgba(232, 181, 74, 0.65)',
                    letterSpacing: '0.08em',
                  }}
                >
                  pranit@portfolio
                </span>
              </div>

              {/* Terminal Content Body */}
              <div
                style={{
                  padding: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                  position: 'relative',
                  zIndex: 5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  flex: 1,
                }}
              >
                {/* 1. Name */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.12, duration: 0.45 }}
                >
                  <h3
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 'clamp(1.2rem, 1.8vw, 1.35rem)',
                      fontWeight: 600,
                      color: AMBER_BRIGHT,
                      letterSpacing: '0.06em',
                      lineHeight: 1.2,
                    }}
                  >
                    PRANIT KUMAR
                  </h3>
                </motion.div>

                {/* 2. Education */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.24, duration: 0.45 }}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.82rem',
                    color: AMBER_MUTED,
                    lineHeight: 1.5,
                  }}
                >
                  <p style={{ margin: 0 }}>B.Tech Computer Science Engineering</p>
                  <p style={{ margin: '0.2rem 0 0 0' }}>BMSIT&M · 3rd Year</p>
                </motion.div>

                {/* Subtle Divider */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.34, duration: 0.45 }}
                  style={{
                    height: '1px',
                    background: 'rgba(215, 154, 37, 0.12)',
                    margin: '0.5rem 0',
                  }}
                />

                {/* 3. Three Concise Statements */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {terminalStatements.map((stmt, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.44 + i * 0.14, duration: 0.45 }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.85rem',
                      }}
                    >
                      <span
                        style={{
                          color: AMBER_PROMPT,
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.9rem',
                          lineHeight: 1.6,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        ›
                      </span>
                      <p
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.84rem',
                          color: AMBER_PRIMARY,
                          lineHeight: 1.65,
                          margin: 0,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {stmt}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Blinking Amber Cursor at the End */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                  style={{
                    width: '8px',
                    height: '16px',
                    background: AMBER_BRIGHT,
                    marginTop: '0.5rem',
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* ════════ RIGHT COLUMN: REFINED EDITORIAL PERSONAL CARD (44% / Cols 8-12) ════════ */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex flex-col"
          >
            <div
              style={{
                background: '#141310',
                border: '1px solid rgba(255, 248, 235, 0.08)',
                borderRadius: '6px',
                padding: 'clamp(2rem, 3.5vw, 3rem)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* 1. Card Header */}
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.68rem',
                    color: AMBER_PROMPT,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    marginBottom: '1.5rem',
                  }}
                >
                  A LITTLE ABOUT ME
                </div>

                {/* 2. Main Statement Anchor in Cormorant Garamond */}
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', 'Instrument Serif', serif",
                    fontSize: 'clamp(2.1rem, 3vw, 2.75rem)',
                    fontWeight: 600,
                    color: '#F5EFE0',
                    lineHeight: 1.15,
                    letterSpacing: '-0.015em',
                    marginBottom: '1.5rem',
                  }}
                >
                  "I like turning complex systems into simple experiences."
                </h3>

                {/* 3. Card Body Paragraphs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.25rem' }}>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.96rem',
                      color: '#C8BFA8',
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    I’m a third-year Computer Science Engineering student who enjoys working at the intersection of AI, software and product. I’m most interested in the part where an idea moves from architecture and experimentation to something real and usable.
                  </p>

                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.96rem',
                      color: '#C8BFA8',
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    I value thoughtful engineering, clean interfaces and systems that work well beyond the first demo.
                  </p>
                </div>
              </div>

              {/* 4. MY APPROACH Section (Bottom of the Same Card) */}
              <div
                style={{
                  borderTop: '1px solid rgba(255, 248, 235, 0.07)',
                  paddingTop: '1.75rem',
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.68rem',
                    color: AMBER_PROMPT,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    marginBottom: '1.25rem',
                  }}
                >
                  MY APPROACH
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {approachSteps.map((step, idx) => (
                    <div
                      key={step.num}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                        paddingBottom: idx < approachSteps.length - 1 ? '0.85rem' : '0',
                        borderBottom: idx < approachSteps.length - 1 ? '1px solid rgba(255, 248, 235, 0.05)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.72rem',
                            color: AMBER_PROMPT,
                            fontWeight: 600,
                          }}
                        >
                          {step.num}
                        </span>
                        <span style={{ color: 'rgba(200, 130, 10, 0.5)', fontSize: '0.75rem' }}>—</span>
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.92rem',
                            fontWeight: 600,
                            color: '#F5EFE0',
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                          }}
                        >
                          {step.title}
                        </span>
                      </div>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.82rem',
                          color: '#AFA594',
                          lineHeight: 1.45,
                          margin: '0 0 0 1.6rem',
                        }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
