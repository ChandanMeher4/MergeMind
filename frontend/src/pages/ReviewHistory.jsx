import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode2, History, AlertCircle, ChevronRight, Search, Filter, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import GlowCard from '../components/GlowCard';
import Magnetic from '../components/Magnetic';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, ''),
});

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function ReviewHistory() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [selectedReviewDetails, setSelectedReviewDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/api/reviews');
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadReviewDetails = async (id) => {
    setSelectedReviewId(id);
    setLoadingDetails(true);
    try {
      const res = await api.get(`/api/reviews/${id}`);
      setSelectedReviewDetails(res.data);
    } catch (err) {
      console.error("Failed to load review details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const severityColors = {
    critical: "text-red-400 border-red-500/20 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.1)]",
    high: "text-orange-400 border-orange-500/20 bg-orange-500/10 shadow-[0_0_20px_rgba(249,115,22,0.1)]",
    medium: "text-yellow-400 border-yellow-500/20 bg-yellow-500/10 shadow-[0_0_20px_rgba(234,179,8,0.1)]",
    low: "text-blue-400 border-blue-500/20 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)]",
    suggestion: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
  };

  if (loading) {
     return (
        <div className="flex h-screen items-center justify-center p-8 mt-16">
           <div className="animate-pulse flex flex-col items-center gap-4">
             <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
             <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Retrieving Archives...</p>
           </div>
        </div>
     );
  }

  return (
    <div className="flex flex-col h-screen max-w-7xl mx-auto px-4 py-8 mt-16 pb-24 relative z-10">
      
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
          <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic mr-3">Review</span>
          <span className="gradient-text-animated">History</span>
        </h1>
        <p className="text-lg text-white/40 max-w-2xl font-light tracking-wide">
          Intelligence vault of past analyses, security audits, and architectural reviews.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-280px)] min-h-0">
         {/* Left col: List of reviews */}
         <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="w-full lg:w-[400px] flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar"
         >
            {reviews.length === 0 ? (
               <GlowCard tilt={true} className="p-10 text-center">
                   <History className="w-12 h-12 mb-6 text-white/10 mx-auto" />
                   <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Vault Empty</h3>
                   <p className="text-xs text-white/30 font-light">Trigger a webhook to index your first review.</p>
               </GlowCard>
            ) : (
               reviews.map((rev) => (
                  <motion.button
                     key={rev.id}
                     onClick={() => loadReviewDetails(rev.id)}
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     className={`p-6 rounded-2xl border text-left transition-all duration-500 relative group overflow-hidden ${
                       selectedReviewId === rev.id 
                         ? 'border-primary/50 bg-primary/10 shadow-glow-primary/20' 
                         : 'border-white/[0.06] bg-white/[0.03] hover:border-white/[0.15] hover:bg-white/[0.06]'
                     }`}
                  >
                     <div className="flex justify-between items-start mb-3">
                        <span className="font-bold text-white tracking-tight text-lg group-hover:text-primary transition-colors">{rev.repo}</span>
                        <ChevronRight className={`w-5 h-5 transition-all duration-300 ${
                          selectedReviewId === rev.id ? 'translate-x-1 text-primary' : 'text-white/10'
                        }`} />
                     </div>
                     <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/40">
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white/[0.04]">
                           <FileCode2 className="w-3.5 h-3.5" />
                           PR #{rev.prNumber}
                        </span>
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/5 text-emerald-400/80">
                           <AlertCircle className="w-3.5 h-3.5" />
                           {rev.issueCount} Findings
                        </span>
                     </div>
                     <div className="text-[10px] text-white/10 mt-5 font-mono group-hover:text-white/20 transition-colors uppercase">
                        Indexed: {new Date(rev.reviewedAt).toLocaleString()}
                     </div>
                     {/* Background glow on selected */}
                     {selectedReviewId === rev.id && (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                     )}
                  </motion.button>
               ))
            )}
         </motion.div>

         {/* Right col: Details */}
         <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="flex-1 min-w-0"
         >
           <GlowCard tilt={false} className="h-full">
             <div className="flex flex-col h-full overflow-hidden rounded-2xl">
                {loadingDetails ? (
                   <div className="flex-1 flex flex-col items-center justify-center gap-4">
                      <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-mono text-white/20 uppercase tracking-[0.2em]">Decompressing Metadata...</p>
                   </div>
                ) : !selectedReviewDetails ? (
                   <div className="flex-1 flex flex-col items-center justify-center text-white/10 gap-6">
                      <Search className="w-16 h-16 opacity-10" />
                      <p className="text-xl font-bold tracking-tighter italic">Select an entry to view technical findings</p>
                   </div>
                ) : (
                   <div className="flex-1 overflow-y-auto flex flex-col h-full custom-scrollbar">
                      {/* Header */}
                      <div className="p-8 border-b border-white/[0.06] sticky top-0 backdrop-blur-2xl z-10 bg-background/60">
                         <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50" />
                         <div className="flex justify-between items-start relative z-10">
                            <div>
                               <h2 className="text-3xl font-black mb-2 text-white tracking-tighter uppercase">{selectedReviewDetails.repo}</h2>
                               <p className="text-white/40 text-sm flex items-center gap-3 font-mono font-bold">
                                  <span className="px-2 py-0.5 rounded bg-white/5">PR #{selectedReviewDetails.prNumber}</span>
                                  <span className="opacity-40">•</span>
                                  <span>{new Date(selectedReviewDetails.reviewedAt).toLocaleString()}</span>
                               </p>
                            </div>
                            <Magnetic strength={0.2}>
                               <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all">
                                  <ArrowUpRight className="w-5 h-5" />
                               </button>
                            </Magnetic>
                         </div>
                      </div>
                      
                      <div className="p-8 flex-1 space-y-12">
                         <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-6 flex items-center gap-3">
                               <AlertCircle className="w-4 h-4" />
                               Critical Insights
                            </h3>
                            
                            <div className="grid grid-cols-1 gap-4">
                               {selectedReviewDetails.issues?.length === 0 ? (
                                  <div className="p-10 rounded-2xl border border-dashed border-white/5 text-center">
                                     <p className="text-white/20 italic font-light">Comprehensive analysis completed. Zero vulnerabilities identified.</p>
                                  </div>
                               ) : (
                                  selectedReviewDetails.issues?.map((issue, idx) => (
                                     <motion.div 
                                       key={idx} 
                                       initial={{ opacity: 0, y: 15 }}
                                       animate={{ opacity: 1, y: 0 }}
                                       transition={{ delay: idx * 0.1 }}
                                       className={`p-6 rounded-2xl border flex flex-col gap-4 relative overflow-hidden group/issue ${severityColors[issue.severity] || 'border-white/10 bg-white/5'}`}
                                     >
                                        <div className="flex justify-between items-start relative z-10">
                                           <span className="font-black text-lg flex items-center gap-3 tracking-tight">
                                              <span className="uppercase text-[10px] px-2 py-1 rounded-lg bg-black/20 border border-current/20">{issue.severity}</span>
                                              {issue.title}
                                           </span>
                                           <span className="text-[10px] font-mono font-black border border-current/20 px-2 py-1 rounded uppercase">Line {issue.line || 'N/A'}</span>
                                        </div>
                                        <p className="opacity-70 text-base leading-relaxed font-light tracking-wide relative z-10">{issue.description}</p>
                                        
                                        {issue.fix && (
                                           <div className="mt-2 terminal-window rounded-xl overflow-hidden border border-emerald-500/20 group-hover/issue:border-emerald-500/40 transition-colors">
                                              <div className="px-4 py-2 bg-emerald-500/5 border-b border-emerald-500/10 text-[10px] font-black tracking-widest text-emerald-400 flex items-center justify-between">
                                                 <span className="flex items-center gap-3 italic">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                    SUGGESTED OPTIMIZATION
                                                 </span>
                                                 <span className="opacity-40">AUTOFIX AVAILABLE</span>
                                              </div>
                                              <pre className="p-4 text-xs overflow-x-auto text-emerald-300/80 leading-relaxed font-mono whitespace-pre-wrap">
                                                 {issue.fix}
                                              </pre>
                                           </div>
                                        )}
                                     </motion.div>
                                  ))
                               )}
                            </div>
                         </section>

                         <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-6 flex items-center gap-3">
                               <FileCode2 className="w-4 h-4" />
                               Source Context
                            </h3>
                            <div className="terminal-window scan-line-overlay rounded-2xl overflow-hidden border border-white/5">
                               <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between bg-black/40">
                                 <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500/50" />
                                    <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                    <span className="w-3 h-3 rounded-full bg-green-500/50" />
                                 </div>
                                 <span className="text-xs text-white/10 font-mono italic">git-diff --unified=3</span>
                               </div>
                               <pre className="p-6 text-xs overflow-x-auto font-mono text-emerald-300/60 whitespace-pre-wrap leading-relaxed relative z-10 custom-scrollbar">
                                  {selectedReviewDetails.diffText || "Diff context unavailable in archives."}
                               </pre>
                            </div>
                         </section>
                      </div>
                   </div>
                )}
             </div>
           </GlowCard>
         </motion.div>
      </div>
    </div>
  );
}
