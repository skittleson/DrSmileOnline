# Contact Form Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the English and Spanish contact pages by adding an existing-patient checkbox, a service-area sentence before the submit button, and a lightweight client-side bot filter.

**Architecture:** Two parallel Astro page templates (`contact.astro` and `es/contacto.astro`) are updated in place. No new components or libraries are introduced. A small inline `<script>` on each page handles the honeypot and time-delay checks before the form is submitted.

**Tech Stack:** Astro 5 static site, vanilla HTML/CSS/JS, no new npm dependencies.

## Global Constraints

- Follow existing code style: no comments, no third-party form libraries.
- Keep the EN and ES pages mirrored; both use the same field names and the same bot-filter logic.
- All internal links already use `${base}`; do not introduce bare relative links.
- The form is static; there is no backend validation.
- Do not change the existing Southern California intro paragraph.

---

### Task 1: Add existing-patient checkbox to both contact forms

**Files:**
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/es/contacto.astro`

**Interfaces:**
- Consumes: existing form markup and `.form-field` styles.
- Produces: a new optional `existing_patient` checkbox input on both pages.

- [ ] **Step 1: Add English checkbox markup**

In `src/pages/contact.astro`, after the `location` select block and before the `message` textarea, add:

```html
<div class="form-field form-field-checkbox">
  <label for="existing_patient">
    <input type="checkbox" id="existing_patient" name="existing_patient" value="yes" />
    I'm an existing patient
  </label>
</div>
```

- [ ] **Step 2: Add Spanish checkbox markup**

In `src/pages/es/contacto.astro`, after the `location` select block and before the `message` textarea, add:

```html
<div class="form-field form-field-checkbox">
  <label for="existing_patient">
    <input type="checkbox" id="existing_patient" name="existing_patient" value="yes" />
    Soy un paciente existente
  </label>
</div>
```

- [ ] **Step 3: Add checkbox styles**

In both `src/pages/contact.astro` and `src/pages/es/contacto.astro`, inside the existing `<style>` block, add after the `.form-field label` rule:

```css
.form-field-checkbox label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  margin-bottom: 4px;
  color: var(--color-text);
}
.form-field-checkbox input[type="checkbox"] {
  width: auto;
  margin: 0;
}
```

- [ ] **Step 4: Verify build and output**

Run: `npm run build`
Expected: build succeeds with the expected page count.

Run: `grep -n "existing_patient" dist/contact/index.html dist/es/contacto/index.html`
Expected: both files contain the new checkbox input.

- [ ] **Step 5: Commit**

```bash
git add src/pages/contact.astro src/pages/es/contacto.astro
git commit -m "feat(contact): add existing-patient checkbox"
```

---

### Task 2: Add service-area sentence before submit

**Files:**
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/es/contacto.astro`

**Interfaces:**
- Consumes: existing form markup.
- Produces: a short service-area paragraph directly above the submit button.

- [ ] **Step 1: Add English service-area sentence**

In `src/pages/contact.astro`, immediately before the `<button type="submit">`, add:

```html
<p class="form-service-area">We serve the greater Los Angeles area and Orange County, with offices in Newport Beach, San Pedro, Torrance, and Lomita.</p>
```

- [ ] **Step 2: Add Spanish service-area sentence**

In `src/pages/es/contacto.astro`, immediately before the `<button type="submit">`, add:

```html
<p class="form-service-area">Atendemos al área metropolitana de Los Ángeles y el Condado de Orange, con oficinas en Newport Beach, San Pedro, Torrance y Lomita.</p>
```

- [ ] **Step 3: Add service-area styles**

In both files, inside the existing `<style>` block, add:

```css
.form-service-area {
  margin-top: 16px;
  margin-bottom: 0;
  font-size: 0.9rem;
  color: var(--color-text-light);
}
```

- [ ] **Step 4: Verify build and output**

Run: `npm run build`
Expected: build succeeds.

Run: `grep -n "form-service-area" dist/contact/index.html dist/es/contacto/index.html`
Expected: both files contain the service-area paragraph.

- [ ] **Step 5: Commit**

```bash
git add src/pages/contact.astro src/pages/es/contacto.astro
git commit -m "feat(contact): add service-area sentence before submit"
```

