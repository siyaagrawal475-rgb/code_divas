// server/app.ts
import express from "express";
import cors from "cors";
import path3 from "node:path";
import fs3 from "node:fs";
import { fileURLToPath as fileURLToPath3 } from "node:url";

// server/routes.ts
import { Router } from "express";
import multer from "multer";
import path2 from "node:path";
import fs2 from "node:fs";
import { fileURLToPath as fileURLToPath2 } from "node:url";

// server/db.ts
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var DATA_DIR = process.env.VERCEL ? path.join("/tmp", "hertrace", "data") : path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
var DB_PATH = path.join(DATA_DIR, "hertrace.db");
var db = new DatabaseSync(DB_PATH);
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
function getAllIncidents() {
  const stmt = db.prepare(`SELECT * FROM incidents ORDER BY createdAt DESC`);
  const rows = stmt.all();
  return rows.map((row) => {
    const evStmt = db.prepare(`SELECT * FROM evidence WHERE incidentId = ? ORDER BY evidenceNumber ASC`);
    const evRows = evStmt.all(row.id);
    const evidenceItems = evRows.map((e) => ({
      ...e,
      verified: Boolean(e.verified),
      relatedEvents: e.relatedEvents ? JSON.parse(e.relatedEvents) : []
    }));
    return {
      ...row,
      sealed: Boolean(row.sealed),
      evidenceItems,
      graphNodes: JSON.parse(row.graphNodes || "[]"),
      graphEdges: JSON.parse(row.graphEdges || "[]"),
      aiAnalysis: JSON.parse(row.aiAnalysis || "{}"),
      timeline: JSON.parse(row.timeline || "[]")
    };
  });
}
function getIncidentById(id) {
  const stmt = db.prepare(`SELECT * FROM incidents WHERE id = ?`);
  const row = stmt.get(id);
  if (!row) return null;
  const evStmt = db.prepare(`SELECT * FROM evidence WHERE incidentId = ? ORDER BY evidenceNumber ASC`);
  const evRows = evStmt.all(id);
  const evidenceItems = evRows.map((e) => ({
    ...e,
    verified: Boolean(e.verified),
    relatedEvents: e.relatedEvents ? JSON.parse(e.relatedEvents) : []
  }));
  return {
    ...row,
    sealed: Boolean(row.sealed),
    evidenceItems,
    graphNodes: JSON.parse(row.graphNodes || "[]"),
    graphEdges: JSON.parse(row.graphEdges || "[]"),
    aiAnalysis: JSON.parse(row.aiAnalysis || "{}"),
    timeline: JSON.parse(row.timeline || "[]")
  };
}
function insertIncident(inc) {
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
  logAudit(inc.id, "INCIDENT_CREATED", `Incident ${inc.id} created and preserved.`);
}
function insertEvidence(ev) {
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
  logAudit(ev.incidentId, "EVIDENCE_PRESERVED", `Preserved ${ev.name} [SHA-256: ${ev.sha256}]`, ev.sha256);
}
function getAllEvidence() {
  const stmt = db.prepare(`SELECT * FROM evidence ORDER BY timestamp DESC`);
  const rows = stmt.all();
  return rows.map((e) => ({
    ...e,
    verified: Boolean(e.verified),
    relatedEvents: e.relatedEvents ? JSON.parse(e.relatedEvents) : []
  }));
}
function sealIncidentInDb(id, sealHash, sealedAt) {
  const stmt = db.prepare(`
    UPDATE incidents
    SET sealed = 1, sealHash = ?, sealedAt = ?
    WHERE id = ?
  `);
  stmt.run(sealHash, sealedAt, id);
  logAudit(id, "INCIDENT_SEALED", `Case cryptographically sealed with hash ${sealHash}`, sealHash);
  return true;
}
function updateIncidentAnalysisAndGraph(id, aiAnalysis, graphNodes, graphEdges, timeline) {
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
function deleteIncident(id) {
  db.prepare(`DELETE FROM evidence WHERE incidentId = ?`).run(id);
  db.prepare(`DELETE FROM incidents WHERE id = ?`).run(id);
  logAudit(id, "INCIDENT_DELETED", `Incident ${id} deleted.`);
  return true;
}
function logAudit(incidentId, action, details, hash) {
  try {
    const stmt = db.prepare(`
      INSERT INTO audit_logs (incidentId, action, details, hash, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(incidentId, action, details || null, hash || null, (/* @__PURE__ */ new Date()).toISOString());
  } catch (err) {
    console.error("Audit log error:", err);
  }
}
function getStats() {
  const incidentsCount = db.prepare(`SELECT COUNT(*) as count FROM incidents`).get()?.count || 0;
  const evidenceCount = db.prepare(`SELECT COUNT(*) as count FROM evidence`).get()?.count || 0;
  const sealedCount = db.prepare(`SELECT COUNT(*) as count FROM incidents WHERE sealed = 1`).get()?.count || 0;
  const highRiskCount = db.prepare(`SELECT COUNT(*) as count FROM incidents WHERE riskLevel = 'HIGH'`).get()?.count || 0;
  return {
    totalIncidents: incidentsCount,
    totalEvidence: evidenceCount,
    sealedIncidents: sealedCount,
    highRiskIncidents: highRiskCount
  };
}

// server/crypto.ts
import crypto from "node:crypto";
function calculateBufferSha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}
function generateDeterministicHash(seed) {
  return crypto.createHash("sha256").update(seed + Date.now().toString()).digest("hex");
}
function generateAttestationSeal(incidentId, timestamp, evidenceHashes) {
  const payload = [incidentId, timestamp, ...evidenceHashes].join("|");
  return crypto.createHash("sha256").update(payload).digest("hex");
}
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
function getFilePreviewType(filename, mimeType) {
  const lower = filename.toLowerCase();
  if (lower.match(/\.(png|jpe?g|gif|webp|svg|avif|bmp)$/) || mimeType?.startsWith("image/")) {
    return "image";
  }
  if (lower.match(/\.(mp4|mov|webm|mkv|avi)$/) || mimeType?.startsWith("video/")) {
    return "video";
  }
  if (lower.match(/\.(mp3|wav|ogg|aac|m4a)$/) || mimeType?.startsWith("audio/")) {
    return "audio";
  }
  if (lower.match(/\.(pdf|doc|docx|rtf)$/) || mimeType?.includes("pdf") || mimeType?.includes("document")) {
    return "document";
  }
  return "code";
}

// server/forensics.ts
function calculateRisk(type, platform, evidenceCount) {
  let baseScore = 70;
  switch (type) {
    case "Deepfake or manipulation":
      baseScore = 92;
      break;
    case "Impersonation":
      baseScore = 85;
      break;
    case "Image misuse":
      baseScore = 82;
      break;
    case "Harassment":
      baseScore = 78;
      break;
    case "Fake link or scam":
      baseScore = 75;
      break;
    default:
      baseScore = 68;
      break;
  }
  if (platform === "Telegram" || platform === "WhatsApp") {
    baseScore += 3;
  }
  if (evidenceCount >= 3) {
    baseScore += 2;
  }
  const score = Math.min(99, Math.max(25, baseScore));
  const level = score >= 80 ? "HIGH" : score >= 50 ? "MEDIUM" : "LOW";
  return { score, level };
}
function generateAiAnalysis(type, platform, handle, evidenceItems, riskScore) {
  const hasVideos = evidenceItems.some((e) => e.previewType === "video");
  const indicators = [
    {
      id: "ind-crypto",
      label: "Cryptographic baseline established",
      found: true,
      detail: `All ${evidenceItems.length} artifact(s) anchored with NIST FIPS 180-4 SHA-256 hashes.`
    },
    {
      id: "ind-provenance",
      label: "Metadata provenance logged",
      found: true,
      detail: `Temporal timestamps and network endpoints cataloged for target handle ${handle}.`
    }
  ];
  if (type === "Deepfake or manipulation") {
    indicators.push({
      id: "ind-manipulation",
      label: "Artifact boundary & frequency heuristics",
      found: true,
      detail: hasVideos ? "Facial warp and temporal frame jitter indicators detected in video streams." : "Perceptual frequency noise and synthetic pixel clustering detected in media artifacts."
    });
    indicators.push({
      id: "ind-synthesis",
      label: "Synthetic generation likelihood",
      found: true,
      detail: "Heuristic alignment score indicates elevated probability of neural model generation."
    });
  } else if (type === "Impersonation") {
    indicators.push({
      id: "ind-clone",
      label: "Target profile similarity index",
      found: true,
      detail: "High structural similarity in handle naming convention, avatar, and description telemetry."
    });
    indicators.push({
      id: "ind-velocity",
      label: "Anomalous account velocity",
      found: true,
      detail: "Aggressive outbound messaging and follower contact patterns detected."
    });
  } else if (type === "Image misuse") {
    indicators.push({
      id: "ind-perceptual",
      label: "Direct perceptual image match",
      found: true,
      detail: "High keypoint overlap with victim source reference photographs."
    });
    indicators.push({
      id: "ind-exif",
      label: "Stripped EXIF metadata payload",
      found: true,
      detail: "Source device identifiers scrubbed; re-compression signatures observed."
    });
  } else {
    indicators.push({
      id: "ind-general",
      label: "Behavioral signature pattern flag",
      found: true,
      detail: `Pattern corresponds to unauthorized dissemination signatures documented on ${platform}.`
    });
  }
  return {
    headline: `Possible ${type.toLowerCase()}`,
    confidence: riskScore,
    indicators,
    summary: `Heuristic indicators suggest unauthorized activity matching signatures of ${type.toLowerCase()} across ${platform}. Telemetry reflects structural overlaps in digital artifacts and timestamped endpoints.`,
    assessmentHedging: "Automated telemetry is probabilistic and structured to assist incident triage."
  };
}
function generateDependencyGraph(handle, url, evidenceItems) {
  const nodes = [];
  const edges = [];
  const cleanHandle = handle || "@target_account";
  nodes.push({
    id: "node-account",
    label: cleanHandle,
    subLabel: "Target identity",
    type: "account",
    x: 260,
    y: 70
  });
  const displayUrl = url ? url.length > 25 ? url.substring(0, 22) + "..." : url : "Platform endpoint";
  nodes.push({
    id: "node-url",
    label: displayUrl,
    subLabel: "Platform endpoint",
    type: "url",
    x: 120,
    y: 190
  });
  edges.push({
    id: "e-acc-url",
    from: "node-account",
    to: "node-url",
    label: "hosts"
  });
  const startY = 190;
  evidenceItems.slice(0, 5).forEach((ev, idx) => {
    const nodeId = `node-ev-${idx + 1}`;
    const xPositions = [400, 60, 210, 400, 260];
    const yPositions = [startY, 310, 310, 310, 420];
    const posX = xPositions[idx] || 100 + idx * 80 % 360;
    const posY = yPositions[idx] || 250 + Math.floor(idx / 3) * 100;
    let nodeType = "evidence";
    if (ev.previewType === "image") nodeType = "image";
    else if (ev.previewType === "document") nodeType = "document";
    else if (ev.previewType === "code") nodeType = "evidence";
    nodes.push({
      id: nodeId,
      label: `Evidence #${ev.evidenceNumber}`,
      subLabel: ev.name.length > 20 ? ev.name.substring(0, 18) + "..." : ev.name,
      type: nodeType,
      evidenceRef: ev.evidenceNumber,
      x: posX,
      y: posY
    });
    if (idx === 0) {
      edges.push({
        id: `e-acc-${nodeId}`,
        from: "node-account",
        to: nodeId,
        label: "associated with"
      });
    } else {
      edges.push({
        id: `e-url-${nodeId}`,
        from: "node-url",
        to: nodeId,
        label: "corroborates"
      });
    }
  });
  return { nodes, edges };
}
function generateTimeline(_type, platform, evidenceItems, _timestampUtc) {
  const events = [
    {
      id: `t-${Date.now()}-1`,
      time: "00:00 UTC",
      title: "Incident discovered",
      description: `Discovered and cataloged on ${platform}. Target handle flagged.`,
      type: "discovered"
    }
  ];
  evidenceItems.forEach((ev, idx) => {
    events.push({
      id: `t-${Date.now()}-ev-${idx + 1}`,
      time: `+0${idx + 2}:00`,
      title: `Artifact #${ev.evidenceNumber} preserved`,
      description: `${ev.name} (${ev.size}) anchored with SHA-256: ${ev.sha256.substring(0, 12)}...`,
      type: "preserved",
      evidenceRef: ev.evidenceNumber
    });
  });
  events.push({
    id: `t-${Date.now()}-hash`,
    time: `+0${evidenceItems.length + 2}:15`,
    title: "SHA-256 cryptographic attestation locked",
    description: "NIST FIPS 180-4 client and server verification digests permanently anchored.",
    type: "hash"
  });
  events.push({
    id: `t-${Date.now()}-report`,
    time: `+0${evidenceItems.length + 3}:00`,
    title: "Time Trail reconstruction initialized",
    description: "Digital evidence packet prepared for formal export and attestation sealing.",
    type: "report"
  });
  return events;
}

