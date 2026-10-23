# Architecture

## Architecture decision rule
Inspect and preserve a sound existing stack. The options below are a reference design for a new repository, not a mandate to rewrite an existing application.

## Logical components

1. **Web application:** authenticated dashboard, editors, settings, reports, onboarding and admin screens.
2. **Chrome extension:** Manifest V3 popup/content script/service worker with minimum permissions; calls the product API.
3. **API/domain layer:** versioned endpoints, authentication, authorization, validation, domain services and standardized errors.
4. **Relational database:** users, tenants, brands, documents, research jobs/results, prompts/observations, integrations, usage and audits.
5. **Object storage:** optional for larger exports/imports or approved artifacts, with scoped signed URLs and retention controls.
6. **Queue and workers:** durable asynchronous SERP analysis, page audit, provider sync and AI prompt refresh.
7. **Provider adapters:** interfaces for keyword data, SERP data, AI/search APIs, analytics integrations, content systems, email and billing where selected.
8. **Scheduler:** durable cron/scheduler creates idempotent due jobs; workers execute them. The scheduler itself must have an observable health state.
9. **Observability:** structured logs, request/job IDs, metrics and alerting, with sensitive data redaction.

## Preferred reference stack for a new repo

- Web: React/Next.js + TypeScript, accessible design system.
- Extension: WXT + React + TypeScript + Chrome Manifest V3.
- Database: PostgreSQL; managed Postgres/Supabase is an option if its security/configuration is understood.
- Validation: one consistent schema validator at trust boundaries.
- Jobs: a persistent queue suitable for selected runtime (for example BullMQ + Redis where operationally supported).
- Tests: Vitest/unit tests and Playwright/end-to-end tests, plus isolated DB/API tests.
- Deployment: web/API and persistent workers on a platform that supports their process model; scheduled triggers must be durable.

Select versions by checking current official docs and compatibility. Avoid duplicate frameworks, ORMs, queue systems and UI kits.

## Key boundaries

- Controllers handle protocol concerns; domain services implement business rules; adapters handle provider specifics.
- Provider data is normalized with provenance while retaining original response fields where contract and retention rules allow.
- Entitlements are evaluated in a central server-side policy service.
- Tenant scope is derived from verified identity and permissions, not trusted from arbitrary client-provided workspace IDs.
- External requests are isolated behind timeouts, rate limits and bounded response sizes.
- Long-running work returns a real job ID and has a queryable persistent status.

## Resilience

- Idempotent job creation and writes where possible.
- Bounded exponential backoff and respect provider retry instructions.
- Dead-letter handling for terminal failures.
- Circuit breaking or provider health gating where justified.
- Per-provider and per-tenant concurrency/budget controls.
- Worker restart recovery and stale-job detection.
- Graceful partial availability; one provider outage must not corrupt unrelated saved content.

## Decision records

Document material choices in `docs/ARCHITECTURE.md` or a lightweight ADR directory, including context, decision, alternatives, security effects and operational consequences.
