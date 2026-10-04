import { db, insertIncident, getAllIncidents } from './db.ts';
import { INITIAL_INCIDENTS } from '../src/data/mock.ts';

export function seedDatabaseIfNeeded(): void {
  const count = (db.prepare(`SELECT COUNT(*) as count FROM incidents`).get() as any)?.count || 0;
  if (count === 0) {
    console.log('[HERTRACE Server] Initializing database with baseline incidents...');
    for (const incident of INITIAL_INCIDENTS) {
      insertIncident({
        ...incident,
        sealed: false,
        evidenceItems: incident.evidenceItems.map((e) => ({
          ...e,
          filePath: undefined,
          fileUrl: undefined,
        })),
      });
    }
    console.log(`[HERTRACE Server] Seeded ${INITIAL_INCIDENTS.length} baseline incidents.`);
  } else {
    console.log(`[HERTRACE Server] Database loaded with ${count} existing incidents.`);
  }
}
