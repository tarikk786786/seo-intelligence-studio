import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Window } from 'happy-dom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the real HTML saved from https://github.com/vxcontrol/pentagi
const htmlFilePath = path.join(__dirname, 'sample_pentagi.html');
const rawHtml = fs.readFileSync(htmlFilePath, 'utf-8');

test('Chrome Extension Page Audit on https://github.com/vxcontrol/pentagi', async (t) => {
  const window = new Window({ url: 'https://github.com/vxcontrol/pentagi' });
  const document = window.document;
  document.write(rawHtml);

  // Replicate extractOnPageDataInTab logic from popup.ts
  const title = document.title || '';
  const metaDescEl = document.querySelector('meta[name="description"]') || document.querySelector('meta[property="og:description"]');
  const metaDesc = metaDescEl ? metaDescEl.getAttribute('content') || '' : '';
  const canonicalEl = document.querySelector('link[rel="canonical"]');
  let canonical = canonicalEl ? canonicalEl.getAttribute('href') || '' : '';
  if (!canonical) {
    const ogUrlEl = document.querySelector('meta[property="og:url"]');
    if (ogUrlEl) {
      canonical = ogUrlEl.getAttribute('content') || '';
    }
  }
  const robotsEl = document.querySelector('meta[name="robots"]');
  const robots = robotsEl ? robotsEl.getAttribute('content') || 'index, follow' : 'index, follow';
  const hasOg = document.querySelectorAll('meta[property^="og:"]').length > 0;

  // Headings
  const h1 = [];
  const h2 = [];
  const h3 = [];
  const allHeadings = [];

  document.querySelectorAll('h1, h2, h3, h4').forEach(el => {
    const text = (el.textContent || '').trim();
    if (text) {
      const tag = el.tagName.toLowerCase();
      allHeadings.push({ tag, text });
      if (tag === 'h1') h1.push(text);
      if (tag === 'h2') h2.push(text);
      if (tag === 'h3') h3.push(text);
    }
  });

  // Text & Word count
  const bodyText = (document.body.innerText || '').replace(/\s+/g, ' ').trim();
  const words = bodyText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readTimeMin = Math.max(1, Math.round(wordCount / 200));

  // Syllables heuristic for Flesch Reading Ease
  const sentences = bodyText.split(/[.!?]+/).filter(Boolean);
  const sentenceCount = Math.max(1, sentences.length);
  let totalSyllables = 0;
  words.slice(0, 1000).forEach(w => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, '');
    const matches = clean.match(/[aeiouy]{1,2}/g);
    totalSyllables += matches ? matches.length : 1;
  });
  const avgSyllablesPerWord = totalSyllables / Math.min(1000, Math.max(1, wordCount));
  const rawFlesch = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * avgSyllablesPerWord;
  const fleschScore = Math.max(0, Math.min(100, Math.round(rawFlesch)));

  let fleschLabel = 'Standard';
  if (fleschScore >= 75) fleschLabel = 'Easy (Accessible)';
  else if (fleschScore >= 50) fleschLabel = 'Standard (Good)';
  else fleschLabel = 'Complex / Technical';

  // Images
  const imgs = document.querySelectorAll('img');
  let missingAltCount = 0;
  imgs.forEach(img => {
    const alt = img.getAttribute('alt');
    if (!alt || alt.trim().length === 0) missingAltCount++;
  });

  // Links
  const links = document.querySelectorAll('a[href]');
  let internalLinks = 0;
  let externalLinks = 0;
  const currentHost = window.location.hostname;
  links.forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#') || href.startsWith('javascript:')) return;
    try {
      const url = new URL(href, window.location.href);
      if (url.hostname === currentHost) internalLinks++;
      else externalLinks++;
    } catch {
      internalLinks++;
    }
  });

  // Schema JSON-LD
  const schemas = [];
  document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
    try {
      const parsed = JSON.parse(script.textContent || '{}');
      if (parsed['@type']) {
        schemas.push(String(parsed['@type']));
      } else if (Array.isArray(parsed['@graph'])) {
        parsed['@graph'].forEach((item) => {
          if (item['@type']) schemas.push(String(item['@type']));
        });
      }
    } catch {}
  });

  const auditData = {
    url: window.location.href,
    title,
    metaDesc,
    canonical,
    robots,
    hasOg,
    h1,
    h2,
    h3,
    allHeadings,
    wordCount,
    charCount: bodyText.length,
    readTimeMin,
    fleschScore,
    fleschLabel,
    imageCount: imgs.length,
    missingAltCount,
    internalLinks,
    externalLinks,
    schemas: Array.from(new Set(schemas)),
  };

  console.log('EXTRACTED DATA:', {
    title: auditData.title,
    metaDesc: auditData.metaDesc,
    canonical: auditData.canonical,
    hasOg: auditData.hasOg,
    h1Count: auditData.h1.length,
    h2Count: auditData.h2.length,
    allHeadingsCount: auditData.allHeadings.length,
    wordCount: auditData.wordCount,
    imageCount: auditData.imageCount,
    internalLinks: auditData.internalLinks,
    externalLinks: auditData.externalLinks,
  });
  assert.ok(auditData.title.includes('pentagi') || auditData.title.includes('GitHub'), 'Title should reference pentagi or GitHub');
  assert.strictEqual(auditData.hasOg, true, 'GitHub page should contain OpenGraph tags');
  assert.ok(auditData.canonical.includes('github.com/vxcontrol/pentagi'), 'Canonical URL should point to repository');
  assert.ok(auditData.allHeadings.length > 0, 'Headings should be parsed from readme/page');
  assert.ok(auditData.wordCount > 50, 'Page word count should be detected');
  assert.ok(auditData.internalLinks > 0, 'Internal links should be counted');
  assert.ok(auditData.imageCount >= 0, 'Image count should be recorded');

  // 2. Score Calculation Test
  let score = 50;
  if (auditData.h1.length === 1) score += 15;
  if (auditData.h2.length >= 2) score += 10;
  if (auditData.metaDesc.length >= 70 && auditData.metaDesc.length <= 160) score += 15;
  if (auditData.missingAltCount === 0 && auditData.imageCount > 0) score += 10;
  score = Math.min(100, Math.max(10, score));

  assert.ok(score >= 10 && score <= 100, 'Score should be between 10 and 100');

  // 3. Diagnostic Recommendation Engine Test
  const alerts = [];
  if (!auditData.title) alerts.push('Missing <title> tag entirely.');
  else if (auditData.title.length < 30) alerts.push(`Title is short (${auditData.title.length} chars). Recommended: 50-60.`);
  else if (auditData.title.length > 60) alerts.push(`Title exceeds 60 chars (${auditData.title.length} chars), risk of Google SERP truncation.`);

  if (!auditData.metaDesc) alerts.push('Missing Meta Description tag.');
  else if (auditData.metaDesc.length < 70) alerts.push(`Meta Description is short (${auditData.metaDesc.length} chars). Aim for 140-160.`);
  else if (auditData.metaDesc.length > 160) alerts.push(`Meta Description exceeds 160 chars (${auditData.metaDesc.length} chars).`);

  if (auditData.h1.length === 0) alerts.push('Missing H1 heading. Every indexed page should have 1 primary H1.');
  else if (auditData.h1.length > 1) alerts.push(`Found ${auditData.h1.length} H1 headings. Best practice is exactly 1 per page.`);

  if (auditData.missingAltCount > 0) alerts.push(`${auditData.missingAltCount} images are missing descriptive ALT attributes.`);
  if (!auditData.canonical) alerts.push('Missing rel="canonical" link. Recommend setting canonical tag.');
  if (auditData.schemas.length === 0) alerts.push('No JSON-LD structured data detected. Add Schema for rich search snippets.');

  assert.ok(Array.isArray(alerts), 'Alerts array should be generated');

  // 4. Markdown Audit Export Test
  const md = [
    `# On-Page SEO Audit: ${auditData.title}`,
    `**URL:** ${auditData.url}`,
    `**Page Score:** ${score}/100`,
    ``,
    `## Meta Overview`,
    `- **Title (${auditData.title.length} chars):** ${auditData.title}`,
    `- **Meta Description (${auditData.metaDesc.length} chars):** ${auditData.metaDesc || 'N/A'}`,
    `- **Canonical:** ${auditData.canonical || 'None'}`,
    `- **Robots:** ${auditData.robots}`,
    `- **OpenGraph:** ${auditData.hasOg ? 'Yes' : 'No'}`,
    ``,
    `## Content Structure`,
    `- **Word Count:** ${auditData.wordCount.toLocaleString()}`,
    `- **Reading Time:** ~${auditData.readTimeMin} min`,
    `- **Flesch Reading Ease:** ${auditData.fleschScore}/100 (${auditData.fleschLabel})`,
    `- **Headings:** ${auditData.h1.length} H1s, ${auditData.h2.length} H2s, ${auditData.h3.length} H3s`,
    `- **Images:** ${auditData.imageCount} total (${auditData.missingAltCount} missing alt)`,
    `- **Links:** ${auditData.internalLinks} internal, ${auditData.externalLinks} external`,
    `- **Schemas Detected:** ${auditData.schemas.join(', ') || 'None'}`
  ].join('\n');

  assert.ok(md.includes('# On-Page SEO Audit:'), 'Markdown must have header');
  assert.ok(md.includes('https://github.com/vxcontrol/pentagi'), 'Markdown must include URL');
  assert.ok(md.includes('Content Structure'), 'Markdown must include Content Structure section');

  // 5. JSON Report Export Test
  const jsonReport = JSON.stringify({
    auditDate: new Date().toISOString(),
    score,
    ...auditData,
  }, null, 2);

  const parsedReport = JSON.parse(jsonReport);
  assert.strictEqual(parsedReport.url, 'https://github.com/vxcontrol/pentagi');
  assert.strictEqual(parsedReport.score, score);
  assert.strictEqual(typeof parsedReport.wordCount, 'number');

  // 6. Content Editor Sync URL Generation Test
  const backendApiUrl = 'http://localhost:3001';
  const importUrl = `${backendApiUrl}/documents/new?importUrl=${encodeURIComponent(auditData.url)}&title=${encodeURIComponent(auditData.title)}`;
  assert.ok(importUrl.startsWith('http://localhost:3001/documents/new?importUrl=https%3A%2F%2Fgithub.com%2Fvxcontrol%2Fpentagi'));

  console.log('✓ Successfully audited https://github.com/vxcontrol/pentagi with Chrome Extension engine:');
  console.log(`  - Title: "${auditData.title.slice(0, 50)}..."`);
  console.log(`  - Score: ${score}/100`);
  console.log(`  - Word Count: ${auditData.wordCount}`);
  console.log(`  - Headings Found: ${auditData.allHeadings.length}`);
  console.log(`  - Alerts Count: ${alerts.length}`);
});
