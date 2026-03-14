import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const liquidTransition = {
  initial: { 
    opacity: 0, 
    y: 20, 
    scale: 0.98,
    filter: 'blur(10px)',
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: 'blur(0px)',
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1], // Premium ease-out expo
      staggerChildren: 0.1
    } 
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    scale: 1.02,
    filter: 'blur(10px)',
    transition: { 
      duration: 0.4, 
      ease: [0.7, 0, 0.84, 0] // Ease-in
    } 
  }
};

export default function PageTransition({ children }) {
  const { pathname } = useLocation();

  return (
    <motion.div
      key={pathname}
      variants={liquidTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full flex-grow flex flex-col relative"
    >
      {/* Decorative transition flash */}
      <motion.div 
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: [0, 0.1, 0], scaleY: [0, 1, 0] }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed inset-0 bg-primary/20 pointer-events-none z-[100] origin-top"
      />
      {children}
    </motion.div>
  );
}
