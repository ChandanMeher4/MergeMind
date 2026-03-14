import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Heart, AlertTriangle, TrendingUp, Trophy, ArrowRight } from 'lucide-react';
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
  }, []);

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
        <StatCard title="Overall Score" value={stats.score} icon={<Heart className="w-5 h-5" />} color="text-success" />
        <StatCard title="Active Devs" value={stats.activeDevelopers} icon={<Users className="w-5 h-5" />} color="text-primary" />
        <StatCard title="Reviews" value={stats.totalReviews} icon={<Activity className="w-5 h-5" />} color="text-indigo-400" />
        <StatCard title="Efficiency" value={`${stats.efficiency}%`} icon={<TrendingUp className="w-5 h-5" />} color="text-warning" />
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
            {stats.weeklyProgress?.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                <div className="w-full relative">
                   <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(day.value / 100) * 160}px` }}
                    className="w-full rounded-t-xl bg-gradient-to-t from-primary/80 to-indigo-400/80 group-hover:from-primary group-hover:to-indigo-300 transition-all duration-300 shadow-glow-primary/10 group-hover:shadow-glow-primary/30 relative"
                  >
                     {/* Shimmer overlay */}
                     <div className="absolute inset-0 bg-shimmer animate-shimmer opacity-30" />
                  </motion.div>
                </div>
                <span className="text-[10px] font-bold text-white/30 uppercase group-hover:text-white/60 transition-colors">{day.label}</span>
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
              {stats.categories?.map((cat, i) => (
                <div key={i}>
                   <div className="flex justify-between text-sm mb-2.5">
                      <span className="font-bold text-white/70">{cat.label}</span>
                      <span className="font-mono text-white/40">{cat.value}%</span>
                   </div>
                   <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${cat.value}%` }}
                        className="h-full bg-gradient-to-r from-warning to-orange-400 relative"
                      >
                         <div className="absolute inset-0 bg-shimmer animate-shimmer" />
                      </motion.div>
                   </div>
                </div>
              ))}
           </div>
        </GlowCard>

        {/* Impact Banner */}
        <GlowCard tilt={true} className="lg:col-span-3 p-0 overflow-hidden group">
           <div className="relative p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-primary/10 opacity-50 group-hover:scale-110 transition-transform duration-1000" />
              <div className="relative z-10 flex-1">
                 <h2 className="text-3xl font-black text-white mb-2 italic tracking-tight uppercase">High Impact Detected</h2>
                 <p className="text-white/40 font-light text-lg">Your team has reduced critical technical debt by <span className="text-emerald-400 font-bold">24%</span> this sprint. Engineering excellence is trending up.</p>
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

        {/* Contributors */}
        <GlowCard tilt={true} className="lg:col-span-3 p-8">
           <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-400/10 border border-indigo-400/20">
                <Trophy className="w-4 h-4 text-indigo-400" />
              </div>
              Top Performers
           </h2>
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] font-black text-white/20">
                       <th className="pb-4 pl-4">Developer</th>
                       <th className="pb-4">Reviews</th>
                       <th className="pb-4">Fix Rate</th>
                       <th className="pb-4 text-right pr-4">Impact</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/[0.02]">
                    {stats.topContributors?.map((dev, i) => (
                       <tr key={i} className="group hover:bg-white/[0.03] transition-colors">
                          <td className="py-5 pl-4 flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 flex items-center justify-center font-bold text-white group-hover:from-primary/20 group-hover:border-primary/20 transition-all">
                                {dev.name[0]}
                             </div>
                             <span className="font-bold text-white group-hover:text-primary transition-colors">{dev.name}</span>
                          </td>
                          <td className="py-5">
                             <span className="font-mono text-white/40">{dev.contributions}</span>
                          </td>
                          <td className="py-5">
                             <span className="font-mono text-white/40">{dev.fixRate}%</span>
                          </td>
                          <td className="py-5 text-right pr-4">
                             <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                <TrendingUp className="w-3 h-3" />
                                High
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </GlowCard>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <GlowCard tilt={true} className="p-6 group relative">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] ${color} transition-all duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">{title}</p>
        <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
      </div>
      {/* Dynamic line shimmer */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity w-full" />
    </GlowCard>
  );
}
