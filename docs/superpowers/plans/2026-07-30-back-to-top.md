# Back-to-top Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a localized fixed back-to-top control with a replaceable geometric crow placeholder and soften the no-newsletter footer copy.

**Architecture:** Extend the existing shared site data, base layout, stylesheet, and build verifier. Use an HTML anchor targeting the page body, so the feature requires no client-side JavaScript.

**Tech Stack:** Eleventy 3, Nunjucks, CSS, Node.js assertions

## Global Constraints

- Do not add a dependency or client-side JavaScript.
- Keep the control at 44 by 44 pixels with no more than an 8 pixel corner radius.
- Keep the icon decorative and the localized accessible name on the link.
- Do not introduce italic styling.
- Preserve all unrelated working-tree changes.

---

### Task 1: Shared back-to-top control

**Files:**
- Modify: `scripts/verify-build.mjs`
- Modify: `src/_data/site.js`
- Modify: `src/_includes/layouts/base.njk`
- Modify: `src/assets/style.css`

**Interfaces:**
- Consumes: `site.i18n[lang]` from `src/_data/site.js`
- Produces: `site.i18n[lang].backToTop`, `.back-to-top`, and `.back-to-top-icon`

- [ ] **Step 1: Add failing build assertions**

Add assertions that English, Japanese, and Traditional Chinese pages contain
localized back-to-top labels, that the shared page has an `id="top"` target,
and that CSS defines a fixed 44 by 44 pixel control without italic styling.

- [ ] **Step 2: Run the verifier and confirm failure**

Run: `pnpm check`

Expected: failure because `.back-to-top` and localized labels do not exist.

- [ ] **Step 3: Add localized copy and labels**

Use these exact values in `src/_data/site.js`:

```js
noNewsletter: "No newsletter. Follow by RSS, or come back whenever you like.",
backToTop: "Back to top",
```

```js
noNewsletter: "ニュースレターは配信していません。RSSで購読するか、また読みたくなったときにお越しください。",
backToTop: "ページ上部へ",
```

```js
noNewsletter: "不寄電子報。你可以透過 RSS 追蹤，或想起來時再回來看看。",
backToTop: "回到頁首",
```

- [ ] **Step 4: Add the native anchor and icon slot**

Add `id="top"` to `<body>`. After the footer, add an anchor targeting `#top`
with localized `aria-label` and `title`. Put a 24 pixel inline SVG geometric
crow inside it with `aria-hidden="true"` and class `.back-to-top-icon`.

- [ ] **Step 5: Add restrained fixed positioning**

Define a 44 by 44 pixel fixed control at the bottom-right safe area. Use
existing color variables, a visible focus indicator, `currentColor` for the
crow, and no italic styling. Ensure the icon slot can later contain an image.

- [ ] **Step 6: Run automated verification**

Run: `pnpm check`

Expected: `Akatsuki build verification passed`.

- [ ] **Step 7: Run browser verification**

At 320, 768, 1024, 1280, 1440, 1742, and 1920 pixel widths, assert:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

Activate the control by keyboard and confirm the URL targets `#top`, the page
returns to its header, and the localized accessible name is present. Inspect
mobile and desktop screenshots for content obstruction.

- [ ] **Step 8: Commit only owned files**

```powershell
git add -- scripts/verify-build.mjs src/_data/site.js src/_includes/layouts/base.njk src/assets/style.css docs/superpowers/plans/2026-07-30-back-to-top.md
git commit -m "add localized back-to-top control"
```
