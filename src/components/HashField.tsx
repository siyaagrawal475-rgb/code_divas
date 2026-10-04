import React, { useState } from 'react';
import { Copy, Check, ShieldCheck } from 'lucide-react';

interface HashFieldProps {
  hash: string;
  label?: string;
  truncate?: boolean;
  verified?: boolean;
  className?: string;
}

export const HashField: React.FC<HashFieldProps> = ({
  hash,
  label,
  truncate = false,
  verified = true,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedHash = truncate && hash.length > 16
    ? `${hash.substring(0, 8)}…${hash.substring(hash.length - 8)}`
    : hash;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-[11px] text-[var(--muted)] font-mono uppercase tracking-wider">
          <span>{label}</span>
          {verified && (
            <span className="flex items-center gap-1 text-[var(--accent)] font-medium">
              <ShieldCheck size={12} />
              <span>NIST SHA-256</span>
            </span>
          )}
        </div>
      )}
      <div className="group flex items-center justify-between gap-2 p-2 bg-[var(--bg)] border border-[var(--hair)] rounded-[var(--radius-xs)] font-mono text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[var(--hair-bright)]">
        <code className="text-[var(--accent-bright)] break-all select-all font-mono">
          {formattedHash}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className="p-1 text-[var(--muted)] hover:text-[var(--accent)] transition-colors cursor-pointer shrink-0 rounded-[var(--radius-xs)]"
          title={copied ? 'Copied to clipboard' : 'Copy full SHA-256 hash'}
          aria-label="Copy hash"
        >
          {copied ? (
            <Check size={14} className="text-[var(--accent)]" />
          ) : (
            <Copy size={14} className="group-hover:text-[var(--text)]" />
          )}
        </button>
      </div>
    </div>
  );
};
