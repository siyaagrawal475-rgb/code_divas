import React, { useState } from 'react';
import { ShieldCheck, Eye, Hash, Camera } from 'lucide-react';
import type { TimelineEvent } from '../types';

interface TimelineRailProps {
  events: TimelineEvent[];
  activeStep?: number;
  onEventHover?: (event: TimelineEvent | null) => void;
  className?: string;
}

export const TimelineRail: React.FC<TimelineRailProps> = ({
  events = [],
  activeStep,
  onEventHover,
  className = '',
}) => {
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'discovered':
        return <Eye size={13} className="text-[var(--warn)]" />;
      case 'hash':
        return <Hash size={13} className="text-[var(--accent)]" />;
      case 'report':
        return <ShieldCheck size={13} className="text-[var(--accent)]" />;
      case 'preserved':
      default:
        return <Camera size={13} className="text-[var(--text)]" />;
    }
  };

  return (
    <div className={`relative pl-8 space-y-6 ${className}`}>
      {/* Central continuous hairline vertical rail */}
      <div className="absolute left-[11px] top-2 bottom-4 w-[1px] bg-[var(--hair)]" />

      {events.map((event, index) => {
        const isLatest = index === events.length - 1;
        const isHovered = hoveredEventId === event.id;
        const isHighlighted = activeStep ? index <= activeStep : true;

        return (
          <div
            key={event.id}
            onMouseEnter={() => {
              setHoveredEventId(event.id);
              onEventHover?.(event);
            }}
            onMouseLeave={() => {
              setHoveredEventId(null);
              onEventHover?.(null);
            }}
            className={`relative group transition-all duration-200 ${
              isHighlighted ? 'opacity-100' : 'opacity-35'
            }`}
          >
            {/* Node Circular Marker on the rail */}
            <div
              className={`absolute -left-[29px] top-1 w-6 h-6 rounded-full bg-[var(--panel)] border flex items-center justify-center transition-all ${
                isHovered
                  ? 'border-[var(--accent)] shadow-[0_0_12px_var(--accent-glow)] scale-110'
                  : isLatest
                  ? 'border-[var(--accent)] ring-2 ring-[var(--accent-glow)]'
                  : 'border-[var(--hair)] group-hover:border-[var(--muted)]'
              }`}
            >
              {getEventIcon(event.type)}

              {/* Faint Temporal Echo Afterimage on Latest Event */}
              {isLatest && (
                <span className="absolute -inset-1 rounded-full border border-[var(--accent)] opacity-40 animate-ping pointer-events-none" />
              )}
            </div>

            {/* Event Body Card */}
            <div
              className={`p-3.5 rounded-[var(--radius-sm)] border transition-all ${
                isHovered
                  ? 'bg-[var(--raised)] border-[var(--accent)] shadow-[var(--spill-glow)]'
                  : 'bg-[var(--panel)]/70 border-[var(--hair)] hover:border-[var(--hair-bright)]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-[12px] mb-1">
                <span className="font-mono text-[var(--accent)] font-medium">
                  {event.time}
                </span>
                <span className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider">
                  Event 0{index + 1}
                </span>
              </div>

              <h4 className="text-[14px] font-medium text-[var(--text)]">
                {event.title}
              </h4>

              <p className="text-[13px] text-[var(--muted)] mt-1 leading-relaxed">
                {event.description}
              </p>

              {event.evidenceRef && (
                <div className="mt-2.5 pt-2 border-t border-[var(--hair)] flex items-center gap-1.5 text-[11px] font-mono text-[var(--accent-bright)]">
                  <ShieldCheck size={12} />
                  <span>Anchored to EV-{event.evidenceRef}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
