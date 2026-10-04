import React from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type { RiskLevel } from '../types';

interface RiskFactor {
  id: string;
  label: string;
  detail: string;
  found: boolean;
}

interface RiskMeterProps {
  score: number; // 0 to 100
  level: RiskLevel;
  confidence?: number; // e.g. 78
  factors?: RiskFactor[];
  headline?: string;
  summary?: string;
  className?: string;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({
  score,
  level,
  confidence = 78,
  factors = [],
  headline = 'Possible manipulation detected',
  summary = 'Supporting analysis indicates high structural overlap in imagery with recent registration patterns.',
  className = '',
}) => {
  const isHigh = level === 'HIGH';
  const isMed = level === 'MEDIUM';

  const getColor = () => {
    if (isHigh) return 'var(--danger)';
    if (isMed) return 'var(--warn)';
    return 'var(--accent)';
  };

  return (
    <div className={`bg-[var(--panel)] border border-[var(--hair)] rounded-[var(--radius-sm)] p-5 space-y-5 ${className}`}>
      {/* Header with Hedged AI statement */}
      <div className="flex items-start justify-between gap-4 border-b border-[var(--hair)] pb-4">
        <div>
          <div className="text-[11px] font-mono text-[var(--muted)] uppercase tracking-wider">
            Automated Heuristic Assessment
          </div>
          <h3 className="text-[16px] font-medium text-[var(--text)] mt-1">
            {headline}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-mono text-[var(--muted)] uppercase">Confidence</div>
          <div className="font-mono text-2xl font-light text-[var(--accent)] tabular-nums">
            {confidence}%
          </div>
        </div>
      </div>

      {/* Probabilistic Confidence Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[12px]">
          <span className="text-[var(--text-secondary)]">Threat Severity Index</span>
          <span className="font-mono font-medium" style={{ color: getColor() }}>
            {score}/100 · {isHigh ? 'High Risk' : isMed ? 'Medium Risk' : 'Low Risk'}
          </span>
        </div>
        <div className="h-2 w-full bg-[var(--raised)] rounded-full overflow-hidden border border-[var(--hair)]">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${score}%`,
              backgroundColor: getColor(),
              boxShadow: `0 0 10px ${getColor()}`,
            }}
          />
        </div>
      </div>

      {/* Heuristic Factors Checklist */}
      {factors.length > 0 && (
        <div className="space-y-2 border-t border-[var(--hair)] pt-4">
          <div className="text-[11px] font-mono text-[var(--muted)] uppercase tracking-wider">
            Observed Correlation Factors ({factors.filter((f) => f.found).length}/{factors.length})
          </div>
          <div className="space-y-2 text-[13px]">
            {factors.map((factor) => (
              <div
                key={factor.id}
                className="flex items-start gap-2.5 p-2 rounded-[var(--radius-xs)] bg-[var(--bg)] border border-[var(--hair)]"
              >
                {factor.found ? (
                  <AlertTriangle size={15} className="text-[var(--warn)] shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 size={15} className="text-[var(--muted)] shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <div className="font-medium text-[var(--text)]">{factor.label}</div>
                  <div className="text-[12px] text-[var(--muted)] mt-0.5">{factor.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Microcopy */}
      <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed bg-[var(--raised)]/50 p-3 rounded-[var(--radius-xs)] border border-[var(--hair)]">
        {summary}
      </div>

      {/* Crucial Non-Verbal Verdict Disclaimer */}
      <div className="flex items-center gap-2 text-[12px] text-[var(--muted)] italic pt-1">
        <Info size={14} className="shrink-0 text-[var(--accent)]" />
        <span>Supporting analysis only, not a legal verdict.</span>
      </div>
    </div>
  );
};
