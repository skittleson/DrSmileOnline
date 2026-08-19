# Accessibility

Current state of accessibility on the Dr. Smile site, plus the landmines a dev
must know before touching markup or styles. This documents **what exists**, not
a target standard — gaps are listed at the bottom, clearly marked.

## What's implemented

- **Language** — `Base.astro` sets `<html lang={locale}>` per page (`en` or `es`).
- **Skip link** — `Base.astro` renders `<a href="#main-content" class="skip-link">`
  as the first element of `<body>`, targeting `<main id="main-content">`.
  Styled in `global.css`: positioned off-screen (`top: -40px`) and slides into
  view on `:focus`.
- **Heading structure** — every page has exactly one `<h1>`; sections use `<h2>`/`<h3>`
  in order. No skipped levels in the current templates.
- **Navigation** — `Header.astro` wraps nav in `<nav aria-label="Main navigation">`;
  the mobile toggle button carries `aria-expanded` + `aria-controls="nav-menu"`
  and an `.sr-only` text label. Desktop dropdowns are pure-CSS
  (`:hover` + `:focus-within`), so keyboard users can reach them.
- **Language toggle** — `UtilityBar.astro` renders a `<nav aria-label>` with
  EN/ES links; the active one carries `aria-current="true"`.
- **Forms** — `contact.astro` uses explicit `<label for>` on every field,
  `autocomplete` hints, `required`, native `type="email"`/`type="tel"`, and a
  `<div role="status" aria-live="polite">` for submit feedback.
- **Images** — all `<img>` tags carry `alt`. Logos: `alt="Dr. Smile Dental Group"`.
  Content images: descriptive alt (e.g. the 404 photo). `ServiceCard.astro`
  uses `alt={title}` and `loading="lazy"`.
- **Touch targets** — nav links, dropdown items, the toggle button, language
  toggle, and `.btn` all enforce `min-height: 44px` / `min-width: 44px`.
- **Focus visibility** — `global.css` sets a global `:focus-visible` rule
  (`outline: 3px solid var(--color-primary)`); form controls get their own
  `:focus` outline; contact links get an underline on `:focus`.
- **Reduced motion** — `global.css` has a `@media (prefers-reduced-motion: reduce)`
  block that disables `scroll-behavior: smooth` and zeroes out
  `animation-duration` / `transition-duration` globally.
- **Testimonial carousel** — `TestimonialCarousel.astro` uses `role="region"`,
  `aria-live="polite"` on the track, `aria-hidden` on non-active slides, and
  labeled Previous/Next buttons.
- **External links** — social + maps links use `rel="noopener noreferrer"`.

## Gotchas

- **`aria-expanded` is static.** `Header.astro` hard-codes `aria-expanded="false"`
  on the mobile toggle; `public/js/nav-toggle.js` flips the `.open` class but
  does not update the attribute. Screen readers will report the menu as always
  collapsed.
- **Dropdown nav items are `<span>`s, not buttons.** The "Dental Guide" parent
  renders as `<span class="nav-dropdown-trigger">` with no `role`/`aria-expanded`
  — fine because the menu is always reachable via CSS, but it won't announce
  as expandable.
- **`ServiceCard` alt text is just the card title** (`alt={title}`). It passes
  WCAG technically but doesn't describe the image.
- **Don't "clean up" the `aria-hidden` carousel logic.** `TestimonialCarousel`
  marks non-active slides `aria-hidden={i !== 0}`; removing that to "simplify"
  breaks screen-reader announcement of the active slide.
- **The `sr-only` class is the only screen-reader-only utility.** Defined once
  in `global.css`. If you add a new component that needs visually-hidden text,
  reuse `.sr-only` rather than defining a parallel class.

## Known gaps (current, not requirements)

- **No `aria-current="page"` on the main nav** — only the language toggle
  (`UtilityBar.astro`) marks its active item. The active top-level nav link
  in `Header.astro` is not distinguished for assistive tech.
- **No `prefers-contrast` / high-contrast support.**
- **Color contrast not audited against WCAG 2.1 AA** — `--color-text-light`
  (`#5D6D7E`) on `--color-bg` (`#FFFFFF`), and `--color-accent-text`
  (`#2C3E50`) on `--color-accent` (`#E9A03B`) in particular are worth checking.
- **No `lang` attribute on inline foreign-language spans** (currently none
  exist, but worth knowing if added).
