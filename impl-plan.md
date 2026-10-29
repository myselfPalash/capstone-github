# Implementation Plan: Centered EPAM Heading Page

**Status:** Implementation and available automated validation complete; manual desktop/mobile and Firefox/Safari checks waived for this run only  
**Story/source:** `C:\Users\PalashManna\Desktop\Copilot-capston\input\user-story.txt`  
**Requirements:** `C:\Users\PalashManna\Desktop\capstone-github\requirements.md`  
**Architecture:** `C:\Users\PalashManna\Desktop\capstone-github\architecture.md`  
**Design review:** `C:\Users\PalashManna\Desktop\capstone-github\design-review.md` — round 2/3 PASS; no unresolved blocking or high-severity design findings  
**Delivery repository:** `C:\Users\PalashManna\Desktop\capstone-github`  
**Expected branch:** `story/centered-epam-heading-page-20261029054026-83cadfb4`  
**Base SHA:** `ec2ffdd3251016341618d148abcb2935417259a1`  
**Run ID:** `20261029054026-83cadfb4`

## Repository and readiness check

- Before writing this plan, `.git/HEAD` was read and points to `refs/heads/story/centered-epam-heading-page-20261029054026-83cadfb4`; that branch ref contains the stated base SHA.
- `requirements.md` and `architecture.md` are present. The design review exists and its second round passes.
- The repository root contains `.git`, `README.md`, `requirements.md`, `architecture.md`, and `design-review.md`. `README.md` contains only the repository title. No existing app/source tree or implementation plan was present.
- `verification.md` and `pr-draft.md` were not present in the repository listing. They are not needed to plan implementation and are not changed by this plan.
- This plan was originally prepared before implementation. Current task completion and verification states are recorded above; no human approval is claimed.

## Planning assumptions and constraints

- **A-01 — Display-text interpretation:** Implement the specific acceptance criteria and Definition of Done as `&lt;EPAM&gt;` in HTML source, rendered as visible `<EPAM>`. The story narrative says “EPAM”; this discrepancy remains unresolved and is not treated as human-resolved.
- **A-02 — Document location/name:** Place the standalone document at the repository root as proposed by the approved architecture. Use `index.html` as a conventional entry filename because no filename or repository convention is specified. This is a planning choice, not a confirmed requirement.
- **A-03 — Visual choices:** Choose and record practical font and foreground/background values during implementation; ensure readable, high-contrast presentation without implying a source-defined exact font, color, minimum size, or numeric contrast threshold.
- **A-04 — Browser coverage:** Interpret “current” as the current browser versions available for the checks and record browser/version and viewport dimensions. The source does not define a version floor.
- **Scope constraint:** One static HTML document with embedded standard CSS only; no framework, build process, package/dependency, JavaScript, external asset, or added visible content.

## Prioritized dependency-ordered tasks

| Priority | Stable task ID | Planned task and verifiable outcome | Dependencies | Status | Blocked reason |
|---|---|---|---|---|---|
| P1 | IMP-001 | Add the proposed root `index.html` as a standards-based standalone document. Include document metadata and a device-width/initial-scale viewport declaration. Its sole visible content is one semantic heading whose source text is exactly `&lt;EPAM&gt;`; add no other visible text, image, navigation, or control. Verify the source and rendered content against FR-01, FR-02, FR-05 / AC-01 and AC-07. | None | Implemented; source/render checks recorded in `verification.md`. | Filename selected as planned (A-02). |
| P1 | IMP-002 | Add embedded CSS to the document: remove default page margins, use a viewport-height fallback (`100vh` followed by `100dvh`), center the heading on both axes, and apply bounded responsive sizing and width constraints consistent with the architecture (`clamp(1rem, 10vw, 3rem)`, `max-inline-size: 100%`, centered text, and wrapping rather than clipping). Choose readable, high-contrast colors and verify the full text can fit narrow viewports without hiding overflow. | IMP-001 | Implemented; source/render checks recorded in `verification.md`. | Exact visual values selected as planned under A-03. |
| P2 | IMP-003 | Perform source-level checks and HTML validation on the completed document. Confirm valid document structure, viewport metadata, exact escaped text source, one visible heading and no extra visible content; resolve any validator errors. Record the validator/result; do not add validation tooling or dependencies to the product. | IMP-001, IMP-002 | Complete; Nu HTML Checker validation and source checks PASS (see `verification.md`). | None for the available validation. |
| P2 | IMP-004 | Manually verify the page in current Chrome, Firefox, Safari, and Edge where available, recording actual versions and viewport dimensions. At desktop and mobile/narrow sizes (including 320 CSS px as the architecture’s repeatable test point), check visible text, centering, legibility, resize behavior, mobile visible-area behavior where testable, no horizontal scrollbar, and `document.documentElement.scrollWidth <= document.documentElement.clientWidth`. Inspect the console and record outcomes. Fix defects within this story’s approved static-page scope, then repeat affected checks. | IMP-003 | Available automated viewport/browser coverage complete; manual desktop/mobile and Firefox/Safari product checks explicitly waived for this run and NOT performed. | Waiver applies only to run `20261029054026-83cadfb4`; original full manual/cross-browser DoD remains unproven. |

Task IDs are stable references for this story. Statuses reflect recorded implementation and verification evidence, not planning alone. IMP-004 is limited to the automated coverage actually run; its manual and Firefox/Safari portions remain unperformed under the explicit run-specific user waiver.

## Acceptance and completion evidence to record

Completion evidence is recorded in `verification.md`: source path/hash, Nu validation, actual browser products/versions, sampled viewport measurements, resize/overflow/console results, plus the test-command limitation. Manual desktop/mobile and Firefox/Safari checks remain unproven and are waived only for this run; the full original DoD is not claimed complete.

## Unresolved details and blockers

- **No current planning blocker:** The passed architecture review supports beginning the scoped implementation.
- **Open scope question:** The story narrative says “EPAM,” while its acceptance criteria and Definition of Done require the literal `<EPAM>`. This plan follows the more specific AC/DoD interpretation per requirements assumption A-01; it does not resolve the source discrepancy.
- Browser version targets, definition of “small screens,” exact visual tokens/contrast threshold, and the precise meaning of “same way” across browsers remain unspecified in the source. The architecture and requirements retain these as open details; use and record reasonable verification choices without elevating them into new requirements.
- **Conditional verification limitation:** If one or more requested browser families are unavailable, the corresponding cross-browser acceptance criterion remains unverified; record the limitation rather than claiming completion.

## Change boundary

This planning activity creates only `impl-plan.md`. It does not modify `requirements.md`, `architecture.md`, `design-review.md`, `verification.md`, `pr-draft.md`, or implementation files.
