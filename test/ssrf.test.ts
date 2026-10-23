import { describe, it, expect } from 'vitest';
import { isSafeUrl } from '../packages/provider-adapters/src/url-scraper.js';

describe('SSRF Protection Guard', () => {
  it('blocks private IPv4 addresses and loopback', () => {
    expect(isSafeUrl('http://127.0.0.1/admin').safe).toBe(false);
    expect(isSafeUrl('http://localhost:3000/api').safe).toBe(false);
    expect(isSafeUrl('http://192.168.1.1/').safe).toBe(false);
    expect(isSafeUrl('http://10.0.0.1/sensitive').safe).toBe(false);
  });

  it('blocks cloud metadata endpoint', () => {
    expect(isSafeUrl('http://169.254.169.254/latest/meta-data/').safe).toBe(false);
  });

  it('allows valid public https URLs', () => {
    expect(isSafeUrl('https://example.com/blog/article').safe).toBe(true);
    expect(isSafeUrl('https://searchengineland.com').safe).toBe(true);
  });
});
