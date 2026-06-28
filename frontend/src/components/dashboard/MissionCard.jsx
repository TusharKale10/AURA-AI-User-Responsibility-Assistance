import { motion } from 'framer-motion';
import { Target, Clock, ArrowRight } from 'lucide-react';
import { categoryColors } from '../../utils/formatters';

export default function MissionCard({ mission }) {
  if (!mission) {
    return (
      <div className="relative overflow-hidden rounded-2xl p-6 text-white h-full"
        style={{ background: 'linear-gradient(135deg, #18181B 0%, #27272A 100%)' }}>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #38bdf8 0%, transparent 60%)' }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 opacity-50">
            <Target size={13} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em]">Today's Mission</span>
          </div>
          <p className="text-lg font-semibold leading-snug">You're all caught up!</p>
          <p className="text-sm text-white/50 mt-1.5">No pending tasks. Add something new to get started.</p>
        </div>
      </div>
    );
  }

  const cat = categoryColors[mission.task?.category || mission.category] || categoryColors.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl p-6 text-white h-full"
      style={{ background: 'linear-gradient(135deg, #18181B 0%, #27272A 100%)' }}
    >
      {/* Subtle glow accent */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 75% 25%, #38bdf8 0%, transparent 55%)' }}
      />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4 opacity-50">
          <Target size={13} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em]">Today's Mission</span>
        </div>

        <p className="text-xl font-semibold leading-snug tracking-tight flex-1">
          {mission.statement || mission.title}
        </p>

        <div className="flex items-center justify-between mt-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-white/50 text-xs">
              <Clock size={12} />
              <span>{mission.hoursLeft != null ? `${mission.hoursLeft}h remaining` : 'Due today'}</span>
            </div>
            {(mission.task?.category || mission.category) && (
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-[11px] font-medium capitalize">
                {mission.task?.category || mission.category}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-white/30 text-xs">
            <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

