import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useIncidents } from '../context/IncidentContext';
import { useNavigate } from 'react-router-dom';
import { RegistrationMark } from './CustomIcons';

interface TopBarProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
}) => {
  const { incidents, activeIncidentId, setActiveIncidentId } = useIncidents();
  const navigate = useNavigate();

  return (
    <header className="h-14 shrink-0 bg-[#0D1210] border-b border-[#1F2B25] px-6 flex items-center justify-between select-none relative z-10">
      {/* Left title and breadcrumb info */}
      <div className="flex items-center gap-4 min-w-0">
        <RegistrationMark size={11} className="text-[#45E08A] shrink-0" />

        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-1.5 text-xs font-mono">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={11} className="text-[#7F8D85]" />}
                {b.href ? (
                  <button
                    onClick={() => navigate(b.href!)}
                    className="text-[#7F8D85] hover:text-[#E8F0EB] transition-colors"
                  >
                    {b.label}
                  </button>
                ) : (
                  <span className="text-[#E8F0EB] font-medium tracking-wide">{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        ) : (
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-base font-semibold text-[#E8F0EB] tracking-wide">
                {title}
              </h1>
              {subtitle && (
                <>
                  <span className="text-[#1F2B25] text-xs font-mono">/</span>
                  <p className="text-xs text-[#7F8D85] hidden md:inline font-mono">{subtitle}</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right status indicator and incident switcher */}
      <div className="flex items-center gap-3">
        {/* Quick incident picker if more than 1 */}
        {incidents.length > 1 && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#7F8D85]">
            <span className="label-tracked text-[9px]">ACTIVE RELIC</span>
            <select
              value={activeIncidentId}
              onChange={(e) => setActiveIncidentId(e.target.value)}
              aria-label="Select active case"
              className="bg-[#070908] border border-[#1F2B25] text-[#E8F0EB] text-xs rounded-[2px] px-2 py-1 font-mono focus-visible:outline-none focus-visible:border-[#45E08A]"
            >
              {incidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.id} — {inc.accountHandle}
                </option>
              ))}
            </select>
          </div>
        )}

        {actions}

        {/* Eye of Agamotto Active Attestation Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[#0A1410] border border-[#0E3B27] text-xs text-[#E8F0EB] font-mono clip-tag-tr">
          <span className="w-1.5 h-1.5 rounded-full bg-[#45E08A] gem-glow-sm animate-pulse" />
          <span className="text-[10px] font-semibold text-[#45E08A] tracking-wider uppercase">
            BOUND IN TIME
          </span>
        </div>
      </div>
    </header>
  );
};
