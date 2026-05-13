import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Cpu, Database, Globe, Layers, Sparkles, Code2, Mail, ExternalLink, Link } from 'lucide-react';
import ScrollExpandHero from './components/ui/scroll-expansion-hero';
import TerminalWindow from './components/ui/terminal-window';
import { CircularTestimonials } from './components/ui/circular-testimonials';
import TechStack from './components/ui/tech-stack';


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



const projectsList = [
  {
    quote: "A machine learning-powered predictive analytics platform designed to identify high-risk customers and improve retention strategies using behavioral and transactional data.",
    name: "Churn Reaper",
    designation: "Python • XGBoost • Streamlit",
    src: "/assets/churn_reaper.png",
    link: "https://churn-reaper-y4d3.vercel.app/",
  },
  {
    quote: "Deployed TinyML model on ESP32 using Edge Impulse to classify pothole/normal from MPU6050 sensor data in real-time. Built Node.js backend with JWT auth, Socket.IO live updates, and dual-database sync.",
    name: "Anveshna",
    designation: "ESP32 • Node.js • Firebase • MongoDB",
    src: "/assets/anveshna.jpeg",
    link: "https://anveshnafrontend.vercel.app/",
  },
  {
    quote: "An AI-powered intelligent email assistant that automates communication workflows, classifies intent, detects spam, analyzes sentiment, and generates context-aware responses using vector memory.",
    name: "MailMind",
    designation: "React • FastAPI • ChromaDB",
    src: "https://images.unsplash.com/photo-1628749528992-f5702133b686?q=80&w=1368&auto=format&fit=crop",
  }
];

