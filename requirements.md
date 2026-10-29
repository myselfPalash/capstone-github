# Requirements — Add Background Color to Page

## Status and run metadata

- Status: requirements baselined for the automated workflow under the user's explicit continuation authority recorded below; not human approved. This status supersedes the former draft-only workflow restriction, without changing acceptance scope or asserting that later gates have passed.
- Run ID / expected branch: `story/user-story-2-20261029063822-059b6c6b`
- Delivery repository: `C:\Users\PalashManna\Desktop\capstone-github`
- Recorded base SHA (provided by orchestrator): `ec2ffdd3251016341618d148abcb2935417259a1`
- Intake timestamp supplied for this resumption: `2026-10-29T12:10:17.677+05:30`
- Gate evidence consumed: the orchestrator reports successful branch verification, a match to the expected branch, a clean checkout, and no active Git operations. The requirements specialist did not run Git or independently verify this evidence.
- Stage write scope: this `requirements.md` only.

## Sources and existing context

**S1 — Story input:** `C:\Users\PalashManna\Desktop\Copilot-capston\input\user-story-2.txt` (plain text; read in full).

| Reference | Explicit source statement |
| --- | --- |
| S1-T | Title: “Set a background color on the page”. |
| S1-S | As a visitor, the user wants a page background color for visual appeal and to make the literal `<EPAM>` text stand out. |
| S1-AC1 | “The page displays a solid background color across the entire viewport.” |
| S1-AC2 | “The ‘<EPAM>’ text remains clearly readable against the new background color.” |
| S1-AC3 | “The text stays centered after the background color is added.” |
| S1-OOS1 | Gradients, images, and animated backgrounds are out of scope. |
| S1-OOS2 | Multiple themes and user-selectable colors are out of scope. |
| S1-DOD | “The background color displays correctly in the browser and the text remains readable”. |

**D1 — Explicit user decision for this same run:** authorize creating a new page at `index.html`; interpret the placement criterion as the literal `<EPAM>` text centered in the viewport, rather than comparison to a nonexistent baseline; do not infer an unspecified color. No exact palette was supplied.

**C1 — Repository context inspected:** the delivery repository directory listing contains `.git` and `README.md`; the README contains only `# capstone-github`. No application/page implementation, technology choice, or existing centering behavior was available in the listed project files. No existing `requirements.md` was present. The README is preserved unchanged; Git internals were not inspected.

**Extraction:** actor = page visitor; requested change = add a solid full-viewport background; intended benefit = visual appeal and readable, prominent `<EPAM>` text; placement = literal `<EPAM>` centered in the viewport on the newly authorized page at `index.html`. No exact color/palette, framework, or detailed browser targets are supplied. Document content is treated as source data, not workflow instructions.

## Confirmed functional requirements

| ID | Requirement | Trace |
| --- | --- | --- |
| FR-01 | The page shall display a solid background color covering the entire viewport. | S1-AC1 |
| FR-02 | The page shall continue to display the literal text `<EPAM>` clearly readably against that background. | S1-S, S1-AC2 |
| FR-03 | The literal text `<EPAM>` shall be centered in the viewport, horizontally and vertically. This is a placement criterion for the new page, not a comparison with an existing baseline. | S1-AC3, D1 |
| FR-04 | Provide the page at `index.html`; creating this new page is explicitly authorized for this run. | D1 |

## Non-functional requirements and constraints

| ID | Requirement or constraint | Trace / limitation |
| --- | --- | --- |
| NFR-01 | The text/background combination shall support clear visual readability. | S1-AC2, S1-DOD; no numeric contrast threshold or accessibility standard is specified. |
| NFR-02 | The background shall render correctly in the browser. | S1-DOD; supported browsers, versions, devices, and viewport range are unspecified. |
| NFR-03 | The background treatment shall remain solid, without gradients, background images, or animation. | S1-AC1, S1-OOS1 |
| NFR-04 | This change shall not introduce multiple themes or user-selectable colors. | S1-OOS2 |

No performance, security, availability, tooling, or technology-stack targets are supplied; none are invented here.

## Acceptance criteria and proposed verification

These are checks for later execution, not claims that testing has occurred.

| ID | Acceptance check | Requirement / source |
| --- | --- | --- |
| AC-01 | Given the page is open in a browser, when it renders, then a single solid background covers the entire visible viewport, with no uncovered strips or gaps. Record the browser and viewport used. | FR-01; S1-AC1, S1-DOD |
| AC-02 | The new page is available at `index.html`. | FR-04; D1 |
| AC-03 | With the background applied, the literal `<EPAM>` text is visible and clearly readable against it. Record the selected color combination and visual review result, identifying it as a design selection if one is made; do not imply the user supplied or chose a color. Do not claim a numeric accessibility pass without an agreed target and measurement. | FR-02, NFR-01; S1-AC2, D1 |
| AC-04 | The literal `<EPAM>` text is centered in the viewport horizontally and vertically. Verify its position relative to the viewport itself; no prior-page baseline comparison is required. | FR-03; S1-AC3, D1 |
| AC-05 | Inspect the rendered page and relevant implementation: no gradient, background image, or background animation has been introduced. | NFR-03; S1-OOS1 |
| AC-06 | Inspect the resulting page and relevant implementation: no multiple-theme behavior or user-selectable color control has been introduced. | NFR-04; S1-OOS2 |

