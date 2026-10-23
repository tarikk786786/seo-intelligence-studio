# Design System
## 02 / DESIGN_SYSTEM.md — The Vibe Coding Blueprint Standard

### 1. Design Direction
- **Style:** Technical, Editorial, and High-Density SaaS (comparable to Linear, Raycast, and Surfer SEO).
- **Mood:** Professional, authoritative, highly responsive, calm, and data-dense without visual clutter.
- **Design Principles:**
  - *Data Provenance First:* Never display naked metrics without retrieval source, timestamp, and location tags.
  - *Restrained Density:* Maximize high-value screen real-estate with consistent typography and tabular hierarchies.
  - *No Generic AI Slop:* Avoid gratuitous gradients, animated floating orbs, or fake percentages.

### 2. Brand
- **Brand Name:** SEO Intelligence Studio (OmniSurfer Engine)
- **Logo:** Geometric ✦ starburst mark with cyan gradient (`#0284c7` to `#38bdf8`).
- **Brand Voice:** Analytical, direct, transparent, and authoritative.

### 3. Color Palette
- **Primary:** `#0284c7` (Sky Blue 600)
- **Secondary:** `#38bdf8` (Sky Blue 400 - Brand Highlight)
- **Background:** `#090d16` (Deep Obsidian Void)
- **Surface / Card:** `#0f172a` (Slate 900)
- **Card Border:** `#1e293b` (Slate 800)
- **Text:** `#f8fafc` (Slate 50)
- **Muted Text:** `#94a3b8` (Slate 400)
- **Border:** `#334155` (Slate 700)
- **Success:** `#10b981` (Emerald 500)
- **Warning:** `#f59e0b` (Amber 500)
- **Error:** `#ef4444` (Rose 500)

### 4. Typography
- **Font Family:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Heading Font:** Inter / System Sans Bold
- **Monospace Font:** `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace` (for keywords, CPC, and citations)
- **H1:** 24px / Bold (700) / Line Height 32px
- **H2:** 18px / SemiBold (600) / Line Height 26px
- **H3:** 14px / SemiBold (600) / Line Height 20px
- **Body:** 13px / Regular (400) / Line Height 18px
- **Small / Metadata:** 11px / Medium (500) / Line Height 15px

### 5. Spacing
- **Base Unit:** 4px
- **Spacing Scale:** 4px (p-1) / 8px (p-2) / 12px (p-3) / 16px (p-4) / 24px (p-6) / 32px (p-8) / 48px (p-12)

### 6. Border Radius
- **Small:** 4px (rounded)
- **Medium:** 8px (rounded-lg)
- **Large:** 12px (rounded-xl)
- **Pill:** 9999px (rounded-full)

### 7. Shadows
- **Small:** `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **Medium:** `0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)`
- **Large:** `0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)`

### 8. Buttons
- **Primary Button:** Background `#0284c7`, hover `#0369a1`, text `#ffffff`, border none, radius 8px, font 12px/600.
- **Secondary Button:** Background `#1e293b`, hover `#334155`, text `#f8fafc`, border 1px solid `#334155`, radius 8px.
- **Danger Button:** Background `#ef4444/10`, hover `#ef4444/20`, text `#ef4444`, border 1px solid `#ef4444/30`.
- **Disabled State:** Opacity 50%, cursor not-allowed, pointer-events none.
- **Loading State:** Spinner icon inline, text unchanged or "Processing...".

### 9. Inputs
- **Default:** Background `#0f172a`, border 1px solid `#1e293b`, text `#f8fafc`, radius 8px, padding 8px 12px, font 12px.
- **Focus:** Border `#0284c7`, outline none, box-shadow `0 0 0 1px #0284c7`.
- **Error:** Border `#ef4444`, error message displayed in 11px text underneath.
- **Disabled:** Background `#090d16`, border `#1e293b`, opacity 60%.
- **Placeholder:** Text `#64748b`.

### 10. Cards
- **Container:** Background `#0f172a`, border 1px solid `#1e293b`, radius 12px, padding 20px, hover border `#334155` transition.

### 11. Navigation
- **Header:** Sticky or static breadcrumb bar, height 56px, border-bottom 1px solid `#1e293b`.
- **Sidebar:** Width 256px, border-right 1px solid `#1e293b`, background `#0f172a`.
- **Mobile Navigation:** Collapsible hamburger drawer overlay.

### 12. States
- **Loading:** Skeleton shimmer with background `#1e293b` pulse animation.
- **Empty:** Informative icon, clear headline, contextual description, and primary "+ Create" or "Connect" action button.
- **Error:** Card border `#ef4444/30`, background `#ef4444/10`, distinct error code, and retry trigger.
- **Success:** Toast notification with emerald badge `#10b981/20`, auto-dismiss in 4 seconds.

### 13. Icons
- **Icon Library:** `lucide-react`
- **Default Size:** 16px (w-4 h-4)
- **Icon Style:** Crisp outline, 1.75px stroke width.

### 14. Responsive Design
- **Mobile (< 768px):** Single column stack, horizontal scrolling tables with sticky rank/title column.
- **Tablet (768px - 1024px):** 2-column KPI grid, editor and optimization panel toggleable.
- **Desktop (> 1024px):** Fixed sidebar, 3-column KPI layout, side-by-side TipTap editor and Surfer optimization sidebar.

### 15. Accessibility
- Semantic HTML tags (`<main>`, `<aside>`, `<nav>`, `<article>`, `<header>`).
- Minimum contrast ratio 4.5:1 for normal text and 3:1 for large text against dark background.
- Full keyboard focusability with visible cyan focus rings.
- ARIA labels on icon buttons and status indicators.
- Non-reliance on color alone (icons + text labels accompany all success/error indicators).
