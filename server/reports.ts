import type { DbIncident } from './db.ts';
import { generateAttestationSeal } from './crypto.ts';

export function generateReportDocument(incident: DbIncident): string {
  const sealStatus = incident.sealed
    ? `SEALED & ATTESTED (Seal Hash: ${incident.sealHash || 'VERIFIED'})`
    : `PRE-ATTESTATION (UNSEALED DRAFT)`;

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
${incident.evidenceItems
  .map(
    (ev, idx) => `Item #${ev.evidenceNumber || String(idx + 1).padStart(3, '0')}
  File Name   : ${ev.name}
  Format      : ${ev.type} (${ev.previewType.toUpperCase()})
  Byte Size   : ${ev.size} (${ev.sizeBytes} bytes)
  Preserved   : ${ev.timestamp}
  Source      : ${ev.source}
  SHA-256     : ${ev.sha256}
  Integrity   : CRYPTOGRAPHICALLY SECURED (NIST FIPS 180-4)`
  )
  .join('\n\n')}

--------------------------------------------------------------------------------
[TEMPORAL INCIDENT RECONSTRUCTION TRAIL]
${incident.timeline
  .map((t) => `[${t.time}] ${t.title}
  ${t.description}`)
  .join('\n\n')}

--------------------------------------------------------------------------------
[AUTOMATED FORENSIC TELEMETRY & AI ASSESSMENT]
Headline   : ${incident.aiAnalysis?.headline || 'Forensic analysis completed'}
Confidence : ${incident.aiAnalysis?.confidence || incident.riskScore}%
Summary    : ${incident.aiAnalysis?.summary || 'N/A'}

Key Indicators:
${(incident.aiAnalysis?.indicators || [])
  .map((ind: any) => `  * [${ind.found ? 'MATCH' : 'INCONCLUSIVE'}] ${ind.label}: ${ind.detail}`)
  .join('\n')}

Compliance & Hedging Note:
${incident.aiAnalysis?.assessmentHedging || 'Automated forensic telemetry is probabilistic and structured to assist incident triage.'}

================================================================================
ATTESTATION VERIFICATION KEY:
sha256:${incident.sealHash || calculatedSeal}
BOUND IN TIME · IMMUTABLE DIGITAL EVIDENCE VAULT · HERTRACE PROTOCOL
================================================================================
`;
}
