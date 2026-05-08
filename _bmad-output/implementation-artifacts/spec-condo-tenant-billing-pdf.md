---
title: 'Condo Tenant Billing PDF Demo'
type: 'feature'
created: '2026-05-04'
status: 'done'
baseline_commit: 'NO_VCS'
context: []
---

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** The demo project needs a usable app for generating monthly billing statements for tenants of condo units, with an output that can be saved as a PDF. The workspace currently has no application code, so the first version must establish the app structure and core billing workflow.

**Approach:** Build a dependency-free static web app that runs locally in the browser with `index.html`, `styles.css`, and `app.js`. The app will store demo data in `localStorage`, let the user manage tenants and recurring charges, generate monthly billing statements, keep generated bill history, and open a print-ready statement that the browser can save as PDF.

## Boundaries & Constraints

**Always:** Keep the first demo install-free and runnable by opening the HTML file directly. Use Philippine peso formatting, monthly billing periods, and clear condo-oriented labels. Persist tenants, charges, and generated bill history in browser `localStorage`. Support editing and deleting tenants, editing and deleting charge templates, generating a bill for a selected tenant/month, and viewing previously generated bills.

**Ask First:** Ask before adding a backend, database server, authentication, email/SMS delivery, payment tracking, cloud storage, package-manager dependencies, or a framework build step.

**Never:** Do not implement real accounting, official tax invoicing, regulatory compliance, payment collection, multi-user sync, or tenant legal notices in this demo. Do not depend on external CDN scripts for the PDF workflow.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Create tenant | User enters tenant name, unit number, contact, and monthly rent | Tenant appears in the tenant list and becomes selectable for billing | Missing name/unit or invalid rent prevents save and shows an inline message |
| Create charge | User enters charge label, amount, and category | Charge appears in the charge setup list and is included in generated bills by default | Missing label or invalid amount prevents save and shows an inline message |
| Generate bill | Tenant, billing month, due date, and selected charges exist | App creates a billing statement with line items, subtotal/total, due date, and unique bill number; history updates | Missing tenant or billing month blocks generation with a visible message |
| Print PDF | User opens a generated bill and selects print | Print layout shows only the billing statement, suitable for browser Save as PDF | If no bill is selected, print action is disabled or explains what to select first |
| Empty app | No tenants, charges, or bills exist | App shows helpful empty states and prefilled sample charge categories are not silently created as real records | User can still create records from visible forms |
| Delete referenced tenant | A tenant with generated bills is deleted | Tenant is removed from setup lists; existing bill history still preserves tenant/unit text from the generated bill snapshot | Confirm destructive action before deleting |

</frozen-after-approval>

## Code Map

- `index.html` -- Static app shell, forms, bill preview region, print-only statement markup, and script/style links.
- `styles.css` -- Responsive condo billing UI, compact app controls, table/list states, and print-specific PDF layout.
- `app.js` -- Local state, `localStorage` persistence, tenant/charge CRUD, bill generation, history rendering, validation, and print action.

## Tasks & Acceptance

**Execution:**
- [x] `index.html` -- Create the static application structure with tenant, charge, billing, history, and preview sections -- establishes the runnable demo surface.
- [x] `styles.css` -- Add responsive UI styling and print CSS that hides controls and formats the billing statement for PDF output -- makes the app usable and printable.
- [x] `app.js` -- Implement persistent state, validation, tenant CRUD, charge CRUD, bill generation, bill history, preview rendering, and print handling -- provides the requested workflow.
- [x] `README.md` -- Document how to run the app and generate a PDF from the browser print dialog -- makes the demo self-explanatory.

**Acceptance Criteria:**
- Given a first-time browser session, when the user opens `index.html`, then the app loads without a build step and shows empty states plus forms for tenants, charges, billing, and history.
- Given valid tenant details, when the user saves the tenant, then it appears in the tenant list and billing tenant selector.
- Given valid charge details, when the user saves the charge, then it appears in the charge list and can be included in monthly bill generation.
- Given a tenant, billing month, due date, and at least one selected charge, when the user generates a bill, then a statement appears with bill number, tenant/unit details, line items, total due, and due date.
- Given a generated bill, when the user opens print/save as PDF, then only the formatted billing statement is printed and app controls are hidden.
- Given the page is refreshed, when data was previously saved, then tenants, charges, and bill history are restored from `localStorage`.

## Design Notes

Use a static browser app because the user asked for a demo and left the stack choice open. Browser print-to-PDF satisfies the PDF output requirement without adding network, install, or binary PDF dependencies. Store bill snapshots instead of recomputing old bills so history remains stable even if tenant or charge records are edited later.

## Verification

**Commands:**
- `Get-Content index.html` -- expected: file exists and links `styles.css` and `app.js`.
- `Get-Content styles.css` -- expected: file exists with `@media print` rules.
- `Get-Content app.js` -- expected: file exists with no external imports.

**Manual checks (if no CLI):**
- Open `index.html`, create a tenant and charge, generate a monthly bill, refresh the page, reopen the bill from history, and use Print to confirm the PDF layout contains only the billing statement.

## Suggested Review Order

**Billing Flow**

- Start at generation rules: validation, charge selection, snapshots, and totals.
  [`app.js:217`](../../app.js#L217)

- Review the form surface that feeds the monthly billing run.
  [`index.html:124`](../../index.html#L124)

- Check how previews render stored bill snapshots.
  [`app.js:484`](../../app.js#L484)

**Persistence and CRUD**

- Confirm local storage failures and malformed stored records are handled.
  [`app.js:69`](../../app.js#L69)

- Review tenant save/edit guards and validation.
  [`app.js:154`](../../app.js#L154)

- Review charge save/edit guards and validation.
  [`app.js:186`](../../app.js#L186)

**Presentation and PDF**

- Inspect responsive app layout and panel structure.
  [`styles.css:144`](../../styles.css#L144)

- Check statement and long-text wrapping behavior.
  [`styles.css:347`](../../styles.css#L347)

- Verify print rules hide controls and leave only the statement.
  [`styles.css:493`](../../styles.css#L493)

**Usage Notes**

- Confirm run instructions and browser-local storage caveats.
  [`README.md:5`](../../README.md#L5)
