import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { TimeSigil } from '../components/TimeSigil';
import { DustParticles } from '../components/DustParticles';
import { ThemeToggle } from '../components/ThemeToggle';
import { QuickExit } from '../components/QuickExit';
import { LiveClock } from '../components/LiveClock';
import {
  ShieldCheck,
  Lock,
  FileCheck,
  Search,
  Upload,
  CheckCircle2,
  FolderTree,
  Network,
  FileSpreadsheet,
  ArrowRight,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const stepsRef = useRef<HTMLDivElement>(null);

  const scrollToSteps = (e: React.MouseEvent) => {
    e.preventDefault();
    stepsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const stepsList = [
    {
      num: '01',
      title: 'Discover',
      desc: 'Catalog malicious account handles, cloned media, and URLs the moment you encounter them.',
      icon: <Search size={18} className="text-[var(--accent)]" />,
    },
    {
      num: '02',
      title: 'Preserve',
      desc: 'Capture full screenshots, video streams, and network logs directly before posts are deleted.',
      icon: <Upload size={18} className="text-[var(--accent)]" />,
    },
    {
      num: '03',
      title: 'Verify',
      desc: 'Compute NIST FIPS 180-4 SHA-256 cryptographic digests in-browser with zero cloud leakage.',
      icon: <CheckCircle2 size={18} className="text-[var(--accent)]" />,
    },
    {
      num: '04',
      title: 'Organise',
      desc: 'Structure related evidence into tamper-evident incident binders with verifiable UTC timestamps.',
      icon: <FolderTree size={18} className="text-[var(--accent)]" />,
    },
    {
      num: '05',
      title: 'Understand',
      desc: 'Inspect interactive correlation graphs and heuristic assessments with transparent confidence scores.',
      icon: <Network size={18} className="text-[var(--accent)]" />,
    },
    {
      num: '06',
      title: 'Report',
      desc: 'Generate Section 63 (BSA 2023) certified complaint dossiers ready for cybercrime.gov.in.',
      icon: <FileSpreadsheet size={18} className="text-[var(--accent)]" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] selection:bg-[var(--accent-subtle)] selection:text-[var(--accent-bright)] relative flex flex-col">
      {/* Ambient dust particles */}
      <DustParticles count={32} />

      {/* TOPBAR HEADER */}
      <header className="relative z-30 flex items-center justify-between px-6 sm:px-12 py-5 border-b border-[var(--hair)] bg-[var(--bg)]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <TimeSigil size={32} speed="slow" showClock={false} />
          <div className="flex flex-col">
            <span className="font-display font-light text-[15px] tracking-[0.22em] text-[var(--text)]">
              CHRONOVAULT
            </span>
            <span className="text-[10px] font-mono text-[var(--muted)] tracking-wider uppercase">
              Forensic Vault
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-[12px] text-[var(--muted)] font-mono">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
            <span>Local Vault Active</span>
          </div>

          <QuickExit />
          <ThemeToggle />
        </div>
      </header>

      {/* HERO STAGE */}
      <section className="relative z-20 flex-1 flex flex-col justify-center py-12 lg:py-20 w-full overflow-hidden">
        {/* Massive slow-rotating Sigil scaled up and positioned to the right */}
        <div
          className="absolute -right-52 sm:-right-60 md:-right-68 lg:-right-72 xl:-right-60 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 sm:opacity-55 lg:opacity-85 select-none"
          aria-hidden="true"
        >
          <TimeSigil size={840} speed="slow" intensity="normal" showClock={true} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full">
          <div className="max-w-2xl space-y-8">
            {/* Spaced Display Title Motif */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-xs)] border border-[var(--hair)] bg-[var(--panel)]/75 backdrop-blur-sm text-[11px] font-display text-[var(--accent)]">
              <Sparkles size={12} />
              <span>TIME IS INFINITY · EVIDENCE IS IMMUTABLE</span>
            </div>

            {/* Main Title & Tagline */}
            <div className="space-y-4">
              <h1 className="font-display-title text-4xl sm:text-6xl lg:text-7xl font-light text-[var(--text)] leading-[1.05]">
                CHRONOVAULT
              </h1>
              <p className="text-xl sm:text-2xl font-light text-[var(--accent-bright)] font-display tracking-wider">
                Preserve Every Moment. Protect Every Trace.
              </p>
            </div>

            {/* Subtitle / Plain warm reassuring description */}
            <p className="text-[16px] sm:text-[17px] text-[var(--muted)] leading-relaxed max-w-xl font-body">
              A private, tamper-evident evidence vault designed for women facing online abuse,
              impersonation, deepfakes, and non-consensual image sharing. Every artifact is sealed
              in-browser with NIST FIPS SHA-256 signatures before original posts are deleted.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/incident/new"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[var(--accent)] text-[var(--accent-ink)] font-semibold text-[15px] rounded-[var(--radius-sm)] shadow-lg shadow-[var(--accent-glow)] hover:opacity-95 transition-all min-h-[44px] cursor-pointer"
              >
                <span>Start a case</span>
                <ArrowRight size={16} />
              </Link>

              <button
                type="button"
                onClick={scrollToSteps}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-transparent text-[var(--text)] border border-[var(--hair)] hover:border-[var(--muted)] hover:bg-[var(--panel)] rounded-[var(--radius-sm)] text-[14px] font-medium transition-all min-h-[44px] cursor-pointer"
              >
                <span>How it works</span>
              </button>

              <Link
                to="/chronicle"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-3 text-[14px] text-[var(--muted)] hover:text-[var(--text)] transition-colors min-h-[44px]"
              >
                <span>Open active chronicle</span>
              </Link>
            </div>

            {/* Reassurance & Security Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-[var(--hair)]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[14px] font-medium text-[var(--text)]">
                  <Lock size={15} className="text-[var(--accent)]" />
                  <span>Zero Cloud Leakage</span>
                </div>
                <p className="text-[12px] text-[var(--muted)] leading-relaxed">
                  Files are processed locally in your browser memory. Nothing is uploaded to external servers.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[14px] font-medium text-[var(--text)]">
                  <ShieldCheck size={15} className="text-[var(--accent)]" />
                  <span>Tamper-Evident Seal</span>
                </div>
                <p className="text-[12px] text-[var(--muted)] leading-relaxed">
                  SHA-256 hashes generated client-side provide mathematically verifiable timestamps.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[14px] font-medium text-[var(--text)]">
                  <FileCheck size={15} className="text-[var(--accent)]" />
                  <span>Sec. 63 BSA 2023</span>
                </div>
                <p className="text-[12px] text-[var(--muted)] leading-relaxed">
                  Export structured electronic evidence certificates recognized under Indian criminal law.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-STEP STRIP SECTION */}
      <section
        ref={stepsRef}
        className="relative z-20 border-t border-[var(--hair)] bg-[var(--panel)]/30 py-20 px-6 sm:px-12 lg:px-20"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-2 text-center sm:text-left">
            <div className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-wider">
              The 6-Phase Forensic Workflow
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-light text-[var(--text)]">
              FROM CHAOTIC INCIDENT TO TAMPER-EVIDENT VAULT
            </h2>
            <p className="text-[14px] text-[var(--muted)] max-w-2xl">
              A structured, protective intake pipeline designed to minimize friction during high-stress moments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stepsList.map((step) => (
              <div
                key={step.num}
                className="temporal-card p-6 space-y-4 relative group"
              >
                <div className="flex items-center justify-between border-b border-[var(--hair)] pb-3">
                  <span className="font-mono text-[12px] text-[var(--accent)] font-medium">
                    PHASE {step.num}
                  </span>
                  <div className="w-8 h-8 rounded-[var(--radius-xs)] bg-[var(--bg)] border border-[var(--hair)] flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-[16px] font-medium text-[var(--text)] group-hover:text-[var(--accent-bright)] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TODAY VS WITH CHRONOVAULT COMPARISON */}
      <section className="relative z-20 border-t border-[var(--hair)] py-20 px-6 sm:px-12 lg:px-20 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-2 text-center">
            <div className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-wider">
              Comparative Analysis
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-light text-[var(--text)]">
              TODAY VS. WITH CHRONOVAULT
            </h2>
            <p className="text-[14px] text-[var(--muted)] max-w-xl mx-auto">
              How standard ad-hoc screenshotting fails victims — and how cryptographic timestamps change the outcome.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Without CHRONOVAULT */}
            <div className="p-8 rounded-[var(--radius-sm)] border border-[var(--danger)]/30 bg-[var(--danger-bg)]/20 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--danger)] font-mono text-[13px] font-medium uppercase tracking-wider">
                  <AlertOctagon size={16} />
                  <span>Ad-Hoc Response (Without Vault)</span>
                </div>
                <div className="font-mono text-[14px] text-[var(--text)] space-y-2">
                  <div className="p-3 bg-[var(--bg)]/80 rounded border border-[var(--danger)]/20 text-[13px]">
                    <span className="text-[var(--danger)] font-bold">1. Find</span> → Discover abusive profile or image
                  </div>
                  <div className="p-3 bg-[var(--bg)]/80 rounded border border-[var(--danger)]/20 text-[13px]">
                    <span className="text-[var(--danger)] font-bold">2. Panic</span> → Stress and uncertainty on what to save
                  </div>
                  <div className="p-3 bg-[var(--bg)]/80 rounded border border-[var(--danger)]/20 text-[13px]">
                    <span className="text-[var(--danger)] font-bold">3. Screenshot</span> → Random gallery photos without hash or headers
                  </div>
                  <div className="p-3 bg-[var(--bg)]/80 rounded border border-[var(--danger)]/20 text-[13px]">
                    <span className="text-[var(--danger)] font-bold">4. Post Deleted</span> → Perpetrator removes trace, leaving no proof
                  </div>
                  <div className="p-3 bg-[var(--bg)]/80 rounded border border-[var(--danger)]/20 text-[13px]">
                    <span className="text-[var(--danger)] font-bold">5. Lose Track</span> → Complaint dismissed due to lack of tamper-proof logs
                  </div>
                </div>
              </div>
              <div className="text-[12px] text-[var(--muted)] pt-3 border-t border-[var(--hair)]">
                Result: Unsubstantiated screenshots easily contested in official inquiries.
              </div>
            </div>

            {/* With CHRONOVAULT */}
            <div className="p-8 rounded-[var(--radius-sm)] border border-[var(--accent)]/40 bg-[var(--panel)] shadow-[var(--spill-glow)] space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-[13px] font-medium uppercase tracking-wider">
                  <ShieldCheck size={16} />
                  <span>With CHRONOVAULT Evidence Vault</span>
                </div>
                <div className="font-mono text-[14px] text-[var(--text)] space-y-2">
                  <div className="p-3 bg-[var(--bg)] rounded border border-[var(--hair)] text-[13px]">
                    <span className="text-[var(--accent)] font-bold">1. Discover</span> → Catalog handle, URL, and time
                  </div>
                  <div className="p-3 bg-[var(--bg)] rounded border border-[var(--hair)] text-[13px]">
                    <span className="text-[var(--accent)] font-bold">2. Preserve</span> → Media & network headers captured locally
                  </div>
                  <div className="p-3 bg-[var(--bg)] rounded border border-[var(--hair)] text-[13px]">
                    <span className="text-[var(--accent)] font-bold">3. Verify</span> → In-browser SHA-256 NIST hash lock
                  </div>
                  <div className="p-3 bg-[var(--bg)] rounded border border-[var(--hair)] text-[13px]">
                    <span className="text-[var(--accent)] font-bold">4. Organise</span> → Interactive correlation timeline & trace graph
                  </div>
                  <div className="p-3 bg-[var(--bg)] rounded border border-[var(--hair)] text-[13px]">
                    <span className="text-[var(--accent)] font-bold">5. Report</span> → Section 63 BSA 2023 certified dossier packet
                  </div>
                </div>
              </div>
              <div className="text-[12px] text-[var(--accent-bright)] pt-3 border-t border-[var(--hair)] flex items-center justify-between">
                <span>Result: Tamper-evident proof sealed before content is wiped.</span>
                <Link to="/incident/new" className="text-[var(--accent)] font-semibold hover:underline">
                  Start case →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-30 border-t border-[var(--hair)] py-8 px-6 sm:px-12 lg:px-20 bg-[var(--bg)] text-[13px] text-[var(--muted)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="font-medium text-[var(--text)]">
              CHRONOVAULT · Code Divas Forensic Engineering
            </div>
            <div className="text-[12px] text-[var(--muted)]">
              Prepares your complaint. Filing is done on{' '}
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                cybercrime.gov.in
              </a>
              .
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-[12px]">
            <span className="text-[var(--text-secondary)]">UTC Synchronized</span>
            <LiveClock className="text-[var(--accent)]" />
          </div>
        </div>
      </footer>
    </div>
  );
};
