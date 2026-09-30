import React, { useState, useEffect } from 'react';
import type { EvidenceItem } from '../types';
import { ForensicPreview } from './ForensicPreview';
import { StatusBadge } from './RiskBadge';
import { Copy, Check } from 'lucide-react';
import { LockIcon } from './CustomIcons';

interface EvidenceCardProps {
  item: EvidenceItem;
  onClick: () => void;
  isRecent?: boolean;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  item,
  onClick,
  isRecent = false,
}) => {
  const [animatingLock, setAnimatingLock] = useState(isRecent || item.isNewUpload);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (animatingLock) {
      const timer = setTimeout(() => {
        setAnimatingLock(false);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [animatingLock]);

  const copyHash = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.sha256);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncatedHash = `${item.sha256.substring(0, 5)}...${item.sha256.substring(item.sha256.length - 5)}`;

  // Deterministic binary string for barcode strip
  const hashBits = parseInt(item.sha256.substring(0, 4), 16).toString(2).padStart(16, '0');

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      className={`relative group bg-[#0D1210] hover:bg-[#121A16] border border-[#1F2B25] hover:border-[#45E08A]/50 focus-visible:border-[#45E08A] rounded-[2px] overflow-hidden flex flex-col transition-all duration-150 cursor-pointer text-left select-none ${
        animatingLock ? 'ring-1 ring-[#45E08A] shadow-[0_0_16px_rgba(69,224,138,0.25)]' : ''
      }`}
    >
      {/* Signature Time Lock Animation: expanding mystic ring + sand particle reverse */}
      {animatingLock && (
        <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden bg-[#070908]/70">
          {/* Expanding Time Stone Ring */}
          <div className="w-24 h-24 rounded-full border border-[#45E08A] animate-ping opacity-80" />
          <div className="absolute w-12 h-12 rounded-full border border-[#C9A24B] animate-spin-20s opacity-90" />
          <div className="w-3 h-3 rounded-full bg-[#45E08A] gem-glow" />

          {/* Stamped Time Lock Tag */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-[#0A1410] text-[#45E08A] px-2 py-0.5 rounded-[2px] text-[9px] font-mono border border-[#0E3B27] clip-tag-tr">
            <LockIcon size={10} className="text-[#45E08A]" />
            <span>TIME LOCKED</span>
          </div>
        </div>
      )}

      {/* Visual Preview Container */}
      <ForensicPreview
        type={item.type}
        previewType={item.previewType}
        previewDataUrl={item.previewDataUrl}
        evidenceNumber={item.evidenceNumber}
        sha256={item.sha256}
      />

      {/* Card Body */}
      <div className="p-3.5 flex flex-col justify-between flex-1 gap-2.5 bg-[#0D1210]">
        <div>
          {/* Header Row: Case Ref + Permanent Sigil Ring Integrity Badge */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-[#E8F0EB]">
              SEAL #{item.evidenceNumber}
            </span>
            <div className="relative">
              {/* Permanent thin sigil ring around verified badge */}
              <span className="absolute -inset-0.5 rounded-[2px] border border-[#45E08A]/30 pointer-events-none" />
              <StatusBadge
                status={item.verified ? 'verified' : 'pending'}
                label={item.verified ? 'LOCKED' : 'UNBOUND'}
                size="sm"
              />
            </div>
          </div>

          {/* Title / file name */}
          <h4
            className="font-mono text-xs font-semibold text-[#E8F0EB] truncate group-hover:text-[#45E08A] transition-colors"
            title={item.name}
          >
            {item.name}
          </h4>

          {/* Monospace Metadata Line: Type, Bytes, UTC Timestamp */}
          <div className="text-[10px] text-[#7F8D85] mt-1.5 space-y-0.5 font-mono">
            <div className="flex items-center justify-between">
              <span>{item.type}</span>
              <span className="text-[#E8F0EB] tabular-nums">{item.size}</span>
            </div>
            <div className="text-[9.5px] text-[#7F8D85] truncate opacity-90">
              UTC: {item.timestamp}
            </div>
          </div>
        </div>

        {/* Bottom Barcode & SHA-256 Hash Row */}
        <div className="pt-2 border-t border-[#1F2B25] flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            {/* Visual Barcode Strip */}
            <span className="inline-flex items-center gap-[1px] h-3 px-1 bg-[#070908] border border-[#1F2B25] rounded-[1px] shrink-0">
              {hashBits.split('').map((bit, idx) => (
                <span
                  key={idx}
                  className={`inline-block w-[1.5px] h-2 ${
                    bit === '1' ? 'bg-[#45E08A]' : 'bg-[#1F2B25]'
                  }`}
                />
              ))}
            </span>

            <code className="font-mono text-[10px] text-[#7F8D85] group-hover:text-[#E8F0EB] transition-colors truncate">
              {truncatedHash}
            </code>
          </div>

          <button
            onClick={copyHash}
            aria-label="Copy SHA-256 hash"
            title="Copy full 64-char hash"
            className="p-1 rounded-[2px] text-[#7F8D85] hover:text-[#45E08A] hover:bg-[#121A16] transition-colors cursor-pointer"
          >
            {copied ? <Check size={12} className="text-[#45E08A]" /> : <Copy size={12} />}
          </button>
        </div>
      </div>
    </div>
  );
};