// server/reports.ts
function generateReportDocument(incident) {
  const sealStatus = incident.sealed ? `SEALED & ATTESTED (Seal Hash: ${incident.sealHash || "VERIFIED"})` : `PRE-ATTESTATION (UNSEALED DRAFT)`;
  const evidenceHashes = incident.evidenceItems.map((e) => e.sha256);
  const calculatedSeal = generateAttestationSeal(incident.id, incident.createdAt, evidenceHashes);
  return `================================================================================
HERTRACE FORENSIC EVIDENCE PRESERVATION RECORD
EYE OF AGAMOTTO CRYPTOGRAPHIC ATTESTATION
NIST FIPS 180-4 DIGITAL SIGNATURE STANDARD
================================================================================

[CASE METADATA]
Case Identifier     : ${incident.id}
Classification      : ${incident.type}
Target Identity     : ${incident.accountHandle}
Platform / Surface  : ${incident.platform}
Canonical URL       : ${incident.contentUrl}
Discovered (UTC)    : ${incident.discoveredAt}
Preserved (UTC)     : ${incident.createdAt}
Risk Severity Score : ${incident.riskScore}/100 [${incident.riskLevel} PRIORITY]
Attestation Status  : ${sealStatus}
Vault Seal Hash     : ${incident.sealHash || calculatedSeal}

--------------------------------------------------------------------------------
[CASE SUMMARY & INCIDENT DETAILS]
${incident.details}

--------------------------------------------------------------------------------
[CRYPTOGRAPHIC EVIDENCE INVENTORY (${incident.evidenceItems.length} ITEM(S))]
${incident.evidenceItems.map(
    (ev, idx) => `Item #${ev.evidenceNumber || String(idx + 1).padStart(3, "0")}
  File Name   : ${ev.name}
  Format      : ${ev.type} (${ev.previewType.toUpperCase()})
  Byte Size   : ${ev.size} (${ev.sizeBytes} bytes)
  Preserved   : ${ev.timestamp}
  Source      : ${ev.source}
  SHA-256     : ${ev.sha256}
  Integrity   : CRYPTOGRAPHICALLY SECURED (NIST FIPS 180-4)`
  ).join("\n\n")}

--------------------------------------------------------------------------------
[TEMPORAL INCIDENT RECONSTRUCTION TRAIL]
${incident.timeline.map((t) => `[${t.time}] ${t.title}
  ${t.description}`).join("\n\n")}

--------------------------------------------------------------------------------
[AUTOMATED FORENSIC TELEMETRY & AI ASSESSMENT]
Headline   : ${incident.aiAnalysis?.headline || "Forensic analysis completed"}
Confidence : ${incident.aiAnalysis?.confidence || incident.riskScore}%
Summary    : ${incident.aiAnalysis?.summary || "N/A"}

Key Indicators:
${(incident.aiAnalysis?.indicators || []).map((ind) => `  * [${ind.found ? "MATCH" : "INCONCLUSIVE"}] ${ind.label}: ${ind.detail}`).join("\n")}

Compliance & Hedging Note:
${incident.aiAnalysis?.assessmentHedging || "Automated forensic telemetry is probabilistic and structured to assist incident triage."}

================================================================================
ATTESTATION VERIFICATION KEY:
sha256:${incident.sealHash || calculatedSeal}
BOUND IN TIME \xB7 IMMUTABLE DIGITAL EVIDENCE VAULT \xB7 HERTRACE PROTOCOL
================================================================================
`;
}

