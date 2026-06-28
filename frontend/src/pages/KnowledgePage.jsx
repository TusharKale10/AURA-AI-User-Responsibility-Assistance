import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Sparkles, CheckSquare, Link, Lightbulb, Clock,
  HelpCircle, Trash2, Plus, Check, AlertCircle, ChevronDown,
  ChevronUp, Layers,
} from 'lucide-react';
import { knowledgeApi, goalsApi } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

// ─── Type config ──────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  checklist: { icon: CheckSquare, label: 'Checklists',  bg: 'bg-emerald-50 border-emerald-100', iconCls: 'text-emerald-500' },
  resource:  { icon: Link,         label: 'Resources',   bg: 'bg-blue-50 border-blue-100',       iconCls: 'text-blue-500'    },
  topic:     { icon: BookOpen,     label: 'Topics',      bg: 'bg-purple-50 border-purple-100',   iconCls: 'text-purple-500'  },
  tip:       { icon: Lightbulb,    label: 'Tips',        bg: 'bg-amber-50 border-amber-100',     iconCls: 'text-amber-500'   },
  timeline:  { icon: Clock,        label: 'Timelines',   bg: 'bg-stone-50 border-stone-200',     iconCls: 'text-stone-500'   },
  question:  { icon: HelpCircle,   label: 'Questions',   bg: 'bg-rose-50 border-rose-100',       iconCls: 'text-rose-500'    },
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium border ${
        type === 'success'
          ? 'bg-white border-emerald-200 text-emerald-700'
          : 'bg-white border-rose-200 text-rose-600'
      }`}
    >
      {type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
      {message}
    </motion.div>
  );
}

// ─── Knowledge item row ───────────────────────────────────────────────────────
function KnowledgeItem({ item, kbId, onConverted }) {
  const [converting, setConverting] = useState(false);
  const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.resource;

  const handleConvert = async () => {
    if (item.convertedToTask || converting) return;
    setConverting(true);
    try {
      const res = await knowledgeApi.convertToTask({ knowledgeId: kbId, itemId: item._id });
      onConverted(kbId, res.data.knowledge);
    } catch (err) {
      onConverted(kbId, null, err?.response?.data?.message || 'Failed to add task');
    }
    setConverting(false);
  };

  return (
    <div className={`border rounded-xl p-3 flex items-start gap-3 ${cfg.bg}`}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-800 leading-snug">{item.title}</p>
        {item.content && (
          <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{item.content}</p>
        )}
      </div>
      <div className="flex-shrink-0 mt-0.5">
        {item.convertedToTask ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
            <Check size={9} /> Added
          </span>
        ) : (
          <button
            onClick={handleConvert}
            disabled={converting}
            title="Add as task"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 hover:text-stone-900 hover:bg-white border border-transparent hover:border-stone-200 px-2 py-1 rounded-lg transition-all disabled:opacity-40"
          >
            {converting ? (
              <span className="w-3 h-3 border border-stone-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus size={11} />
            )}
            Task
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Knowledge pack card ──────────────────────────────────────────────────────
function KnowledgeCard({ kb, onDeleted, onConverted }) {
  const [collapsed, setCollapsed] = useState(false);

  const groups = {};
  (kb.items || []).forEach((item) => {
    if (!groups[item.type]) groups[item.type] = [];
    groups[item.type].push(item);
  });

  const totalItems  = kb.items?.length || 0;
  const addedCount  = kb.items?.filter((i) => i.convertedToTask).length || 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-stone-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-stone-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <Layers size={14} className="text-stone-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-stone-900 leading-snug">{kb.goalTitle}</h3>
              {kb.summary && <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{kb.summary}</p>}
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                {kb.estimatedPrepHours > 0 && (
                  <span className="text-[10px] text-stone-400 flex items-center gap-1">
                    <Clock size={9} /> ~{kb.estimatedPrepHours}h prep
                  </span>
                )}
                <span className="text-[10px] text-stone-400">{totalItems} items</span>
                {addedCount > 0 && (
                  <span className="text-[10px] font-medium text-emerald-600">
                    {addedCount} added to tasks
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => setCollapsed((v) => !v)}
                className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                title={collapsed ? 'Expand' : 'Collapse'}
              >
                {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
              <button
                onClick={() => onDeleted(kb._id)}
                className="p-1.5 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete pack"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-5">
                {Object.entries(groups).map(([type, items]) => {
                  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.resource;
                  const Icon = cfg.icon;
                  return (
                    <div key={type}>
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <Icon size={12} className={cfg.iconCls} />
                        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                          {cfg.label}
                        </p>
                      </div>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <KnowledgeItem
                            key={item._id}
                            item={item}
                            kbId={kb._id}
                            onConverted={onConverted}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function KnowledgePage() {
  const [goals,   setGoals]   = useState([]);
  const [packs,   setPacks]   = useState([]);
  const [goalInput,      setGoalInput]      = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [generating, setGenerating] = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [toast,      setToast]      = useState(null); // { message, type }

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [kRes, gRes] = await Promise.all([knowledgeApi.getAll(), goalsApi.getAll()]);
        setPacks(kRes.data.knowledge || []);
        setGoals((gRes.data.goals || []).filter((g) => g.status === 'active'));
      } catch {
        showToast('Failed to load knowledge packs', 'error');
      }
      setLoading(false);
    })();
  }, [showToast]);

  const handleGenerate = async () => {
    const title = selectedGoalId
      ? goals.find((g) => g._id === selectedGoalId)?.title
      : goalInput.trim();
    if (!title) return;

    setGenerating(true);
    try {
      const res = await knowledgeApi.generate({ goalId: selectedGoalId || null, goalTitle: title });
      const kb = res.data.knowledge;
      setPacks((prev) => [kb, ...prev.filter((p) => p._id !== kb._id)]);
      setGoalInput('');
      setSelectedGoalId('');
      showToast(res.data.usedFallback ? 'Pack generated (template used)' : 'Knowledge pack generated!');
    } catch {
      showToast('Failed to generate knowledge pack', 'error');
    }
    setGenerating(false);
  };

  const handleDeleted = async (id) => {
    try {
      await knowledgeApi.delete(id);
      setPacks((prev) => prev.filter((p) => p._id !== id));
      showToast('Pack deleted');
    } catch {
      showToast('Failed to delete pack', 'error');
    }
  };

  const handleConverted = useCallback((kbId, updatedKb, errMsg) => {
    if (errMsg) {
      showToast(errMsg, 'error');
      return;
    }
    setPacks((prev) => prev.map((p) => (p._id === kbId ? updatedKb : p)));
    showToast('Task added to your task list!');
  }, [showToast]);

  const canGenerate = !!(selectedGoalId || goalInput.trim());

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Knowledge Engine</h1>
        <p className="text-sm text-stone-400 mt-0.5">
          AI generates a personalised preparation pack for any goal.
        </p>
      </div>

      {/* Generator card */}
      <Card className="p-5">
        <p className="text-sm font-medium text-stone-700 mb-3">Generate knowledge for a goal:</p>
        <div className="space-y-3">
          {goals.length > 0 && (
            <div className="relative">
              <select
                value={selectedGoalId}
                onChange={(e) => { setSelectedGoalId(e.target.value); if (e.target.value) setGoalInput(''); }}
                className="w-full px-3 py-2.5 pr-8 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10 bg-white appearance-none"
              >
                <option value="">Select from your goals…</option>
                {goals.map((g) => (
                  <option key={g._id} value={g._id}>{g.title}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            </div>
          )}

          {!selectedGoalId && (
            <input
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && canGenerate && !generating && handleGenerate()}
              placeholder='Or type any goal — e.g. "Google Software Engineer Interview"'
              className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10 placeholder-stone-300"
            />
          )}

          <Button
            onClick={handleGenerate}
            loading={generating}
            disabled={!canGenerate || generating}
            icon={<Sparkles size={14} />}
            className="w-full sm:w-auto"
          >
            {generating ? 'Generating…' : 'Generate knowledge pack'}
          </Button>
        </div>
      </Card>

      {/* Pack list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin" />
        </div>
      ) : packs.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={24} />}
          title="No knowledge packs yet"
          description="Generate your first pack above to get a personalised preparation guide."
        />
      ) : (
        <div className="space-y-4">
          {packs.map((kb) => (
            <KnowledgeCard
              key={kb._id}
              kb={kb}
              onDeleted={handleDeleted}
              onConverted={handleConverted}
            />
          ))}
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            key={toast.message + Date.now()}
            message={toast.message}
            type={toast.type}
            onDone={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
