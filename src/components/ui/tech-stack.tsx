import { motion } from 'framer-motion';
import { 
  SiReact, SiTailwindcss, SiJavascript, 
  SiNodedotjs, SiExpress, SiMongodb, 
  SiOpenai, SiGithub, SiVercel, SiRender, SiPostman
} from 'react-icons/si';
import { FaDatabase, FaCode, FaLink, FaBrain, FaChevronRight } from 'react-icons/fa';

const techCategories = [
  {
    id: 'frontend',
    title: "FRONTEND",
    icon: <FaCode size={20} />,
    glowColor: "rgba(56, 189, 248, 1)", // light blue
    bgGlow: "rgba(56, 189, 248, 0.15)",
    borderColor: "rgba(56, 189, 248, 0.4)",
    skills: [
      { name: "React.js", icon: <SiReact size={18} color="#61DAFB" /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss size={18} color="#06B6D4" /> },
      { name: "JavaScript", icon: <SiJavascript size={18} color="#F7DF1E" /> },
      { name: "Responsive UI", icon: <FaCode size={18} color="#A78BFA" /> },
    ]
  },
  {
    id: 'backend',
    title: "BACKEND",
    icon: <SiNodedotjs size={20} />,
    glowColor: "rgba(52, 211, 153, 1)", // emerald
    bgGlow: "rgba(52, 211, 153, 0.15)",
    borderColor: "rgba(52, 211, 153, 0.4)",
    skills: [
      { name: "Node.js", icon: <SiNodedotjs size={18} color="#339933" /> },
      { name: "Express.js", icon: <SiExpress size={18} color="#FFFFFF" /> },
      { name: "MongoDB", icon: <SiMongodb size={18} color="#47A248" /> },
      { name: "REST APIs", icon: <FaLink size={18} color="#F87171" /> },
    ]
  },
  {
    id: 'ai',
    title: "AI & ML",
    icon: <FaBrain size={20} />,
    glowColor: "rgba(167, 139, 250, 1)", // purple
    bgGlow: "rgba(167, 139, 250, 0.15)",
    borderColor: "rgba(167, 139, 250, 0.4)",
    skills: [
      { name: "LangChain", icon: <FaLink size={18} color="#3B82F6" /> },
      { name: "RAG Systems", icon: <FaDatabase size={18} color="#8B5CF6" /> },
      { name: "OpenAI SDK", icon: <SiOpenai size={18} color="#FFFFFF" /> },
      { name: "Vector Databases", icon: <FaDatabase size={18} color="#EC4899" /> },
    ]
  },
  {
    id: 'tools',
    title: "TOOLS",
    icon: <FaChevronRight size={20} />,
    glowColor: "rgba(251, 146, 60, 1)", // orange
    bgGlow: "rgba(251, 146, 60, 0.15)",
    borderColor: "rgba(251, 146, 60, 0.4)",
    skills: [
      { name: "Git & GitHub", icon: <SiGithub size={18} color="#FFFFFF" /> },
      { name: "Vercel", icon: <SiVercel size={18} color="#FFFFFF" /> },
      { name: "Render", icon: <SiRender size={18} color="#FFFFFF" /> },
      { name: "Postman", icon: <SiPostman size={18} color="#FF6C37" /> },
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
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.4rem 1rem', borderRadius: '999px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              background: 'rgba(56, 189, 248, 0.05)',
              color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              marginBottom: '1.5rem'
            }}
          >
            <FaCode size={12} />
            <span>My Tech Stack</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(3rem, 5vw, 4.5rem)',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '1rem',
              lineHeight: 1.1
            }}
          >
            Tech <span style={{ color: '#38bdf8' }}>Stack</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: "'Lora', serif",
              color: 'rgba(255,255,255,0.6)',
              fontSize: '1.1rem',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            Technologies and tools I use to build scalable full stack and AI-powered systems.
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
              whileHover={{ y: -5, boxShadow: `0 10px 40px ${category.bgGlow}` }}
              style={{
                position: 'relative',
                borderRadius: '1.5rem',
                background: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(10px)',
                border: `1px solid rgba(255,255,255,0.08)`,
                padding: '2.5rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.4s ease',
                boxShadow: `0 0 20px rgba(0,0,0,0.5), inset 0 0 20px ${category.bgGlow}`,
              }}
            >
              {/* Category Icon */}
              <div style={{
                width: '64px', height: '64px', margin: '0 auto 1.5rem',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${category.borderColor}`,
                background: `radial-gradient(circle, ${category.bgGlow}, transparent)`,
                color: category.glowColor,
                boxShadow: `0 0 20px ${category.bgGlow}`
              }}>
                {category.icon}
              </div>

              {/* Category Title */}
              <h3 style={{
                textAlign: 'center', fontSize: '0.85rem', fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: category.glowColor, marginBottom: '0.75rem'
              }}>
                {category.title}
              </h3>
              
              <div style={{
                width: '24px', height: '2px', margin: '0 auto 2rem',
                background: category.glowColor, borderRadius: '2px',
                boxShadow: `0 0 8px ${category.glowColor}`
              }} />

              {/* Skills List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {category.skills.map((skill, idx) => (
                  <div key={skill.name} style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 0.5rem',
                    borderBottom: idx !== category.skills.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      {skill.icon}
                    </div>
                    <span style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 500 }}>
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.6rem 1.5rem', borderRadius: '999px',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)'
          }}>
            <span style={{ color: '#38bdf8' }}>✦</span> 
            Constantly learning. Continuously building. 
            <span style={{ color: '#38bdf8', fontWeight: 500, marginLeft: '0.25rem' }}>Always shipping.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
