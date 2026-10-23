# Local Development and Deployment

## Before deployment

- Inspect the existing application and hosting constraints.
- Verify framework/database/queue versions against current official docs.
- Ensure web, API and worker processes match the selected platform's runtime model.
- Provision PostgreSQL and durable queue infrastructure if required.
- Configure secrets via environment management, not repository files.
- Verify OAuth redirect URLs, allowed origins, extension IDs (for production) and webhook URLs.
- Define database backup/restore and credential rotation procedures.

## Environment variables

Use `.env.example` as a documented inventory, and remove unused variables rather than leaving them as false requirements. Validate required variables at application startup and provide safe messages that name the missing variable without revealing its value.

## Services

At minimum document which services are deployed:
- Web frontend/API.
- Database.
- Scheduler/worker.
- Queue/cache if selected.
- Object storage if selected.
- Email/billing/analytics services if selected.

Daily AI prompt refresh must use durable scheduling and a worker/cron mechanism supported by the host. Do not rely on a browser popup staying open or an in-memory `setInterval` in a short-lived serverless function.

## Safe rollout

1. Run migration against a disposable or staging database.
2. Run tests and production builds.
3. Configure secrets and provider callbacks in staging.
4. Perform real health checks and low-cost test requests.
5. Validate logs, quotas, scheduled job status and alerting.
6. Back up production before risky schema change.
7. Roll out migrations and application versions deliberately.
8. Validate real customer flows and monitor errors.
9. Document rollback/recovery steps.

## Chrome extension release

- Build reproducibly from a lockfile.
- Inspect the generated Manifest V3 permissions and host permissions.
- Test unpacked in Chrome before packaging.
- Use only production API URLs and secure auth behavior in release config.
- Do not bundle provider keys.
- Supply privacy disclosures and Web Store listing assets/permissions rationale as required.
- Chrome Web Store approval is an external review, not something code can guarantee. Report submission/approval status honestly.

## Deployment acceptance

Record exact environments, URLs, health checks, migrations, worker health, provider checks and test results. A successful frontend build alone is not proof of a production-ready application.
