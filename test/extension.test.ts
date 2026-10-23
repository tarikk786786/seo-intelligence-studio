import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Chrome Extension Manifest V3', () => {
  const manifestPath = path.resolve(__dirname, '../apps/extension/manifest.json');

  it('contains valid Manifest V3 structure and minimal permissions', () => {
    const raw = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(raw);

    expect(manifest.manifest_version).toBe(3);
    expect(manifest.name).toContain('tarikislamseoamazon');
    expect(manifest.permissions).toContain('activeTab');
    expect(manifest.permissions).toContain('storage');
    // Ensure dangerous unrestricted permissions are NOT present
    expect(manifest.permissions).not.toContain('<all_urls>');
    expect(manifest.permissions).not.toContain('cookies');

    expect(manifest.action.default_popup).toBe('popup.html');
    expect(manifest.background.service_worker).toBe('background.js');
    expect(manifest.content_scripts[0].matches).toContain('*://*.google.com/search*');
  });
});
