export default function MiniBarChart({ data, height = 120, color = '#1c1917', showLabels = true }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map((d) => d.value || d.completed || 0), 1);
  const barW = Math.floor(100 / data.length) - 1;

  return (
    <div className="w-full" style={{ height }}>
      <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
        {data.map((d, i) => {
          const val = d.value ?? d.completed ?? 0;
          const barH = Math.max(2, (val / max) * (height - (showLabels ? 22 : 4)));
          const x = i * (100 / data.length) + (100 / data.length - barW) / 2;
          const y = height - barH - (showLabels ? 16 : 2);
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH} rx={1.5} fill={color} opacity={0.85} />
              {showLabels && (
                <text x={x + barW / 2} y={height - 2} textAnchor="middle" fontSize={5} fill="#a8a29e" fontFamily="Inter,sans-serif">
                  {d.label?.substring(0, 3) || i + 1}
                </text>
              )}
              {val > 0 && (
                <text x={x + barW / 2} y={y - 2} textAnchor="middle" fontSize={5} fill="#78716c" fontFamily="Inter,sans-serif">
                  {val}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
