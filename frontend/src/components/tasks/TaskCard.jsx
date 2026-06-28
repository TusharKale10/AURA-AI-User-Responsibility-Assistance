import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MoreHorizontal, CheckCircle2, Circle, Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';
import { formatDeadline, formatDuration, categoryColors, priorityColors } from '../../utils/formatters';
import RiskBadge from '../dashboard/RiskBadge';

export default function TaskCard({ task, onComplete, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cat = categoryColors[task.category] || categoryColors.other;
  const pri = priorityColors[task.priority]  || priorityColors.medium;
  const done = task.status === 'completed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={!done ? { y: -3, scale: 1.005 } : undefined}
      transition={{ duration: 0.2, type: 'spring', stiffness: 380, damping: 28 }}
      className={[
        'aura-card p-4 transition-[box-shadow,border-color,opacity]',
        done ? 'opacity-55' : 'aura-card-interactive',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onComplete(task)}
          className="mt-0.5 flex-shrink-0 transition-colors duration-150"
          style={{ color: done ? 'rgb(16 185 129)' : '#d1d5db' }}
        >
          {done ? <CheckCircle2 size={19} /> : <Circle size={19} />}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-[13px] font-medium leading-snug tracking-tight ${
              done ? 'line-through text-zinc-400' : 'text-zinc-800'
            }`}>
              {task.title}
            </p>

            {/* Menu */}
            <div className="relative flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded-lg text-zinc-300 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                <MoreHorizontal size={14} />
              </motion.button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.14 }}
                    onMouseLeave={() => setMenuOpen(false)}
                    className="absolute right-0 top-8 bg-white border border-black/[0.07] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.10)] z-20 py-1 w-36"
                  >
                    <button
                      onClick={() => { onEdit(task); setMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-zinc-600 hover:bg-zinc-50 transition-colors"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => { onDelete(task._id); setMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {task.description && (
            <p className="text-[12px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{task.description}</p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${cat.bg} ${cat.text}`}>
              <span className={`w-1 h-1 rounded-full ${cat.dot}`} />
              {task.category}
            </span>
            <span className={`text-[11px] font-semibold ${pri.text}`}>{pri.label}</span>
            <span className="flex items-center gap-1 text-[11px] text-zinc-400">
              <Clock size={10} /> {formatDuration(task.estimatedMinutes)}
            </span>
            <span className="text-[11px] text-zinc-400">{formatDeadline(task.deadline)}</span>
            {!done && <RiskBadge level={task.riskLevel} />}
          </div>

          {task.tags?.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {task.tags.map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-500 text-[11px] font-medium">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
