import { motion } from 'framer-motion';

const spring = { type: 'spring', stiffness: 420, damping: 28 };

export default function Card({
  children,
  className = '',
  hover = false,
  onClick,
  selected = false,
  as: Tag = 'div',
}) {
  const isInteractive = !!(onClick || hover);

  return (
    <motion.div
      whileHover={isInteractive ? { y: -4, scale: 1.01 } : undefined}
      whileTap={isInteractive ? { scale: 0.985, y: -2 } : undefined}
      transition={spring}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      className={[
        'aura-card',
        isInteractive && 'aura-card-interactive',
        selected && 'aura-card-selected',
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </motion.div>
  );
}
