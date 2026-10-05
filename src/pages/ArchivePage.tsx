import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidents } from '../context/IncidentContext';
import { EvidenceDetailDrawer } from '../components/EvidenceDetailDrawer';
import { EvidenceCard } from '../components/EvidenceCard';
import { TimeSigil } from '../components/TimeSigil';
import { Button } from '../components/Button';
import { HashField } from '../components/HashField';
import { UploadDropzone } from '../components/UploadDropzone';
import type { UploadedFileItem } from '../components/UploadDropzone';
import type { EvidenceItem } from '../types';
import {
  Search,
  Upload,
  Lock,
  ShieldCheck,
  ArrowRight,
  FileCode,
  Image as ImageIcon,
  Film,
  FileText,
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
  const [isUploadingMore, setIsUploadingMore] = useState(false);
  const [additionalFiles, setAdditionalFiles] = useState<UploadedFileItem[]>([]);

  // Default featured item to selected or first item
  const featuredItem = selectedEvidence || evidenceList[0] || null;

  const filteredEvidence = evidenceList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sha256.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.evidenceNumber.includes(searchQuery) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFormat =
      filterFormat === 'ALL' ||
      (filterFormat === 'IMAGES' && (item.previewType === 'image' || item.type.toLowerCase().includes('png') || item.type.toLowerCase().includes('jpg') || item.type.toLowerCase().includes('photo') || item.type.toLowerCase().includes('raw'))) ||
      (filterFormat === 'DOCS' && (item.previewType === 'document' || item.previewType === 'code' || item.type.toLowerCase().includes('pdf') || item.type.toLowerCase().includes('html') || item.type.toLowerCase().includes('txt') || item.type.toLowerCase().includes('json') || item.type.toLowerCase().includes('har'))) ||
      (filterFormat === 'VIDEO' && (item.previewType === 'video' || item.type.toLowerCase().includes('mp4')));

    return matchesSearch && matchesFormat;
  });

  const getItemIcon = (previewType?: string) => {
    switch (previewType) {
      case 'image':
        return <ImageIcon size={20} className="text-[var(--accent)]" />;
      case 'video':
        return <Film size={20} className="text-[var(--accent)]" />;
      case 'code':
        return <FileCode size={20} className="text-[var(--accent)]" />;
      default:
        return <FileText size={20} className="text-[var(--accent)]" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Persistent Privacy Note */}
      <div className="flex items-center justify-between p-3.5 bg-[var(--panel)] border border-[var(--hair)] rounded-[var(--radius-sm)] text-[12px] text-[var(--muted)]">
        <div className="flex items-center gap-2">
          <Lock size={14} className="text-[var(--accent)] shrink-0" />
          <span>
            <strong>Client-Side Isolation:</strong> Files never leave your device. All cryptographic operations occur locally in your browser sandbox.
          </span>
        </div>
        <span className="hidden sm:inline font-mono text-[var(--accent)]">
          NIST FIPS 180-4
        </span>
      </div>

      {/* Top Header Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--hair)]">
        <div>
          <div className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-wider">
            Evidence Vault
          </div>
          <div className="text-[14px] text-[var(--text)] mt-0.5">
            Case <span className="font-mono text-[var(--accent)] font-semibold">{incident?.id || 'CV-002'}</span> · {evidenceList.length} preserved artifacts
          </div>
        </div>

        {/* Search and Format Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search filename or hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-[var(--panel)] border border-[var(--hair)] rounded-[var(--radius-xs)] font-mono text-[12px] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] w-48 sm:w-60"
            />
          </div>

          <div className="flex items-center gap-1 bg-[var(--panel)] p-1 rounded-[var(--radius-xs)] border border-[var(--hair)]">
            {(['ALL', 'IMAGES', 'DOCS', 'VIDEO'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFilterFormat(fmt)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-[var(--radius-xs)] transition-colors cursor-pointer ${
                  filterFormat === fmt
                    ? 'bg-[var(--raised)] text-[var(--accent)] font-medium shadow-[0_0_6px_var(--accent-glow)]'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                {fmt === 'ALL' ? 'All' : fmt.charAt(0) + fmt.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={<Upload size={14} />}
            onClick={() => setIsUploadingMore(!isUploadingMore)}
          >
            {isUploadingMore ? 'Close Uploader' : 'Add Artifact'}
          </Button>
        </div>
      </div>

      {/* Upload Dropzone Collapse Area */}
      {isUploadingMore && (
        <div className="p-6 bg-[var(--panel)] border border-[var(--hair)] rounded-[var(--radius-sm)] space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--hair)] pb-3">
            <span className="font-display text-base font-light text-[var(--text)]">
              PRESERVE ADDITIONAL ARTIFACT
            </span>
            <span className="text-[12px] text-[var(--muted)] font-mono">
              In-browser SHA-256 computation
            </span>
          </div>
          <UploadDropzone files={additionalFiles} onFilesChange={setAdditionalFiles} />
        </div>
      )}

      {/* Asymmetric Split: Featured Preview (Left) + Evidence Grid (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Featured Item Inspector */}
        {featuredItem && (
          <div className="lg:col-span-5 bg-[var(--panel)] border border-[var(--hair)] rounded-[var(--radius-sm)] p-6 space-y-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between border-b border-[var(--hair)] pb-3">
              <span className="font-mono text-[13px] text-[var(--accent)] font-semibold">
                EV-{featuredItem.evidenceNumber}
              </span>
              <div className="flex items-center gap-1.5 text-[12px] text-[var(--accent)] font-medium">
                <ShieldCheck size={14} />
                <span>NIST SHA-256 Validated</span>
              </div>
            </div>

            {/* Media Visual Box */}
            <div className="w-full h-52 bg-[var(--bg)] border border-[var(--hair)] rounded-[var(--radius-xs)] flex flex-col items-center justify-center relative overflow-hidden p-4">
              {featuredItem.previewDataUrl ? (
                <img
                  src={featuredItem.previewDataUrl}
                  alt={featuredItem.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[var(--muted)]">
                  {getItemIcon(featuredItem.previewType)}
                  <span className="text-[13px] font-mono">{featuredItem.type}</span>
                </div>
              )}
            </div>

            {/* File Details */}
            <div className="space-y-4">
              <div>
                <div className="text-[11px] font-mono text-[var(--muted)] uppercase">Filename</div>
                <div className="text-[15px] font-medium text-[var(--text)] break-all mt-0.5">
                  {featuredItem.name}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[13px] border-y border-[var(--hair)] py-3">
                <div>
                  <span className="text-[var(--muted)] text-[11px] font-mono uppercase block">Size</span>
                  <span className="text-[var(--text)] font-mono">{featuredItem.size}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)] text-[11px] font-mono uppercase block">Preserved UTC</span>
                  <span className="text-[var(--text)] font-mono">{featuredItem.timestamp}</span>
                </div>
              </div>

              {/* SHA-256 Digest Box */}
              <HashField
                label="SHA-256 Cryptographic Signature"
                hash={featuredItem.sha256}
                verified={featuredItem.verified}
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setDrawerItem(featuredItem)}
                  className="text-[13px] text-[var(--muted)] hover:text-[var(--accent)] underline transition-colors cursor-pointer"
                >
                  View full metadata
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<ArrowRight size={14} />}
                  onClick={() => navigate(`/trace/${incident.id}`)}
                >
                  Trace Sequence
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: Evidence Cards Ledger */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-light text-[var(--text)]">
              PRESERVED ARTIFACTS
            </h2>
            <span className="text-[12px] text-[var(--muted)] font-mono">
              {filteredEvidence.length} items
            </span>
          </div>

          <div className="space-y-3">
            {filteredEvidence.map((item) => {
              const isSelected = featuredItem?.id === item.id;
              const isRecent = recentUploadedEvidenceIds.includes(item.id);

              return (
                <EvidenceCard
                  key={item.id}
                  item={item}
                  isSelected={isSelected}
                  isRecent={isRecent}
                  onSelect={(ev) => setSelectedEvidence(ev)}
                  onViewDetails={(ev) => setDrawerItem(ev)}
                />
              );
            })}

            {filteredEvidence.length === 0 && (
              <div className="p-12 text-center text-[var(--muted)] text-[14px] bg-[var(--panel)] border border-[var(--hair)] rounded-[var(--radius-sm)] space-y-3">
                <TimeSigil size={48} speed="slow" showClock={false} />
                <p>No evidence items found matching query.</p>
              </div>
            )}
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
