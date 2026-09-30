import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'h-7 px-2.5 text-[11px] gap-1.5 font-mono',
    md: 'h-8.5 px-3.5 text-xs gap-2 font-mono',
    lg: 'h-10 px-5 text-xs gap-2.5 tracking-wide font-mono',
  };

  const variantStyles = {
    primary:
      'bg-[#45E08A] text-[#070908] font-semibold hover:bg-[#9AFFC4] active:bg-[#32B86E] disabled:bg-[#121A16] disabled:text-[#7F8D85] border border-[#45E08A] gem-glow-sm shadow-[0_1px_4px_rgba(69,224,138,0.2)]',
    secondary:
      'bg-[#0D1210] text-[#E8F0EB] hover:bg-[#121A16] hover:border-[#45E08A]/40 active:bg-[#070908] border-[#1F2B25] disabled:bg-[#070908] disabled:text-[#3B4942] disabled:border-[#1F2B25]',
    gold:
      'bg-[#14120C] text-[#E2C578] hover:bg-[#1C180E] hover:border-[#C9A24B] active:bg-[#0B0A06] border-[#4A3B18] shadow-[0_1px_4px_rgba(201,162,75,0.15)]',
    ghost:
      'bg-transparent text-[#7F8D85] hover:text-[#E8F0EB] hover:bg-[#0D1210] border-transparent disabled:text-[#3B4942]',
    danger:
      'bg-[#181112] text-[#FF5C67] border-[#421D22] hover:bg-[#241315] hover:border-[#FF5C67]/50 active:bg-[#120B0C] disabled:bg-[#0D1210] disabled:text-[#7F8D85]',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center rounded-[2px] transition-all duration-150 ease-out select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#45E08A] uppercase tracking-wider ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
      ) : icon && iconPosition === 'left' ? (
        <span className="shrink-0 flex items-center justify-center">{icon}</span>
      ) : null}

      <span>{children}</span>

      {!isLoading && icon && iconPosition === 'right' ? (
        <span className="shrink-0 flex items-center justify-center">{icon}</span>
      ) : null}
    </button>
  );
};
