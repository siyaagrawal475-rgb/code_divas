import React from 'react';
import { AlertCircle, AlertTriangle, Info, X, Check } from 'lucide-react';
import { useIncidents } from '../context/IncidentContext';

export const Toast: React.FC = () => {
  const { toastMessage, showToast } = useIncidents();

  if (!toastMessage) return null;

  const getToastColors = (type: string) => {
    switch (type) {
      case 'success':
        return {
          icon: <Check size={14} className="text-[var(--accent-text)]" />,
          border: 'var(--accent-text)',
        };
      case 'warn':
        return {
          icon: <AlertTriangle size={14} className="text-[var(--warn)]" />,
          border: 'var(--warn)',
        };
      case 'danger':
        return {
          icon: <AlertCircle size={14} className="text-[var(--danger)]" />,
          border: 'var(--danger)',
        };
      default:
        return {
          icon: <Info size={14} className="text-[var(--muted)]" />,
          border: 'var(--hair)',
        };
    }
  };

  const styleConfig = getToastColors(toastMessage.type);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div
        className="flex items-center gap-3 px-4 py-3 bg-[var(--panel)] border shadow-xl select-none min-w-[280px] max-w-md text-[13px]"
        style={{ borderColor: styleConfig.border, borderRadius: '2px' }}
      >
        <span className="shrink-0">{styleConfig.icon}</span>
        <span className="text-[var(--text)] font-medium flex-1">{toastMessage.text}</span>
        <button
          type="button"
          onClick={() => showToast('', 'info')}
          className="text-[var(--muted)] hover:text-[var(--text)] cursor-pointer p-0.5"
          aria-label="Close notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
