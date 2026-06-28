export default function HeatmapGrid({ heatmap = {}, weeks = 12 }) {
  const today = new Date();
  const days = [];
  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split('T')[0];
    days.push({ key, date: d, count: heatmap[key] || 0 });
  }

  const maxCount = Math.max(...days.map((d) => d.count), 1);

  const intensity = (count) => {
    if (count === 0) return 'bg-stone-100';
    const pct = count / maxCount;
    if (pct < 0.25) return 'bg-stone-300';
    if (pct < 0.5) return 'bg-stone-500';
    if (pct < 0.75) return 'bg-stone-700';
    return 'bg-stone-900';
  };

  const cols = [];
  for (let w = 0; w < weeks; w++) {
    cols.push(days.slice(w * 7, w * 7 + 7));
  }

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-0.5">
        <div className="flex flex-col gap-0.5 mr-1">
          {dayLabels.map((l, i) => (
            <div key={i} className="w-3 h-3 text-[8px] text-stone-400 flex items-center justify-center">{l}</div>
          ))}
        </div>
        {cols.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-0.5">
            {col.map((day) => (
              <div
                key={day.key}
                title={`${day.key}: ${day.count} task${day.count !== 1 ? 's' : ''}`}
                className={`w-3 h-3 rounded-[2px] cursor-default transition-opacity hover:opacity-80 ${intensity(day.count)}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 mt-2 ml-4">
        <span className="text-[9px] text-stone-400">Less</span>
        {['bg-stone-100', 'bg-stone-300', 'bg-stone-500', 'bg-stone-700', 'bg-stone-900'].map((c, i) => (
          <div key={i} className={`w-3 h-3 rounded-[2px] ${c}`} />
        ))}
        <span className="text-[9px] text-stone-400">More</span>
      </div>
    </div>
  );
}
