# Back-to-top control

## Purpose

Add a clear fixed control that returns readers to the site header after they
have moved far enough down the page for the action to be useful. Soften the
footer's no-newsletter message in all three published languages.

## Design

- Put `id="top"` and `tabindex="-1"` on the site header so activating the
  control moves both viewport and keyboard focus to a meaningful location.
- Add one fixed `<a href="#top">` after the site footer.
- Give the link a localized accessible name and title.
- Render a simplified front-facing raven flying upward inside the decorative
  `.back-to-top-icon` slot. The raven has raised wings, three or four large
  primary feather tips on each wing, a short thick beak, a substantial body,
  and one broad fan tail with no swallow-tail fork.
- Let the raven's pose communicate upward motion. Do not add a separate arrow.
- Draw the finished mark as a lightweight inline SVG. The approved raster
  concept is a shape reference, not a production asset.
- Keep the accessible name on the link so the mark can later be replaced by a
  finished Bright Raven mascot without changing the control's semantics.
- Use a stable 64 by 64 pixel target with a solid high-contrast surface, a
  restrained border, and a maximum 8 pixel corner radius.
- Keep the control clear of safe-area insets and prevent it from causing
  horizontal overflow.
- Hide the control at the top of the page. Use a small dependency-free script
  to reveal it after the reader has scrolled more than one viewport height.
- While hidden, remove the control from sequential keyboard navigation. Once
  visible, it remains in document order after the footer, so it is reached
  after the footer links rather than interrupting the page's first Tab stops.
- Give `:focus-visible` a high-contrast outline that remains visible against
  both the control and page background.
- Preserve normal font styling; do not introduce italics.

## Copy

- English: `No newsletter. Follow by RSS, or come back whenever you like.`
- Japanese: `ニュースレターは配信していません。RSSで購読するか、また読みたくなったときにお越しください。`
- Traditional Chinese: `不寄電子報。你可以透過 RSS 追蹤，或想起來時再回來看看。`

## Verification

- Run the existing build verification.
- Confirm the control is hidden and absent from the Tab order at the top.
- Confirm it becomes visible after scrolling more than one viewport height.
- Confirm it is reached after the footer links in sequential Tab order.
- Confirm activation returns focus and viewport to the site header.
- Confirm localized accessible names.
- Check 320, 768, 1024, 1280, 1440, 1742, and 1920 pixel widths for overlap
  and horizontal overflow.
