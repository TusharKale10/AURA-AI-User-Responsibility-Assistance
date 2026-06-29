import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, ChevronDown, ChevronRight, CheckCircle2, Circle, AlertTriangle, BookOpen, Trash2, Edit3, X } from 'lucide-react';
import { goalsApi, knowledgeApi } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import HeatmapGrid from '../components/ui/HeatmapGrid';

const CATEGORIES = ['career', 'learning', 'health', 'finance', 'personal_growth', 'habits', 'relationships', 'other'];
const CONFLICT_STYLES = { low: 'border-amber-200 bg-amber-50', medium: 'border-orange-200 bg-orange-50', high: 'border-rose-200 bg-rose-50' };
const progressColor = (p) => (p >= 80 ? 'bg-emerald-500' : p >= 40 ? 'bg-stone-700' : 'bg-stone-400');
const statusStyle = { active: 'bg-emerald-100 text-emerald-700', completed: 'bg-stone-100 text-stone-500', paused: 'bg-amber-100 text-amber-700', cancelled: 'bg-rose-100 text-rose-600' };

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [conflicts, setConflicts] = useState({ conflicts: [], aiRecommendation: '' });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [heatmapGoalId, setHeatmapGoalId] = useState(null);
  const [heatmapData, setHeatmapData] = useState({});
  const [addingMilestoneTo, setAddingMilestoneTo] = useState(null);
  const [msForm, setMsForm] = useState({ title: '', description: '', deadline: '' });
  const [generatingKnowledge, setGeneratingKnowledge] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', deadline: '', category: 'other', estimatedHours: '' });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const gRes = await goalsApi.getAll();
      setGoals(gRes.data.goals);
    } catch (_) {}
    setLoading(false);
    goalsApi.getConflicts().then((cRes) => setConflicts(cRes.data)).catch(() => {});
  };

  const openCreate = () => {
    setEditGoal(null);
    setForm({ title: '', description: '', deadline: '', category: 'other', estimatedHours: '' });
    setShowForm(true);
  };
  const openEdit = (g) => {
    setEditGoal(g);
    setForm({ title: g.title, description: g.description || '', category: g.category || 'other', estimatedHours: g.estimatedHours || '', deadline: g.deadline ? new Date(g.deadline).toISOString().slice(0, 10) : '' });
    setShowForm(true);
  };
  const handleSave = async () => {
    if (!form.title.trim()) return;
    const payload = { ...form, estimatedHours: Number(form.estimatedHours) || 0 };
    editGoal ? await goalsApi.update(editGoal._id, payload) : await goalsApi.create(payload);
    setShowForm(false);
    fetchAll();
  };
  const handleDelete = async (id) => { await goalsApi.delete(id); setGoals((p) => p.filter((g) => g._id !== id)); };
  const toggleMilestone = async (gId, msId) => {
    const res = await goalsApi.toggleMilestone(gId, msId);
    setGoals((p) => p.map((g) => g._id === gId ? res.data.goal : g));
  };
  const deleteMilestone = async (gId, msId) => {
    const res = await goalsApi.deleteMilestone(gId, msId);
    setGoals((p) => p.map((g) => g._id === gId ? res.data.goal : g));
  };
  const addMilestone = async (gId) => {
    if (!msForm.title.trim()) return;
    const res = await goalsApi.addMilestone(gId, msForm);
    setGoals((p) => p.map((g) => g._id === gId ? res.data.goal : g));
    setMsForm({ title: '', description: '', deadline: '' });
    setAddingMilestoneTo(null);
  };
  const toggleHeatmap = async (gId) => {
    if (heatmapGoalId === gId) { setHeatmapGoalId(null); return; }
    const res = await goalsApi.getHeatmap(gId);
    setHeatmapData(res.data.heatmap);
    setHeatmapGoalId(gId);
  };
  const generateKnowledge = async (goal) => {
    setGeneratingKnowledge(goal._id);
    try {
      await knowledgeApi.generate({ goalId: goal._id, goalTitle: goal.title });
      setGoals((p) => p.map((g) => g._id === goal._id ? { ...g, knowledgeGenerated: true } : g));
    } catch (_) {}
    setGeneratingKnowledge(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Goals</h1>
          <p className="text-sm text-stone-400 mt-0.5">Long-term goals with milestones, progress tracking, and conflict detection.</p>
        </div>
        <Button onClick={openCreate} icon={<Plus size={14} />}>New goal</Button>
      </div>

      {/* Conflict panel */}
      {conflicts.conflicts?.length > 0 && (
        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="flex items-start gap-3">
            <AlertTriangle size={15} className="text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-orange-800 mb-1">Goal Conflicts Detected</p>
              {conflicts.conflicts.map((c, i) => (
                <p key={i} className="text-xs text-orange-700 mb-0.5">
                  <span className={`font-bold uppercase mr-1 text-[10px] ${c.severity === 'high' ? 'text-rose-600' : 'text-orange-600'}`}>[{c.severity}]</span>
                  {c.reason} — <em>{c.goals?.join(' & ')}</em>
                </p>
              ))}
              {conflicts.aiRecommendation && (
                <p className="text-xs text-orange-600 mt-1.5 italic border-t border-orange-200 pt-1.5">AURA suggests: {conflicts.aiRecommendation}</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-12 text-stone-400 text-sm">Loading goals…</div>
      ) : goals.length === 0 ? (
        <EmptyState icon={<Target size={24} />} title="No goals yet" description="Create your first goal and break it into milestones." action={<Button onClick={openCreate} icon={<Plus size={14} />}>Create goal</Button>} />
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <motion.div key={goal._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card className={`overflow-hidden ${goal.conflictSeverity !== 'none' ? CONFLICT_STYLES[goal.conflictSeverity] || '' : ''}`}>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <button onClick={() => setExpandedGoal(expandedGoal === goal._id ? null : goal._id)} className="mt-0.5 text-stone-300 hover:text-stone-600 transition-colors">
                      {expandedGoal === goal._id ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-stone-900">{goal.title}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusStyle[goal.status] || ''}`}>{goal.status}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-400 capitalize">{(goal.category || 'other').replace('_', ' ')}</span>
                        {goal.conflictSeverity !== 'none' && <span className="text-[10px] text-orange-600 font-medium">⚠ conflict</span>}
                        {goal.knowledgeGenerated && <span className="text-[10px] text-stone-400">📚 knowledge ready</span>}
                      </div>
                      {goal.description && <p className="text-xs text-stone-400 mt-0.5 truncate">{goal.description}</p>}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${progressColor(goal.progress)}`} style={{ width: `${goal.progress}%` }} />
                        </div>
                        <span className="text-xs font-medium text-stone-500 w-8 text-right">{goal.progress}%</span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1.5 text-[11px] text-stone-400">
                        {goal.milestones?.length > 0 && <span>{goal.milestones.filter((m) => m.status === 'completed').length}/{goal.milestones.length} milestones done</span>}
                        {goal.deadline && <span>Due {new Date(goal.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                        {goal.estimatedHours > 0 && <span>{goal.estimatedHours}h est.</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <button onClick={() => toggleHeatmap(goal._id)} title="Activity heatmap" className="p-1.5 text-stone-300 hover:text-stone-600 transition-colors text-xs">⊞</button>
                      {!goal.knowledgeGenerated && (
                        <button onClick={() => generateKnowledge(goal)} disabled={generatingKnowledge === goal._id} title="Generate knowledge pack" className="p-1.5 text-stone-300 hover:text-stone-600 disabled:opacity-50 transition-colors">
                          <BookOpen size={13} />
                        </button>
                      )}
                      <button onClick={() => openEdit(goal)} className="p-1.5 text-stone-300 hover:text-stone-600 transition-colors"><Edit3 size={13} /></button>
                      <button onClick={() => handleDelete(goal._id)} className="p-1.5 text-stone-300 hover:text-rose-500 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </div>
                </div>

                {heatmapGoalId === goal._id && (
                  <div className="px-4 pb-4 border-t border-stone-100">
                    <p className="text-[10px] text-stone-400 mt-2 mb-2 font-semibold uppercase tracking-wider">Activity (12 weeks)</p>
                    <HeatmapGrid heatmap={heatmapData} weeks={12} />
                  </div>
                )}

                <AnimatePresence>
                  {expandedGoal === goal._id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-t border-stone-100 overflow-hidden">
                      <div className="p-4 space-y-2">
                        <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">Milestones</p>
                        {goal.milestones?.length === 0 && <p className="text-xs text-stone-400">No milestones yet.</p>}
                        {(goal.milestones || []).sort((a, b) => a.order - b.order).map((ms) => (
                          <div key={ms._id} className="flex items-start gap-2 group py-0.5">
                            <button onClick={() => toggleMilestone(goal._id, ms._id)} className="mt-0.5 flex-shrink-0">
                              {ms.status === 'completed' ? <CheckCircle2 size={15} className="text-emerald-500" /> : <Circle size={15} className="text-stone-300 group-hover:text-stone-500 transition-colors" />}
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${ms.status === 'completed' ? 'line-through text-stone-400' : 'text-stone-700'}`}>{ms.title}</p>
                              {ms.description && <p className="text-xs text-stone-400">{ms.description}</p>}
                              {ms.deadline && <p className="text-[10px] text-stone-400 mt-0.5">{new Date(ms.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>}
                            </div>
                            <button onClick={() => deleteMilestone(goal._id, ms._id)} className="opacity-0 group-hover:opacity-100 p-1 text-stone-300 hover:text-rose-500 transition-all">
                              <X size={11} />
                            </button>
                          </div>
                        ))}

                        {addingMilestoneTo === goal._id ? (
                          <div className="mt-2 space-y-2 bg-stone-50 rounded-xl p-3 border border-stone-200">
                            <input placeholder="Milestone title *" value={msForm.title} onChange={(e) => setMsForm((f) => ({ ...f, title: e.target.value }))}
                              className="w-full text-sm px-3 py-1.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 bg-white" />
                            <input placeholder="Description (optional)" value={msForm.description} onChange={(e) => setMsForm((f) => ({ ...f, description: e.target.value }))}
                              className="w-full text-xs px-3 py-1.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 bg-white" />
                            <input type="date" value={msForm.deadline} onChange={(e) => setMsForm((f) => ({ ...f, deadline: e.target.value }))}
                              className="w-full text-xs px-3 py-1.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 bg-white" />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => addMilestone(goal._id)}>Add milestone</Button>
                              <Button size="sm" variant="ghost" onClick={() => setAddingMilestoneTo(null)}>Cancel</Button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setAddingMilestoneTo(goal._id)} className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 transition-colors mt-1">
                            <Plus size={12} /> Add milestone
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editGoal ? 'Edit goal' : 'New goal'}>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-stone-600 block mb-1">Goal title *</label>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Get placed at a top tech company"
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10" />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-600 block mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} placeholder="What does success look like?"
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10 resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none bg-white">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1">Estimated hours</label>
              <input type="number" min="0" value={form.estimatedHours} onChange={(e) => setForm((f) => ({ ...f, estimatedHours: e.target.value }))} placeholder="e.g. 40"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-stone-600 block mb-1">Target deadline</label>
            <input type="date" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10" />
          </div>
          <div className="flex gap-3 pt-1">
            <Button onClick={handleSave}>{editGoal ? 'Save changes' : 'Create goal'}</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
