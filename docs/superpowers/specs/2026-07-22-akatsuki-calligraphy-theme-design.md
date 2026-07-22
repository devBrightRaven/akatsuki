# Akatsuki Calligraphy Theme Design

## Goal

Add an optional visual presentation for the Akatsuki article index. The default remains the readable article-card grid. Visitors can switch the same nine cards into a calligraphic composition built around the character `曉` without changing article order, links, or content.

## Scope

- Apply only to the paginated Akatsuki home grids.
- Preserve the current article cards, pagination, hover expansion, and keyboard behavior.
- Add no image-generation workflow, image dependency, or article-cover requirement.
- Localize new interface text for Akatsuki's existing English and Traditional Chinese pages.
- Do not add additional locales as part of this feature.

## Control

Place a segmented mode control in the home header beside the page title on wide screens and beneath the title on narrow screens.

- Traditional Chinese legend: `視覺呈現`
- Traditional Chinese options: `文章`, `曉`
- English legend: `Visual presentation`
- English options: `Articles`, `曉`

Implement the control as a native radio group styled as two adjacent segments. Both options must have a minimum 44 by 44 CSS-pixel target. The selected option uses the Akatsuki dawn color, a solid fill, and a visible border. Hover and keyboard focus receive distinct, non-color-only feedback.

The control changes presentation only. It must not look like navigation, a language switcher, or a content filter.

## Behavior

`Articles` is the default on a visitor's first visit. Store the selected presentation in local storage and restore it on later visits. If storage is unavailable or invalid, silently use `Articles`.

Changing the option updates one state attribute on the story stage. Article links remain ordinary links and keep their existing focus order. Decorative calligraphy is excluded from the accessibility tree.

Use a short opacity transition between presentations. Disable the transition when `prefers-reduced-motion: reduce` is active. The presentation change must not move keyboard focus or announce unrelated page content.

## Calligraphy Presentation

### Desktop, Three Columns

One oversized `曉` spans the complete 3 by 3 story grid. Card boundaries, story numbers, titles, and category labels remain visible above it. Cards use a translucent surface so the character reads as one composition across the gaps.

Hovering or focusing a card makes that card's surface more opaque, strengthens its border, and reveals the same summary and reading-time details as the existing article presentation. The character remains decorative and never replaces the article title.

Pages containing fewer than nine articles use the same composition without manufacturing empty cards. The glyph is positioned relative to the available grid rather than relying on exactly nine DOM items.

### Tablet and Mobile

At two columns or one column, do not attempt to preserve a visually complete 3 by 3 character. Each article card instead shows a different enlarged crop or brushstroke from `曉`, while its title and metadata remain readable. The fragments progress in article order so scrolling through the page still feels like moving through one composition.

No horizontal scrolling, fixed-height clipping, or pointer-only reveal is allowed.

## Visual Boundaries

- Use the existing Akatsuki dawn, surface, text, border, and focus colors.
- Do not introduce a separate color theme.
- Use a locally available Japanese serif/calligraphic font stack for the decorative character; do not add a web-font dependency for the initial version.
- If the preferred glyph is unavailable, fall back to a readable serif `曉` rather than hiding the presentation.
- Keep all text contrast at WCAG 2.2 AA levels in both states.

## Verification

1. Build all generated English and Traditional Chinese index pages.
2. Verify the control exists once per index and defaults to `Articles` without stored state.
3. Verify selection persists after reload and invalid stored values fall back safely.
4. Complete the control and first-card flow using keyboard only.
5. Confirm visible focus, readable titles, and no horizontal overflow at desktop, iPad-sized, and 320 CSS-pixel widths.
6. Confirm reduced-motion mode removes the presentation transition.
7. Run Beacon advisor checks on touched UI files and Beacon inspect after implementation.

## Success Criteria

A first-time visitor immediately sees that `視覺呈現` or `Visual presentation` changes only the grid's appearance. Article cards remain the default and remain fully usable in both modes. On desktop, the nine-card page reads as one `曉` composition; on smaller screens, the calligraphic identity survives without reducing readability or requiring the whole grid to be visible at once.
