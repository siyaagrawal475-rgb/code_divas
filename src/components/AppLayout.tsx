import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { TimeSigil } from './TimeSigil';
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
        subtitle: `Case ${activeId} · Reconstruct what happened.`,
      };
    }
    if (path.startsWith('/report')) {
      return {
        title: 'Report',
        subtitle: `Case ${activeId} · The incident, in order.`,
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
    <div className="app">
      {/* 72px Left Rail */}
      <aside className="rail">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', width: '100%' }}>
          <Link to="/" className="rail-logo" title="HERTRACE Home">
            <TimeSigil size={32} showClock={false} />
          </Link>

          {/* Icon-only Navigation with Tooltips */}
          <nav className="rail-nav">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path.startsWith('/trace') && location.pathname.startsWith('/trace')) ||
                (item.path.startsWith('/report') && location.pathname.startsWith('/report'));

              return (
                <div key={item.name} className="rail-item-wrapper" style={{ position: 'relative', width: '100%' }}>
                  <NavLink
                    to={item.path}
                    className={`rail-item ${isActive ? 'active' : ''}`}
                  >
                    {item.icon}
                  </NavLink>
                  <div className="rail-tooltip">
                    {item.name}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Settings Button */}
        <div className="rail-item-wrapper" style={{ position: 'relative', width: '100%' }}>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="rail-item"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
          <div className="rail-tooltip">
            Settings
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="content">
        {/* Topbar: Title/subtitle on left, Secure session + live UTC clock on right */}
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="topbar-title">{headerInfo.title}</h1>
            <p className="topbar-subtitle">{headerInfo.subtitle}</p>
          </div>

          <div className="topbar-right">
            <div className="secure">
              <i />
              <span>Secure session</span>
            </div>
            <LiveClock className="topbar-clock" />
          </div>
        </header>

        {/* View content */}
        <Outlet />
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ width: '100%', maxWidth: '440px', background: 'var(--panel)', border: '1px solid var(--hair)', borderRadius: '2px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--hair)', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, font: "300 20px 'Fraunces', serif", color: 'var(--text)' }}>Settings</h3>
              <button onClick={() => setIsSettingsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '13px' }}>
                Close
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--muted)', fontFamily: '"JetBrains Mono", monospace' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--hair)' }}>
                <span>Cryptographic engine</span>
                <span style={{ color: 'var(--green)' }}>WebCrypto SHA-256</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--hair)' }}>
                <span>Local storage isolation</span>
                <span style={{ color: 'var(--green)' }}>Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Clock synchronization</span>
                <span style={{ color: 'var(--soft)' }}>UTC</span>
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
