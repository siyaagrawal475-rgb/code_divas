import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIncidents } from '../context/IncidentContext';
import { RiskMeter } from '../components/RiskMeter';
import { Button } from '../components/Button';
import {
  Play,
  Pause,
  RotateCcw,
  User,
  Globe,
  Image as ImageIcon,
  FileCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface ExtendedGraphNode {
  id: string;
  label: string;
  subLabel?: string;
  type: string;
  time: string;
  detail: string;
}

export const TracePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { incidents, setActiveIncidentId, reanalyzeIncident } = useIncidents();

  const incident = incidents.find((inc) => inc.id === id) || incidents[0];

  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-account');
  const [timeStep, setTimeStep] = useState<number>(4);
  const [isPlayingScrub, setIsPlayingScrub] = useState<boolean>(false);

  useEffect(() => {
    if (incident && incident.id !== id) {
      setActiveIncidentId(incident.id);
    }
  }, [incident, id, setActiveIncidentId]);

  const allNodes: ExtendedGraphNode[] = [
    {
      id: 'node-account',
      label: incident?.accountHandle || '@fake_profile_clone',
      subLabel: 'Cloned Identity Profile',
      type: 'account',
      time: '22:21 UTC',
      detail: 'Malicious profile registered with identical avatar photography and altered alphanumeric suffix.',
    },
    {
      id: 'node-url',
      label: incident?.contentUrl ? (incident.contentUrl.length > 30 ? incident.contentUrl.substring(0, 28) + '...' : incident.contentUrl) : 'instagram.com/fake_profile_clone...',
      subLabel: 'Dissemination Endpoint',
      type: 'url',
      time: '22:27 UTC',
      detail: 'Publicly indexed URL distributing impersonated biographical claims and unsolicited direct messages.',
    },
    {
      id: 'node-media',
      label: 'Stolen Photography Artifact',
      subLabel: 'Original Creative Image',
      type: 'image',
      time: '22:31 UTC',
      detail: 'High keypoint match to victim photography cropped and reposted without authorization.',
    },
    {
      id: 'node-evidence',
      label: 'NIST SHA-256 Vault Seal',
      subLabel: 'Cryptographic Anchor',
      type: 'evidence',
      time: '22:35 UTC',
      detail: 'Client-side SHA-256 evidence payload sealed to protect against subsequent post deletion.',
    },
  ];

  const allEdges = [
    { id: 'e1', from: 'node-account', to: 'node-url' },
    { id: 'e2', from: 'node-url', to: 'node-media' },
    { id: 'e3', from: 'node-media', to: 'node-evidence' },
  ];

  // Auto playback of time scrub slider
  useEffect(() => {
    let interval: any;
    if (isPlayingScrub) {
      interval = setInterval(() => {
        setTimeStep((prev) => {
          if (prev >= allNodes.length) {
            setIsPlayingScrub(false);
            return allNodes.length;
          }
          return prev + 1;
        });
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isPlayingScrub, allNodes.length]);

  const visibleNodes = allNodes.slice(0, Math.max(1, timeStep));
  const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
  const visibleEdges = allEdges.filter(
    (e) => visibleNodeIds.has(e.from) && visibleNodeIds.has(e.to)
  );

  const selectedNode = allNodes.find((n) => n.id === selectedNodeId) || allNodes[0];

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'account':
        return <User size={18} className="text-[var(--accent)]" />;
      case 'url':
        return <Globe size={18} className="text-[var(--accent)]" />;
      case 'image':
        return <ImageIcon size={18} className="text-[var(--accent)]" />;
      default:
        return <FileCheck size={18} className="text-[var(--accent)]" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* 3-Column Layout: Left (Case Telemetry) | Center (Graph + Scrubber) | Right (Heuristic Risk Meter) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLUMN 1: Key facts (3 cols on lg) */}
        <div className="lg:col-span-3 bg-[var(--panel)] border border-[var(--hair)] rounded-[var(--radius-sm)] p-6 space-y-6">
          <div>
            <div className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-wider">
              Case Reference
            </div>
            <div className="font-mono text-2xl font-light text-[var(--text)] mt-1">
              {incident.id}
            </div>
          </div>

          <div className="space-y-3.5 border-t border-[var(--hair)] pt-4 text-[13px]">
            <div>
              <span className="text-[var(--muted)] text-[11px] font-mono uppercase block">Classification</span>
              <span className="text-[var(--text)] font-medium">{incident.type}</span>
            </div>

            <div>
              <span className="text-[var(--muted)] text-[11px] font-mono uppercase block">Suspect handle</span>
              <span className="text-[var(--accent-bright)] font-mono">{incident.accountHandle}</span>
            </div>

            <div>
              <span className="text-[var(--muted)] text-[11px] font-mono uppercase block">Platform</span>
              <span className="text-[var(--text)]">{incident.platform}</span>
            </div>

            <div>
              <span className="text-[var(--muted)] text-[11px] font-mono uppercase block">Discovered UTC</span>
              <span className="text-[var(--text)] font-mono text-[12px]">{incident.discoveredAt}</span>
            </div>

            <div>
              <span className="text-[var(--muted)] text-[11px] font-mono uppercase block">Evidence Artifacts</span>
              <span className="text-[var(--text)] font-mono">{incident.evidenceItems.length} items preserved</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--hair)]">
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              icon={<ExternalLink size={14} />}
              onClick={() => navigate('/archive')}
            >
              Open Vault Binder
            </Button>
          </div>
        </div>

        {/* COLUMN 2: Evidence Graph & Time Scrubber (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[var(--panel)] border border-[var(--hair)] rounded-[var(--radius-sm)] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--hair)] pb-4">
              <div>
                <h2 className="font-display text-lg font-light text-[var(--text)]">
                  CORRELATION SEQUENCE
                </h2>
                <p className="text-[12px] text-[var(--muted)] mt-0.5">
                  Chronological link-graph of accounts, endpoints, and hash anchors.
                </p>
              </div>
              <span className="font-mono text-[11px] text-[var(--accent)] px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--raised)] border border-[var(--hair)]">
                Step 0{timeStep} of 0{allNodes.length}
              </span>
            </div>

            {/* SVG Correlation Graph Canvas */}
            <div className="w-full h-64 bg-[var(--bg)] border border-[var(--hair)] rounded-[var(--radius-xs)] relative flex items-center justify-around px-4">
              {/* Pulsing Connector Threads */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <defs>
                  <linearGradient id="threadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--hair)" />
                    <stop offset="50%" stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="var(--hair)" />
                  </linearGradient>
                </defs>
                {visibleEdges.map((edge) => {
                  const fromIdx = allNodes.findIndex((n) => n.id === edge.from);
                  const toIdx = allNodes.findIndex((n) => n.id === edge.to);
                  if (fromIdx === -1 || toIdx === -1) return null;

                  const x1 = ((fromIdx + 0.5) / allNodes.length) * 100;
                  const x2 = ((toIdx + 0.5) / allNodes.length) * 100;

                  return (
                    <line
                      key={`${edge.from}-${edge.to}`}
                      x1={`${x1}%`}
                      y1="50%"
                      x2={`${x2}%`}
                      y2="50%"
                      stroke="url(#threadGrad)"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                      opacity="0.9"
                    />
                  );
                })}
              </svg>

              {/* Node Buttons */}
              <div className="relative z-10 w-full flex items-center justify-between">
                {allNodes.map((node, index) => {
                  const isVisible = index < timeStep;
                  const isSelected = selectedNodeId === node.id;

                  if (!isVisible) {
                    return (
                      <div
                        key={node.id}
                        className="w-12 h-12 rounded-[var(--radius-xs)] border border-dashed border-[var(--hair)] bg-[var(--bg)] flex items-center justify-center opacity-30"
                      >
                        <span className="font-mono text-[11px] text-[var(--muted)]">0{index + 1}</span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`w-12 h-12 rounded-[var(--radius-xs)] border transition-all cursor-pointer flex flex-col items-center justify-center relative ${
                        isSelected
                          ? 'border-[var(--accent)] bg-[var(--raised)] shadow-[var(--spill-glow)] scale-105'
                          : 'border-[var(--hair)] bg-[var(--panel)] hover:border-[var(--muted)]'
                      }`}
                    >
                      {getNodeIcon(node.type)}
                      <span className="font-mono text-[9px] text-[var(--muted)] mt-0.5">
                        0{index + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Scrub Slider Control */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-[13px] text-[var(--muted)]">
                <span className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlayingScrub(!isPlayingScrub)}
                    className="p-1 text-[var(--text)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                    title={isPlayingScrub ? 'Pause playback' : 'Play chronological scrub'}
                  >
                    {isPlayingScrub ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeStep(1)}
                    className="p-1 text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                    title="Rewind to start"
                  >
                    <RotateCcw size={13} />
                  </button>
                  <span className="font-mono text-[12px]">Scrub timeline</span>
                </span>
                <span className="font-mono text-[12px] text-[var(--accent)]">
                  {visibleNodes[visibleNodes.length - 1]?.time}
                </span>
              </div>

              <input
                type="range"
                min="1"
                max={allNodes.length}
                value={timeStep}
                onChange={(e) => {
                  setTimeStep(parseInt(e.target.value, 10));
                  setIsPlayingScrub(false);
                }}
                className="w-full h-1.5 bg-[var(--hair)] rounded-full appearance-none cursor-pointer accent-[var(--accent)]"
              />
            </div>

            {/* Selected Node Details Box */}
            {selectedNode && (
              <div className="p-4 bg-[var(--bg)] border border-[var(--hair)] rounded-[var(--radius-xs)] space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-[14px] text-[var(--text)]">
                      {selectedNode.label}
                    </span>
                    <span className="block text-[11px] font-mono text-[var(--muted)]">
                      {selectedNode.subLabel}
                    </span>
                  </div>
                  <span className="font-mono text-[12px] text-[var(--accent)]">
                    {selectedNode.time}
                  </span>
                </div>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed pt-1 border-t border-[var(--hair)]">
                  {selectedNode.detail}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 3: Heuristic Telemetry & Action (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-6">
          <RiskMeter
            score={incident.riskScore}
            level={incident.riskLevel}
            confidence={incident.aiAnalysis.confidence}
            headline={incident.aiAnalysis.headline}
            summary={incident.aiAnalysis.summary}
            factors={incident.aiAnalysis.indicators}
          />

          {/* Telemetry checks */}
          <div className="space-y-3 border-t border-[var(--hair)] pt-4 text-[13px]">
            <div className="text-[var(--muted)] font-mono text-[11px] uppercase tracking-wider">Telemetry checks</div>

            <div className="flex items-center justify-between py-1 border-b border-[var(--hair)]">
              <span className="text-[var(--text)]">Handle string similarity</span>
              <span className="font-mono text-[var(--accent-text)]">94%</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[var(--hair)]">
              <span className="text-[var(--text)]">Avatar image match</span>
              <span className="font-mono text-[var(--accent-text)]">89%</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[var(--hair)]">
              <span className="text-[var(--text)]">Domain age</span>
              <span className="font-mono text-[var(--text)]">3 days</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[var(--hair)]">
              <span className="text-[var(--text)]">Hash seal integrity</span>
              <span className="text-[var(--accent-text)]">Verified</span>
            </div>
          </div>

          {/* Action to Report */}
          <div className="pt-2 space-y-3">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => reanalyzeIncident(incident.id)}
            >
              Re-run Forensic Telemetry
            </Button>
            <Button
              variant="primary"
              className="w-full"
              icon={<ArrowRight size={16} />}
              onClick={() => navigate(`/report/${incident.id}`)}
            >
              Review & Generate Dossier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
