# Integration Requirements and Registry

## Lifecycle contract

Every integration must have a registry entry documenting status (`planned`, `configured`, `connected`, `degraded`, `reauthorization_required`, `disconnected`, or `unavailable`), owner, authorization flow, permissions, data flow, sync behavior, quotas/costs, test path and last successful check.

A card in the UI is not an integration. Do not mark a provider connected until an authorized, successful verification request completes.

## Candidate integration matrix

| Candidate | Purpose | Prerequisites and validation |
|---|---|---|
| Google Search Console | Organic performance for authorized properties | OAuth, required scope, property permission, pagination, freshness and quota handling. |
| Google Ads API | Keyword planning data | Developer token, OAuth, eligible account/access level, current policy/quota review. |
| PageSpeed Insights / CrUX | Page performance or available field data | Verify API availability, key/quota requirements and exactly which fields are returned. |
| SERP data provider | Search results for target context | API key/contract, region and device coverage, result schema, rate/cost limits. |
| AI/search providers | Prompt execution and returned sources where supported | Official API, model capability, cost, region support, retention and source/citation behavior. |
| WordPress | Authorized content import/export/publishing | Authentication, least-privilege access, draft/publish safeguards and test site. |
| Google Docs | Supported document workflow | OAuth scopes, user consent and current API limitations. |
| Contentful or equivalent CMS | Content import/export | API token management, project/environment scope and permissions. |
| Webhooks | Deliver events to user systems | HTTPS validation, signed payloads, retries, replay protection and delivery logs. |
| Public API | Programmatic product access | Key scopes, rotation/revocation, rate limits, audit and OpenAPI. |
| MCP (optional) | Expose selected safe capabilities to AI clients | Verify the target clients/spec version, transport, auth and tool-level scopes; no broad access by default. |
| Billing provider (optional) | Subscription lifecycle | Selected processor, test/live mode, signed webhook validation and reconciliation. |

## Required behaviors

- Connect, reconnect, disconnect and revoke.
- Least-privilege scopes and clear consent.
- Encrypted provider credentials, never exposed to the browser.
- Last successful sync and current health.
- Manual sync only when supported, automatic sync when documented, and job status where asynchronous.
- Error normalization, rate limiting, timeout and retry policy.
- Provider usage and spend visibility where actual data supports it.
- Deletion/revocation behavior documented.
- Contract tests for adapter normalization and permission failures.

## Prioritization

Implement only after core persistence and authorization are sound. Prefer the few real integrations that unlock the highest-value core flows over a large menu of empty connector cards. Do not advertise Looker Studio, WordPress publishing, native Google Docs or MCP functionality until its exact supported workflow has been implemented and tested.
