import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidents } from '../context/IncidentContext';
import { TimeSigil } from '../components/TimeSigil';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Search, Plus, ArrowRight, ShieldCheck } from 'lucide-react';

export const ChroniclePage: React.FC = () => {
  const navigate = useNavigate();
  const { incidents, recentCreatedIncidentId, setActiveIncidentId } = useIncidents();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const totalEvidenceCount = incidents.reduce(
    (acc, inc) => acc + inc.evidenceItems.length,
    0
  );
  const activeCasesCount = incidents.length;
  const reportsCount = incidents.filter((i) => i.timeline.some((t) => t.type === 'report')).length || 2;

  const handleCaseClick = (id: string) => {
    setActiveIncidentId(id);
    navigate(`/trace/${id}`);
  };

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.accountHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.platform.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === 'ALL' ||
      (selectedFilter === 'HIGH' && inc.riskLevel === 'HIGH') ||
      inc.type === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-10">
      {/* Top Header Figures with Bezel Divider */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-wider">
              Chronicle Overview
            </div>
            <p className="text-[14px] text-[var(--muted)] mt-0.5">
              Immutable ledger of cataloged cases and client-side cryptographic seals.
            </p>
          </div>

          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => navigate('/incident/new')}
          >
            Start new case
          </Button>
        </div>

        {/* Three Plain Figures separated by watch bezel dividers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border-y border-[var(--hair)] py-6 divide-y sm:divide-y-0 sm:divide-x divide-[var(--hair)] bezel-divider">
          <div className="sm:pr-8 py-3 sm:py-0">
            <div className="font-display text-4xl sm:text-5xl font-light text-[var(--text)] tabular-nums leading-none">
              0{activeCasesCount}
            </div>
            <div className="text-[13px] text-[var(--muted)] mt-2 font-mono uppercase tracking-wider">
              Recorded Cases
            </div>
          </div>

          <div className="sm:px-8 py-3 sm:py-0">
            <div className="font-display text-4xl sm:text-5xl font-light text-[var(--accent)] tabular-nums leading-none">
              {totalEvidenceCount.toString().padStart(2, '0')}
            </div>
            <div className="text-[13px] text-[var(--muted)] mt-2 font-mono uppercase tracking-wider">
              Preserved Artifacts
            </div>
          </div>

          <div className="sm:pl-8 py-3 sm:py-0">
            <div className="font-display text-4xl sm:text-5xl font-light text-[var(--text)] tabular-nums leading-none">
              0{reportsCount}
            </div>
            <div className="text-[13px] text-[var(--muted)] mt-2 font-mono uppercase tracking-wider">
              Attested Dossiers
            </div>
          </div>
        </div>
      </div>

      {/* Case Ledger Section */}
      <div className="space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search by case ID, handle, or platform..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[var(--panel)] border border-[var(--hair)] rounded-[var(--radius-sm)] text-[14px] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'All Cases' },
              { id: 'HIGH', label: 'High Severity' },
              { id: 'Impersonation', label: 'Impersonation' },
              { id: 'Deepfake or manipulation', label: 'Deepfakes' },
              { id: 'Image misuse', label: 'Image Misuse' },
            ].map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-3 py-1.5 rounded-[var(--radius-xs)] text-[12px] font-mono transition-colors cursor-pointer border ${
                  selectedFilter === filter.id
                    ? 'bg-[var(--raised)] text-[var(--accent)] border-[var(--accent)]/50 shadow-[0_0_8px_var(--accent-glow)]'
                    : 'bg-[var(--panel)] text-[var(--muted)] border-[var(--hair)] hover:text-[var(--text)]'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Case Cards Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredIncidents.map((incident) => {
            const isNew = recentCreatedIncidentId === incident.id;
            const isHigh = incident.riskLevel === 'HIGH';
            const isMed = incident.riskLevel === 'MEDIUM';

            return (
              <div
                key={incident.id}
                onClick={() => handleCaseClick(incident.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCaseClick(incident.id)}
                tabIndex={0}
                role="button"
                className={`temporal-card p-5 cursor-pointer relative group flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isNew ? 'temporal-card-active' : ''
                }`}
              >
                {/* Subtle indicator bar */}
                {isNew && (
                  <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-[var(--accent)] rounded-r" />
                )}

                {/* Left: Case ID & Classification */}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[13px] text-[var(--accent)] font-semibold">
                      {incident.id}
                    </span>
                    <Badge variant={isHigh ? 'danger' : isMed ? 'gold' : 'emerald'} dot>
                      {incident.riskLevel} SEVERITY ({incident.riskScore}/100)
                    </Badge>
                  </div>

                  <h3 className="text-[16px] font-medium text-[var(--text)] group-hover:text-[var(--accent-bright)] transition-colors">
                    {incident.type} on {incident.platform}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-[13px] text-[var(--muted)]">
                    <span className="font-mono text-[var(--text-secondary)]">{incident.accountHandle}</span>
                    <span>·</span>
                    <span className="truncate max-w-xs">{incident.contentUrl}</span>
                  </div>
                </div>

                {/* Middle: Evidence & Timing Telemetry */}
                <div className="flex flex-wrap md:flex-col items-start md:items-end justify-between md:justify-center gap-2 font-mono text-[12px] text-[var(--muted)] shrink-0">
                  <div className="flex items-center gap-1.5 text-[var(--text)]">
                    <ShieldCheck size={14} className="text-[var(--accent)]" />
                    <span>{incident.evidenceItems.length} Artifacts Sealed</span>
                  </div>
                  <div>
                    Last activity: <span className="text-[var(--text-secondary)]">{incident.relativeTime}</span>
                  </div>
                </div>

                {/* Right: Navigate Icon */}
                <div className="flex items-center justify-end">
                  <div className="w-8 h-8 rounded-[var(--radius-xs)] bg-[var(--bg)] border border-[var(--hair)] flex items-center justify-center text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)] transition-all">
                    <ArrowRight size={15} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Calm Empty State */}
          {filteredIncidents.length === 0 && (
            <div className="bg-[var(--panel)] border border-[var(--hair)] rounded-[var(--radius-sm)] p-12 flex flex-col items-center justify-center text-center space-y-4">
              <TimeSigil size={64} speed="slow" showClock={false} />
              <div className="space-y-1">
                <h3 className="font-display text-lg font-light text-[var(--text)]">
                  NO INCIDENTS MATCH CRITERIA
                </h3>
                <p className="text-[13px] text-[var(--muted)] max-w-sm">
                  Try clearing your search filters or start a new case to initialize the cryptographic record.
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => { setSearchQuery(''); setSelectedFilter('ALL'); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
