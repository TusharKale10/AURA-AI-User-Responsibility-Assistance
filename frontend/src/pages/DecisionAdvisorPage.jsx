import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Sparkles, ChevronRight, MessageSquare } from 'lucide-react';
import { decisionApi } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { categoryColors, priorityColors } from '../utils/formatters';

const MODE_SELECT = 'select';
const MODE_FREE = 'free';

export default function DecisionAdvisorPage() {
  const [mode, setMode] = useState(MODE_SELECT);
  const [tasks, setTasks] = useState([]);
  const [task1, setTask1] = useState('');
  const [task2, setTask2] = useState('');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { decisionApi.getTasks().then((r) => setTasks(r.data.tasks)).catch(() => {}); }, []);

  const analyze = async () => {
    setError('');
    setLoading(true);
    setResult(null);
    try {
      let payload;
      if (mode === MODE_SELECT) {
        if (!task1 || !task2 || task1 === task2) { setError('Select two different tasks.'); setLoading(false); return; }
        payload = { task1Id: task1, task2Id: task2 };
      } else {
        if (!question.trim()) { setError('Enter a question.'); setLoading(false); return; }
        payload = { question };
      }
      const res = await decisionApi.analyze(payload);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Try again.');
    }
    setLoading(false);
  };

  const TaskBadge = ({ task, recommended }) => {
    const cat = categoryColors[task.category] || categoryColors.other;
    return (
      <div className={`rounded-2xl border p-4 flex-1 ${recommended ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-white'}`}>
        {recommended && <p className="text-[10px] font-semibold text-stone-300 uppercase tracking-wider mb-2">✓ Recommended</p>}
        <p className={`text-sm font-semibold leading-snug ${recommended ? 'text-white' : 'text-stone-800'}`}>{task.title}</p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${recommended ? 'bg-stone-700 text-stone-200' : `${cat.bg} ${cat.text}`}`}>{task.category}</span>
          <span className={`text-xs font-medium ${recommended ? 'text-stone-300' : 'text-stone-500'}`}>{task.priority}</span>
          {task.deadline && <span className={`text-[10px] ${recommended ? 'text-stone-400' : 'text-stone-400'}`}>Due {new Date(task.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Decision Advisor</h1>
        <p className="text-sm text-stone-400 mt-0.5">Can't decide what to do next? AURA will analyze and recommend.</p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <button onClick={() => setMode(MODE_SELECT)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === MODE_SELECT ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
          <GitBranch size={14} /> Compare tasks
        </button>
        <button onClick={() => setMode(MODE_FREE)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === MODE_FREE ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
          <MessageSquare size={14} /> Ask a question
        </button>
      </div>

      <Card className="p-5">
        {mode === MODE_SELECT ? (
          <div className="space-y-4">
            <p className="text-sm font-medium text-stone-700">Select two tasks to compare:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-stone-500 block mb-1">Task A</label>
                <select value={task1} onChange={(e) => setTask1(e.target.value)} className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10 bg-white">
                  <option value="">Select a task…</option>
                  {tasks.map((t) => <option key={t._id} value={t._id}>{t.title}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-stone-500 block mb-1">Task B</label>
                <select value={task2} onChange={(e) => setTask2(e.target.value)} className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10 bg-white">
                  <option value="">Select a task…</option>
                  {tasks.map((t) => <option key={t._id} value={t._id}>{t.title}</option>)}
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-stone-700">Ask anything about your work:</p>
            <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={3} placeholder='e.g. "Should I complete my React assignment or prepare for the hackathon presentation?"'
              className="w-full px-4 py-3 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10 resize-none" />
          </div>
        )}

        {error && <p className="text-sm text-rose-600 mt-2">{error}</p>}

        <div className="mt-4">
          <Button onClick={analyze} loading={loading} icon={<Sparkles size={14} />}>
            {loading ? 'Analyzing…' : 'Analyze with AI'}
          </Button>
        </div>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Free-form result */}
            {result.freeForm ? (
              <Card className="p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-stone-500" />
                  <p className="text-sm font-semibold text-stone-800">AURA's Analysis</p>
                  <span className="ml-auto text-xs text-stone-400">{result.confidence}% confidence</span>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed">{result.answer}</p>
                {result.topRecommendation && (
                  <div className="bg-stone-900 rounded-xl px-4 py-3">
                    <p className="text-xs text-stone-300 mb-1 font-medium uppercase tracking-wider">Top Recommendation</p>
                    <p className="text-sm text-white">{result.topRecommendation}</p>
                  </div>
                )}
                {result.reasoning && <p className="text-xs text-stone-400 italic">{result.reasoning}</p>}
              </Card>
            ) : (
              <>
                {/* Task comparison result */}
                <div className="flex gap-3">
                  {result.recommended && <TaskBadge task={result.recommended} recommended />}
                  {result.deferred && (
                    <div className="flex-1 rounded-2xl border border-stone-100 bg-stone-50 p-4">
                      <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">Do later</p>
                      <p className="text-sm font-semibold text-stone-500">{result.deferred.title}</p>
                    </div>
                  )}
                </div>

                <Card className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-stone-800">AI Reasoning</p>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-stone-800 rounded-full" style={{ width: `${result.confidence}%` }} />
                      </div>
                      <span className="text-xs text-stone-500">{result.confidence}% confident</span>
                    </div>
                  </div>

                  {result.reasoning && (
                    <div className="flex items-start gap-2">
                      <ChevronRight size={14} className="text-stone-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-stone-700">{result.reasoning}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {result.estimatedImpact && (
                      <div className="bg-stone-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-stone-400 mb-1">Career Impact</p>
                        <p className="text-sm font-semibold text-stone-800">{result.estimatedImpact}</p>
                      </div>
                    )}
                    {result.successProbability && (
                      <div className="bg-stone-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-stone-400 mb-1">Success Rate</p>
                        <p className="text-sm font-semibold text-stone-800">{result.successProbability}%</p>
                      </div>
                    )}
                    {result.recommendation && (
                      <div className="bg-stone-50 rounded-xl p-3 col-span-1">
                        <p className="text-xs text-stone-400 mb-1">Action</p>
                        <p className="text-xs text-stone-700 font-medium">{result.recommendation}</p>
                      </div>
                    )}
                  </div>

                  {result.tradeoffs && (
                    <p className="text-xs text-stone-400 border-t border-stone-100 pt-3">
                      <span className="font-medium text-stone-500">Trade-off: </span>{result.tradeoffs}
                    </p>
                  )}
                </Card>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
