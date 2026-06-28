import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle, Plus, RefreshCw, TrendingUp, Clock,
  CheckCircle2, Zap, ArrowRight, Sparkles,
} from 'lucide-react';
import { dashboardApi, dnaApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import MissionCard from '../components/dashboard/MissionCard';
import ProgressRing from '../components/dashboard/ProgressRing';
import TaskRow from '../components/dashboard/TaskRow';
import RiskBadge from '../components/dashboard/RiskBadge';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const item    = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' } } };

function StatCard({ icon: Icon, label, value, color = 'slate' }) {
  const palette = {
    blue:    { bg: 'bg-blue-50',    icon: 'text-blue-500'    },
    green:   { bg: 'bg-emerald-50', icon: 'text-emerald-500' },
    red:     { bg: 'bg-rose-50',    icon: 'text-rose-500'    },
    slate:   { bg: 'bg-zinc-100',   icon: 'text-zinc-500'    },
  };
  const p = palette[color] || palette.slate;

  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`aura-stat-icon ${p.bg}`}>
          <Icon size={15} className={p.icon} />
        </div>
      </div>
      <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--aura-text-1)' }}>{value}</p>
      <p className="text-[12px] font-medium mt-0.5" style={{ color: 'var(--aura-text-3)' }}>{label}</p>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [dna, setDna] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const [dashRes] = await Promise.all([dashboardApi.get()]);
      setDashboard(dashRes.data.dashboard);
      dnaApi.get().then((r) => setDna(r.data.dna)).catch(() => {});
    } catch {
      setError('Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-sm" style={{ color: 'var(--aura-text-3)' }}>{error}</p>
        <Button variant="secondary" onClick={loadDashboard} icon={<RefreshCw size={13} />}>Retry</Button>
      </div>
    );
  }

  const { todayMission, upcomingDeadlines, riskAlerts, todayProgress, stats } = dashboard || {};

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">

      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="aura-page-title">
            <span style={{
              background: 'linear-gradient(135deg, #0d2d5e 0%, #1255b0 40%, #0284c7 70%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              {greeting()},
            </span>{' '}{user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--aura-text-3)' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <Button onClick={() => navigate('/tasks?new=1')} icon={<Plus size={14} />}>
          Add task
        </Button>
      </motion.div>

      {/* Mission + Progress */}
      <motion.div variants={item} className="grid grid-cols-3 gap-4">
        <div className="col-span-2" style={{ minHeight: 148 }}>
          <MissionCard mission={todayMission ? {
            task: todayMission,
            statement: todayMission.title,
            hoursLeft: Math.max(0, Math.round((new Date(todayMission.deadline) - Date.now()) / 3_600_000)),
          } : null} />
        </div>

        <Card className="p-5 flex flex-col items-center justify-center gap-3">
          <ProgressRing percent={todayProgress?.percent ?? 0} size={68} />
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--aura-text-3)' }}>
              Today's Progress
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--aura-text-3)' }}>
              {todayProgress?.completed ?? 0} of {todayProgress?.total ?? 0} tasks
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Stat row */}
      <motion.div variants={item} className="grid grid-cols-3 gap-4">
        <StatCard icon={TrendingUp}    label="Active Tasks"  value={stats?.totalActive ?? 0}    color="blue"  />
        <StatCard icon={CheckCircle2}  label="Done Today"    value={stats?.completedToday ?? 0}  color="green" />
        <StatCard icon={AlertTriangle} label="High Risk"     value={stats?.highRiskCount ?? 0}   color="red"   />
      </motion.div>

      {/* Productivity DNA */}
      {dna && (
        <motion.div variants={item}>
          <Card
            hover
            onClick={() => navigate('/dna')}
            className="p-5 text-white overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, #18181B 0%, #3f3f46 100%)' }}
          >
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #38bdf8 0%, transparent 50%)' }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 opacity-60">
                  <Zap size={13} />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.1em]">Productivity DNA</span>
                </div>
                <ArrowRight size={14} className="opacity-40" />
              </div>
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <p className="text-2xl font-bold">{dna.metrics?.completionRate || 0}%</p>
                  <p className="text-[11px] text-white/40 mt-0.5">Completion</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{dna.profile?.consistencyScore || 0}%</p>
                  <p className="text-[11px] text-white/40 mt-0.5">Consistency</p>
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight">{dna.profile?.deepFocusWindow || '—'}</p>
                  <p className="text-[11px] text-white/40 mt-0.5">Focus window</p>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${(dna.profile?.weeklyTrend || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {(dna.profile?.weeklyTrend || 0) >= 0 ? '+' : ''}{dna.profile?.weeklyTrend || 0}%
                  </p>
                  <p className="text-[11px] text-white/40 mt-0.5">Week trend</p>
                </div>
              </div>
              {dna.aiInsights && (
                <p className="text-[12px] text-white/40 mt-3 line-clamp-1 italic">"{dna.aiInsights}"</p>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Priority tasks + Risk alerts */}
      <motion.div variants={item} className="grid grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-semibold" style={{ color: 'var(--aura-text-1)' }}>Priority Tasks</h2>
            <button
              onClick={() => navigate('/tasks')}
              className="flex items-center gap-1 text-[11px] font-medium transition-colors duration-150"
              style={{ color: 'var(--aura-text-3)' }}
            >
              View all <ArrowRight size={11} />
            </button>
          </div>
          {upcomingDeadlines?.length > 0 ? (
            <div className="space-y-0.5">
              {upcomingDeadlines.slice(0, 4).map((task) => (
                <TaskRow key={task._id} task={task} onClick={() => navigate('/tasks')} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 gap-2">
              <Sparkles size={20} className="text-zinc-300" />
              <p className="text-[12px] text-zinc-400">No active tasks. You're clear!</p>
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-semibold" style={{ color: 'var(--aura-text-1)' }}>Risk Alerts</h2>
            {riskAlerts?.high?.length > 0 && (
              <span className="text-[11px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-medium">
                {riskAlerts.high.length} high risk
              </span>
            )}
          </div>
          {(riskAlerts?.high?.length + riskAlerts?.moderate?.length) === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2">
              <CheckCircle2 size={20} className="text-emerald-400" />
              <p className="text-[12px] text-zinc-400">All tasks are on track</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...(riskAlerts?.high || []), ...(riskAlerts?.moderate || [])].slice(0, 4).map((task) => (
                <div key={task._id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors cursor-default">
                  <RiskBadge level={task.riskLevel} showLabel={false} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-zinc-700 truncate">{task.title}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {Math.max(0, Math.round((new Date(task.deadline) - Date.now()) / 3_600_000))}h remaining
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}

