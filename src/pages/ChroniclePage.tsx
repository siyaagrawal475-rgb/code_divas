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
            Summary of active preserved records
          </span>
          <button
            className="btn"
            onClick={() => navigate('/incident/new')}
          >
            Create new incident
          </button>
        </div>

        {/* Three Plain Figures separated by hairlines, NOT in boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border-y border-[var(--hair)] py-6 divide-y sm:divide-y-0 sm:divide-x divide-[var(--hair)]">
          <div className="sm:pr-8 py-3 sm:py-0">
            <div className="font-display text-4xl sm:text-5xl font-light text-[var(--text)] tabular-nums leading-none">
              {activeCasesCount}
            </div>
            <div className="text-[13px] text-[var(--muted)] mt-2">
              Active cases
            </div>
          </div>

          <div className="sm:px-8 py-3 sm:py-0">
            <div className="font-display text-4xl sm:text-5xl font-light text-[var(--green)] tabular-nums leading-none">
              {totalEvidenceCount}
            </div>
            <div className="text-[13px] text-[var(--muted)] mt-2">
              Evidence items
            </div>
          </div>

          <div className="sm:pl-8 py-3 sm:py-0">
            <div className="font-display text-4xl sm:text-5xl font-light text-[var(--text)] tabular-nums leading-none">
              {reportsCount}
            </div>
            <div className="text-[13px] text-[var(--muted)] mt-2">
              Reports generated
            </div>
          </div>
        </div>
      </div>

      {/* The Case Ledger: Ruled Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-light text-[var(--text)]">
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
                <th className="py-3 pr-4 font-normal">Case ID</th>
                <th className="py-3 px-4 font-normal">Type</th>
                <th className="py-3 px-4 font-normal">Platform</th>
                <th className="py-3 px-4 font-normal">Found</th>
                <th className="py-3 px-4 font-normal">Risk</th>
                <th className="py-3 pl-4 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--hair)] text-[14px]">
              {incidents.map((incident) => {
                const isNew = recentCreatedIncidentId === incident.id;
                const isHigh = incident.riskLevel === 'HIGH';

                return (
                  <tr
                    key={incident.id}
                    onClick={() => handleRowClick(incident.id)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleRowClick(incident.id)}
                    className={`group cursor-pointer hover:bg-[var(--panel)] transition-colors relative ${
                      isNew ? 'bg-[#0E3B27]/20' : ''
                    }`}
                  >
                    {/* One-time green left-edge flash if newly created */}
                    <td className="py-4 pr-4 font-mono text-[13px] text-[var(--text)] relative">
                      {isNew && (
                        <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--green)] animate-pulse" />
                      )}
                      <span className="group-hover:text-[var(--soft)] transition-colors">
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
                        {/* Square risk marker: high red, medium amber */}
                        <span
                          className={`w-2 h-2 rounded-[1px] ${
                            isHigh ? 'bg-[#FF5C67]' : 'bg-[#F5B942]'
                          }`}
                        />
                        <span className="text-[13px] text-[var(--text)]">
                          {isHigh ? 'High' : 'Medium'}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 pl-4 text-right">
                      <span className="text-[13px] text-[var(--muted)] group-hover:text-[var(--soft)] transition-colors">
                        View trace
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
