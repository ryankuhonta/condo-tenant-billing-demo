---
title: 'Demo Login Gate'
type: 'feature'
created: '2026-05-04'
status: 'done'
baseline_commit: 'NO_VCS'
context: []
---

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** The condo billing demo is currently open immediately when `index.html` loads, but the user wants a login feature before using the app. Because the project is a dependency-free static browser demo, the login must set expectations clearly and avoid pretending to be real server-side security.

**Approach:** Add a demo-only login gate inside the existing static app. The login screen will require a fixed local demo credential, remember only the signed-in session flag in `sessionStorage`, hide the billing workspace until login succeeds, and provide a logout button that returns to the login screen without deleting tenant, charge, or bill data.

## Boundaries & Constraints

**Always:** Keep the app install-free and runnable by opening `index.html`. Use the demo credential `admin` / `admin123` unless the user later asks to change it. Store the authenticated session in `sessionStorage`, not `localStorage`, so closing the tab/browser naturally logs out. Make the login form keyboard-friendly, show a clear invalid-login message, and keep all existing billing data in the current `localStorage` key unchanged.

**Ask First:** Ask before adding a backend, database, password hashing library, user registration, password reset, multi-user roles, encrypted storage, or real authentication claims.

**Never:** Do not represent the static login as secure production authentication. Do not block the existing `Load Demo Data`, `Clear Data`, tenant, charge, billing, history, preview, or print/PDF behavior after a successful login. Do not move existing billing data to a new storage key.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| First open | No active session in `sessionStorage` | Login panel is visible and app workspace is hidden | App data is not deleted or mutated |
| Valid login | Username `admin`, password `admin123` | Login panel hides, app workspace appears, existing billing data renders | Login form is cleared after success |
| Invalid login | Wrong username or password | User stays on login panel with a visible error | Do not reveal which field was wrong |
| Refresh while logged in | Active session exists | App workspace remains visible and data renders from `localStorage` | If stored app data is malformed, existing defensive loading still applies |
| Logout | User clicks logout | Session is cleared and login panel returns | Billing data remains stored |

</frozen-after-approval>

## Code Map

- `index.html` -- App shell currently starts directly at `<main class="app-shell">`; login markup and a logout control need to wrap/gate that experience.
- `styles.css` -- Existing app layout and panels need complementary login-screen, hidden-state, and logout button styles.
- `app.js` -- Existing state load/render runs on page load; authentication state must gate rendering without changing tenant/charge/bill persistence.
- `README.md` -- Run instructions should mention the demo login credential and static-login limitation.

## Tasks & Acceptance

**Execution:**
- [x] `index.html` -- Add a login section before the billing app and a logout button in the header -- gives the user an entry gate and exit path.
- [x] `styles.css` -- Add login panel, hidden-state, error-message, and header logout styling -- makes the login flow usable on desktop and mobile.
- [x] `app.js` -- Add demo credential checks, `sessionStorage` session handling, login/logout events, render gating, and error messaging -- implements the requested login behavior without changing billing storage.
- [x] `README.md` -- Document the demo credential and limitation that this is not production authentication -- avoids misleading users about security.

**Acceptance Criteria:**
- Given no active session, when `index.html` opens, then the login panel is visible and the billing workspace is hidden.
- Given username `admin` and password `admin123`, when the user submits the login form, then the billing app appears and existing tenant, charge, and bill data render.
- Given invalid credentials, when the user submits the login form, then the app remains hidden and a generic invalid-login message appears.
- Given a successful login, when the user refreshes the page in the same browser session, then the app remains visible.
- Given a logged-in user, when the user clicks logout, then the session is cleared, the login panel returns, and local billing data remains intact.

## Spec Change Log

## Design Notes

This is intentionally a demo gate rather than real authentication. A static HTML file cannot protect source code, credentials, or local data against a determined user. The useful demo behavior is workflow gating, not security enforcement.

## Verification

**Commands:**
- `Select-String -Path index.html -Pattern 'loginForm|logoutBtn'` -- expected: login and logout controls exist.
- `Select-String -Path app.js -Pattern 'sessionStorage|admin123|handleLogin|handleLogout'` -- expected: demo session flow exists.
- `Select-String -Path README.md -Pattern 'admin123|not production authentication'` -- expected: credential and limitation are documented.

**Manual checks:**
- Open `index.html`, confirm login appears, try a wrong password, login with `admin` / `admin123`, refresh, generate a bill, logout, and verify data is still present after logging back in.

## Suggested Review Order

**Login Gate**

- Start at the visible gate, credential hint, warning, and hidden app shell.
  [`index.html:10`](../../index.html#L10)

- Review fixed demo credential and session key boundaries.
  [`app.js:2`](../../app.js#L2)

- Check session-driven visibility, ARIA state, and focus movement.
  [`app.js:85`](../../app.js#L85)

- Verify login failure and success handling.
  [`app.js:100`](../../app.js#L100)

- Confirm logout clears only the session, not billing data.
  [`app.js:116`](../../app.js#L116)

**Presentation**

- Inspect login panel and hidden-state styling.
  [`styles.css:28`](../../styles.css#L28)

- Check in-app demo-security warning styling.
  [`styles.css:66`](../../styles.css#L66)

**Documentation**

- Confirm demo credential and static-auth limitation are explicit.
  [`README.md:9`](../../README.md#L9)
