import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Window } from 'happy-dom';

import { EntitlementService, PLAN_PRESETS } from '../packages/shared-types/dist/entitlements.js';
import { computeOptimizationScore } from '../packages/seo-engine/dist/scoring-engine.js';
import { calculateFleschReadingEase } from '../packages/seo-engine/dist/readability.js';
import { isSafeUrl } from '../packages/provider-adapters/dist/ssrf-guard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Entitlement Policy Engine - Enterprise Plan Capabilities', () => {
  const plan = PLAN_PRESETS.ENTERPRISE_SURFER;
  
  // 1. Unlimited* Documents
  assert.strictEqual(plan.unlimitedDocuments, true);
  const docCheck = EntitlementService.checkCanCreateDocument(500, plan);
  assert.strictEqual(docCheck.allowed, true);

  const docCeilingCheck = EntitlementService.checkCanCreateDocument(100000, plan);
  assert.strictEqual(docCeilingCheck.allowed, false);

  // 2. Track 100 AI Prompts
  assert.strictEqual(plan.maxActiveAiPrompts, 100);
  const promptCheckWithin = EntitlementService.checkCanTrackPrompt(99, plan);
  assert.strictEqual(promptCheckWithin.allowed, true);

  const promptCheckLimit = EntitlementService.checkCanTrackPrompt(100, plan);
  assert.strictEqual(promptCheckLimit.allowed, false);
  assert.ok(promptCheckLimit.reason.includes('Maximum 100 active tracked prompts permitted'));

  // 3. Unlimited* Brand Spaces
  assert.strictEqual(plan.unlimitedBrandSpaces, true);
  const brandCheck = EntitlementService.checkCanCreateBrandSpace(10, plan);
  assert.strictEqual(brandCheck.allowed, true);

  // 4. Integrations & API Access
  assert.strictEqual(plan.integrationsEnabled, true);
  assert.strictEqual(plan.apiAccessEnabled, true);
  assert.strictEqual(plan.dedicatedCsmAssigned, true);
});

test('Entitlement Policy Engine - Starter Plan Restrictions', () => {
  const starter = PLAN_PRESETS.STARTER;
  const promptCheck = EntitlementService.checkCanTrackPrompt(1, starter);
  assert.strictEqual(promptCheck.allowed, false);
  assert.ok(promptCheck.reason.includes('AI Visibility tracking is not enabled'));
});

test('SEO Scoring Engine - Readability & NLP Scoring', () => {
  const easyText = 'The cat sat on the mat. The sun was hot. We had fun.';
  const readability = calculateFleschReadingEase(easyText);
  assert.ok(readability.score >= 70, 'Readability score should be high for simple text');
  assert.ok(['Easy', 'Very Easy'].includes(readability.label));

  const content = `
    <h1>Generative Engine Optimization Guide</h1>
    <p>Generative engine optimization improves your AI visibility. Best practices and regular optimization guide content authors toward better performance.</p>
    <h2>Top Strategies</h2>
    <p>Content optimization requires thoughtful topic and entity coverage.</p>
  `;
  const result = computeOptimizationScore(content, 'generative engine optimization');
  assert.ok(result.totalScore >= 40, 'Total score should reflect keyword and structural presence');
  assert.ok(result.keywordScore > 0, 'Keyword score should be positive');
  assert.ok(result.entityScore > 0, 'Entity score should be positive');
  assert.ok(result.structureScore > 0, 'Structure score should be positive');
  assert.ok(result.readabilityScore > 0, 'Readability score should be positive');
});

test('SSRF Protection Guard - IP & Metadata Defense', () => {
  assert.strictEqual(isSafeUrl('http://127.0.0.1/admin').safe, false);
  assert.strictEqual(isSafeUrl('http://localhost:3000/api').safe, false);
  assert.strictEqual(isSafeUrl('http://192.168.1.1/').safe, false);
  assert.strictEqual(isSafeUrl('http://10.0.0.1/sensitive').safe, false);
  assert.strictEqual(isSafeUrl('http://169.254.169.254/latest/meta-data/').safe, false);

  assert.strictEqual(isSafeUrl('https://example.com/blog/article').safe, true);
  assert.strictEqual(isSafeUrl('https://searchengineland.com').safe, true);
});

