import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Heart, AlertTriangle, TrendingUp, Trophy, ArrowRight, Shield, Zap, Code2, TestTube, BookOpen, Clock, ChevronUp } from 'lucide-react';
import { api } from '../api';
import GlowCard from '../components/GlowCard';
import Magnetic from '../components/Magnetic';
import AnimatedCounter from '../components/AnimatedCounter';

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function TeamHealth() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const maxDailyIssues = stats ? Math.max(...stats.daily?.map(d => d.issues) || [1]) : 1;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center p-8 mt-16">
         <div className="animate-pulse flex flex-col items-center gap-4">
           <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
           <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Compiling Health Metrics...</p>
         </div>
      </div>
    );
  }

  if (!stats) {
     return (
       <div className="flex h-screen items-center justify-center p-8 mt-16">
          <GlowCard tilt={true} className="max-w-md p-10 text-center">
             <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
             <h2 className="text-2xl font-bold text-white mb-2">Metrics Unavailable</h2>
             <p className="text-white/40 font-light mb-6">We couldn't retrieve team stats. Ensure your backend is configured correctly.</p>
             <button onClick={() => window.location.reload()} className="px-6 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">Retry</button>
          </GlowCard>
       </div>
     );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-16 pb-24 relative z-10">
      
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-12">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
          <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic mr-3">Team</span>
          <span className="gradient-text-animated">Health</span>
        </h1>
        <p className="text-lg text-white/40 max-w-2xl font-light tracking-wide">
          Intelligence-driven insights into code quality trends and top contributor impact.
        </p>
      </motion.div>

      {/* Stats Summary Grid */}
      <motion.div 
        initial="hidden" animate="visible" 
        variants={{ 
          visible: { transition: { staggerChildren: 0.1 } } 
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <StatCard title="Hours Saved Today" value={stats.today?.hoursSaved} suffix="h" icon={<Clock className="w-5 h-5" />} color="text-emerald-400" />
        <StatCard title="Total PRs" value={stats.totalPRs} icon={<Activity className="w-5 h-5" />} color="text-primary" />
        <StatCard title="Issues Caught" value={stats.totalIssues} icon={<AlertTriangle className="w-5 h-5" />} color="text-warning" />
        <StatCard title="Top Vulnerability" value={stats.topVulnerability?.count || 0} suffix=" occurrences" icon={<Shield className="w-5 h-5" />} color="text-red-400" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progress Chart */}
        <GlowCard tilt={true} className="lg:col-span-2 p-8">
          <div className="flex items-center justify-between mb-10">
             <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                Review Velocity
             </h2>
             <span className="text-xs font-bold text-white/20 uppercase tracking-widest">Last 7 Days</span>
          </div>
          <div className="flex items-end justify-between h-48 gap-2">
            {stats.daily?.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                <div className="w-full flex flex-col items-center justify-end h-40 relative">
                   <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(day.issues / maxDailyIssues) * 100}%` }}
                    className="w-full rounded-t-xl bg-primary/40 group-hover:bg-primary/60 transition-all duration-300 relative overflow-hidden"
                  >
                     {day.critical > 0 && (
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${(day.critical / Math.max(day.issues, 1)) * 100}%` }}
                          className="absolute bottom-0 w-full bg-red-500/50"
                        />
                     )}
                     <div className="absolute inset-0 bg-shimmer animate-shimmer opacity-20" />
                  </motion.div>
                </div>
                <span className="text-[10px] font-bold text-white/30 uppercase group-hover:text-white/60 transition-colors">
                  {new Date(day.date + 'T00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </GlowCard>

        {/* Issue Breakdown */}
        <GlowCard tilt={true} className="p-8">
           <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10 border border-warning/20">
                <AlertTriangle className="w-4 h-4 text-warning" />
              </div>
              Issue Categories
           </h2>
           <div className="space-y-6">
              {Object.entries(stats.byCategory || {})
                .sort(([, a], [, b]) => b - a)
                .map(([cat, count], i) => {
                  const pct = Math.round((count / (stats.totalIssues || 1)) * 100);
                  const colorClass = cat === 'security' ? 'from-red-500 to-orange-500' :
                                   cat === 'bug' ? 'from-orange-500 to-yellow-500' :
                                   cat === 'performance' ? 'from-yellow-400 to-emerald-400' :
                                   cat === 'quality' ? 'from-primary to-indigo-400' :
                                   cat === 'testing' ? 'from-cyan-400 to-blue-500' :
                                   'from-emerald-400 to-teal-500';
                  return (
                    <div key={i}>
                       <div className="flex justify-between text-sm mb-2.5">
                          <span className="font-bold text-white/70 capitalize">{cat.replace('-', ' ')}</span>
                          <span className="font-mono text-white/40">{count} ({pct}%)</span>
                       </div>
                       <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            className={`h-full bg-gradient-to-r ${colorClass} relative`}
                          >
                             <div className="absolute inset-0 bg-shimmer animate-shimmer" />
                          </motion.div>
                       </div>
                    </div>
                  );
                })}
           </div>
        </GlowCard>

        {/* Impact Banner */}
        <GlowCard tilt={true} className="lg:col-span-3 p-0 overflow-hidden group">
           <div className="relative p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-primary/10 opacity-50 group-hover:scale-110 transition-transform duration-1000" />
               <div className="relative z-10 flex-1">
                  <h2 className="text-3xl font-black text-white mb-2 italic tracking-tight uppercase">Performance Insight</h2>
                  <p className="text-white/40 font-light text-lg">
                    MergeMind saved <span className="text-emerald-400 font-bold"><AnimatedCounter value={stats.today?.hoursSaved} duration={2500} />h</span> of manual review time today.
                    Across <span className="text-primary font-bold">{stats.today?.prs}</span> PRs.
                  </p>
               </div>
              <Magnetic strength={0.3}>
                 <button className="relative z-10 px-8 py-4 rounded-full bg-white text-black font-black uppercase text-sm tracking-widest flex items-center gap-3 group/btn whitespace-nowrap overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    Full Report
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                 </button>
              </Magnetic>
           </div>
           {/* Moving background shimmer line */}
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent translate-x-[-100%] animate-shimmer" style={{ animationDuration: '3s' }} />
        </GlowCard>

        {/* Repository Leaderboard */}
         <GlowCard tilt={true} className="lg:col-span-3 p-8">
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
               <div className="p-2 rounded-lg bg-indigo-400/10 border border-indigo-400/20">
                 <Trophy className="w-4 h-4 text-indigo-400" />
               </div>
               Repository Leaderboard
            </h2>
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] font-black text-white/20">
                        <th className="pb-4 pl-4">#</th>
                        <th className="pb-4">Repository</th>
                        <th className="pb-4 text-center">PRs</th>
                        <th className="pb-4 text-center">Issues</th>
                        <th className="pb-4 text-center text-red-400">Critical</th>
                        <th className="pb-4 text-right pr-4">Risk Level</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                     {stats.leaderboard?.map((repo, i) => {
                        const riskScore = repo.critical * 10 + repo.high * 5 + (repo.issues - repo.critical - repo.high);
                        const riskLevel = riskScore > 30 ? { label: 'High', color: 'text-red-400 bg-red-500/10' } :
                                        riskScore > 15 ? { label: 'Medium', color: 'text-orange-400 bg-orange-500/10' } :
                                        { label: 'Low', color: 'text-emerald-400 bg-emerald-500/10' };
                        return (
                           <tr key={i} className="group hover:bg-white/[0.03] transition-colors">
                              <td className="py-5 pl-4 font-mono text-white/20">{i + 1}</td>
                              <td className="py-5">
                                 <span className="font-bold text-white group-hover:text-primary transition-colors">{repo.repo}</span>
                              </td>
                              <td className="py-5 text-center">
                                 <span className="font-mono text-white/40">{repo.prs}</span>
                              </td>
                              <td className="py-5 text-center font-bold text-white">
                                 {repo.issues}
                              </td>
                              <td className="py-5 text-center font-bold text-red-500/80">
                                 {repo.critical}
                              </td>
                              <td className="py-5 text-right pr-4">
                                 <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/5 ${riskLevel.color}`}>
                                    {riskLevel.label}
                                    {riskScore > 15 && <ChevronUp className="w-3 h-3" />}
                                 </div>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         </GlowCard>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, suffix }) {
  return (
    <GlowCard tilt={true} className="p-6 group relative">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] ${color} transition-all duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">{title}</p>
        <p className="text-3xl font-black text-white tracking-tighter">
          <AnimatedCounter value={value} suffix={suffix} />
        </p>
      </div>
      {/* Dynamic line shimmer */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity w-full" />
    </GlowCard>
  );
}
