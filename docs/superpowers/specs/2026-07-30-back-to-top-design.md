# Back-to-top control

## Purpose

Add a small fixed control that returns readers to the site header without
introducing JavaScript. Soften the footer's no-newsletter message in all three
published languages.

## Design

- Add `id="top"` to the page body.
- Add one fixed `<a href="#top">` after the site footer.
- Give the link a localized accessible name and title.
- Render a small, single-color geometric crow placeholder inside a decorative
  `.back-to-top-icon` slot.
- Keep the accessible name on the link so the placeholder can later be replaced
  by a finished Bright Raven icon or mascot image without changing the
  control's semantics.
- Use a stable 44 by 44 pixel target with a restrained border and a maximum
  8 pixel corner radius.
- Keep the control clear of safe-area insets and prevent it from causing
  horizontal overflow.
- Preserve normal font styling; do not introduce italics.

## Copy

- English: `No newsletter. Follow by RSS, or come back whenever you like.`
- Japanese: `ニュースレターは配信していません。RSSで購読するか、また読みたくなったときにお越しください。`
- Traditional Chinese: `不寄電子報。你可以透過 RSS 追蹤，或想起來時再回來看看。`

## Verification

- Run the existing build verification.
- Confirm the control returns focus and viewport to the page header.
- Confirm localized accessible names.
- Check 320, 768, 1024, 1280, 1440, 1742, and 1920 pixel widths for overlap
  and horizontal overflow.
