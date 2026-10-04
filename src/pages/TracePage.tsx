// Screen 5: Trace
// Memorable element: The evidence graph with time scrub slider.

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIncidents } from '../context/IncidentContext';
import {
  Play,
  Pause,
  RotateCcw,
  User,
  Globe,
  Image as ImageIcon,
  FileCheck,
} from 'lucide-react';

interface ExtendedGraphNode {
  id: string;
  label: string;
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
    { id: 'node-account', label: 'Impersonator account', type: 'source', time: '22:21 UTC', detail: 'Fake profile registered with similar display name.' },
    { id: 'node-url', label: 'Direct message link', type: 'event', time: '22:27 UTC', detail: 'Phishing domain sent via direct message.' },
    { id: 'node-media', label: 'Modified profile image', type: 'media', time: '22:31 UTC', detail: 'Cropped portrait extracted from victim archive.' },
    { id: 'node-evidence', label: 'Cryptographic hash seal', type: 'evidence', time: '22:35 UTC', detail: 'NIST SHA-256 evidence payload generated.' },
  ];

  const allEdges = incident?.graphEdges || [
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
      }, 1200);
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
      case 'source':
        return <User size={16} className="text-[var(--accent-text)]" />;
      case 'event':
        return <Globe size={16} className="text-[var(--accent-text)]" />;
      case 'media':
        return <ImageIcon size={16} className="text-[var(--accent-text)]" />;
      default:
        return <FileCheck size={16} className="text-[var(--accent-text)]" />;
    }
  };

  const isHigh = incident.riskLevel === 'HIGH';
  const isMed = incident.riskLevel === 'MEDIUM';

  return (
    <div className="space-y-8">
      {/* 3-Column Layout: Left (Details) | Center (Graph + Scrubber) | Right (Analysis) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLUMN 1: Key facts (3 cols on lg) */}
        <div className="lg:col-span-3 bg-[var(--panel)] border border-[var(--hair)] p-6 space-y-6">
          <div>
            <div className="text-[13px] text-[var(--muted)]">Case reference</div>
            <div className="font-mono text-xl font-medium text-[var(--text)] mt-1">
              {incident.id}
            </div>
          </div>

          <div className="space-y-3.5 border-t border-[var(--hair)] pt-4 text-[13px]">
            <div>
              <span className="text-[var(--muted)] block">Classification</span>
              <span className="text-[var(--text)] font-medium">{incident.type}</span>
            </div>

            <div>
              <span className="text-[var(--muted)] block">Target handle</span>
              <span className="text-[var(--text)] font-mono">{incident.accountHandle}</span>
            </div>

            <div>
              <span className="text-[var(--muted)] block">Platform</span>
              <span className="text-[var(--text)]">{incident.platform}</span>
            </div>

            <div>
              <span className="text-[var(--muted)] block">First recorded</span>
              <span className="text-[var(--text)] font-mono">{incident.createdAt || incident.discoveredAt}</span>
            </div>

            <div>
              <span className="text-[var(--muted)] block">Severity</span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="w-2 h-2 rounded-[1px] shrink-0"
                  style={{
                    backgroundColor: isHigh
                      ? 'var(--danger)'
                      : isMed
                      ? 'var(--warn)'
                      : 'var(--accent-text)',
                  }}
                />
                <span className="text-[var(--text)] font-medium">
                  {isHigh ? 'High' : isMed ? 'Medium' : 'Low'}
                </span>
                <span className="text-[var(--muted)] font-mono">({incident.riskScore}/100)</span>
              </div>
            </div>

            <div>
              <span className="text-[var(--muted)] block">Preserved items</span>
              <span className="text-[var(--text)] font-mono">{incident.evidenceItems.length} items</span>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Evidence Graph & Time Scrubber (6 cols on lg) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[var(--panel)] border border-[var(--hair)] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--hair)] pb-4">
              <div>
                <h2 className="heading-2">Evidence sequence</h2>
                <p className="text-[13px] text-[var(--muted)] mt-1">
                  Chronological correlation of actors, messages, and payloads.
                </p>
              </div>
              <span className="font-mono text-[12px] text-[var(--accent-text)]">
                Step 0{timeStep} of 0{allNodes.length}
              </span>
            </div>

            {/* SVG Correlation Graph Canvas */}
            <div className="w-full h-64 bg-[var(--bg)] border border-[var(--hair)] relative flex items-center justify-around px-6">
              {/* Pulsing Connector Threads */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <defs>
                  <linearGradient id="threadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--hair)" />
                    <stop offset="50%" stopColor="var(--accent-text)" />
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
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                      opacity="0.85"
                    />
                  );
                })}
              </svg>

              {/* Node Elements */}
              <div className="relative z-10 w-full flex items-center justify-between">
                {allNodes.map((node, index) => {
                  const isVisible = index < timeStep;
                  const isSelected = selectedNodeId === node.id;

                  if (!isVisible) {
                    return (
                      <div
                        key={node.id}
                        className="w-12 h-12 rounded-[2px] border border-dashed border-[var(--hair)] bg-[var(--bg)] flex items-center justify-center opacity-30"
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
                      className={`w-12 h-12 rounded-[2px] border transition-colors cursor-pointer flex flex-col items-center justify-center relative ${
                        isSelected
                          ? 'border-[var(--accent-text)] bg-[var(--raised)]'
                          : 'border-[var(--hair)] bg-[var(--panel)] hover:border-[var(--muted)]'
                      }`}
                    >
                      {getNodeIcon(node.type)}
                      <span className="font-mono text-[9px] text-[var(--muted)] mt-1">
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
                    className="p-1 text-[var(--text)] hover:text-[var(--accent-text)] transition-colors cursor-pointer"
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
                  <span>Scrub timeline</span>
                </span>
                <span className="font-mono text-[var(--accent-text)]">{visibleNodes[visibleNodes.length - 1]?.time}</span>
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
                className="w-full h-1 bg-[var(--hair)] rounded-none appearance-none cursor-pointer accent-[var(--accent-text)]"
              />
            </div>

            {/* Selected Node Details Box */}
            {selectedNode && (
              <div className="p-4 bg-[var(--bg)] border border-[var(--hair)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[14px] text-[var(--text)]">
                    {selectedNode.label}
                  </span>
                  <span className="font-mono text-[12px] text-[var(--accent-text)]">
                    {selectedNode.time}
                  </span>
                </div>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                  {selectedNode.detail}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 3: Forensic Analysis & Telemetry (3 cols on lg) */}
        <div className="lg:col-span-3 bg-[var(--panel)] border border-[var(--hair)] p-6 space-y-6">
          <div>
            <div className="text-[13px] text-[var(--muted)]">Analysis confidence</div>
            <div className="font-display text-3xl font-light text-[var(--accent-text)] mt-1">
              {incident.aiAnalysis.confidence}%
            </div>
          </div>

          {/* Plain Checklist */}
          <div className="space-y-3 border-t border-[var(--hair)] pt-4 text-[13px]">
            <div className="text-[var(--muted)]">Telemetry checks</div>

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

          {/* Hedged Summary */}
          <div className="space-y-2 border-t border-[var(--hair)] pt-4">
            <div className="text-[13px] text-[var(--muted)]">Investigator summary</div>
            <p className="text-[13px] text-[var(--text)] leading-relaxed">
              {incident.aiAnalysis.summary}
            </p>
          </div>

          {/* Action to Report */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={() => reanalyzeIncident(incident.id)}
              className="app-btn-secondary w-full text-center"
            >
              Re-run forensic telemetry
            </button>
            <button
              type="button"
              onClick={() => navigate(`/report/${incident.id}`)}
              className="app-btn w-full text-center"
            >
              Generate report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