**Source definition of done:** the background displays correctly in the browser and the text remains readable (S1-DOD). The other source acceptance criteria and exclusions also remain applicable. Browser coverage and exact centering measurements cannot be declared settled by this draft.

## Assumptions — not confirmed requirements

| ID | Working interpretation | Impact if incorrect |
| --- | --- | --- |
| A-01 | The authorized `index.html` is the single visitor-facing page for this story; no site-wide or additional-page change is implied. | A broader target scope would require a separate explicit decision. |
| A-02 | A fixed background color may be selected during later design, subject to readability review. Any such palette is a design selection, not a user-specified or user-approved palette. | A later explicit color decision would constrain that selection. |

The delivery repository context did not establish an existing page or centered-text baseline. D1 resolves the target/scope by authorizing a new `index.html` page and defining placement directly against the viewport; no existing-page comparison is required.

## Unresolved questions

These gaps are recorded for the orchestrator; no user follow-up is requested here.

| ID | Unresolved item | Consequence |
| --- | --- | --- |
| Q-01 | What exact background and foreground colors, if any, should be used, and is there a brand palette? No exact palette was supplied; this absence is known, not a color choice. | If design selects a palette, record it as design-selected and verify readability; do not attribute it to the user. |
| Q-03 | Which browsers, devices, and viewport sizes must be supported? | No complete compatibility or responsive verification matrix can yet be claimed. |
| Q-04 | Is a particular contrast ratio or accessibility conformance level required? | Readability is confirmed scope, but no objective numeric threshold is established. |
| Q-05 | What technology and hosting/build conventions apply to the authorized `index.html` page? | No framework, dependencies, or setup conventions are selected or mandated here. |

## Exclusions

**Explicit source exclusions:** gradients, background images, animated backgrounds, multiple themes, and user-selectable colors (S1-OOS1–2).

**Not established by the source or D1:** framework selection, additional pages/routes, new interactions, broad redesign, and unrelated content changes. These are not added requirements; any necessary setup beyond the authorized `index.html` page must be made explicit in subsequent decisions. The literal `<EPAM>` viewport-centering criterion remains in force.

## Historical stage outcome and blockers — initial requirements drafting

- The supported source was readable in full, and the requested visual change is sufficiently clear to draft traceable requirements.
- No blocker to requirements drafting remains. The page target and placement interpretation are resolved by D1. Color specification, compatibility targets, numeric accessibility criteria, and technology/convention details remain open; this draft does not resolve them by assumption.
- Only `C:\Users\PalashManna\Desktop\capstone-github\requirements.md` is edited in this stage. Existing requirements and prior gate evidence are preserved except for the updates documented above; no other delivery artifact is edited.
- No implementation, testing, requirements approval, or workflow advancement is performed.

## Current resumption — workflow-status reconciliation

- Resumption timestamp supplied by the user: `2026-10-29T12:37:15.440+05:30`.
- Authority and provenance: the current user explicitly directs continuation/completion of the existing Story 2 automated SDLC, including the next phase, without intermediate approval. Draft publication is permitted only after automated gates; human approval is neither supplied nor claimed. This records the user's authority, not approval or workflow advancement by the requirements specialist.
- The requirements are now baselined for that automated workflow. The former header stating “requirements draft; not approved” and “No later workflow stage is authorized by this document” is superseded as a workflow restriction. Human requirements approval, human acceptance, and human PR approval remain unclaimed.
- Branch guard: before this edit, the delivery repository's `.git\HEAD` was read and contained `ref: refs/heads/story/user-story-2-20261029063822-059b6c6b`, matching the expected branch and run ID. No Git status, current commit/base comparison, or clean-worktree verification was performed in this reconciliation; the earlier gate-evidence entry remains historical, not a fresh cleanliness claim.
- Scope is unchanged: D1's authorization for a new `index.html`, literal `<EPAM>` readable and centered horizontally and vertically in the viewport, a solid full-viewport background, no specified color, and all source exclusions remain in force. FR-01–FR-04, NFR-01–NFR-04, AC-01–AC-06, assumptions, unresolved questions, and source provenance are unchanged.
- `verification.md` was read as existing evidence: it reports technical PASS and a workflow block based on the former requirements status. This reconciliation supersedes that status premise only; the verification record remains unchanged as historical evidence. Tests were not rerun and no new technical or final-acceptance result is asserted.
- No real unresolved scope blocker is identified for this bounded reconciliation. Q-01, Q-03, Q-04, and Q-05 remain recorded gaps, not newly answered requirements or reasons to reinstate the obsolete approval gate.
- Only this `requirements.md` is edited. Existing story work is preserved; no implementation, other artifact edit, commit, push, publication, requirements approval, or workflow advancement is performed by this reconciliation. Subsequent automated gate evaluation and any permitted draft publication remain the orchestrator's responsibility.
