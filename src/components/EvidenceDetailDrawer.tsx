import React, { useState } from 'react';
import type { EvidenceItem } from '../types';
import { ForensicPreview } from './ForensicPreview';
import { StatusBadge } from './RiskBadge';
import { X, Copy, Check, Clock, HardDrive, FileSpreadsheet } from 'lucide-react';
import { LockIcon, SealIcon, RegistrationMark } from './CustomIcons';

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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 select-none">
      {/* Clickable Backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Right Relic Detail Panel */}
      <div className="w-[390px] max-w-full h-full bg-[#0D1210] border-l border-[#1F2B25] shadow-2xl flex flex-col justify-between overflow-y-auto z-10 transition-transform duration-200 ease-out">
        {/* Top Header */}
        <div>
          <div className="h-14 px-5 border-b border-[#1F2B25] flex items-center justify-between bg-[#0A0E0C]">
            <div className="flex items-center gap-2.5">
              <RegistrationMark size={12} className="text-[#45E08A]" />
              <span className="font-mono text-sm font-semibold text-[#E8F0EB]">
                SEAL #{item.evidenceNumber}
              </span>
              <StatusBadge status={item.verified ? 'verified' : 'pending'} label="TIME LOCKED" size="sm" />
            </div>

            <button
              onClick={onClose}
              aria-label="Close panel"
              className="p-1.5 rounded-[2px] text-[#7F8D85] hover:text-[#E8F0EB] hover:bg-[#121A16] border border-transparent hover:border-[#1F2B25] transition-colors cursor-pointer"
            >
              <X size={15} strokeWidth={1.5} />
            </button>
          </div>

          {/* Visual preview */}
          <div className="p-5 pb-0">
            <div className="rounded-[2px] overflow-hidden border border-[#1F2B25]">
              <ForensicPreview
                type={item.type}
                previewType={item.previewType}
                previewDataUrl={item.previewDataUrl}
                evidenceNumber={item.evidenceNumber}
                sha256={item.sha256}
                className="h-44"
              />
            </div>
          </div>

          {/* Core Properties List */}
          <div className="p-5 space-y-4 font-mono text-xs">
            {/* File Name */}
            <div>
              <div className="label-tracked mb-1">FILE IDENTIFIER</div>
              <div className="p-2.5 rounded-[2px] bg-[#070908] border border-[#1F2B25] font-mono text-[11px] text-[#E8F0EB] break-all">
                {item.name}
              </div>
            </div>

            {/* Cryptographic SHA-256 Digest */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="label-tracked">NIST SHA-256 HASH DIGEST</span>
                <span className="text-[9px] text-[#45E08A]">FIPS 180-4</span>
              </div>
              <div className="p-2.5 rounded-[2px] bg-[#070908] border border-[#1F2B25] flex items-start justify-between gap-2">
                <code className="font-mono text-[10.5px] text-[#45E08A] break-all leading-relaxed">
                  {item.sha256}
                </code>
                <button
                  onClick={copyFullHash}
                  className="shrink-0 p-1 rounded-[2px] text-[#7F8D85] hover:text-[#45E08A] hover:bg-[#121A16] transition-colors cursor-pointer mt-0.5"
                  title="Copy full 64-char hash"
                >
                  {copied ? <Check size={13} className="text-[#45E08A]" /> : <Copy size={13} />}
                </button>
              </div>
            </div>

            {/* Forensic Metadata Key-Values */}
            <div className="p-3 bg-[#070908] border border-[#1F2B25] rounded-[2px] space-y-2.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-[#7F8D85] flex items-center gap-1.5">
                  <Clock size={12} className="text-[#C9A24B]" />
                  <span>PRESERVED UTC</span>
                </span>
                <span className="text-[#E8F0EB] font-mono">{item.timestamp}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#7F8D85] flex items-center gap-1.5">
                  <HardDrive size={12} className="text-[#7F8D85]" />
                  <span>PAYLOAD SIZE</span>
                </span>
                <span className="text-[#E8F0EB] font-mono tabular-nums">{item.size} ({item.sizeBytes.toLocaleString()} bytes)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#7F8D85] flex items-center gap-1.5">
                  <FileSpreadsheet size={12} className="text-[#7F8D85]" />
                  <span>MIME TAXONOMY</span>
                </span>
                <span className="text-[#E8F0EB]">{item.type}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#7F8D85] flex items-center gap-1.5">
                  <SealIcon size={12} className="text-[#45E08A]" />
                  <span>PROVENANCE</span>
                </span>
                <span className="text-[#45E08A]">{item.source}</span>
              </div>
            </div>

            {/* Related Events Trail */}
            <div>
              <div className="label-tracked mb-2">RECONSTRUCTED TIMELINE NODES</div>
              <div className="space-y-1.5">
                {(item.relatedEvents || ['Initial preservation']).map((ev, i) => (
                  <div
                    key={i}
                    className="px-2.5 py-1.5 rounded-[2px] bg-[#070908] border border-[#1F2B25] text-[10px] text-[#E8F0EB] flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#45E08A] gem-glow-sm" />
                    <span className="font-mono">{ev}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-[#1F2B25] bg-[#0A0E0C] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#7F8D85]">
            <LockIcon size={12} className="text-[#45E08A]" />
            <span>IMMUTABLE RELIC RECORD</span>
          </div>
          <button
            onClick={copyFullHash}
            className="px-3 py-1.5 bg-[#121A16] hover:bg-[#18231E] border border-[#1F2B25] text-xs font-mono text-[#E8F0EB] rounded-[2px] transition-colors cursor-pointer"
          >
            {copied ? 'HASH COPIED' : 'COPY HASH'}
          </button>
        </div>
      </div>
    </div>
  );
};
