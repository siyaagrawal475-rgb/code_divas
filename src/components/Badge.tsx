import React from 'react';

export interface BadgeProps {
  variant?: 'emerald' | 'gold' | 'danger' | 'muted' | 'neutral';
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'emerald',
  children,
  dot = false,
  className = '',
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'gold':
        return 'bg-[var(--warn-bg)] text-[var(--warn)] border-[var(--warn)]/30';
      case 'danger':
        return 'bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)]/30';
      case 'muted':
        return 'bg-[var(--raised)] text-[var(--muted)] border-[var(--hair)]';
      case 'neutral':
        return 'bg-[var(--panel)] text-[var(--text)] border-[var(--hair)]';
      case 'emerald':
      default:
        return 'bg-[var(--accent-subtle)] text-[var(--accent)] border-[var(--accent)]/30';
    }
  };

  const getDotColor = () => {
    switch (variant) {
      case 'gold':
        return 'bg-[var(--warn)]';
      case 'danger':
        return 'bg-[var(--danger)]';
      case 'muted':
        return 'bg-[var(--muted)]';
      case 'neutral':
        return 'bg-[var(--text)]';
      case 'emerald':
      default:
        return 'bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider rounded-[var(--radius-xs)] border ${getStyles()} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getDotColor()}`} />}
      <span>{children}</span>
    </span>
  );
};
