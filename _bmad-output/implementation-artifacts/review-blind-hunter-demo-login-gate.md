# Blind Hunter Review Prompt

Use the `bmad-review-adversarial-general` skill. You get no conversation context, no spec, and no project access beyond this diff summary.

## Diff Summary

Baseline: `NO_VCS`

Changed files:
- `index.html`
- `styles.css`
- `app.js`
- `README.md`
- `_bmad-output/implementation-artifacts/spec-demo-login-gate.md`

## Implemented Behavior

The change adds a demo-only static login gate to a dependency-free condo billing app. It adds a login screen before the app shell, fixed local credential `admin` / `admin123`, session state in `sessionStorage`, a logout button, CSS for login and hidden states, and README documentation that this is not production authentication.

## Review Task

Review likely bugs, regressions, missing validation, flawed assumptions, or maintainability risks based only on this summary. Return findings only, ordered by severity.
