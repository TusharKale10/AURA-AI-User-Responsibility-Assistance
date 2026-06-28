export default function Select({ label, error, className = '', children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-stone-700">{label}</label>}
      <select
        className={`
          w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm
          focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400
          transition-all duration-150 cursor-pointer
          ${error ? 'border-rose-300' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