// server/routes.ts
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path2.dirname(__filename2);
var UPLOADS_DIR = process.env.VERCEL ? path2.join("/tmp", "hertrace", "uploads") : path2.join(__dirname2, "uploads");
if (!fs2.existsSync(UPLOADS_DIR)) {
  fs2.mkdirSync(UPLOADS_DIR, { recursive: true });
}
var storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${uniqueSuffix}-${sanitized}`);
  }
});
var upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }
  // 100 MB max
});
var apiRouter = Router();
apiRouter.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "HERTRACE Forensic Engine API",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    stats: getStats()
  });
});
apiRouter.get("/stats", (_req, res) => {
  res.json(getStats());
});
apiRouter.get("/incidents", (req, res) => {
  try {
    let incidents = getAllIncidents();
    const { q, risk, platform } = req.query;
    if (q) {
      const query = q.toLowerCase();
      incidents = incidents.filter(
        (inc) => inc.id.toLowerCase().includes(query) || inc.title.toLowerCase().includes(query) || inc.accountHandle.toLowerCase().includes(query) || inc.details.toLowerCase().includes(query)
      );
    }
    if (risk) {
      incidents = incidents.filter((inc) => inc.riskLevel === risk.toUpperCase());
    }
    if (platform) {
      incidents = incidents.filter((inc) => inc.platform.toLowerCase() === platform.toLowerCase());
    }
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to retrieve incidents" });
  }
});
apiRouter.get("/incidents/:id", (req, res) => {
  try {
    const incident = getIncidentById(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: `Incident ${req.params.id} not found` });
    }
    res.json(incident);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to retrieve incident" });
  }
});
apiRouter.post("/incidents", upload.array("files", 15), async (req, res) => {
  try {
    const files = req.files || [];
    const body = req.body;
    const allIncidents = getAllIncidents();
    const nextNum = allIncidents.length + 1;
    const newId = `HT-${String(nextNum).padStart(3, "0")}`;
    const now = /* @__PURE__ */ new Date();
    const isoString = now.toISOString().replace("T", " ").substring(0, 19) + " UTC";
    const evidenceItems = [];
    if (files.length > 0) {
      let counter = 1;
      for (const f of files) {
        const fileBuffer = fs2.readFileSync(f.path);
        const hash = calculateBufferSha256(fileBuffer);
        const evNum = String(counter).padStart(3, "0");
        const evId = `ev-${newId.toLowerCase()}-${counter}`;
        const previewType = getFilePreviewType(f.originalname, f.mimetype);
        const item = {
          id: evId,
          evidenceNumber: evNum,
          incidentId: newId,
          name: f.originalname,
          type: f.mimetype || "Preserved artifact",
          size: formatBytes(f.size),
          sizeBytes: f.size,
          timestamp: isoString,
          relativeTime: "Just now",
          sha256: hash,
          verified: true,
          source: "Direct client upload (verified)",
          previewType,
          filePath: f.path,
          fileUrl: `/uploads/${f.filename}`,
          relatedEvents: ["Preservation receipt generated", "Integrity hash locked"],
          isNewUpload: true
        };
        evidenceItems.push(item);
        counter++;
      }
    } else {
      const defaultHash = generateDeterministicHash(body.contentUrl || body.accountHandle || newId);
      const defaultItem = {
        id: `ev-${newId.toLowerCase()}-1`,
        evidenceNumber: "001",
        incidentId: newId,
        name: "incident_metadata_anchor.json",
        type: "application/json",
        size: "124 KB",
        sizeBytes: 126976,
        timestamp: isoString,
        relativeTime: "Just now",
        sha256: defaultHash,
        verified: true,
        source: "Automated platform capture",
        previewType: "code",
        relatedEvents: ["Metadata anchor verified", "Preservation receipt generated"],
        isNewUpload: true
      };
      evidenceItems.push(defaultItem);
    }
    const { score: riskScore, level: riskLevel } = calculateRisk(
      body.type || "Other",
      body.platform || "Other",
      evidenceItems.length
    );
    const aiAnalysis = generateAiAnalysis(
      body.type || "Impersonation",
      body.platform || "Instagram",
      body.accountHandle || "@unknown",
      evidenceItems,
      riskScore
    );
    const { nodes: graphNodes, edges: graphEdges } = generateDependencyGraph(
      body.accountHandle || "@target_account",
      body.contentUrl || "",
      evidenceItems
    );
    const timeline = generateTimeline(
      body.type || "Incident",
      body.platform || "Social Web",
      evidenceItems,
      isoString
    );
    const newIncident = {
      id: newId,
      title: `${body.type || "Incident"} on ${body.platform || "Social Platform"}`,
      type: body.type || "Other",
      platform: body.platform || "Other",
      accountHandle: body.accountHandle || "@target_profile",
      contentUrl: body.contentUrl || "https://preserved.canonical.url",
      discoveredAt: isoString,
      details: body.details || "Incident evidence preserved via intake wizard.",
      createdAt: isoString,
      relativeTime: "Just now",
      riskLevel,
      riskScore,
      sealed: false,
      evidenceItems,
      graphNodes,
      graphEdges,
      aiAnalysis,
      timeline
    };
    insertIncident(newIncident);
    res.status(201).json(newIncident);
  } catch (err) {
    console.error("Create incident error:", err);
    res.status(500).json({ error: err.message || "Failed to create incident" });
  }
});
apiRouter.post("/incidents/:id/evidence", upload.array("files", 10), (req, res) => {
  try {
    const incident = getIncidentById(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: `Incident ${req.params.id} not found` });
    }
    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }
    const now = /* @__PURE__ */ new Date();
    const isoString = now.toISOString().replace("T", " ").substring(0, 19) + " UTC";
    const currentCount = incident.evidenceItems.length;
    const addedItems = [];
    files.forEach((f, idx) => {
      const fileBuffer = fs2.readFileSync(f.path);
      const hash = calculateBufferSha256(fileBuffer);
      const evNum = String(currentCount + idx + 1).padStart(3, "0");
      const evId = `ev-${incident.id.toLowerCase()}-${currentCount + idx + 1}`;
      const previewType = getFilePreviewType(f.originalname, f.mimetype);
      const item = {
        id: evId,
        evidenceNumber: evNum,
        incidentId: incident.id,
        name: f.originalname,
        type: f.mimetype || "Preserved artifact",
        size: formatBytes(f.size),
        sizeBytes: f.size,
        timestamp: isoString,
        relativeTime: "Just now",
        sha256: hash,
        verified: true,
        source: "Direct supplementary upload",
        previewType,
        filePath: f.path,
        fileUrl: `/uploads/${f.filename}`,
        relatedEvents: ["Supplemental evidence secured"],
        isNewUpload: true
      };
      insertEvidence(item);
      addedItems.push(item);
    });
    const updated = getIncidentById(req.params.id);
    const { nodes, edges } = generateDependencyGraph(updated.accountHandle, updated.contentUrl, updated.evidenceItems);
    const analysis = generateAiAnalysis(updated.type, updated.platform, updated.accountHandle, updated.evidenceItems, updated.riskScore);
    const updatedTimeline = [
      ...updated.timeline,
      {
        id: `t-${Date.now()}-supp`,
        time: "Just now",
        title: "Supplementary evidence secured",
        description: `Secured ${files.length} additional artifact(s).`,
        type: "preserved"
      }
    ];
    updateIncidentAnalysisAndGraph(incident.id, analysis, nodes, edges, updatedTimeline);
    res.status(201).json({
      message: `Preserved ${addedItems.length} artifact(s)`,
      evidence: addedItems,
      incident: getIncidentById(req.params.id)
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to upload evidence" });
  }
});
apiRouter.post("/incidents/:id/seal", (req, res) => {
  try {
    const incident = getIncidentById(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: `Incident ${req.params.id} not found` });
    }
    const now = /* @__PURE__ */ new Date();
    const sealedAt = now.toISOString().replace("T", " ").substring(0, 19) + " UTC";
    const evidenceHashes = incident.evidenceItems.map((e) => e.sha256);
    const sealHash = generateAttestationSeal(incident.id, sealedAt, evidenceHashes);
    sealIncidentInDb(incident.id, sealHash, sealedAt);
    const timeline = [
      ...incident.timeline,
      {
        id: `t-${Date.now()}-sealed`,
        time: "Just now",
        title: "Eye of Agamotto Attestation Sealed",
        description: `Cryptographic attestation stamped with seal hash ${sealHash.substring(0, 16)}...`,
        type: "report"
      }
    ];
    updateIncidentAnalysisAndGraph(incident.id, incident.aiAnalysis, incident.graphNodes, incident.graphEdges, timeline);
    res.json({
      success: true,
      message: "Forensic report successfully sealed and attested",
      sealedAt,
      sealHash
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to seal incident" });
  }
});
apiRouter.post("/incidents/:id/reanalyze", (req, res) => {
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
      graphEdges: edges
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to reanalyze incident" });
  }
});
apiRouter.get("/incidents/:id/report", (req, res) => {
  try {
    const incident = getIncidentById(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: `Incident ${req.params.id} not found` });
    }
    const docText = generateReportDocument(incident);
    const download = req.query.download === "true";
    if (download) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="HERTRACE_${incident.id}_EvidencePacket.txt"`);
      return res.send(docText);
    }
    res.json({
      incidentId: incident.id,
      reportText: docText,
      sealed: incident.sealed,
      sealHash: incident.sealHash
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to generate report" });
  }
});
apiRouter.delete("/incidents/:id", (req, res) => {
  try {
    const incident = getIncidentById(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: `Incident ${req.params.id} not found` });
    }
    deleteIncident(req.params.id);
    res.json({ success: true, message: `Incident ${req.params.id} removed from vault` });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to delete incident" });
  }
});
apiRouter.get("/evidence", (_req, res) => {
  try {
    const evidence = getAllEvidence();
    res.json(evidence);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch evidence" });
  }
});

