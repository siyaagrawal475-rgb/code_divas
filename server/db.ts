import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', 'hertrace', 'data')
  : path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'hertrace.db');
export const db = new DatabaseSync(DB_PATH);

// Initialize schema
db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS incidents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    platform TEXT NOT NULL,
    accountHandle TEXT NOT NULL,
    contentUrl TEXT NOT NULL,
    discoveredAt TEXT NOT NULL,
    details TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    relativeTime TEXT NOT NULL,
    riskLevel TEXT NOT NULL,
    riskScore INTEGER NOT NULL,
    sealed INTEGER DEFAULT 0,
    sealedAt TEXT,
    sealHash TEXT,
    aiAnalysis TEXT NOT NULL,
    graphNodes TEXT NOT NULL,
    graphEdges TEXT NOT NULL,
    timeline TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS evidence (
    id TEXT PRIMARY KEY,
    evidenceNumber TEXT NOT NULL,
    incidentId TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    size TEXT NOT NULL,
    sizeBytes INTEGER NOT NULL,
    timestamp TEXT NOT NULL,
    relativeTime TEXT NOT NULL,
    sha256 TEXT NOT NULL,
    verified INTEGER DEFAULT 1,
    source TEXT NOT NULL,
    previewType TEXT NOT NULL,
    previewDataUrl TEXT,
    filePath TEXT,
    fileUrl TEXT,
    relatedEvents TEXT,
    FOREIGN KEY(incidentId) REFERENCES incidents(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    incidentId TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    hash TEXT,
    timestamp TEXT NOT NULL
  );
`);

export interface DbEvidenceItem {
  id: string;
  evidenceNumber: string;
  incidentId: string;
  name: string;
  type: string;
  size: string;
  sizeBytes: number;
  timestamp: string;
  relativeTime: string;
  sha256: string;
  verified: boolean;
  source: string;
  previewType: 'image' | 'video' | 'document' | 'audio' | 'code';
  previewDataUrl?: string;
  filePath?: string;
  fileUrl?: string;
  relatedEvents?: string[];
  isNewUpload?: boolean;
}

export interface DbIncident {
  id: string;
  title: string;
  type: string;
  platform: string;
  accountHandle: string;
  contentUrl: string;
  discoveredAt: string;
  details: string;
  createdAt: string;
  relativeTime: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  riskScore: number;
  sealed?: boolean;
  sealedAt?: string;
  sealHash?: string;
  evidenceItems: DbEvidenceItem[];
  graphNodes: any[];
  graphEdges: any[];
  aiAnalysis: any;
  timeline: any[];
}

export function getAllIncidents(): DbIncident[] {
  const stmt = db.prepare(`SELECT * FROM incidents ORDER BY createdAt DESC`);
  const rows = stmt.all() as any[];

  return rows.map((row) => {
    const evStmt = db.prepare(`SELECT * FROM evidence WHERE incidentId = ? ORDER BY evidenceNumber ASC`);
    const evRows = evStmt.all(row.id) as any[];

    const evidenceItems: DbEvidenceItem[] = evRows.map((e) => ({
      ...e,
      verified: Boolean(e.verified),
      relatedEvents: e.relatedEvents ? JSON.parse(e.relatedEvents) : [],
    }));

    return {
      ...row,
      sealed: Boolean(row.sealed),
      evidenceItems,
      graphNodes: JSON.parse(row.graphNodes || '[]'),
      graphEdges: JSON.parse(row.graphEdges || '[]'),
      aiAnalysis: JSON.parse(row.aiAnalysis || '{}'),
      timeline: JSON.parse(row.timeline || '[]'),
    };
  });
}

export function getIncidentById(id: string): DbIncident | null {
  const stmt = db.prepare(`SELECT * FROM incidents WHERE id = ?`);
  const row = stmt.get(id) as any;
  if (!row) return null;

  const evStmt = db.prepare(`SELECT * FROM evidence WHERE incidentId = ? ORDER BY evidenceNumber ASC`);
  const evRows = evStmt.all(id) as any[];

  const evidenceItems: DbEvidenceItem[] = evRows.map((e) => ({
    ...e,
    verified: Boolean(e.verified),
    relatedEvents: e.relatedEvents ? JSON.parse(e.relatedEvents) : [],
  }));

  return {
    ...row,
    sealed: Boolean(row.sealed),
    evidenceItems,
    graphNodes: JSON.parse(row.graphNodes || '[]'),
    graphEdges: JSON.parse(row.graphEdges || '[]'),
    aiAnalysis: JSON.parse(row.aiAnalysis || '{}'),
    timeline: JSON.parse(row.timeline || '[]'),
  };
}

export function insertIncident(inc: DbIncident): void {
  const stmt = db.prepare(`
    INSERT INTO incidents (
      id, title, type, platform, accountHandle, contentUrl,
      discoveredAt, details, createdAt, relativeTime,
      riskLevel, riskScore, sealed, sealedAt, sealHash,
      aiAnalysis, graphNodes, graphEdges, timeline
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  stmt.run(
    inc.id,
    inc.title,
    inc.type,
    inc.platform,
    inc.accountHandle,
    inc.contentUrl,
    inc.discoveredAt,
    inc.details,
    inc.createdAt,
    inc.relativeTime,
    inc.riskLevel,
    inc.riskScore,
    inc.sealed ? 1 : 0,
    inc.sealedAt || null,
    inc.sealHash || null,
    JSON.stringify(inc.aiAnalysis || {}),
    JSON.stringify(inc.graphNodes || []),
    JSON.stringify(inc.graphEdges || []),
    JSON.stringify(inc.timeline || [])
  );

  if (inc.evidenceItems && inc.evidenceItems.length > 0) {
    for (const ev of inc.evidenceItems) {
      insertEvidence(ev);
    }
  }

  // Audit log
  logAudit(inc.id, 'INCIDENT_CREATED', `Incident ${inc.id} created and preserved.`);
}

export function insertEvidence(ev: DbEvidenceItem): void {
  const stmt = db.prepare(`
    INSERT INTO evidence (
      id, evidenceNumber, incidentId, name, type, size, sizeBytes,
      timestamp, relativeTime, sha256, verified, source, previewType,
      previewDataUrl, filePath, fileUrl, relatedEvents
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  stmt.run(
    ev.id,
    ev.evidenceNumber,
    ev.incidentId,
    ev.name,
    ev.type,
    ev.size,
    ev.sizeBytes,
    ev.timestamp,
    ev.relativeTime,
    ev.sha256,
    ev.verified ? 1 : 0,
    ev.source,
    ev.previewType,
    ev.previewDataUrl || null,
    ev.filePath || null,
    ev.fileUrl || null,
    JSON.stringify(ev.relatedEvents || [])
  );

  logAudit(ev.incidentId, 'EVIDENCE_PRESERVED', `Preserved ${ev.name} [SHA-256: ${ev.sha256}]`, ev.sha256);
}

export function getAllEvidence(): DbEvidenceItem[] {
  const stmt = db.prepare(`SELECT * FROM evidence ORDER BY timestamp DESC`);
  const rows = stmt.all() as any[];
  return rows.map((e) => ({
    ...e,
    verified: Boolean(e.verified),
    relatedEvents: e.relatedEvents ? JSON.parse(e.relatedEvents) : [],
  }));
}

export function sealIncidentInDb(id: string, sealHash: string, sealedAt: string): boolean {
  const stmt = db.prepare(`
    UPDATE incidents
    SET sealed = 1, sealHash = ?, sealedAt = ?
    WHERE id = ?
  `);
  stmt.run(sealHash, sealedAt, id);

  logAudit(id, 'INCIDENT_SEALED', `Case cryptographically sealed with hash ${sealHash}`, sealHash);
  return true;
}

export function updateIncidentAnalysisAndGraph(
  id: string,
  aiAnalysis: any,
  graphNodes: any[],
  graphEdges: any[],
  timeline: any[]
): void {
  const stmt = db.prepare(`
    UPDATE incidents
    SET aiAnalysis = ?, graphNodes = ?, graphEdges = ?, timeline = ?
    WHERE id = ?
  `);
  stmt.run(
    JSON.stringify(aiAnalysis),
    JSON.stringify(graphNodes),
    JSON.stringify(graphEdges),
    JSON.stringify(timeline),
    id
  );
}

export function deleteIncident(id: string): boolean {
  db.prepare(`DELETE FROM evidence WHERE incidentId = ?`).run(id);
  db.prepare(`DELETE FROM incidents WHERE id = ?`).run(id);
  logAudit(id, 'INCIDENT_DELETED', `Incident ${id} deleted.`);
  return true;
}

export function logAudit(incidentId: string, action: string, details?: string, hash?: string): void {
  try {
    const stmt = db.prepare(`
      INSERT INTO audit_logs (incidentId, action, details, hash, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(incidentId, action, details || null, hash || null, new Date().toISOString());
  } catch (err) {
    console.error('Audit log error:', err);
  }
}

export function getStats() {
  const incidentsCount = (db.prepare(`SELECT COUNT(*) as count FROM incidents`).get() as any)?.count || 0;
  const evidenceCount = (db.prepare(`SELECT COUNT(*) as count FROM evidence`).get() as any)?.count || 0;
  const sealedCount = (db.prepare(`SELECT COUNT(*) as count FROM incidents WHERE sealed = 1`).get() as any)?.count || 0;
  const highRiskCount = (db.prepare(`SELECT COUNT(*) as count FROM incidents WHERE riskLevel = 'HIGH'`).get() as any)?.count || 0;

  return {
    totalIncidents: incidentsCount,
    totalEvidence: evidenceCount,
    sealedIncidents: sealedCount,
    highRiskIncidents: highRiskCount,
  };
}
