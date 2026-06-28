export default function Badge({ children, className = '', variant = 'default' }) {
  const base = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-tight';
  const variants = {
    default: 'bg-zinc-100 text-zinc-600',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger:  'bg-rose-50 text-rose-700',
    info:    'bg-blue-50 text-blue-700',
    accent:  'bg-sky-50 text-sky-700',
  };
  return (
    <span className={`${base} ${variants[variant] || ''} ${className}`}>
      {children}
    </span>
  );
}
