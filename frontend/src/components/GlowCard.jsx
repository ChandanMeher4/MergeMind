import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function GlowCard({ children, className = '', glowColor = 'rgba(79,70,229,0.15)', ...props }) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-2xl overflow-hidden group ${className}`}
      {...props}
    >
      {/* Animated glow border that follows mouse */}
      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 40%)`,
        }}
      />

      {/* Top edge light reflection */}
      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0.3,
          background: `radial-gradient(ellipse at ${mousePos.x}px 0px, rgba(255,255,255,0.15), transparent 50%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl transition-all duration-500 group-hover:border-white/[0.12] group-hover:bg-white/[0.05]"
        style={{
          boxShadow: isHovered
            ? `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 0 rgba(255,255,255,0.06)`
            : `0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 0 rgba(255,255,255,0.03)`,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
