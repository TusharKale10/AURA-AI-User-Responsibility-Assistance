import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, RefreshCw, TrendingUp, TrendingDown, Minus, Clock, Calendar } from 'lucide-react';
import { dnaApi } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const MetricCard = ({ label, value, suffix = '', sub, color = 'text-stone-900', delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
    <Card className="p-4">
      <p className="text-xs text-stone-400 font-medium mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}<span className="text-sm font-normal text-stone-400 ml-0.5">{suffix}</span></p>
      {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
    </Card>
  </motion.div>
);

const ProgressBar = ({ label, value, color = 'bg-stone-800' }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-xs text-stone-600">{label}</span>
      <span className="text-xs font-semibold text-stone-800">{value}%</span>
    </div>
    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.7, delay: 0.2 }}
        className={`h-full rounded-full ${color}`} />
    </div>
  </div>
);

const fmtH = (h) => h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;

export default function ProductivityDNAPage() {
  const [dna, setDna] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchDNA(); }, []);

  const fetchDNA = async () => {
    setLoading(true);
    try {
      const res = await dnaApi.get();
      setDna(res.data.dna);
    } catch (_) {}
    setLoading(false);
  };

  const refresh = async () => {
    setRefreshing(true);
    try {
      const res = await dnaApi.refresh();
      setDna(res.data.dna);
    } catch (_) {}
    setRefreshing(false);
  };

  if (loading) return <div className="text-center py-16 text-stone-400 text-sm">Computing your Productivity DNA…</div>;

  const p = dna?.profile || {};
  const m = dna?.metrics || {};
  const trend = p.weeklyTrend || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Productivity DNA</h1>
          <p className="text-sm text-stone-400 mt-0.5">Your personalized productivity profile built from your last 30 days.</p>
        </div>
        <Button variant="secondary" onClick={refresh} loading={refreshing} icon={<RefreshCw size={14} />}>Refresh</Button>
      </div>

      {!dna ? (
        <Card className="p-8 text-center">
          <p className="text-stone-500 text-sm">Complete a few tasks to build your Productivity DNA profile.</p>
        </Card>
      ) : (
        <>
          {/* AI Insight Banner */}
          {dna.aiInsights && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="p-5 bg-stone-900 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-stone-300" />
                  <p className="text-xs font-semibold text-stone-300 uppercase tracking-wider">Your DNA Insight</p>
                </div>
                <p className="text-sm text-stone-100 leading-relaxed">{dna.aiInsights}</p>
                {dna.lastComputedAt && (
                  <p className="text-[10px] text-stone-500 mt-2">Updated {new Date(dna.lastComputedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                )}
              </Card>
            </motion.div>
          )}

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard label="Completion Rate" value={m.completionRate || 0} suffix="%" color="text-emerald-600" delay={0} />
            <MetricCard label="Consistency Score" value={p.consistencyScore || 0} suffix="%" sub="days active / 30" delay={0.05} />
            <MetricCard label="Weekly Trend" value={`${trend >= 0 ? '+' : ''}${trend}`} suffix="%" color={trend >= 0 ? 'text-emerald-600' : 'text-rose-600'} delay={0.1} />
            <MetricCard label="Missed Deadlines" value={m.missedDeadlines || 0} color={m.missedDeadlines > 3 ? 'text-rose-600' : 'text-stone-900'} sub="last 30 days" delay={0.15} />
          </div>

          {/* Profile scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5">
              <p className="text-sm font-semibold text-stone-800 mb-4">Productivity Profile</p>
              <div className="space-y-4">
                <ProgressBar label="Morning Productivity" value={p.morningProductivity || 0} color={p.morningProductivity >= 70 ? 'bg-emerald-500' : 'bg-stone-700'} />
                <ProgressBar label="Work Efficiency" value={p.codingEfficiency || 0} color="bg-stone-800" />
                <ProgressBar label="Meeting Productivity" value={p.meetingProductivity || 0} color="bg-stone-600" />
                <ProgressBar label="Task Completion Accuracy" value={p.avgTaskCompletionAccuracy || 0} color={p.avgTaskCompletionAccuracy >= 70 ? 'bg-emerald-500' : 'bg-amber-500'} />
              </div>
            </Card>

            <Card className="p-5">
              <p className="text-sm font-semibold text-stone-800 mb-4">Time Intelligence</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-stone-50 rounded-xl p-3">
                  <Clock size={16} className="text-stone-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-stone-400">Deep Focus Window</p>
                    <p className="text-sm font-semibold text-stone-800">{p.deepFocusWindow || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-stone-50 rounded-xl p-3">
                  <Zap size={16} className="text-stone-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-stone-400">Peak Learning Time</p>
                    <p className="text-sm font-semibold text-stone-800">{p.peakLearningTime || 'N/A'}</p>
                  </div>
                </div>
                {m.mostProductiveDays?.length > 0 && (
                  <div className="flex items-center gap-3 bg-stone-50 rounded-xl p-3">
                    <Calendar size={16} className="text-stone-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-stone-400">Most Productive Days</p>
                      <p className="text-sm font-semibold text-stone-800">{m.mostProductiveDays.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Hourly heatmap */}
          {m.mostProductiveSlots?.length > 0 && (
            <Card className="p-5">
              <p className="text-sm font-semibold text-stone-800 mb-3">Peak Completion Hours</p>
              <div className="flex items-center gap-2 flex-wrap">
                {m.mostProductiveSlots.map((slot, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center" style={{ opacity: 0.4 + (i / m.mostProductiveSlots.length) * 0.6 }}>
                      <span className="text-white text-xs font-bold">{slot.score}</span>
                    </div>
                    <span className="text-[9px] text-stone-400">{fmtH(slot.hour)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Category breakdown */}
          {Object.keys(m.tasksByCategory || {}).length > 0 && (
            <Card className="p-5">
              <p className="text-sm font-semibold text-stone-800 mb-3">Task Category Distribution</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {Object.entries(m.tasksByCategory).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
                  <div key={cat} className="bg-stone-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-stone-900">{count}</p>
                    <p className="text-[10px] text-stone-400 capitalize mt-0.5">{cat}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
