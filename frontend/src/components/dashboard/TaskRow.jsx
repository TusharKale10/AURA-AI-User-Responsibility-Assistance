import { motion } from 'framer-motion';
import { formatDeadline, formatDuration, categoryColors } from '../../utils/formatters';
import RiskBadge from './RiskBadge';

export default function TaskRow({ task, onClick }) {
  const cat = categoryColors[task.category] || categoryColors.other;

  return (
    <motion.div
      whileHover={{ x: 2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      onClick={() => onClick?.(task)}
      className="group flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-xl cursor-pointer
                 transition-colors duration-150 hover:bg-zinc-50"
    >
      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cat.dot}`} />

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-zinc-800 truncate leading-snug">{task.title}</p>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          {formatDeadline(task.deadline)}
          {task.estimatedMinutes ? ` · ${formatDuration(task.estimatedMinutes)}` : ''}
        </p>
      </div>

      <div className="flex-shrink-0">
        <RiskBadge level={task.riskLevel} showLabel={false} />
      </div>
    </motion.div>
  );
}
