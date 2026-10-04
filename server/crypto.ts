import crypto from 'node:crypto';
import fs from 'node:fs';

export function calculateBufferSha256(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export function calculateFileSha256(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', (err) => reject(err));
  });
}

export function generateDeterministicHash(seed: string): string {
  return crypto.createHash('sha256').update(seed + Date.now().toString()).digest('hex');
}

export function generateAttestationSeal(incidentId: string, timestamp: string, evidenceHashes: string[]): string {
  const payload = [incidentId, timestamp, ...evidenceHashes].join('|');
  return crypto.createHash('sha256').update(payload).digest('hex');
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getFilePreviewType(filename: string, mimeType?: string): 'image' | 'video' | 'document' | 'audio' | 'code' {
  const lower = filename.toLowerCase();
  if (lower.match(/\.(png|jpe?g|gif|webp|svg|avif|bmp)$/) || mimeType?.startsWith('image/')) {
    return 'image';
  }
  if (lower.match(/\.(mp4|mov|webm|mkv|avi)$/) || mimeType?.startsWith('video/')) {
    return 'video';
  }
  if (lower.match(/\.(mp3|wav|ogg|aac|m4a)$/) || mimeType?.startsWith('audio/')) {
    return 'audio';
  }
  if (lower.match(/\.(pdf|doc|docx|rtf)$/) || mimeType?.includes('pdf') || mimeType?.includes('document')) {
    return 'document';
  }
  return 'code';
}
