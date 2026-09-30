import React from 'react';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useIncidents } from '../context/IncidentContext';
import { SealIcon } from './CustomIcons';

export const Toast: React.FC = () => {
  const { toastMessage, showToast } = useIncidents();

  if (!toastMessage) return null;

  const icons = {
    success: <SealIcon size={15} strokeWidth={1.5} className="text-[#45E08A]" />,
    warn: <AlertTriangle size={15} strokeWidth={1.5} className="text-[#F5B942]" />,
    danger: <AlertCircle size={15} strokeWidth={1.5} className="text-[#FF5C67]" />,
    info: <Info size={15} strokeWidth={1.5} className="text-[#7F8D85]" />,
  };

  const borders = {
    success: 'border-[#0E3B27] bg-[#0A1410] text-[#45E08A]',
    warn: 'border-[#4A3B18] bg-[#14120C] text-[#F5B942]',
    danger: 'border-[#421D22] bg-[#181112] text-[#FF5C67]',
    info: 'border-[#1F2B25] bg-[#0D1210] text-[#7F8D85]',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-2.5 rounded-[2px] border shadow-2xl ${borders[toastMessage.type]} select-none min-w-[280px] max-w-md font-mono clip-tag-tr`}
      >
        <span className="shrink-0">{icons[toastMessage.type]}</span>
        <span className="text-xs text-[#E8F0EB] font-medium flex-1">{toastMessage.text}</span>
        <button
          onClick={() => showToast('', 'info')}
          className="text-[#7F8D85] hover:text-[#E8F0EB] cursor-pointer p-0.5"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
};
