import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-background">
      {/* Primary aurora orb — top left */}
      <motion.div
        className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(79,70,229,0.25) 0%, rgba(79,70,229,0.05) 50%, transparent 70%)',
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -50, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary orb — right */}
      <motion.div
        className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.03) 50%, transparent 70%)',
        }}
        animate={{
          x: [0, -40, 20, 0],
          y: [0, 30, -40, 0],
          scale: [1, 0.9, 1.08, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Tertiary orb — bottom */}
      <motion.div
        className="absolute -bottom-[30%] left-[20%] w-[80%] h-[60%] rounded-full mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.03) 50%, transparent 70%)',
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -20, 40, 0],
          scale: [1, 1.05, 0.92, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Accent orb — emerald bottom-right */}
      <motion.div
        className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] rounded-full mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 60%)',
        }}
        animate={{
          x: [0, -20, 15, 0],
          y: [0, -30, 10, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Subtle grid texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }} 
      />

      {/* Noise texture overlay for depth */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1' /%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
