import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

const Spline = lazy(() => import('@splinetool/react-spline'));

function SplineFallback() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Animated gradient orb as fallback */}
      <motion.div
        className="w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(79,70,229,0.4) 0%, rgba(99,102,241,0.2) 40%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 60%)',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.7, 0.4],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

export default function SplineHero() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <Suspense fallback={<SplineFallback />}>
        <Spline
          scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
          className="w-full h-full"
        />
      </Suspense>
    </div>
  );
}
