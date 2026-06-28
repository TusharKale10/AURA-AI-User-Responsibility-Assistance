export default function Input({
  label,
  error,
  hint,
  className = '',
  type = 'text',
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          aura-input w-full px-3.5 py-2.5
          placeholder:text-stone-400
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-rose-300 focus:!border-rose-400 focus:!shadow-[0_0_0_3px_rgba(244,63,94,0.10)]' : ''}
          ${className}
        `}
        {...props}
      />
      {hint && !error && <p className="text-xs text-stone-400">{hint}</p>}
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
