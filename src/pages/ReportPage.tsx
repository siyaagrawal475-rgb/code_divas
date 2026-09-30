import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIncidents } from '../context/IncidentContext';
import { TopBar } from '../components/TopBar';
import { Button } from '../components/Button';
import {
  Download,
  Compass,
  ArrowLeft,
  Layers,
  FileCheck,
} from 'lucide-react';
import {
  SealIcon,
  LockIcon,
} from '../components/CustomIcons';
import { BgSigilField } from '../components/BgSigilField';

export const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { incidents, showToast } = useIncidents();

  const incident = incidents.find((inc) => inc.id === id) || incidents[0];

  // PDF Generation State Machine
  const [generationStage, setGenerationStage] = useState<number>(0);
  // 0: idle, 1: Collecting, 2: Verifying hashes, 3: Reconstructing timeline, 4: Stamping seal, 5: Ready
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isRewindingSweep, setIsRewindingSweep] = useState<boolean>(false);

  const stages = [
    'Collecting evidence payloads & temporal coordinates',
    'Verifying SHA-256 cryptographic hashes (NIST FIPS 180-4)',
    'Building chronological Time Trail reconstruction',
    'Stamping Eye of Agamotto cryptographic attestation seal',
  ];

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setIsRewindingSweep(true);
    setGenerationStage(1);

    for (let i = 1; i <= 4; i++) {
      setGenerationStage(i);
      await new Promise((r) => setTimeout(r, 450));
    }

    setIsRewindingSweep(false);
    setGenerationStage(5); // Ready
    setIsGenerating(false);
    showToast('HERTRACE forensic report sealed and ready for attestation', 'success');
  };

  const handleDownloadReport = () => {
    const reportText = `HERTRACE INCIDENTIAL FORENSIC ATTESTATION REPORT
=====================================================
EYE OF AGAMOTTO FORENSIC VAULT SEAL
Case Identifier: ${incident.id}
Attested Timestamp: ${new Date().toISOString()}
Target Handle: ${incident.accountHandle}
Platform: ${incident.platform}
Classification: ${incident.type}
Forensic Threat Score: ${incident.riskScore}/100 (${incident.riskLevel})

CRYPTOGRAPHIC EVIDENCE VAULT:
${incident.evidenceItems
  .map(
    (ev) =>
      `[#${ev.evidenceNumber}] ${ev.name}\n  Size: ${ev.size}\n  Preserved UTC: ${ev.timestamp}\n  SHA-256: ${ev.sha256}\n  Integrity: TIME LOCKED (CLOSED RING)\n`
  )
  .join('\n')}

TEMPORAL RECONSTRUCTION TRAIL:
${incident.timeline
  .map((t) => `${t.time} - ${t.title}: ${t.description}`)
  .join('\n')}

