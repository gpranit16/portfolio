import { motion } from 'framer-motion';
import { 
  SiReact, SiTailwindcss, SiJavascript, 
  SiNodedotjs, SiExpress, SiMongodb, 
  SiOpenai, SiGithub, SiVercel, SiRender, SiPostman
} from 'react-icons/si';
import { FaDatabase, FaCode, FaLink, FaBrain, FaChevronRight } from 'react-icons/fa';

const AMBER = '#D4960F';


const techCategories = [
  {
    id: 'frontend',
    title: "FRONTEND",
    icon: <FaCode size={18} />,
    skills: [
      { name: "React.js", icon: <SiReact size={16} color="#61DAFB" /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss size={16} color="#06B6D4" /> },
      { name: "JavaScript", icon: <SiJavascript size={16} color="#F7DF1E" /> },
      { name: "Responsive UI", icon: <FaCode size={16} color="#C8BFA8" /> },
    ]
  },
  {
    id: 'backend',
    title: "BACKEND",
    icon: <SiNodedotjs size={18} />,
    skills: [
      { name: "Node.js", icon: <SiNodedotjs size={16} color="#339933" /> },
      { name: "Express.js", icon: <SiExpress size={16} color="#C8BFA8" /> },
      { name: "MongoDB", icon: <SiMongodb size={16} color="#47A248" /> },
      { name: "REST APIs", icon: <FaLink size={16} color="#8A8070" /> },
    ]
  },
  {
    id: 'ai',
    title: "AI & ML",
    icon: <FaBrain size={18} />,
    skills: [
      { name: "LangChain", icon: <FaLink size={16} color="#C8BFA8" /> },
      { name: "RAG Systems", icon: <FaDatabase size={16} color="#8A8070" /> },
      { name: "OpenAI SDK", icon: <SiOpenai size={16} color="#C8BFA8" /> },
      { name: "Vector Databases", icon: <FaDatabase size={16} color="#8A8070" /> },
    ]
  },
  {
    id: 'tools',
    title: "TOOLS",
    icon: <FaChevronRight size={18} />,
    skills: [
      { name: "Git & GitHub", icon: <SiGithub size={16} color="#C8BFA8" /> },
      { name: "Vercel", icon: <SiVercel size={16} color="#C8BFA8" /> },
      { name: "Render", icon: <SiRender size={16} color="#C8BFA8" /> },
      { name: "Postman", icon: <SiPostman size={16} color="#FF6C37" /> },
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 60, damping: 20 }
  }
};

export default function TechStack() {
  return (
    <section 
      id="tech-stack" 
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '6rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#000000',
      }}
    >
      {/* Background glow lines */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(30,58,138,0.15), transparent 70%)',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
        
        {/* Section header */}
        <div style={{ marginBottom: '4rem' }}>
          <motion.p
            initial={{ opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.6rem',
              color: AMBER,
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              marginBottom: '1.25rem',
            }}
          >
            Technical Foundation
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
              fontWeight: 700,
              color: '#F5EFE0',
              marginBottom: '1rem',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
            }}
          >
            Tech Stack.
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              color: '#8A8070',
              fontSize: '0.975rem',
              maxWidth: '480px',
              lineHeight: 1.75,
            }}
          >
            Tools I use to build scalable full-stack and AI-powered systems.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem',
            alignItems: 'stretch'
          }}
        >
          {techCategories.map((category) => (
            <motion.div
              key={category.id}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              style={{
                position: 'relative',
                borderRadius: '3px',
                background: 'rgba(20, 19, 16, 0.65)',
                border: '1px solid rgba(255, 248, 235, 0.07)',
                padding: '2.25rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'border-color 200ms ease, background 200ms ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(200, 130, 10, 0.18)';
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(200, 130, 10, 0.03)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255, 248, 235, 0.07)';
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(20, 19, 16, 0.65)';
              }}
            >
              {/* Category Icon */}
              <div style={{
                width: '40px', height: '40px', marginBottom: '1.25rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: AMBER,
                opacity: 0.7,
              }}>
                {category.icon}
              </div>

              {/* Category Title */}
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6rem', fontWeight: 500,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: AMBER, marginBottom: '1.25rem',
              }}>
                {category.title}
              </p>

              {/* Skills List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {category.skills.map((skill, idx) => (
                  <div key={skill.name} style={{
                    display: 'flex', alignItems: 'center', gap: '0.875rem',
                    padding: '0.875rem 0',
                    borderBottom: idx !== category.skills.length - 1 ? '1px solid rgba(255, 248, 235, 0.05)' : 'none',
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '28px', height: '28px', borderRadius: '3px',
                      background: 'rgba(255, 248, 235, 0.03)',
                      border: '1px solid rgba(255, 248, 235, 0.05)',
                    }}>
                      {skill.icon}
                    </div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: '#C8BFA8', fontWeight: 400 }}>
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: '4rem' }}
        >
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem',
            color: '#5A5248',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}>
            Constantly learning &middot; Continuously building &middot; Always shipping.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
