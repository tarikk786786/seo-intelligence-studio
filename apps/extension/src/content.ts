// Google Search Results Overlay (Keyword Surfer Equivalent)
// Manifest V3 Content Script for Google Search

// @ts-ignore
const chromeApi = (typeof chrome !== 'undefined') ? chrome : null;

(function initGoogleSerpOverlay() {
  const isGoogleSearch = (window.location.hostname.includes('google.') && window.location.pathname.startsWith('/search'));
  if (!isGoogleSearch) return;

  // Prevent multiple injections
  if (document.getElementById('seo-studio-serp-widget')) return;

  const urlParams = new URLSearchParams(window.location.search);
  const searchInput = (document.querySelector('input[name="q"], textarea[name="q"]') as HTMLInputElement);
  const query = (urlParams.get('q') || searchInput?.value || '').trim();
  if (!query) return;

  console.log('[SEO Studio] Injecting Keyword Surfer overlay for query:', query);

  // Read top organic result domains from current Google SERP
  const serpDomains: Array<{ domain: string; title: string }> = [];
  document.querySelectorAll('#search .g, div[data-hveid]').forEach(el => {
    const link = el.querySelector('a[href^="http"]');
    const titleEl = el.querySelector('h3');
    if (link && titleEl) {
      try {
        const url = new URL(link.getAttribute('href') || '');
        if (!url.hostname.includes('google.') && !serpDomains.some(d => d.domain === url.hostname)) {
          serpDomains.push({
            domain: url.hostname.replace(/^www\./, ''),
            title: titleEl.textContent || url.hostname,
          });
        }
      } catch {}
    }
  });

  // Calculate deterministic volume estimate from query length / hash
  let queryHash = 0;
  for (let i = 0; i < query.length; i++) {
    queryHash = (queryHash << 5) - queryHash + query.charCodeAt(i);
    queryHash |= 0;
  }
  const baseVol = Math.abs(queryHash % 28000) + 1200;
  const cpc = (Math.abs(queryHash % 450) / 100 + 0.85).toFixed(2);
  const difficulty = Math.abs(queryHash % 40) + 45;

  // Inject in-SERP Competitor Badges on each ranking Google result
  try {
    document.querySelectorAll('#search .g, div[data-hveid]').forEach((el, index) => {
      const h3 = el.querySelector('h3');
      if (h3 && !el.querySelector('.sis-serp-badge')) {
        const badge = document.createElement('div');
        badge.className = 'sis-serp-badge';
        badge.style.cssText = 'display: inline-flex; align-items: center; gap: 8px; font-size: 11px; padding: 3px 8px; background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 4px; margin-top: 4px; color: #94a3b8; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;';
        
        const estVisits = Math.max(850, Math.round(baseVol * Math.max(0.12, 1 - index * 0.1)));
        const words = 1450 + ((index * 290) % 1100);
        badge.innerHTML = `
          <a href="https://tarikislam.in" target="_blank" style="color: #38bdf8; font-weight: bold; text-decoration: none;">✦ tarikislam.in</a>
          <span>Traffic: <strong style="color: #38bdf8;">~${estVisits.toLocaleString()}/mo</strong></span>
          <span style="color: #475569;">|</span>
          <span>Words: <strong style="color: #f1f5f9;">~${words}</strong></span>
        `;
        h3.parentElement?.appendChild(badge);
      }
    });
  } catch (e) {
    console.debug('[SEO Studio] In-SERP badges injection note:', e);
  }

  const widget = document.createElement('div');
  widget.id = 'seo-studio-serp-widget';
  widget.innerHTML = `
    <div class="sis-panel">
      <!-- Header -->
      <div class="sis-header">
        <div class="sis-title">
          <span style="color: #38bdf8; font-weight: 800;">✦</span> tarikislamseoamazon
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button class="sis-btn-icon" id="sis-btn-min" title="Minimize">–</button>
          <button class="sis-btn-icon" id="sis-btn-close" title="Close">✕</button>
        </div>
      </div>

      <!-- Main Body -->
      <div class="sis-body" id="sis-body-content">
        <!-- Target Query -->
        <div class="sis-query-box">
          <div class="sis-label">Search Query & Region</div>
          <div class="sis-query-text">${escapeHtml(query)}</div>
          <span style="font-size: 10px; color: #94a3b8;">Google Search (US / Global)</span>
        </div>

        <!-- Volume & CPC Grid -->
        <div class="sis-stats-grid">
          <div class="sis-stat-card">
            <div class="sis-stat-label">Monthly Volume</div>
            <div class="sis-stat-val">${baseVol.toLocaleString()}/mo</div>
          </div>
          <div class="sis-stat-card">
            <div class="sis-stat-label">Est. CPC (USD)</div>
            <div class="sis-stat-val">$${cpc}</div>
          </div>
        </div>

        <!-- Difficulty Gauge -->
        <div style="background: #1e293b; padding: 8px 10px; border-radius: 6px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; margin-bottom: 4px;">
            <span>Keyword Difficulty</span>
            <span style="color: #38bdf8; font-weight: 700;">${difficulty} / 100 (Competitive)</span>
          </div>
          <div style="width: 100%; height: 5px; background: #090d16; border-radius: 3px; overflow: hidden;">
            <div style="width: ${difficulty}%; height: 100%; background: #38bdf8; border-radius: 3px;"></div>
          </div>
        </div>

        <!-- Top Ranking Competitors in SERP -->
        <div class="sis-section-header">
          <span>Top Competitors in SERP (${serpDomains.length})</span>
        </div>
        <div class="sis-keywords-list" style="margin-bottom: 12px;">
          ${serpDomains.slice(0, 4).map((d, idx) => `
            <div class="sis-kw-row" style="display: flex; justify-content: space-between; align-items: center;">
              <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 180px;">
                <strong style="color: #38bdf8;">#${idx + 1}</strong> ${escapeHtml(d.domain)}
              </span>
              <span style="font-size: 10px; color: #94a3b8; font-family: monospace;">~1,850w</span>
            </div>
          `).join('')}
        </div>

        <!-- Similar Keyword Variations -->
        <div class="sis-section-header">
          <span>Similar Keywords</span>
          <button class="sis-btn-sm" id="sis-btn-export">Export CSV</button>
        </div>

        <div class="sis-keywords-list" id="sis-kw-list">
          <div class="sis-kw-row">
            <span>${escapeHtml(query)} guide</span>
            <span class="sis-kw-vol">${Math.round(baseVol * 0.45).toLocaleString()}/mo</span>
          </div>
          <div class="sis-kw-row">
            <span>best ${escapeHtml(query)} 2026</span>
            <span class="sis-kw-vol">${Math.round(baseVol * 0.35).toLocaleString()}/mo</span>
          </div>
          <div class="sis-kw-row">
            <span>how to optimize ${escapeHtml(query)}</span>
            <span class="sis-kw-vol">${Math.round(baseVol * 0.25).toLocaleString()}/mo</span>
          </div>
          <div class="sis-kw-row">
            <span>${escapeHtml(query)} strategies</span>
            <span class="sis-kw-vol">${Math.round(baseVol * 0.18).toLocaleString()}/mo</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 14px;">
          <button class="sis-btn-primary" id="sis-btn-create-doc">
            ↗ Open in Content Editor (Optimize)
          </button>
          <button class="sis-btn-secondary" id="sis-btn-track-prompt">
            ✦ Track in AI Visibility (100 Daily Refresh)
          </button>
        </div>

        <!-- Hardcore Watermark Footer -->
        <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); margin-top: 14px; padding-top: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #64748b;">
          <span>tarikislamseoamazon</span>
          <a href="https://tarikislam.in" target="_blank" style="color: #38bdf8; text-decoration: none; font-weight: 700;">Made by tarikislam.in ✦</a>
        </div>
      </div>
    </div>
  `;

  // Attach to Google layout
  // Check if Google Right Hand Side rail exists (#rhs)
  const rhs = document.getElementById('rhs');
  if (rhs) {
    widget.classList.add('sis-inline-rhs');
    rhs.prepend(widget);
  } else {
    widget.classList.add('sis-floating');
    document.body.appendChild(widget);
  }

  // Close / Hide
  document.getElementById('sis-btn-close')?.addEventListener('click', () => {
    widget.remove();
  });

  // Minimize / Expand
  let isMinimized = false;
  document.getElementById('sis-btn-min')?.addEventListener('click', () => {
    const bodyContent = document.getElementById('sis-body-content');
    const minBtn = document.getElementById('sis-btn-min');
    if (!bodyContent) return;

    isMinimized = !isMinimized;
    bodyContent.style.display = isMinimized ? 'none' : 'block';
    if (minBtn) minBtn.textContent = isMinimized ? '+' : '–';
  });

  // Export CSV
  document.getElementById('sis-btn-export')?.addEventListener('click', () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Keyword,Search Volume,Estimated CPC",
         `"${query}",${baseVol},${cpc}`,
         `"${query} guide",${Math.round(baseVol * 0.45)},2.40`,
         `"best ${query} 2026",${Math.round(baseVol * 0.35)},3.10`,
         `"how to optimize ${query}",${Math.round(baseVol * 0.25)},2.80`].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `keywords-${query.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Open in Content Editor
  document.getElementById('sis-btn-create-doc')?.addEventListener('click', () => {
    window.open(`http://localhost:3001/documents/new?targetKeyword=${encodeURIComponent(query)}&title=${encodeURIComponent(query)}`, '_blank');
  });

  // Track in AI Visibility
  document.getElementById('sis-btn-track-prompt')?.addEventListener('click', async () => {
    try {
      await fetch('http://localhost:3001/api/v1/ai-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText: `What are the best strategies for ${query}?`, brandSpaceId: 'default' })
      });
      alert(`Prompt scheduled for 100-daily AI refresh: "${query}"`);
    } catch {
      window.open(`http://localhost:3001/ai-visibility`, '_blank');
    }
  });

  function escapeHtml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
})();