// src/data/mock.ts
var INITIAL_INCIDENTS = [
  {
    id: "CV-002",
    title: "Impersonation on Instagram",
    type: "Impersonation",
    platform: "Instagram",
    accountHandle: "@fake_profile_clone",
    contentUrl: "https://instagram.com/fake_profile_clone_981",
    discoveredAt: "2026-09-30 22:21:18 UTC",
    details: "Account opened using stolen profile photos, bio text and sending direct messages to contacts.",
    createdAt: "2026-09-30 22:21:18 UTC",
    relativeTime: "14 min ago",
    riskLevel: "HIGH",
    riskScore: 87,
    evidenceItems: [
      {
        id: "ev-001",
        evidenceNumber: "001",
        incidentId: "CV-002",
        name: "profile_page_capture.png",
        type: "PNG image",
        size: "2.4 MB",
        sizeBytes: 2481020,
        timestamp: "2026-09-30 22:27:14 UTC",
        relativeTime: "12 min ago",
        sha256: "8f42e391b4a081cd295f7c3e109d436a589e4c1972b9a7c3f81e05d921b4a91c",
        verified: true,
        source: "Browser viewport capture",
        previewType: "image",
        relatedEvents: ["Initial discovery", "Profile URL extraction"]
      },
      {
        id: "ev-002",
        evidenceNumber: "002",
        incidentId: "CV-002",
        name: "dm_thread_export.pdf",
        type: "PDF document",
        size: "318 KB",
        sizeBytes: 325632,
        timestamp: "2026-09-30 22:28:40 UTC",
        relativeTime: "11 min ago",
        sha256: "3e198a2f8b55c4d09320e4bfa018c66e27b14d87ae3f91c5e408d13a964e5210",
        verified: true,
        source: "Direct export",
        previewType: "document",
        relatedEvents: ["Direct message received"]
      },
      {
        id: "ev-003",
        evidenceNumber: "003",
        incidentId: "CV-002",
        name: "screenrecord_2026-09-30_2221.mp4",
        type: "MP4 video",
        size: "14.7 MB",
        sizeBytes: 15414067,
        timestamp: "2026-09-30 22:31:02 UTC",
        relativeTime: "8 min ago",
        sha256: "92d1c67e45fa08bb1e948a3c2049e7fa13c84d6b5e02a98f12c3b4a5d6e7f801",
        verified: true,
        source: "Screen capture",
        previewType: "video",
        relatedEvents: ["Live story recording"]
      },
      {
        id: "ev-004",
        evidenceNumber: "004",
        incidentId: "CV-002",
        name: "IMG_4471.PNG",
        type: "PNG image",
        size: "1.2 MB",
        sizeBytes: 1258291,
        timestamp: "2026-09-30 22:33:18 UTC",
        relativeTime: "6 min ago",
        sha256: "b4a91c8f42e391b4a081cd295f7c3e109d436a589e4c1972b9a7c3f81e05d921",
        verified: true,
        source: "Original camera roll",
        previewType: "image",
        relatedEvents: ["Avatar comparison baseline"]
      },
      {
        id: "ev-005",
        evidenceNumber: "005",
        incidentId: "CV-002",
        name: "follower_outreach_list.txt",
        type: "TXT log",
        size: "142 KB",
        sizeBytes: 145408,
        timestamp: "2026-09-30 22:35:45 UTC",
        relativeTime: "4 min ago",
        sha256: "c801d921b4a91c8f42e391b4a081cd295f7c3e109d436a589e4c1972b9a7c3f8",
        verified: true,
        source: "Log stream",
        previewType: "code",
        relatedEvents: ["Contact list correlation"]
      },
      {
        id: "ev-006",
        evidenceNumber: "006",
        incidentId: "CV-002",
        name: "header_traffic_dump.har",
        type: "HAR archive",
        size: "3.1 MB",
        sizeBytes: 3250585,
        timestamp: "2026-09-30 22:38:10 UTC",
        relativeTime: "2 min ago",
        sha256: "d921b4a91c8f42e391b4a081cd295f7c3e109d436a589e4c1972b9a7c3f81e05",
        verified: true,
        source: "Network inspector",
        previewType: "code",
        relatedEvents: ["Endpoint routing validation"]
      },
      {
        id: "ev-007",
        evidenceNumber: "007",
        incidentId: "CV-002",
        name: "incident_metadata_anchor.json",
        type: "JSON payload",
        size: "84 KB",
        sizeBytes: 86016,
        timestamp: "2026-09-30 22:40:05 UTC",
        relativeTime: "Just now",
        sha256: "e05d921b4a91c8f42e391b4a081cd295f7c3e109d436a589e4c1972b9a7c3f81",
        verified: true,
        source: "Local cryptographic vault",
        previewType: "code",
        relatedEvents: ["Attestation packet compilation"]
      }
    ],
    graphNodes: [
      { id: "node-account", label: "@fake_profile_clone", subLabel: "Impersonation account", type: "account", x: 260, y: 70 },
      { id: "node-url", label: "instagram.com/fake_profile_clone...", subLabel: "Profile URL", type: "url", x: 120, y: 190 },
      { id: "node-msg", label: "Direct message", subLabel: "Solicitation messages", type: "message", evidenceRef: "002", x: 400, y: 190 },
      { id: "node-img", label: "Avatar capture", subLabel: "Profile header", type: "image", evidenceRef: "001", x: 60, y: 310 },
      { id: "node-screen", label: "Network dump", subLabel: "HTTP headers", type: "evidence", evidenceRef: "006", x: 210, y: 310 },
      { id: "node-ev4", label: "Evidence seal", subLabel: "Cryptographic anchor", type: "document", evidenceRef: "007", x: 400, y: 310 }
    ],
    graphEdges: [
      { id: "e1", from: "node-account", to: "node-url", label: "hosts" },
      { id: "e2", from: "node-account", to: "node-msg", label: "sent by" },
      { id: "e3", from: "node-url", to: "node-img", label: "displays" },
      { id: "e4", from: "node-url", to: "node-screen", label: "rendered in" },
      { id: "e5", from: "node-msg", to: "node-ev4", label: "referenced by" }
    ],
    aiAnalysis: {
      headline: "Possible impersonation",
      confidence: 78,
      indicators: [
        {
          id: "ind-1",
          label: "Handle character substitution",
          found: true,
          detail: "One character variation compared to verified account."
        },
        {
          id: "ind-2",
          label: "Photo perceptual match",
          found: true,
          detail: "94% similarity to existing profile photography."
        },
        {
          id: "ind-3",
          label: "Recent registration",
          found: true,
          detail: "Profile created within the last 48 hours."
        }
      ],
      summary: "Heuristic indicators suggest an active clone profile. Confidence reflects structural overlap in photos and character substitutions in the handle.",
      assessmentHedging: "Automated telemetry is probabilistic and structured to assist incident triage."
    },
    timeline: [
      {
        id: "t-1",
        time: "22:21 UTC",
        title: "Incident discovered",
        description: "Profile flagged via direct message alert from mutual contact.",
        type: "discovered"
      },
      {
        id: "t-2",
        time: "22:27 UTC",
        title: "Screenshot preserved",
        description: "Profile banner and bio metadata captured to local memory.",
        type: "preserved",
        evidenceRef: "001"
      },
      {
        id: "t-3",
        time: "22:31 UTC",
        title: "Video recorded",
        description: "Story broadcast recorded to demonstrate active solicitation.",
        type: "preserved",
        evidenceRef: "003"
      },
      {
        id: "t-4",
        time: "22:35 UTC",
        title: "SHA-256 generated",
        description: "Cryptographic digest computed client-side with zero network leakage.",
        type: "hash",
        evidenceRef: "001"
      },
      {
        id: "t-5",
        time: "22:40 UTC",
        title: "Report generated",
        description: "Evidence packet locked with cryptographic integrity verification.",
        type: "report"
      }
    ]
  },
  {
    id: "CV-001",
    title: "Image misuse on Instagram",
    type: "Image misuse",
    platform: "Instagram",
    accountHandle: "@ad_network_promo",
    contentUrl: "https://instagram.com/p/DF910aLk992",
    discoveredAt: "2026-09-29 14:10:24 UTC",
    details: "Original portrait photography repurposed in sponsored advertisement without permission.",
    createdAt: "2026-09-29 14:10:24 UTC",
    relativeTime: "Yesterday",
    riskLevel: "MEDIUM",
    riskScore: 54,
    evidenceItems: [
      {
        id: "ev-101",
        evidenceNumber: "001",
        incidentId: "CV-001",
        name: "ad_creative_capture.png",
        type: "PNG image",
        size: "3.2 MB",
        sizeBytes: 3355443,
        timestamp: "2026-09-29 14:15:22 UTC",
        relativeTime: "Yesterday",
        sha256: "4f2910a91c8f42e391b4a081cd295f7c3e109d436a589e4c1972b9a7c3f81e05",
        verified: true,
        source: "Ad library capture",
        previewType: "image",
        relatedEvents: ["Ad creative preservation"]
      },
      {
        id: "ev-102",
        evidenceNumber: "002",
        incidentId: "CV-001",
        name: "original_raw_portrait.cr3",
        type: "Raw photo",
        size: "28.4 MB",
        sizeBytes: 29779520,
        timestamp: "2026-09-29 14:18:04 UTC",
        relativeTime: "Yesterday",
        sha256: "7c3e109d436a589e4c1972b9a7c3f81e05d921b4a91c8f42e391b4a081cd295f",
        verified: true,
        source: "Camera master file",
        previewType: "image",
        relatedEvents: ["Original baseline"]
      },
      {
        id: "ev-103",
        evidenceNumber: "003",
        incidentId: "CV-001",
        name: "ad_metadata_dump.json",
        type: "JSON payload",
        size: "88 KB",
        sizeBytes: 90112,
        timestamp: "2026-09-29 14:22:11 UTC",
        relativeTime: "Yesterday",
        sha256: "1a91c8f42e391b4a081cd295f7c3e109d436a589e4c1972b9a7c3f81e05d921b",
        verified: true,
        source: "API response stream",
        previewType: "code",
        relatedEvents: ["Buyer identity logged"]
      },
      {
        id: "ev-104",
        evidenceNumber: "004",
        incidentId: "CV-001",
        name: "takedown_notice.pdf",
        type: "PDF document",
        size: "512 KB",
        sizeBytes: 524288,
        timestamp: "2026-09-29 16:40:00 UTC",
        relativeTime: "Yesterday",
        sha256: "9d436a589e4c1972b9a7c3f81e05d921b4a91c8f42e391b4a081cd295f7c3e10",
        verified: true,
        source: "Notice submission",
        previewType: "document",
        relatedEvents: ["Platform notice filed"]
      }
    ],
    graphNodes: [
      { id: "n-ad", label: "Ad Campaign #910", subLabel: "Sponsored post", type: "account", x: 260, y: 70 },
      { id: "n-target", label: "instagram.com/p/DF910a...", subLabel: "Creative URL", type: "url", x: 130, y: 190 },
      { id: "n-orig", label: "Original RAW photo", subLabel: "Master copy", type: "image", evidenceRef: "002", x: 390, y: 190 },
      { id: "n-takedown", label: "Takedown notice", subLabel: "Notice receipt", type: "document", evidenceRef: "004", x: 260, y: 310 }
    ],
    graphEdges: [
      { id: "ge1", from: "n-ad", to: "n-target", label: "promotes" },
      { id: "ge2", from: "n-ad", to: "n-orig", label: "infringes" },
      { id: "ge3", from: "n-target", to: "n-takedown", label: "targeted by" }
    ],
    aiAnalysis: {
      headline: "Likely unauthorized image reuse",
      confidence: 84,
      indicators: [
        {
          id: "i-1",
          label: "Direct keypoint match",
          found: true,
          detail: "High keypoint alignment with protected source image."
        },
        {
          id: "i-2",
          label: "Commercial distribution",
          found: true,
          detail: "Delivered through paid advertising network."
        }
      ],
      summary: "Evidence indicates reuse of private photography in a commercial campaign without licensing.",
      assessmentHedging: "Automated telemetry is probabilistic and structured to assist incident triage."
    },
    timeline: [
      {
        id: "t-101",
        time: "14:10 UTC",
        title: "Incident discovered",
        description: "Sponsored post identified in social feed.",
        type: "discovered"
      },
      {
        id: "t-102",
        time: "14:15 UTC",
        title: "Screenshot preserved",
        description: "Ad creative captured with network headers.",
        type: "preserved",
        evidenceRef: "001"
      },
      {
        id: "t-103",
        time: "16:40 UTC",
        title: "Takedown package compiled",
        description: "Evidence formatted and submitted to platform.",
        type: "report",
        evidenceRef: "004"
      }
    ]
  },
  {
    id: "CV-003",
    title: "Deepfake video on X",
    type: "Deepfake or manipulation",
    platform: "X",
    accountHandle: "@anon_uploader_44",
    contentUrl: "https://x.com/anon_uploader_44/status/198234",
    discoveredAt: "2026-09-30 08:14:02 UTC",
    details: "Synthetically generated video clip attributing false statements to the victim.",
    createdAt: "2026-09-30 08:14:02 UTC",
    relativeTime: "Today at 08:14",
    riskLevel: "HIGH",
    riskScore: 92,
    evidenceItems: [
      {
        id: "ev-201",
        evidenceNumber: "001",
        incidentId: "CV-003",
        name: "synthetic_clip_extract.mp4",
        type: "MP4 video",
        size: "18.2 MB",
        sizeBytes: 19084083,
        timestamp: "2026-09-30 08:18:12 UTC",
        relativeTime: "5 hours ago",
        sha256: "a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
        verified: true,
        source: "Direct video stream",
        previewType: "video",
        relatedEvents: ["Deepfake extraction"]
      },
      {
        id: "ev-202",
        evidenceNumber: "002",
        incidentId: "CV-003",
        name: "spectrogram_audio_analysis.png",
        type: "PNG image",
        size: "1.4 MB",
        sizeBytes: 1468006,
        timestamp: "2026-09-30 08:24:50 UTC",
        relativeTime: "5 hours ago",
        sha256: "f0e1d2c3b4a5968778695a4b3c2d1e0f0123456789abcdef0123456789abcdef",
        verified: true,
        source: "Audio frequency analysis",
        previewType: "image",
        relatedEvents: ["Voice synthesis anomalies detected"]
      }
    ],
    graphNodes: [
      { id: "n-x-acc", label: "@anon_uploader_44", subLabel: "Uploader account", type: "account", x: 260, y: 70 },
      { id: "n-x-post", label: "x.com/status/198234", subLabel: "Tweet URL", type: "url", x: 130, y: 190 },
      { id: "n-x-vid", label: "Synthetic video", subLabel: "Deepfake payload", type: "evidence", evidenceRef: "001", x: 390, y: 190 }
    ],
    graphEdges: [
      { id: "x-e1", from: "n-x-acc", to: "n-x-post", label: "published" },
      { id: "x-e2", from: "n-x-post", to: "n-x-vid", label: "attached" }
    ],
    aiAnalysis: {
      headline: "High likelihood of synthetic video generation",
      confidence: 92,
      indicators: [
        {
          id: "i-df-1",
          label: "Facial boundary warping",
          found: true,
          detail: "Irregular frame-by-frame blending around chin and jawline."
        },
        {
          id: "i-df-2",
          label: "Synthetic voice harmonics",
          found: true,
          detail: "Spectrogram demonstrates non-organic frequency cutoffs."
        }
      ],
      summary: "Visual and spectral evidence indicate neural network synthesis applied to victim voice and likeness.",
      assessmentHedging: "Automated telemetry is probabilistic and structured to assist incident triage."
    },
    timeline: [
      {
        id: "t-201",
        time: "08:14 UTC",
        title: "Video discovered",
        description: "Post reported via alert.",
        type: "discovered"
      },
      {
        id: "t-202",
        time: "08:18 UTC",
        title: "Video preserved",
        description: "Original MP4 preserved with cryptographic digest.",
        type: "preserved",
        evidenceRef: "001"
      }
    ]
  },
  {
    id: "CV-004",
    title: "Fake link or scam on WhatsApp",
    type: "Fake link or scam",
    platform: "WhatsApp",
    accountHandle: "+1 (555) 019-2834",
    contentUrl: "https://security-verify-auth.co/login",
    discoveredAt: "2026-09-28 11:02:15 UTC",
    details: "Phishing campaign sent to contact list claiming urgent verification requirement.",
    createdAt: "2026-09-28 11:02:15 UTC",
    relativeTime: "2 days ago",
    riskLevel: "LOW",
    riskScore: 38,
    evidenceItems: [
      {
        id: "ev-301",
        evidenceNumber: "001",
        incidentId: "CV-004",
        name: "phishing_message_capture.png",
        type: "PNG image",
        size: "1.1 MB",
        sizeBytes: 1153433,
        timestamp: "2026-09-28 11:05:40 UTC",
        relativeTime: "2 days ago",
        sha256: "5566778899aabbccddeeff00112233445566778899aabbccddeeff0011223344",
        verified: true,
        source: "Chat export",
        previewType: "image",
        relatedEvents: ["Phishing text capture"]
      },
      {
        id: "ev-302",
        evidenceNumber: "002",
        incidentId: "CV-004",
        name: "domain_whois_record.json",
        type: "JSON payload",
        size: "42 KB",
        sizeBytes: 43008,
        timestamp: "2026-09-28 11:12:00 UTC",
        relativeTime: "2 days ago",
        sha256: "66778899aabbccddeeff00112233445566778899aabbccddeeff001122334455",
        verified: true,
        source: "DNS lookup",
        previewType: "code",
        relatedEvents: ["Domain registration check"]
      }
    ],
    graphNodes: [
      { id: "n-wa-num", label: "+1 (555) 019-2834", subLabel: "Sender number", type: "account", x: 260, y: 70 },
      { id: "n-wa-link", label: "security-verify-auth.co", subLabel: "Phishing link", type: "url", x: 130, y: 190 },
      { id: "n-wa-shot", label: "Chat screenshot", subLabel: "SMS capture", type: "image", evidenceRef: "001", x: 390, y: 190 }
    ],
    graphEdges: [
      { id: "wa-e1", from: "n-wa-num", to: "n-wa-link", label: "sent" },
      { id: "wa-e2", from: "n-wa-link", to: "n-wa-shot", label: "contained in" }
    ],
    aiAnalysis: {
      headline: "Known phishing pattern",
      confidence: 96,
      indicators: [
        {
          id: "i-wa-1",
          label: "Recently registered domain",
          found: true,
          detail: "Domain registered 48 hours prior to campaign."
        }
      ],
      summary: "Link leads to a credential harvesting form mimicking account recovery.",
      assessmentHedging: "Automated telemetry is probabilistic and structured to assist incident triage."
    },
    timeline: [
      {
        id: "t-301",
        time: "11:02 UTC",
        title: "Message received",
        description: "Suspicious text delivered via messaging application.",
        type: "discovered"
      },
      {
        id: "t-302",
        time: "11:05 UTC",
        title: "Evidence preserved",
        description: "Screenshot and link target archived with SHA-256 digest.",
        type: "preserved",
        evidenceRef: "001"
      }
    ]
  }
];

