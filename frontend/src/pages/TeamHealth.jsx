import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Shield, Clock, Bug, Zap, Code2, TestTube, BookOpen,
  AlertTriangle, ChevronUp, BarChart3, Trophy, Activity
} from 'lucide-react';
import axios from 'axios';
import GlowCard from '../components/GlowCard';

const categoryIcons = {
  bug: <Bug className="w-4 h-4" />,
  security: <Shield className="w-4 h-4" />,
  performance: <Zap className="w-4 h-4" />,
  quality: <Code2 className="w-4 h-4" />,
  testing: <TestTube className="w-4 h-4" />,
  'best-practice': <BookOpen className="w-4 h-4" />,
};

const categoryColors = {
  bug: 'text-red-400 bg-red-500/10',
  security: 'text-amber-400 bg-amber-500/10',
  performance: 'text-yellow-400 bg-yellow-500/10',
  quality: 'text-indigo-400 bg-indigo-500/10',
  testing: 'text-cyan-400 bg-cyan-500/10',
  'best-practice': 'text-emerald-400 bg-emerald-500/10',
};

const categoryGlowColors = {
  bug: 'rgba(239,68,68,0.12)',
  security: 'rgba(245,158,11,0.12)',
  performance: 'rgba(234,179,8,0.12)',
  quality: 'rgba(99,102,241,0.12)',
  testing: 'rgba(6,182,212,0.12)',
  'best-practice': 'rgba(16,185,129,0.12)',
};

const categoryBarColors = {
  security: 'bg-gradient-to-r from-amber-500/50 to-amber-400/80',
  bug: 'bg-gradient-to-r from-red-500/50 to-red-400/80',
  performance: 'bg-gradient-to-r from-yellow-500/50 to-yellow-400/80',
  quality: 'bg-gradient-to-r from-indigo-500/50 to-indigo-400/80',
  testing: 'bg-gradient-to-r from-cyan-500/50 to-cyan-400/80',
  'best-practice': 'bg-gradient-to-r from-emerald-500/50 to-emerald-400/80',
};

