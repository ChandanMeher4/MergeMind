import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Play, Terminal as TerminalIcon, AlertCircle, CheckCircle2, Info, ArrowUpRight, Copy, Check } from 'lucide-react';
import io from 'socket.io-client';
import axios from 'axios';
import GlowCard from '../components/GlowCard';
import Magnetic from '../components/Magnetic';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000');
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, ''),
});

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [currentReview, setCurrentReview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');
  const [isCopied, setIsCopied] = useState(false);
  const [user, setUser] = useState(null);
  const logEndRef = useRef(null);

  const webhookUrl = `${import.meta.env.VITE_WEBHOOK_URL || 'http://localhost:3000/webhook'}`;

  // Handle Auth Token from URL Hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('token=')) {
      const token = hash.split('token=')[1];
      localStorage.setItem('mergemind_token', token);
      // Clean URL
      window.history.replaceState(null, null, window.location.pathname);
    }

    const savedToken = localStorage.getItem('mergemind_token');
    if (savedToken) {
      try {
        const payload = JSON.parse(atob(savedToken.split('.')[1]));
        setUser(payload);
        // Set global auth header for this file's api instance
        api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      } catch (e) {
        console.error("Invalid token", e);
        localStorage.removeItem('mergemind_token');
      }
    }
  }, []);

  useEffect(() => {
    socket.on('reviewUpdate', (data) => {
      if (data.type === 'log') {
        setLogs(prev => [...prev, data.message]);
        setProgress(data.progress || 0);
      } else if (data.type === 'complete') {
        setCurrentReview(data.review);
        setStatus('idle');
        setProgress(100);
      }
    });
    return () => socket.off('reviewUpdate');
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLogin = () => {
    window.location.href = `${api.defaults.baseURL}/auth/github/login`;
  };

  const handleLogout = () => {
    localStorage.removeItem('mergemind_token');
    setUser(null);
  };

  const triggerManualReview = async () => {
    if (!user) return;
    setStatus('processing');
    setLogs(['Initializing manual review...', 'Fetching PR metadata...']);
    setProgress(10);
    try {
      await api.post('/api/trigger-test-review');
    } catch (err) {
      setLogs(prev => [...prev, `Error: ${err.message}`]);
      setStatus('idle');
    }
  };

  const severityStyles = {
    critical: "border-red-500/50 bg-red-500/10 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)]",
    high: "border-orange-500/50 bg-orange-500/10 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]",
    medium: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.15)]",
    low: "border-blue-500/50 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]",
    suggestion: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
  };

  return (
    <div className="flex flex-col h-screen max-w-7xl mx-auto px-4 py-8 mt-16 pb-24 relative z-10">
      
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
          <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic mr-2">Real-time</span>
          <span className="gradient-text-animated">Analysis</span>
        </h1>
        <div className="flex items-center justify-center md:justify-start gap-4">
           <p className="text-white/40 text-lg font-light tracking-wide">Test PRs and watch MergeMind analyze them chunk-by-chunk.</p>
           <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest ${socket.connected ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : 'border-red-500/20 bg-red-500/5 text-red-400'}`}>
              <span className={`w-2 h-2 rounded-full ${socket.connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              {socket.connected ? 'Connected' : 'Disconnected'}
           </div>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden min-h-0">
        
        {/* Left Column: Controls */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="w-full lg:w-[380px] flex flex-col gap-6">
          <GlowCard tilt={true} className="flex-none">
            <div className="p-8">
               <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                    <Github className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Test Real PR</h2>
               </div>

                <div className="flex flex-col gap-6">
                  {!user ? (
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center backdrop-blur-sm relative group overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                       <Github className="w-12 h-12 mx-auto mb-4 text-white/10 group-hover:text-primary/40 transition-colors duration-500" />
                       <h3 className="font-bold text-white mb-2 relative z-10">Authentication Required</h3>
                       <p className="text-sm text-white/40 mb-6 relative z-10 font-light">Connect your GitHub account to access your repositories and trigger reviews.</p>
                       
                       <Magnetic strength={0.4} radius={60}>
                          <button 
                            onClick={handleLogin}
                            className="w-full bg-white text-black hover:bg-white/90 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-xl relative z-10"
                          >
                             <Github className="w-5 h-5" />
                             Sign in with GitHub
                          </button>
                       </Magnetic>
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 backdrop-blur-sm relative group overflow-hidden">
                       <div className="flex items-center gap-4 mb-6">
                          <img src={user.avatar_url} alt={user.username} className="w-12 h-12 rounded-xl border border-white/10" />
                          <div>
                             <h3 className="font-bold text-white leading-none mb-1">{user.username}</h3>
                             <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">GitHub Authenticated</p>
                          </div>
                          <button 
                            onClick={handleLogout}
                            className="ml-auto p-2 text-white/20 hover:text-white transition-colors"
                          >
                             Logout
                          </button>
                       </div>
                       
                       <Magnetic strength={0.3}>
                        <button 
                           onClick={triggerManualReview}
                           disabled={status === 'processing'}
                           className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-3 transition-all border relative overflow-hidden group ${
                             status === 'processing' 
                               ? 'bg-white/5 border-white/10 text-white/20' 
                               : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 shadow-glow-primary/10'
                           }`}
                        >
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                           <Play className={`w-5 h-5 ${status === 'processing' ? 'animate-pulse' : ''}`} />
                           {status === 'processing' ? 'Analyzing...' : 'Trigger Analysis'}
                        </button>
                      </Magnetic>
                    </div>
                  )}
               </div>

               <div className="mt-8 pt-8 border-t border-white/5">
                  <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-3">
                     <Info className="w-3.5 h-3.5" />
                     Your Endpoint:
                  </div>
                  <div className="flex items-center gap-2 p-3.5 bg-black/40 rounded-xl border border-white/10 group/code">
                     <code className="text-xs text-primary font-mono truncate flex-1">{webhookUrl}</code>
                     <button 
                       onClick={copyWebhook}
                       className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
                     >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                     </button>
                  </div>
               </div>
            </div>
          </GlowCard>
        </motion.div>

        {/* Right Column: Feed & Terminal */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex-1 flex flex-col gap-6 min-h-0">
          <GlowCard tilt={true} className="flex-1 flex flex-col overflow-hidden min-h-0">
             <div className="p-6 border-b border-white/5 flex items-center justify-between backdrop-blur-xl bg-white/[0.02]">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                     <TerminalIcon className="w-4 h-4 text-emerald-400" />
                   </div>
                   <h2 className="text-xl font-bold text-white tracking-tight">Live Analysis Stream</h2>
                </div>
                {progress > 0 && (
                  <div className="flex items-center gap-4">
                     <div className="hidden sm:block w-32 md:w-48 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-gradient-to-r from-primary via-indigo-400 to-emerald-400 relative"
                        >
                           <div className="absolute inset-0 bg-shimmer animate-shimmer" />
                        </motion.div>
                     </div>
                     <span className="text-sm font-black text-emerald-400 font-mono tracking-tighter">{Math.round(progress)}%</span>
                  </div>
                )}
             </div>

             <div className="flex-1 p-6 overflow-y-auto terminal-window scan-line-overlay space-y-2 font-mono text-sm">
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/10">
                     <TerminalIcon className="w-12 h-12 mb-4 opacity-10 animate-pulse" />
                     <p className="text-lg font-bold tracking-tight">Waiting for webhook trigger...</p>
                     <p className="text-xs font-mono">$ mergemind --watch --analyze</p>
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-3 leading-relaxed"
                    >
                      <span className="text-white/20 select-none">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-emerald-400/80">$</span>
                      <span className="text-white/80">{log}</span>
                    </motion.div>
                  ))
                )}
                <div ref={logEndRef} />
             </div>
          </GlowCard>

          {/* Review Results */}
          <AnimatePresence>
            {currentReview && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {currentReview.issues.slice(0, 4).map((issue, idx) => (
                  <GlowCard key={idx} tilt={true} glowColor={issue.severity === 'critical' ? 'rgba(239,68,68,0.15)' : 'rgba(79,70,229,0.15)'}>
                    <div className="p-6">
                       <div className="flex items-start justify-between mb-4">
                          <div className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${severityStyles[issue.severity]}`}>
                             {issue.severity}
                          </div>
                          <button className="text-white/20 hover:text-white transition-colors">
                             <ArrowUpRight className="w-4 h-4" />
                          </button>
                       </div>
                       <h3 className="text-white font-bold mb-2 tracking-tight line-clamp-1">{issue.title}</h3>
                       <p className="text-white/40 text-xs leading-relaxed line-clamp-2 italic">{issue.description}</p>
                    </div>
                  </GlowCard>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
