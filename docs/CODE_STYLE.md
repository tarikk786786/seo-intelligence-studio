# Code Style & Conventions
## 06 / CODE_STYLE.md — The Vibe Coding Blueprint Standard

### 1. General Principles
- **Readability Over Cleverness:** Write transparent, maintainable TypeScript that any engineer can trace immediately.
- **Single Responsibility:** Keep functions, route handlers, and UI components focused on a single logical task.
- **Avoid Unnecessary Abstractions:** Do not create layers of indirection unless strictly needed for provider polymorphism.
- **Reuse Existing Patterns:** Before writing a utility or component, check `packages/seo-engine`, `packages/provider-adapters`, and `packages/shared-types`.
- **Consistency Over Novelty:** Adhere to established repository patterns.

### 2. Naming Conventions
- **Components:** PascalCase (e.g., `Sidebar.tsx`, `ContentEditor.tsx`).
- **Functions:** camelCase with active verbs (e.g., `computeOptimizationScore`, `fetchSerp`, `isSafeUrl`).
- **Variables & Constants:** camelCase for variables, UPPER_SNAKE_CASE for environment configurations and global constants (e.g., `PLAN_PRESETS`).
- **Files:** kebab-case for utilities and scripts (e.g., `text-analyzer.ts`, `scoring-engine.ts`, `run-all-tests.mjs`).
- **Database Tables:** snake_case in Postgres, camelCase in Prisma models (e.g., `brand_spaces`, `ai_observations`, `BrandSpace`).
- **API Routes:** kebab-case nouns (e.g., `/api/v1/page-audit`, `/api/v1/ai-visibility/reports`).

### 3. Folder Structure
- Monorepo modular structure:
  - `apps/web`: Next.js 15 presentation, dashboard, editor, and API route handlers.
  - `apps/extension`: Manifest V3 companion Chrome extension.
  - `apps/worker`: Durable scheduled daily prompt refresh runner.
  - `packages/database`: Prisma schema and client singletons.
  - `packages/seo-engine`: Pure TypeScript NLP and scoring algorithms.
  - `packages/provider-adapters`: External API integrations (SerpAPI, Gemini Grounding, OpenAI).
  - `packages/shared-types`: Entitlements, Zod validation, and API contracts.

### 4. Imports
- Absolute aliases for internal application files (`@/components/...`, `@/lib/...`).
- Explicit package namespace imports for workspace modules (`@repo/seo-engine`, `@repo/shared-types`, `@repo/database`).
- Explicit file extensions (`.js` / `.mjs`) for ECMAScript module resolution.

### 5. Components
- Client components explicitly marked with `'use client';` at the very top.
- Strong separation between stateful data-fetching layouts and presentational visual widgets.
- Maximum 300 lines per component file; decompose sub-panels into modular siblings.

### 6. Functions
- Strict parameter typing with interfaces or Zod schemas.
- Explicit return types on public methods.
- No implicit `any`.

### 7. Error Handling
- Use structured typed errors (`{ error: string, code?: string, status?: number }`).
- Catch network, provider, and parsing exceptions gracefully, providing actionable guidance rather than unhandled promise rejections.
- Never crash background workers on individual prompt query failures; record observation errors and continue.

### 8. Comments
- Explain *why* a decision was made (e.g., Gaussian penalty for keyword stuffing, SSRF IP exclusions).
- Do not add comments that merely restate what the code clearly does.

### 9. Logging
- Structured console logs with subsystem prefix (e.g., `[Worker]`, `[SERP Adapter]`, `[Extension]`).
- Never log raw passwords, API keys, private auth tokens, or sensitive document text.

### 10. Formatting & Quality Gates
- **Type Checking:** `tsc --noEmit` across all workspace packages.
- **Testing:** `node --test` or `vitest` for automated regression suites.
- **Builds:** Next.js production build and Chrome MV3 build verified before release.

### 11. Do
- Reuse existing components, provider adapters, and database models.
- Keep changes focused and atomic.
- Validate all user input and external URLs against SSRF rules.
- Update documentation whenever contracts change.

### 12. Don't
- Never invent mock metrics, artificial search volumes, or fake citations in production views.
- Never use `<all_urls>` permission in Chrome extension manifests.
- Never bypass authentication, rate limits, or tenant boundary filters.
