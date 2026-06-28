import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Clock, ChevronRight } from 'lucide-react';
import { aiApi, tasksApi } from '../services/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { formatDuration, categoryColors, priorityColors } from '../utils/formatters';

export default function PlannerPage() {
  const [goal, setGoal] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [usedFallback, setUsedFallback] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!goal.trim()) return;
    setLoading(true);
    setError('');
    setTasks([]);
    setSaved(false);
    try {
      const { data } = await aiApi.planner(goal);
      setTasks(data.tasks);
      setUsedFallback(data.usedFallback || false);
    } catch (err) {
      setError(err.response?.data?.message || 'AI is unavailable. Check your Gemini API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    if (!deadline) return setError('Please set a base deadline for these tasks.');
    setSaving(true);
    setError('');
    try {
      const baseDate = new Date(deadline);
      await Promise.all(
        tasks.map((t, i) => {
          const taskDeadline = new Date(baseDate);
          taskDeadline.setHours(taskDeadline.getHours() + i * 2);
          return tasksApi.create({
            ...t,
            deadline: taskDeadline.toISOString(),
            isAIGenerated: true,
          });
        })
      );
      setSaved(true);
    } catch {
      setError('Failed to save tasks. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const removeTask = (idx) => setTasks((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">AI Planner</h1>
        <p className="text-sm text-stone-400 mt-0.5">Describe a goal and AURA will break it down into actionable tasks.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-stone-700 block mb-2">What do you need to accomplish?</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all resize-none"
              rows={3}
              placeholder='e.g. "Prepare for my product manager interview next week" or "Launch my portfolio website"'
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            />
          </div>
          <Button type="submit" loading={loading} icon={<Sparkles size={14} />}>
            {loading ? 'Generating plan...' : 'Generate plan'}
          </Button>
        </form>
      </Card>

      <AnimatePresence>
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-stone-800">Generated Plan</h2>
              <span className="text-sm text-stone-400">{tasks.length} tasks</span>
            </div>

            {usedFallback && (
              <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                Smart template used — Gemini API quota unavailable. Add a valid API key for fully personalized AI plans.
              </div>
            )}

            <div className="space-y-2">
              {tasks.map((task, idx) => {
                const cat = categoryColors[task.category] || categoryColors.other;
                const pri = priorityColors[task.priority] || priorityColors.medium;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    className="bg-white border border-stone-100 rounded-2xl p-4 flex items-start gap-4"
                  >
                    <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-stone-600">{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-stone-400 mt-0.5">{task.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cat.bg} ${cat.text}`}>
                          {task.category}
                        </span>
                        <span className={`text-xs font-medium ${pri.text}`}>{task.priority}</span>
                        <span className="flex items-center gap-1 text-xs text-stone-400">
                          <Clock size={11} /> {formatDuration(task.estimatedMinutes)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeTask(idx)}
                      className="text-stone-300 hover:text-rose-500 transition-colors text-xs px-2"
                    >
                      ✕
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {saved ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                <p className="text-sm font-medium text-emerald-700">All tasks saved successfully!</p>
                <p className="text-xs text-emerald-600 mt-0.5">Head to Tasks to see your new plan.</p>
              </div>
            ) : (
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <p className="text-sm font-medium text-stone-700">Set a target deadline</p>
                <div className="flex gap-3">
                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  />
                  <Button onClick={handleSaveAll} loading={saving} icon={<Plus size={14} />}>
                    Save all tasks
                  </Button>
                </div>
              </div>
            )}

            {error && <p className="text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-lg">{error}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {error && !tasks.length && (
        <p className="text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-lg">{error}</p>
      )}
    </div>
  );
}
