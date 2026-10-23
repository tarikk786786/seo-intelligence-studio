# UX Flows & User Journeys
## 09 / UX_FLOWS.md — The Vibe Coding Blueprint Standard

### Flow 1 — Account & First Brand Space Onboarding
1. User creates an account and logs into the platform.
2. User is directed to `/onboarding` (Personalized 6-Step Wizard).
3. User enters primary brand domain (`e.g. omniseo.global`) and target language/locale.
4. User enters 3–5 primary organic and generative search competitors (`surferseo.com`, `ahrefs.com`).
5. User enters live provider keys (Google Gemini Search Grounding API & SerpAPI) in `.env` or Integrations Hub.
6. Initial prompt seed collection is generated for daily tracking.
7. User loads unpacked Manifest V3 extension from `apps/extension/.output/chrome-mv3`.
8. State persists in `BrandSpace.onboardingDone = true`.
- **Loading State:** Stepper disables navigation buttons, shows "Verifying credentials...".
- **Empty State:** Helpful prompt inputs with example domains and topics.
- **Error State:** Specific API connectivity failure message; no mock success fallback.

### Flow 2 — Surfer-Grade Content Optimization
1. User navigates to `/documents/new` or clicks "Create Content Editor Doc".
2. User sets target keyword (e.g., `generative engine optimization`) and title.
3. User can optionally paste an existing live URL into the URL Ingestion bar.
4. SSRF-protected crawler fetches page structure, extracting H1–H3 headings, word count, and clean text.
5. TipTap editor displays live draft.
6. Real-time optimization algorithm recalculates score ($0-100$) on every keystroke:
   - NLP entity coverage checklist updates with target frequency targets.
   - Keyword density meter displays warning if density exceeds 3.0% (keyword stuffing).
   - Heading structure validator ensures single H1 and adequate H2/H3 depth.
   - Flesch Reading Ease score calculates readability difficulty.
7. User clicks "Export HTML" or "Export MD" for publishing.
- **Loading State:** "Fetching and ingesting URL..." progress indicator.
- **Error State:** Red banner explaining SSRF block or invalid URL error.

### Flow 3 — AI Visibility (GEO) Tracking & 100 Daily Refresh
1. User navigates to `/ai-visibility`.
2. Dashboard displays Brand Mention Rate (`%`), Share of Voice (`SoV`), and Verified Citations.
3. User adds tracked search queries (up to 100 max enforced by Entitlement Engine).
4. User clicks "Run Daily Refresh Now" or waits for BullMQ 24-hour midnight cron worker.
5. Worker dispatches prompt to Google Gemini with `google_search` grounding tool enabled.
6. Worker extracts:
   - Grounding chunks and cited web URLs.
   - Sentiment classification (Positive, Neutral, Negative) from mention context.
   - Mention position (e.g., `#1 Recommended`).
7. Observations and citations persist in `AiObservation` and `Citation` tables.
- **Loading State:** "Executing prompt against Gemini Search Grounding...".
- **Empty State:** "No observations recorded yet. Click 'Run Daily Refresh Now' to trigger first cycle.".

### Flow 4 — Companion Chrome Extension (In-SERP & Tab Audit)
1. User visits Google Search (`google.com/search?q=*`).
2. Content script detects query string, injecting the floating `SEO Intelligence Studio` sidebar.
3. User views monthly search volume, CPC, and related keyword variations.
4. User clicks "Export CSV" or "+ Create Content Editor Doc" to immediately launch the web editor.
5. On any public webpage, user clicks the extension icon in Chrome toolbar.
6. Popup script audits active DOM: Title, Meta Description, H1/H2/H3 counts, Missing Alt images, and Word Count.
7. Popup calculates instant On-Page Health Score and provides one-click "↗ Open in Content Editor" button.
- **Error State:** On restricted internal pages (`chrome://`, `about:blank`), displays "Restricted page".
