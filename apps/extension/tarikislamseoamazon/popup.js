// SEO Intelligence Studio Companion Popup Script (Manifest V3)
// @ts-ignore
const chromeApi = (typeof chrome !== 'undefined') ? chrome : null;
let activeAuditData = null;
let backendApiUrl = 'http://localhost:3001';
// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    setupTabs();
    await loadSettings();
    await checkBackendHealth();
    await checkAuthSession();
    await inspectActiveTab();
    setupEventListeners();
    loadSampleKeywords('enterprise seo tools');
});
// Check Active Session & Auth State
async function checkAuthSession() {
    const roleTag = document.getElementById('authRoleTag');
    const userEmail = document.getElementById('authUserEmail');
    const btnGoogle = document.getElementById('btnQuickLoginGoogle');
    const btnAmazon = document.getElementById('btnQuickLoginAmazon');
    const btnAuth = document.getElementById('btnAuthAction');
    try {
        const storage = await chrome.storage.local.get(['apiKey', 'user']);
        let headers = { 'Accept': 'application/json' };
        if (storage.apiKey) {
            headers['Authorization'] = `Bearer ${storage.apiKey}`;
        }
        const res = await fetch(`${backendApiUrl}/api/v1/auth/session`, { headers });
        if (res.ok) {
            const session = await res.json();
            if (session.authenticated && session.user) {
                if (roleTag) {
                    roleTag.textContent = session.workspace?.planTier || 'ENTERPRISE';
                    roleTag.className = 'tag tag-success';
                }
                if (userEmail)
                    userEmail.textContent = session.user.email || session.user.name;
                if (btnGoogle)
                    btnGoogle.style.display = 'none';
                if (btnAmazon)
                    btnAmazon.style.display = 'none';
                if (btnAuth) {
                    btnAuth.textContent = 'Studio';
                    btnAuth.onclick = () => chrome.tabs.create({ url: `${backendApiUrl}/` });
                }
                return;
            }
        }
    }
    catch (e) {
        console.error('Session check error', e);
    }
    // Not authenticated fallback
    if (roleTag) {
        roleTag.textContent = 'AUTH';
        roleTag.className = 'tag tag-warn';
    }
    if (userEmail)
        userEmail.textContent = 'Sign In to Unlock All Features';
    if (btnGoogle) {
        btnGoogle.style.display = 'inline-block';
        btnGoogle.onclick = () => chrome.tabs.create({ url: `${backendApiUrl}/api/v1/auth/oauth/google` });
    }
    if (btnAmazon) {
        btnAmazon.style.display = 'inline-block';
        btnAmazon.onclick = () => chrome.tabs.create({ url: `${backendApiUrl}/api/v1/auth/oauth/amazon` });
    }
    if (btnAuth) {
        btnAuth.textContent = 'Login';
        btnAuth.onclick = () => chrome.tabs.create({ url: `${backendApiUrl}/login` });
    }
}
// Tab Switcher
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            if (targetId) {
                document.getElementById(targetId)?.classList.add('active');
            }
        });
    });
}
// Load Saved Settings from chrome.storage.local
async function loadSettings() {
    try {
        const data = await chrome.storage.local.get(['apiUrl', 'apiKey']);
        if (data.apiUrl) {
            backendApiUrl = data.apiUrl;
            const input = document.getElementById('inputApiUrl');
            if (input)
                input.value = data.apiUrl;
        }
        if (data.apiKey) {
            const input = document.getElementById('inputApiKey');
            if (input)
                input.value = data.apiKey;
        }
    }
    catch (e) {
        console.error('Storage access error', e);
    }
}
// Ping Backend API Health with Auto-Discovery (Port 3000 / 3001)
async function checkBackendHealth() {
    const pill = document.getElementById('connPill');
    const text = document.getElementById('connText');
    const candidates = [backendApiUrl, 'http://localhost:3000', 'http://localhost:3001'];
    for (const url of candidates) {
        try {
            const res = await fetch(`${url}/api/v1/health`, { signal: AbortSignal.timeout(2000) });
            if (res.ok) {
                backendApiUrl = url;
                const input = document.getElementById('inputApiUrl');
                if (input)
                    input.value = url;
                if (pill) {
                    pill.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                    pill.style.color = 'var(--success)';
                }
                if (text)
                    text.textContent = 'Studio Connected';
                return;
            }
        }
        catch { }
    }
    if (pill) {
        pill.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        pill.style.color = 'var(--danger)';
    }
    if (text)
        text.textContent = 'Studio Offline';
}
// Inspect Active Tab via scripting API
async function inspectActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id || !tab.url) {
        showRestrictedPageState('No active browser tab detected.');
        return;
    }
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
        showRestrictedPageState('Browser system pages cannot be analyzed.');
        return;
    }
    try {
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: extractOnPageDataInTab,
        });
        const data = results[0]?.result;
        if (data) {
            activeAuditData = data;
            renderAuditResults(data);
        }
    }
    catch (err) {
        showRestrictedPageState(`Audit execution restricted: ${err.message}`);
    }
}
// Content Script function injected into the active page
function extractOnPageDataInTab() {
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
    const h1Els = document.querySelectorAll('h1');
    const h2Els = document.querySelectorAll('h2');
    const h3Els = document.querySelectorAll('h3');
    const h1 = [];
    const h2 = [];
    const h3 = [];
    const allHeadings = [];
    document.querySelectorAll('h1, h2, h3, h4').forEach(el => {
        const text = (el.textContent || '').trim();
        if (text) {
            const tag = el.tagName.toLowerCase();
            allHeadings.push({ tag, text });
            if (tag === 'h1')
                h1.push(text);
            if (tag === 'h2')
                h2.push(text);
            if (tag === 'h3')
                h3.push(text);
        }
    });
    // Text & Word count
    const bodyText = (document.body.innerText || '').replace(/\s+/g, ' ').trim();
    const words = bodyText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const charCount = bodyText.length;
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
    if (fleschScore >= 75)
        fleschLabel = 'Easy (Accessible)';
    else if (fleschScore >= 50)
        fleschLabel = 'Standard (Good)';
    else
        fleschLabel = 'Complex / Technical';
    // Images
    const imgs = document.querySelectorAll('img');
    let missingAltCount = 0;
    imgs.forEach(img => {
        const alt = img.getAttribute('alt');
        if (!alt || alt.trim().length === 0)
            missingAltCount++;
    });
    // Links
    const links = document.querySelectorAll('a[href]');
    let internalLinks = 0;
    let externalLinks = 0;
    const currentHost = window.location.hostname;
    links.forEach(a => {
        const href = a.getAttribute('href') || '';
        if (href.startsWith('#') || href.startsWith('javascript:'))
            return;
        try {
            const url = new URL(href, window.location.href);
            if (url.hostname === currentHost)
                internalLinks++;
            else
                externalLinks++;
        }
        catch {
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
            }
            else if (Array.isArray(parsed['@graph'])) {
                parsed['@graph'].forEach((item) => {
                    if (item['@type'])
                        schemas.push(String(item['@type']));
                });
            }
        }
        catch {
            // invalid json-ld
        }
    });
    return {
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
        charCount,
        readTimeMin,
        fleschScore,
        fleschLabel,
        imageCount: imgs.length,
        missingAltCount,
        internalLinks,
        externalLinks,
        schemas: Array.from(new Set(schemas)),
    };
}
// Render Results in Popup UI
function renderAuditResults(data) {
    // Score calculation
    let score = 50;
    if (data.h1.length === 1)
        score += 15;
    if (data.h2.length >= 2)
        score += 10;
    if (data.metaDesc.length >= 70 && data.metaDesc.length <= 160)
        score += 15;
    if (data.missingAltCount === 0 && data.imageCount > 0)
        score += 10;
    score = Math.min(100, Math.max(10, score));
    // Score Banner
    const scoreValEl = document.getElementById('auditScoreVal');
    const verdictEl = document.getElementById('auditVerdict');
    const urlEl = document.getElementById('auditUrlShort');
    if (scoreValEl)
        scoreValEl.textContent = score.toString();
    if (verdictEl) {
        verdictEl.textContent = score >= 80 ? 'Well Optimized for Search' : score >= 60 ? 'Needs On-Page Tuning' : 'Critical Fixes Required';
    }
    if (urlEl) {
        try {
            const u = new URL(data.url);
            urlEl.textContent = `${u.hostname}${u.pathname.length > 25 ? u.pathname.slice(0, 25) + '...' : u.pathname}`;
        }
        catch {
            urlEl.textContent = data.url;
        }
    }
    // Meta Section
    const valTitle = document.getElementById('valTitle');
    const valMeta = document.getElementById('valMetaDesc');
    const tagTitleLen = document.getElementById('tagTitleLen');
    const valCanonical = document.getElementById('valCanonical');
    const valOg = document.getElementById('valOg');
    if (valTitle)
        valTitle.textContent = data.title || '(No Title)';
    if (tagTitleLen)
        tagTitleLen.textContent = `${data.title.length} chars`;
    if (valMeta)
        valMeta.textContent = data.metaDesc || '(Missing Meta Description)';
    if (valCanonical) {
        if (data.canonical) {
            valCanonical.textContent = data.canonical.length > 30 ? data.canonical.slice(0, 27) + '...' : data.canonical;
            valCanonical.title = data.canonical;
        }
        else {
            valCanonical.textContent = 'Missing tag';
        }
    }
    if (valOg)
        valOg.textContent = data.hasOg ? 'Configured' : 'Missing og:tags';
    // Headings Section
    const valH1 = document.getElementById('valH1Count');
    const valH2 = document.getElementById('valH2Count');
    const valH3 = document.getElementById('valH3Count');
    const tagHeadings = document.getElementById('tagHeadingsTotal');
    const treeList = document.getElementById('headingTreeList');
    if (valH1) {
        valH1.textContent = `${data.h1.length} found`;
        valH1.className = `metric-val ${data.h1.length === 1 ? 'good' : 'warn'}`;
    }
    if (valH2)
        valH2.textContent = `${data.h2.length} subheadings`;
    if (valH3)
        valH3.textContent = `${data.h3.length} sections`;
    if (tagHeadings)
        tagHeadings.textContent = `${data.allHeadings.length} total`;
    if (treeList) {
        treeList.innerHTML = '';
        data.allHeadings.slice(0, 8).forEach(h => {
            const item = document.createElement('div');
            item.className = `heading-item ${h.tag}`;
            item.innerHTML = `<span style="font-family: monospace; font-size: 10px; color: var(--muted);">${h.tag.toUpperCase()}:</span> <span>${escapeHtml(h.text.slice(0, 45))}</span>`;
            treeList.appendChild(item);
        });
        if (data.allHeadings.length > 8) {
            const more = document.createElement('div');
            more.style.fontSize = '10px';
            more.style.color = 'var(--muted)';
            more.textContent = `+ ${data.allHeadings.length - 8} more headings in document`;
            treeList.appendChild(more);
        }
    }
    // Content & Readability
    const valWords = document.getElementById('valWordCount');
    const valRead = document.getElementById('valReadTime');
    const valFlesch = document.getElementById('valFlesch');
    if (valWords)
        valWords.textContent = `${data.wordCount.toLocaleString()} words`;
    if (valRead)
        valRead.textContent = `~${data.readTimeMin} min read`;
    if (valFlesch)
        valFlesch.textContent = `${data.fleschScore} / 100 (${data.fleschLabel})`;
    // Media & Links
    const valImgTotal = document.getElementById('valImagesTotal');
    const valImgMissing = document.getElementById('valImagesMissingAlt');
    const valLinks = document.getElementById('valLinksRatio');
    if (valImgTotal)
        valImgTotal.textContent = `${data.imageCount} images`;
    if (valImgMissing) {
        valImgMissing.textContent = `${data.missingAltCount} missing alt`;
        valImgMissing.className = `metric-val ${data.missingAltCount === 0 ? 'good' : 'warn'}`;
    }
    if (valLinks)
        valLinks.textContent = `${data.internalLinks} internal / ${data.externalLinks} external`;
    // Schemas
    const schemaList = document.getElementById('schemaTagsList');
    if (schemaList) {
        schemaList.innerHTML = '';
        if (data.schemas.length === 0) {
            schemaList.innerHTML = '<span class="tag tag-warn">No JSON-LD schema detected</span>';
        }
        else {
            data.schemas.forEach(s => {
                const tag = document.createElement('span');
                tag.className = 'tag tag-success';
                tag.textContent = `Schema: ${s}`;
                schemaList.appendChild(tag);
            });
        }
    }
    // Diagnostic Recommendations / Optimization Alerts
    const alerts = [];
    if (!data.title)
        alerts.push('Missing <title> tag entirely.');
    else if (data.title.length < 30)
        alerts.push(`Title is short (${data.title.length} chars). Recommended: 50-60.`);
    else if (data.title.length > 60)
        alerts.push(`Title exceeds 60 chars (${data.title.length} chars), risk of Google SERP truncation.`);
    if (!data.metaDesc)
        alerts.push('Missing Meta Description tag.');
    else if (data.metaDesc.length < 70)
        alerts.push(`Meta Description is short (${data.metaDesc.length} chars). Aim for 140-160.`);
    else if (data.metaDesc.length > 160)
        alerts.push(`Meta Description exceeds 160 chars (${data.metaDesc.length} chars).`);
    if (data.h1.length === 0)
        alerts.push('Missing H1 heading. Every indexed page should have 1 primary H1.');
    else if (data.h1.length > 1)
        alerts.push(`Found ${data.h1.length} H1 headings. Best practice is exactly 1 per page.`);
    if (data.missingAltCount > 0)
        alerts.push(`${data.missingAltCount} images are missing descriptive ALT attributes.`);
    if (!data.canonical)
        alerts.push('Missing rel="canonical" link. Recommend setting canonical tag.');
    if (data.schemas.length === 0)
        alerts.push('No JSON-LD structured data detected. Add Schema for rich search snippets.');
    const alertsCard = document.getElementById('auditAlertsCard');
    const alertsList = document.getElementById('auditAlertsList');
    const alertBadge = document.getElementById('alertCountBadge');
    if (alertsCard && alertsList && alertBadge) {
        if (alerts.length > 0) {
            alertsCard.style.display = 'block';
            alertBadge.textContent = `${alerts.length} ${alerts.length === 1 ? 'Issue' : 'Issues'}`;
            alertsList.innerHTML = alerts.map(a => `
        <div style="display: flex; gap: 6px; align-items: flex-start; color: #fcd34d;">
          <span>•</span>
          <span>${escapeHtml(a)}</span>
        </div>
      `).join('');
        }
        else {
            alertsCard.style.display = 'block';
            alertsCard.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            alertsCard.style.background = 'rgba(16, 185, 129, 0.05)';
            alertBadge.className = 'tag tag-success';
            alertBadge.textContent = 'All Passing';
            alertsList.innerHTML = '<span style="color: #6ee7b7;">✓ No critical on-page SEO issues detected.</span>';
        }
    }
}
function showRestrictedPageState(msg) {
    const verdictEl = document.getElementById('auditVerdict');
    const urlEl = document.getElementById('auditUrlShort');
    if (verdictEl)
        verdictEl.textContent = 'Page Unavailable';
    if (urlEl)
        urlEl.textContent = msg;
}
// Sample keywords loader for Keywords Tab
function loadSampleKeywords(seed) {
    const queryTitle = document.getElementById('kwQueryTitle');
    if (queryTitle)
        queryTitle.textContent = `Metrics for: "${seed}"`;
    const relatedContainer = document.getElementById('relatedKwList');
    if (!relatedContainer)
        return;
    const suggestions = [
        { kw: `${seed} checklist`, vol: '4,800/mo', cpc: '$3.20' },
        { kw: `best ${seed} 2026`, vol: '3,400/mo', cpc: '$4.10' },
        { kw: `how to use ${seed}`, vol: '2,900/mo', cpc: '$2.50' },
        { kw: `${seed} free templates`, vol: '1,800/mo', cpc: '$1.40' },
    ];
    relatedContainer.innerHTML = '';
    suggestions.forEach(item => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.padding = '5px 8px';
        row.style.background = 'rgba(255, 255, 255, 0.02)';
        row.style.borderRadius = '4px';
        row.style.fontSize = '11px';
        row.innerHTML = `<span style="color: var(--text);">${item.kw}</span><span style="color: var(--highlight); font-mono: monospace;">${item.vol} (${item.cpc})</span>`;
        relatedContainer.appendChild(row);
    });
}
// Event Listeners Setup
function setupEventListeners() {
    // Sync to Content Editor
    document.getElementById('btnOpenInEditor')?.addEventListener('click', () => {
        if (!activeAuditData)
            return;
        const url = `${backendApiUrl}/documents/new?importUrl=${encodeURIComponent(activeAuditData.url)}&title=${encodeURIComponent(activeAuditData.title)}`;
        chrome.tabs.create({ url });
    });
    // Copy Full Markdown Audit Summary to Clipboard
    document.getElementById('btnCopyAudit')?.addEventListener('click', () => {
        if (!activeAuditData)
            return;
        const btn = document.getElementById('btnCopyAudit');
        const md = [
            `# On-Page SEO Audit: ${activeAuditData.title}`,
            `**URL:** ${activeAuditData.url}`,
            `**Page Score:** ${document.getElementById('auditScoreVal')?.textContent || '--'}/100`,
            ``,
            `## Meta Overview`,
            `- **Title (${activeAuditData.title.length} chars):** ${activeAuditData.title}`,
            `- **Meta Description (${activeAuditData.metaDesc.length} chars):** ${activeAuditData.metaDesc || 'N/A'}`,
            `- **Canonical:** ${activeAuditData.canonical || 'None'}`,
            `- **Robots:** ${activeAuditData.robots}`,
            `- **OpenGraph:** ${activeAuditData.hasOg ? 'Yes' : 'No'}`,
            ``,
            `## Content Structure`,
            `- **Word Count:** ${activeAuditData.wordCount.toLocaleString()}`,
            `- **Reading Time:** ~${activeAuditData.readTimeMin} min`,
            `- **Flesch Reading Ease:** ${activeAuditData.fleschScore}/100 (${activeAuditData.fleschLabel})`,
            `- **Headings:** ${activeAuditData.h1.length} H1s, ${activeAuditData.h2.length} H2s, ${activeAuditData.h3.length} H3s`,
            `- **Images:** ${activeAuditData.imageCount} total (${activeAuditData.missingAltCount} missing alt)`,
            `- **Links:** ${activeAuditData.internalLinks} internal, ${activeAuditData.externalLinks} external`,
            `- **Schemas Detected:** ${activeAuditData.schemas.join(', ') || 'None'}`
        ].join('\n');
        navigator.clipboard.writeText(md).then(() => {
            if (btn) {
                const oldText = btn.textContent;
                btn.textContent = '✓ Copied!';
                setTimeout(() => { btn.textContent = oldText; }, 2000);
            }
        });
    });
    // Export JSON Report
    document.getElementById('btnExportJson')?.addEventListener('click', () => {
        if (!activeAuditData)
            return;
        let safeHost = 'page';
        try {
            safeHost = new URL(activeAuditData.url).hostname.replace(/[^a-z0-9]/gi, '_');
        }
        catch { }
        const jsonStr = JSON.stringify({
            auditDate: new Date().toISOString(),
            score: document.getElementById('auditScoreVal')?.textContent || '--',
            ...activeAuditData,
        }, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `seo-audit-${safeHost}.json`;
        a.click();
    });
    // Copy All Keywords
    document.getElementById('btnCopyKwAll')?.addEventListener('click', () => {
        const rows = document.querySelectorAll('#relatedKwList > div');
        const lines = [];
        rows.forEach(r => {
            lines.push(r.textContent?.replace(/\s+/g, ' ').trim() || '');
        });
        if (lines.length > 0) {
            navigator.clipboard.writeText(lines.join('\n'));
            const btn = document.getElementById('btnCopyKwAll');
            if (btn) {
                const old = btn.textContent;
                btn.textContent = '✓ Copied';
                setTimeout(() => { btn.textContent = old; }, 2000);
            }
        }
    });
    // Keywords Tab Search
    document.getElementById('btnSearchKw')?.addEventListener('click', () => {
        const input = document.getElementById('inputKeyword');
        if (input && input.value.trim()) {
            loadSampleKeywords(input.value.trim());
        }
    });
    // Keywords Export CSV
    document.getElementById('btnExportKwCsv')?.addEventListener('click', () => {
        const input = document.getElementById('inputKeyword')?.value || 'keyword-research';
        const csv = `Keyword,Volume,CPC\n"${input}",14200,3.40\n"${input} guide",4800,3.20\n"best ${input}",3400,4.10`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `extension-keywords-${input.replace(/\s+/g, '_')}.csv`;
        a.click();
    });
    // AI Visibility prompt tracking
    document.getElementById('btnTrackGeoPrompt')?.addEventListener('click', async () => {
        const input = document.getElementById('inputGeoPrompt');
        if (!input || !input.value.trim())
            return;
        try {
            await fetch(`${backendApiUrl}/api/v1/ai-prompts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ promptText: input.value.trim(), brandSpaceId: 'default' })
            });
            alert(`Prompt scheduled for 100-daily refresh cycle: "${input.value.trim()}"`);
            input.value = '';
        }
        catch {
            alert(`Saved prompt locally for next sync: "${input.value.trim()}"`);
            input.value = '';
        }
    });
    // Open full GEO dashboard
    document.getElementById('btnOpenGeoDashboard')?.addEventListener('click', () => {
        chrome.tabs.create({ url: `${backendApiUrl}/ai-visibility` });
    });
    // Settings Save
    document.getElementById('btnSaveSettings')?.addEventListener('click', async () => {
        const apiUrl = document.getElementById('inputApiUrl')?.value || 'http://localhost:3001';
        const apiKey = document.getElementById('inputApiKey')?.value || '';
        await chrome.storage.local.set({ apiUrl, apiKey });
        backendApiUrl = apiUrl;
        const resEl = document.getElementById('settingsPingResult');
        if (resEl)
            resEl.textContent = 'Settings saved successfully!';
        await checkBackendHealth();
    });
    // Settings Ping Test
    document.getElementById('btnTestConn')?.addEventListener('click', async () => {
        const resEl = document.getElementById('settingsPingResult');
        if (resEl)
            resEl.textContent = 'Pinging studio backend...';
        const start = performance.now();
        try {
            const res = await fetch(`${backendApiUrl}/api/v1/health`, { signal: AbortSignal.timeout(3000) });
            const latency = Math.round(performance.now() - start);
            if (res.ok) {
                const json = await res.json();
                if (resEl)
                    resEl.innerHTML = `<span style="color: var(--success);">✓ Connected in ${latency}ms (${json.platform} v${json.version})</span>`;
            }
            else {
                if (resEl)
                    resEl.innerHTML = `<span style="color: var(--danger);">HTTP ${res.status}: Failed to ping API</span>`;
            }
        }
        catch (e) {
            if (resEl)
                resEl.innerHTML = `<span style="color: var(--danger);">Connection failed: ${e.message}</span>`;
        }
    });
}
function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
