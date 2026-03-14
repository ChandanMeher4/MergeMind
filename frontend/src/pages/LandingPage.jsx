import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Zap, Code2, TestTube, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlowCard from '../components/GlowCard';
import ParticleField from '../components/ParticleField';
import Magnetic from '../components/Magnetic';

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
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-x-hidden">
      
      {/* ── Hero Section ───────────────────────────────────────────── */}
      <div className="relative">
        {/* Interactive particle constellation background */}
        <div className="absolute inset-0 -top-32 -bottom-40 -left-20 -right-20 overflow-hidden pointer-events-auto opacity-80">
          <ParticleField />
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center mt-12 mb-36 relative z-10"
        >
          {/* Badge */}
          <motion.div 
            variants={item} 
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-hover mb-10 backdrop-blur-md shadow-glow-primary/5"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide uppercase">MergeMind v1.0 is live</span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
          </motion.div>
          
          {/* Main headline */}
          <motion.h1 
            variants={item} 
            className="text-6xl md:text-8xl lg:text-[110px] font-black tracking-tighter mb-10 max-w-6xl text-balance leading-[0.85] text-white"
          >
            <span className="opacity-80">The </span>
            <span className="gradient-text-animated filter drop-shadow-[0_0_30px_rgba(79,70,229,0.3)]">
              Elite AI Reviewer
            </span>
            <br />
            <span className="bg-gradient-to-b from-white via-white/70 to-white/10 bg-clip-text text-transparent italic font-serif tracking-tight pr-4">
              for World-Class Engineering.
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            variants={item} 
            className="text-xl md:text-2xl text-white/50 max-w-3xl mb-14 text-balance leading-relaxed font-light tracking-wide"
          >
            Trained on millions of top-tier pull requests. Catch what humans miss. <span className="text-white/80 font-medium whitespace-nowrap">Merge with absolute confidence.</span>
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-6">
            <Magnetic strength={0.4} radius={100}>
              <Link to="/dashboard">
                <motion.button 
                  className="relative flex items-center gap-3 bg-primary hover:bg-primary-hover text-white px-12 py-5 rounded-full font-bold text-xl transition-all duration-300 overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    boxShadow: '0 0 40px rgba(79,70,229,0.5), 0 0 100px rgba(79,70,229,0.2)',
                  }}
                >
                  {/* Shimmer sweep */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  <span className="relative z-10">Start Reviewing</span>
                  <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                  
                  {/* Outer glow ring */}
                  <span className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse-ring" />
                </motion.button>
              </Link>
            </Magnetic>
            
            <Magnetic strength={0.2} radius={60}>
              <a 
                href="#features" 
                className="px-10 py-5 rounded-full font-semibold text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-white/20 backdrop-blur-sm"
              >
                See How It Works
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Feature Cards ─────────────────────────────────────────── */}
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-150px" }}
        id="features"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
      >
        {features.map((feat, i) => (
          <motion.div key={i} variants={item}>
            <GlowCard glowColor={feat.glowColor} tilt={true} className="h-full">
              <div className="p-10 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] shadow-inner">
                    {feat.icon}
                  </div>
                  {/* Decorative corner gradient */}
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${feat.color} to-transparent rounded-bl-full opacity-0 group-hover:opacity-30 transition-opacity duration-700`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">{feat.title}</h3>
                  <p className="text-white/40 leading-relaxed text-lg font-light">{feat.description}</p>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Bottom gradient fade ──────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-20" />
    </div>
  );
}
