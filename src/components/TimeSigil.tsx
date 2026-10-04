import React, { useState, useEffect, useMemo } from 'react';

export interface TimeSigilProps {
  size?: number | string;
  speed?: 'slow' | 'normal' | 'fast';
  intensity?: 'low' | 'normal' | 'high';
  state?: 'idle' | 'scanning' | 'locked';
  showClock?: boolean;
  watermark?: boolean;
  ghostTrail?: boolean;
  className?: string;
  id?: string;
}

// 8 Sacred-geometry glyphs with thin, precise hairline paths
const SACRED_GLYPHS = [
  <path key="g1" d="M0 -6 L0 6 M-4 -2 L4 -2 M-2 3 L2 3" />,
  <path key="g2" d="M-5 5 L0 -6 L5 5 Z M0 -2 L0 5" />,
  <g key="g3"><circle cx="0" cy="0" r="3.5" /><line x1="0" y1="-6" x2="0" y2="-3.5" /><line x1="0" y1="3.5" x2="0" y2="6" /></g>,
  <path key="g4" d="M-4 -5 L4 -5 L0 0 L4 5 L-4 5 Z" />,
  <path key="g5" d="M-5 -4 L0 -6 L5 -4 L0 6 Z" />,
  <g key="g6"><circle cx="0" cy="0" r="1.5" /><line x1="-5" y1="0" x2="-2" y2="0" /><line x1="2" y1="0" x2="5" y2="0" /><line x1="0" y1="-5" x2="0" y2="-2" /><line x1="0" y1="2" x2="0" y2="5" /></g>,
  <path key="g7" d="M-4 -4 Q0 -6 4 -4 Q0 0 -4 4 Q0 6 4 4" />,
  <path key="g8" d="M-5 0 L0 -5 L5 0 L0 5 Z M-2 -2 L2 2 M-2 2 L2 -2" />
];

