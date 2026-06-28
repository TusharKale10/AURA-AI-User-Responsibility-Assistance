import { motion } from 'framer-motion';
import Spinner from './Spinner';

const variants = {
  primary:   'text-white [background:linear-gradient(135deg,#0d2d5e_0%,#1255b0_40%,#0284c7_70%,#06b6d4_100%)] hover:opacity-90 shadow-[0_2px_8px_rgba(2,132,199,0.38)] hover:shadow-[0_6px_18px_rgba(2,132,199,0.48)]',
  secondary: 'bg-white text-zinc-700 border border-zinc-200/80 hover:bg-zinc-50 hover:border-zinc-300 shadow-[0_1px_2px_rgba(0,0,0,0.06)]',
  ghost:     'text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900',
  danger:    'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 hover:border-rose-300',
  success:   'bg-emerald-600 text-white hover:bg-emerald-700 shadow-[0_1px_3px_rgba(0,0,0,0.18)]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  icon,
}) {
  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.015 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center rounded-[10px] font-medium
        transition-[background-color,box-shadow,border-color,color] duration-150
        disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {loading
        ? <Spinner size="sm" className="text-current opacity-70" />
        : icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}
