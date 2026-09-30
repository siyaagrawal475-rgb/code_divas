import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { TimeSigil } from './TimeSigil';
import { CropMarks } from './CropMarks';
import { LiveClock } from './LiveClock';
import { Toast } from './Toast';
import { useIncidents } from '../context/IncidentContext';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const { activeIncidentId, incidents } = useIncidents();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const activeId = activeIncidentId || incidents[0]?.id || 'HT-002';

  // Extract page title & subtitle based on current route
  const getHeaderInfo = () => {
    const path = location.pathname;
    if (path === '/chronicle') {
      return {
        title: 'Chronicle',
        subtitle: 'Your incidents, preserved in time.',
      };
    }
    if (path === '/incident/new') {
      return {
        title: 'New incident',
        subtitle: 'Preserve evidence before it is lost or altered.',
      };
    }
    if (path === '/archive') {
      return {
        title: 'Time archive',
        subtitle: 'Evidence preserved exactly as submitted.',
      };
    }
    if (path.startsWith('/trace')) {
      return {
        title: 'Trace',
        subtitle: 'Reconstruct what happened.',
      };
    }
    if (path.startsWith('/report')) {
      return {
        title: 'Report',
        subtitle: 'The incident, in order.',
      };
    }
    return {
      title: 'HERTRACE',
      subtitle: 'Digital evidence intelligence.',
    };
  };

  const headerInfo = getHeaderInfo();

  const navItems = [
    {
      name: 'Chronicle',
      path: '/chronicle',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      ),
    },
    {
      name: 'Cases',
      path: `/trace/${activeId}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <path d="M8.5 8.5l7 7" />
          <circle cx="18" cy="6" r="2" />
        </svg>
      ),
    },
    {
      name: 'Evidence archive',
      path: '/archive',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16v4H4z" />
          <path d="M4 8v12h16V8" />
          <line x1="10" y1="12" x2="14" y2="12" />
        </svg>
      ),
    },
    {
      name: 'Reports',
      path: `/report/${activeId}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex relative selection:bg-[var(--green)] selection:text-[var(--bg)]">
      {/* 72px Left Rail */}
      <aside className="w-[72px] shrink-0 min-h-screen bg-[var(--bg)] border-r border-[var(--hair)] flex flex-col justify-between items-center py-5 select-none relative z-30">
        {/* Top Logo: 32px TimeSigil */}
        <div className="flex flex-col items-center gap-6">
          <Link
            to="/"
            className="p-1 rounded-[2px] transition-transform hover:scale-105"
            title="HERTRACE Home"
          >
            <TimeSigil size={32} showClock={false} />
          </Link>

          {/* Icon-only Navigation */}
          <nav className="flex flex-col items-center gap-1 w-full">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path.startsWith('/trace') && location.pathname.startsWith('/trace')) ||
                (item.path.startsWith('/report') && location.pathname.startsWith('/report'));

              return (
                <div key={item.name} className="w-full relative group flex justify-center">
                  <NavLink
                    to={item.path}
                    className={`w-full h-12 flex items-center justify-center transition-colors relative ${
                      isActive
                        ? 'text-[var(--green)]'
                        : 'text-[var(--muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    {/* 2px green bar on left edge for active item (no filled pill) */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-[2px] bg-[var(--green)]" />
                    )}
                    {item.icon}
                  </NavLink>

                  {/* Hover Tooltip */}
                  <div className="absolute left-[76px] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[var(--panel)] text-[var(--text)] text-[12px] font-medium border border-[var(--hair)] rounded-[2px] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-lg">
                    {item.name}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Settings Trigger */}
        <div className="w-full relative group flex justify-center">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full h-12 flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
            aria-label="Settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
          <div className="absolute left-[76px] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[var(--panel)] text-[var(--text)] text-[12px] font-medium border border-[var(--hair)] rounded-[2px] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-lg">
            Settings
          </div>
        </div>
      </aside>

      {/* Main Content Area with Top Bar */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
        <CropMarks />

        {/* Top Bar */}
        <header className="h-[76px] px-8 md:px-12 border-b border-[var(--hair)] flex items-center justify-between z-20">
          <div>
            <h1 className="font-display text-2xl font-light text-[var(--text)] tracking-wide">
              {headerInfo.title}
            </h1>
            <p className="text-[13px] text-[var(--muted)] mt-0.5">
              {headerInfo.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="secure">
              <i />
              <span>Secure session</span>
            </div>
            <LiveClock />
          </div>
        </header>

        {/* Page View Container (max-width 1200px) */}
        <main className="flex-1 p-8 md:p-12 max-w-[1200px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--panel)] border border-[var(--hair)] rounded-[2px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--hair)]">
              <h3 className="font-display text-lg font-light text-[var(--text)]">
                Forensic session settings
              </h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-[13px] text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="space-y-3 text-[13px] text-[var(--muted)] font-mono">
              <div className="flex justify-between py-1 border-b border-[var(--hair)]">
                <span>Cryptographic engine</span>
                <span className="text-[var(--green)]">WebCrypto SHA-256</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--hair)]">
                <span>Local storage isolation</span>
                <span className="text-[var(--green)]">Active</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Time synchronization</span>
                <span className="text-[var(--soft)]">UTC</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast Notifications */}
      <Toast />
    </div>
  );
};
