import React, { useState } from 'react';
import type { EvidenceItem } from '../types';
import { X, Copy, Check, ShieldCheck } from 'lucide-react';

interface EvidenceDetailDrawerProps {
  item: EvidenceItem | null;
  onClose: () => void;
}

export const EvidenceDetailDrawer: React.FC<EvidenceDetailDrawerProps> = ({ item, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const copyFullHash = () => {
    navigator.clipboard.writeText(item.sha256);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 select-none">
      {/* Clickable Backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Right Detail Panel */}
      <div className="w-[390px] max-w-full h-full bg-[var(--panel)] border-l border-[var(--hair)] shadow-2xl flex flex-col justify-between overflow-y-auto z-10">
        {/* Top Header */}
        <div className="p-6 border-b border-[var(--hair)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[14px] font-semibold text-[var(--text)]">
              EV-{item.evidenceNumber}
            </span>
            <span className="inline-flex items-center gap-1 text-[12px] text-[var(--accent-text)] bg-[var(--raised)] border border-[var(--hair)] px-2 py-0.5">
              <ShieldCheck size={12} />
              <span>Time locked</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="p-1.5 text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Visual Media or Icon */}
        <div className="p-6 space-y-6 flex-1">
          <div className="w-full h-44 bg-[var(--bg)] border border-[var(--hair)] flex items-center justify-center p-3 relative overflow-hidden">
            {item.previewDataUrl ? (
              <img
                src={item.previewDataUrl}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center text-[var(--muted)] text-[13px]">
                {item.type}
              </div>
            )}
          </div>

          {/* Properties List */}
          <div className="space-y-4 text-[13px]">
            <div>
              <div className="text-[var(--muted)] mb-1">File name</div>
              <div className="p-2.5 bg-[var(--bg)] border border-[var(--hair)] font-mono text-[12px] text-[var(--text)] break-all">
                {item.name}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[var(--muted)] mb-1">
                <span>NIST SHA-256 hash</span>
                <span className="text-[11px] text-[var(--accent-text)]">FIPS 180-4</span>
              </div>
              <div className="p-2.5 bg-[var(--bg)] border border-[var(--hair)] flex items-start justify-between gap-2">
                <code className="font-mono text-[11px] text-[var(--accent-text)] break-all leading-relaxed">
                  {item.sha256}
                </code>
                <button
                  type="button"
                  onClick={copyFullHash}
                  className="shrink-0 p-1 text-[var(--muted)] hover:text-[var(--accent-text)] transition-colors cursor-pointer"
                  title="Copy hash"
                >
                  {copied ? <Check size={14} className="text-[var(--accent-text)]" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-[var(--bg)] border border-[var(--hair)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">Preserved UTC</span>
                <span className="font-mono text-[var(--text)]">{item.timestamp}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">File size</span>
                <span className="font-mono text-[var(--text)]">{item.size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">Integrity status</span>
                <span className="text-[var(--accent-text)]">Verified / Unaltered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="p-6 border-t border-[var(--hair)] bg-[var(--bg)]">
          <button
            type="button"
            onClick={onClose}
            className="app-btn-secondary w-full text-center"
          >
            Close details
          </button>
        </div>
      </div>
    </div>
  );
};