function AnimatedCounter({ value, suffix = '', duration = 2000 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{displayValue}{suffix}</>;
}

const fadeUp = {
  initial: { opacity: 0, y: 20, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

const statCards = [
  { key: 'hours', icon: Clock, label: 'Hours Saved Today', color: 'text-emerald-400', iconBg: 'bg-emerald-500/10 border-emerald-500/20', glowColor: 'rgba(16,185,129,0.12)' },
  { key: 'prs', icon: BarChart3, label: 'PRs Reviewed', color: 'text-white', iconBg: 'bg-primary/10 border-primary/20', glowColor: 'rgba(79,70,229,0.12)' },
  { key: 'issues', icon: AlertTriangle, label: 'Issues Caught', color: 'text-amber-400', iconBg: 'bg-amber-500/10 border-amber-500/20', glowColor: 'rgba(245,158,11,0.12)' },
  { key: 'vuln', icon: Shield, label: 'Top Vulnerability', color: 'text-red-400', iconBg: 'bg-red-500/10 border-red-500/20', glowColor: 'rgba(239,68,68,0.12)' },
];

const computeCards = [
  { key: 'tokens', icon: Zap, label: 'Total AI Tokens', color: 'text-indigo-400', iconBg: 'bg-indigo-500/10 border-indigo-500/20', glowColor: 'rgba(99,102,241,0.12)' },
  { key: 'cost', icon: Activity, label: 'Infrastructure Cost', color: 'text-emerald-400', iconBg: 'bg-emerald-500/10 border-emerald-500/20', glowColor: 'rgba(16,185,129,0.12)' },
];

export default function TeamHealth() {
  const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/stats`);
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40">Loading team insights...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <p className="text-red-400 text-lg">Failed to load stats. Is the backend running on port 3000?</p>
      </div>
    );
  }

  const maxDailyIssues = Math.max(...stats.daily.map(d => d.issues), 1);

  return (
    <div className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen" style={{ color: '#F3F4F6' }}>
      <div className="space-y-8">
        
        {/* Header */}
        <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 backdrop-blur-sm">
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">Engineering Intelligence</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-4">
            <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Team Health </span>
            <span className="gradient-text-animated">Dashboard</span>
          </h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Real-time insights into your team's code quality, security posture, and velocity.
          </p>
        </motion.div>

        {/* ── Hero Stats Row ─────────────────────────────────────────────── */}
        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Hours Saved Today */}
          <GlowCard glowColor="rgba(16,185,129,0.12)">
            <div className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px] group-hover:bg-emerald-500/20 transition-all" />
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-sm text-white/40 font-medium">Hours Saved Today</span>
              </div>
              <div className="text-4xl font-bold text-emerald-400">
                <AnimatedCounter value={stats.today.hoursSaved} suffix="h" />
              </div>
              <p className="text-xs text-white/30 mt-2">{stats.hoursSaved}h total all-time</p>
            </div>
          </GlowCard>

          {/* PRs Reviewed */}
          <GlowCard glowColor="rgba(79,70,229,0.12)">
            <div className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all" />
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-sm text-white/40 font-medium">PRs Reviewed</span>
              </div>
              <div className="text-4xl font-bold text-white">
                <AnimatedCounter value={stats.totalPRs} />
              </div>
              <p className="text-xs text-white/30 mt-2">{stats.today.prs} today</p>
            </div>
          </GlowCard>

          {/* Issues Caught */}
          <GlowCard glowColor="rgba(245,158,11,0.12)">
            <div className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px] group-hover:bg-amber-500/20 transition-all" />
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="text-sm text-white/40 font-medium">Issues Caught</span>
              </div>
              <div className="text-4xl font-bold text-amber-400">
                <AnimatedCounter value={stats.totalIssues} />
              </div>
              <div className="flex items-center gap-1 text-xs mt-2">
                <span className="text-red-400">🔴 {stats.bySeverity.critical}</span>
                <span className="text-white/20">·</span>
                <span className="text-orange-400">🟠 {stats.bySeverity.high}</span>
                <span className="text-white/20">·</span>
                <span className="text-yellow-400">🟡 {stats.bySeverity.medium}</span>
              </div>
            </div>
          </GlowCard>

          {/* Top Vulnerability */}
          <GlowCard glowColor="rgba(239,68,68,0.12)">
            <div className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[60px] group-hover:bg-red-500/20 transition-all" />
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-sm text-white/40 font-medium">Top Vulnerability</span>
              </div>
              <div className="text-lg font-bold text-red-400 leading-tight">
                {stats.topVulnerability?.title || 'None detected'}
              </div>
              {stats.topVulnerability && (
                <p className="text-xs text-white/30 mt-2">Found {stats.topVulnerability.count} times this week</p>
              )}
            </div>
          </GlowCard>
        </motion.div>

        {/* ── Compute Insights ─────────────────────────────────────────────── */}
        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.15 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Tokens */}
          <GlowCard glowColor="rgba(99,102,241,0.12)">
            <div className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] group-hover:bg-indigo-500/20 transition-all" />
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-sm text-white/40 font-medium">Total AI Tokens</span>
              </div>
              <div className="text-4xl font-bold text-indigo-400">
                <AnimatedCounter value={stats.tokenUsage.totalGrand} />
              </div>
              <p className="text-xs text-white/30 mt-2">{(stats.today.tokens || 0).toLocaleString()} consumed today</p>
            </div>
          </GlowCard>

          {/* Infrastructure Cost */}
          <GlowCard glowColor="rgba(16,185,129,0.12)">
            <div className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px] group-hover:bg-emerald-500/20 transition-all" />
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-sm text-white/40 font-medium">Infrastructure Cost</span>
              </div>
              <div className="text-4xl font-bold text-emerald-400">
                {stats.tokenUsage.totalCost}
              </div>
              <p className="text-xs text-white/30 mt-2">{stats.today.cost || '$0.0000'} spent today</p>
            </div>
          </GlowCard>

          {/* Input Tokens */}
          <GlowCard glowColor="rgba(129,140,248,0.1)">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3 text-white/40 text-sm font-medium">
                Input Tokens
              </div>
              <div className="text-2xl font-semibold text-white/80">
                {stats.tokenUsage.totalInput.toLocaleString()}
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
                <span>Output Tokens</span>
                <span className="font-mono">{stats.tokenUsage.totalOutput.toLocaleString()}</span>
              </div>
            </div>
          </GlowCard>

          {/* Model info */}
          <GlowCard glowColor="rgba(79,70,229,0.1)">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3 text-white/40 text-sm font-medium">
                Active LLM Model
              </div>
              <div className="text-xl font-semibold text-primary">
                gpt-4o-mini
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.06] text-[10px] text-white/30">
                Optimized for PR Chunk Analysis & RAG Context
              </div>
            </div>
          </GlowCard>

        </motion.div>

        {/* ── Main Content Grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 7-Day Trend Chart */}
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-2">
            <GlowCard glowColor="rgba(79,70,229,0.1)">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">7-Day Issue Trend</h2>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-primary/80 inline-block" /> Issues</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-500/80 inline-block" /> Critical</span>
                  </div>
                </div>
                <div className="flex items-end gap-2 h-48">
                  {stats.daily.map((day, i) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex flex-col items-center justify-end h-40 relative">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(day.issues / maxDailyIssues) * 100}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                          className="w-full rounded-t-lg relative group cursor-pointer overflow-hidden"
                          style={{ background: 'linear-gradient(to top, rgba(79,70,229,0.7), rgba(99,102,241,0.3))' }}
                        >
                          {/* Neon glow on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ boxShadow: 'inset 0 0 20px rgba(79,70,229,0.3)' }}
                          />
                          
                          {day.critical > 0 && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${(day.critical / Math.max(day.issues, 1)) * 100}%` }}
                              transition={{ duration: 0.6, delay: i * 0.1 + 0.3 }}
                              className="absolute bottom-0 w-full rounded-t-lg"
                              style={{ background: 'linear-gradient(to top, rgba(239,68,68,0.6), rgba(239,68,68,0.3))' }}
                            />
                          )}
                          <div className="absolute -top-14 left-1/2 -translate-x-1/2 rounded-xl px-3 py-2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10 shadow-xl border border-white/10 bg-surface/90 backdrop-blur-sm">
                            <span className="font-medium text-white">{day.issues} issues</span>
                            {day.critical > 0 && <span className="text-red-400 ml-1">({day.critical} critical)</span>}
                          </div>
                        </motion.div>
                      </div>
                      <span className="text-xs text-white/30 mt-1">
                        {new Date(day.date + 'T00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </GlowCard>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.3 }}>
            <GlowCard glowColor="rgba(99,102,241,0.1)">
              <div className="p-6">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <BarChart3 className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">By Category</h2>
                </div>
                <div className="space-y-3">
                  {Object.entries(stats.byCategory)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cat, count]) => {
                      const pct = Math.round((count / stats.totalIssues) * 100);
                      const colorClass = categoryColors[cat] || 'text-gray-400 bg-gray-500/10';
                      return (
                        <div key={cat} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span className={`flex items-center gap-2 px-2 py-0.5 rounded-md ${colorClass}`}>
                              {categoryIcons[cat]}
                              <span className="capitalize">{cat.replace('-', ' ')}</span>
                            </span>
                            <span className="text-white/30 font-mono text-xs">{count} ({pct}%)</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden bg-white/[0.04]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={`h-full rounded-full relative overflow-hidden ${
                                categoryBarColors[cat] || 'bg-gradient-to-r from-gray-500/50 to-gray-400/80'
                              }`}
                            >
                              {/* Shimmer on progress bars */}
                              <div className="absolute inset-0 shimmer-bar" />
                            </motion.div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </GlowCard>
          </motion.div>
        </div>

        {/* ── Repo Leaderboard ───────────────────────────────────────────── */}
        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.4 }}>
          <GlowCard glowColor="rgba(245,158,11,0.08)">
            <div className="p-6">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Trophy className="w-4 h-4 text-amber-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Repository Leaderboard</h2>
                <span className="ml-auto text-xs text-white/30">Sorted by issues caught</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white/30 text-xs uppercase tracking-wider border-b border-white/[0.06]">
                      <th className="text-left py-3 px-4 font-medium">#</th>
                      <th className="text-left py-3 px-4 font-medium">Repository</th>
                      <th className="text-center py-3 px-4 font-medium">PRs</th>
                      <th className="text-center py-3 px-4 font-medium">Issues</th>
                      <th className="text-center py-3 px-4 font-medium">🔴 Critical</th>
                      <th className="text-center py-3 px-4 font-medium">🟠 High</th>
                      <th className="text-right py-3 px-4 font-medium">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.leaderboard.map((repo, i) => {
                      const riskScore = repo.critical * 10 + repo.high * 5 + (repo.issues - repo.critical - repo.high);
                      const riskLevel = riskScore > 30 ? 'bg-red-500/15 text-red-400 border border-red-500/20' : riskScore > 15 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20';
                      const riskLabel = riskScore > 30 ? 'High' : riskScore > 15 ? 'Medium' : 'Low';
                      return (
                        <tr
                          key={repo.repo}
                          className="hover:bg-white/[0.03] transition-colors duration-200 border-b border-white/[0.04]"
                        >
                          <td className="py-3.5 px-4 font-mono text-white/30">{i + 1}</td>
                          <td className="py-3.5 px-4">
                            <span className="font-medium text-white">{repo.repo}</span>
                          </td>
                          <td className="py-3.5 px-4 text-center text-white/40">{repo.prs}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="font-semibold text-white">{repo.issues}</span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {repo.critical > 0 ? (
                              <span className="text-red-400 font-medium">{repo.critical}</span>
                            ) : (
                              <span className="text-white/20">0</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {repo.high > 0 ? (
                              <span className="text-orange-400 font-medium">{repo.high}</span>
                            ) : (
                              <span className="text-white/20">0</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${riskLevel}`}>
                              {riskLabel}
                              {riskScore > 15 && <ChevronUp className="w-3 h-3" />}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </GlowCard>
        </motion.div>

        {/* ── Live Banner ────────────────────────────────────────────────── */}
        <motion.div 
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <GlowCard glowColor="rgba(16,185,129,0.1)">
            <div className="p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-emerald-500/5 to-primary/5" />
              {/* Shimmer sweep across banner */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent shimmer-bar" />
              <div className="relative">
                <p className="text-white/30 mb-2 text-sm">Today's Impact</p>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-white">
                  MergeMind saved{' '}
                  <span className="text-emerald-400 text-glow">
                    <AnimatedCounter value={stats.today.hoursSaved} duration={2500} />
                    {' '}hours
                  </span>
                  {' '}of manual review time today.
                </h2>
                <p className="text-white/30">
                  Across {stats.today.prs} pull requests · {stats.today.issues} issues automatically identified
                </p>
              </div>
            </div>
          </GlowCard>
        </motion.div>

      </div>
    </div>
  );
}
