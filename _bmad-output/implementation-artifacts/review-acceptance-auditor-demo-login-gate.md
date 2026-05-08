# Acceptance Auditor Review Prompt

Review the implementation against the approved spec.

## Spec

Read `_bmad-output/implementation-artifacts/spec-demo-login-gate.md`.

## Files To Inspect

- `index.html`
- `styles.css`
- `app.js`
- `README.md`

## Review Task

Check whether the implementation satisfies every acceptance criterion and every boundary in the frozen intent. Pay special attention to fixed demo credential, `sessionStorage`, app hidden before login, existing billing data remaining in the original `localStorage` key, logout preserving data, README security caveat, and no backend/framework/dependency changes.

Classify each issue as spec violation, acceptance miss, or verification gap. Return findings only, ordered by severity.
