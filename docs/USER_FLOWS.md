# User Flows and States

## 1. First use

1. User creates an account and completes required verification.
2. App creates a default workspace only if that behavior is documented and consented to.
3. User creates a Brand Space with website, market and language.
4. App validates and stores brand/domain inputs.
5. User may connect a data source; OAuth consent and provider scopes are shown before redirect.
6. App performs an actual lightweight health/read check and labels the integration connected only on success.
7. User runs a real analysis or adds prompts.
8. Dashboard shows sourced results or a useful empty/error state.

Failure states: invalid domain, failed verification, denied OAuth, invalid key, missing provider approval, quota denied and provider unavailable. No fake completion state.

## 2. Document optimization

1. Choose Brand Space and create/import a document.
2. Enter target keyword, market and target page/context.
3. Retrieve authorized competitive/search evidence if configured.
4. Show loading job state, then evidence, gaps and recommendations.
5. User edits content; autosave records revision and handles concurrent updates.
6. Score recalculates from the defined methodology and stored evidence.
7. User exports, shares with permissions, or returns later to the same document.

## 3. Keyword/SERP research

1. User enters query, geography, language, device and provider.
2. Validate inputs and entitlement/quota.
3. Create job with immutable query parameters and workspace ID.
4. Worker calls authorized provider with timeout, idempotency where supported, and bounded retries.
5. Persist response and provenance metadata.
6. UI displays data, freshness and unavailable fields.
7. User saves, compares, filters or exports the report.

## 4. AI prompt tracking

1. User creates or imports prompts and assigns provider/market options supported by that provider.
2. Server validates the active prompt entitlement and budget.
3. Scheduler records due jobs idempotently.
4. Worker executes a provider request and persists each attempt's actual status.
5. Successful observations are parsed for mentions and citations; raw responses are retained only in ways permitted by provider terms.
6. Aggregations exclude failures from the successful-observation denominator and show sample size/time window.
7. User can review the evidence, pause/edit prompt, manually refresh if permitted, or export results.

## 5. Chrome extension

1. User installs unpacked extension and opens popup.
2. User signs in through the documented auth flow; no permanent API secret is stored in extension source.
3. User chooses a Brand Space.
4. On a supported page, user explicitly initiates analysis or saves research.
5. Extension reads only required page/query context and calls the backend securely.
6. UI distinguishes local findings from server/provider findings.
7. User opens the full report in the app.

## 6. Integration lifecycle

Disconnected → configuration → OAuth/key entry → provider verification → connected → syncing/healthy or needs attention → reconnect/disconnect. Every transition has a persistent status, timestamp and useful error. Never leave the status in “connected” after a verified permanent credential failure.

## 7. Standard UI states

Every data-backed screen must define: initial, loading, success with data, success without data, partial data, stale data, permission denied, invalid input, provider unavailable, quota/budget exceeded, retrying, terminal failure and offline behavior where relevant.
