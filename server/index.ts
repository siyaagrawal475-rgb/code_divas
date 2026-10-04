import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { apiRouter } from './routes.ts';
import { seedDatabaseIfNeeded } from './seed.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

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
const UPLOADS_DIR = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(UPLOADS_DIR));

// Mount API routes
app.use('/api', apiRouter);

// Initialize DB seeding
seedDatabaseIfNeeded();

// Start server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🛡️  HERTRACE Forensic Vault Backend Server Running`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔒 NIST FIPS 180-4 SHA-256 Engine: ACTIVE`);
  console.log(`📁 Uploads Directory: ${UPLOADS_DIR}`);
  console.log(`====================================================`);
});
