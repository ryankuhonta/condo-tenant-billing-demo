# Acceptance Auditor Review Prompt

Review the implementation against the approved spec.

## Spec

Read `_bmad-output/implementation-artifacts/spec-condo-tenant-billing-pdf.md`.

## Files To Inspect

- `index.html`
- `styles.css`
- `app.js`
- `README.md`

## Review Task

Check whether the implementation satisfies every acceptance criterion and every boundary in the frozen intent. Pay special attention to:

- install-free browser execution
- tenant/unit setup
- charge setup
- monthly bill generation
- print/save-as-PDF workflow
- history persistence in `localStorage`
- preservation of generated bill snapshots after tenant/charge edits or deletion
- no backend, database server, framework build step, CDN PDF dependency, or external install requirement

Classify each issue as spec violation, acceptance miss, or verification gap. Return findings only, ordered by severity.
