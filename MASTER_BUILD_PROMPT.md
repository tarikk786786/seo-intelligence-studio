# MASTER BUILD PROMPT — SEO Intelligence SaaS + Chrome Extension

You are the lead product engineer, architect, UX engineer, integration engineer, and test engineer for this repository. Build the application described in `docs/PRD.md` and the related project documents. Treat `AGENTS.md` as mandatory instructions. The goal is a working, independently implemented product—not a UI mockup, prototype, plan, or collection of disconnected components.

## First: inspect; do not assume

Before editing files:

1. Inspect the current directory, Git status/branch, project structure, package manifests, lockfiles, scripts, framework versions, existing tests, environment files, CI, deployment config, and current code paths. Preserve uncommitted and functioning work.
2. Discover the real tools and skills available in your environment. Read any installed skills that apply to architecture, requirements, frontend design, the selected framework, Chrome extensions, APIs/OAuth, database design, security, testing, and deployment. Do not invent skill names or tool capabilities.
3. Review the Google Drive reference link in `docs/reference/BLUEPRINT_NOTES.md`. If the full PDF has not been added to the repository or accessible to the agent, say so, request or retrieve it through an authorized supported route, and do not claim a complete review. The project requirements remain usable without that extra document.
4. Read the authoritative project documentation: `docs/PRD.md`, `docs/USER_FLOWS.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/API.md`, `docs/DATA_SOURCES.md`, `docs/INTEGRATIONS.md`, `docs/SECURITY.md`, `docs/CODING_CONVENTIONS.md`, `docs/TEST_PLAN.md`, `docs/DEPLOYMENT.md`, and `docs/KNOWN_LIMITATIONS.md`.
5. Run the existing baseline checks before substantial changes. Record actual failures so pre-existing problems are not misreported as newly introduced.

## Build policy

- Work in small, coherent, tested increments. Create a plan for large changes, then execute it.
- Reuse a sound existing stack; do not replace it merely because a different stack is preferred.
- Use maintained, license-compatible open-source components where appropriate. Verify repository, version, license, and maintenance before adding dependencies.
- Implement real persistence, permissions, validation, error handling, observability, and meaningful tests.
- Never generate fake production analytics, SEO measurements, rankings, citations, AI visibility, connection states, successful refreshes, or customer assignments.
- Use actual official APIs or licensed providers. If a key, approval, subscription, quota or account is required, implement the connection workflow and accurately report the missing prerequisite.
- Label data by provenance: provider-reported, locally calculated, model-classified, estimated, stale, unavailable or failed.
- Do not bypass access controls, CAPTCHA, paywalls, provider quotas or terms. Do not use unauthorized access or scraping.
- Do not copy a competitor's source code, protected assets, exact trade dress or proprietary scoring logic.

## Required product scope

Build the core web app, companion Chrome Manifest V3 extension, backend/API, database, and persistent background processing described in the PRD. Prioritize:

1. Secure authentication, organizations/workspaces, tenant isolation and role permissions.
2. Brand Spaces, competitors, projects and real document persistence with history/autosave.
3. Keyword research through a verified provider adapter; never guess official search volume or CPC.
4. SERP analysis using actual authorized SERP data, with query/location/device/language recorded.
5. AI visibility tracking with up to 100 active prompts under the configured entitlement and once-daily refresh scheduling, using durable jobs and real supported provider responses.
6. Evidence-based brand mentions, competitor mentions, source URLs and citations, with clear methodologies and observation history.
7. A Chrome extension with minimum permissions, explicit user-triggered page analysis, search-context helpers, saved research, secure API communication and robust failure handling.
8. Genuine integrations, a versioned secured public API, usage logging, webhooks, administrator-controlled entitlements and honest onboarding.
9. Automated unit, API, database, end-to-end, extension and security checks.

“Unlimited” entitlements must be configurable and subject to documented fair-use/infrastructure policy; do not silently insert an arbitrary low limit. Daily refresh means a durable scheduled attempt under configured provider quotas and budgets—not guaranteed provider availability. Explain these limits in the product.

## Suggested stack only if the repository is new

Use a coherent TypeScript setup such as React/Next.js for the web app, WXT + React + TypeScript for the extension, PostgreSQL (optionally Supabase for managed Postgres/auth), a durable queue/worker system, and Playwright/Vitest for testing. These are not reasons to replace a suitable existing stack. Confirm versions and operational compatibility before install. Ensure the deployment can run the worker continuously or reliably invoke scheduled jobs; do not put essential daily processing in a short-lived request.

## Implementation sequence

### Stage 1 — Baseline and engineering foundation

Inspect tools/skills and repo. Document architecture decisions, define commands, configure lint/typecheck/test/build, create migrations, implement authentication and tenant authorization.

**Exit criteria:** app builds; database migration works; auth and cross-tenant denial tests pass.

### Stage 2 — Core workspace and documents

Implement Brand Spaces, competitors, projects, saved documents, revisions, autosave and role enforcement. Ensure reload/session recovery works.

**Exit criteria:** end-to-end tests create, edit, reopen and delete authorized records; conflicting updates are handled.

### Stage 3 — Real keyword and SERP data

Implement provider interface, credential setup, real query/analysis jobs, persisted responses, freshness/provenance labels, retry/backoff, exports and reports.

**Exit criteria:** configured provider produces a verified real response; missing/invalid credential states are tested without fake data.

### Stage 4 — AI visibility

Implement prompt versions/groups/import, plan checks, durable scheduling, provider adapters, stored observations, citation/mention extraction, metrics, cost/budget tracking and observation history.

**Exit criteria:** scheduler and worker recover from restart, enforce budgets, and do not count failed observations as successful observations. Test with a real provider where credentials are available and an isolated test adapter in CI.

### Stage 5 — Chrome extension

Build popup, auth, current-page analysis, optional search overlay, saved research and API integration. Verify minimum permissions, browser compatibility, build packaging and error states.

**Exit criteria:** extension build and supported browser flows pass; unsupported page layouts fail safely.

### Stage 6 — Integrations, developer API and administration

Implement prioritized authorized integrations, key lifecycle, API scopes, rate limits, webhook signatures/retries, usage reporting, entitlements and administrator workflows.

**Exit criteria:** all advertised as available have tested connection paths; unavailable integrations cannot masquerade as connected.

### Stage 7 — Hardening and release candidate

Run the complete test plan, security/dependency checks, migrations, deployment checks and user-flow tests. Update docs, `.env.example`, release notes and known limitations.

**Exit criteria:** actual check results are recorded; all release-blocking defects are resolved or transparently documented. Do not call the product production-ready if release gates fail.

## Commands and verification

Discover the actual package manager and scripts. Do not assume `pnpm` or create scripts that claim to test behavior they do not test. If appropriate for the existing project, run equivalents of:

```powershell
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

Also run database migration checks, extension production build, dependency/security audit and relevant deployment checks. Capture exit codes and concise useful output. Fix failures and rerun affected checks. If a check is blocked by missing credentials or infrastructure, report it as blocked—not passed.

## Required final report

When this implementation session ends, report:

- Implemented files and modules.
- Features actually working end to end.
- Data providers connected and source of the observed data.
- Commands actually run, with pass/fail/blocked state.
- Credentials, approvals, paid services or deployment secrets still required.
- Remaining bugs, limitations, risks and unverified behavior.
- Exact commands for local web app, database, workers and extension.
- Deployment instructions and exact path to the generated extension build.

Begin with discovery and baseline checks now. Do not stop after creating a plan or improving the landing page. Continue implementing the highest-priority end-to-end flow possible in the current environment, and never claim work that was not performed.
