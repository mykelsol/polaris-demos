# Polaris I/O — Design System

Polaris I/O is a SaaS application that surfaces **actionable growth and risk intelligence** for enterprise teams. The product organizes work around three primitives — **Signals**, **Patterns**, and **Agents** — that monitor a set of customer-defined **Entities** (companies, markets, segments) inside named **Workspaces**.

The flagship surface in the source design is the **ABM Intelligence Hub**: a filterable table of signals scored by Strength, Confidence, Lens, and originating Agent. The aesthetic is restrained and dense — Bloomberg / Palantir / Notion sit nearby on the moodboard, but Polaris is calmer than Bloomberg and more analytical than Notion. The brand promise is *clarity under pressure*, not *delight*.

## Sources

This system was built against:

- **Figma** — `Intel Hub.fig` (one page, two top-level frames: `Global Intel Hub`, `Table`). 71 page-scoped external components, all from the Untitled UI library. Mounted read-only — recreate via the Figma file in your workspace if you need to make changes.
- **Codebase** — *not yet provided*. When the frontend repo is attached, this system should be re-validated against the production token names and component implementations. Treat this directory as the design-time source of truth; treat the repo as the runtime source of truth.

## Index

```
.
├── README.md                  ← you are here
├── SKILL.md                   ← agent-skill manifest (cross-compat with Claude Code)
├── colors_and_type.css        ← all design tokens, drop in via <link rel="stylesheet">
├── assets/
│   ├── logo-polaris-io.png    ← official wordmark artwork
│   ├── logo-lockup.svg        ← SVG re-creation
│   └── icons/                 ← 21 Untitled UI Icons
├── preview/                   ← per-token / per-component cards for the Design System tab
├── ui_kits/
│   ├── web-app/               ← Intel Hub (signals, agents, entities)
│   └── admin/                 ← Workspace & member admin
└── fonts/                     ← (empty — webfonts loaded via Google Fonts CDN; see Type below)
```

---

## Content Fundamentals

How copy is written across the product.

### Voice

- **Analyst, not assistant.** The product is reporting findings to a smart user. Lead with the finding, then the evidence, then the next action. Never lead with hedging.
- **Second-person sparingly.** Use "you" only in empty-state CTAs and onboarding. In data views, the product narrates the data, not the user. Prefer *"Manufacturing expansion may unlock high-margin opportunity"* over *"You should look at manufacturing expansion."*
- **Confident verbs.** *Surface, detect, monitor, indicate, suggest, flag.* Avoid *"check out,"* *"dive into,"* *"explore!"*
- **Numbers in copy.** Use digits in UI (`47 signals`, not `forty-seven signals`). Hour-old data gets a relative timestamp (`12m ago`); older than today gets an absolute (`Mar 4`).

### Casing

- **Sentence case everywhere except product names.** Buttons, tabs, menu items, table headers, page titles → all sentence case.
- **Proper nouns are capitalized:** *ABM Intelligence Hub, Signal, Pattern, Agent, Entity, Workspace, Lens.* These are concept-level objects in the data model; they get title-cased when referenced as a noun (`a new Signal was detected`), lowercase when used as a generic verb (`signal a teammate`).
- **All-caps reserved for eyebrows** (`OVERVIEW`, `WORKSPACES`) and short status pills (`LIVE`, `DRAFT`). Tracked at `0.08em`.

### Tone in practice (examples lifted from the source)

| Type | Example |
| --- | --- |
| Page H1 | `ABM Intelligence Hub` |
| Section eyebrow | `WORKSPACES`, `ENTITIES`, `AGENTS` |
| Signal headline | `Manufacturing expansion may unlock high-margin opportunity` |
| Signal body | `Operational hiring surge may indicate maintenance and refurbishment activity. Increases data center capacity by ~18%.` |
| Search placeholder | `Search signals by topic, lens, opportunity area…` |
| Primary CTA | `New agent` |
| Secondary CTA | `Clear all` |
| Empty state header | `No signals match these filters` |
| Empty state body | `Loosen the strength or date range, or reset to defaults.` |

### Things to avoid

- **No emoji.** Anywhere. Polaris uses iconography for affordances and color/text for status.
- **No exclamation marks** outside of explicit error toasts (`Couldn't save — try again!`).
- **No marketing-speak.** *"Unlock,"* *"supercharge,"* *"revolutionize,"* *"powerful"* are banned in the product surface. They're acceptable in marketing site copy (separate scope).
- **Don't address the AI.** Agents have names (`Growth Monitor`, `Risk Monitor`). Refer to them by name, not as "the AI" or "our model."

---

## Visual Foundations

### Color

Polaris is **90% neutral, 10% brand**. The neutral scale is Tailwind's `neutral-*` exactly — 14 stops from `#fcfcfc` to `#0c0e12`.

The brand split:

