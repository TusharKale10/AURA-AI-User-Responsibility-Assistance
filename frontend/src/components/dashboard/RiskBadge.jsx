import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { riskColors } from '../../utils/formatters';

const icons = {
  safe: CheckCircle,
  moderate: AlertCircle,
  high: AlertTriangle,
};

export default function RiskBadge({ level = 'safe', showLabel = true }) {
  const config = riskColors[level];
  const Icon = icons[level];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <Icon size={11} />
      {showLabel && config.label}
    </span>
  );
}
