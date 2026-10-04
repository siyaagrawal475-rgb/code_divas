import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  getAllIncidents,
  getIncidentById,
  insertIncident,
  insertEvidence,
  deleteIncident,
  sealIncidentInDb,
  updateIncidentAnalysisAndGraph,
  getAllEvidence,
  getStats,
  type DbIncident,
  type DbEvidenceItem,
} from './db.ts';
import {
  calculateBufferSha256,
  generateDeterministicHash,
  generateAttestationSeal,
  formatBytes,
  getFilePreviewType,
} from './crypto.ts';
import {
  calculateRisk,
  generateAiAnalysis,
  generateDependencyGraph,
  generateTimeline,
} from './forensics.ts';
import { generateReportDocument } from './reports.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitized}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max
});

export const apiRouter = Router();

// Health check
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'HERTRACE Forensic Engine API',
    timestamp: new Date().toISOString(),
    stats: getStats(),
  });
});

// Stats telemetry
apiRouter.get('/stats', (_req, res) => {
  res.json(getStats());
});

// List all incidents
apiRouter.get('/incidents', (req, res) => {
  try {
    let incidents = getAllIncidents();
    const { q, risk, platform } = req.query as { q?: string; risk?: string; platform?: string };

    if (q) {
      const query = q.toLowerCase();
      incidents = incidents.filter(
        (inc) =>
          inc.id.toLowerCase().includes(query) ||
          inc.title.toLowerCase().includes(query) ||
          inc.accountHandle.toLowerCase().includes(query) ||
          inc.details.toLowerCase().includes(query)
      );
    }

    if (risk) {
      incidents = incidents.filter((inc) => inc.riskLevel === risk.toUpperCase());
    }

    if (platform) {
      incidents = incidents.filter((inc) => inc.platform.toLowerCase() === platform.toLowerCase());
    }

    res.json(incidents);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to retrieve incidents' });
  }
});

// Get single incident
apiRouter.get('/incidents/:id', (req, res) => {
  try {
    const incident = getIncidentById(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: `Incident ${req.params.id} not found` });
    }
    res.json(incident);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to retrieve incident' });
  }
});

// Create new incident (multipart or JSON)
apiRouter.post('/incidents', upload.array('files', 15), async (req, res) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    const body = req.body;

    const allIncidents = getAllIncidents();
    const nextNum = allIncidents.length + 1;
    const newId = `HT-${String(nextNum).padStart(3, '0')}`;
    const now = new Date();
    const isoString = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    const evidenceItems: DbEvidenceItem[] = [];

    // Process uploaded files
    if (files.length > 0) {
      let counter = 1;
      for (const f of files) {
        const fileBuffer = fs.readFileSync(f.path);
        const hash = calculateBufferSha256(fileBuffer);
        const evNum = String(counter).padStart(3, '0');
        const evId = `ev-${newId.toLowerCase()}-${counter}`;
        const previewType = getFilePreviewType(f.originalname, f.mimetype);

        const item: DbEvidenceItem = {
          id: evId,
          evidenceNumber: evNum,
          incidentId: newId,
          name: f.originalname,
          type: f.mimetype || 'Preserved artifact',
          size: formatBytes(f.size),
          sizeBytes: f.size,
          timestamp: isoString,
          relativeTime: 'Just now',
          sha256: hash,
          verified: true,
          source: 'Direct client upload (verified)',
          previewType,
          filePath: f.path,
          fileUrl: `/uploads/${f.filename}`,
          relatedEvents: ['Preservation receipt generated', 'Integrity hash locked'],
          isNewUpload: true,
        };

        evidenceItems.push(item);
        counter++;
      }
    } else {
      // Create canonical metadata anchor evidence if no raw files were attached
      const defaultHash = generateDeterministicHash(body.contentUrl || body.accountHandle || newId);
      const defaultItem: DbEvidenceItem = {
        id: `ev-${newId.toLowerCase()}-1`,
        evidenceNumber: '001',
        incidentId: newId,
        name: 'incident_metadata_anchor.json',
        type: 'application/json',
        size: '124 KB',
        sizeBytes: 126976,
        timestamp: isoString,
        relativeTime: 'Just now',
        sha256: defaultHash,
        verified: true,
        source: 'Automated platform capture',
        previewType: 'code',
        relatedEvents: ['Metadata anchor verified', 'Preservation receipt generated'],
        isNewUpload: true,
      };
      evidenceItems.push(defaultItem);
    }

    const { score: riskScore, level: riskLevel } = calculateRisk(
      body.type || 'Other',
      body.platform || 'Other',
      evidenceItems.length
    );

    const aiAnalysis = generateAiAnalysis(
      body.type || 'Impersonation',
      body.platform || 'Instagram',
      body.accountHandle || '@unknown',
      evidenceItems,
      riskScore
    );

    const { nodes: graphNodes, edges: graphEdges } = generateDependencyGraph(
      body.accountHandle || '@target_account',
      body.contentUrl || '',
      evidenceItems
    );

    const timeline = generateTimeline(
      body.type || 'Incident',
      body.platform || 'Social Web',
      evidenceItems,
      isoString
    );

    const newIncident: DbIncident = {
      id: newId,
      title: `${body.type || 'Incident'} on ${body.platform || 'Social Platform'}`,
      type: body.type || 'Other',
      platform: body.platform || 'Other',
      accountHandle: body.accountHandle || '@target_profile',
      contentUrl: body.contentUrl || 'https://preserved.canonical.url',
      discoveredAt: isoString,
      details: body.details || 'Incident evidence preserved via intake wizard.',
      createdAt: isoString,
      relativeTime: 'Just now',
      riskLevel,
      riskScore,
      sealed: false,
      evidenceItems,
      graphNodes,
      graphEdges,
      aiAnalysis,
      timeline,
    };

    insertIncident(newIncident);
    res.status(201).json(newIncident);
  } catch (err: any) {
    console.error('Create incident error:', err);
    res.status(500).json({ error: err.message || 'Failed to create incident' });
  }
});

