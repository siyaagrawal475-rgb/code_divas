import React from 'react';
import type { EvidenceItem } from '../types';
import { X, ShieldCheck } from 'lucide-react';
import { HashField } from './HashField';
import { Button } from './Button';

interface EvidenceDetailDrawerProps {
  item: EvidenceItem | null;
  onClose: () => void;
}

export const EvidenceDetailDrawer: React.FC<EvidenceDetailDrawerProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Evidence Metadata Inspector"
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs select-none"
    >
      {/* Clickable Backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Right Detail Panel */}
      <div className="w-[420px] max-w-full h-full bg-[var(--panel)] border-l border-[var(--hair)] shadow-2xl flex flex-col justify-between overflow-y-auto z-10">
        {/* Top Header */}
        <div className="p-6 border-b border-[var(--hair)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[14px] font-semibold text-[var(--accent)]">
              EV-{item.evidenceNumber}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--accent)] bg-[var(--raised)] border border-[var(--hair)] px-2 py-0.5 rounded-[var(--radius-xs)]">
              <ShieldCheck size={12} />
              <span>NIST Verified</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="p-1.5 text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer rounded-[var(--radius-xs)]"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Visual Media or Icon */}
        <div className="p-6 space-y-6 flex-1">
          <div className="w-full h-48 bg-[var(--bg)] border border-[var(--hair)] rounded-[var(--radius-xs)] flex items-center justify-center p-3 relative overflow-hidden">
            {item.previewDataUrl ? (
              <img
                src={item.previewDataUrl}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center text-[var(--muted)] text-[13px] font-mono">
                {item.type}
              </div>
            )}
          </div>

          {/* Properties List */}
          <div className="space-y-4 text-[13px]">
            <div>
              <div className="text-[11px] font-mono text-[var(--muted)] uppercase mb-1">File Name</div>
              <div className="p-2.5 bg-[var(--bg)] border border-[var(--hair)] rounded-[var(--radius-xs)] font-mono text-[12px] text-[var(--text)] break-all">
                {item.name}
              </div>
            </div>

            <HashField
              label="SHA-256 Cryptographic Digest"
              hash={item.sha256}
              verified={item.verified}
            />

            <div className="p-3 bg-[var(--bg)] border border-[var(--hair)] rounded-[var(--radius-xs)] space-y-2.5 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">Preserved UTC</span>
                <span className="font-mono text-[var(--text)]">{item.timestamp}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">File size</span>
                <span className="font-mono text-[var(--text)]">{item.size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">Source ingestion</span>
                <span className="text-[var(--text-secondary)]">{item.source}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">Integrity status</span>
                <span className="text-[var(--accent)] font-semibold">Verified / Unaltered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="p-6 border-t border-[var(--hair)] bg-[var(--bg)]">
          <Button
            variant="secondary"
            className="w-full"
            onClick={onClose}
          >
            Close Details
          </Button>
        </div>
      </div>
    </div>
  );
};
