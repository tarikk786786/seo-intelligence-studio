# API Contract

## Contract principles

- Versioned REST endpoints, documented with OpenAPI.
- Schema validation for input and output where practical.
- Consistent authentication, authorization, pagination, error format and request IDs.
- Authorization scopes are checked server-side on each resource access.
- Long-running work returns a persistent job resource, not an invented final result.
- Apply rate limits and usage recording by key/workspace/provider.

## Proposed endpoint groups

```text
GET    /api/v1/health
GET    /api/v1/workspaces
GET    /api/v1/brands
POST   /api/v1/brands
GET    /api/v1/brands/{brandId}
PATCH  /api/v1/brands/{brandId}
GET    /api/v1/brands/{brandId}/competitors
POST   /api/v1/brands/{brandId}/competitors
GET    /api/v1/documents
POST   /api/v1/documents
GET    /api/v1/documents/{documentId}
PATCH  /api/v1/documents/{documentId}
DELETE /api/v1/documents/{documentId}
POST   /api/v1/keywords/research
POST   /api/v1/serp/analyses
POST   /api/v1/site-audits
GET    /api/v1/ai-prompts
POST   /api/v1/ai-prompts
PATCH  /api/v1/ai-prompts/{promptId}
POST   /api/v1/ai-prompts/{promptId}/refresh
GET    /api/v1/ai-visibility/reports
GET    /api/v1/integrations
POST   /api/v1/integrations/{provider}/connect
POST   /api/v1/integrations/{provider}/disconnect
GET    /api/v1/jobs/{jobId}
GET    /api/v1/usage
POST   /api/v1/webhooks
```

This is a proposed contract; adapt naming to existing project conventions and implement only endpoints with real backing services.

## Security

- Browser sessions use the app's secure session mechanism.
- External API tokens are workspace scoped, hashed at rest, revocable and never returned after creation.
- Every call checks role and workspace membership.
- Admin endpoints require explicit administrative authorization.
- OAuth callbacks validate state and exact registered redirect URIs.
- Webhooks have signing secrets, timestamp/replay protection where possible and delivery logs.

## Async jobs

For expensive analyses: return HTTP 202 with `{ jobId, statusUrl }` only after job persistence succeeds. Status must come from persisted job state and distinguish `queued`, `running`, `succeeded`, `partial`, `retrying`, `failed`, and `cancelled` as appropriate. Never return `succeeded` before the operation has actually succeeded.

## Errors

Use a stable machine-readable code and a safe user-facing message; include request ID. Do not reveal provider secrets, stack traces or tenant-sensitive data. Distinguish validation, authentication, authorization, not-found, conflict, quota/budget, rate-limit, provider and internal errors.

## Idempotency and pagination

Support idempotency keys for operations where retrying could duplicate a job, spend or external side effect. Define stable cursor/limit semantics and maximum page sizes. Validate sorting/filter fields against an allowlist.

## OpenAPI acceptance

- Contract matches running handlers.
- Authentication requirements and scopes documented.
- Request/response/error schemas validated by tests.
- No endpoint shown in docs is represented by a hardcoded fixture in production.
