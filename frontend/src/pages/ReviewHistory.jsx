import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode2, History, AlertCircle, ChevronRight, Search, Filter } from 'lucide-react';
import axios from 'axios';
import GlowCard from '../components/GlowCard';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, ''),
});

// Using same fadeUp as TeamHealth
const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
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
    critical: "text-red-400 border-red-500/20 bg-red-500/10",
    high: "text-orange-400 border-orange-500/20 bg-orange-500/10",
    medium: "text-yellow-400 border-yellow-500/20 bg-yellow-500/10",
    low: "text-blue-400 border-blue-500/20 bg-blue-500/10",
    suggestion: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
  };

  const severityGlow = {
    critical: 'shadow-[0_0_12px_rgba(239,68,68,0.12)]',
    high: 'shadow-[0_0_12px_rgba(249,115,22,0.12)]',
    medium: 'shadow-[0_0_12px_rgba(234,179,8,0.12)]',
    low: 'shadow-[0_0_12px_rgba(59,130,246,0.12)]',
    suggestion: 'shadow-[0_0_12px_rgba(16,185,129,0.12)]',
  };

  if (loading) {
     return (
        <div className="flex h-screen items-center justify-center p-8 mt-16">
           <div className="animate-pulse flex flex-col items-center gap-4">
             <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
             <p className="text-white/40">Loading History...</p>
           </div>
        </div>
     );
  }

  return (
    <div className="flex flex-col h-screen max-w-7xl mx-auto px-4 py-8 mt-16 pb-24 relative z-10">
      
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-4">
          <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Review </span>
          <span className="gradient-text-animated">History</span>
        </h1>
        <p className="text-lg text-white/40 max-w-2xl">
          Browse past pull request analyses, inspect AI-generated diffs, and review historically suggested fixes.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-250px)]">
         {/* Left col: List of reviews */}
         <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="w-full lg:w-1/3 flex flex-col gap-3 overflow-y-auto pr-2"
         >
            {reviews.length === 0 ? (
               <GlowCard>
                 <div className="p-8 flex flex-col items-center justify-center text-center">
                   <History className="w-12 h-12 mb-4 text-white/20" />
                   <p className="text-white/50">No reviews yet.</p>
                   <p className="text-sm mt-2 text-white/30">Trigger a webhook to see reviews here.</p>
                 </div>
               </GlowCard>
            ) : (
               reviews.map((rev) => (
                  <motion.button
                     key={rev.id}
                     onClick={() => loadReviewDetails(rev.id)}
                     className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                       selectedReviewId === rev.id 
                         ? 'border-primary/40 bg-primary/10 shadow-glow-primary' 
                         : 'border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.05]'
                     }`}
                     whileHover={{ scale: 1.01 }}
                     whileTap={{ scale: 0.99 }}
                  >
                     <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-white/90 truncate tracking-tight">{rev.repo}</span>
                        <ChevronRight className={`w-4 h-4 transition-all duration-200 ${
                          selectedReviewId === rev.id ? 'translate-x-1 text-primary' : 'text-white/20'
                        }`} />
                     </div>
                     <div className="flex items-center gap-3 text-sm text-white/40">
                        <span className="flex items-center gap-1">
                           <FileCode2 className="w-3.5 h-3.5" />
                           PR #{rev.prNumber}
                        </span>
                        <span className="flex items-center gap-1">
                           <AlertCircle className="w-3.5 h-3.5" />
                           {rev.issueCount} issues
                        </span>
                     </div>
                     <div className="text-xs text-white/20 mt-3 font-mono">
                        {new Date(rev.reviewedAt).toLocaleString()}
                     </div>
                  </motion.button>
               ))
            )}
         </motion.div>

         {/* Right col: Details */}
         <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="w-full lg:w-2/3"
         >
           <GlowCard glowColor="rgba(99,102,241,0.08)" className="h-full">
             <div className="flex flex-col h-full overflow-hidden rounded-2xl">
                {loadingDetails ? (
                   <div className="flex-1 flex items-center justify-center">
                      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                   </div>
                ) : !selectedReviewDetails ? (
                   <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-3">
                      <Search className="w-12 h-12 opacity-30" />
                      <p>Select a review to view details</p>
                   </div>
                ) : (
                   <div className="flex-1 overflow-y-auto flex flex-col h-full">
                      {/* Header with gradient background */}
                      <div className="p-6 border-b border-white/[0.06] sticky top-0 backdrop-blur-xl z-10 bg-white/[0.03]">
                         <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />
                         <h2 className="text-xl font-bold mb-1 text-white relative z-10">{selectedReviewDetails.repo}</h2>
                         <p className="text-white/40 text-sm flex items-center gap-2 relative z-10 font-mono">
                            PR #{selectedReviewDetails.prNumber} • {new Date(selectedReviewDetails.reviewedAt).toLocaleString()}
                         </p>
                      </div>
                      
                      <div className="p-6 flex-1">
                         <h3 className="text-lg font-semibold mb-4 flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                              <AlertCircle className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-white">Identified Issues ({selectedReviewDetails.issues?.length || 0})</span>
                         </h3>
                         
                         <div className="flex flex-col gap-4 mb-8">
                            {selectedReviewDetails.issues?.length === 0 ? (
                               <div className="p-4 rounded-xl border border-white/[0.06] text-white/40 text-sm text-center">
                                  No issues identified in this review.
                               </div>
                            ) : (
                               selectedReviewDetails.issues?.map((issue, idx) => (
                                  <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`p-4 rounded-xl border ${severityColors[issue.severity] || 'border-white/10 bg-white/5'} ${severityGlow[issue.severity] || ''}`}
                                  >
                                     <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold flex items-center gap-2">
                                           <span className="capitalize">{issue.severity}</span>: {issue.title}
                                        </span>
                                        <span className="text-xs opacity-70 font-mono bg-black/20 px-2 py-0.5 rounded">Line {issue.line || 'N/A'}</span>
                                     </div>
                                     <p className="opacity-90 text-sm mb-3 leading-relaxed">{issue.description}</p>
                                     
                                     {issue.suggestion && (
                                        <div className="mt-2 bg-black/20 rounded-lg p-3 text-sm opacity-90 border border-current/10">
                                           <span className="font-semibold block mb-1">💡 Suggestion:</span>
                                           {issue.suggestion}
                                        </div>
                                     )}

                                     {issue.fix && (
                                        <div className="mt-3 terminal-window rounded-lg overflow-hidden border border-emerald-500/20">
                                           <div className="px-3 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-xs font-semibold text-emerald-400 flex items-center gap-2">
                                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                              ✅ Fix Code
                                           </div>
                                           <pre className="p-3 text-xs overflow-x-auto text-emerald-300/80 leading-relaxed whitespace-pre-wrap font-mono">
                                              {issue.fix}
                                           </pre>
                                        </div>
                                     )}
                                  </motion.div>
                               ))
                            )}
                         </div>

                         <h3 className="text-lg font-semibold mb-4 flex items-center gap-2.5 border-t border-white/[0.06] pt-8 mt-8">
                            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                              <FileCode2 className="w-4 h-4 text-emerald-400" />
                            </div>
                            <span className="text-white">Analyzed Diff Context</span>
                         </h3>
                         <div className="terminal-window scan-line-overlay rounded-xl overflow-hidden">
                            <div className="px-3 py-2 border-b border-white/[0.06] flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500/70" />
                              <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
                              <span className="w-2 h-2 rounded-full bg-green-500/70" />
                              <span className="ml-3 text-xs text-white/20 font-mono">diff --context</span>
                            </div>
                            <pre className="p-4 text-xs overflow-x-auto font-mono text-emerald-300/70 whitespace-pre-wrap leading-relaxed relative z-10">
                               {selectedReviewDetails.diffText || "Diff context unavailable"}
                            </pre>
                         </div>
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
