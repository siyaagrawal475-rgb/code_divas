import { app, UPLOADS_DIR } from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🛡️  HERTRACE Forensic Vault Backend Server Running`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔒 NIST FIPS 180-4 SHA-256 Engine: ACTIVE`);
  console.log(`📁 Uploads Directory: ${UPLOADS_DIR}`);
  console.log(`====================================================`);
});