- **Wordmark** — midnight navy `#001030` for "POLARIS" + cobalt `#2868C0` for "I/O". Logo artwork only; **don't use these in product UI**.
- **Application primary** — the Untitled UI Blue ramp (`--brand-50` → `--brand-950`). Default is **`#2E90FA` (--brand-500)**; primary buttons use **`#1570EF` (--brand-600)** with `#175CD3` (700) on hover. Soft tint backgrounds (selected rows, info pills) use `#D1E9FF` (100). All focus rings are brand-600 at 24%.

**Color is never decorative.** A spot of color always means a status or an interaction state.

> The original Figma file references a sub-product wordmark ("ABM Intelligence Hub") with an orange accent dot. That orange (`#FF8200`) is kept in tokens (`--polaris-orange`) for parity but is **not** used elsewhere.

Semantic colors come in triples (bg / border / text) and are used only in pills, dots, and inline alerts:

- **Success** — `#f0fdf4` / `#bbf7d0` / `#15803d`
- **Warning** — `#fffbeb` / `#fde68a` / `#b45309`
- **Error** — `#fef2f2` / `#fecaca` / `#dc2626`
- **Info** — `#eff6ff` / `#bfdbfe` / `#1d4ed8`

### Typography

- **Plus Jakarta Sans** — every text node in the source uses this family. We now ship all 8 weights (200/300/400/500/600/700/800) plus matching italics locally in `fonts/` via `@font-face`.
- **JetBrains Mono** — added for tabular IDs, deltas, and code-like content. Not in the original Figma but consistent with the analyst aesthetic. Loaded via Google Fonts CDN.
- All numbers in tables use `font-variant-numeric: tabular-nums`.
- Headings tighten: display sizes get `-0.02em` letter-spacing; body stays neutral.

### Backgrounds

Polaris is **white on neutral-50 on neutral-100**. Three flat layers, no gradients, no textures, no images behind content. The only "background image" usage is on logged-out / 404 surfaces, where a single full-bleed editorial photograph (cool, desaturated, never warm) sits under the page. Photography never appears inside the product chrome.

No hand-drawn illustrations. No abstract blobs. No pattern fills.

### Spacing & layout

- **4px grid.** Every offset is a multiple of 4. The most-used steps are 8 / 12 / 16 / 24.
- **1160px main content** inside a 1440px desktop frame (280px sidebar). On smaller breakpoints the sidebar collapses to icon-only at 64px.
- **32px horizontal page padding**, **24px vertical rhythm** between major sections.
- **Cards are 12px radius, 1px `--border-subtle`, `--shadow-xs`** — restrained. Never apply `shadow-lg` to ambient cards; reserve it for modals and floating menus.
- **Sidebar nav items** are 38px tall, 6px radius, 8px horizontal padding.

### Borders & shadows

Borders carry most of the visual hierarchy. The Figma uses `#e5e5e5` 172× — it's the workhorse divider. Use `--shadow-xs` on tables, cards, and the input-with-button-inset combo. The button inset shadow (`inset 0 -2px 0 0 rgba(0,0,0,0.05), inset 0 0 0 1px rgba(0,0,0,0.18)`) is a signature — it gives buttons a subtle physical depth without color.

### Animation

- **120ms** for hover-state transitions (background, border).
- **200ms** for everything else (collapse, fade, position).
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` for exits/transitions, linear for opacity-only.
- **No bounces, no springs, no overshoots.** The product never bounces a button or springs a panel open.
- **No skeletons that pulse.** Loading states are static shimmer at low contrast, or a centered brand-600 1.5px-stroke spinner.

### Hover / press states

- **Hover** on text/icon buttons: background goes from `transparent` → `--neutral-100`, foreground unchanged.
- **Hover** on filled primaries: brand-600 darkens from `#1570ef` → `#175cd3`.
- **Press** on any button: foreground stays put, button shifts down 1px (transform: translateY(1px)), inset highlight reduces.
- **Focus** is always a 4px brand-600 ring at 24% opacity — never an outline.
- Selected nav items get `--brand-100` background + `--brand-700` text.

### Transparency & blur

- **Used only on overlays.** Modal scrims are `rgba(12,14,18,0.55)` with `backdrop-filter: blur(8px)`. Inline UI never uses transparency; cards and dropdowns are opaque on white.
- **No frosted glass aesthetics** in chrome (no glassy headers, no Apple-style sidebar blur).

### Corner radii

- **6px** — nav items, small badges
- **8px** — buttons, inputs, dropdown menus
- **12px** — cards, filter bars, tables, modals
- **9999** — pills, avatars, status dots
- Never larger than 16px. No fully-rounded buttons.

### Cards

Card = `12px` radius + `1px solid #e5e5e5` + `--shadow-xs` + `--bg-canvas`. That's it. No colored left-borders. No gradient backgrounds. No icon-in-corner. If a card needs to indicate status, use a single pill in the top-right of the card header, not a border color.

