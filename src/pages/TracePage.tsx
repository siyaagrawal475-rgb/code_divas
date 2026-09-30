import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIncidents } from '../context/IncidentContext';
import { TopBar } from '../components/TopBar';
import { Button } from '../components/Button';
import { RiskBadge } from '../components/RiskBadge';
import {
  Sparkles,
  ArrowRight,
  Info,
  X,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import {
  RegistrationMark,
  ThreadIcon,
  RewindIcon,
} from '../components/CustomIcons';
import { BgSigilField } from '../components/BgSigilField';

export const TracePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { incidents, setActiveIncidentId } = useIncidents();

  const incident = incidents.find((inc) => inc.id === id) || incidents[0];

  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-account');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [showFullAnalysisModal, setShowFullAnalysisModal] = useState<boolean>(false);

  // Time Scrub Slider State (1 to total nodes / steps)
  const [timeStep, setTimeStep] = useState<number>(4);
  const [isPlayingScrub, setIsPlayingScrub] = useState<boolean>(false);

  // Sync active incident
  React.useEffect(() => {
    if (incident && incident.id !== id) {
      setActiveIncidentId(incident.id);
    }
  }, [incident, id, setActiveIncidentId]);

  const allNodes = incident?.graphNodes || [];
  const allEdges = incident?.graphEdges || [];

  // Animate playback of time scrub
  React.useEffect(() => {
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
      }, 1100);
    }
    return () => clearInterval(interval);
  }, [isPlayingScrub, allNodes.length]);

  // Filter nodes and edges based on time scrub slider
  const visibleNodes = allNodes.slice(0, Math.max(1, timeStep));
  const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
  const visibleEdges = allEdges.filter(
    (e) => visibleNodeIds.has(e.from) && visibleNodeIds.has(e.to)
  );

  const selectedNode = allNodes.find((n) => n.id === selectedNodeId) || allNodes[0];

  const isEdgeHighlighted = (from: string, to: string) => {
    const active = hoveredNodeId || selectedNodeId;
    return from === active || to === active;
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#070908] relative overflow-hidden grain-overlay">
      <TopBar
        title="Trace Reconstruction"
        subtitle="Graph correlation with temporal replay slider."
        breadcrumbs={[
          { label: 'Chronicle', href: '/chronicle' },
          { label: incident?.id || 'HT-002' },
          { label: 'Trace Reconstruction' },
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={<ArrowRight size={13} />}
            iconPosition="right"
            onClick={() => navigate(`/report/${incident.id}`)}
          >
            Attested Report & Time Trail
          </Button>
        }
      />

      {/* Main 3-Column Asymmetric Layout */}
      <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-[1600px] w-full mx-auto flex-1 items-stretch relative z-10">
        {/* COLUMN 1: Incident Forensic Ledger Key-Values (3 cols on lg) */}
        <div className="lg:col-span-3 rounded-[2px] bg-[#0D1210] border border-[#1F2B25] p-5 flex flex-col justify-between space-y-4 clip-tag-tr">
          <div className="space-y-4 font-mono text-xs">
            <div>
              <div className="label-tracked mb-1 text-[#C9A24B]">PRESERVED CASE REF</div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-bold text-[#E8F0EB]">
                  {incident.id}
                </span>
                <RiskBadge level={incident.riskLevel} score={incident.riskScore} showScore />
              </div>
            </div>

            {/* Key-Value Properties List */}
            <div className="space-y-2.5 pt-2 border-t border-[#1F2B25] text-xs">
              <div>
                <span className="text-[#7F8D85] block text-[10px] uppercase">Classification</span>
                <span className="text-[#E8F0EB] font-semibold">{incident.type}</span>
              </div>

              <div>
                <span className="text-[#7F8D85] block text-[10px] uppercase">Target Platform</span>
                <span className="text-[#E8F0EB]">{incident.platform}</span>
              </div>

              <div>
                <span className="text-[#7F8D85] block text-[10px] uppercase">Account Handle</span>
                <span className="text-[#45E08A] font-semibold">{incident.accountHandle}</span>
              </div>

              <div>
                <span className="text-[#7F8D85] block text-[10px] uppercase">Preserved Seals</span>
                <span className="text-[#E8F0EB] tabular-nums">
                  {incident.evidenceItems.length.toString().padStart(2, '0')} artifacts bound
                </span>
              </div>

              <div>
                <span className="text-[#7F8D85] block text-[10px] uppercase">Preserved UTC Timestamp</span>
                <span className="text-[#7F8D85] text-[11px] truncate block">
                  {incident.discoveredAt}
                </span>
              </div>

              {incident.contentUrl && (
                <div>
                  <span className="text-[#7F8D85] block text-[10px] uppercase">Target URL Endpoint</span>
                  <a
                    href={incident.contentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#7F8D85] hover:text-[#45E08A] truncate block transition-colors text-[10px]"
                  >
                    {incident.contentUrl}
                  </a>
                </div>
              )}
            </div>

            {/* Forensic Risk Confidence Meter */}
            <div className="p-3 bg-[#070908] border border-[#1F2B25] rounded-[2px] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-[#7F8D85]">CONFIDENCE MATRIX</span>
                <span className="text-xs font-bold text-[#45E08A] tabular-nums">
                  {incident.riskScore} / 100
                </span>
              </div>
              <div className="w-full h-1 bg-[#1F2B25] rounded-[1px] overflow-hidden">
                <div
                  className="h-full bg-[#45E08A] rounded-[1px] transition-all duration-500"
                  style={{ width: `${incident.riskScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick link button */}
          <div className="pt-3 border-t border-[#1F2B25]">
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              icon={<ThreadIcon size={12} className="text-[#45E08A]" />}
              onClick={() => navigate('/archive')}
            >
              Browse Evidence Items ({incident.evidenceItems.length})
            </Button>
          </div>
        </div>

        {/* COLUMN 2: Evidence Graph Canvas with Rotating Sigil Field & Time Scrub (6 cols on lg) */}
        <div className="lg:col-span-6 rounded-[2px] bg-[#0D1210] border border-[#1F2B25] p-4 flex flex-col justify-between select-none relative overflow-hidden min-h-[460px]">
          {/* Graph Header Controls */}
          <div className="flex items-center justify-between z-10 mb-2 font-mono">
            <div className="flex items-center gap-2">
              <RegistrationMark size={11} className="text-[#45E08A]" />
              <span className="label-tracked text-[#E8F0EB]">RELIC CORRELATION GRAPH</span>
              <span className="text-[9px] text-[#7F8D85] bg-[#070908] px-1.5 py-0.5 rounded-[2px] border border-[#1F2B25]">
                {visibleNodes.length} / {allNodes.length} NODES
              </span>
            </div>
            <div className="text-[10px] text-[#7F8D85] hidden sm:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#45E08A] animate-pulse" />
              <span>Click node to inspect forensic payload</span>
            </div>
          </div>

          {/* SVG Graph Canvas with Rotating Mystic Spell Ring Field */}
          <div className="relative flex-1 w-full h-full min-h-[350px] bg-[#070908] rounded-[2px] border border-[#1F2B25] overflow-hidden flex items-center justify-center p-2">
            {/* Background Rotating Mystic Spell Rings behind the Graph Canvas (8% opacity) */}
            <BgSigilField size={480} opacity={0.08} className="absolute inset-0 m-auto" />

            {/* Grid Pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
              <defs>
                <pattern id="graph-grid-relic" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="0.75" fill="#1F2B25" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#graph-grid-relic)" />
            </svg>

            {/* Interactive SVG Diagram */}
            <svg
              viewBox="0 0 520 380"
              className="w-full h-full max-h-[380px] relative z-10"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <marker
                  id="arrow-relic"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#1F2B25" />
                </marker>
                <marker
                  id="arrow-active-relic"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#45E08A" />
                </marker>
              </defs>

              {/* Connecting Energy Threads with Slow Travelling Pulse */}
              {visibleEdges.map((edge) => {
                const source = visibleNodes.find((n) => n.id === edge.from);
                const target = visibleNodes.find((n) => n.id === edge.to);
                if (!source || !target) return null;

                const isHighlighted = isEdgeHighlighted(edge.from, edge.to);
                const midY = (source.y + target.y) / 2;
                const pathD = `M ${source.x} ${source.y + 18} C ${source.x} ${midY}, ${target.x} ${midY}, ${target.x} ${target.y - 18}`;

                return (
                  <g key={edge.id}>
                    {/* Base Thread */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isHighlighted ? '#45E08A' : '#1F2B25'}
                      strokeWidth={isHighlighted ? '1.75' : '1'}
                      markerEnd={isHighlighted ? 'url(#arrow-active-relic)' : 'url(#arrow-relic)'}
                      className="transition-colors duration-150"
                    />

                    {/* Animated Travelling Energy Pulse */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#9AFFC4"
                      strokeWidth="1.5"
                      className="animate-thread-pulse"
                      strokeOpacity={isHighlighted ? 0.9 : 0.4}
                    />

                    {edge.label && (
                      <text
                        x={(source.x + target.x) / 2}
                        y={midY - 4}
                        fill={isHighlighted ? '#45E08A' : '#7F8D85'}
                        fontSize="8.5"
                        fontFamily="JetBrains Mono, monospace"
                        textAnchor="middle"
                        className="select-none"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Interactive Node Boxes */}
              {visibleNodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isHovered = hoveredNodeId === node.id;
                const width = 135;
                const height = 40;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x - width / 2}, ${node.y - height / 2})`}
                    className="cursor-pointer"
                    onClick={() => setSelectedNodeId(node.id)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                  >
                    {/* If selected: rotating Time Sigil ring around node! */}
                    {isSelected && (
                      <g transform={`translate(${width / 2}, ${height / 2})`}>
                        <circle
                          r={height * 0.75}
                          fill="none"
                          stroke="#45E08A"
                          strokeWidth="0.75"
                          strokeDasharray="4 6"
                          className="animate-spin-20s"
                        />
                        <circle
                          r={height * 0.85}
                          fill="none"
                          stroke="#C9A24B"
                          strokeWidth="0.5"
                          strokeDasharray="2 4"
                          className="animate-spin-35s"
                        />
                      </g>
                    )}

                    {/* Node Container Box */}
                    <rect
                      width={width}
                      height={height}
                      rx="2"
                      fill={isSelected ? '#121A16' : isHovered ? '#101713' : '#0D1210'}
                      stroke={isSelected ? '#45E08A' : isHovered ? '#2E3E36' : '#1F2B25'}
                      strokeWidth={isSelected ? '1.5' : '1'}
                      className="transition-colors duration-150"
                    />

                    {/* Selected Active Gem Dot */}
                    {isSelected && (
                      <circle cx="9" cy="13" r="2" fill="#45E08A" className="gem-glow-sm" />
                    )}

                    {/* Node Label Text */}
                    <text
                      x={isSelected ? '16' : '10'}
                      y="16"
                      fill="#E8F0EB"
                      fontSize="10.5"
                      fontWeight="600"
                      fontFamily="Inter, sans-serif"
                    >
                      {node.label.length > 16 ? node.label.substring(0, 15) + '…' : node.label}
                    </text>

                    {/* Node Sublabel */}
                    <text
                      x="10"
                      y="29"
                      fill={isSelected ? '#45E08A' : '#7F8D85'}
                      fontSize="8.5"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {node.subLabel || node.type}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Time Scrub Slider Control Bar Under Graph */}
          <div className="mt-3 p-3 bg-[#070908] rounded-[2px] border border-[#1F2B25] space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <RewindIcon size={13} className="text-[#45E08A]" />
                <span className="label-tracked text-[#C9A24B]">TIME SCRUB REPLAY</span>
                <span className="text-[10px] text-[#7F8D85]">· ACTIVE: <strong className="text-[#E8F0EB]">{selectedNode.label}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#7F8D85]">
                  STEP {timeStep} OF {allNodes.length}
                </span>
                <button
                  onClick={() => setIsPlayingScrub(!isPlayingScrub)}
                  className="p-1 rounded-[2px] bg-[#121A16] hover:bg-[#18231E] border border-[#1F2B25] text-[#E8F0EB] text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {isPlayingScrub ? <Pause size={10} /> : <Play size={10} />}
                  <span>{isPlayingScrub ? 'PAUSE' : 'REPLAY'}</span>
                </button>
                <button
                  onClick={() => setTimeStep(allNodes.length)}
                  className="p-1 rounded-[2px] bg-[#121A16] hover:bg-[#18231E] border border-[#1F2B25] text-[#7F8D85] hover:text-[#E8F0EB] text-[10px] cursor-pointer"
                  title="Reset to present"
                >
                  <RotateCcw size={10} />
                </button>
              </div>
            </div>

            {/* Slider Input */}
            <div className="flex items-center gap-3">
              <span className="text-[9px] text-[#7F8D85]">T₀ ORIGIN</span>
              <input
                type="range"
                min={1}
                max={allNodes.length}
                value={timeStep}
                onChange={(e) => {
                  setTimeStep(parseInt(e.target.value, 10));
                  setIsPlayingScrub(false);
                }}
                className="w-full h-1 bg-[#1F2B25] rounded-[1px] appearance-none cursor-pointer accent-[#45E08A]"
              />
              <span className="text-[9px] text-[#45E08A] font-semibold">T_NOW</span>
            </div>
          </div>
        </div>

        {/* COLUMN 3: AI Telemetry & Forensic Indicators Panel (3 cols on lg) */}
        <div className="lg:col-span-3 rounded-[2px] bg-[#0D1210] border border-[#1F2B25] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4 font-mono">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="label-tracked flex items-center gap-1 text-[#45E08A]">
                  <Sparkles size={11} strokeWidth={1.5} />
                  <span>AI TELEMETRY</span>
                </span>
                <span className="text-[10px] text-[#45E08A] bg-[#070908] px-1.5 py-0.5 rounded-[2px] border border-[#1F2B25]">
                  {incident.aiAnalysis.confidence}% CONFIDENCE
                </span>
              </div>
              <h3 className="font-display text-base font-semibold text-[#E8F0EB]">
                {incident.aiAnalysis.headline}
              </h3>
            </div>

            {/* Checklist of Heuristic Indicators */}
            <div className="space-y-2">
              <div className="label-tracked text-[9px]">HEURISTIC CORRELATION INDICATORS</div>
              <div className="space-y-2">
                {incident.aiAnalysis.indicators.map((ind) => (
                  <div
                    key={ind.id}
                    className="p-2.5 rounded-[2px] bg-[#070908] border border-[#1F2B25] text-xs space-y-1"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-[#45E08A] text-[11px] font-bold">✓</span>
                      <span className="font-medium text-[#E8F0EB] text-[11px] leading-tight">
                        {ind.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#7F8D85] pl-4 leading-relaxed">
                      {ind.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidentiary Summary Box with Hedged Language */}
            <div className="p-3 bg-[#070908] border border-[#1F2B25] rounded-[2px] space-y-1.5 text-xs">
              <div className="text-[9px] text-[#7F8D85] flex items-center gap-1">
                <Info size={11} className="text-[#7F8D85]" />
                <span>EVIDENTIARY RECONSTRUCTION SUMMARY</span>
              </div>
              <p className="text-[10.5px] text-[#7F8D85] leading-relaxed">
                {incident.aiAnalysis.summary}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 border-t border-[#1F2B25] space-y-2">
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => setShowFullAnalysisModal(true)}
            >
              Inspect NIST Methodology
            </Button>
            <p className="text-[9px] font-mono text-[#7F8D85] text-center italic">
              Probabilistic automated indicators.
            </p>
          </div>
        </div>
      </div>

      {/* Full AI Analysis Modal */}
      {showFullAnalysisModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0D1210] border border-[#1F2B25] rounded-[2px] p-6 shadow-2xl space-y-4 clip-tag-tr">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2B25]">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-[#45E08A]" />
                <h3 className="font-display text-base font-semibold text-[#E8F0EB]">
                  Forensic AI Telemetry Report — {incident.id}
                </h3>
              </div>
              <button
                onClick={() => setShowFullAnalysisModal(false)}
                className="p-1 rounded-[2px] text-[#7F8D85] hover:text-[#E8F0EB]"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-[2px] bg-[#070908] border border-[#1F2B25] space-y-1">
                <div className="font-semibold text-[#E8F0EB]">
                  Confidence Assessment ({incident.aiAnalysis.confidence}%)
                </div>
                <p className="text-[10.5px] text-[#7F8D85] leading-relaxed">
                  Scored across 14 distinct perceptual hash matrices, temporal DOM registration comparisons, and linguistic token distribution analysis.
                </p>
              </div>

              <div className="space-y-2">
                <div className="label-tracked text-[9px]">FORENSIC METHODOLOGY</div>
                <ul className="list-disc list-inside space-y-1 text-[#7F8D85] text-[10.5px]">
                  <li>Client-side perceptual hashing (pHash) against source imagery.</li>
                  <li>WHOIS & DNS certificate timeline triangulation.</li>
                  <li>Natural Language Processing pattern detection for deceptive urgency.</li>
                  <li>Cryptographic digest validation via NIST FIPS 180-4 standard.</li>
                </ul>
              </div>

              <div className="p-3 rounded-[2px] bg-[#0A1410] border border-[#0E3B27] text-[10.5px] text-[#45E08A]">
                {incident.aiAnalysis.assessmentHedging}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowFullAnalysisModal(false)}
              >
                Close Analysis
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
