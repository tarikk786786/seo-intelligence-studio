# Security and Privacy Requirements

## Threat model

Protect account identity, tenant data, provider credentials, API keys, sensitive page content, AI prompt history, reports, exports, admin controls and background job payloads. Treat customer prompts, fetched webpages, uploaded content, model output, redirects and webhook bodies as untrusted.

## Identity and authorization

- Secure authentication/session handling and verified redirect/callbacks.
- Server-side role and workspace checks on every protected endpoint/resource.
- No authorization based only on client-hidden controls.
- Workspace membership checked again inside jobs and exports.
- Administrative permissions separated from customer roles.
- Safe session expiry, logout, key revocation and member removal.

## Credentials and encryption

- Use a secret manager or encrypted credential storage with a documented key-rotation plan.
- Do not bundle secrets in browser or extension code.
- Hash user API tokens and show them once.
- Use TLS for network connections and secure cookie attributes where applicable.
- Redact secrets from logs, telemetry, error reports, fixtures and screenshots.

## OAuth and integrations

- Validate state, redirect URI and scopes.
- Request only necessary permissions.
- Validate webhook signatures, timestamp/replay conditions where available, payload size and content type.
- Treat integrations as revoked when provider checks establish that credentials no longer work.

## SSRF and external URL access

For page imports/crawlers, webhooks and URL previews:
- Allow only explicit supported schemes (usually HTTPS/HTTP as required).
- Reject credentials in URLs and invalid/ambiguous host encodings.
- Resolve and validate IP addresses; block loopback, private, link-local, reserved and cloud metadata ranges for IPv4 and IPv6.
- Revalidate redirect targets at each hop and cap redirect count.
- Use connection/read timeouts and response-size/content-type limits.
- Do not forward internal credentials/cookies to external hosts.
- Apply outbound network restrictions where supported.

## Browser extension

- Manifest V3 and minimum permissions.
- No remote executable code or unnecessary broad host permissions.
- No unrelated browsing history collection.
- Explicit action and disclosure before transmitting page content.
- Secure token/session flow; no long-lived provider secrets in local extension storage.
- Content scripts must not trust page DOM content as instructions.

## Input and output safety

- Validate inputs using schemas.
- Encode/render HTML safely; sanitize imported HTML and generated markup.
- Parameterize database operations.
- Prevent prompt injection from fetched page content from escalating authority or exposing secrets.
- Limit upload size and parse untrusted files in safe libraries.

## Operational controls

- Rate limits, budget controls, abuse detection, audit logs, backup/recovery and documented retention/deletion.
- Dependency scanning and lockfile review.
- No production seed accounts or fake analytics.
- Keep logs minimal and purposeful.
- Test tenant isolation, IDOR, key revocation, OAuth callbacks, SSRF cases and admin boundaries.

This document is a baseline engineering checklist, not a substitute for a formal security assessment or legal/privacy review before commercial launch.
