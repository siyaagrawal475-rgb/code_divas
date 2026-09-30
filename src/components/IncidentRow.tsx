import React from 'react';
import type { Incident } from '../types';
import { RiskBadge } from './RiskBadge';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIncidents } from '../context/IncidentContext';

interface IncidentRowProps {
  incident: Incident;
}

export const IncidentRow: React.FC<IncidentRowProps> = ({ incident }) => {
  const navigate = useNavigate();
  const { setActiveIncidentId } = useIncidents();

  const handleClick = () => {
    setActiveIncidentId(incident.id);
    navigate(`/trace/${incident.id}`);
  };

  // Generate synthetic mini barcode/hash strip
  const hashBits = (parseInt(incident.id.replace(/\D/g, '') || '2', 10) * 8923).toString(2).padStart(12, '0');

  return (
    <tr
      onClick={handleClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
      className="group border-b border-[#1F2B25] hover:bg-[#121A16] focus-visible:bg-[#121A16] transition-colors duration-150 cursor-pointer text-left select-none"
    >
      {/* Case ID with Time Stone dot */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#45E08A] gem-glow-sm" />
          <span className="font-mono text-xs font-semibold text-[#E8F0EB] group-hover:text-[#45E08A] transition-colors">
            {incident.id}
          </span>
        </div>
      </td>

      {/* Target Account & Type */}
      <td className="py-3 px-4">
        <div>
          <div className="font-mono text-xs font-semibold text-[#E8F0EB]">{incident.accountHandle}</div>
          <div className="text-[10px] text-[#7F8D85] font-mono mt-0.5">{incident.type}</div>
        </div>
      </td>

      {/* Platform Stamped Tag */}
      <td className="py-3 px-4">
        <span className="font-mono text-[10px] text-[#E8F0EB] bg-[#070908] px-2 py-0.5 rounded-[2px] border border-[#1F2B25] uppercase tracking-wider">
          {incident.platform}
        </span>
      </td>

      {/* Evidence Count & Barcode strip */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-2 text-xs text-[#7F8D85]">
          <span className="font-mono tabular-nums text-xs font-bold text-[#E8F0EB]">
            {incident.evidenceItems.length.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] font-mono">SEALS</span>
          {/* Mini barcode visual strip */}
          <span className="hidden sm:inline-flex items-center gap-[1px] h-3 px-1 bg-[#070908] border border-[#1F2B25] rounded-[1px]">
            {hashBits.split('').map((bit, idx) => (
              <span
                key={idx}
                className={`inline-block w-[1.5px] h-2 ${
                  bit === '1' ? 'bg-[#45E08A]' : 'bg-[#1F2B25]'
                }`}
              />
            ))}
          </span>
        </div>
      </td>

      {/* Discovered / Preserved Time */}
      <td className="py-3 px-4 font-mono text-[11px] text-[#7F8D85] tabular-nums">
        {incident.relativeTime}
      </td>

      {/* Risk Badge */}
      <td className="py-3 px-4">
        <RiskBadge level={incident.riskLevel} score={incident.riskScore} showScore />
      </td>

      {/* Action link */}
      <td className="py-3 px-4 text-right">
        <span className="inline-flex items-center text-xs text-[#7F8D85] group-hover:text-[#45E08A] transition-colors font-mono">
          <span className="mr-1 text-[10px] font-medium hidden sm:inline uppercase">Trace</span>
          <ChevronRight size={13} />
        </span>
      </td>
    </tr>
  );
};
