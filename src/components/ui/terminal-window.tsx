"use client";

import { motion } from 'framer-motion';
import CyberBackground from './cyber-background';

const statements = [
  "Second-year CS Engineering student at BMSIT building AI-powered products, intelligent automation systems, and scalable full stack applications.",
  "Focused on agentic AI, RAG/CRAG pipelines, retrieval systems, and modern software architecture with an emphasis on real-world impact.",
  "Interested in creating future-facing digital experiences that combine AI, engineering, and product thinking into systems that feel intelligent, seamless, and practical."
];

export default function TerminalWindow() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-[4px] border border-[rgba(255,248,235,0.08)] overflow-hidden bg-[rgba(14,13,11,0.85)] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),0_0_20px_rgba(200,130,10,0.04)] w-full min-h-[350px] lg:min-h-[400px]"
    >
      {/* Scanline Effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02))',
        backgroundSize: '100% 4px, 3px 100%',
        pointerEvents: 'none',
        zIndex: 5
      }} />

      {/* 3D Background */}
      <CyberBackground />

      {/* Window Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 10, 
        padding: '16px 24px', 
        background: 'rgba(20, 19, 16, 0.6)', 
        borderBottom: '1px solid rgba(255, 248, 235, 0.06)',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
        </div>
        <span style={{ 
          marginLeft: 16, 
          fontSize: '0.8rem', 
          fontFamily: "'Inter', monospace", 
          color: 'rgba(255, 255, 255, 0.4)', 
          letterSpacing: '0.1em',
          fontWeight: 500
        }}>WHOAMI.EXE</span>
      </div>
      
      {/* Terminal Content */}
      <div className="p-6 md:p-10 lg:p-14 relative z-10">
        <motion.h3 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: 'clamp(2rem, 4vw, 2.8rem)', 
            color: '#F5EFE0', 
            marginBottom: '2.5rem', 
            letterSpacing: '-0.025em', 
            lineHeight: 1.1,
            fontWeight: 700
          }}
        >
          Designing systems where <br />
          AI and engineering <em style={{ color: '#D4960F', fontStyle: 'italic', fontWeight: 400 }}>converge.</em>
        </motion.h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {statements.map((stmt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
              style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}
            >
              <span style={{ 
                color: '#D4960F', 
                fontFamily: "'JetBrains Mono', monospace", 
                fontSize: '0.9rem', 
                marginTop: 2,
                opacity: 0.7,
              }}>{'›'}</span>
              <p style={{ 
                fontFamily: "'Inter', sans-serif", 
                fontSize: '0.95rem', 
                color: '#8A8070', 
                lineHeight: 1.75,
                fontWeight: 400,
                letterSpacing: '0.01em'
              }}>{stmt}</p>
            </motion.div>
          ))}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            style={{ 
              width: '8px', 
              height: '18px', 
              background: '#D4960F', 
              marginTop: '0.5rem',
              opacity: 0.6,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
