import React from 'react';
import { LogOut } from 'lucide-react';

interface QuickExitProps {
  className?: string;
  variant?: 'button' | 'compact';
}

export const QuickExit: React.FC<QuickExitProps> = ({ className = '', variant = 'button' }) => {
  const handleQuickExit = (e: React.MouseEvent) => {
    e.preventDefault();
    // Neutral destination (e.g., Google or Weather)
    window.location.replace('https://www.google.com/search?q=weather+today');
  };

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleQuickExit}
        className={`inline-flex items-center justify-center p-2 rounded-[var(--radius-sm)] text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-bg)] transition-colors min-h-[44px] min-w-[44px] cursor-pointer ${className}`}
        title="Quick exit to neutral search"
        aria-label="Quick exit to neutral search"
      >
        <LogOut size={16} strokeWidth={1.5} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleQuickExit}
      className={`inline-flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-bg)] border border-[var(--hair)] hover:border-[var(--danger)] rounded-[var(--radius-sm)] transition-colors min-h-[44px] cursor-pointer ${className}`}
      title="Quick exit (redirects immediately to neutral page)"
      aria-label="Quick exit"
    >
      <LogOut size={14} strokeWidth={1.5} />
      <span>Quick exit</span>
    </button>
  );
};
