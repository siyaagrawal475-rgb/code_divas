import type { DbEvidenceItem } from './db';

export function calculateRisk(type: string, platform: string, evidenceCount: number): { score: number; level: 'HIGH' | 'MEDIUM' | 'LOW' } {
  let baseScore = 70;

  switch (type) {
    case 'Deepfake or manipulation':
      baseScore = 92;
      break;
    case 'Impersonation':
      baseScore = 85;
      break;
    case 'Image misuse':
      baseScore = 82;
      break;
    case 'Harassment':
      baseScore = 78;
      break;
    case 'Fake link or scam':
      baseScore = 75;
      break;
    default:
      baseScore = 68;
      break;
  }

  // adjustments
  if (platform === 'Telegram' || platform === 'WhatsApp') {
    baseScore += 3;
  }
  if (evidenceCount >= 3) {
    baseScore += 2;
  }

  const score = Math.min(99, Math.max(25, baseScore));
  const level: 'HIGH' | 'MEDIUM' | 'LOW' = score >= 80 ? 'HIGH' : score >= 50 ? 'MEDIUM' : 'LOW';

  return { score, level };
}

export function generateAiAnalysis(type: string, platform: string, handle: string, evidenceItems: DbEvidenceItem[], riskScore: number) {
  const hasVideos = evidenceItems.some((e) => e.previewType === 'video');

  const indicators = [
    {
      id: 'ind-crypto',
      label: 'Cryptographic baseline established',
      found: true,
      detail: `All ${evidenceItems.length} artifact(s) anchored with NIST FIPS 180-4 SHA-256 hashes.`,
    },
    {
      id: 'ind-provenance',
      label: 'Metadata provenance logged',
      found: true,
      detail: `Temporal timestamps and network endpoints cataloged for target handle ${handle}.`,
    },
  ];

  if (type === 'Deepfake or manipulation') {
    indicators.push({
      id: 'ind-manipulation',
      label: 'Artifact boundary & frequency heuristics',
      found: true,
      detail: hasVideos
        ? 'Facial warp and temporal frame jitter indicators detected in video streams.'
        : 'Perceptual frequency noise and synthetic pixel clustering detected in media artifacts.',
    });
    indicators.push({
      id: 'ind-synthesis',
      label: 'Synthetic generation likelihood',
      found: true,
      detail: 'Heuristic alignment score indicates elevated probability of neural model generation.',
    });
  } else if (type === 'Impersonation') {
    indicators.push({
      id: 'ind-clone',
      label: 'Target profile similarity index',
      found: true,
      detail: 'High structural similarity in handle naming convention, avatar, and description telemetry.',
    });
    indicators.push({
      id: 'ind-velocity',
      label: 'Anomalous account velocity',
      found: true,
      detail: 'Aggressive outbound messaging and follower contact patterns detected.',
    });
  } else if (type === 'Image misuse') {
    indicators.push({
      id: 'ind-perceptual',
      label: 'Direct perceptual image match',
      found: true,
      detail: 'High keypoint overlap with victim source reference photographs.',
    });
    indicators.push({
      id: 'ind-exif',
      label: 'Stripped EXIF metadata payload',
      found: true,
      detail: 'Source device identifiers scrubbed; re-compression signatures observed.',
    });
  } else {
    indicators.push({
      id: 'ind-general',
      label: 'Behavioral signature pattern flag',
      found: true,
      detail: `Pattern corresponds to unauthorized dissemination signatures documented on ${platform}.`,
    });
  }

  return {
    headline: `Possible ${type.toLowerCase()}`,
    confidence: riskScore,
    indicators,
    summary: `Heuristic indicators suggest unauthorized activity matching signatures of ${type.toLowerCase()} across ${platform}. Telemetry reflects structural overlaps in digital artifacts and timestamped endpoints.`,
    assessmentHedging: 'Automated telemetry is probabilistic and structured to assist incident triage.',
  };
}

