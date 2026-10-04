import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { TimeSigil } from './TimeSigil';
import { LiveClock } from './LiveClock';
import { Toast } from './Toast';
import { ThemeToggle } from './ThemeToggle';
import { QuickExit } from './QuickExit';
import { Stepper } from './Stepper';
import { useIncidents } from '../context/IncidentContext';
import {
  FolderLock,
  PlusCircle,
  Archive,
  Network,
  FileCheck,
  Settings,
  Shield,
} from 'lucide-react';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const { activeIncidentId, incidents } = useIncidents();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const activeId = activeIncidentId || incidents[0]?.id || 'CV-002';

  // Extract page title & subtitle based on current route
  const getHeaderInfo = () => {
    const path = location.pathname;
    if (path === '/chronicle') {
      return {
        title: 'Chronicle Dashboard',
        subtitle: 'Summary of preserved cases and cryptographic records.',
        step: 1,
      };
    }
    if (path === '/incident/new') {
      return {
        title: 'New Incident Intake',
        subtitle: 'Guided preservation wizard. You can stop and resume at any moment.',
        step: 2,
      };
    }
    if (path === '/archive') {
      return {
        title: 'Time Archive Vault',
        subtitle: `Case ${activeId} · Local evidence sealed with NIST SHA-256 signatures.`,
        step: 3,
      };
    }
    if (path.startsWith('/trace')) {
      return {
        title: 'Correlation Trace',
        subtitle: `Case ${activeId} · Interactive timeline and heuristic telemetry.`,
        step: 5,
      };
    }
    if (path.startsWith('/report')) {
      return {
        title: 'Attestation Report',
        subtitle: `Case ${activeId} · Section 63 (BSA 2023) certified complaint package.`,
        step: 6,
      };
    }
    return {
      title: 'CHRONOVAULT',
      subtitle: 'Digital evidence preservation.',
      step: 1,
    };
  };

  const headerInfo = getHeaderInfo();

  const navItems = [
    {
      name: 'Chronicle',
      path: '/chronicle',
      icon: <FolderLock size={20} strokeWidth={1.5} />,
    },
    {
      name: 'New Incident',
      path: '/incident/new',
      icon: <PlusCircle size={20} strokeWidth={1.5} />,
    },
    {
      name: 'Time Archive',
      path: '/archive',
      icon: <Archive size={20} strokeWidth={1.5} />,
    },
    {
      name: 'Correlation Trace',
      path: `/trace/${activeId}`,
      icon: <Network size={20} strokeWidth={1.5} />,
    },
    {
      name: 'Attestation Report',
      path: `/report/${activeId}`,
      icon: <FileCheck size={20} strokeWidth={1.5} />,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col md:flex-row">
      {/* 72px LEFT RAIL (Desktop) / Bottom Nav (Mobile) */}
      <aside
        className="w-full md:w-[72px] md:h-screen md:sticky md:top-0 bg-[var(--panel)] border-b md:border-b-0 md:border-r border-[var(--hair)] flex md:flex-col justify-between items-center px-4 py-3 md:py-6 z-40 shrink-0"
        aria-label="Sidebar Navigation"
      >
        <div className="flex md:flex-col items-center gap-6 md:gap-8 w-full">
          {/* Logo Mark */}
          <Link
            to="/"
            className="flex items-center justify-center p-1 rounded-[var(--radius-xs)] text-[var(--accent)] hover:scale-105 transition-transform"
            title="CHRONOVAULT Home"
            aria-label="CHRONOVAULT Home"
          >
            <TimeSigil size={32} speed="slow" showClock={false} />
          </Link>

          {/* Navigation Items */}
          <nav className="flex md:flex-col items-center gap-2 md:gap-3 w-full justify-around md:justify-start">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path.startsWith('/trace') && location.pathname.startsWith('/trace')) ||
                (item.path.startsWith('/report') && location.pathname.startsWith('/report'));

              return (
                <div key={item.name} className="relative group flex items-center justify-center">
                  <NavLink
                    to={item.path}
                    className={`flex items-center justify-center w-11 h-11 min-h-[44px] min-w-[44px] rounded-[var(--radius-sm)] transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[var(--raised)] text-[var(--accent)] border border-[var(--accent)]/40 shadow-[0_0_12px_var(--accent-glow)]'
                        : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--raised)]'
                    }`}
                    aria-label={item.name}
                  >
                    {item.icon}
                  </NavLink>
                  {/* Tooltip on Desktop */}
                  <div className="hidden md:block absolute left-[56px] px-2.5 py-1 bg-[var(--raised)] border border-[var(--hair)] rounded-[var(--radius-xs)] text-[12px] font-medium text-[var(--text)] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                    {item.name}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Rail Bottom Actions */}
        <div className="flex md:flex-col items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center justify-center w-10 h-10 min-h-[44px] min-w-[44px] rounded-[var(--radius-sm)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--raised)] transition-colors cursor-pointer"
            title="System & Security Settings"
            aria-label="Settings"
          >
            <Settings size={18} strokeWidth={1.5} />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Topbar */}
        <header className="px-6 sm:px-10 py-5 border-b border-[var(--hair)] bg-[var(--bg)]/80 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl sm:text-3xl font-light text-[var(--text)]">
                {headerInfo.title}
              </span>
              <span className="font-mono text-[11px] text-[var(--accent)] px-2 py-0.5 rounded-[var(--radius-xs)] border border-[var(--hair)] bg-[var(--panel)]">
                {activeId}
              </span>
            </div>
            <p className="text-[13px] text-[var(--muted)] mt-0.5">
              {headerInfo.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-[12px] text-[var(--muted)] font-mono">
              <Shield size={14} className="text-[var(--accent)]" />
              <span>Isolated Vault</span>
            </div>

            <QuickExit />
            <LiveClock className="font-mono text-[13px] text-[var(--accent)] tabular-nums" />
          </div>
        </header>

        {/* Persistent Case Progress Stepper */}
        <Stepper currentStep={headerInfo.step} caseId={activeId} />

        {/* Dynamic Route View */}
        <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          <Outlet />
        </main>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md bg-[var(--panel)] border border-[var(--hair)] rounded-[var(--radius-sm)] p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--hair)] pb-4">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-[var(--accent)]" />
                <h3 className="font-display text-lg font-light text-[var(--text)]">
                  SECURITY & CRYPTO ENGINE
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="text-[13px] text-[var(--muted)] hover:text-[var(--text)] cursor-pointer p-1"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 font-mono text-[12px] text-[var(--text-secondary)]">
              <div className="p-3 bg-[var(--bg)] rounded border border-[var(--hair)] flex justify-between items-center">
                <span>Hashing Engine</span>
                <span className="text-[var(--accent)] font-semibold">WebCrypto SHA-256</span>
              </div>
              <div className="p-3 bg-[var(--bg)] rounded border border-[var(--hair)] flex justify-between items-center">
                <span>Client Isolation</span>
                <span className="text-[var(--accent)] font-semibold">100% In-Browser</span>
              </div>
              <div className="p-3 bg-[var(--bg)] rounded border border-[var(--hair)] flex justify-between items-center">
                <span>Clock Sync</span>
                <span className="text-[var(--accent)] font-semibold">UTC (Atomic Timestamp)</span>
              </div>
              <div className="p-3 bg-[var(--bg)] rounded border border-[var(--hair)] flex justify-between items-center">
                <span>Statutory Compliance</span>
                <span className="text-[var(--accent)] font-semibold">Section 63 (BSA 2023)</span>
              </div>
            </div>

            <p className="text-[12px] text-[var(--muted)] leading-relaxed">
              CHRONOVAULT operates purely client-side without storing user media on external servers.
              All certificates and hash trees are compiled strictly on this local machine.
            </p>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="w-full py-2.5 bg-[var(--raised)] border border-[var(--hair)] hover:border-[var(--muted)] rounded-[var(--radius-sm)] text-[13px] text-[var(--text)] font-medium cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Global Toast */}
      <Toast />
    </div>
  );
};
