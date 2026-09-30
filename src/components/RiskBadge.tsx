import React from 'react';
import type { RiskLevel } from '../types';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  showScore?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score, showScore = false }) => {
  const configs = {
    HIGH: {
      border: 'border-[#421D22]',
      bg: 'bg-[#181112]',
      text: 'text-[#FF5C67]',
      tagBg: 'bg-[#FF5C67]/10',
      label: 'HIGH RISK',
      stamp: 'STAMP: HAZARD',
      icon: <ShieldAlert size={12} strokeWidth={1.5} />,
    },
    MEDIUM: {
      border: 'border-[#4A3B18]',
      bg: 'bg-[#18150F]',
      text: 'text-[#F5B942]',
      tagBg: 'bg-[#F5B942]/10',
      label: 'ELEVATED',
      stamp: 'STAMP: CAUTION',
      icon: <AlertTriangle size={12} strokeWidth={1.5} />,
    },
    LOW: {
      border: 'border-[#0E3B27]',
      bg: 'bg-[#0A1410]',
      text: 'text-[#45E08A]',
      tagBg: 'bg-[#45E08A]/10',
      label: 'NOMINAL',
      stamp: 'STAMP: SECURE',
      icon: <ShieldCheck size={12} strokeWidth={1.5} />,
    },
  };

  const current = configs[level] || configs.LOW;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] border ${current.border} ${current.bg} ${current.text} font-mono text-[10px] uppercase font-semibold tracking-wider select-none clip-tag-tr`}
    >
      <span className="shrink-0">{current.icon}</span>
      <span>{current.label}</span>
      {showScore && score !== undefined && (
        <span className="opacity-90 font-mono tabular-nums">[{score}]</span>
      )}
    </span>
  );
};

interface StatusBadgeProps {
  status: 'verified' | 'pending' | 'flagged' | 'secure' | 'locked';
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = 'verified',
  label,
  size = 'sm',
}) => {
  if (status === 'verified' || status === 'locked') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] border border-[#0E3B27] bg-[#0A1410] text-[#45E08A] ${
          size === 'sm' ? 'text-[10px]' : 'text-[11px]'
        } font-mono font-medium tracking-wide uppercase select-none clip-tag-tr`}
      >
        {/* Closed Time Sigil mini ring indicator */}
        <span className="relative flex items-center justify-center w-2.5 h-2.5">
          <span className="absolute w-2.5 h-2.5 rounded-full border border-[#45E08A]" />
          <span className="w-1 h-1 rounded-full bg-[#45E08A]" />
        </span>
        <span>{label || 'TIME SEALED'}</span>
      </span>
    );
  }

  if (status === 'pending') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] border border-[#4A3B18] bg-[#14120C] text-[#F5B942] ${
          size === 'sm' ? 'text-[10px]' : 'text-[11px]'
        } font-mono font-medium tracking-wide uppercase select-none`}
      >
        {/* Broken arc / open ring for unverified */}
        <span className="relative flex items-center justify-center w-2.5 h-2.5">
          <span className="w-2.5 h-2.5 rounded-full border border-dashed border-[#F5B942]" />
        </span>
        <span>{label || 'UNBOUND'}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] border border-[#1F2B25] bg-[#0D1210] text-[#7F8D85] text-[10px] font-mono tracking-wide uppercase select-none">
      <span className="w-1 h-1 rounded-full bg-[#45E08A]" />
      <span>{label || status}</span>
    </span>
  );
};
