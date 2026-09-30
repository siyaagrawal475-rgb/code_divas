// Screen 2: Chronicle
// Memorable element: The case ledger.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidents } from '../context/IncidentContext';

export const ChroniclePage: React.FC = () => {
  const navigate = useNavigate();
  const { incidents, recentCreatedIncidentId } = useIncidents();

  const totalEvidenceCount = incidents.reduce(
    (acc, inc) => acc + inc.evidenceItems.length,
    0
  );
  const activeCasesCount = incidents.length;
  const reportsCount = 2;

  const handleRowClick = (id: string) => {
    navigate(`/trace/${id}`);
  };

  return (
    <div className="space-y-12">
      {/* Top Header Action & Figures */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-[var(--muted)]">
            Summary of preserved records
          </span>
          <button
            type="button"
            className="app-btn"
            onClick={() => navigate('/incident/new')}
          >
            Preserve incident
          </button>
        </div>

        {/* Three Plain Figures separated by hairlines */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border-y border-[var(--hair)] py-6 divide-y sm:divide-y-0 sm:divide-x divide-[var(--hair)]">
          <div className="sm:pr-8 py-3 sm:py-0">
            <div className="font-display text-4xl sm:text-5xl font-light text-[var(--text)] tabular-nums leading-none">
              {activeCasesCount}
            </div>
            <div className="text-[13px] text-[var(--muted)] mt-2">
              Recorded cases
            </div>
          </div>

          <div className="sm:px-8 py-3 sm:py-0">
            <div className="font-display text-4xl sm:text-5xl font-light text-[var(--accent-text)] tabular-nums leading-none">
              {totalEvidenceCount}
            </div>
            <div className="text-[13px] text-[var(--muted)] mt-2">
              Preserved items
            </div>
          </div>

          <div className="sm:pl-8 py-3 sm:py-0">
            <div className="font-display text-4xl sm:text-5xl font-light text-[var(--text)] tabular-nums leading-none">
              {reportsCount}
            </div>
            <div className="text-[13px] text-[var(--muted)] mt-2">
              Attested reports
            </div>
          </div>
        </div>
      </div>

      {/* The Case Ledger: Ruled Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="heading-2">
            Recent incidents
          </h2>
          <span className="text-[13px] text-[var(--muted)] font-mono">
            {incidents.length} recorded
          </span>
        </div>

        <div className="border-t border-[var(--hair)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--hair)] text-[13px] text-[var(--muted)] font-normal">
                <th className="py-3 pr-4 font-normal">Case</th>
                <th className="py-3 px-4 font-normal">Classification</th>
                <th className="py-3 px-4 font-normal">Platform</th>
                <th className="py-3 px-4 font-normal">Recorded</th>
                <th className="py-3 px-4 font-normal">Severity</th>
                <th className="py-3 pl-4 font-normal text-right">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--hair)] text-[14px]">
              {incidents.map((incident) => {
                const isNew = recentCreatedIncidentId === incident.id;
                const isHigh = incident.riskLevel === 'HIGH';
                const isMed = incident.riskLevel === 'MEDIUM';

                return (
                  <tr
                    key={incident.id}
                    onClick={() => handleRowClick(incident.id)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleRowClick(incident.id)}
                    className={`group cursor-pointer hover:bg-[var(--panel)] transition-colors relative ${
                      isNew ? 'bg-[var(--raised)]' : ''
                    }`}
                  >
                    {/* Case ID with subtle indicator */}
                    <td className="py-4 pr-4 font-mono text-[13px] text-[var(--text)] relative">
                      {isNew && (
                        <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent-text)]" />
                      )}
                      <span className="group-hover:text-[var(--accent-text)] transition-colors">
                        {incident.id}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-[var(--text)]">
                      <div>{incident.type}</div>
                      <div className="text-[12px] text-[var(--muted)] font-mono mt-0.5">
                        {incident.accountHandle}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-[var(--muted)]">
                      {incident.platform}
                    </td>

                    <td className="py-4 px-4 text-[var(--muted)] text-[13px]">
                      {incident.relativeTime}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {/* 2px square risk marker */}
                        <span
                          className="w-2 h-2 rounded-[1px] shrink-0"
                          style={{
                            backgroundColor: isHigh
                              ? 'var(--danger)'
                              : isMed
                              ? 'var(--warn)'
                              : 'var(--accent-text)',
                          }}
                        />
                        <span className="text-[13px] text-[var(--text)]">
                          {isHigh ? 'High' : isMed ? 'Medium' : 'Low'}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 pl-4 text-right font-mono text-[13px] text-[var(--muted)] tabular-nums">
                      {incident.evidenceItems.length} items
                    </td>
                  </tr>
                );
              })}

              {incidents.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[var(--muted)] text-[14px]">
                    No incidents recorded yet. Drop a screenshot or file to start the record.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