### Fixed elements

- **Sidebar** is fixed at 280px width, always visible at desktop. Scrolls independently of the main column.
- **Top bar** (page chrome) is sticky to the top of the main column, 64px tall, white with a single `--border-subtle` bottom border.
- **Filter bars** are NOT sticky — they scroll away. Tables get a sticky column header inside the table's own scroll container instead.

### Imagery

Reserved for marketing site, settings → "about my workspace" hero, and logged-out screens. Always **cool-tinted, desaturated, no people**. Architecture, instruments, satellite imagery, infrastructure are on-brand. Grainy or warm-toned photography is off-brand.

---

## Iconography

The Figma file uses **Untitled UI Icons** — 24×24, 1.66px stroke, rounded line-cap, rounded corner-joins. The component library references them as `BarChartSquare02`, `ChevronDown`, `HomeLine`, etc.

These weren't extracted as raw SVG. **The closest visually-identical CDN-available substitute is Lucide** (formerly Feather), which shares the same stroke weight, terminal style, and naming convention. **This system uses Lucide via CDN by default**, with the substitution flagged below. When the codebase ships, swap to its bundled icon set.

### Usage

- Icons appear in: nav items (24px), inline buttons (16px-20px), avatars (16px), buttons (16-20px), badges (10-14px).
- **Stroke icons only.** No filled icons except status dots and avatars.
- **Color follows text color** by default. Never tint an icon a brand color unless it's a "live" pulse on the brand dot.
- **Never decorate** — a button without text needs an icon; a button with text + icon needs a strong reason.

### Banned

- Emoji (anywhere — including ✅ next to "Done").
- Unicode "icons" like `►` or `★`. Use Lucide `chevron-right` and `star`.
- 3D / gradient / colored-fill icon styles.

### Recommended set

`lucide` icons most relevant to Polaris:

`bar-chart-square`, `globe-02`, `users-01`, `search`, `chevron-down`, `chevron-right`, `arrow-up-right`, `filter-lines`, `dots-vertical`, `plus`, `x-close`, `alert-circle`, `check-circle`, `home-line`, `settings-01`, `bell-01`, `help-circle`, `log-out-01`, `sparkles`, `target-04`, `trend-up-01`, `shield-tick`.

Load via:

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<script>lucide.createIcons();</script>
```

### ⚠ Substitution flag

> The Figma uses **Untitled UI Icons** specifically. We substituted **Lucide** because Untitled UI's icon set isn't extracted in the .fig payload and isn't on a free CDN. The visual difference is < 5% (Untitled UI is built on top of Feather, which became Lucide), but if the production codebase ships Untitled UI Icons or another set, that should be copied into `assets/icons/` and swapped in. **Please confirm the production icon library so we can replace this substitution.**

---

## What's in `preview/`

Each file is one card for the Design System tab. They render at ~700px wide; some are tight horizontal swatches, some are component galleries. Open the Design System tab to see them all laid out by group.

Cards by group:

- **Brand** — `01-logo-lockup`, `22-iconography`, `23-voice-and-copy`
- **Colors** — `02-brand-colors`, `03-neutral-scale`, `04-semantic-colors`, `05-bg-layers`
- **Type** — `06-typefaces`, `07-display-scale`, `08-headings-body`
- **Spacing** — `09-spacing`, `10-radii`, `11-shadows`, `12-button-shadow-focus`
- **Components** — `13-buttons`, `14-inputs`, `15-badges`, `16-nav-items`, `17-tabs`, `18-table`, `19-dropdown`, `20-metric-cards`, `21-tooltip-toast-alert`

## What's in `ui_kits/`

- **`ui_kits/web-app/`** — the Intel Hub product. Sidebar nav, top bar with breadcrumbs, page header with horizontal tabs, filter bar, signals table, signal-detail drawer, and an "agents" overview screen. Click-through prototype lives at `index.html`. See its own README.
- **`ui_kits/admin/`** — workspace settings, member management, agent configuration, audit log. Built on the same primitives. See its own README.

---

## Caveats

- **Logo:** Replaced. The official Polaris I/O wordmark — navy "POLARIS" + cobalt "I/O" — is in `assets/logo-polaris-io.png` and a text-based recreation in `assets/logo-lockup.svg`. The earlier "ABM" wordmark (from the Figma's Hub sub-product) is gone.
- **Icons:** Lucide substituted for Untitled UI Icons — confirm the production set.
- **Font files:** Plus Jakarta Sans is shipped locally in `fonts/` (all 8 weights + italics). JetBrains Mono is still loaded via Google Fonts CDN — drop `.ttf` files into `fonts/` if you need it offline.
- **Codebase:** Not yet imported. Once it lands we'll re-validate token names, component APIs, and the agent / entity / signal data models.
