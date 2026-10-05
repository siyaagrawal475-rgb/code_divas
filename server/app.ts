import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { apiRouter } from './routes';
import { seedDatabaseIfNeeded } from './seed';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// CORS setup
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded evidence files
export const UPLOADS_DIR = process.env.VERCEL
  ? path.join('/tmp', 'hertrace', 'uploads')
  : path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.use('/uploads', express.static(UPLOADS_DIR));

// Mount API routes under /api and root
app.use('/api', apiRouter);
app.use(apiRouter);

// Initialize DB seeding on cold start
seedDatabaseIfNeeded();

export default app;