const experience = [
  {
    role: 'Webmaster', org: 'IEEE EMBS — BMSIT&M', period: 'Nov 2025 — Present',
    desc: 'Leading and maintaining the digital presence of IEEE EMBS through production-level web experiences, technical collaboration, event systems, and intelligent digital workflows. Contributing to healthcare-focused innovation initiatives while building scalable interfaces and improving digital engagement across technical operations.',
  },
  {
    role: 'Technical Lead', org: 'VOLCOM — IEEE EMBS', period: 'Oct 2025 — Jan 2026',
    desc: 'Worked on healthcare-focused technical initiatives involving biomedical systems, IoT applications, intelligent engineering workflows, and collaborative innovation projects. Contributed to system architecture, technical coordination, and innovation-driven engineering experiences within IEEE EMBS activities.',
  },
  {
    role: 'Full Stack Developer Intern', org: 'SuccessPath Classes', period: 'Jan 2026 — Feb 2026',
    desc: 'Developed scalable full stack systems including dashboards, backend APIs, student management workflows, and database-integrated applications. Focused on improving performance, usability, and modern user experience while working across frontend and backend engineering workflows.',
  },
];

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', query: '' });
  const [status, setStatus] = useState('idle');

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
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="glass" style={{ borderRadius: 24, padding: '3rem', maxWidth: 800, margin: '0 auto', textAlign: 'left', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 250px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#7DD3FC', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Full Name</label>
            <input type="text" required placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: 12, color: '#F5F7FA', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.3s' }} onFocus={e => e.target.style.borderColor = 'rgba(125,211,252,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
          </div>
          <div style={{ flex: '1 1 250px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#7DD3FC', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Gmail Address</label>
            <input type="email" required placeholder="john@gmail.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: 12, color: '#F5F7FA', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.3s' }} onFocus={e => e.target.style.borderColor = 'rgba(125,211,252,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#7DD3FC', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Your Query</label>
          <textarea required placeholder="Describe your query or proposal..." value={formData.query} onChange={e => setFormData({ ...formData, query: e.target.value })} rows={5} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: 12, color: '#F5F7FA', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', outline: 'none', resize: 'vertical', transition: 'border-color 0.3s' }} onFocus={e => e.target.style.borderColor = 'rgba(125,211,252,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
        </div>
        <button type="submit" disabled={status === 'loading'} style={{ alignSelf: 'center', background: 'linear-gradient(90deg, #3b82f6, #7DD3FC)', color: '#050816', fontWeight: 600, padding: '1rem 2.5rem', borderRadius: 999, border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer', transition: 'transform 0.2s, opacity 0.2s', opacity: status === 'loading' ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          {status === 'loading' ? 'Sending...' : 'Send Message'} <Mail size={16} />
        </button>
        {status === 'success' && <p style={{ textAlign: 'center', color: '#10B981', fontSize: '0.9rem', marginTop: '1rem' }}>Message sent successfully! I will get back to you soon.</p>}
        {status === 'error' && <p style={{ textAlign: 'center', color: '#EF4444', fontSize: '0.9rem', marginTop: '1rem' }}>Failed to send message. Please try again.</p>}
      </form>
    </div>
  );
};

const achievements = [
  { stat: '₹10K', label: 'National Sustainathon Winner', desc: 'Secured 3rd place at a national-level Sustainathon for developing a piezoelectric energy-harvesting system.' },
  { stat: '#1', label: 'Best Innovation Award', desc: 'Recognized for innovation in AI agent systems and intelligent workflow engineering at an Agentic AI Sprint Hackathon.' },
  { stat: 'IEEE', label: 'Leadership Recognition', desc: 'Leading digital systems and technical initiatives within IEEE EMBS as Webmaster.' },
];

const skillIcons = [Brain, Cpu, Database, Globe, Layers, Sparkles, Code2];

export default function App() {
  return (
    <>
      {/* ── Navigation ── */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-between px-6 py-3 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)] transition-all duration-300 w-[90%] max-w-4xl">
        <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.2rem', fontStyle: 'italic', color: '#F5F7FA', marginLeft: '1rem' }}>
          Pranit<span className="text-blue-500">.</span>
        </span>
        <div className="hidden md:flex gap-6 items-center">
          {['Work', 'About', 'Tech Stack', 'Contact'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
              className="font-sans text-[0.7rem] text-white/60 hover:text-blue-400 uppercase tracking-[0.2em] transition-colors duration-300"
            >
              {l}
            </a>
          ))}
          <a href="mailto:guptapranit34@gmail.com"
            className="px-5 py-2 font-sans text-[0.7rem] font-bold text-white uppercase tracking-widest rounded-full bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/40 transition-all duration-300"
          >
            Hire Me
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <ScrollExpandHero mediaSrc="/assets/pranit.jpeg" bgImageSrc="/assets/premium_neural_bg.png">

        {/* ── Who I Am ── */}
        <section id="about" className="section" style={{ background: '#000000' }}>
          <div className="section-inner">
            <Reveal><p className="eyebrow">Who I Am</p></Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'center' }}>
              <TerminalWindow />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { Icon: Brain, title: 'AI Systems', desc: 'Intelligent workflows using ML, RAG pipelines, and modern AI frameworks.' },
                  { Icon: Layers, title: 'Full Stack', desc: 'Scalable systems using React, FastAPI, PostgreSQL, and modern architecture.' },
                  { Icon: Sparkles, title: 'Product Design', desc: 'Cinematic digital interfaces focused on clarity, motion, and interaction.' },
                  { Icon: Cpu, title: 'Automation', desc: 'Automation-driven systems that improve workflows and productivity.' },
                ].map(({ Icon, title, desc }, i) => (
                  <Reveal key={title} delay={0.1 * i}>
                    <div className="glass" style={{ borderRadius: 16, padding: '1.5rem', height: '100%', transition: 'border-color 0.3s, background 0.3s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(125,211,252,0.2)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(125,211,252,0.04)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'; }}>
                      <Icon size={20} color="#7DD3FC" style={{ marginBottom: '0.85rem' }} />
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', fontWeight: 600, color: '#F5F7FA', marginBottom: '0.5rem' }}>{title}</p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#9CA3AF', lineHeight: 1.65 }}>{desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Floating skill icons row */}
            <div style={{ display: 'flex', gap: '1.2rem', marginTop: '3.5rem', flexWrap: 'wrap' }}>
              {skillIcons.map((Icon, i) => (
                <div key={i} className="glass" style={{ borderRadius: 12, padding: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(125,211,252,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}>
                  <Icon size={18} color="rgba(255,255,255,0.35)" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <TechStack />

        <div className="divider" />

        {/* ── Projects ── */}
        <section id="work" className="section" style={{ background: '#000000' }}>
          <div className="section-inner">
            <Reveal><p className="eyebrow">Featured Work</p></Reveal>
            <Reveal delay={0.05}><h2 className="section-title" style={{ marginBottom: '3.5rem' }}>Projects that matter.</h2></Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-wrap gap-6 items-center justify-center relative">
                <div
                  className="items-center justify-center relative flex w-full"
                  style={{ maxWidth: "1024px" }}
                >
                  <CircularTestimonials
                    testimonials={projectsList}
                    autoplay={true}
                    colors={{
                      name: "#f7f7ff",
                      designation: "#7DD3FC",
                      testimony: "#9CA3AF",
                      arrowBackground: "rgba(255,255,255,0.05)",
                      arrowForeground: "#F5F7FA",
                      arrowHoverBackground: "rgba(125,211,252,0.2)",
                    }}
                    fontSizes={{
                      name: "2rem",
                      designation: "1rem",
                      quote: "1.1rem",
                    }}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <div className="divider" />



        {/* ── Experience ── */}
        <section className="section" style={{ background: '#000000' }}>
          <div className="section-inner" style={{ maxWidth: 860, margin: '0 auto' }}>
            <Reveal><h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#F5F7FA', letterSpacing: '-0.02em', fontStyle: 'italic', marginBottom: '0.5rem', lineHeight: 1.1 }}>Where I've Built.</h2></Reveal>
            <Reveal delay={0.05}><p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4.5rem' }}>A journey through engineering, intelligent systems, and product-driven problem solving.</p></Reveal>
            
            <div style={{ position: 'relative', paddingLeft: '3rem' }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '11px', width: '2px', background: 'linear-gradient(180deg, rgba(125,211,252,0) 0%, rgba(125,211,252,0.4) 15%, rgba(125,211,252,0.4) 85%, rgba(125,211,252,0) 100%)', boxShadow: '0 0 10px rgba(125,211,252,0.3)', borderRadius: '2px' }} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
                {experience.map(({ role, org, period, desc }, i) => (
                  <Reveal key={org} delay={0.1 * i}>
                    <div style={{ position: 'relative', transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)', cursor: 'default' }}
                      onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'translateX(8px)'; }}
                      onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'none'; }}>
                      
                      <div style={{ position: 'absolute', left: '-3rem', top: '24px', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#7DD3FC', boxShadow: '0 0 15px rgba(125,211,252,0.8), 0 0 30px rgba(125,211,252,0.4)', transition: 'transform 0.3s' }} />
                      </div>
                      
                      <div className="glass" style={{ borderRadius: 24, padding: '2.5rem', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)', transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s' }}
                        onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.background = 'rgba(255,255,255,0.04)'; d.style.borderColor = 'rgba(125,211,252,0.15)'; d.style.boxShadow = '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 30px rgba(125,211,252,0.05)'; }}
                        onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.background = 'rgba(255,255,255,0.02)'; d.style.borderColor = 'rgba(255,255,255,0.05)'; d.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'; }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                          <div>
                            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.2rem', fontWeight: 600, color: '#F5F7FA', letterSpacing: '-0.01em', marginBottom: '0.3rem' }}>{role}</h3>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#7DD3FC', fontWeight: 500 }}>{org}</p>
                          </div>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.8rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.05)' }}>{period}</span>
                        </div>
                        <p className="body-text" style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)' }}>{desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── Achievements ── */}
        <section className="section" style={{ background: '#000000' }}>
          <div className="section-inner">
            <Reveal><p className="eyebrow">Recognition</p></Reveal>
            <Reveal delay={0.05}><h2 className="section-title" style={{ marginBottom: '3.5rem' }}>Achievements</h2></Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {achievements.map(({ stat, label, desc }, i) => (
                <Reveal key={label} delay={0.1 * i}>
                  <div className="glass" style={{ borderRadius: 20, padding: '2.5rem', transition: 'transform 0.3s, border-color 0.3s' }}
                    onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'translateY(-4px)'; d.style.borderColor = 'rgba(125,211,252,0.2)'; }}
                    onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'none'; d.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
                    <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#7DD3FC', lineHeight: 1, marginBottom: '0.6rem', letterSpacing: '-0.02em' }}>{stat}</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', fontWeight: 600, color: '#F5F7FA', marginBottom: '0.75rem' }}>{label}</p>
                    <p className="body-text" style={{ fontSize: '0.83rem' }}>{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── Philosophy ── */}
        <section className="section" style={{ background: '#000000', textAlign: 'center' }}>
          <div className="section-inner" style={{ maxWidth: 780 }}>
            <Reveal>
              <p className="eyebrow" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Philosophy</p>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2.8rem, 6vw, 5.5rem)', lineHeight: 1.06, letterSpacing: '-0.03em', color: '#F5F7FA', marginBottom: '2.5rem' }}>
                Building systems <em style={{ color: '#7DD3FC' }}>that think.</em>
              </h2>
              <p className="body-text" style={{ maxWidth: 600, margin: '0 auto 1.5rem' }}>
                I'm interested in systems where AI, engineering, and digital experience converge to create intelligent, meaningful, and future-facing products.
              </p>
              <p className="body-text" style={{ maxWidth: 540, margin: '0 auto' }}>
                My focus is not just writing code — but designing experiences that feel seamless, adaptive, and deeply human.
              </p>
            </Reveal>
          </div>
        </section>

        <div className="divider" />

        {/* ── Contact ── */}
        <section id="contact" className="section" style={{ background: '#000000', textAlign: 'center' }}>
          <div className="section-inner" style={{ maxWidth: 800 }}>
            <Reveal><p className="eyebrow" style={{ textAlign: 'center' }}>Contact</p></Reveal>
            <Reveal delay={0.08}>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2.8rem, 6vw, 5rem)', lineHeight: 1.06, letterSpacing: '-0.03em', color: '#F5F7FA', marginBottom: '1.5rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                Let's <span style={{ color: '#7DD3FC' }}>Connect.</span>
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
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.9rem 2rem', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.12)', color: '#F5F7FA', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '0.88rem', textDecoration: 'none', transition: 'background 0.2s, border-color 0.2s' }}
                  onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.background = 'rgba(255,255,255,0.05)'; a.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                  onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.background = 'transparent'; a.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
                  <ExternalLink size={16} /> GitHub
                </a>
                <a href="https://linkedin.com/in/pranit-kumar-378342357" target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.9rem 2rem', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.12)', color: '#F5F7FA', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '0.88rem', textDecoration: 'none', transition: 'background 0.2s, border-color 0.2s' }}
                  onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.background = 'rgba(255,255,255,0.05)'; a.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                  onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.background = 'transparent'; a.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
                  <Link size={16} /> LinkedIn
                </a>
              </div>
            </Reveal>

            {/* Footer */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.3)' }}>Pranit Kumar</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em' }}>© 2025 · Built with precision</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#7DD3FC', letterSpacing: '0.08em' }}>guptapranit34@gmail.com</span>
            </div>
          </div>
        </section>

      </ScrollExpandHero>
    </>
  );
}
