export default function DonutChart({ data, size = 140, label = '' }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  if (!total) return null;

  const colors = ['#1c1917', '#57534e', '#a8a29e', '#d6d3d1', '#78716c', '#292524'];
  const r = size / 2 - 12;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const slices = Object.entries(data).map(([key, val], i) => {
    const pct = val / total;
    const dash = pct * circumference;
    const slice = { key, val, pct, dash, offset, color: colors[i % colors.length] };
    offset += dash;
    return slice;
  });

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f5f5f4" strokeWidth={20} />
        {slices.map((s, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={20}
            strokeDasharray={`${s.dash} ${circumference - s.dash}`}
            strokeDashoffset={-(s.offset - circumference / 4)}
            strokeLinecap="butt"
          />
        ))}
        {label && (
          <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fill="#1c1917" fontFamily="Inter,sans-serif" fontWeight="600">
            {label}
          </text>
        )}
      </svg>
      <div className="space-y-1.5 flex-1 min-w-0">
        {slices.map((s) => (
          <div key={s.key} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-stone-600 truncate capitalize">{s.key.replace('_', ' ')}</span>
            <span className="text-xs text-stone-400 ml-auto flex-shrink-0">{s.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
