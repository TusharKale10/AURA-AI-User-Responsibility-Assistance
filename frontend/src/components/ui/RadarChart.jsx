export default function RadarChart({ data, size = 280, color = '#1c1917' }) {
  const center = size / 2;
  const radius = size * 0.36;
  const axes = Object.keys(data);
  const n = axes.length;

  const point = (axisIdx, value) => {
    const angle = (axisIdx / n) * 2 * Math.PI - Math.PI / 2;
    const r = (Math.max(0, Math.min(100, value)) / 100) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const outerPoint = (axisIdx) => {
    const angle = (axisIdx / n) * 2 * Math.PI - Math.PI / 2;
    return { x: center + (radius + 28) * Math.cos(angle), y: center + (radius + 28) * Math.sin(angle) };
  };

  const gridPolygon = (level) =>
    axes.map((_, i) => { const p = point(i, level); return `${p.x},${p.y}`; }).join(' ');

  const dataPolygon = axes.map((k, i) => { const p = point(i, data[k]); return `${p.x},${p.y}`; }).join(' ');

  const labelAnchor = (axisIdx) => {
    const angle = (axisIdx / n) * 2 * Math.PI - Math.PI / 2;
    const cos = Math.cos(angle);
    if (cos > 0.3) return 'start';
    if (cos < -0.3) return 'end';
    return 'middle';
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {[25, 50, 75, 100].map((lvl) => (
        <polygon key={lvl} points={gridPolygon(lvl)} fill="none" stroke="#e7e5e4" strokeWidth={0.8} />
      ))}
      {axes.map((_, i) => {
        const outer = point(i, 100);
        return <line key={i} x1={center} y1={center} x2={outer.x} y2={outer.y} stroke="#e7e5e4" strokeWidth={0.8} />;
      })}
      <polygon points={dataPolygon} fill={`${color}20`} stroke={color} strokeWidth={2} strokeLinejoin="round" />
      {axes.map((k, i) => {
        const p = point(i, data[k]);
        return <circle key={i} cx={p.x} cy={p.y} r={4} fill={color} />;
      })}
      {axes.map((k, i) => {
        const lp = outerPoint(i);
        const score = data[k];
        return (
          <g key={i}>
            <text x={lp.x} y={lp.y - 5} textAnchor={labelAnchor(i)} fontSize={9} fill="#78716c" fontFamily="Inter,sans-serif" fontWeight="500">
              {k.replace('_', ' ').toUpperCase()}
            </text>
            <text x={lp.x} y={lp.y + 8} textAnchor={labelAnchor(i)} fontSize={10} fill={color} fontFamily="Inter,sans-serif" fontWeight="700">
              {score}
            </text>
          </g>
        );
      })}
      <text x={center} y={center + 4} textAnchor="middle" fontSize={10} fill="#a8a29e" fontFamily="Inter,sans-serif">
        avg {Math.round(Object.values(data).reduce((a, b) => a + b, 0) / n)}
      </text>
    </svg>
  );
}
