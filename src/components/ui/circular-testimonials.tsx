"use client";
import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from 'lucide-react';

export interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
  link?: string;
}

interface Colors {
  name?: string;
  designation?: string;
  testimony?: string;
  arrowBackground?: string;
  arrowForeground?: string;
  arrowHoverBackground?: string;
}

interface FontSizes {
  name?: string;
  designation?: string;
  quote?: string;
}

interface CircularTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  colors?: Colors;
  fontSizes?: FontSizes;
}

// Increased gap for a more pronounced "circular" effect
function calculateGap(width: number) {
  const minWidth = 1024;
  const maxWidth = 1456;
  // We want the side images to be significantly offset to see the "circular" stack
  const minGap = width * 0.15; 
  const maxGap = width * 0.2;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth) return maxGap;
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export const CircularTestimonials = ({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {},
}: CircularTestimonialsProps) => {
  const colorName = colors.name ?? "#000";
  const colorDesignation = colors.designation ?? "#6b7280";
  const colorTestimony = colors.testimony ?? "#4b5563";
  const colorArrowBg = colors.arrowBackground ?? "#141414";
  const colorArrowFg = colors.arrowForeground ?? "#f1f1f7";
  const colorArrowHoverBg = colors.arrowHoverBackground ?? "#00a6fb";
  const fontSizeName = fontSizes.name ?? "1.5rem";
  const fontSizeDesignation = fontSizes.designation ?? "0.925rem";
  const fontSizeQuote = fontSizes.quote ?? "1.125rem";

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const testimonialsLength = useMemo(() => testimonials.length, [testimonials]);
  const activeTestimonial = useMemo(
    () => testimonials[activeIndex],
    [activeIndex, testimonials]
  );

  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (autoplay) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonialsLength);
      }, 5000);
    }
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [autoplay, testimonialsLength]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonialsLength) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  // Enhanced 3D Carousel logic for a true "circular" feel
  const getMotionProps = (index: number) => {
    const gap = calculateGap(containerWidth);
    // const offset = (index - activeIndex + testimonialsLength) % testimonialsLength;
    
    let x = 0;
    let y = 0;
    let scale = 1;
    let rotateY = 0;
    let zIndex = 1;
    let opacity = 0;

    if (index === activeIndex) {
      // Center
      x = 0;
      y = 0;
      scale = 1;
      rotateY = 0;
      zIndex = 10;
      opacity = 1;
    } else if (index === (activeIndex - 1 + testimonialsLength) % testimonialsLength) {
      // Left side
      x = -gap;
      y = -20;
      scale = 0.8;
      rotateY = 25;
      zIndex = 5;
      opacity = 0.5;
    } else if (index === (activeIndex + 1) % testimonialsLength) {
      // Right side
      x = gap;
      y = -20;
      scale = 0.8;
      rotateY = -25;
      zIndex = 5;
      opacity = 0.5;
    }

    return {
      animate: {
        x,
        y,
        scale,
        rotateY,
        zIndex,
        opacity,
      },
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1] as const
      }
    };
  };

  return (
    <div className="testimonial-container">
      <div className="testimonial-grid">
        <div className="image-container" ref={imageContainerRef} style={{ perspective: '1200px' }}>
          <AnimatePresence initial={false}>
            {testimonials.map((testimonial, index) => (
              <motion.img
                key={testimonial.src}
                src={testimonial.src}
                alt={testimonial.name}
                className="testimonial-image"
                {...getMotionProps(index)}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '1.5rem',
                  boxShadow: index === activeIndex ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 10px 20px rgba(0,0,0,0.2)',
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        <div className="testimonial-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="name" style={{ color: colorName, fontSize: fontSizeName, fontFamily: "'Space Grotesk', sans-serif" }}>
                {activeTestimonial.name}
              </h3>
              <p className="designation" style={{ color: colorDesignation, fontSize: fontSizeDesignation, fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {activeTestimonial.designation}
              </p>
              <p className="quote" style={{ color: colorTestimony, fontSize: fontSizeQuote, fontFamily: "'Lora', serif" }}>
                {activeTestimonial.quote.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ filter: "blur(8px)", opacity: 0, y: 5 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.02 * i }}
                    style={{ display: "inline-block" }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </p>
              
              {activeTestimonial.link && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginTop: '2rem' }}>
                  <a href={activeTestimonial.link} target="_blank" rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1.4rem', borderRadius: '999px', background: 'rgba(125,211,252,0.1)', color: '#7DD3FC', border: '1px solid rgba(125,211,252,0.2)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}
                  >
                    Explore Project <ExternalLink size={16} />
                  </a>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="arrow-buttons">
            <button className="arrow-button" onClick={handlePrev}
              style={{ backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg }}
              onMouseEnter={() => setHoverPrev(true)} onMouseLeave={() => setHoverPrev(false)}
            >
              <FaArrowLeft size={20} color={colorArrowFg} />
            </button>
            <button className="arrow-button" onClick={handleNext}
              style={{ backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg }}
              onMouseEnter={() => setHoverNext(true)} onMouseLeave={() => setHoverNext(false)}
            >
              <FaArrowRight size={20} color={colorArrowFg} />
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .testimonial-container { width: 100%; max-width: 64rem; padding: 2rem; margin: 0 auto; }
        .testimonial-grid { display: grid; gap: 4rem; grid-template-columns: 1fr; }
        .image-container { position: relative; width: 100%; height: 28rem; }
        .testimonial-content { display: flex; flex-direction: column; justify-content: center; min-height: 28rem; }
        .name { font-weight: 700; margin-bottom: 0.5rem; }
        .designation { margin-bottom: 2rem; font-weight: 500; }
        .quote { line-height: 1.8; }
        .arrow-buttons { display: flex; gap: 1.5rem; margin-top: 3rem; }
        .arrow-button { width: 3.5rem; height: 3.5rem; border-radius: 50%; display: flex; alignItems: center; justifyContent: center; cursor: pointer; transition: all 0.3s ease; border: none; }
        @media (min-width: 1024px) {
          .testimonial-grid { grid-template-columns: 1.1fr 0.9fr; }
          .arrow-buttons { margin-top: 4rem; }
        }
      `}</style>
    </div>
  );
};

export default CircularTestimonials;