// Upload additional evidence to an existing incident
apiRouter.post('/incidents/:id/evidence', upload.array('files', 10), (req, res) => {
  try {
    const incident = getIncidentById(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: `Incident ${req.params.id} not found` });
    }

    const files = (req.files as Express.Multer.File[]) || [];
    if (files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const now = new Date();
    const isoString = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const currentCount = incident.evidenceItems.length;
    const addedItems: DbEvidenceItem[] = [];

    files.forEach((f, idx) => {
      const fileBuffer = fs.readFileSync(f.path);
      const hash = calculateBufferSha256(fileBuffer);
      const evNum = String(currentCount + idx + 1).padStart(3, '0');
      const evId = `ev-${incident.id.toLowerCase()}-${currentCount + idx + 1}`;
      const previewType = getFilePreviewType(f.originalname, f.mimetype);

      const item: DbEvidenceItem = {
        id: evId,
        evidenceNumber: evNum,
        incidentId: incident.id,
        name: f.originalname,
        type: f.mimetype || 'Preserved artifact',
        size: formatBytes(f.size),
        sizeBytes: f.size,
        timestamp: isoString,
        relativeTime: 'Just now',
        sha256: hash,
        verified: true,
        source: 'Direct supplementary upload',
        previewType,
        filePath: f.path,
        fileUrl: `/uploads/${f.filename}`,
        relatedEvents: ['Supplemental evidence secured'],
        isNewUpload: true,
      };

      insertEvidence(item);
      addedItems.push(item);
    });

    // Re-evaluate analysis and graph with updated evidence
    const updated = getIncidentById(req.params.id)!;
    const { nodes, edges } = generateDependencyGraph(updated.accountHandle, updated.contentUrl, updated.evidenceItems);
    const analysis = generateAiAnalysis(updated.type, updated.platform, updated.accountHandle, updated.evidenceItems, updated.riskScore);
    const updatedTimeline = [
      ...updated.timeline,
      {
        id: `t-${Date.now()}-supp`,
        time: 'Just now',
        title: 'Supplementary evidence secured',
        description: `Secured ${files.length} additional artifact(s).`,
        type: 'preserved',
      },
    ];

    updateIncidentAnalysisAndGraph(incident.id, analysis, nodes, edges, updatedTimeline);

    res.status(201).json({
      message: `Preserved ${addedItems.length} artifact(s)`,
      evidence: addedItems,
      incident: getIncidentById(req.params.id),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to upload evidence' });
  }
});

// Seal and cryptographically attest incident
apiRouter.post('/incidents/:id/seal', (req, res) => {
  try {
    const incident = getIncidentById(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: `Incident ${req.params.id} not found` });
    }

    const now = new Date();
    const sealedAt = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const evidenceHashes = incident.evidenceItems.map((e) => e.sha256);
    const sealHash = generateAttestationSeal(incident.id, sealedAt, evidenceHashes);

    sealIncidentInDb(incident.id, sealHash, sealedAt);

    // Append sealed event to timeline if not already there
    const timeline = [
      ...incident.timeline,
      {
        id: `t-${Date.now()}-sealed`,
        time: 'Just now',
        title: 'Eye of Agamotto Attestation Sealed',
        description: `Cryptographic attestation stamped with seal hash ${sealHash.substring(0, 16)}...`,
        type: 'report',
      },
    ];

    updateIncidentAnalysisAndGraph(incident.id, incident.aiAnalysis, incident.graphNodes, incident.graphEdges, timeline);

    res.json({
      success: true,
      message: 'Forensic report successfully sealed and attested',
      sealedAt,
      sealHash,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to seal incident' });
  }
});

// Re-run AI analysis on an incident
apiRouter.post('/incidents/:id/reanalyze', (req, res) => {
  try {
    const incident = getIncidentById(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: `Incident ${req.params.id} not found` });
    }

    const { score: riskScore } = calculateRisk(incident.type, incident.platform, incident.evidenceItems.length);
    const analysis = generateAiAnalysis(incident.type, incident.platform, incident.accountHandle, incident.evidenceItems, riskScore);
    const { nodes, edges } = generateDependencyGraph(incident.accountHandle, incident.contentUrl, incident.evidenceItems);

    updateIncidentAnalysisAndGraph(incident.id, analysis, nodes, edges, incident.timeline);

    res.json({
      success: true,
      aiAnalysis: analysis,
      graphNodes: nodes,
      graphEdges: edges,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to reanalyze incident' });
  }
});

// Download or view formal forensic report
apiRouter.get('/incidents/:id/report', (req, res) => {
  try {
    const incident = getIncidentById(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: `Incident ${req.params.id} not found` });
    }

    const docText = generateReportDocument(incident);
    const download = req.query.download === 'true';

    if (download) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="HERTRACE_${incident.id}_EvidencePacket.txt"`);
      return res.send(docText);
    }

    res.json({
      incidentId: incident.id,
      reportText: docText,
      sealed: incident.sealed,
      sealHash: incident.sealHash,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate report' });
  }
});

// Delete incident
apiRouter.delete('/incidents/:id', (req, res) => {
  try {
    const incident = getIncidentById(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: `Incident ${req.params.id} not found` });
    }

    deleteIncident(req.params.id);
    res.json({ success: true, message: `Incident ${req.params.id} removed from vault` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete incident' });
  }
});

// Get all evidence items across all incidents
apiRouter.get('/evidence', (req, res) => {
  try {
    const evidence = getAllEvidence();
    res.json(evidence);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch evidence' });
  }
});
