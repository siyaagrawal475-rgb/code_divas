import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  active?: boolean;
  glowOnHover?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  active = false,
  glowOnHover = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-[var(--panel)] border border-[var(--hair)] rounded-[var(--radius-sm)] p-5 transition-all ${
        glowOnHover ? 'hover:border-[var(--hair-bright)] hover:shadow-[var(--card-glow-hover)]' : ''
      } ${
        active ? 'border-[var(--accent)] shadow-[var(--spill-glow)]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
