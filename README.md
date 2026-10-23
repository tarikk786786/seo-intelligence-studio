# SEO Intelligence Studio (OmniSurfer Engine)

[![Made by tarikislam.in](https://img.shields.io/badge/Made%20by-tarikislam.in-0284c7?style=for-the-badge&logo=googlechrome&logoColor=white)](https://tarikislam.in)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5.28-black?logo=next.js)](https://nextjs.org)
[![Manifest V3](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-blue?logo=googlechrome)](https://developer.chrome.com/docs/extensions/mv3/intro/)

An enterprise-grade SEO, GEO (Generative Engine Optimization), and AI Search Visibility platform with companion Manifest V3 Chrome Extension (**tarikislamseoamazon**).

> **Engineered & Maintained by [Tarik Islam](https://tarikislam.in)**

---

## Key Capabilities
- **Content Editor & Optimizer**: Real-time NLP scoring (0-100), TF-IDF entity analysis, Flesch Reading Ease scoring, heading hierarchy, and content metrics.
- **AI Search Visibility (GEO Tracker)**: Grounded AI search simulation across Gemini and OpenAI with citation attribution, Brand Mention Rate, and daily BullMQ refresh queues.
- **Advanced SERP Analyzer**: Multi-competitor organic benchmarking, word count correlation, heading distribution, and competitor gap audits.
- **Keyword Research Explorer**: Real-time search volume, estimated CPC, difficulty rating, search intent badges, and 1-click CSV exports.
- **Companion Chrome Extension (`tarikislamseoamazon`)**: Manifest V3 in-SERP Google Search competitor overlay, on-page SEO diagnostics, missing ALT tag analyzer, and 1-click Studio Content Editor sync.
- **Integrations & Developer API**: Scoped Bearer API tokens, enterprise webhooks, Google OAuth, Amazon OAuth, and OpenAPI documentation.
- **Personalized Onboarding & CSM Portal**: Interactive 5-step workspace wizard and Dedicated Customer Success Manager dashboard.

---

## Project Structure
```
apps/seo-intelligence-studio/
├── apps/
│   ├── web/                     # Next.js 15 Enterprise SaaS Web Application
│   └── extension/               # Manifest V3 Chrome Extension (tarikislamseoamazon)
├── packages/
│   ├── database/                # Prisma ORM + SQLite schema (22 models)
│   ├── seo-engine/              # Readability, TF-IDF, NLP Content Scorer
│   ├── shared-types/            # Entitlements policy engine & plan presets
│   └── provider-adapters/       # SSRF guard, SerpAPI adapter, Gemini grounding adapter
├── docs/                        # Complete technical documentation suite
└── test/                        # Automated unit & integration test suites
```

---

## Quick Start
```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment variables
cp .env.example .env

# 3. Generate Database and Run Migrations
pnpm --filter @repo/database db:generate
pnpm --filter @repo/database db:push

# 4. Run Unit and Integration Tests
node --test test/run-all-tests.mjs

# 5. Build Applications and Extension
pnpm build
node apps/extension/build.js
```

---

## Author & Credits
- **Creator & Lead Engineer**: [Tarik Islam](https://tarikislam.in)
- **Website**: [https://tarikislam.in](https://tarikislam.in)
- **GitHub**: [@tarikk786786](https://github.com/tarikk786786)
- **Official Watermark**: Made by tarikislam.in
