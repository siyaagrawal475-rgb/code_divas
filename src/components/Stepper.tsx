import React from 'react';
import { Link } from 'react-router-dom';

export interface StepItem {
  id: string;
  label: string;
  number: number;
  path?: string;
}

export const CASE_STEPS: StepItem[] = [
  { id: 'discover', label: 'Discover', number: 1, path: '/chronicle' },
  { id: 'preserve', label: 'Preserve', number: 2, path: '/incident/new' },
  { id: 'verify', label: 'Verify', number: 3, path: '/archive' },
  { id: 'organise', label: 'Organise', number: 4, path: '/archive' },
  { id: 'understand', label: 'Understand', number: 5, path: '/trace' },
  { id: 'report', label: 'Report', number: 6, path: '/report' },
];

export interface StepperProps {
  currentStep: number; // 1 to 6
  caseId?: string;
  className?: string;
  interactive?: boolean;
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep = 1,
  caseId,
  className = '',
  interactive = true,
}) => {
  return (
    <nav
      aria-label="Case Progress Pipeline"
      className={`w-full overflow-x-auto py-3 border-y border-[var(--hair)] bg-[var(--panel)]/40 ${className}`}
    >
      <ol className="flex items-center justify-between min-w-[620px] max-w-5xl mx-auto px-4 gap-2">
        {CASE_STEPS.map((step) => {
          const isCurrent = currentStep === step.number;
          const isDone = currentStep > step.number;
          const isPending = currentStep < step.number;

          const targetUrl = step.path
            ? (step.path === '/trace' || step.path === '/report') && caseId
              ? `${step.path}/${caseId}`
              : step.path
            : '#';

          const content = (
            <div className="flex items-center gap-2 group">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] transition-all ${
                  isCurrent
                    ? 'bg-[var(--accent)] text-[var(--accent-ink)] font-bold shadow-[0_0_10px_var(--accent-glow)]'
                    : isDone
                    ? 'bg-[var(--accent-deep)] text-[var(--accent-bright)] border border-[var(--accent)]/40'
                    : 'bg-[var(--raised)] text-[var(--muted-dark)] border border-[var(--hair)]'
                }`}
              >
                {isDone ? '✓' : `0${step.number}`}
              </span>
              <span
                className={`text-[12px] font-medium tracking-wide uppercase transition-colors ${
                  isCurrent
                    ? 'text-[var(--text)] font-semibold'
                    : isDone
                    ? 'text-[var(--accent-bright)]'
                    : 'text-[var(--muted)] group-hover:text-[var(--text-secondary)]'
                }`}
              >
                {step.label}
              </span>
            </div>
          );

          return (
            <React.Fragment key={step.id}>
              <li className="flex items-center shrink-0">
                {interactive && !isPending ? (
                  <Link
                    to={targetUrl}
                    className="focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded-[var(--radius-xs)] p-1"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="p-1">{content}</div>
                )}
              </li>

              {step.number < CASE_STEPS.length && (
                <div
                  className={`flex-1 h-[1px] mx-2 transition-colors ${
                    isDone ? 'bg-[var(--accent-deep)]' : 'bg-[var(--hair)]'
                  }`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
