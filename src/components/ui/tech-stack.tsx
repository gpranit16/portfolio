import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  SiC, 
  SiCplusplus, 
  SiPython, 
  SiJavascript, 
  SiLangchain, 
  SiOpenai, 
  SiFastapi, 
  SiNodedotjs, 
  SiExpress, 
  SiPostgresql, 
  SiMongodb, 
  SiDocker, 
  SiGithub, 
  SiVercel, 
  SiRender, 
  SiPostman 
} from 'react-icons/si';
import { Network, Database, Layers, Search, ArrowLeftRight } from 'lucide-react';

const AMBER = '#C8820A';
const AMBER_LIGHT = '#D4960F';

interface TechItem {
  name: string;
  icon: React.ReactNode;
}

interface TechCategory {
  id: string;
  index: string;
  category: string;
  skills: TechItem[];
  isPrimary?: boolean;
}

const techCategories: TechCategory[] = [
  {
    id: 'languages',
    index: '01',
    category: 'LANGUAGES',
    skills: [
      { name: 'C', icon: <SiC size={14} /> },
      { name: 'C++', icon: <SiCplusplus size={14} /> },
      { name: 'Python', icon: <SiPython size={14} /> },
      { name: 'JavaScript', icon: <SiJavascript size={14} /> },
    ]
  },
  {
    id: 'ai-systems',
    index: '02',
    category: 'AI SYSTEMS',
    isPrimary: true,
    skills: [
      { name: 'LangChain', icon: <SiLangchain size={14} /> },
      { name: 'LangGraph', icon: <Network size={14} strokeWidth={1.75} /> },
      { name: 'OpenAI SDK', icon: <SiOpenai size={14} /> },
      { name: 'RAG / CRAG', icon: <Layers size={14} strokeWidth={1.75} /> },
      { name: 'Embeddings', icon: <Database size={14} strokeWidth={1.75} /> },
      { name: 'Vector Search', icon: <Search size={14} strokeWidth={1.75} /> },
    ]
  },
  {
    id: 'backend-data',
    index: '03',
    category: 'BACKEND & DATA',
    skills: [
      { name: 'FastAPI', icon: <SiFastapi size={14} /> },
      { name: 'Node.js', icon: <SiNodedotjs size={14} /> },
      { name: 'Express.js', icon: <SiExpress size={14} /> },
      { name: 'PostgreSQL', icon: <SiPostgresql size={14} /> },
      { name: 'MongoDB', icon: <SiMongodb size={14} /> },
      { name: 'pgvector', icon: <Database size={14} strokeWidth={1.75} /> },
      { name: 'REST APIs', icon: <ArrowLeftRight size={14} strokeWidth={1.75} /> },
    ]
  },
  {
    id: 'infra-tools',
    index: '04',
    category: 'INFRA & TOOLS',
    skills: [
      { name: 'Docker', icon: <SiDocker size={14} /> },
      { name: 'Git & GitHub', icon: <SiGithub size={14} /> },
      { name: 'Vercel', icon: <SiVercel size={14} /> },
      { name: 'Render', icon: <SiRender size={14} /> },
      { name: 'Postman', icon: <SiPostman size={14} /> },
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
  }
};

function TechRow({ skill, isLast, rowPadding }: { skill: TechItem; isLast: boolean; rowPadding: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: rowPadding,
        borderBottom: isLast ? 'none' : '1px solid rgba(255, 248, 235, 0.04)',
        transform: hovered ? 'translateX(3px)' : 'translateX(0)',
        transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'default',
        borderRadius: '2px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '16px',
            height: '16px',
            color: hovered ? AMBER_LIGHT : '#8A8070',
            transition: 'color 200ms ease',
            flexShrink: 0,
          }}
        >
          {skill.icon}
        </div>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.9375rem',
            color: hovered ? '#F5EFE0' : '#E8E1D5',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            transition: 'color 200ms ease',
          }}
        >
          {skill.name}
        </span>
      </div>

      <div
        style={{
          width: '3.5px',
          height: '3.5px',
          borderRadius: '50%',
          background: AMBER,
          opacity: hovered ? 0.9 : 0,
          transform: hovered ? 'scale(1)' : 'scale(0.5)',
          transition: 'opacity 200ms ease, transform 200ms ease',
        }}
      />
    </div>
  );
}

export default function TechStack() {
  return (
    <section 
      id="tech-stack" 
      style={{
        position: 'relative',
        padding: 'clamp(3.5rem, 6vw, 6.5rem) clamp(1rem, 3vw, 2.5rem)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#0E0D0B',
        overflow: 'hidden',
      }}
    >
      {/* Subtle ambient lighting consistent with Hero and About */}
      <div 
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -25%)',
          width: '750px',
          height: '450px',
          background: 'radial-gradient(ellipse at center, rgba(200, 130, 10, 0.025) 0%, rgba(200, 130, 10, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }} 
      />

      <div style={{ maxWidth: '1240px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
        
        {/* Section Header */}
        <div style={{ marginBottom: 'clamp(2rem, 4vw, 3.5rem)' }}>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.6875rem',
              color: AMBER,
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              marginBottom: '0.85rem',
              fontWeight: 500,
            }}
          >
            03 / TECHNICAL CAPABILITIES
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] as const }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
              fontWeight: 700,
              fontStyle: 'italic',
              color: '#F5EFE0',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Tech Stack.
          </motion.h2>
        </div>

        {/* 4 Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
            gap: '1.25rem',
            alignItems: 'stretch'
          }}
        >
          {techCategories.map((category) => {
            const rowPad = category.skills.length <= 4 
              ? '1.05rem 0.35rem' 
              : category.skills.length === 5 
                ? '0.9rem 0.35rem' 
                : '0.78rem 0.35rem';

            return (
              <motion.div
                key={category.id}
                variants={cardVariants}
                whileHover={{ y: -3 }}
                style={{
                  position: 'relative',
                  borderRadius: '4px',
                  background: '#141310',
                  border: '1px solid rgba(255, 248, 235, 0.08)',
                  padding: '1.85rem 1.4rem 1.65rem',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 12px 32px -12px rgba(0, 0, 0, 0.6)',
                  transition: 'border-color 220ms ease, box-shadow 220ms ease',
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLDivElement;
                  target.style.borderColor = 'rgba(200, 130, 10, 0.2)';
                  target.style.boxShadow = '0 16px 36px -10px rgba(0, 0, 0, 0.75), 0 0 20px rgba(200, 130, 10, 0.025)';
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLDivElement;
                  target.style.borderColor = 'rgba(255, 248, 235, 0.08)';
                  target.style.boxShadow = '0 12px 32px -12px rgba(0, 0, 0, 0.6)';
                }}
              >
                {/* Card Header */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    paddingBottom: '1.15rem',
                    marginBottom: '0.95rem',
                    borderBottom: '1px solid rgba(255, 248, 235, 0.08)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: AMBER,
                        letterSpacing: '0.12em',
                      }}
                    >
                      {category.index}
                    </span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: '#F5EFE0',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {category.category}
                    </span>
                  </div>
                </div>

                {/* Technology Rows */}
                <div 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    flex: 1,
                    justifyContent: 'flex-start',
                  }}
                >
                  {category.skills.map((skill, idx) => (
                    <TechRow 
                      key={skill.name} 
                      skill={skill} 
                      isLast={idx === category.skills.length - 1}
                      rowPadding={rowPad}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
