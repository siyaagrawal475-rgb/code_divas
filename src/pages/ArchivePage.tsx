// Screen 4: Time Archive
// Memorable element: The time-lock moment (expanding green ring from newly added item).

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidents } from '../context/IncidentContext';
import { EvidenceDetailDrawer } from '../components/EvidenceDetailDrawer';
import type { EvidenceItem } from '../types';
import {
  Search,
  Copy,
  Check,
  Image as ImageIcon,
  Film,
  FileText,
  FileCode,
  ShieldCheck,
} from 'lucide-react';

export const ArchivePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeIncident,
    recentUploadedEvidenceIds,
    incidents,
  } = useIncidents();

  const incident = activeIncident || incidents[0];
  const evidenceList = incident?.evidenceItems || [];

  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [drawerItem, setDrawerItem] = useState<EvidenceItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFormat, setFilterFormat] = useState<'ALL' | 'IMAGES' | 'DOCS' | 'VIDEO'>('ALL');
  const [copiedHash, setCopiedHash] = useState(false);

  // Default featured item to newest/first item
  const featuredItem = selectedEvidence || evidenceList[0] || null;

  const filteredEvidence = evidenceList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sha256.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.evidenceNumber.includes(searchQuery) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFormat =
      filterFormat === 'ALL' ||
      (filterFormat === 'IMAGES' && (item.previewType === 'image' || item.type.toLowerCase().includes('png') || item.type.toLowerCase().includes('jpg') || item.type.toLowerCase().includes('photo'))) ||
      (filterFormat === 'DOCS' && (item.previewType === 'document' || item.previewType === 'code' || item.type.toLowerCase().includes('pdf') || item.type.toLowerCase().includes('html') || item.type.toLowerCase().includes('txt'))) ||
      (filterFormat === 'VIDEO' && (item.previewType === 'video' || item.type.toLowerCase().includes('mp4')));

    return matchesSearch && matchesFormat;
  });

  const handleCopyFeaturedHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const getItemIcon = (previewType?: string) => {
    switch (previewType) {
      case 'image':
        return <ImageIcon size={16} className="text-[var(--green)]" />;
      case 'video':
        return <Film size={16} className="text-[var(--green)]" />;
      case 'code':
        return <FileCode size={16} className="text-[var(--green)]" />;
      default:
        return <FileText size={16} className="text-[var(--green)]" />;
    }
  };

  return (
    <div className="space-y-10">
      {/* Top summary header with filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--hair)]">
        <div>
          <div className="text-[14px] text-[var(--muted)]">
            Case <span className="font-mono text-[var(--text)]">{incident?.id || 'HT-002'}</span> · {evidenceList.length} preserved items
          </div>
        </div>

        {/* Search and Format Filter */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search filename or hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-6 pr-3 py-1 bg-transparent border-b border-[var(--hair)] font-mono text-[13px] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-b-[var(--green)] w-48 sm:w-60"
            />
          </div>

          <div className="flex items-center gap-1 border-b border-[var(--hair)] pb-1">
            {(['ALL', 'IMAGES', 'DOCS', 'VIDEO'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFilterFormat(fmt)}
                className={`px-2 py-0.5 text-[12px] transition-colors cursor-pointer ${
                  filterFormat === fmt
                    ? 'text-[var(--green)] font-medium'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                {fmt === 'ALL' ? 'All' : fmt.charAt(0) + fmt.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Asymmetric Split: Featured Preview (Left) + Ruled List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Featured Item Artifact Card */}
        {featuredItem && (
          <div className="lg:col-span-5 bg-[var(--panel)] border border-[var(--hair)] p-6 space-y-6 relative">
            {/* Corner Crop Marks */}
            <div className="absolute top-2 left-2 text-[var(--muted)] text-[10px] font-mono select-none">+</div>
            <div className="absolute top-2 right-2 text-[var(--muted)] text-[10px] font-mono select-none">+</div>
            <div className="absolute bottom-2 left-2 text-[var(--muted)] text-[10px] font-mono select-none">+</div>
            <div className="absolute bottom-2 right-2 text-[var(--muted)] text-[10px] font-mono select-none">+</div>

            {/* Header info */}
            <div className="flex items-center justify-between border-b border-[var(--hair)] pb-3">
              <span className="font-mono text-[13px] text-[var(--green)] font-medium">
                EV-{featuredItem.evidenceNumber}
              </span>
              <div className="flex items-center gap-1.5 text-[12px] text-[var(--soft)] font-medium">
                <ShieldCheck size={14} className="text-[var(--green)]" />
                <span>Time locked</span>
              </div>
            </div>

            {/* Media Visual Area */}
            <div className="w-full h-48 bg-[#040605] border border-[var(--hair)] flex flex-col items-center justify-center relative overflow-hidden p-4">
              {featuredItem.previewDataUrl ? (
                <img
                  src={featuredItem.previewDataUrl}
                  alt={featuredItem.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[var(--muted)]">
                  {getItemIcon(featuredItem.previewType)}
                  <span className="text-[13px]">{featuredItem.type}</span>
                </div>
              )}
            </div>

            {/* File Details */}
            <div className="space-y-4">
              <div>
                <div className="text-[13px] text-[var(--muted)]">Filename</div>
                <div className="text-[15px] font-medium text-[var(--text)] break-all mt-0.5">
                  {featuredItem.name}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[13px] border-y border-[var(--hair)] py-3">
                <div>
                  <span className="text-[var(--muted)] block">Size</span>
                  <span className="text-[var(--text)] font-mono">{featuredItem.size}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)] block">Preserved time</span>
                  <span className="text-[var(--text)] font-mono">{featuredItem.timestamp}</span>
                </div>
              </div>

              {/* SHA-256 Digest Box */}
              <div>
                <div className="flex items-center justify-between text-[13px] text-[var(--muted)] mb-1">
                  <span>SHA-256 hash</span>
                  <span className="text-[11px] text-[var(--green)]">NIST FIPS 180-4</span>
                </div>
                <div className="p-2.5 bg-[var(--bg)] border border-[var(--hair)] flex items-center justify-between gap-2">
                  <code className="font-mono text-[11px] text-[var(--soft)] break-all leading-relaxed">
                    {featuredItem.sha256}
                  </code>
                  <button
                    onClick={() => handleCopyFeaturedHash(featuredItem.sha256)}
                    className="p-1 text-[var(--muted)] hover:text-[var(--green)] transition-colors cursor-pointer shrink-0"
                    title="Copy full hash"
                  >
                    {copiedHash ? <Check size={14} className="text-[var(--green)]" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDrawerItem(featuredItem)}
                  className="app-btn-secondary w-full text-center"
                >
                  View full metadata
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/trace/${incident.id}`)}
                  className="app-btn w-full text-center"
                >
                  Trace graph
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: Ruled List of Evidence Items */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="heading-2">Evidence ledger</h2>
            <span className="text-[13px] text-[var(--muted)] font-mono">
              {filteredEvidence.length} items
            </span>
          </div>

          <div className="border-t border-[var(--hair)]">
            <div className="divide-y divide-[var(--hair)]">
              {filteredEvidence.map((item) => {
                const isSelected = featuredItem?.id === item.id;
                const isRecent = recentUploadedEvidenceIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedEvidence(item)}
                    className={`group relative p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[var(--panel)] transition-colors ${
                      isSelected ? 'bg-[var(--panel)]' : ''
                    }`}
                  >
                    {/* Selected 2px green left bar */}
                    {isSelected && (
                      <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--green)]" />
                    )}

                    {/* The Time-Lock Moment: Expanding subtle green ring on newly uploaded item */}
                    {isRecent && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <span className="absolute -inset-2 rounded-full border border-[var(--green)] opacity-75 animate-ping" />
                      </div>
                    )}

                    {/* Left: Thumbnail & Name */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 bg-[var(--bg)] border border-[var(--hair)] flex items-center justify-center shrink-0">
                        {getItemIcon(item.previewType)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[12px] text-[var(--green)] font-medium">
                            EV-{item.evidenceNumber}
                          </span>
                          <span className="text-[14px] font-medium text-[var(--text)] truncate group-hover:text-[var(--soft)] transition-colors">
                            {item.name}
                          </span>
                        </div>
                        <div className="text-[12px] text-[var(--muted)] mt-0.5">
                          {item.type} · <span className="font-mono">{item.size}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Timestamp & Hash */}
                    <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-1 font-mono text-[12px] text-[var(--muted)] shrink-0">
                      <div className="text-[var(--text)]">{item.timestamp}</div>
                      <div className="text-[11px] text-[var(--soft)]">
                        {item.sha256.substring(0, 12)}...
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredEvidence.length === 0 && (
                <div className="py-12 text-center text-[var(--muted)] text-[14px]">
                  No evidence items found matching your filter.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out Forensic Detail Drawer */}
      <EvidenceDetailDrawer
        item={drawerItem}
        onClose={() => setDrawerItem(null)}
      />
    </div>
  );
};