---

### Task 3: Add client-side bot filter (honeypot + time-delay)

**Files:**
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/es/contacto.astro`

**Interfaces:**
- Consumes: existing form markup and `.form-status` element.
- Produces: hidden `company` and `form_timestamp` inputs plus a submit handler that blocks obvious bots.

- [ ] **Step 1: Add hidden inputs to English form**

In `src/pages/contact.astro`, inside the `<form>` and before the first visible field (or after the form opening tag), add:

```html
<div class="form-honeypot">
  <label for="company">Company</label>
  <input type="text" id="company" name="company" tabindex="-1" autocomplete="off" />
</div>
<input type="hidden" name="form_timestamp" id="form_timestamp" />
```

- [ ] **Step 2: Add hidden inputs to Spanish form**

In `src/pages/es/contacto.astro`, inside the `<form>` and before the first visible field, add:

```html
<div class="form-honeypot">
  <label for="company">Empresa</label>
  <input type="text" id="company" name="company" tabindex="-1" autocomplete="off" />
</div>
<input type="hidden" name="form_timestamp" id="form_timestamp" />
```

- [ ] **Step 3: Add honeypot styles**

In both files, inside the existing `<style>` block, add:

```css
.form-honeypot {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
```

- [ ] **Step 4: Add English bot-filter script**

In `src/pages/contact.astro`, after the closing `</form>` tag (but inside the `<div class="contact-form">`), add:

```html
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const status = document.querySelector('.form-status');
    const timestampInput = document.querySelector('#form_timestamp');
    if (!form || !status || !timestampInput) return;

    timestampInput.value = Math.floor(Date.now() / 1000).toString();

    form.addEventListener('submit', (event) => {
      const company = form.querySelector('[name="company"]');
      const elapsed = (Date.now() / 1000) - Number(timestampInput.value);

      if (company && company.value.trim() !== '' || elapsed < 3) {
        event.preventDefault();
        status.textContent = 'Your message could not be sent. Please try again.';
        return;
      }
    });
  });
</script>
```

- [ ] **Step 5: Add Spanish bot-filter script**

In `src/pages/es/contacto.astro`, after the closing `</form>` tag (but inside the `<div class="contact-form">`), add:

```html
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const status = document.querySelector('.form-status');
    const timestampInput = document.querySelector('#form_timestamp');
    if (!form || !status || !timestampInput) return;

    timestampInput.value = Math.floor(Date.now() / 1000).toString();

    form.addEventListener('submit', (event) => {
      const company = form.querySelector('[name="company"]');
      const elapsed = (Date.now() / 1000) - Number(timestampInput.value);

      if (company && company.value.trim() !== '' || elapsed < 3) {
        event.preventDefault();
        status.textContent = 'No se pudo enviar su mensaje. Por favor, intente de nuevo.';
        return;
      }
    });
  });
</script>
```

- [ ] **Step 6: Verify build and output**

Run: `npm run build`
Expected: build succeeds.

Run: `grep -n "form_timestamp\|form-honeypot\|company" dist/contact/index.html dist/es/contacto/index.html`
Expected: both files contain the hidden inputs and the honeypot styles.

Run: `grep -n "elapsed < 3" dist/contact/index.html dist/es/contacto/index.html`
Expected: both files contain the time-delay check.

- [ ] **Step 7: Manual browser test**

1. Run `npm run dev` and open the contact page.
2. Fill the form normally and submit; it should submit normally.
3. Open DevTools, set the `company` input value to `test`, and submit; the form should be blocked.
4. Reload, fill the form, and submit within 3 seconds; the form should be blocked.

- [ ] **Step 8: Commit**

```bash
git add src/pages/contact.astro src/pages/es/contacto.astro
git commit -m "feat(contact): add honeypot and time-delay bot filter"
```

---

## Self-Review

- **Spec coverage:** checkbox, service-area sentence, honeypot, time-delay, and verification are all covered.
- **Placeholder scan:** no TBD/TODO; all code blocks are complete.
- **Type consistency:** field names (`existing_patient`, `company`, `form_timestamp`) and class names (`form-field-checkbox`, `form-service-area`, `form-honeypot`) are consistent between EN and ES.
