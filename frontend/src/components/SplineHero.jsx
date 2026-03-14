import { Suspense, lazy, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Spline = lazy(() => import('@splinetool/react-spline'));

export default function SplineHero() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {(isLoading || hasError) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-3xl"
          >
            {/* Fallback Animated Gradient Orbs if Spline fails or is loading */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-aurora" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] animate-aurora [animation-delay:2s]" />
          </motion.div>
        )}
      </AnimatePresence>

      {!hasError && (
        <Suspense fallback={null}>
          <Spline 
            scene="https://prod.spline.design/6Wq1Q7nS4v3T7fGR/scene.splinecode" 
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
            className="w-full h-full scale-110 lg:scale-100 opacity-60 lg:opacity-80 transition-opacity duration-1000"
          />
        </Suspense>
      )}

      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/40 to-background pointer-events-none" />
    </div>
  );
}
