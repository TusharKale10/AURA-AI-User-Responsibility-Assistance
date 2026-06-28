export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-3.5 h-3.5 border-[1.5px]', md: 'w-5 h-5 border-2', lg: 'w-7 h-7 border-2' };
  return (
    <div
      className={`${sizes[size]} rounded-full animate-spin ${className}`}
      style={{
        borderColor: 'rgba(0,0,0,0.1)',
        borderTopColor: 'rgba(0,0,0,0.55)',
      }}
    />
  );
}
