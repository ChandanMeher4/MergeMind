import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { BrainCircuit, Github, CodeSquare } from 'lucide-react';

const navLinks = [
  { to: '/team', label: 'Team Health' },
  { to: '/history', label: 'Review History' },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className="fixed w-full z-50 top-0 pt-4 px-6 md:px-12 pointer-events-none">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto"
      >
        <div 
          className={`pointer-events-auto rounded-full px-6 py-3 flex items-center justify-between transition-all duration-500 ${
            scrolled 
              ? 'bg-background/80 backdrop-blur-2xl border border-white/[0.08] shadow-lg shadow-black/20' 
              : 'bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]'
          }`}
          style={{
            boxShadow: scrolled 
              ? '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 0 rgba(255,255,255,0.05)' 
              : 'inset 0 1px 0 0 rgba(255,255,255,0.04)',
          }}
        >
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div 
              className="relative flex items-center justify-center p-2 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <BrainCircuit className="w-5 h-5 text-primary" />
              {/* Glow ring behind icon */}
              <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              MergeMind
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative text-sm font-medium transition-colors duration-200 hover:text-white group"
              >
                <span className={location.pathname === link.to ? 'text-white' : 'text-white/60'}>
                  {link.label}
                </span>
                {/* Active indicator dot */}
                {location.pathname === link.to && (
                  <motion.div
                    layoutId="nav-active-indicator"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-glow-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                {/* Hover underline */}
                <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>
            ))}
            
            <a href="https://github.com/mchan/MergeMind" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors duration-200">
              <Github className="w-5 h-5" />
            </a>
            
            <Link to="/dashboard">
              <motion.button 
                className="relative flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full font-medium transition-all duration-300 overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: '0 0 20px rgba(79,70,229,0.3), 0 0 60px rgba(79,70,229,0.1)',
                }}
              >
                {/* Shimmer sweep on hover */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <CodeSquare className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Launch App</span>
                
                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-full border border-primary/50 animate-pulse-ring" />
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </nav>
  );
}
