import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-transparent text-[var(--text)] border border-[var(--hair)] hover:border-[var(--muted)] hover:bg-[var(--raised)]';
      case 'ghost':
        return 'bg-transparent text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--raised)] border border-transparent';
      case 'danger':
        return 'bg-[var(--danger-bg)] text-[var(--danger)] border border-[var(--danger)] hover:bg-[var(--danger)] hover:text-white';
      case 'primary':
      default:
        return 'bg-[var(--accent)] text-[var(--accent-ink)] font-semibold border border-transparent hover:opacity-90 shadow-sm shadow-[var(--accent-glow)]';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-[13px] min-h-[36px]';
      case 'lg':
        return 'px-6 py-3.5 text-[16px] min-h-[48px]';
      case 'md':
      default:
        return 'px-4 py-2.5 text-[14px] min-h-[44px]';
    }
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] transition-all select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
