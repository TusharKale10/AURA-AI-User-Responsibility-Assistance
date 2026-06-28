import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { lifeBalanceApi } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import RadarChart from '../components/ui/RadarChart';

const DIMENSIONS = [
  { key: 'career',          label: 'Career',        emoji: '💼' },
  { key: 'learning',        label: 'Learning',       emoji: '📚' },
  { key: 'health',          label: 'Health',         emoji: '🏃' },
  { key: 'finance',         label: 'Finance',        emoji: '💰' },
  { key: 'personal_growth', label: 'Growth',         emoji: '🌱' },
  { key: 'habits',          label: 'Habits',         emoji: '⚡' },
  { key: 'relationships',   label: 'Relationships',  emoji: '🤝' },
];

const scoreColor  = (s) => s >= 70 ? 'text-emerald-600' : s >= 40 ? 'text-amber-600' : 'text-rose-600';
const trackColor  = (s) => s >= 70 ? 'bg-emerald-500'   : s >= 40 ? 'bg-amber-400'    : 'bg-rose-500';
const scoreBadge  = (s) => s >= 70 ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                         : s >= 40 ? 'bg-amber-50 text-amber-700 border-amber-100'
                         :           'bg-rose-50 text-rose-700 border-rose-100';

export default function LifeBalancePage() {
  const [balance,     setBalance]     = useState(null);
  const [history,     setHistory]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [recalcing,   setRecalcing]   = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [bRes, hRes] = await Promise.all([
        lifeBalanceApi.get(),
        lifeBalanceApi.getHistory(),
      ]);
      setBalance(bRes.data.lifeBalance);
      setHistory(hRes.data.history || []);
      setLastUpdated(new Date(bRes.data.lifeBalance?.date));
    } catch (_) {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleRecalculate = async () => {
    setRecalcing(true);
    try {
      const res = await lifeBalanceApi.recalculate();
      setBalance(res.data.lifeBalance);
      setLastUpdated(new Date());
      // refresh history without full reload
      const hRes = await lifeBalanceApi.getHistory();
      setHistory(hRes.data.history || []);
    } catch (_) {}
    setRecalcing(false);
  };

  const scores  = balance?.scores  || {};
  const avg     = DIMENSIONS.length
    ? Math.round(DIMENSIONS.reduce((sum, d) => sum + (scores[d.key] || 0), 0) / DIMENSIONS.length)
    : 0;

  const radarData = balance
    ? Object.fromEntries(DIMENSIONS.map((d) => [d.label, scores[d.key] || 0]))
    : null;

  const timeAgo = (date) => {
    if (!date) return '';
    const mins = Math.floor((Date.now() - date) / 60000);
    if (mins < 1)  return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Life Balance</h1>
          <p className="text-sm text-stone-400 mt-0.5">
            Scores computed from your real task data — no manual input needed.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-stone-400 hidden sm:block">
              Updated {timeAgo(lastUpdated)}
            </span>
          )}
          <Button
            variant="secondary"
            onClick={handleRecalculate}
            loading={recalcing}
            icon={<RefreshCw size={14} className={recalcing ? 'animate-spin' : ''} />}
          >
            Update Scores
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Top row: Radar + Scores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Radar chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-semibold text-stone-800">Balance Radar</p>
                <div className="text-right">
                  <p className="text-2xl font-bold text-stone-900">{avg}</p>
                  <p className="text-xs text-stone-400">avg score</p>
                </div>
              </div>
              {radarData && (
                <div className="flex justify-center">
                  <RadarChart data={radarData} size={260} />
                </div>
              )}
              <p className="text-[11px] text-stone-400 text-center mt-3">
                Auto-computed from your completed tasks and active goals
              </p>
            </Card>

            {/* Dimension bars */}
            <Card className="p-5">
              <p className="text-sm font-semibold text-stone-800 mb-4">Dimension Scores</p>
              <div className="space-y-3.5">
                {DIMENSIONS.map((dim) => {
                  const score = scores[dim.key] || 0;
                  return (
                    <div key={dim.key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-stone-700">
                          {dim.emoji} {dim.label}
                        </span>
                        <span className={`text-xs font-bold border px-2 py-0.5 rounded-full ${scoreBadge(score)}`}>
                          {score}
                        </span>
                      </div>
                      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 0.7, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className={`h-full rounded-full ${trackColor(score)}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* AI Insights + Suggestions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {balance?.aiInsights && (
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-stone-100 rounded-lg flex items-center justify-center">
                    <Sparkles size={13} className="text-stone-600" />
                  </div>
                  <p className="text-sm font-semibold text-stone-800">AI Insight</p>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">{balance.aiInsights}</p>
              </Card>
            )}

            {balance?.suggestions?.length > 0 && (
              <Card className="p-5">
                <p className="text-sm font-semibold text-stone-800 mb-3">Improvement Suggestions</p>
                <ol className="space-y-3">
                  {balance.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
                      <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ol>
              </Card>
            )}
          </div>

          {/* Score trend */}
          {history.length > 1 && (
            <Card className="p-5">
              <p className="text-sm font-semibold text-stone-800 mb-4">
                Score Trend
                <span className="ml-2 text-xs font-normal text-stone-400">last {Math.min(history.length, 10)} updates</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {DIMENSIONS.map((dim) => {
                  const vals = [...history].reverse().slice(-10).map((h) => h.scores?.[dim.key] || 0);
                  const latest = vals[vals.length - 1] ?? 0;
                  const prev   = vals[vals.length - 2] ?? latest;
                  const delta  = latest - prev;
                  return (
                    <div key={dim.key} className="bg-stone-50 rounded-xl p-3">
                      <p className="text-[10px] text-stone-400 mb-1">{dim.emoji} {dim.label}</p>
                      <p className={`text-xl font-bold ${scoreColor(latest)}`}>{latest}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {delta > 0 ? (
                          <TrendingUp size={11} className="text-emerald-500" />
                        ) : delta < 0 ? (
                          <TrendingDown size={11} className="text-rose-500" />
                        ) : (
                          <Minus size={11} className="text-stone-300" />
                        )}
                        <span className={`text-[10px] font-medium ${delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-rose-600' : 'text-stone-400'}`}>
                          {delta > 0 ? `+${delta}` : delta === 0 ? 'no change' : delta} vs last
                        </span>
                      </div>
                      {/* Mini sparkline */}
                      {vals.length > 2 && (
                        <div className="flex items-end gap-0.5 h-6 mt-2">
                          {vals.map((v, i) => (
                            <div key={i} className="flex-1 rounded-sm"
                              style={{ height: `${Math.max(4, (v / 100) * 100)}%`, background: i === vals.length - 1 ? '#1c1917' : '#e7e5e4' }} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Empty state */}
          {!balance && !loading && (
            <Card className="p-10 text-center">
              <p className="text-stone-400 text-sm mb-3">No life balance data yet.</p>
              <Button onClick={handleRecalculate} loading={recalcing}>
                Compute Now
              </Button>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
