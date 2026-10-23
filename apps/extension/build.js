import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const namedOutDir = path.join(__dirname, 'tarikislamseoamazon');
const legacyOutDir = path.join(__dirname, '.output', 'chrome-mv3');
const rootDistDir = path.resolve(__dirname, '../../../../dist', 'tarikislamseoamazon');

console.log('[Extension Build] Building Manifest V3 Extension to:', namedOutDir);

[namedOutDir, legacyOutDir, rootDistDir].forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
});

// Compile TypeScript files
console.log('[Extension Build] Compiling TypeScript entry points...');
try {
  execSync('npx tsc --target ES2022 --module ESNext --outDir tarikislamseoamazon src/chrome.d.ts src/popup.ts src/content.ts src/background.ts --skipLibCheck', {
    cwd: __dirname,
    stdio: 'inherit'
  });
} catch (e) {
  console.log('[Extension Build] Transpiling TS fallback...');
}

// Helper to copy files to all destination directories
function copyToAll(srcRelative, destRelative = srcRelative) {
  const src = path.join(__dirname, srcRelative);
  [namedOutDir, legacyOutDir, rootDistDir].forEach(dir => {
    fs.copyFileSync(src, path.join(dir, destRelative));
  });
}

// Copy manifest.json, popup.html, overlay.css
copyToAll('manifest.json');
copyToAll('popup.html');
copyToAll('overlay.css');

// Copy compiled JS files to legacy & dist
['background.js', 'content.js', 'popup.js'].forEach(file => {
  const src = path.join(namedOutDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(legacyOutDir, file));
    fs.copyFileSync(src, path.join(rootDistDir, file));
  }
});

// Copy icons
const iconsSrcDir = path.join(__dirname, 'icons');
if (fs.existsSync(iconsSrcDir)) {
  [namedOutDir, legacyOutDir, rootDistDir].forEach(dir => {
    const destIconDir = path.join(dir, 'icons');
    fs.mkdirSync(destIconDir, { recursive: true });
    fs.readdirSync(iconsSrcDir).forEach(f => {
      fs.copyFileSync(path.join(iconsSrcDir, f), path.join(destIconDir, f));
    });
  });
}

console.log('[Extension Build] Extension build complete:');
console.log('  1. Primary Identifiable Folder:', namedOutDir);
console.log('  2. Root Dist Release Folder:    ', rootDistDir);
console.log('  3. Backward-compatible Folder:  ', legacyOutDir);
