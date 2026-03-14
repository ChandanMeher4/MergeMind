import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Info, AlertTriangle, AlertCircle, Sparkles, Code } from 'lucide-react';
import Magnetic from './Magnetic';
import GlowCard from './GlowCard';

const severityConfig = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <AlertCircle className="w-4 h-4" /> },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: <AlertTriangle className="w-4 h-4" /> },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: <Info className="w-4 h-4" /> },
  low: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: <Info className="w-4 h-4" /> },
  suggestion: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <Sparkles className="w-4 h-4" /> },
};

export default function ReviewCard({ review }) {
  const [isCopied, setIsCopied] = useState(false);
  const config = severityConfig[review.severity] || severityConfig.medium;

  const handleCopy = () => {
    navigator.clipboard.writeText(review.fix);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <GlowCard>
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${config.bg} ${config.color} border ${config.border}`}>
                {config.icon}
              </div>
              <div>
                <h4 className="font-bold text-white tracking-tight leading-tight">
                  <span className={`capitalize ${config.color} mr-2`}>{review.severity}</span>
                  {review.title}
                </h4>
                <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-0.5">
                  Line {review.line || 'N/A'} • AI Analysis
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
            {review.description}
          </p>

          {review.suggestion && (
            <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Suggestion</span>
              </div>
              <p className="text-xs text-white/50">{review.suggestion}</p>
            </div>
          )}

          {review.fix && (
            <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40">
              <div className="flex items-center justify-between px-3 py-2 bg-white/[0.05] border-b border-white/5">
                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                  <Code className="w-3 h-3" />
                  Suggested Fix
                </div>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-md transition-all ${
                    isCopied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {isCopied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="p-3 font-mono text-[11px] leading-relaxed text-emerald-300/80 max-h-40 overflow-y-auto custom-scrollbar">
                <pre className="whitespace-pre-wrap">{review.fix}</pre>
              </div>
            </div>
          )}
        </div>
      </GlowCard>
    </motion.div>
  );
}