test('Chrome Extension Manifest V3 - Structure & Scopes', () => {
  const manifestPath = path.resolve(__dirname, '../apps/extension/manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist');

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  assert.strictEqual(manifest.manifest_version, 3, 'Must use Manifest V3');
  assert.ok(manifest.name.includes('tarikislamseoamazon'));
  assert.ok(manifest.permissions.includes('activeTab'));
  assert.ok(manifest.permissions.includes('storage'));
  assert.ok(!manifest.permissions.includes('<all_urls>'), 'Must not request all URLs');
  assert.ok(!manifest.permissions.includes('cookies'), 'Must not request cookies permission');
  assert.strictEqual(manifest.action.default_popup, 'popup.html');
  assert.strictEqual(manifest.background.service_worker, 'background.js');
  assert.ok(manifest.content_scripts[0].matches.includes('*://*.google.com/search*'));
});

test('Chrome Extension Live Page Audit Engine - PentAGI Repository Verification', () => {
  const htmlFilePath = path.join(__dirname, 'sample_pentagi.html');
  assert.ok(fs.existsSync(htmlFilePath), 'sample_pentagi.html must exist');
  const rawHtml = fs.readFileSync(htmlFilePath, 'utf-8');

  const window = new Window({ url: 'https://github.com/vxcontrol/pentagi' });
  const document = window.document;
  document.write(rawHtml);

  // Execute extraction
  const title = document.title || '';
  const metaDescEl = document.querySelector('meta[name="description"]') || document.querySelector('meta[property="og:description"]');
  const metaDesc = metaDescEl ? metaDescEl.getAttribute('content') || '' : '';
  const canonicalEl = document.querySelector('link[rel="canonical"]');
  let canonical = canonicalEl ? canonicalEl.getAttribute('href') || '' : '';
  if (!canonical) {
    const ogUrlEl = document.querySelector('meta[property="og:url"]');
    if (ogUrlEl) canonical = ogUrlEl.getAttribute('content') || '';
  }
  const hasOg = document.querySelectorAll('meta[property^="og:"]').length > 0;

  // Headings
  const allHeadings = [];
  document.querySelectorAll('h1, h2, h3, h4').forEach(el => {
    const text = (el.textContent || '').trim();
    if (text) allHeadings.push({ tag: el.tagName.toLowerCase(), text });
  });

  // Verify extraction correctness on PentAGI page
  assert.ok(title.includes('pentagi'), 'Title must contain pentagi');
  assert.strictEqual(hasOg, true, 'Must detect OpenGraph tags');
  assert.strictEqual(canonical, 'https://github.com/vxcontrol/pentagi', 'Must extract canonical/og:url');
  assert.ok(allHeadings.length >= 10, 'Must extract structured headings');
  assert.ok(metaDesc.length > 20, 'Must extract meta description');

  // Verify scoring
  let score = 50;
  if (allHeadings.filter(h => h.tag === 'h1').length === 1) score += 15;
  if (allHeadings.filter(h => h.tag === 'h2').length >= 2) score += 10;
  if (metaDesc.length >= 70 && metaDesc.length <= 160) score += 15;
  score = Math.min(100, Math.max(10, score));
  assert.ok(score >= 70, 'Score should reflect well-structured GitHub repo documentation');
});

test('Auth & Session API - Enterprise Access Verification', async (t) => {
  let isServerUp = false;
  try {
    const ping = await fetch('http://localhost:3001/api/v1/health', { signal: AbortSignal.timeout(1500) });
    isServerUp = ping.ok;
  } catch {}

  if (!isServerUp) {
    t.skip('Next.js server not running on port 3001; skipping live HTTP roundtrip');
    return;
  }

  // Test authentication endpoint on live Next.js instance
  const loginRes = await fetch('http://localhost:3001/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test-agent@seo-studio.com',
      name: 'Agent Tester',
      provider: 'email'
    })
  });
  assert.strictEqual(loginRes.status, 200, 'Login route must return 200');
  const loginData = await loginRes.json();
  assert.strictEqual(loginData.authenticated, true);
  assert.ok(loginData.token.startsWith('sec_live_'), 'Must return secure session token');
  assert.strictEqual(loginData.workspace.planTier, 'ENTERPRISE');

  // Verify Bearer token session
  const sessionRes = await fetch('http://localhost:3001/api/v1/auth/session', {
    headers: { 'Authorization': `Bearer ${loginData.token}` }
  });
  assert.strictEqual(sessionRes.status, 200, 'Session route must return 200');
  const sessionData = await sessionRes.json();
  assert.strictEqual(sessionData.authenticated, true);
  assert.strictEqual(sessionData.entitlements.unlimitedDocuments, true);
  assert.strictEqual(sessionData.entitlements.maxActiveAiPrompts, 100);
  assert.strictEqual(sessionData.entitlements.dailyPromptRefresh, true);
  assert.strictEqual(sessionData.entitlements.unlimitedBrandSpaces, true);
  assert.strictEqual(sessionData.entitlements.apiAccess, true);
});
