import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, RefreshCw, Sparkles } from 'lucide-react';
import { analyticsApi } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import MiniBarChart from '../components/ui/MiniBarChart';
import DonutChart from '../components/ui/DonutChart';

const StatCard = ({ label, value, sub, color = 'text-stone-900' }) => (
  <Card className="p-4">
    <p className="text-xs text-stone-400 font-medium">{label}</p>
    <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
  </Card>
);

export default function AnalyticsPage() {
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState(null);
  const [report, setReport] = useState(null);
  const [productivity, setProductivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [oRes, tRes, pRes] = await Promise.all([
        analyticsApi.getOverview(),
        analyticsApi.getTrends(),
        analyticsApi.getProductivity(),
      ]);
      setOverview(oRes.data);
      setTrends(tRes.data);
      setProductivity(pRes.data);
    } catch (_) {}
    setLoading(false);
  };

  const generateReport = async () => {
    setGeneratingReport(true);
    try {
      const res = await analyticsApi.generateReport();
      setReport(res.data);
    } catch (_) {}
    setGeneratingReport(false);
  };

  if (loading) return <div className="text-center py-16 text-stone-400 text-sm">Loading analytics…</div>;

  const ov = overview?.overview || {};
  const catBreakdown = overview?.categoryBreakdown || {};
  const dailyTrend = overview?.dailyTrend || [];
  const weeklyData = trends?.weeklyData || [];
  const hourly = trends?.hourlyProductivity || [];
  const peakHour = hourly.reduce((best, h) => h.count > (best?.count || 0) ? h : best, null);
  const fmtH = (h) => h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Analytics</h1>
          <p className="text-sm text-stone-400 mt-0.5">Productivity trends, patterns, and AI insights from your last 30 days.</p>
        </div>
        <Button onClick={generateReport} loading={generatingReport} icon={<Sparkles size={14} />} variant="secondary">
          {generatingReport ? 'Generating…' : 'Weekly AI report'}
        </Button>
      </div>

      {/* AI Weekly Report */}
      {report && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-5 bg-stone-900 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-stone-300" />
              <p className="text-xs font-semibold text-stone-300 uppercase tracking-wider">Weekly AI Report</p>
            </div>
            <p className="text-sm text-stone-100 leading-relaxed">{report.report}</p>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-stone-700">
              <div><p className="text-xs text-stone-400">Completed</p><p className="text-lg font-bold text-white">{report.stats?.completed}</p></div>
              <div><p className="text-xs text-stone-400">Rate</p><p className="text-lg font-bold text-white">{report.stats?.completionRate}%</p></div>
              <div><p className="text-xs text-stone-400">Peak time</p><p className="text-lg font-bold text-white">{report.stats?.bestWorkingTime}</p></div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total tasks (30d)" value={ov.totalTasks || 0} />
        <StatCard label="Completed" value={ov.completedTasks || 0} sub={`${ov.completionRate || 0}% completion rate`} color="text-emerald-600" />
        <StatCard label="Active goals" value={ov.activeGoals || 0} />
        <StatCard label="Week vs last week" value={`${ov.weekImprovement > 0 ? '+' : ''}${ov.weekImprovement || 0}%`} color={ov.weekImprovement >= 0 ? 'text-emerald-600' : 'text-rose-600'} sub={`${ov.thisWeekCompleted || 0} this week`} />
      </div>

      {productivity && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-stone-900">{productivity.productivityScore}</p>
            <p className="text-xs text-stone-400 mt-1">Productivity Score</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-stone-900">{productivity.completionScore}%</p>
            <p className="text-xs text-stone-400 mt-1">Completion Score</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-stone-900">{productivity.punctualityScore}%</p>
            <p className="text-xs text-stone-400 mt-1">On-time Score</p>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daily completion trend */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={14} className="text-stone-400" />
            <p className="text-sm font-semibold text-stone-800">Daily Completions (14 days)</p>
          </div>
          <MiniBarChart data={dailyTrend.map((d) => ({ value: d.completed, label: d.label }))} height={100} />
        </Card>

        {/* Weekly trend */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-stone-400" />
            <p className="text-sm font-semibold text-stone-800">Weekly Completion Rate</p>
          </div>
          <div className="space-y-3">
            {weeklyData.map((w, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-stone-400 w-16 flex-shrink-0">{w.week}</span>
                <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-stone-800 rounded-full transition-all duration-700" style={{ width: `${w.rate}%` }} />
                </div>
                <span className="text-xs font-medium text-stone-600 w-10 text-right">{w.rate}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Category breakdown */}
        <Card className="p-4">
          <p className="text-sm font-semibold text-stone-800 mb-4">Category Breakdown</p>
          {Object.keys(catBreakdown).length > 0 ? (
            <DonutChart data={Object.fromEntries(Object.entries(catBreakdown).map(([k, v]) => [k, v.total]))} size={120} />
          ) : <p className="text-xs text-stone-400">No data yet.</p>}
        </Card>

        {/* Hourly productivity */}
        <Card className="p-4">
          <p className="text-sm font-semibold text-stone-800 mb-1">Hourly Productivity</p>
          {peakHour && <p className="text-xs text-stone-400 mb-3">Peak: {fmtH(peakHour.hour)} ({peakHour.count} completions)</p>}
          <div className="flex items-end gap-0.5 h-16">
            {hourly.filter((_, i) => i >= 6 && i <= 23).map((h) => {
              const max = Math.max(...hourly.map((x) => x.count), 1);
              const pct = (h.count / max) * 100;
              return (
                <div key={h.hour} className="flex-1 flex flex-col items-center gap-0.5" title={`${fmtH(h.hour)}: ${h.count}`}>
                  <div className="w-full bg-stone-800 rounded-sm transition-all" style={{ height: `${Math.max(2, pct)}%`, opacity: pct > 0 ? 0.8 : 0.1 }} />
                  {h.hour % 4 === 0 && <span className="text-[7px] text-stone-400">{fmtH(h.hour).replace(' ', '')}</span>}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Priority distribution */}
      {overview?.priorityDistribution && (
        <Card className="p-4">
          <p className="text-sm font-semibold text-stone-800 mb-3">Priority Distribution</p>
          <div className="flex gap-4">
            {Object.entries(overview.priorityDistribution).map(([k, v]) => (
              <div key={k} className="text-center flex-1">
                <p className="text-xl font-bold text-stone-900">{v}</p>
                <p className="text-xs text-stone-400 capitalize mt-0.5">{k}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
