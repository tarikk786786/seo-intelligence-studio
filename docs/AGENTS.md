# AI Coding Agent Instructions
## 08 / AGENTS.md — The Vibe Coding Blueprint Standard

### 1. Project Context
- **Project:** SEO Intelligence Studio (OmniSurfer Engine)
- **Purpose:** Full-stack SaaS platform + companion Manifest V3 Chrome Extension providing Surfer SEO-comparable content optimization, keyword research, advanced SERP analysis, and scheduled AI Visibility (GEO) brand mention and citation tracking.
- **Primary Users:** Enterprise SEO directors, content marketing teams, digital publishers, and marketing agencies.

### 2. Source of Truth
Before making significant modifications, read and adhere to the core documentation in `docs/`:
- `docs/PRD.md`: Feature specifications, MVP scope, and acceptance criteria.
- `docs/DESIGN_SYSTEM.md`: Strict visual rules, colors, typography, and accessibility.
- `docs/ARCHITECTURE.md`: Monorepo structure, service boundaries, and data flow.
- `docs/DATABASE.md`: Relational schema, Prisma models, constraints, and migrations.
- `docs/SECURITY.md`: Multi-tenant isolation, SSRF defenses, and credential encryption.
- `docs/CODE_STYLE.md`: TypeScript standards, naming conventions, and file organization.
- `docs/TESTING.md`: Test strategy, regression commands, and definition of done.
- `docs/UX_FLOWS.md`: Critical user journeys and state machine specifications.
- `docs/API.md`: Public REST API contracts, parameters, and error formats.
- `docs/DATA_SOURCES.md`: Legitimate provider verification and zero-fabrication rules.

Do not contradict these documents without first documenting the conflict.

### 3. General Rules
- Understand existing code before modifying it.
- Reuse existing components, provider adapters, and database models.
- Follow the design system (no generic AI slop, no placeholder buttons).
- Follow the architecture (keep domain logic in `packages/`, UI in `apps/web`).
- Follow database conventions (22 relational Prisma models with strict workspace scoping).
- Follow security requirements (block all SSRF attempts, hash API keys).
- Follow coding conventions (clean TypeScript, explicit module imports).
- Never invent business requirements or fake SEO/AI metrics.
- Never expose secrets in client bundles or logs.
- Avoid unnecessary external dependencies.
- Avoid modifying unrelated files.

### 4. Planning
Before implementing a non-trivial task:
1. Inspect relevant documentation in `docs/`.
2. Inspect existing workspace code and environment.
3. Identify affected files.
4. Identify dependencies and interfaces.
5. Identify database/API schema changes.
6. Identify tests required.
7. Create a concise implementation plan.

### 5. Implementation
- Make focused, atomic changes.
- Reuse established patterns.
- Preserve existing working behavior.
- Avoid unnecessary rewrites.
- Keep code maintainable and strictly typed.

### 6. Validation
After implementation:
1. Run automated test suite: `node --test test/run-all-tests.mjs`.
2. Run database migration and generation: `pnpm db:generate`.
3. Verify Chrome extension production build: `node apps/extension/build.js`.
4. Review changed files with `git status`.
5. Check for unintended modifications.

### 7. Documentation
Update documentation whenever implementation changes:
- Product behavior or scope (`docs/PRD.md`)
- Architecture or packages (`docs/ARCHITECTURE.md`)
- Database models (`docs/DATABASE.md`)
- API endpoints (`docs/API.md`)
- Security policies (`docs/SECURITY.md`)
- Known limitations (`docs/KNOWN_LIMITATIONS.md`)

### 8. Conflict Handling
If requirements conflict:
Do not guess. Identify the conflict clearly, explain the tradeoffs, and document the resolution in `docs/KNOWN_LIMITATIONS.md` or consult the user.

### 9. Completion Criteria
A task is complete only when:
- Requirements are satisfied.
- Automated tests pass with 0 failures.
- Chrome Extension builds under Manifest V3.
- Database schema synchronizes with relational integrity.
- No unintended files are modified.
- Security and zero-fabrication rules are respected.
- Documentation reflects the real implementation.
