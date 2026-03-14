import { useState, useEffect } from 'react';

export default function AnimatedCounter({ value, suffix = '', duration = 2000 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const finalValue = parseFloat(value) || 0;

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Quartic ease-out
      const eased = 1 - Math.pow(1 - progress, 4);
      
      setDisplayValue(Math.round(finalValue * eased));

      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{displayValue}{suffix}</>;
}
