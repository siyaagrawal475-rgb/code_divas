import React from 'react';

interface BgSigilFieldProps {
  size?: number;
  className?: string;
  opacity?: number;
}

export const BgSigilField: React.FC<BgSigilFieldProps> = ({
  size = 600,
  className = '',
  opacity = 0.08,
}) => {
  const center = size / 2;

  return (
    <div
      className={`pointer-events-none absolute select-none flex items-center justify-center ${className}`}
      style={{ width: size, height: size, opacity }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Layer 1: Outermost Spell Ring (60s rotation) */}
        <g
          className="animate-spin-60s"
          style={{ transformOrigin: `${center}px ${center}px` }}
        >
          <circle
            cx={center}
            cy={center}
            r={size * 0.48}
            fill="none"
            stroke="#45E08A"
            strokeWidth="1"
            strokeDasharray="4 8 12 8"
          />
          <circle
            cx={center}
            cy={center}
            r={size * 0.45}
            fill="none"
            stroke="#C9A24B"
            strokeWidth="0.75"
          />
          {/* Outer radial ticks */}
          {Array.from({ length: 36 }).map((_, i) => {
            const rad = (i * 10 * Math.PI) / 180;
            const r1 = size * 0.45;
            const r2 = size * 0.48;
            return (
              <line
                key={i}
                x1={center + r1 * Math.cos(rad)}
                y1={center + r1 * Math.sin(rad)}
                x2={center + r2 * Math.cos(rad)}
                y2={center + r2 * Math.sin(rad)}
                stroke="#45E08A"
                strokeWidth="1"
              />
            );
          })}
        </g>

        {/* Layer 2: Mystic Spell Ring with Inscribed Triangles (35s reverse rotation) */}
        <g
          className="animate-spin-35s"
          style={{ transformOrigin: `${center}px ${center}px` }}
        >
          <circle
            cx={center}
            cy={center}
            r={size * 0.36}
            fill="none"
            stroke="#45E08A"
            strokeWidth="1.2"
          />
          <circle
            cx={center}
            cy={center}
            r={size * 0.33}
            fill="none"
            stroke="#1F2B25"
            strokeWidth="1"
            strokeDasharray="6 6"
          />
          {/* Double intersecting inscribed triangles (hexagram geometric mystic glyph) */}
          <polygon
            points={`${center},${center - size * 0.36} ${center + size * 0.311},${center + size * 0.18} ${center - size * 0.311},${center + size * 0.18}`}
            fill="none"
            stroke="#45E08A"
            strokeWidth="0.75"
          />
          <polygon
            points={`${center},${center + size * 0.36} ${center + size * 0.311},${center - size * 0.18} ${center - size * 0.311},${center - size * 0.18}`}
            fill="none"
            stroke="#45E08A"
            strokeWidth="0.75"
          />
        </g>

        {/* Layer 3: Inner Ray Aperture (20s rotation) */}
        <g
          className="animate-spin-20s"
          style={{ transformOrigin: `${center}px ${center}px` }}
        >
          <circle
            cx={center}
            cy={center}
            r={size * 0.22}
            fill="none"
            stroke="#C9A24B"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          {Array.from({ length: 24 }).map((_, i) => {
            const rad = (i * 15 * Math.PI) / 180;
            const r1 = size * 0.12;
            const r2 = size * 0.22;
            return (
              <line
                key={i}
                x1={center + r1 * Math.cos(rad)}
                y1={center + r1 * Math.sin(rad)}
                x2={center + r2 * Math.cos(rad)}
                y2={center + r2 * Math.sin(rad)}
                stroke="#45E08A"
                strokeWidth="0.75"
              />
            );
          })}
        </g>

        {/* Center core point */}
        <circle cx={center} cy={center} r={size * 0.04} fill="#45E08A" fillOpacity="0.3" />
        <circle cx={center} cy={center} r={size * 0.015} fill="#45E08A" />
      </svg>
    </div>
  );
};
