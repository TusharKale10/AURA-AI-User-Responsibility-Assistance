import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const MODES = [
  { label: 'Focus', minutes: 25, color: 'bg-stone-900 text-white' },
  { label: 'Short break', minutes: 5, color: 'bg-emerald-600 text-white' },
  { label: 'Long break', minutes: 15, color: 'bg-blue-600 text-white' },
];

export default function FocusPage() {
  const [modeIdx, setModeIdx] = useState(0);
  const [seconds, setSeconds] = useState(MODES[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const mode = MODES[modeIdx];
  const total = mode.minutes * 60;
  const progress = 1 - seconds / total;

  useEffect(() => {
    setSeconds(mode.minutes * 60);
    setRunning(false);
  }, [modeIdx]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          setRunning(false);
          if (modeIdx === 0) setSessions((n) => n + 1);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, modeIdx]);

  const reset = () => {
    setRunning(false);
    setSeconds(mode.minutes * 60);
  };

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  const circumference = 2 * Math.PI * 110;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Focus Mode</h1>
        <p className="text-sm text-stone-400 mt-0.5">Eliminate distractions and work in deep focus.</p>
      </div>

      <div className="flex gap-2">
        {MODES.map((m, i) => (
          <button
            key={i}
            onClick={() => setModeIdx(i)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              modeIdx === i ? m.color : 'bg-white border border-stone-200 text-stone-500 hover:border-stone-300'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-8 py-8">
        <div className="relative">
          <svg width={260} height={260} className="-rotate-90">
            <circle cx={130} cy={130} r={110} fill="none" stroke="#f5f5f4" strokeWidth={8} />
            <motion.circle
              cx={130}
              cy={130}
              r={110}
              fill="none"
              stroke="#1c1917"
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-semibold text-stone-900 tabular-nums">
              {mins}:{secs}
            </span>
            <span className="text-sm text-stone-400 mt-1">{mode.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={reset} icon={<RotateCcw size={14} />}>Reset</Button>
          <Button
            onClick={() => setRunning(!running)}
            icon={running ? <Pause size={14} /> : <Play size={14} />}
            size="lg"
          >
            {running ? 'Pause' : 'Start'}
          </Button>
        </div>

        {sessions > 0 && (
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <CheckCircle2 size={15} className="text-emerald-500" />
            <span>{sessions} session{sessions > 1 ? 's' : ''} completed today</span>
          </div>
        )}
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-stone-700 mb-3">The Pomodoro Technique</h3>
        <p className="text-sm text-stone-500 leading-relaxed">
          Work for 25 minutes, then take a 5-minute break. After 4 sessions, take a longer 15-minute break. This rhythm improves focus and prevents burnout.
        </p>
      </Card>
    </div>
  );
}
