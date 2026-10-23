# Coding Conventions

## General

- Follow conventions already established by the repository unless they are unsafe or materially harmful.
- Use strict typing where supported; avoid broad `any` escape hatches at API boundaries.
- Keep modules small and responsibility-specific.
- Separate presentation, domain rules, persistence and provider-specific logic.
- Use consistent naming and formatting from the existing linter/formatter.
- Prefer accessible semantic controls and responsive layout behavior.
- Avoid dead buttons, hidden placeholder routes and unnecessary animation.

## Boundaries

- Validate request parameters and provider responses at trust boundaries.
- Define domain types centrally and share stable API types where appropriate.
- Do not import server-only secrets or modules into client/extension bundles.
- Provider adapters normalize data into explicit types and preserve provenance.
- Entitlement checks belong in reusable server-side policy logic.
- Jobs must persist state and use workspace scope derived from trusted records.

## Errors and logs

- Use consistent structured errors with stable codes.
- Provide useful, safe UI messages and actionable recovery instructions.
- Include request/job correlation IDs.
- Do not log credentials, tokens, full private document bodies or raw provider payloads by default.

## UI quality

- Every async view has meaningful loading, empty, partial, stale, forbidden and failure states as applicable.
- Forms have validation, labels and keyboard accessibility.
- Table/filter/export actions operate on the actual displayed query/data scope.
- Charts state unit, period, denominator and source.
- Avoid invented counts and decorative analytics.

## Dependency policy

- Verify source repository, license, release cadence, supported runtime and compatibility before installation.
- Reuse existing tools before adding a competing framework.
- Explain material dependency additions in the PR/implementation note.
- Commit lockfile changes alongside manifest changes.
