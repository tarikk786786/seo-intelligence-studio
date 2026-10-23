# Test Plan and Release Gates

## Test layers

1. Static checks: format, lint, typecheck, dependency audit.
2. Unit: formula correctness, validation, entitlement logic, provider normalization, error mapping.
3. Database integration: migrations, constraints, transactions, revision handling and workspace scoping.
4. API integration: auth, permissions, schemas, rate limits, provider failures and job creation.
5. Worker integration: retries, idempotency, restart recovery, budgets and terminal failures.
6. Browser E2E: onboarding, Brand Space, documents, research reports, prompt tracking and access restrictions.
7. Extension tests: production build, popup, supported page behavior, API auth, minimum permissions and graceful unsupported-page fallback.
8. Security checks: tenant isolation/IDOR, SSRF, secret leakage, OAuth state, XSS, key revocation and webhook signatures.

## Required test scenarios

### Authentication and tenancy
- Unauthenticated access is denied.
- A workspace member cannot access another workspace's record by changing an ID.
- Role checks apply equally to web UI, API, export, and worker.
- Removed members and revoked keys lose access.

### Documents
- Create, edit, autosave, reload and reopen.
- New revision stored as expected.
- Simultaneous edits do not silently overwrite newer content.
- Export and share respect access control.

### Keyword/SERP
- Valid provider response parsed and persisted with provenance.
- Invalid keys, quota, timeout, malformed response and provider outage are handled.
- Query, region, language and device settings reach the provider when supported.
- Missing provider field remains unavailable, not guessed.
- Retry does not create duplicate reports/jobs where idempotency is supported.

### AI visibility
- Active prompt entitlement enforced server-side including concurrent creation/import.
- Scheduler creates due jobs idempotently.
- Worker restart resumes eligible jobs safely.
- Provider errors do not increment successful observation denominators.
- Mention and citation formula tests cover zero records, partial failures and duplicates.
- Prompt edits create a version and do not rewrite prior observation context.
- Budget exhaustion stops/defer jobs with an honest status.

### Integrations/API
- OAuth state mismatch is rejected.
- Credentials are never returned after creation.
- Keys are scoped, revocable and rate-limited.
- Webhook signature failures and replays are rejected where applicable.
- API error schemas match OpenAPI.

### Chrome extension
- Production build succeeds.
- Only necessary permissions/hosts are requested.
- Popup login and backend calls work.
- Explicit page analysis reads expected data only.
- Unsupported layout/site falls back without breaking navigation.
- Sensitive data is not sent without the corresponding user action/consent.

## Command policy

Inspect `package.json` or equivalent before running commands. Use the repository's actual package manager and scripts. A suggested sequence for a compatible pnpm project is:

```powershell
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

Run migration checks, extension build and security/dependency audit separately if not covered. Do not add scripts that simply echo success or skip tests while returning zero.

## Reporting

Record each check as PASS, FAIL, BLOCKED or NOT RUN, including actual command and brief reason. A missing external credential blocks a live provider test, but does not excuse unit tests, mocked adapter contract tests in isolated test environments, or UI error-state tests. Never treat fixtures as proof of live integration.
