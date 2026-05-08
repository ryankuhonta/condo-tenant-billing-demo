# Blind Hunter Review Prompt

Use the `bmad-review-adversarial-general` skill. You get no conversation context, no spec, and no project access beyond this diff summary.

## Diff Summary

Baseline: `NO_VCS`

Added files:
- `index.html`
- `styles.css`
- `app.js`
- `README.md`

Changed file:
- `_bmad-output/implementation-artifacts/spec-condo-tenant-billing-pdf.md`

## Implemented Behavior

The change creates a dependency-free static web app for condo tenant billing. It includes tenant/unit CRUD, recurring charge CRUD, monthly bill generation, bill history, `localStorage` persistence, statement preview, and browser print/save-as-PDF support. The UI is structured in `index.html`, styled in `styles.css`, and all behavior is implemented in `app.js`.

## Review Task

Review this change as if you only saw the diff. Find likely bugs, regressions, missing validation, flawed assumptions, or maintainability risks. Return findings only, ordered by severity. Include file path and the smallest relevant location description.
