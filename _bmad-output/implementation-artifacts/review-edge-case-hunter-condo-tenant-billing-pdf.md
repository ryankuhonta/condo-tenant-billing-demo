# Edge Case Hunter Review Prompt

Use the `bmad-review-edge-case-hunter` skill. You may read the project files.

## Files To Inspect

- `index.html`
- `styles.css`
- `app.js`
- `README.md`
- `_bmad-output/implementation-artifacts/spec-condo-tenant-billing-pdf.md`

## Review Task

Walk every branch and boundary condition in the implementation. Focus on edge cases in tenant CRUD, charge CRUD, bill generation, stored bill snapshots, empty states, invalid numeric/date input, deletion behavior, refresh persistence, print/PDF layout, and browser compatibility.

Return only actionable findings. Include file path, tight location, expected failure mode, and why it matters.
