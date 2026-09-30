import React, { useState, useEffect, useMemo } from 'react';

export interface TimeSigilProps {
  size?: number;
  state?: 'idle' | 'scanning' | 'locked';
  showClock?: boolean;
  className?: string;
}

// Predefined 7 geometric glyphs from the reference
const GLYPH_PATHS = [
  <React.Fragment key="g0"><path d="M0 -7V7M-4 0H4" /></React.Fragment>,
  <React.Fragment key="g1"><path d="M0 -7L6 5H-6Z" /></React.Fragment>,
  <React.Fragment key="g2"><circle r="3.5" /><path d="M0 -7v-3" /></React.Fragment>,
  <React.Fragment key="g3"><path d="M-5 -6V6M5 -6V6M-5 0H5" /></React.Fragment>,
  <React.Fragment key="g4"><path d="M-6 4A6 6 0 0 1 6 4M0 -7v6" /></React.Fragment>,
  <React.Fragment key="g5"><path d="M-6 -6L6 6M6 -6L-6 6" /></React.Fragment>,
  <React.Fragment key="g6"><circle r="1.6" fill="#9AFFC4" /><path d="M-6 0H-3M3 0H6M0 -6V-3M0 3V6" /></React.Fragment>,
];

export const TimeSigil: React.FC<TimeSigilProps> = ({
  size = 600,
  state = 'idle',
  showClock = true,
  className = '',
}) => {
  const [angles, setAngles] = useState({ h: 0, m: 0, s: 0 });
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!showClock) return;

    const updateHands = () => {
      const n = new Date();
      const h = n.getUTCHours();
      const m = n.getUTCMinutes();
      const s = n.getUTCSeconds();
      const sec = h * 3600 + m * 60 + s;
      setAngles({
        h: sec / 120,
        m: sec / 10,
        s: sec * 6,
      });
    };

    updateHands();
    const liveTimer = setTimeout(() => setIsLive(true), 1600);
    const interval = setInterval(updateHands, 1000);

    return () => {
      clearTimeout(liveTimer);
      clearInterval(interval);
    };
  }, [showClock]);

  // Generate 180 outer gold tick lines
  const ticks = useMemo(() => {
    return Array.from({ length: 180 }).map((_, i) => {
      const len = i % 5 === 0 ? 14 : 6;
      const opacity = i % 5 === 0 ? 0.85 : 0.5;
      return (
        <line
          key={i}
          x1={300}
          y1={9}
          x2={300}
          y2={9 + len}
          strokeOpacity={opacity}
          transform={`rotate(${i * 2} 300 300)`}
        />
      );
    });
  }, []);

  // Generate 28 glyph instances
  const glyphs = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => {
      const glyphIndex = (i * 3 + (i >> 2)) % 7;
      return (
        <g
          key={i}
          transform={`rotate(${i * (360 / 28)} 300 300) translate(300 38)`}
        >
          {GLYPH_PATHS[glyphIndex]}
        </g>
      );
    });
  }, []);

  // Generate 60 inner dial tick lines
  const dialTicks = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => {
      const isMajor = i % 5 === 0;
      const y2 = isMajor ? 200 : 194;
      const opacity = isMajor ? 0.8 : 0.35;
      return (
        <line
          key={i}
          x1={300}
          y1={190}
          x2={300}
          y2={y2}
          strokeOpacity={opacity}
          transform={`rotate(${i * 6} 300 300)`}
        />
      );
    });
  }, []);

  const spin1 = state === 'scanning' ? '20s' : '140s';
  const spin2 = state === 'scanning' ? '12s' : '80s';
  const spin3 = state === 'scanning' ? '30s' : '200s';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none overflow-visible ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 600 600"
        fill="none"
        className="w-full h-full overflow-visible"
        style={{ transformOrigin: '50% 50%' }}
      >
        <defs>
          <radialGradient id="sigil-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9AFFC4" />
            <stop offset="100%" stopColor="#1f8f52" />
          </radialGradient>
        </defs>

        {/* Outer Gold Ticks and Outer Ring */}
        <g className="layer" style={{ '--d': '.45s' } as React.CSSProperties}>
          <g stroke="#C9A24B">{ticks}</g>
          <circle cx="300" cy="300" r="291" stroke="#C9A24B" strokeOpacity="0.5" />
        </g>

        {/* Layer 2: Rotating Glyphs and Bezel */}
        <g className="layer" style={{ '--d': '.6s' } as React.CSSProperties}>
          <g
            className="spin"
            style={{
              '--t': spin1,
              transformOrigin: '300px 300px',
            } as React.CSSProperties}
          >
            <circle cx="300" cy="300" r="276" stroke="#C9A24B" strokeOpacity="0.3" />
            <circle cx="300" cy="300" r="248" stroke="#45E08A" strokeOpacity="0.25" />
            <g stroke="#9AFFC4" strokeOpacity="0.75" strokeLinecap="round">
              {glyphs}
            </g>
          </g>
        </g>

        {/* Layer 3: Counter-rotating Dashed Green Rings */}
        <g className="layer" style={{ '--d': '.75s' } as React.CSSProperties}>
          <g
            className="spin rev"
            style={{
              '--t': spin2,
              transformOrigin: '300px 300px',
            } as React.CSSProperties}
          >
            <circle
              cx="300"
              cy="300"
              r="222"
              stroke="#45E08A"
              strokeWidth="2.5"
              strokeOpacity="0.7"
              strokeDasharray="210 70"
              pathLength="1400"
            />
            <circle
              cx="300"
              cy="300"
              r="204"
              stroke="#45E08A"
              strokeOpacity="0.3"
              strokeDasharray="2 9"
            />
          </g>
        </g>

        {/* Layer 4: Intersecting Mystic Triangles (Hexagram) */}
        <g className="layer" style={{ '--d': '.9s' } as React.CSSProperties}>
          <g
            className="spin"
            style={{
              '--t': spin3,
              transformOrigin: '300px 300px',
            } as React.CSSProperties}
          >
            <path d="M300 138 L440 381 H160 Z" stroke="#45E08A" strokeOpacity="0.4" />
            <path d="M300 462 L160 219 H440 Z" stroke="#C9A24B" strokeOpacity="0.35" />
          </g>
        </g>

        {/* Layer 5: Inner Dial & Clock Hands */}
        <g className="layer" style={{ '--d': '1s' } as React.CSSProperties}>
          <circle cx="300" cy="300" r="112" stroke="#45E08A" strokeOpacity="0.5" />
          <g stroke="#45E08A" strokeOpacity="0.6">
            {dialTicks}
          </g>

          {showClock && (
            <>
              {/* Hour Hand */}
              <line
                x1="300"
                y1="300"
                x2="300"
                y2="236"
                stroke="#E8F0EB"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{
                  transformOrigin: '300px 300px',
                  transform: `rotate(${angles.h}deg)`,
                  transition: isLive
                    ? 'transform .35s ease-out'
                    : 'transform 1.5s cubic-bezier(.2,.8,.2,1)',
                }}
              />
              {/* Minute Hand */}
              <line
                x1="300"
                y1="300"
                x2="300"
                y2="208"
                stroke="#9AFFC4"
                strokeWidth="1.6"
                strokeLinecap="round"
                style={{
                  transformOrigin: '300px 300px',
                  transform: `rotate(${angles.m}deg)`,
                  transition: isLive
                    ? 'transform .35s ease-out'
                    : 'transform 1.5s cubic-bezier(.2,.8,.2,1)',
                }}
              />
              {/* Second Hand */}
              <line
                x1="300"
                y1="322"
                x2="300"
                y2="196"
                stroke="#C9A24B"
                strokeWidth="1"
                style={{
                  transformOrigin: '300px 300px',
                  transform: `rotate(${angles.s}deg)`,
                  transition: isLive
                    ? 'transform .35s ease-out'
                    : 'transform 1.5s cubic-bezier(.2,.8,.2,1)',
                }}
              />
            </>
          )}
        </g>

        {/* Layer 6: Central Glowing Faceted Time Stone Gem */}
        <g className="layer" style={{ '--d': '.15s' } as React.CSSProperties}>
          <g className="gem" style={{ transformOrigin: '300px 300px' }}>
            <polygon points="300,300 300,268 327.7,284" fill="#45E08A" />
            <polygon points="300,300 327.7,284 327.7,316" fill="#2fb96d" />
            <polygon points="300,300 327.7,316 300,332" fill="#1f8f52" />
            <polygon points="300,300 300,332 272.3,316" fill="#45E08A" />
            <polygon points="300,300 272.3,316 272.3,284" fill="#7cf0b0" />
            <polygon points="300,300 272.3,284 300,268" fill="#9AFFC4" />
          </g>
        </g>
      </svg>
    </div>
  );
};
