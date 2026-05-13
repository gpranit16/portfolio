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
      style={{ 
        position: 'relative',
        borderRadius: 20, 
        border: '1px solid rgba(125, 211, 252, 0.15)', 
        overflow: 'hidden', 
        background: 'rgba(5, 8, 22, 0.8)', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(125, 211, 252, 0.05)',
        width: '100%',
        minHeight: '400px'
      }}
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
        background: 'rgba(255, 255, 255, 0.03)', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
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
      <div style={{ padding: '3.5rem 2.5rem', position: 'relative', zIndex: 10 }}>
        <motion.h3 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ 
            fontFamily: "'Instrument Serif', serif", 
            fontSize: 'clamp(2rem, 4vw, 2.8rem)', 
            color: '#F5F7FA', 
            marginBottom: '2.5rem', 
            letterSpacing: '-0.02em', 
            lineHeight: 1.1,
            fontWeight: 400
          }}
        >
          Designing systems where <br />
          AI and engineering <em style={{ color: '#7DD3FC', fontStyle: 'italic' }}>converge.</em>
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
                color: '#7DD3FC', 
                fontFamily: "monospace", 
                fontSize: '1.1rem', 
                marginTop: 2,
                textShadow: '0 0 8px rgba(125, 211, 252, 0.5)'
              }}>{'>'}</span>
              <p style={{ 
                fontFamily: "'Inter', sans-serif", 
                fontSize: '1.05rem', 
                color: 'rgba(245, 247, 250, 0.85)', 
                lineHeight: 1.6,
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
              width: '10px', 
              height: '20px', 
              background: '#7DD3FC', 
              marginTop: '0.5rem',
              boxShadow: '0 0 10px rgba(125, 211, 252, 0.6)'
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
