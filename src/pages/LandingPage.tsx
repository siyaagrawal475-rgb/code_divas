// Screen 1: Entry / Landing
// Memorable element: The Eye of Agamotto Time Sigil with real-time clock synchronization.

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';

export const LandingPage: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const ticksRef = useRef<SVGGElement>(null);
  const glyphsRef = useRef<SVGGElement>(null);
  const dialRef = useRef<SVGGElement>(null);
  const hHRef = useRef<SVGLineElement>(null);
  const hMRef = useRef<SVGLineElement>(null);
  const hSRef = useRef<SVGLineElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('ht-seen') && stageRef.current) {
        stageRef.current.classList.add('seen');
      }
      sessionStorage.setItem('ht-seen', '1');
    } catch {
      // ignore storage error
    }

    // Generate 180 ticks
    let t = '';
    for (let i = 0; i < 180; i++) {
      const L = i % 5 === 0 ? 14 : 6;
      t += `<line x1="300" y1="9" x2="300" y2="${9 + L}" stroke-opacity="${i % 5 ? 0.5 : 0.85}" transform="rotate(${i * 2} 300 300)"/>`;
    }
    if (ticksRef.current) {
      ticksRef.current.innerHTML = t;
    }

    // Generate 28 glyphs
    const G = [
      '<path d="M0-7V7M-4 0H4"/>',
      '<path d="M0-7L6 5H-6Z"/>',
      '<circle r="3.5"/><path d="M0-7v-3"/>',
      '<path d="M-5-6V6M5-6V6M-5 0H5"/>',
      '<path d="M-6 4A6 6 0 0 1 6 4M0-7v6"/>',
      '<path d="M-6-6L6 6M6-6L-6 6"/>',
      '<circle r="1.6" fill="var(--accent-text)"/><path d="M-6 0H-3M3 0H6M0-6V-3M0 3V6"/>',
    ];
    let g = '';
    for (let i = 0; i < 28; i++) {
      g += `<g transform="rotate(${i * (360 / 28)} 300 300) translate(300 38)">${G[(i * 3 + (i >> 2)) % 7]}</g>`;
    }
    if (glyphsRef.current) {
      glyphsRef.current.innerHTML = g;
    }

    // Generate 60 dial ticks
    let d = '';
    for (let i = 0; i < 60; i++) {
      d += `<line x1="300" y1="190" x2="300" y2="${i % 5 ? 194 : 200}" stroke-opacity="${i % 5 ? 0.35 : 0.8}" transform="rotate(${i * 6} 300 300)"/>`;
    }
    if (dialRef.current) {
      dialRef.current.innerHTML = d;
    }

    function pad(n: number) {
      return n < 10 ? '0' + n : n.toString();
    }

    function tick() {
      const n = new Date();
      const h = n.getUTCHours();
      const m = n.getUTCMinutes();
      const s = n.getUTCSeconds();
      const sec = h * 3600 + m * 60 + s;
      if (hHRef.current) hHRef.current.style.transform = 'rotate(' + sec / 120 + 'deg)';
      if (hMRef.current) hMRef.current.style.transform = 'rotate(' + sec / 10 + 'deg)';
      if (hSRef.current) hSRef.current.style.transform = 'rotate(' + sec * 6 + 'deg)';
      if (clockRef.current) clockRef.current.textContent = pad(h) + ':' + pad(m) + ':' + pad(s) + ' UTC';
    }

    [hHRef.current, hMRef.current, hSRef.current].forEach((el) => {
      if (el) el.style.transform = 'rotate(0deg)';
    });

    const timeout1 = setTimeout(() => {
      tick();
      const timeout2 = setTimeout(() => {
        [hHRef.current, hMRef.current, hSRef.current].forEach((el) => {
          if (el) el.classList.add('live');
        });
      }, 1600);
      return () => clearTimeout(timeout2);
    }, 250);

    const interval = setInterval(tick, 1000);

    return () => {
      clearTimeout(timeout1);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="entry-page">
      <div className="stage" id="stage" ref={stageRef}>
        <div className="crop">
          <span className="a" />
          <span className="b" />
          <span className="c" />
          <span className="d" />
        </div>

        <header>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="secure">
              <i />
              Secure session
            </span>
            <ThemeToggle />
          </div>
        </header>

        <div className="sigil" aria-hidden="true">
          <svg viewBox="0 0 600 600" fill="none">
            <defs>
              <radialGradient id="gem-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--accent-text)" />
                <stop offset="100%" stopColor="var(--accent)" />
              </radialGradient>
            </defs>

            <g className="layer" style={{ '--d': '.45s' } as React.CSSProperties}>
              <g id="ticks" ref={ticksRef} stroke="var(--gold)" />
              <circle cx="300" cy="300" r="291" stroke="var(--gold)" strokeOpacity="0.5" />
            </g>

            <g className="layer" style={{ '--d': '.6s' } as React.CSSProperties}>
              <g className="spin" style={{ '--t': '140s' } as React.CSSProperties}>
                <circle cx="300" cy="300" r="276" stroke="var(--gold)" strokeOpacity="0.3" />
                <circle cx="300" cy="300" r="248" stroke="var(--accent-text)" strokeOpacity="0.35" />
                <g id="glyphs" ref={glyphsRef} stroke="var(--accent-text)" strokeOpacity="0.85" strokeLinecap="round" />
              </g>
            </g>

            <g className="layer" style={{ '--d': '.75s' } as React.CSSProperties}>
              <g className="spin rev" style={{ '--t': '80s' } as React.CSSProperties}>
                <circle
                  cx="300"
                  cy="300"
                  r="222"
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                  strokeOpacity="0.75"
                  strokeDasharray="210 70"
                  pathLength="1400"
                />
                <circle
                  cx="300"
                  cy="300"
                  r="204"
                  stroke="var(--accent-text)"
                  strokeOpacity="0.4"
                  strokeDasharray="2 9"
                />
              </g>
            </g>

            <g className="layer" style={{ '--d': '.9s' } as React.CSSProperties}>
              <g className="spin" style={{ '--t': '200s' } as React.CSSProperties}>
                <path d="M300 138 L440 381 H160 Z" stroke="var(--accent-text)" strokeOpacity="0.4" />
                <path d="M300 462 L160 219 H440 Z" stroke="var(--gold)" strokeOpacity="0.35" />
              </g>
            </g>

            <g className="layer" style={{ '--d': '1s' } as React.CSSProperties}>
              <circle cx="300" cy="300" r="112" stroke="var(--accent-text)" strokeOpacity="0.5" />
              <g id="dial" ref={dialRef} stroke="var(--accent-text)" strokeOpacity="0.6" />
              <line
                id="h-h"
                ref={hHRef}
                className="hand"
                x1="300"
                y1="300"
                x2="300"
                y2="236"
                stroke="var(--text)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                id="h-m"
                ref={hMRef}
                className="hand"
                x1="300"
                y1="300"
                x2="300"
                y2="208"
                stroke="var(--accent-text)"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <line
                id="h-s"
                ref={hSRef}
                className="hand"
                x1="300"
                y1="322"
                x2="300"
                y2="196"
                stroke="var(--gold)"
                strokeWidth="1"
              />
            </g>

            <g className="layer" style={{ '--d': '.15s' } as React.CSSProperties}>
              <g className="gem">
                <polygon points="300,300 300,268 327.7,284" fill="#45E08A" stroke="var(--accent-text)" strokeWidth="0.5" />
                <polygon points="300,300 327.7,284 327.7,316" fill="#2FB96D" stroke="var(--accent-text)" strokeWidth="0.5" />
                <polygon points="300,300 327.7,316 300,332" fill="#1F8F52" stroke="var(--accent-text)" strokeWidth="0.5" />
                <polygon points="300,300 300,332 272.3,316" fill="#45E08A" stroke="var(--accent-text)" strokeWidth="0.5" />
                <polygon points="300,300 272.3,316 272.3,284" fill="#7CF0B0" stroke="var(--accent-text)" strokeWidth="0.5" />
                <polygon points="300,300 272.3,284 300,268" fill="#9AFFC4" stroke="var(--accent-text)" strokeWidth="0.5" />
              </g>
            </g>
          </svg>
        </div>

        <main>
          <div className="i-word">
            <h1>HERTRACE</h1>
          </div>
          <div className="i-rest">
            <p className="quote">“Bound in time, proven beyond doubt.”</p>
            <p className="lede">
              Preserve digital evidence of online impersonation, non-consensual
              imagery and deepfakes. Every artifact is sealed with a
              cryptographic timestamp the moment you find it.
            </p>
            <div className="actions">
              <Link to="/incident/new" className="btn">
                Preserve an incident
              </Link>
              <Link to="/chronicle" className="link">
                Open active chronicle
              </Link>
            </div>
            <ul className="facts">
              <li>
                <b>Zero platform reliance</b>
                Preserved locally even if original posts are deleted.
              </li>
              <li>
                <b>Cryptographic seal</b>
                SHA-256 digests anchored with UTC timestamps.
              </li>
              <li>
                <b>Attestation reports</b>
                Structured records formatted for legal and trust teams.
              </li>
            </ul>
          </div>
        </main>

        <footer>
          <span>Eye of Agamotto Forensic Engine · v0.9.4</span>
          <em>Time is the ultimate witness.</em>
          <span id="clock" ref={clockRef}>
            00:00:00 UTC
          </span>
        </footer>
      </div>
    </div>
  );
};
