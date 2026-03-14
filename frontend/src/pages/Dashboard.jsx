import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Github, Copy, Terminal, Activity, Sparkles, Check, Info, AlertTriangle, Code, Link2 } from 'lucide-react';
import Magnetic from '../components/Magnetic';
import GlowCard from '../components/GlowCard';
import ReviewCard from '../components/ReviewCard';
import { api, socket } from '../api';

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
  const [repos, setRepos] = useState([]);
  const [pulls, setPulls] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [selectedPull, setSelectedPull] = useState('');
  const [analyzedChunks, setAnalyzedChunks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const logEndRef = useRef(null);

  const webhookUrl = `${import.meta.env.VITE_WEBHOOK_URL || 'http://localhost:3000/webhook'}`;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

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
        const base64Url = savedToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        setUser(payload);
        // Set global auth header for this file's api instance
        api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      } catch (e) {
        console.error("Invalid token", e);
        localStorage.removeItem('mergemind_token');
      }
    }
  }, []);

  // Fetch Repositories
  useEffect(() => {
    if (user) {
      api.get('/api/repos')
        .then(res => setRepos(res.data))
        .catch(err => console.error("Failed to fetch repos", err));
    }
  }, [user]);

  // Fetch Pull Requests
  useEffect(() => {
    if (selectedRepo) {
      const [owner, repo] = selectedRepo.split('/');
      api.get(`/api/repos/${owner}/${repo}/pulls`)
        .then(res => setPulls(res.data))
        .catch(err => console.error("Failed to fetch PRs", err));
    } else {
      setPulls([]);
    }
  }, [selectedRepo]);

  useEffect(() => {
    socket.on('connect', () => setSocketConnected(true));
    socket.on('disconnect', () => setSocketConnected(false));

    socket.on('reviewUpdate', (data) => {
      if (data.type === 'log') {
        setLogs(prev => [...prev, data.content]);
      }
      if (data.type === 'progress') {
        setProgress(data.value);
        if (data.status) setStatus(data.status);
      }
      if (data.type === 'chunk') {
        setAnalyzedChunks(prev => [...prev, data.content]);
      }
      if (data.type === 'reviews') {
        setReviews(prev => [...prev, ...data.content]);
      }
      if (data.value === 100) {
        setStatus('idle');
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('reviewUpdate');
    };
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, analyzedChunks, reviews]);

  const handleLogin = () => {
    window.location.href = `${api.defaults.baseURL}/auth/github/login`;
  };

  const handleLogout = () => {
    localStorage.removeItem('mergemind_token');
    setUser(null);
  };

  const triggerManualReview = async () => {
    if (!user || !selectedRepo || !selectedPull) return;
    
    const [owner, name] = selectedRepo.split('/');
    const pull = pulls.find(p => p.number === parseInt(selectedPull));

    setStatus('processing');
    setLogs([]);
    setAnalyzedChunks([]);
    setReviews([]);
    setProgress(0);
    setLogs(['Initializing review session...', `Target: ${selectedRepo} PR #${selectedPull}`]);
    
    try {
      await api.post('/api/trigger-review', {
        repository: { owner: { login: owner }, name: name, full_name: selectedRepo },
        pull_request: { number: pull.number, title: pull.title, user: pull.user }
      });
    } catch (err) {
      setLogs(prev => [...prev, `Error: ${err.response?.data?.error || err.message}`]);
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
      
      {/* Dashboard Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
         <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6">
            Real-time <span className="text-primary italic font-serif px-2">Console</span>
         </h1>
         <div className="flex flex-col items-center gap-4">
            <p className="text-white/40 text-lg md:text-xl font-light max-w-2xl mx-auto">
              Test PRs and watch MergeMind analyze them chunk-by-chunk.
            </p>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-sm">
              <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-emerald-500 shadow-glow-emerald/50 animate-pulse' : 'bg-red-500 shadow-glow-red/50'}`} />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                 {socketConnected ? 'Connected to Backend' : 'Disconnected'}
              </span>
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

                       <div className="space-y-4 mb-6">
                          <div>
                             <label className="text-[10px] font-black text-white/20 uppercase tracking-widest block mb-2">Select Repository</label>
                             <select 
                                value={selectedRepo} 
                                onChange={(e) => { setSelectedRepo(e.target.value); setSelectedPull(''); }}
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-primary outline-none transition-all appearance-none"
                             >
                                <option value="">Choose a repo...</option>
                                {repos.map(repo => (
                                   <option key={repo.id} value={repo.full_name}>{repo.full_name}</option>
                                ))}
                             </select>
                          </div>

                          <div>
                             <label className="text-[10px] font-black text-white/20 uppercase tracking-widest block mb-2">Select Pull Request</label>
                             <select 
                                value={selectedPull} 
                                onChange={(e) => setSelectedPull(e.target.value)}
                                disabled={!selectedRepo}
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-primary outline-none transition-all appearance-none disabled:opacity-30"
                             >
                                <option value="">{pulls.length > 0 ? 'Choose a PR...' : 'No open PRs found'}</option>
                                {pulls.map(pr => (
                                   <option key={pr.id} value={pr.number}>#{pr.number} - {pr.title}</option>
                                ))}
                             </select>
                          </div>
                       </div>
                       
                       <Magnetic strength={0.3}>
                        <button 
                           onClick={triggerManualReview}
                           disabled={status === 'processing' || !selectedPull}
                           className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-3 transition-all border relative overflow-hidden group ${
                             status === 'processing' || !selectedPull
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
                  <div className="flex items-center gap-2 text-white/20 mb-3">
                     <Link2 className="w-4 h-4" />
                     <span className="text-[10px] uppercase font-black tracking-widest">Your Endpoint:</span>
                  </div>
                  <div className="flex items-center justify-between bg-black/40 border border-white/10 p-3 rounded-xl group relative overflow-hidden backdrop-blur-sm">
                     <span className="text-xs font-mono text-white/40 truncate pr-4 relative z-10">{webhookUrl}</span>
                     <button onClick={handleCopyWebhook} className="p-2 hover:bg-white/10 rounded-lg text-white/20 hover:text-white transition-all relative z-10">
                        {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                     </button>
                     <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
               </div>
            </div>
          </GlowCard>
        </motion.div>

        {/* Right Column: Feed & Terminal */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex-1 flex flex-col gap-6 min-h-0">
            {/* Live Feed Column */}
            <GlowCard className="lg:col-span-2 min-h-[600px] flex flex-col overflow-hidden">
               <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                  <div className="flex items-center gap-3">
                     <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                        <Terminal className="w-5 h-5" />
                     </div>
                     <h2 className="text-xl font-bold text-white tracking-tight">Live Analysis Stream</h2>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">{status === 'processing' ? 'Analysing...' : 'Idle'}</span>
                  </div>
               </div>

               <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.03),transparent)]">
                  {status === 'idle' && logs.length === 0 && analyzedChunks.length === 0 && reviews.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-white/10 space-y-4">
                        <Terminal className="w-16 h-16 opacity-5" />
                        <p className="text-sm font-light italic">Waiting for review trigger...</p>
                        <p className="text-[10px] uppercase tracking-widest font-black opacity-20">$ mergemind --watch --analyze</p>
                     </div>
                  ) : (
                     <div className="space-y-6">
                        {/* Status Messages */}
                        {logs.map((log, i) => (
                           <motion.div 
                              key={`log-${i}`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-start gap-3 font-mono text-sm group"
                           >
                              <span className="text-white/10 select-none min-w-[20px]">{String(i + 1).padStart(2, '0')}</span>
                              <span className="text-white/20 select-none">$</span>
                              <span className="text-white/60 group-last:text-primary transition-colors">{log}</span>
                           </motion.div>
                        ))}

                        {/* Analysis Chunks */}
                        {analyzedChunks.map((chunk, i) => (
                           <motion.div
                              key={`chunk-${i}`}
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="rounded-2xl overflow-hidden border border-white/5 bg-black/40 shadow-2xl"
                           >
                              <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
                                 <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Extracted Chunk {i + 1}</span>
                              </div>
                              <pre className="p-4 font-mono text-xs text-indigo-300/60 overflow-x-auto whitespace-pre-wrap">
                                 {chunk.split('\n').slice(0, 15).join('\n')}
                                 {chunk.split('\n').length > 15 && '\n... (truncated for feed)'}
                              </pre>
                           </motion.div>
                        ))}

                        {/* Review Feedback */}
                        {reviews.length > 0 && (
                          <div className="pt-8 space-y-4">
                             <div className="flex items-center gap-3 mb-6">
                                <Sparkles className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-bold text-white tracking-tight">AI Generated Feedback</h3>
                             </div>
                             {reviews.map((rev, i) => (
                                <ReviewCard key={`rev-${i}`} review={rev} />
                             ))}
                          </div>
                        )}
                        <div ref={logEndRef} />
                     </div>
                  )}
               </div>

               {/* Shimmering Progress Bar */}
               <div className="h-2 w-full bg-white/[0.02] border-t border-white/5 relative overflow-hidden">
                  <motion.div 
                     className="h-full bg-gradient-to-r from-primary via-indigo-400 to-primary relative shadow-glow-primary"
                     initial={{ width: 0 }}
                     animate={{ width: `${progress}%` }}
                     transition={{ type: "spring", damping: 20, stiffness: 50 }}
                  >
                     <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-shimmer" />
                  </motion.div>
               </div>
            </GlowCard>
         </motion.div>
      </div>
    </div>
  );
}
