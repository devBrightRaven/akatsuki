# Back-to-top Raven Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the always-visible 44px placeholder with an accessible 64px upward-flying raven control that appears only after one viewport of scrolling.

**Architecture:** Keep the link after the footer so its Tab position remains last, but target a focusable site header. A small dependency-free module toggles the link's `hidden` state from `scrollY > innerHeight`; CSS owns the fixed presentation and inline SVG owns the simplified raven silhouette.

**Tech Stack:** Eleventy 3, Nunjucks, CSS, browser JavaScript, Node.js assertions

## Global Constraints

- Use a stable 64 by 64 pixel target with no more than an 8 pixel corner radius.
- Use a simplified front-facing upward-flying raven with raised wings and a broad unforked fan tail.
- Do not add a separate arrow, dependency, italic styling, or raster production asset.
- Keep the control out of the Tab order while hidden and after footer links when visible.
- Preserve all unrelated working-tree changes.

---

### Task 1: Markup, behavior, and build contract

**Files:**
- Modify: `scripts/verify-build.mjs`
- Modify: `src/_includes/layouts/base.njk`
- Create: `src/assets/back-to-top.js`

**Interfaces:**
- Consumes: `.site-header`, `.back-to-top`, `window.scrollY`, and `window.innerHeight`
- Produces: a focusable `#top` target and a control whose `hidden` state reflects whether `scrollY > innerHeight`

- [ ] **Step 1: Add failing build assertions**

Assert that generated pages contain:

```js
assert.match(home, /<header[^>]*id="top"[^>]*tabindex="-1"/)
assert.match(home, /class="back-to-top"[^>]*hidden/)
assert.match(home, /src="\/assets\/back-to-top\.js"/)
assert.match(home, /class="back-to-top-icon" viewBox="0 0 64 64"/)
```

Assert that CSS defines a fixed 64 by 64 pixel control and a 52 by 52 pixel icon.

- [ ] **Step 2: Run the verifier and confirm failure**

Run: `pnpm check`

Expected: failure because the generated page still targets `<body>` and uses the 44px placeholder.

- [ ] **Step 3: Replace the markup**

Move `id="top"` from `<body>` to:

```html
<header id="top" class="site-header" role="banner" tabindex="-1">
```

Add `hidden` to the existing link. Replace its SVG with a `64 64` viewBox and
three overlapping `currentColor` paths: raised wings with four large primary
tips per side, a substantial centered body with broad fan tail, and a short
centered beak. Keep the SVG decorative.

- [ ] **Step 4: Add the visibility module**

Create `src/assets/back-to-top.js`:

```js
const control = document.querySelector(".back-to-top")

if (control) {
  const update = () => {
    control.hidden = window.scrollY <= window.innerHeight
  }

  window.addEventListener("scroll", update, { passive: true })
  window.addEventListener("resize", update)
  update()
}
```

Load it once near the end of the shared layout with:

```html
<script type="module" src="/assets/back-to-top.js"></script>
```

- [ ] **Step 5: Run the build verification**

Run: `pnpm check`

Expected: failure only until the stylesheet is updated in Task 2.

---

### Task 2: Visible 64px treatment

**Files:**
- Modify: `src/assets/style.css`
- Modify: `src/_includes/layouts/base.njk`

**Interfaces:**
- Consumes: `.back-to-top`, `.back-to-top-icon`, existing color variables, and the native `hidden` attribute
- Produces: a high-contrast 64px fixed control with a visible focus ring

- [ ] **Step 1: Replace the old 44px styles**

Set the target to `64px`, icon to `52px`, right and bottom offsets to safe-area-aware `0.75rem`, `border-radius: 8px`, `background: var(--text)`, and `color: var(--bg)`. Keep the control fixed and add a restrained shadow.

- [ ] **Step 2: Add interaction states**

Keep hover high contrast and add:

```css
.back-to-top:focus-visible {
  outline: 3px solid var(--dawn);
  outline-offset: 4px;
}

.site-header:focus:not(:focus-visible) {
  outline: none;
}
```

- [ ] **Step 3: Bust the stylesheet cache**

Increment the shared stylesheet query string from `20260730-2` to `20260730-3`.

- [ ] **Step 4: Run automated verification**

Run: `pnpm check`

Expected: `Akatsuki build verification passed`.

---

### Task 3: Interaction and responsive verification

**Files:**
- Test: generated pages served by Eleventy

**Interfaces:**
- Consumes: the built site in a browser
- Produces: evidence that visibility, focus order, navigation, and layout match the specification

- [ ] **Step 1: Verify the visibility threshold**

At page load assert the control is hidden. Scroll to `innerHeight + 1`, dispatch
or await a scroll event, and assert it is visible.

- [ ] **Step 2: Verify keyboard order and activation**

Confirm footer links precede the visible control in document order. Focus the
control, press Enter, and confirm the URL ends in `#top`, the site header owns
focus, and the viewport returns to the top.

- [ ] **Step 3: Verify all required widths**

At 320, 768, 1024, 1280, 1440, 1742, and 1920 pixels, assert:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

Inspect screenshots for text obstruction and verify the control remains 64 by
64 pixels in English, Japanese, and Traditional Chinese.

- [ ] **Step 4: Commit only owned files**

```powershell
git add -- scripts/verify-build.mjs src/_includes/layouts/base.njk src/assets/back-to-top.js src/assets/style.css docs/superpowers/plans/2026-07-30-back-to-top.md
git commit -m "refine back-to-top raven control"
```
