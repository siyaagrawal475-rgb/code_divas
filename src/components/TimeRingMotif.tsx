import React, { useState } from 'react';

interface TimeRingMotifProps {
  size?: number;
  interactive?: boolean;
  className?: string;
  isLocked?: boolean;
}

export const TimeRingMotif: React.FC<TimeRingMotifProps> = ({
  size = 180,
  interactive = true,
  className = '',
  isLocked = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const radiusOuter = size * 0.45;
  const radiusMiddle = size * 0.36;
  const radiusInner = size * 0.26;
  const center = size / 2;

  // Generate tick marks for forensic/time aesthetic
  const ticks = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i * 360) / 24;
    const rad = (angle * Math.PI) / 180;
    const r1 = radiusOuter - (i % 6 === 0 ? 8 : 4);
    const r2 = radiusOuter;
    const x1 = center + r1 * Math.cos(rad);
    const y1 = center + r1 * Math.sin(rad);
    const x2 = center + r2 * Math.cos(rad);
    const y2 = center + r2 * Math.sin(rad);
    return { x1, y1, x2, y2, key: i, isMajor: i % 6 === 0 };
  });

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={`transition-transform duration-700 ease-out ${
          isHovered ? 'rotate-45' : 'rotate-0'
        }`}
      >
        {/* Outer subtle ring */}
        <circle
          cx={center}
          cy={center}
          r={radiusOuter}
          fill="none"
          stroke="#202A24"
          strokeWidth="1"
        />

        {/* Major ticks */}
        {ticks.map((t) => (
          <line
            key={t.key}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.isMajor ? '#45E08A' : '#202A24'}
            strokeWidth={t.isMajor ? '1.5' : '1'}
            strokeOpacity={t.isMajor ? 0.9 : 0.6}
          />
        ))}

        {/* Middle dashed timeline ring */}
        <circle
          cx={center}
          cy={center}
          r={radiusMiddle}
          fill="none"
          stroke={isLocked ? '#45E08A' : '#2A3830'}
          strokeWidth="1"
          strokeDasharray="3 6"
        />

        {/* Inner concentric ring */}
        <circle
          cx={center}
          cy={center}
          r={radiusInner}
          fill="none"
          stroke="#202A24"
          strokeWidth="1"
        />

        {/* Cardinal calibration points */}
        <circle cx={center} cy={center - radiusInner} r="2" fill="#45E08A" />
        <circle cx={center + radiusInner} cy={center} r="2" fill="#45E08A" />
        <circle cx={center} cy={center + radiusInner} r="2" fill="#45E08A" />
        <circle cx={center - radiusInner} cy={center} r="2" fill="#45E08A" />

        {/* Center core indicator */}
        <circle cx={center} cy={center} r="3" fill="#45E08A" />
        <circle
          cx={center}
          cy={center}
          r="8"
          fill="none"
          stroke="#45E08A"
          strokeWidth="0.75"
          strokeDasharray="2 2"
        />
      </svg>
    </div>
  );
};
