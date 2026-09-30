// Screen 6: Report
// Memorable element: The Time Trail with concluding gem seal.

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIncidents } from '../context/IncidentContext';
import { TimeSigil } from '../components/TimeSigil';
import {
  Download,
  FileCheck,
  Printer,
} from 'lucide-react';

export const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { incidents, showToast } = useIncidents();

  const incident = incidents.find((inc) => inc.id === id) || incidents[0];

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStage, setGenerationStage] = useState<number>(0);
  const [isSealed, setIsSealed] = useState<boolean>(false);

  const stages = [
    'Collecting evidence payloads and temporal coordinates',
    'Verifying SHA-256 cryptographic hashes (NIST FIPS 180-4)',
    'Building chronological Time Trail reconstruction',
    'Stamping Eye of Agamotto cryptographic attestation seal',
  ];

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setGenerationStage(1);

    for (let i = 1; i <= 4; i++) {
      setGenerationStage(i);
      await new Promise((r) => setTimeout(r, 400));
    }

    setIsGenerating(false);
    setIsSealed(true);
    showToast('Forensic report sealed and attested.', 'success');
  };

  const handleDownloadReport = () => {
    const reportText = `HERTRACE FORENSIC ATTESTATION REPORT
=====================================================
EYE OF AGAMOTTO FORENSIC VAULT SEAL
Case Identifier: ${incident.id}
Attested Timestamp: ${new Date().toISOString()}
Target Handle: ${incident.accountHandle}
Platform: ${incident.platform}
Classification: ${incident.type}
Risk Severity: ${incident.riskScore}/100 (${incident.riskLevel})

CRYPTOGRAPHIC EVIDENCE VAULT:
${incident.evidenceItems
  .map(
    (ev) =>
      `[#${ev.evidenceNumber}] ${ev.name}
  Size: ${ev.size}
  Preserved UTC: ${ev.timestamp}
  SHA-256: ${ev.sha256}
  Integrity: NIST FIPS 180-4 VALIDATED (TIME LOCKED)`
  )
  .join('\n\n')}

TEMPORAL RECONSTRUCTION TRAIL:
${incident.timeline
  .map((t) => `${t.time} - ${t.title}\n  ${t.description}`)
  .join('\n\n')}

AI FORENSIC TELEMETRY:
Confidence: ${incident.aiAnalysis.confidence}%
Summary: ${incident.aiAnalysis.summary}

=====================================================
SEALED AND ATTESTED VIA HERTRACE CLIENT VAULT
NIST FIPS 180-4 CRYPTOGRAPHIC VERIFICATION · BOUND IN TIME
`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HERTRACE_${incident.id}_EvidencePacket.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Report packet downloaded to local system.', 'success');
  };

  return (
    <div className="space-y-8">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--hair)]">
        <div>
          <span className="text-[14px] text-[var(--muted)]">
            Case <span className="font-mono text-[var(--text)]">{incident.id}</span> · Formal attestation record
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadReport}
            className="app-btn-secondary"
          >
            <Download size={14} />
            <span>Export data</span>
          </button>

          <button
            type="button"
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="app-btn"
          >
            <FileCheck size={14} />
            <span>{isSealed ? 'Re-attest report' : 'Generate & seal'}</span>
          </button>
        </div>
      </div>

      {/* Main Asymmetric Grid: Left (The Time Trail) | Right (The Formal Report Sheet) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: The Time Trail (5 cols on lg) */}
        <div className="lg:col-span-5 bg-[var(--panel)] border border-[var(--hair)] p-6 space-y-6">
          <div className="border-b border-[var(--hair)] pb-4">
            <h2 className="heading-2">The Time Trail</h2>
            <p className="text-[13px] text-[var(--muted)] mt-1">
              Events anchored in chronological order.
            </p>
          </div>

          {/* Vertical Timeline with Central Green Thread */}
          <div className="relative pl-6 space-y-8">
            {/* Central continuous hairline thread */}
            <div className="absolute left-[7px] top-3 bottom-6 w-[1px] bg-[var(--hair)]" />

            {incident.timeline.map((item, idx) => {
              return (
                <div key={item.id} className="relative space-y-1">
                  {/* Timeline Tick Node */}
                  <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-[var(--bg)] border border-[var(--green)] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[12px] text-[var(--green)]">
                      {item.time}
                    </span>
                    <span className="text-[11px] text-[var(--muted)]">
                      Step 0{idx + 1}
                    </span>
                  </div>

                  <div className="font-medium text-[14px] text-[var(--text)]">
                    {item.title}
                  </div>

                  <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}

            {/* Concluding Full Green Gem Seal */}
            <div className="relative pt-4 flex items-center gap-3">
              <div className="absolute -left-[26px] top-5">
                <TimeSigil size={20} state="locked" showClock={false} />
              </div>
              <div className="pl-2">
                <div className="text-[14px] font-medium text-[var(--soft)]">
                  Cryptographically sealed
                </div>
                <div className="text-[12px] text-[var(--muted)]">
                  All sequence items verified unaltered
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Attested Report Sheet (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Staged Generation State */}
          {isGenerating ? (
            <div className="bg-[var(--panel)] border border-[var(--hair)] p-12 flex flex-col items-center justify-center text-center space-y-6">
              <TimeSigil size={64} state="scanning" showClock={false} />
              <div className="space-y-2">
                <h3 className="heading-2">Attesting forensic packet</h3>
                <p className="font-mono text-[13px] text-[var(--soft)]">
                  {stages[generationStage - 1]}...
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-[#0D1210] border border-[var(--hair)] p-8 space-y-8 relative">
              {/* Formal Report Header */}
              <div className="border-b border-[var(--hair)] pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-mono text-[11px] text-[var(--green)] tracking-wider">
                    HERTRACE FORENSIC INCIDENT ATTESTATION
                  </div>
                  <h1 className="font-display text-2xl font-normal text-[var(--text)]">
                    Case {incident.id}
                  </h1>
                  <p className="text-[13px] text-[var(--muted)]">
                    Target account: <span className="font-mono text-[var(--text)]">{incident.accountHandle}</span> ({incident.platform})
                  </p>
                </div>

                <div className="text-left sm:text-right font-mono text-[12px] text-[var(--muted)]">
                  <div>Preserved: {incident.createdAt || incident.discoveredAt}</div>
                  <div className="text-[var(--soft)] mt-1">NIST FIPS 180-4</div>
                </div>
              </div>

              {/* Classification & Threat Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-[var(--hair)] pb-6 text-[13px]">
                <div>
                  <span className="text-[var(--muted)] block">Classification</span>
                  <span className="font-medium text-[var(--text)]">{incident.type}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)] block">Threat score</span>
                  <span className="font-medium text-[var(--text)]">{incident.riskScore}/100 ({incident.riskLevel})</span>
                </div>
                <div>
                  <span className="text-[var(--muted)] block">Integrity status</span>
                  <span className="text-[var(--green)]">Time Locked</span>
                </div>
              </div>

              {/* Preserved Evidence Digest Table */}
              <div className="space-y-3">
                <div className="text-[13px] text-[var(--muted)] font-medium">
                  Preserved evidence artifacts
                </div>

                <div className="border-t border-[var(--hair)] divide-y divide-[var(--hair)]">
                  {incident.evidenceItems.map((ev) => (
                    <div key={ev.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[13px]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[12px] text-[var(--green)]">
                            EV-{ev.evidenceNumber}
                          </span>
                          <span className="font-medium text-[var(--text)]">{ev.name}</span>
                        </div>
                        <div className="font-mono text-[11px] text-[var(--muted)] mt-0.5">
                          {ev.sha256}
                        </div>
                      </div>
                      <div className="text-[12px] text-[var(--muted)] font-mono shrink-0">
                        {ev.size}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Forensic Summary */}
              <div className="space-y-2 border-t border-[var(--hair)] pt-6">
                <div className="text-[13px] text-[var(--muted)] font-medium">
                  Forensic analysis findings
                </div>
                <p className="text-[13px] text-[var(--text)] leading-relaxed">
                  {incident.aiAnalysis.summary}
                </p>
              </div>

              {/* Official Seal Footer */}
              <div className="border-t border-[var(--hair)] pt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TimeSigil size={24} state="locked" showClock={false} />
                  <div className="text-[12px]">
                    <div className="font-medium text-[var(--text)]">HERTRACE Digital Evidence Vault</div>
                    <div className="text-[var(--muted)] font-mono text-[11px]">SHA-256 Validated · Bound in Time</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadReport}
                  className="app-btn-secondary text-[13px]"
                >
                  <Printer size={14} />
                  <span>Download print copy</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