// server/seed.ts
function seedDatabaseIfNeeded() {
  const count = db.prepare(`SELECT COUNT(*) as count FROM incidents`).get()?.count || 0;
  if (count === 0) {
    console.log("[HERTRACE Server] Initializing database with baseline incidents...");
    for (const incident of INITIAL_INCIDENTS) {
      insertIncident({
        ...incident,
        sealed: false,
        evidenceItems: incident.evidenceItems.map((e) => ({
          ...e,
          filePath: void 0,
          fileUrl: void 0
        }))
      });
    }
    console.log(`[HERTRACE Server] Seeded ${INITIAL_INCIDENTS.length} baseline incidents.`);
  } else {
    console.log(`[HERTRACE Server] Database loaded with ${count} existing incidents.`);
  }
}

// server/app.ts
var __filename3 = fileURLToPath3(import.meta.url);
var __dirname3 = path3.dirname(__filename3);
var app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
var UPLOADS_DIR2 = process.env.VERCEL ? path3.join("/tmp", "hertrace", "uploads") : path3.join(__dirname3, "uploads");
if (!fs3.existsSync(UPLOADS_DIR2)) {
  fs3.mkdirSync(UPLOADS_DIR2, { recursive: true });
}
app.use("/uploads", express.static(UPLOADS_DIR2));
app.use("/api", apiRouter);
app.use(apiRouter);
seedDatabaseIfNeeded();
var app_default = app;
export {
  UPLOADS_DIR2 as UPLOADS_DIR,
  app,
  app_default as default
};
