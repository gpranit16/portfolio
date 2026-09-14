import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import ScrollExpandHero from './components/ui/scroll-expansion-hero';
import WhoIAm from './components/ui/who-i-am';
import TechStack from './components/ui/tech-stack';
import TarkAiShowcase from './components/ui/tark-ai-showcase';
import SyncoraShowcase from './components/ui/syncora-showcase';
import ChurnReaperShowcase from './components/ui/churn-reaper-showcase';
import ExperienceStaircase from './components/ui/experience-staircase';
import ProjectAssistantModal from './components/ui/project-assistant-modal';

const AMBER = '#D4960F';


const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} className={className}
      initial="hidden" animate={inView ? 'show' : 'hidden'}
      variants={{ hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } } }}>
      {children}
    </motion.div>
  );
};

const inputBase: React.CSSProperties = {
  width: '100%',
  background: 'rgba(20, 19, 16, 0.5)',
  border: '1px solid rgba(255, 248, 235, 0.1)',
  padding: '0.875rem 1rem',
  borderRadius: '3px',
  color: '#F5EFE0',
  fontFamily: "'Inter', sans-serif",
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 200ms ease',
};

const labelBase: React.CSSProperties = {
  display: 'block',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.6rem',
  fontWeight: 500,
  color: '#5A5248',
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  marginBottom: '0.6rem',
};

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', query: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', query: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'left' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 250px' }}>
            <label style={labelBase}>Full Name</label>
            <input type="text" required placeholder="Your name" value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              style={inputBase}
              onFocus={e => (e.target.style.borderColor = 'rgba(200, 130, 10, 0.4)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255, 248, 235, 0.1)')} />
          </div>
          <div style={{ flex: '1 1 250px' }}>
            <label style={labelBase}>Email Address</label>
            <input type="email" required placeholder="your@email.com" value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              style={inputBase}
              onFocus={e => (e.target.style.borderColor = 'rgba(200, 130, 10, 0.4)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255, 248, 235, 0.1)')} />
          </div>
        </div>
        <div>
          <label style={labelBase}>Message</label>
          <textarea required placeholder="Describe your project or proposal..." value={formData.query}
            onChange={e => setFormData({ ...formData, query: e.target.value })} rows={5}
            style={{ ...inputBase, resize: 'vertical' }}
            onFocus={e => (e.target.style.borderColor = 'rgba(200, 130, 10, 0.4)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255, 248, 235, 0.1)')} />
        </div>
        <div>
          <button type="submit" disabled={status === 'loading'}
            style={{
              background: status === 'success' ? '#27241D' : AMBER,
              color: status === 'success' ? '#D4960F' : '#0E0D0B',
              border: status === 'success' ? '1px solid rgba(200, 130, 10, 0.4)' : 'none',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0.875rem 2rem',
              borderRadius: '3px',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              opacity: status === 'loading' ? 0.7 : 1,
              transition: 'background 200ms ease, transform 200ms ease, color 200ms ease',
            }}
            onMouseEnter={e => {
              if (status !== 'success') {
                e.currentTarget.style.background = '#E8970C';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={e => {
              if (status !== 'success') {
                e.currentTarget.style.background = AMBER;
                e.currentTarget.style.transform = 'none';
              }
            }}
          >
            {status === 'loading' ? 'Sending...' : status === 'success' ? '✓ Message Sent' : status === 'error' ? 'Error — Try Again' : 'Send Message →'}
          </button>
        </div>
      </form>
    </div>
  );
};

const achievements = [
  { stat: '₹10K', label: 'National Sustainathon Winner', desc: 'Secured 3rd place at a national-level Sustainathon for developing a piezoelectric energy-harvesting system.' },
  { stat: '#1', label: 'Best Innovation Award', desc: 'Recognized for innovation in AI agent systems and intelligent workflow engineering at an Agentic AI Sprint Hackathon.' },
  { stat: 'IEEE', label: 'Leadership Recognition', desc: 'Leading digital systems and technical initiatives within IEEE EMBS as Webmaster.' },
];

export default function App() {
  return (
    <>

      {/* ── Hero ── */}
      <ScrollExpandHero mediaSrc="/assets/pranit.jpeg" bgImageSrc="/assets/premium_neural_bg.png">

        {/* ── 02 / WHO I AM ── */}
        <WhoIAm />

        <div className="divider" />

        <TechStack />

        <div className="divider" />

        {/* ── 01 / FEATURED WORK — TARK AI ── */}
        <TarkAiShowcase />

        {/* Project Transition 1 -> 2 */}
        <div style={{ position: 'relative', width: '100%', padding: '0.75rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0E0D0B' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(200, 130, 10, 0.06) 20%, rgba(200, 130, 10, 0.22) 50%, rgba(200, 130, 10, 0.06) 80%, transparent 100%)' }} />
          </div>
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              background: '#141310',
              border: '1px solid rgba(255, 248, 235, 0.09)',
              borderRadius: '20px',
              padding: '0.35rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
            }}
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: AMBER, boxShadow: '0 0 6px rgba(200, 130, 10, 0.6)' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#C8BFA8', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500 }}>
              NEXT PROJECT · 02 / 03 SYNCORA
            </span>
          </div>
        </div>

        {/* ── 02 / PROJECT WORK — SYNCORA ── */}
        <SyncoraShowcase />

        {/* Project Transition 2 -> 3 */}
        <div style={{ position: 'relative', width: '100%', padding: '0.75rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0E0D0B' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(200, 130, 10, 0.06) 20%, rgba(200, 130, 10, 0.22) 50%, rgba(200, 130, 10, 0.06) 80%, transparent 100%)' }} />
          </div>
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              background: '#141310',
              border: '1px solid rgba(255, 248, 235, 0.09)',
              borderRadius: '20px',
              padding: '0.35rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
            }}
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: AMBER, boxShadow: '0 0 6px rgba(200, 130, 10, 0.6)' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#C8BFA8', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500 }}>
              NEXT PROJECT · 03 / 03 CHURN REAPER
            </span>
          </div>
        </div>

        {/* ── 03 / APPLIED AI & ML — CHURN REAPER ── */}
        <ChurnReaperShowcase />

        <div className="divider" />



        {/* ── 05 / WHERE I'VE BUILT — CAREER STAIRCASE JOURNEY ── */}
        <ExperienceStaircase />

        <div className="divider" />

        {/* ── Achievements ── */}
        <section className="section" style={{ background: '#000000' }}>
          <div className="section-inner">
            <Reveal><p className="eyebrow">Recognition</p></Reveal>
            <Reveal delay={0.05}><h2 className="section-title" style={{ marginBottom: '3.5rem' }}>Achievements</h2></Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {achievements.map(({ stat, label, desc }, i) => (
                <Reveal key={label} delay={0.1 * i}>
                  <div className="glass" style={{ borderRadius: 4, padding: '2.5rem', transition: 'transform 300ms ease, border-color 200ms ease' }}
                    onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'translateY(-3px)'; d.style.borderColor = 'rgba(200, 130, 10, 0.2)'; }}
                    onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'none'; d.style.borderColor = 'rgba(255, 248, 235, 0.07)'; }}>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: AMBER, lineHeight: 1, marginBottom: '0.6rem', letterSpacing: '-0.02em', fontWeight: 700 }}>{stat}</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', fontWeight: 600, color: '#F5EFE0', marginBottom: '0.75rem' }}>{label}</p>
                    <p className="body-text" style={{ fontSize: '0.83rem' }}>{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>



        <div className="divider" />

        {/* ── Contact ── */}
        <section id="contact" className="section" style={{ background: '#000000', textAlign: 'center' }}>
          <div className="section-inner" style={{ maxWidth: 800 }}>
            <Reveal><p className="eyebrow" style={{ textAlign: 'center' }}>Contact</p></Reveal>
            <Reveal delay={0.08}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.8rem, 6vw, 5rem)', lineHeight: 1.06, letterSpacing: '-0.03em', color: '#F5EFE0', marginBottom: '1.5rem', marginTop: '0.5rem', fontStyle: 'italic', fontWeight: 700 }}>
                Let's <span style={{ color: AMBER }}>Connect.</span>
              </h2>
              <p className="body-text" style={{ maxWidth: 500, margin: '0 auto 3rem' }}>
                Have a proposal or a project in mind? Reach out below and I'll get back to you.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <ContactForm />
            </Reveal>

            <Reveal delay={0.2}>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '3.5rem', marginBottom: '3.5rem' }}>
                <a href="https://github.com/gpranit16" target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1.75rem', borderRadius: '3px', border: '1px solid rgba(255, 248, 235, 0.1)', color: '#C8BFA8', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '0.8rem', textDecoration: 'none', transition: 'border-color 200ms ease, color 200ms ease' }}
                  onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.borderColor = 'rgba(255, 248, 235, 0.25)'; a.style.color = '#F5EFE0'; }}
                  onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.borderColor = 'rgba(255, 248, 235, 0.1)'; a.style.color = '#C8BFA8'; }}>
                  <ExternalLink size={14} /> GitHub
                </a>
                <a href="https://linkedin.com/in/pranit-kumar-378342357" target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1.75rem', borderRadius: '3px', border: '1px solid rgba(255, 248, 235, 0.1)', color: '#C8BFA8', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '0.8rem', textDecoration: 'none', transition: 'border-color 200ms ease, color 200ms ease' }}
                  onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.borderColor = 'rgba(255, 248, 235, 0.25)'; a.style.color = '#F5EFE0'; }}
                  onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.borderColor = 'rgba(255, 248, 235, 0.1)'; a.style.color = '#C8BFA8'; }}>
                  <ExternalLink size={14} /> LinkedIn
                </a>
              </div>
            </Reveal>

            {/* Footer */}
            <div style={{ borderTop: '1px solid rgba(255, 248, 235, 0.06)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontStyle: 'italic', color: 'rgba(245, 239, 224, 0.25)', fontWeight: 700 }}>Pranit Kumar</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#5A5248', letterSpacing: '0.1em' }}>© 2025 · Built with precision</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: AMBER, letterSpacing: '0.08em' }}>guptapranit34@gmail.com</span>
            </div>
          </div>
        </section>

      </ScrollExpandHero>

      {/* ── Global Floating Project Assistant AI ── */}
      <ProjectAssistantModal />
    </>
  );
}
