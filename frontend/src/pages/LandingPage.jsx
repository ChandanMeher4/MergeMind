import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Zap, Code2, TestTube, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlowCard from '../components/GlowCard';
import SplineHero from '../components/SplineHero';

const features = [
  {
    icon: <Code2 className="w-6 h-6 text-primary" />,
    title: "Logic & Bugs",
    description: "Detect off-by-one errors, null dereferences, and async pitfalls before they hit production.",
    color: "from-primary/20",
    glowColor: "rgba(79,70,229,0.15)",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-success" />,
    title: "Security Stance",
    description: "Catch OWASP Top 10 vulnerabilities, leaked secrets, and broken auth mechanisms instantly.",
    color: "from-success/20",
    glowColor: "rgba(16,185,129,0.15)",
  },
  {
    icon: <Zap className="w-6 h-6 text-warning" />,
    title: "Performance",
    description: "Identify N+1 queries, memory leaks, blocking I/O, and unnecessary render cycles.",
    color: "from-warning/20",
    glowColor: "rgba(245,158,11,0.15)",
  },
  {
    icon: <TestTube className="w-6 h-6 text-indigo-400" />,
    title: "Test Coverage",
    description: "Spot missing edge cases and untested error paths that codecov might miss.",
    color: "from-indigo-400/20",
    glowColor: "rgba(129,140,248,0.15)",
  }
];

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto">
      
      {/* ── Hero Section ───────────────────────────────────────────── */}
      <div className="relative">
        {/* Spline 3D background */}
        <div className="absolute inset-0 -top-20 -bottom-40 overflow-hidden">
          <SplineHero />
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center mt-12 mb-24 relative z-10"
        >
          {/* Badge */}
          <motion.div 
            variants={item} 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-hover mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">MergeMind v1.0 is live</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </motion.div>
          
          {/* Main headline */}
          <motion.h1 
            variants={item} 
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 max-w-5xl text-balance leading-[0.95]"
          >
            <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
              The{' '}
            </span>
            <span className="gradient-text-animated">
              Elite AI Reviewer
            </span>
            <br />
            <span className="bg-gradient-to-b from-white via-white/80 to-white/30 bg-clip-text text-transparent">
              for World-Class Engineering.
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            variants={item} 
            className="text-xl md:text-2xl text-white/50 max-w-2xl mb-12 text-balance leading-relaxed font-light"
          >
            Trained on millions of top-tier pull requests. Catch what humans miss. Merge with absolute confidence.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/dashboard">
              <motion.button 
                className="relative flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: '0 0 30px rgba(79,70,229,0.4), 0 0 80px rgba(79,70,229,0.15)',
                }}
              >
                {/* Shimmer sweep */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10">Start Reviewing</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                
                {/* Outer glow ring */}
                <span className="absolute inset-0 rounded-full border border-primary/30 animate-pulse-ring" />
              </motion.button>
            </Link>
            <a 
              href="#features" 
              className="px-8 py-4 rounded-full font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
            >
              See How It Works
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Feature Cards ─────────────────────────────────────────── */}
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        id="features"
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {features.map((feat, i) => (
          <motion.div key={i} variants={item}>
            <GlowCard glowColor={feat.glowColor}>
              <div className="p-8 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] group-hover:scale-110 transition-transform duration-500">
                    {feat.icon}
                  </div>
                  {/* Decorative corner gradient */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${feat.color} to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{feat.title}</h3>
                  <p className="text-white/50 leading-relaxed">{feat.description}</p>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Bottom gradient fade ──────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
}
