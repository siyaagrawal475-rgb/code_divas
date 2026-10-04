import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center w-10 h-10 min-h-[44px] min-w-[44px] rounded-[var(--radius-sm)] border border-[var(--hair)] bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--hair-bright)] transition-colors cursor-pointer ${className}`}
      title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-label="Toggle visual theme"
    >
      {theme === 'dark' ? (
        <Sun size={16} strokeWidth={1.5} className="text-[var(--gold)]" />
      ) : (
        <Moon size={16} strokeWidth={1.5} className="text-[var(--accent)]" />
      )}
    </button>
  );
};
