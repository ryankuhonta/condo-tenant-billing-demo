# Edge Case Hunter Review Prompt

Use the `bmad-review-edge-case-hunter` skill. You may read project files but must not edit them.

## Files To Inspect

- `index.html`
- `styles.css`
- `app.js`
- `README.md`
- `_bmad-output/implementation-artifacts/spec-demo-login-gate.md`

## Review Task

Walk every branch and boundary condition for the login gate. Focus on first load, valid login, invalid login, refresh while logged in, logout, existing billing data preservation, keyboard behavior, hidden app controls before login, and whether existing billing workflows still work after login.

Return only actionable findings, ordered by severity.
