# Database and Data Model

## Principles

Use relational constraints for relationships and authorization-critical ownership. Every tenant-owned record must be associated with a workspace/organization and protected by server-side policies. Avoid a giant JSON column in place of data needed for joins, filtering, history, retention and access control.

## Entity groups

### Identity and tenancy
- `users`
- `organizations`
- `organization_members`
- `workspaces`
- `workspace_members`
- `subscriptions` (if billing is selected)
- `plan_entitlements`

### Brand and content
- `brand_spaces`
- `brand_domains`
- `brand_aliases`
- `competitors`
- `documents`
- `document_revisions`
- `content_briefs`
- `content_analyses`

### SEO research
- `keyword_projects`
- `keyword_queries`
- `keyword_results`
- `serp_analyses`
- `serp_results`
- `site_audits`

### AI visibility
- `ai_prompt_groups`
- `ai_prompts`
- `ai_prompt_versions`
- `ai_observation_jobs`
- `ai_observations`
- `brand_mentions`
- `competitor_mentions`
- `citations`

### Operations and integrations
- `integration_connections`
- `integration_sync_jobs`
- `api_keys`
- `api_usage_records`
- `webhook_endpoints`
- `webhook_deliveries`
- `background_jobs` if not managed wholly by queue infrastructure
- `usage_events`
- `customer_success_assignments`
- `support_tickets`
- `audit_logs`

Refine this design according to normalization, volume and chosen services. These names are guidance, not permission to create empty/unused tables.

## Required fields and constraints

- Stable primary keys and explicit foreign keys.
- Tenant/workspace owner on every tenant-owned record.
- `created_at`, `updated_at`, and appropriate lifecycle timestamps.
- Provider/model, request timestamp, query parameters, freshness and status for external observations.
- Unique idempotency key where appropriate for background job creation and webhook delivery.
- Unique normalized membership/key identifiers with correct scoping.
- Indexes for workspace queries, due jobs, time-series reports and idempotency lookups.
- Explicit retention/deletion policy for responses, integrations and audit records.

## Secrets and API keys

- Encrypt recoverable provider credentials using managed secrets or authenticated encryption and a key-management plan.
- Store a strong hash of customer API tokens; show secret material only at creation time.
- Never store credentials in plaintext, browser local storage, logs, seeded fixtures or source control.

## Migrations

- Commit versioned migrations.
- Test migrations on a disposable database and, where practical, test upgrade from the previous schema.
- Use explicit backfill and rollback/recovery plans for high-risk changes.
- Never run destructive migrations against production without authorization, backup and a reviewed plan.
- Test constraints and tenant-policy rules, not merely table creation.

## Tenant isolation

Authorization must be enforced in API/domain access and, if supported by the database platform, row-level security. Validate both layers. Never trust a client-supplied tenant ID without checking membership and role.