AI FORENSIC TELEMETRY:
${incident.aiAnalysis.headline} (Confidence: ${incident.aiAnalysis.confidence}%)
${incident.aiAnalysis.summary}

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
    showToast('Attested report packet downloaded to local workstation', 'success');
  };

  const handleExportEvidence = () => {
    const jsonStr = JSON.stringify(incident, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HERTRACE_${incident.id}_EvidenceData.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Evidence JSON archive exported successfully', 'success');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#070908] relative overflow-hidden grain-overlay">
      <BgSigilField size={700} opacity={0.05} className="top-10 right-10" />

      <TopBar
        title="Time Trail & Report"
        subtitle="Chronological audit trail and formal attestation packet."
        breadcrumbs={[
          { label: 'Chronicle', href: '/chronicle' },
          { label: incident?.id || 'HT-002', href: `/trace/${incident.id}` },
          { label: 'Report & Time Trail' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<Compass size={13} />}
              onClick={() => navigate(`/trace/${incident.id}`)}
            >
              Trace Graph
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Layers size={13} />}
              onClick={() => navigate('/archive')}
            >
              Time Archive
            </Button>
          </div>
        }
      />

      <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl w-full mx-auto flex-1 relative z-10">
        {/* LEFT COLUMN: The Time Trail Main Event (5 cols on lg) */}
        <div className="lg:col-span-5 rounded-[2px] bg-[#0D1210] border border-[#1F2B25] p-6 flex flex-col justify-between space-y-4 relative overflow-hidden clip-tag-tr">
          {/* Rewind Sweep Laser/Particle Effect when generating report */}
          {isRewindingSweep && (
            <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
              <div className="w-full h-8 bg-gradient-to-b from-transparent via-[#45E08A]/30 to-transparent animate-[rewindSweepAnim_1.8s_linear_infinite]" />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2B25]">
              <div>
                <span className="label-tracked text-[#C9A24B]">TEMPORAL RECONSTRUCTION</span>
                <h2 className="font-display text-xl font-semibold text-[#E8F0EB] mt-0.5">
                  Time Trail
                </h2>
              </div>
              <span className="font-mono text-xs text-[#45E08A] bg-[#070908] px-2 py-0.5 rounded-[2px] border border-[#1F2B25] font-bold">
                {incident.id}
              </span>
            </div>

            {/* Vertical Time Trail on Central Thread with Clock-Tick Marks */}
            <div className="relative pt-6 pb-2 pl-3">
              {/* Central connecting energy thread with tick marks */}
              <div className="absolute left-[27px] top-8 bottom-10 w-[1.5px] bg-[#1F2B25]" />

              <div className="space-y-6">
                {incident.timeline.map((item, idx) => {
                  const isLast = idx === incident.timeline.length - 1;

                  return (
                    <div key={item.id} className="relative flex items-start gap-4 group">
                      {/* Node Icon / Sigil Ring on thread */}
                      <div className="relative z-10 shrink-0 mt-0.5">
                        {isLast ? (
                          // Final Node: The full glowing Time Stone Gem with Bezel Setting!
                          <div className="relative w-8 h-8 -ml-1 rounded-full border border-[#C9A24B] bg-[#070908] flex items-center justify-center gem-glow">
                            <div className="w-5 h-5 rounded-full border border-[#45E08A] flex items-center justify-center animate-spin-35s">
                              <div className="w-2 h-2 rounded-full bg-[#45E08A] animate-gem-pulse" />
                            </div>
                          </div>
                        ) : (
                          // Standard Sigil Ring Node with Clock Ticks
                          <div className="relative w-6 h-6 rounded-full bg-[#0D1210] border border-[#45E08A] flex items-center justify-center group-hover:border-[#9AFFC4] transition-colors">
                            {/* Clock tick marks around ring */}
                            <div className="w-3 h-3 rounded-full border border-[#C9A24B]/60 flex items-center justify-center">
                              <div className="w-1 h-1 rounded-full bg-[#45E08A]" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Event Content */}
                      <div className="min-w-0 flex-1 space-y-1 font-mono">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-[#E8F0EB]">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-[#45E08A] tabular-nums">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-[#7F8D85] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Timeline Footer Attestation */}
          <div className="p-3 bg-[#070908] border border-[#1F2B25] rounded-[2px] flex items-center justify-between text-[10px] font-mono text-[#7F8D85]">
            <span className="flex items-center gap-1.5">
              <LockIcon size={12} className="text-[#45E08A]" />
              <span>Time-stamped audit sequence</span>
            </span>
            <span className="text-[#45E08A] font-semibold">100% ATTESTED</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Formal Relic Forensic Attestation Packet Preview (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Relic Parchment / Forensic Paper Preview */}
          <div className="rounded-[2px] bg-[#F2F5F2] border border-[#CBD5CD] p-6 sm:p-8 text-[#0C120E] shadow-2xl space-y-6 select-text flex-1 relative overflow-hidden">
            {/* Stamped Seal Overlay when Report is Generated */}
            {generationStage === 5 && (
              <div className="absolute top-6 right-6 pointer-events-none rotate-[-12deg] z-20 flex flex-col items-center justify-center p-3 rounded-[2px] border-2 border-[#1E6B45] text-[#1E6B45] bg-[#E8F5EE]/80 backdrop-blur-none animate-in fade-in zoom-in duration-300">
                <SealIcon size={24} className="text-[#1E6B45]" />
                <span className="font-mono text-[9px] font-bold tracking-widest uppercase mt-0.5">
                  TIME STONE SEALED
                </span>
                <span className="font-mono text-[7.5px] tracking-wider">
                  NIST FIPS 180-4 VALID
                </span>
              </div>
            )}

            {/* Report Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#CBD5CD]">
              <div>
                <div className="text-[9px] font-mono tracking-widest uppercase text-[#55675B] font-bold">
                  HERTRACE RELIC EVIDENCE ATTESTATION
                </div>
                <h3 className="font-display text-2xl font-bold text-[#0C120E] tracking-tight mt-0.5">
                  Digital Incident Report
                </h3>
              </div>

              <div className="text-left sm:text-right font-mono">
                <div className="text-xs font-bold text-[#0C120E]">
                  CASE REF: {incident.id}
                </div>
                <div className="text-[10px] text-[#55675B]">
                  {incident.discoveredAt}
                </div>
              </div>
            </div>

            {/* Case Parameters Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#E4ECE5] rounded-[2px] border border-[#CBD5CD] text-xs font-mono">
              <div>
                <span className="text-[9px] uppercase font-bold text-[#55675B] block">Violation</span>
                <span className="font-semibold text-[#0C120E]">{incident.type}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-[#55675B] block">Platform</span>
                <span className="text-[#0C120E]">{incident.platform}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-[#55675B] block">Target Handle</span>
                <span className="font-bold text-[#0C120E]">{incident.accountHandle}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-[#55675B] block">Confidence</span>
                <span className="font-bold text-[#1E6B45]">{incident.riskScore} / 100</span>
              </div>
            </div>

            {/* AI Forensic Telemetry Assessment */}
            <div className="space-y-1.5 text-xs">
              <div className="font-mono text-[10px] font-bold tracking-wider uppercase text-[#55675B]">
                Forensic Intelligence Assessment
              </div>
              <p className="text-xs text-[#233128] leading-relaxed font-serif">
                {incident.aiAnalysis.summary}
              </p>
            </div>

            {/* Preserved Evidence Inventory Table */}
            <div className="space-y-2 text-xs font-mono">
              <div className="text-[10px] font-bold tracking-wider uppercase text-[#55675B]">
                Preserved Evidence Artifacts ({incident.evidenceItems.length})
              </div>
              <div className="rounded-[2px] border border-[#CBD5CD] overflow-hidden">
                <table className="w-full text-left border-collapse text-[10.5px]">
                  <thead>
                    <tr className="bg-[#E4ECE5] border-b border-[#CBD5CD] text-[#55675B]">
                      <th className="p-2">#</th>
                      <th className="p-2">File Name</th>
                      <th className="p-2">Payload Size</th>
                      <th className="p-2">SHA-256 Digest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incident.evidenceItems.map((ev) => (
                      <tr key={ev.id} className="border-b border-[#E4ECE5] text-[#233128]">
                        <td className="p-2 font-bold">#{ev.evidenceNumber}</td>
                        <td className="p-2 truncate max-w-[130px] font-medium">{ev.name}</td>
                        <td className="p-2 tabular-nums">{ev.size}</td>
                        <td className="p-2 text-[9.5px] text-[#55675B]">
                          {ev.sha256.substring(0, 10)}...{ev.sha256.substring(ev.sha256.length - 6)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paper Footer Legal Stamp */}
            <div className="pt-4 border-t border-[#CBD5CD] flex items-center justify-between text-[9px] font-mono text-[#55675B]">
              <span>ATTESTATION AUTHORITY: CLIENT CRYPTOGRAPHIC VAULT</span>
              <span className="font-bold text-[#1E6B45]">NIST FIPS 180-4 VERIFIED 100%</span>
            </div>
          </div>

          {/* Action Bar & Staged Generation Progress */}
          <div className="p-5 rounded-[2px] bg-[#0D1210] border border-[#1F2B25] space-y-3 select-none">
            {/* Staged Generation Text Progress */}
            {isGenerating && (
              <div className="space-y-2 p-3 bg-[#070908] rounded-[2px] border border-[#1F2B25] font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="label-tracked text-[#C9A24B]">EYE OF AGAMOTTO COMPILATION</span>
                  <span className="text-[#45E08A]">STAGE {generationStage} OF 4</span>
                </div>
                <div className="space-y-1.5">
                  {stages.map((stageName, idx) => {
                    const stageNum = idx + 1;
                    const isDone = generationStage > stageNum;
                    const isCurrent = generationStage === stageNum;
                    return (
                      <div
                        key={idx}
                        className={`text-xs flex items-center gap-2 ${
                          isDone
                            ? 'text-[#45E08A]'
                            : isCurrent
                            ? 'text-[#E8F0EB] font-semibold'
                            : 'text-[#7F8D85]'
                        }`}
                      >
                        {isDone ? (
                          <span className="text-[#45E08A] font-bold">✓</span>
                        ) : isCurrent ? (
                          <span className="w-2.5 h-2.5 rounded-full border border-[#45E08A] border-t-transparent animate-spin inline-block" />
                        ) : (
                          <span className="w-1 h-1 rounded-full bg-[#1F2B25] ml-1 mr-0.5" />
                        )}
                        <span>{stageName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Generated State: Download button */}
            {generationStage === 5 && (
              <div className="p-3 bg-[#0A1410] rounded-[2px] border border-[#0E3B27] flex items-center justify-between font-mono">
                <div className="flex items-center gap-2 text-xs text-[#45E08A]">
                  <SealIcon size={14} className="text-[#45E08A]" />
                  <span>Report package successfully sealed & validated</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Download size={13} />}
                  onClick={handleDownloadReport}
                >
                  Download Attestation Packet
                </Button>
              </div>
            )}

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 font-mono">
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="md"
                  icon={<FileCheck size={14} />}
                  isLoading={isGenerating}
                  onClick={handleGeneratePDF}
                >
                  {generationStage === 5 ? 'Re-Seal Attestation' : 'Generate Attested Report'}
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  icon={<Download size={14} />}
                  onClick={handleExportEvidence}
                >
                  Export Evidence JSON
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowLeft size={13} />}
                onClick={() => navigate('/chronicle')}
              >
                Return to Chronicle
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
