import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function GlowCard({ children, className = '', glowColor = 'rgba(79,70,229,0.15)', tilt = true }) {
  const cardRef = useRef(null);
  
  // Mouse position for glow effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Mouse position for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for tilt
  const stiffness = 150;
  const damping = 20;
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness, damping });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness, damping });

  function handleMouseMove(e) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Update glow position
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);

    // Update tilt position (-0.5 to 0.5)
    if (tilt) {
      const xPos = (e.clientX - rect.left) / rect.width - 0.5;
      const yPos = (e.clientY - rect.top) / rect.height - 0.5;
      x.set(xPos);
      y.set(yPos);
    }
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: tilt ? rotateX : 0,
        rotateY: tilt ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      className={`group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.05] overflow-hidden ${className}`}
    >
      {/* Radial glow follow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, ${glowColor}, transparent 40%)`
          ),
        }}
      />

      {/* Content wrapper with perspective insulation */}
      <div style={{ transform: 'translateZ(20px)' }} className="relative z-10 w-full h-full">
        {children}
      </div>
      
      {/* Decorative corner reflection */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/[0.02] to-transparent rounded-bl-full pointer-events-none opacity-50" />
    </motion.div>
  );
}
