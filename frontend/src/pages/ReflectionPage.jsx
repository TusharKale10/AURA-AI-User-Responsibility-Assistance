import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, ChevronRight } from 'lucide-react';
import { aiApi } from '../services/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function ReflectionPage() {
  const [reflection, setReflection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await aiApi.reflection();
      setReflection(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not generate reflection. Check your Gemini API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Daily Reflection</h1>
        <p className="text-sm text-stone-400 mt-0.5">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <Card className="p-8 text-center">
        <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen size={22} className="text-stone-500" />
        </div>
        <h2 className="text-base font-semibold text-stone-800 mb-2">End your day with clarity</h2>
        <p className="text-sm text-stone-400 max-w-sm mx-auto mb-6">
          AURA will review what you accomplished today, identify what's pending, and suggest your top priorities for tomorrow.
        </p>
        <Button
          onClick={handleGenerate}
          loading={loading}
          icon={<Sparkles size={14} />}
        >
          {loading ? 'Reflecting...' : 'Generate reflection'}
        </Button>
        {error && <p className="text-sm text-rose-600 mt-4">{error}</p>}
      </Card>

      <AnimatePresence>
        {reflection && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">AURA's Summary</h3>
              <p className="text-stone-800 leading-relaxed">{reflection.summary}</p>
            </Card>

            {reflection.tomorrowPriorities?.length > 0 && (
              <Card className="p-6">
                <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">Tomorrow's Priorities</h3>
                <div className="space-y-2">
                  {reflection.tomorrowPriorities.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 py-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm text-stone-700">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-5 text-center">
                <p className="text-3xl font-bold text-stone-900">{reflection.reflection?.completedTasks?.length ?? 0}</p>
                <p className="text-sm text-stone-400 mt-1">Tasks completed</p>
              </Card>
              <Card className="p-5 text-center">
                <p className="text-3xl font-bold text-stone-900">{reflection.reflection?.pendingTasks?.length ?? 0}</p>
                <p className="text-sm text-stone-400 mt-1">Tasks pending</p>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
