export const formatDeadline = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = d - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (diff < 0) return 'Overdue';
  if (hours < 1) return 'Due soon';
  if (hours < 24) return `${hours}h left`;
  if (days === 1) return 'Tomorrow';
  if (days < 7) return `${days} days left`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatTime = (date) =>
  new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

export const categoryColors = {
  work: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  study: { bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-500' },
  personal: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  health: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
  finance: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  other: { bg: 'bg-stone-50', text: 'text-stone-600', dot: 'bg-stone-400' },
};

export const riskColors = {
  safe: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Safe' },
  moderate: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Moderate' },
  high: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'High Risk' },
};

export const priorityColors = {
  low: { text: 'text-stone-500', label: 'Low' },
  medium: { text: 'text-blue-600', label: 'Medium' },
  high: { text: 'text-amber-600', label: 'High' },
  critical: { text: 'text-rose-600', label: 'Critical' },
};
