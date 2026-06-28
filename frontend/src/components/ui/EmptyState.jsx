import { isValidElement, createElement } from 'react';

export default function EmptyState({ icon, title, description, action }) {
  const renderIcon = () => {
    if (!icon) return null;
    if (isValidElement(icon)) return icon;
    return createElement(icon, { size: 22, className: 'text-stone-400' });
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
          {renderIcon()}
        </div>
      )}
      <h3 className="text-sm font-semibold text-stone-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-stone-400 mb-4 max-w-xs">{description}</p>}
      {action}
    </div>
  );
}
