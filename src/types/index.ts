export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentType =
  | 'Impersonation'
  | 'Deepfake or manipulation'
  | 'Image misuse'
  | 'Harassment'
  | 'Fake link or scam'
  | 'Other';

export type Platform =
  | 'Instagram'
  | 'Facebook'
  | 'WhatsApp'
  | 'Telegram'
  | 'X'
  | 'Website'
  | 'Other';

export interface EvidenceItem {
  id: string;
  evidenceNumber: string; // e.g. "001", "004"
  incidentId: string;
  name: string;
  type: string; // e.g. "PNG image", "MP4 video", "PDF document", "TXT log"
  size: string;
  sizeBytes: number;
  timestamp: string; // e.g. "2026-09-30 10:27:14 UTC"
  relativeTime: string;
  sha256: string; // 64-char hex
  verified: boolean;
  source: string; // e.g. "Direct upload", "Browser capture", "API export"
  previewType: 'image' | 'video' | 'document' | 'audio' | 'code';
  previewDataUrl?: string;
  filePath?: string;
  fileUrl?: string;
  relatedEvents?: string[];
  isNewUpload?: boolean;
}

export interface GraphNodeData {
  id: string;
  label: string;
  type: 'account' | 'url' | 'message' | 'image' | 'evidence' | 'document';
  subLabel?: string;
  evidenceRef?: string;
  x: number;
  y: number;
}

export interface GraphEdgeData {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export interface AIAnalysis {
  headline: string;
  confidence: number; // e.g. 78
  indicators: {
    id: string;
    label: string;
    found: boolean;
    detail: string;
  }[];
  summary: string;
  assessmentHedging: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'discovered' | 'preserved' | 'hash' | 'url' | 'analysis' | 'report';
  evidenceRef?: string;
}

export interface Incident {
  id: string; // e.g. "HT-002"
  title: string;
  type: IncidentType;
  platform: Platform;
  accountHandle: string;
  contentUrl: string;
  discoveredAt: string;
  details: string;
  createdAt: string;
  relativeTime: string;
  riskLevel: RiskLevel;
  riskScore: number;
  sealed?: boolean;
  sealedAt?: string;
  sealHash?: string;
  evidenceItems: EvidenceItem[];
  graphNodes: GraphNodeData[];
  graphEdges: GraphEdgeData[];
  aiAnalysis: AIAnalysis;
  timeline: TimelineEvent[];
}