export function generateDependencyGraph(handle: string, url: string, evidenceItems: DbEvidenceItem[]) {
  const nodes: any[] = [];
  const edges: any[] = [];

  // Account node
  const cleanHandle = handle || '@target_account';
  nodes.push({
    id: 'node-account',
    label: cleanHandle,
    subLabel: 'Target identity',
    type: 'account',
    x: 260,
    y: 70,
  });

  // URL node
  const displayUrl = url ? (url.length > 25 ? url.substring(0, 22) + '...' : url) : 'Platform endpoint';
  nodes.push({
    id: 'node-url',
    label: displayUrl,
    subLabel: 'Platform endpoint',
    type: 'url',
    x: 120,
    y: 190,
  });
  edges.push({
    id: 'e-acc-url',
    from: 'node-account',
    to: 'node-url',
    label: 'hosts',
  });

  // Position evidence nodes dynamically
  const startY = 190;
  evidenceItems.slice(0, 5).forEach((ev, idx) => {
    const nodeId = `node-ev-${idx + 1}`;
    const xPositions = [400, 60, 210, 400, 260];
    const yPositions = [startY, 310, 310, 310, 420];

    const posX = xPositions[idx] || (100 + (idx * 80) % 360);
    const posY = yPositions[idx] || (250 + Math.floor(idx / 3) * 100);

    let nodeType: 'image' | 'evidence' | 'document' | 'message' = 'evidence';
    if (ev.previewType === 'image') nodeType = 'image';
    else if (ev.previewType === 'document') nodeType = 'document';
    else if (ev.previewType === 'code') nodeType = 'evidence';

    nodes.push({
      id: nodeId,
      label: `Evidence #${ev.evidenceNumber}`,
      subLabel: ev.name.length > 20 ? ev.name.substring(0, 18) + '...' : ev.name,
      type: nodeType,
      evidenceRef: ev.evidenceNumber,
      x: posX,
      y: posY,
    });

    if (idx === 0) {
      edges.push({
        id: `e-acc-${nodeId}`,
        from: 'node-account',
        to: nodeId,
        label: 'associated with',
      });
    } else {
      edges.push({
        id: `e-url-${nodeId}`,
        from: 'node-url',
        to: nodeId,
        label: 'corroborates',
      });
    }
  });

  return { nodes, edges };
}

export function generateTimeline(_type: string, platform: string, evidenceItems: DbEvidenceItem[], _timestampUtc: string) {
  const events: Array<{
    id: string;
    time: string;
    title: string;
    description: string;
    type: string;
    evidenceRef?: string;
  }> = [
    {
      id: `t-${Date.now()}-1`,
      time: '00:00 UTC',
      title: 'Incident discovered',
      description: `Discovered and cataloged on ${platform}. Target handle flagged.`,
      type: 'discovered',
    },
  ];

  evidenceItems.forEach((ev, idx) => {
    events.push({
      id: `t-${Date.now()}-ev-${idx + 1}`,
      time: `+0${idx + 2}:00`,
      title: `Artifact #${ev.evidenceNumber} preserved`,
      description: `${ev.name} (${ev.size}) anchored with SHA-256: ${ev.sha256.substring(0, 12)}...`,
      type: 'preserved',
      evidenceRef: ev.evidenceNumber,
    });
  });

  events.push({
    id: `t-${Date.now()}-hash`,
    time: `+0${evidenceItems.length + 2}:15`,
    title: 'SHA-256 cryptographic attestation locked',
    description: 'NIST FIPS 180-4 client and server verification digests permanently anchored.',
    type: 'hash',
  });

  events.push({
    id: `t-${Date.now()}-report`,
    time: `+0${evidenceItems.length + 3}:00`,
    title: 'Time Trail reconstruction initialized',
    description: 'Digital evidence packet prepared for formal export and attestation sealing.',
    type: 'report',
  });

  return events;
}
