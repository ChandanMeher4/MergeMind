import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, LayoutDashboard, History, Activity, Sparkles, Code2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Magnetic from './Magnetic';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Team Health', path: '/team', icon: <Activity className="w-4 h-4" /> },
    { name: 'Review History', path: '/history', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 md:px-8 py-4 ${
        scrolled ? 'mt-0' : 'mt-2'
      }`}
    >
      <div 
        className={`max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-full border transition-all duration-500 overflow-hidden ${
          scrolled 
            ? 'bg-background/60 backdrop-blur-2xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]' 
            : 'bg-white/[0.03] backdrop-blur-md border-white/5'
        }`}
      >
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group relative">
          <motion.div 
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="p-2 rounded-xl bg-gradient-to-tr from-primary/20 to-primary/5 border border-primary/20 shadow-glow-primary/20"
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
          <span className="text-xl font-bold tracking-tighter text-white">
            Merge<span className="text-primary">Mind</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-white/[0.03] border border-white/5 shadow-inner">
            <Magnetic strength={0.2} radius={50}>
              <Link 
                to="/dashboard"
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 relative ${
                  location.pathname === '/dashboard' ? 'text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {location.pathname === '/dashboard' && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 bg-white/[0.08] rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            </Magnetic>

            {navLinks.map((link) => (
              <Magnetic key={link.path} strength={0.2} radius={50}>
                <Link 
                  to={link.path}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 relative ${
                    location.pathname === link.path ? 'text-white' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {location.pathname === link.path && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute inset-0 bg-white/[0.08] rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {link.icon}
                  {link.name}
                </Link>
              </Magnetic>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-white/10 mx-2" />

          {/* Magnetic CTA Wrapper */}
          <Magnetic strength={0.4} radius={80}>
            <Link to="/dashboard">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group px-6 py-2 rounded-full overflow-hidden bg-primary text-white font-semibold text-sm transition-all shadow-glow-primary hover:shadow-glow-primary/40"
              >
                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                <span className="relative flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  Launch App
                </span>
                
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full border border-white/20 animate-pulse-ring pointer-events-none" />
              </motion.button>
            </Link>
          </Magnetic>

          <Magnetic strength={0.1}>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </Magnetic>
        </div>
      </div>
    </nav>
  );
}
