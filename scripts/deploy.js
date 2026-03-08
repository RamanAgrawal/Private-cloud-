/**
 * Copies frontend/dist → backend/public after `npm run build --prefix frontend`
 * Works cross-platform (no xcopy/cp needed).
 */
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../frontend/dist');
const dest = path.join(__dirname, '../backend/public');

if (!fs.existsSync(src)) {
  console.error('frontend/dist not found — run: npm run build --prefix frontend');
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log(`✓ Copied frontend/dist → backend/public`);
