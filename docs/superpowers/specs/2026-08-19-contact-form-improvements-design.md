# Contact Form Improvements — Design

**Date:** 2026-08-19
**Scope:** `src/pages/contact.astro`, `src/pages/es/contacto.astro`

## Goals

1. Capture whether a submitter is an existing patient.
2. Make the service area (Los Angeles area / Orange County) explicit before the user submits.
3. Reduce bot / "ghost" spam submissions with a lightweight, static-site-friendly filter.

## Non-Goals

- No backend form validation or new form-handling service.
- No third-party captcha or reCAPTCHA.
- No changes to location pages, header, footer, or other components.

## Changes

### 1. Existing-patient checkbox

Add an optional checkbox to the contact form, after the "Preferred Location" select and before the message textarea.

- EN label: "I'm an existing patient"
- ES label: "Soy un paciente existente"
- Input name: `existing_patient`
- Not required; the value is included in the form submission for triage.

### 2. Service-area sentence before submit

Add a short paragraph directly above the submit button.

- EN: "We serve the greater Los Angeles area and Orange County, with offices in Newport Beach, San Pedro, Torrance, and Lomita."
- ES: "Atendemos al área metropolitana de Los Ángeles y el Condado de Orange, con oficinas en Newport Beach, San Pedro, Torrance y Lomita."

This keeps the existing "four locations across Southern California" intro unchanged.

### 3. Bot filter (honeypot + time-delay)

Because the site is static, filtering happens client-side before the form is submitted.

- **Honeypot:** a hidden `text` input named `company` that is visually hidden and not exposed to screen readers. Bots that auto-fill every field will populate it; humans will not. If it has a value, block submission.
- **Time-delay:** a hidden `form_timestamp` input set to the current Unix time when the page loads. On submit, if less than 3 seconds have elapsed, block submission.
- Both checks run in a small `<script>` attached to each form.
- On failure, prevent the form from submitting and show the existing `.form-status` area with a neutral message (e.g., "Your message could not be sent. Please try again.").

## Files

- `src/pages/contact.astro`
- `src/pages/es/contacto.astro`

## Verification

- `npm run build` completes with the expected page count.
- Inspect `dist/contact/index.html` and `dist/es/contacto/index.html` for:
  - the new checkbox input,
  - the service-area sentence before the submit button,
  - the hidden honeypot and timestamp inputs,
  - the client-side filter script.
- Manual test in a browser: confirm the form still submits normally, and that filling the honeypot or submitting within 3 seconds blocks the request.