export const TimeSigil: React.FC<TimeSigilProps> = ({
  size = 600,
  speed = 'normal',
  intensity = 'normal',
  state = 'idle',
  showClock = false,
  watermark = false,
  ghostTrail = false,
  className = '',
  id,
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
      const ms = n.getUTCMilliseconds();
      const sec = h * 3600 + m * 60 + s + ms / 1000;
      setAngles({
        h: sec / 120,
        m: sec / 10,
        s: (s + ms / 1000) * 6,
      });
    };

    updateHands();
    const liveTimer = setTimeout(() => setIsLive(true), 1200);
    const interval = setInterval(updateHands, 50);

    return () => {
      clearTimeout(liveTimer);
      clearInterval(interval);
    };
  }, [showClock]);

  // Outer Bezel Ticks (180 precision divisions)
  const outerTicks = useMemo(() => {
    return Array.from({ length: 180 }).map((_, i) => {
      const isMajor = i % 15 === 0;
      const isMedium = i % 5 === 0;
      const len = isMajor ? 14 : isMedium ? 8 : 4;
      const opacity = isMajor ? 0.85 : isMedium ? 0.5 : 0.25;
      return (
        <line
          key={`ot-${i}`}
          x1={300}
          y1={12}
          x2={300}
          y2={12 + len}
          stroke="currentColor"
          strokeOpacity={opacity}
          strokeWidth={isMajor ? 1.5 : 1}
          transform={`rotate(${i * 2} 300 300)`}
        />
      );
    });
  }, []);

  // 32 Outer Glyphs
  const outerGlyphs = useMemo(() => {
    return Array.from({ length: 32 }).map((_, i) => {
      const glyph = SACRED_GLYPHS[i % SACRED_GLYPHS.length];
      return (
        <g
          key={`glyph-${i}`}
          transform={`rotate(${i * (360 / 32)} 300 300) translate(300 42)`}
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {glyph}
        </g>
      );
    });
  }, []);

  // Inner Dial Ticks (60 subdivisions)
  const innerDialTicks = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => {
      const isMajor = i % 5 === 0;
      const y2 = isMajor ? 204 : 198;
      return (
        <line
          key={`it-${i}`}
          x1={300}
          y1={192}
          x2={300}
          y2={y2}
          stroke="currentColor"
          strokeOpacity={isMajor ? 0.8 : 0.35}
          strokeWidth={isMajor ? 1.2 : 0.8}
          transform={`rotate(${i * 6} 300 300)`}
        />
      );
    });
  }, []);

  // Compute rotation durations
  const getSpinDurations = () => {
    if (state === 'scanning') {
      return { outer: '4s', middle: '2.5s', inner: '6s' };
    }
    if (speed === 'fast') {
      return { outer: '15s', middle: '10s', inner: '20s' };
    }
    if (speed === 'slow') {
      return { outer: '160s', middle: '100s', inner: '240s' };
    }
    return { outer: '120s', middle: '75s', inner: '180s' };
  };

  const spin = getSpinDurations();

  // Opacity & Intensity adjustments
  const getOverallOpacity = () => {
    if (watermark) return 0.07;
    if (intensity === 'low') return 0.4;
    if (intensity === 'high') return 1;
    return 0.85;
  };

  return (
    <div
      id={id}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        opacity: getOverallOpacity(),
      }}
      aria-hidden="true"
    >
      {/* Ghost Trail (2-3 fading echoing copies during hash lock-in) */}
      {ghostTrail && (
        <>
          <div
            className="absolute inset-0 pointer-events-none rounded-full border border-[var(--accent)] opacity-40 animate-ghost-trail"
            style={{ animationDelay: '0s' }}
          />
          <div
            className="absolute inset-0 pointer-events-none rounded-full border border-[var(--accent-bright)] opacity-25 animate-ghost-trail"
            style={{ animationDelay: '0.25s' }}
          />
        </>
      )}

      <svg
        viewBox="0 0 600 600"
        fill="none"
        className="w-full h-full overflow-visible"
        style={{ transformOrigin: '50% 50%' }}
      >
        <defs>
          {/* Radial Temporal Lens Flare & Glow */}
          <radialGradient id="sigil-core-flare" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent-bright)" stopOpacity="0.9" />
            <stop offset="25%" stopColor="var(--accent)" stopOpacity="0.4" />
            <stop offset="60%" stopColor="var(--accent-deep)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="sigil-gold-flare" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          <filter id="sigil-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* BACKGROUND LENS FLARE GLOW */}
        <circle cx="300" cy="300" r="220" fill="url(#sigil-core-flare)" pointerEvents="none" />

        {/* LAYER 1: Outer Gold / Metallic Chronometric Bezel */}
        <g style={{ color: 'var(--gold)', transformOrigin: '300px 300px' }}>
          {outerTicks}
          <circle cx="300" cy="300" r="290" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.2" />
          <circle cx="300" cy="300" r="278" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.8" />
        </g>

        {/* LAYER 2: Outer Rotating Sacred Glyphs & Runes (Clockwise) */}
        <g
          style={{
            animation: `sigil-turn ${spin.outer} linear infinite`,
            transformOrigin: '300px 300px',
            color: 'var(--accent-soft)',
          }}
        >
          <circle cx="300" cy="300" r="268" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
          <circle cx="300" cy="300" r="244" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.8" strokeDasharray="4 8" />
          {outerGlyphs}
        </g>

        {/* LAYER 3: Counter-Rotating Dashed Temporal Harmonic Rings (Anti-Clockwise) */}
        <g
          style={{
            animation: `sigil-turn-rev ${spin.middle} linear infinite`,
            transformOrigin: '300px 300px',
            color: 'var(--accent)',
          }}
        >
          {/* Broad segmented orbit */}
          <circle
            cx="300"
            cy="300"
            r="228"
            stroke="currentColor"
            strokeWidth="2"
            strokeOpacity="0.65"
            strokeDasharray="180 50 90 40 40 40"
          />
          <circle
            cx="300"
            cy="300"
            r="212"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeOpacity="0.4"
            strokeDasharray="3 7"
          />
        </g>

        {/* LAYER 4: 8-Point & 9-Point Star Sacred Geometry Polygons */}
        <g
          style={{
            animation: `sigil-turn ${spin.inner} linear infinite`,
            transformOrigin: '300px 300px',
          }}
        >
          {/* 8-Point Octagram (Two overlapping 45-degree squares) */}
          <rect
            x="180"
            y="180"
            width="240"
            height="240"
            fill="none"
            stroke="var(--accent-bright)"
            strokeOpacity="0.35"
            strokeWidth="1.2"
          />
          <rect
            x="180"
            y="180"
            width="240"
            height="240"
            fill="none"
            stroke="var(--accent-bright)"
            strokeOpacity="0.35"
            strokeWidth="1.2"
            transform="rotate(45 300 300)"
          />

          {/* 9-Point Enneagram / Triple Overlapping Equilateral Triangles */}
          <polygon
            points="300,120 456,390 144,390"
            fill="none"
            stroke="var(--gold)"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
          <polygon
            points="300,120 456,390 144,390"
            fill="none"
            stroke="var(--gold)"
            strokeOpacity="0.35"
            strokeWidth="1"
            transform="rotate(40 300 300)"
          />
          <polygon
            points="300,120 456,390 144,390"
            fill="none"
            stroke="var(--accent)"
            strokeOpacity="0.35"
            strokeWidth="1"
            transform="rotate(80 300 300)"
          />

          {/* Intersecting Cardinal Rays */}
          <line x1="300" y1="120" x2="300" y2="480" stroke="var(--accent)" strokeOpacity="0.2" strokeWidth="1" />
          <line x1="120" y1="300" x2="480" y2="300" stroke="var(--accent)" strokeOpacity="0.2" strokeWidth="1" />
        </g>

        {/* LAYER 5: Inner Dial, Measurement Ring & Optional Real-time Clock Hands */}
        <g style={{ color: 'var(--accent-bright)', transformOrigin: '300px 300px' }}>
          <circle cx="300" cy="300" r="118" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.4" />
          <circle cx="300" cy="300" r="110" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.8" strokeDasharray="2 4" />
          {innerDialTicks}

          {showClock && (
            <g style={{ transformOrigin: '300px 300px' }}>
              {/* Hour Hand */}
              <line
                x1="300"
                y1="300"
                x2="300"
                y2="232"
                stroke="var(--text)"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{
                  transformOrigin: '300px 300px',
                  transform: `rotate(${angles.h}deg)`,
                  transition: isLive ? 'transform .2s linear' : 'none',
                }}
              />
              {/* Minute Hand */}
              <line
                x1="300"
                y1="300"
                x2="300"
                y2="200"
                stroke="var(--accent-bright)"
                strokeWidth="1.8"
                strokeLinecap="round"
                style={{
                  transformOrigin: '300px 300px',
                  transform: `rotate(${angles.m}deg)`,
                  transition: isLive ? 'transform .2s linear' : 'none',
                }}
              />
              {/* Second Hand */}
              <line
                x1="300"
                y1="324"
                x2="300"
                y2="186"
                stroke="var(--gold)"
                strokeWidth="1"
                style={{
                  transformOrigin: '300px 300px',
                  transform: `rotate(${angles.s}deg)`,
                  transition: isLive ? 'transform .05s linear' : 'none',
                }}
              />
            </g>
          )}
        </g>

        {/* LAYER 6: Central Faceted Time Stone Core Gem */}
        <g
          className={state === 'locked' ? 'animate-lock-pulse' : ''}
          style={{ transformOrigin: '300px 300px' }}
        >
          {/* Faceted Emerald Gem Geometry */}
          <polygon points="300,300 300,265 330,282.5" fill="var(--accent)" stroke="var(--accent-bright)" strokeWidth="0.6" fillOpacity="0.95" />
          <polygon points="300,300 330,282.5 330,317.5" fill="var(--accent-soft)" stroke="var(--accent-bright)" strokeWidth="0.6" fillOpacity="0.9" />
          <polygon points="300,300 330,317.5 300,335" fill="var(--accent-deep)" stroke="var(--accent-bright)" strokeWidth="0.6" fillOpacity="0.95" />
          <polygon points="300,300 300,335 270,317.5" fill="var(--accent)" stroke="var(--accent-bright)" strokeWidth="0.6" fillOpacity="0.95" />
          <polygon points="300,300 270,317.5 270,282.5" fill="var(--accent-bright)" stroke="var(--accent-bright)" strokeWidth="0.6" fillOpacity="0.8" />
          <polygon points="300,300 270,282.5 300,265" fill="#E8FFF2" stroke="var(--accent-bright)" strokeWidth="0.6" fillOpacity="0.95" />
          
          {/* Inner Sparkling Core Center */}
          <circle cx="300" cy="300" r="3.5" fill="#FFFFFF" filter="url(#sigil-glow)" />
        </g>
      </svg>

      <style>{`
        @keyframes sigil-turn {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes sigil-turn-rev {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-ghost-trail, .animate-lock-pulse {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};
