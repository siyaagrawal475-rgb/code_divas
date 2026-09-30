import React, { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';
import { TopBar } from '../components/TopBar';
import { EvidenceCard } from '../components/EvidenceCard';
import { EvidenceDetailDrawer } from '../components/EvidenceDetailDrawer';
import { Button } from '../components/Button';
import type { EvidenceItem } from '../types';
import { Search, Compass, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  SealIcon,
  RegistrationMark,
} from '../components/CustomIcons';
import { BgSigilField } from '../components/BgSigilField';

export const ArchivePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeIncident,
    recentUploadedEvidenceIds,
    clearRecentUploads,
    activeIncidentId,
  } = useIncidents();

  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFormat, setFilterFormat] = useState('ALL');

  const evidenceList = activeIncident?.evidenceItems || [];

  const filteredEvidence = evidenceList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sha256.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.evidenceNumber.includes(searchQuery) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFormat =
      filterFormat === 'ALL' ||
      (filterFormat === 'IMAGES' && (item.previewType === 'image' || item.type.includes('PNG') || item.type.includes('photo'))) ||
      (filterFormat === 'DOCS' && (item.previewType === 'document' || item.previewType === 'code' || item.type.includes('PDF') || item.type.includes('HTML') || item.type.includes('TXT'))) ||
      (filterFormat === 'VIDEO' && (item.previewType === 'video' || item.type.includes('MP4')));

    return matchesSearch && matchesFormat;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#070908] relative overflow-hidden grain-overlay">
      <BgSigilField size={600} opacity={0.06} className="top-20 left-10" />

      <TopBar
        title="Time Archive"
        subtitle="Immutable evidence artifacts sealed in local memory."
        breadcrumbs={[
          { label: 'Chronicle', href: '/chronicle' },
          { label: activeIncident?.id || 'HT-002', href: `/trace/${activeIncidentId}` },
          { label: 'Time Archive' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<Compass size={13} />}
              onClick={() => navigate(`/trace/${activeIncidentId}`)}
            >
              Trace Graph
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<FileText size={13} />}
              onClick={() => navigate(`/report/${activeIncidentId}`)}
            >
              Attested Report
            </Button>
          </div>
        }
      />

      <div className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto relative z-10">
        {/* Asymmetric Case Vault Banner with Hairline Telemetry */}
        <div className="p-5 rounded-[2px] bg-[#0D1210] border border-[#1F2B25] flex flex-col md:flex-row md:items-center justify-between gap-4 clip-tag-tr">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#45E08A] bg-[#070908] px-2 py-0.5 rounded-[2px] border border-[#1F2B25] font-semibold">
                CASE {activeIncident?.id}
              </span>
              <span className="font-mono text-xs font-semibold text-[#E8F0EB]">
                {activeIncident?.accountHandle}
              </span>
              <span className="text-xs font-mono text-[#7F8D85]">· {activeIncident?.platform}</span>
            </div>
            <p className="font-mono text-xs text-[#7F8D85]">
              {evidenceList.length} evidence artifacts anchored in cryptographic memory with zero alterations.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <div className="px-3 py-1 rounded-[2px] bg-[#0A1410] border border-[#0E3B27] text-[11px] text-[#45E08A] flex items-center gap-2 clip-tag-tr">
              <SealIcon size={13} className="text-[#45E08A]" />
              <span>NIST SHA-256 VALIDATED</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#1F2B25]">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7F8D85]" />
              <input
                type="text"
                placeholder="Search file name or SHA-256..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 h-7 pl-7 pr-3 rounded-[2px] bg-[#070908] border border-[#1F2B25] font-mono text-xs text-[#E8F0EB] placeholder:text-[#7F8D85] focus-visible:border-[#45E08A] focus-visible:outline-none"
              />
            </div>

            <div className="flex items-center rounded-[2px] border border-[#1F2B25] bg-[#070908] p-0.5 font-mono">
              {(['ALL', 'IMAGES', 'DOCS', 'VIDEO'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFilterFormat(fmt)}
                  className={`px-2.5 py-0.5 text-[10px] rounded-[2px] font-medium transition-colors cursor-pointer ${
                    filterFormat === fmt
                      ? 'bg-[#121A16] text-[#45E08A] border border-[#1F2B25]'
                      : 'text-[#7F8D85] hover:text-[#E8F0EB]'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-mono text-[#7F8D85] flex items-center gap-2">
            <RegistrationMark size={10} className="text-[#45E08A]" />
            <span>Showing <strong className="text-[#E8F0EB] font-bold">{filteredEvidence.length}</strong> Preserved Items</span>
          </div>
        </div>

        {/* Asymmetric Grid of Evidence Cards */}
        {filteredEvidence.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEvidence.map((item) => {
              const isRecent = recentUploadedEvidenceIds.includes(item.id);
              return (
                <EvidenceCard
                  key={item.id}
                  item={item}
                  isRecent={isRecent}
                  onClick={() => {
                    setSelectedEvidence(item);
                    if (isRecent) clearRecentUploads();
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-[2px] border border-[#1F2B25] bg-[#0D1210] space-y-3 font-mono">
            <p className="text-xs text-[#7F8D85]">No evidence artifacts match the selected criteria.</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setFilterFormat('ALL');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Slide-in Detail Drawer */}
      <EvidenceDetailDrawer
        item={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />
    </div>
  );
};
