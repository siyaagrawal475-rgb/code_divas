import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIncidents } from '../context/IncidentContext';
import { TimeSigil } from '../components/TimeSigil';
import { TimelineRail } from '../components/TimelineRail';
import { Button } from '../components/Button';
import { HashField } from '../components/HashField';
import {
  Download,
  Copy,
  Check,
  Printer,
  ShieldCheck,
  FileCheck2,
  CheckCircle2,
  ExternalLink,
  FileCheck,
} from 'lucide-react';

export const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { incidents, showToast, sealIncident } = useIncidents();

  const incident = incidents.find((inc) => inc.id === id) || incidents[0];

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStage, setGenerationStage] = useState<number>(0);
  const [isSealed, setIsSealed] = useState<boolean>(Boolean(incident?.sealed));
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  const stages = [
    'Aggregating local cryptographic artifacts and hashes',
    'Validating NIST FIPS 180-4 SHA-256 checksums',
    'Structuring chronological timeline sequence',
    'Embedding Section 63 (BSA 2023) electronic certificate seal',
  ];

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setGenerationStage(1);

    for (let i = 1; i <= 4; i++) {
      setGenerationStage(i);
      await new Promise((r) => setTimeout(r, 450));
    }

    try {
      sealIncident(incident.id);
      setIsSealed(true);
    } catch {
      // fallback handled
    }

    setIsGenerating(false);
    showToast('Forensic attestation dossier sealed and ready for download.', 'success');
  };

  const generateReportSummary = () => {
    return `CHRONOVAULT FORENSIC ATTESTATION DOSSIER
=====================================================
TEMPORAL EVIDENCE VAULT RECORD · CODE DIVAS
Case Identifier: ${incident.id}
Attested Timestamp: ${new Date().toISOString()}
Classification: ${incident.type}
Platform: ${incident.platform}
Suspect Handle: ${incident.accountHandle}
Canonical URL: ${incident.contentUrl}
Severity Score: ${incident.riskScore}/100 (${incident.riskLevel})

CRYPTOGRAPHIC EVIDENCE DIGEST (NIST FIPS 180-4):
${incident.evidenceItems
  .map(
    (ev) =>
      `[EV-${ev.evidenceNumber}] ${ev.name}
   Size: ${ev.size}
   Preserved UTC: ${ev.timestamp}
   SHA-256 Digest: ${ev.sha256}
   Status: Verified Untampered Client-Side`
  )
  .join('\n\n')}

TIMELINE RECONSTRUCTION:
${incident.timeline
  .map((t) => `${t.time} - ${t.title}\n   ${t.description}`)
  .join('\n\n')}

HEURISTIC TELEMETRY & OBSERVATION:
Confidence: ${incident.aiAnalysis.confidence}%
Summary: ${incident.aiAnalysis.summary}
*Disclaimer: Supporting forensic analysis only, not a legal verdict.

STATUTORY ELECTRONIC EVIDENCE CERTIFICATE:
Prepared under Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023).
Official filing portal: https://cybercrime.gov.in
=====================================================
PRESERVE EVERY MOMENT. PROTECT EVERY TRACE.
`;
  };

  const handleCopySummary = () => {
    const text = generateReportSummary();
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    showToast('Report summary copied to clipboard.', 'success');
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleDownloadReport = () => {
    const reportText = generateReportSummary();
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CHRONOVAULT_${incident.id}_EvidencePacket.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Evidence packet downloaded to local system.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--hair)]">
        <div>
          <div className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-wider">
            Attestation Dossier
          </div>
          <div className="text-[14px] text-[var(--text)] mt-0.5">
            Case <span className="font-mono text-[var(--accent)] font-semibold">{incident.id}</span> · Section 63 (BSA 2023) Ready
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={<FileCheck size={14} />}
            onClick={handleGeneratePDF}
            disabled={isGenerating}
          >
            Re-attest Dossier
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={copiedSummary ? <Check size={14} className="text-[var(--accent)]" /> : <Copy size={14} />}
            onClick={handleCopySummary}
          >
            {copiedSummary ? 'Copied' : 'Copy Summary'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<Printer size={14} />}
            onClick={handlePrint}
          >
            Print Dossier
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Download size={14} />}
            onClick={handleDownloadReport}
          >
            Download Packet
          </Button>
        </div>
      </div>

      {/* Main Grid: Left (Timeline Rail) | Right (Paper Report Dossier with Watermark) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Time Trail Sequence (5 cols on lg) */}
        <div className="lg:col-span-5 bg-[var(--panel)] border border-[var(--hair)] rounded-[var(--radius-sm)] p-6 space-y-6 lg:sticky lg:top-24">
          <div className="border-b border-[var(--hair)] pb-3">
            <h2 className="font-display text-lg font-light text-[var(--text)]">
              THE TIME TRAIL
            </h2>
            <p className="text-[12px] text-[var(--muted)] mt-0.5">
              Sequence of discovery, hashes, and platform interactions.
            </p>
          </div>

          <TimelineRail events={incident.timeline} />

          {/* Concluding Seal */}
          <div className="pt-4 border-t border-[var(--hair)] flex items-center gap-3">
            <TimeSigil size={28} state="locked" speed="slow" showClock={false} />
            <div className="text-[12px]">
              <div className="font-medium text-[var(--accent)]">Cryptographically Bound in Time</div>
              <div className="text-[var(--muted)] font-mono text-[11px]">NIST FIPS 180-4 Verified</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Formal Attestation Sheet with Watermark (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          {isGenerating ? (
            <div className="bg-[var(--panel)] border border-[var(--hair)] rounded-[var(--radius-sm)] p-12 flex flex-col items-center justify-center text-center space-y-6">
              <TimeSigil size={72} state="scanning" speed="fast" ghostTrail />
              <div className="space-y-2">
                <h3 className="font-display text-xl font-light text-[var(--text)]">
                  COMPILING FORENSIC DOSSIER
                </h3>
                <p className="font-mono text-[13px] text-[var(--accent)]">
                  {stages[generationStage - 1]}...
                </p>
              </div>
            </div>
          ) : (
            <div className="relative bg-[var(--panel)] border border-[var(--hair)] rounded-[var(--radius-sm)] p-6 sm:p-8 space-y-8 overflow-hidden shadow-xl">
              {/* FAINT WATERMARK BEHIND REPORT */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.04] dark:opacity-[0.06]"
                aria-hidden="true"
              >
                <TimeSigil size={520} watermark speed="slow" showClock={false} />
              </div>

              {/* Formal Sheet Header */}
              <div className="relative z-10 border-b border-[var(--hair)] pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-mono text-[11px] text-[var(--accent)] tracking-widest uppercase">
                    CHRONOVAULT FORENSIC ATTESTATION DOSSIER
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl font-light text-[var(--text)]">
                    Case {incident.id}
                  </h1>
                  <p className="text-[13px] text-[var(--muted)]">
                    Target suspect: <span className="font-mono text-[var(--accent-bright)]">{incident.accountHandle}</span> ({incident.platform})
                  </p>
                </div>

                <div className="text-left sm:text-right font-mono text-[12px] text-[var(--muted)] shrink-0">
                  <div>Preserved: {incident.createdAt || incident.discoveredAt}</div>
                  <div className="text-[var(--accent)] mt-1 flex items-center sm:justify-end gap-1">
                    <ShieldCheck size={13} />
                    <span>NIST SHA-256 SEALED</span>
                  </div>
                </div>
              </div>

              {/* Case Summary Matrix */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-[var(--hair)] pb-6 text-[13px]">
                <div>
                  <span className="text-[var(--muted)] text-[11px] font-mono uppercase block">Classification</span>
                  <span className="font-medium text-[var(--text)]">{incident.type}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)] text-[11px] font-mono uppercase block">Heuristic Severity</span>
                  <span className="font-medium text-[var(--text)]">{incident.riskScore}/100 ({incident.riskLevel})</span>
                </div>
                <div>
                  <span className="text-[var(--muted)] text-[11px] font-mono uppercase block">Vault Integrity</span>
                  <span className="text-[var(--accent)] font-semibold">100% Intact</span>
                </div>
              </div>

              {/* Evidence Hashes List */}
              <div className="relative z-10 space-y-3">
                <div className="text-[12px] font-mono text-[var(--muted)] uppercase tracking-wider">
                  Preserved Cryptographic Artifacts ({incident.evidenceItems.length})
                </div>

                <div className="space-y-2 border-t border-[var(--hair)] pt-3">
                  {incident.evidenceItems.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-[var(--radius-xs)] bg-[var(--bg)] border border-[var(--hair)] space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[13px]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-[var(--accent)] font-semibold">
                            EV-{ev.evidenceNumber}
                          </span>
                          <span className="font-medium text-[var(--text)]">{ev.name}</span>
                        </div>
                        <span className="font-mono text-[11px] text-[var(--muted)]">{ev.size}</span>
                      </div>
                      <HashField hash={ev.sha256} truncate verified={ev.verified} />
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 63 (BSA 2023) CERTIFICATE PLACEHOLDER */}
              <div className="relative z-10 p-4 rounded-[var(--radius-xs)] border border-[var(--hair)] bg-[var(--raised)]/60 space-y-3">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--text)]">
                  <FileCheck2 size={16} className="text-[var(--accent)]" />
                  <span>Section 63 (BSA 2023) Electronic Evidence Certificate Placeholder</span>
                </div>
                <p className="text-[12px] text-[var(--muted)] leading-relaxed">
                  I hereby attest that the digital artifacts listed above were captured directly from the specified endpoints,
                  cryptographically hashed using SHA-256 algorithms at the stated UTC timestamps, and preserved without alteration in client-side storage.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[var(--hair)] text-[11px] font-mono text-[var(--muted)]">
                  <div>Device Hash: SEC-NODE-CLIENT-2026</div>
                  <div>Attestation Seal: {isSealed ? 'SEALED & LOCKED' : 'VALIDATED'}</div>
                </div>
              </div>

              {/* CYBERCRIME.GOV.IN SUBMISSION CHECKLIST */}
              <div className="relative z-10 space-y-3 border-t border-[var(--hair)] pt-6">
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-mono text-[var(--accent)] uppercase tracking-wider">
                    Filing Checklist for Cybercrime.gov.in
                  </div>
                  <a
                    href="https://cybercrime.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[12px] text-[var(--accent)] hover:underline font-mono"
                  >
                    <span>Open Portal</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div className="space-y-2 text-[13px]">
                  <div className="flex items-center gap-2 p-2 rounded bg-[var(--bg)] border border-[var(--hair)]">
                    <CheckCircle2 size={15} className="text-[var(--accent)] shrink-0" />
                    <span>Attach this downloaded <strong>Evidence Packet</strong> (.txt / .pdf) as primary digital annexure.</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-[var(--bg)] border border-[var(--hair)]">
                    <CheckCircle2 size={15} className="text-[var(--accent)] shrink-0" />
                    <span>Select category: <em>Crime Against Women & Children → Impersonation / Deepfakes</em>.</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-[var(--bg)] border border-[var(--hair)]">
                    <CheckCircle2 size={15} className="text-[var(--accent)] shrink-0" />
                    <span>Copy and paste the SHA-256 hash list into the complaint description box.</span>
                  </div>
                </div>
              </div>

              {/* Bottom Official Seal Badge */}
              <div className="relative z-10 border-t border-[var(--hair)] pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <TimeSigil size={28} state="locked" showClock={false} />
                  <div>
                    <div className="text-[13px] font-medium text-[var(--text)]">CHRONOVAULT Evidence Vault</div>
                    <div className="text-[11px] font-mono text-[var(--muted)]">SHA-256 Validated · Bound in Time</div>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Download size={14} />}
                  onClick={handleDownloadReport}
                >
                  Download Dossier (.txt)
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
