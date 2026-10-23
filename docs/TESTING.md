# Testing Strategy
## 07 / TESTING.md — The Vibe Coding Blueprint Standard

### 1. Testing Goals
Validate that the platform behaves correctly across real workloads and adheres to product truth rules:
- **Entitlement Enforcement:** Ensure Enterprise plan unlocks Unlimited* documents, 100 active AI prompts, and Unlimited* brand spaces, while enforcing fair-use soft limits.
- **Scoring Determinism:** Ensure SEO Content Optimization scoring produces verifiable, explainable scores (0–100) based on actual text statistics and competitor entity coverage.
- **Security & SSRF Defense:** Ensure private, loopback, and cloud metadata IPs are strictly blocked from URL ingestion.
- **Chrome Extension Integrity:** Ensure Manifest V3 compliance, valid entry points, minimal permissions, and correct content script matches on Google Search.
- **Database & Multitenancy:** Validate that tenant-scoped queries prevent cross-workspace data leakage.

### 2. Test Types
- **Unit Testing:** `packages/seo-engine` (text tokenization, syllable counting, Flesch-Kincaid readability, score computation), `packages/shared-types` (entitlement checks).
- **Integration Testing:** `packages/provider-adapters` (SerpApi query building, Gemini search grounding parser, SSRF IP guard), database transactions and migrations.
- **End-to-End & Extension Testing:** Extension popup inspection, in-SERP overlay injection, Content Editor document synchronization.

### 3. Testing Tools
- **Runner:** Node.js native test runner (`node --test`) and Vitest.
- **Assertion:** `node:assert` and Chai.
- **Browser Automation:** Playwright.
- **Database:** Prisma Client with SQLite in development/testing and PostgreSQL in production.

### 4. Test File Structure
```
test/
├── run-all-tests.mjs        # Master test runner executing all regression suites
├── entitlements.test.ts     # Plan entitlement limits & policy engine checks
├── seo-scorer.test.ts       # TF-IDF, entity coverage, and readability unit tests
├── ssrf.test.ts             # Server-Side Request Forgery IP & metadata tests
└── extension.test.ts        # Chrome Extension Manifest V3 structure tests
```

### 5. Critical User Flows
1. **Flow 1: Content Optimization:**
   - User inputs or imports content → SEO Engine analyzes text → Computes Optimization Score (0–100) → Renders score breakdown & actionable recommendations → User exports HTML/Markdown.
2. **Flow 2: AI Visibility Scheduled Refresh:**
   - Worker queries active prompts (up to 100) → Dispatches to Gemini Grounding adapter → Extracts raw response, sentiment, and verified citations → Saves observation into `AiObservation` and `Citation` tables.
3. **Flow 3: Google SERP Companion Overlay:**
   - User navigates to `google.com/search?q=*` → Injected content script detects query → Renders floating side widget with estimated volume, CPC, and related queries → One-click "Export to CSV" or "Open in Content Editor".

### 6. Coverage Priorities
- Critical business logic and scoring algorithms: 95%+
- Entitlement limit enforcement and security guards: 100%
- API route parameter validation: 90%+
- Extension manifest permissions: 100%

### 7. Execution Commands
```bash
# Run all automated tests
node --test test/run-all-tests.mjs

# Build Chrome Extension
node apps/extension/build.js

# Generate and migrate database
pnpm db:generate
pnpm db:migrate
```

### 8. Definition of Done
- [x] All 5 automated test suites pass with 0 failures.
- [x] Database schema synchronizes with 22 relational models and foreign key constraints.
- [x] Chrome Extension builds to `.output/chrome-mv3` with valid Manifest V3.
- [x] Zero mock or fabricated metrics in production code paths.
- [x] Documentation fully aligned with running code.
