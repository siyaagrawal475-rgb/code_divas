import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Settings,
  Plus,
  Compass,
} from 'lucide-react';
import {
  EyeIcon,
  SealIcon,
  HourglassIcon,
  LockIcon,
  RegistrationMark,
} from './CustomIcons';
import { useIncidents } from '../context/IncidentContext';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeIncident, incidents } = useIncidents();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const activeId = activeIncident?.id || incidents[0]?.id || 'HT-002';

  const navItems = [
    {
      name: 'Chronicle',
      path: '/chronicle',
      icon: <HourglassIcon size={14} />,
      badge: `${incidents.length}`.padStart(2, '0'),
      desc: 'TEMPORAL LOG',
    },
    {
      name: 'Trace',
      path: `/trace/${activeId}`,
      icon: <Compass size={14} />,
      desc: 'GRAPH RECON',
    },
    {
      name: 'Time Archive',
      path: '/archive',
      icon: <SealIcon size={14} />,
      badge: `${activeIncident?.evidenceItems?.length || 7}`.padStart(2, '0'),
      desc: 'SEALED VAULT',
    },
    {
      name: 'Reports',
      path: `/report/${activeId}`,
      icon: <EyeIcon size={14} />,
      desc: 'ATTESTATION',
    },
  ];

  return (
    <>
      <aside className="w-[230px] shrink-0 min-h-screen bg-[#0D1210] border-r border-[#1F2B25] flex flex-col justify-between select-none relative z-20">
        {/* Top Relic Header */}
        <div>
          <div className="h-14 px-4 flex items-center justify-between border-b border-[#1F2B25] bg-[#0A0E0C]">
            <NavLink
              to="/"
              className="flex items-center gap-2.5 text-[#E8F0EB] hover:text-[#45E08A] transition-colors duration-150 group"
            >
              {/* Eye of Agamotto mini bezel motif */}
              <div className="relative w-6 h-6 rounded-full border border-[#C9A24B] bg-[#070908] flex items-center justify-center group-hover:border-[#45E08A] transition-colors">
                <div className="w-4 h-4 rounded-full border border-[#1F2B25] flex items-center justify-center animate-spin-35s">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#45E08A] gem-glow-sm" />
                </div>
              </div>
              <div>
                <span className="font-display font-semibold tracking-[0.14em] text-sm text-[#E8F0EB] block leading-none">
                  CHRONOVAULT
                </span>
                <span className="text-[9px] font-mono tracking-widest text-[#7F8D85] block mt-0.5">
                  VAULT v1.0
                </span>
              </div>
            </NavLink>

            <span className="w-1.5 h-1.5 rounded-full bg-[#45E08A] gem-glow-sm" title="Eye active · Temporal lock engaged" />
          </div>

          {/* Quick Intake CTA */}
          <div className="p-3">
            <button
              onClick={() => navigate('/incident/new')}
              className="w-full h-8.5 px-3 rounded-[2px] bg-[#121A16] hover:bg-[#18231E] border border-[#1F2B25] hover:border-[#45E08A]/50 text-[#E8F0EB] text-xs font-mono font-medium flex items-center justify-between transition-all duration-150 cursor-pointer group"
            >
              <span className="flex items-center gap-1.5">
                <Plus size={13} className="text-[#45E08A]" />
                <span className="text-[11px] tracking-wider uppercase">Intake Incident</span>
              </span>
              <span className="text-[9px] font-mono text-[#C9A24B] opacity-70 group-hover:opacity-100">
                +ARC
              </span>
            </button>
          </div>

          {/* Navigation group */}
          <div className="px-2 py-1 space-y-3">
            <div className="px-3 flex items-center justify-between text-[10px] text-[#7F8D85] font-mono uppercase tracking-widest">
              <span>Navigation</span>
              <RegistrationMark size={10} className="text-[#1F2B25]" />
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path.startsWith('/trace') && location.pathname.startsWith('/trace')) ||
                  (item.path.startsWith('/report') && location.pathname.startsWith('/report'));

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={`relative flex items-center justify-between px-3 py-2 text-xs transition-all duration-150 rounded-[2px] ${
                      isActive
                        ? 'text-[#E8F0EB] font-medium bg-[#121A16] border border-[#1F2B25]'
                        : 'text-[#7F8D85] hover:text-[#E8F0EB] hover:bg-[#121A16]/50 border border-transparent'
                    }`}
                  >
                    {/* Active green hairline accent */}
                    {isActive && (
                      <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#45E08A]" />
                    )}

                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-[#45E08A]' : 'text-[#7F8D85]'}>
                        {item.icon}
                      </span>
                      <div>
                        <div className="font-mono text-xs">{item.name}</div>
                      </div>
                    </div>

                    {item.badge && (
                      <span className="font-mono text-[10px] text-[#7F8D85] tabular-nums bg-[#070908] px-1.5 py-0.5 rounded-[2px] border border-[#1F2B25]">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Active Case Stamped Ledger Tag */}
          {activeIncident && (
            <div className="mt-4 mx-3 p-3 rounded-[2px] bg-[#070908] border border-[#1F2B25] relative clip-tag-tr">
              <div className="flex items-center justify-between mb-1.5">
                <span className="label-tracked text-[9px] text-[#C9A24B]">BOUND CASE</span>
                <span className="font-mono text-[10px] text-[#45E08A] bg-[#0E3B27] px-1.5 py-0.2 rounded-[2px]">
                  {activeIncident.id}
                </span>
              </div>
              <div className="font-mono text-xs text-[#E8F0EB] truncate font-semibold">
                {activeIncident.accountHandle}
              </div>
              <div className="text-[10px] text-[#7F8D85] truncate mt-1 flex items-center gap-1.5 font-mono">
                <span>{activeIncident.platform}</span>
                <span>/</span>
                <span className="truncate">{activeIncident.type}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-3 border-t border-[#1F2B25] space-y-2 bg-[#0A0E0C]">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#7F8D85] hover:text-[#E8F0EB] hover:bg-[#121A16] rounded-[2px] transition-colors cursor-pointer font-mono"
          >
            <span className="flex items-center gap-2">
              <Settings size={13} strokeWidth={1.5} />
              <span>Vault Protocol</span>
            </span>
            <span className="text-[9px] text-[#C9A24B]">AGAMOTTO</span>
          </button>

          <div className="px-3 py-1 flex items-center justify-between text-[10px] text-[#7F8D85] font-mono border-t border-[#1F2B25]/60 pt-2">
            <span className="flex items-center gap-1.5">
              <LockIcon size={11} className="text-[#45E08A]" />
              <span>IMMUTABLE UTC</span>
            </span>
            <span className="text-[#45E08A]">256-BIT</span>
          </div>
        </div>
      </aside>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0D1210] border border-[#1F2B25] rounded-[2px] p-6 shadow-2xl space-y-4 relative clip-tag-tr">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2B25]">
              <div className="flex items-center gap-2">
                <LockIcon size={16} className="text-[#45E08A]" />
                <h3 className="font-display text-base font-semibold text-[#E8F0EB]">
                  Forensic Vault & Cryptographic Settings
                </h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="font-mono text-xs text-[#7F8D85] hover:text-[#E8F0EB] px-2 py-0.5 rounded-[2px] border border-[#1F2B25]"
              >
                CLOSE
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#070908] border border-[#1F2B25] rounded-[2px] space-y-1">
                <div className="font-mono font-medium text-[#E8F0EB] flex items-center gap-1.5 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#45E08A] gem-glow-sm" />
                  <span>EYE OF AGAMOTTO INTEGRITY SHIELD</span>
                </div>
                <p className="text-[11px] text-[#7F8D85] leading-relaxed">
                  All SHA-256 digests and temporal anchors are sealed in local workstation memory. Zero network telemetry.
                </p>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-[#1F2B25] font-mono text-xs">
                <span className="text-[#E8F0EB]">Temporal Audit Locking</span>
                <span className="text-[#45E08A]">ENABLED</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#1F2B25] font-mono text-xs">
                <span className="text-[#E8F0EB]">Cryptographic Hash Standard</span>
                <span className="text-[#E8F0EB]">NIST FIPS 180-4</span>
              </div>
              <div className="flex items-center justify-between py-2 font-mono text-xs">
                <span className="text-[#E8F0EB]">Bezel Metal Calibration</span>
                <span className="text-[#C9A24B]">#C9A24B GOLD ACCENT</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-1.5 bg-[#45E08A] text-[#070908] font-mono font-semibold text-xs rounded-[2px] cursor-pointer hover:bg-[#9AFFC4] transition-colors"
              >
                ACKNOWLEDGE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
