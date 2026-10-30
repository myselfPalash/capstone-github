# Implementation Plan: Centered `<EPAM>` Page with Solid Background

## Status and provenance

- Stage: implementation planning for run `20261030110659-19a9210a`.
- Delivery repository: `C:\Users\PalashManna\Desktop\capstone-github`.
- Expected branch: `story/centered-epam-background-20261030110659-19a9210a`.
- Recorded base: `ec2ffdd3251016341618d148abcb2935417259a1`.
- The parent orchestrator supplied the preflight that the expected branch and base were checked and the checkout was clean. This planner did not independently run Git commands.
- Prerequisite artifacts confirmed at the delivery root: `requirements.md`, `architecture.md`, and `design-review.md`.
- Design gate: `design-review.md` records **AUTOMATED PASS — round 1**, with no unresolved blocking or high-severity findings. Its non-blocking DR-1 and DR-2 follow-through is included below.
- The delivery layout observed for planning contains `.git`, `README.md`, `requirements.md`, `architecture.md`, and `design-review.md`; no application files, `verification.md`, `impl-plan.md`, or `pr-draft.md` existed at inspection time. The plan is therefore newly drafted, not a revision of existing plan material.
- Only the supplied stories `C:\Users\PalashManna\Desktop\Copilot-capston\input\user-story.txt` (S1) and `C:\Users\PalashManna\Desktop\Copilot-capston\input\user-story-2.txt` (S2) define product scope.
- No implementation, tests, browser checks, HTML validation, or human approval occurred in this planning stage.

## Scope and implementation assumptions

Deliver one minimal static page at the repository root, combining S1's escaped, centered `<EPAM>` label with S2's solid full-viewport background. Preserve all requirements in `requirements.md` and the minimal architecture in `architecture.md`; do not add a nested project, framework, build pipeline, script, external resource, or unrelated visible content.

The following ordinary implementation choices are resolved for planning, and are **assumptions/design choices, not user-specified requirements**:

- **A-PLAN-01 — Location:** use root `index.html`, as proposed by the architecture.
- **A-PLAN-02 — Styling:** keep the small stylesheet inline for a self-contained static document.
- **A-PLAN-03 — Visual style:** start with a dark neutral solid background (`#1f2937`), white text (`#ffffff`), a system sans-serif stack, bold weight, and `clamp(3rem, 8vw, 4rem)` text sizing. These are replaceable design choices, not an asserted EPAM brand palette or a user-mandated contrast ratio/font size.
- **A-PLAN-04 — Viewport sizing:** include `width=device-width, initial-scale=1`; use `100vh` as a fallback and `100dvh` as progressive enhancement, with zero default body margin. Center via one native CSS layout mechanism (Grid is the planned choice). Do not clip content to force centering.
- **A-PLAN-05 — Test strategy:** this is a no-runtime-logic static document. Run an HTML validator as the executable structural test and supplement it with source inspection; do not add a test framework or claim those checks prove visual behavior. Required manual browser and device checks remain separate.

No human clarification is needed to proceed with these bounded choices. Requirements questions Q-01–Q-06 remain limitations for evidence and coverage: visual choices are selected above; no minimum supported viewport, exact browser-version matrix, centering tolerance, validator mandate, or manual evidence format was specified. Verification must state what was actually tested and must not imply universal coverage.

## Prioritized dependency-ordered tasks

Task descriptions originated at planning time; the per-task statuses and evidence below reflect subsequent execution. This is not a claim of human approval.

### IP-01 — Implement the single static page

- **Priority:** P1 — prerequisite deliverable.
- **Owner/delegation boundary:** one Implementation Agent delegation for this task only.
- **Dependencies:** none.
- **Status:** IMPLEMENTED - source inspection passed; no browser or validator results claimed.
- **Evidence:** Created delivery-root `index.html`. A source assertion and Python `HTMLParser` inspection passed for the escaped label (decoded as the sole visible `main` text), viewport metadata, `100vh` fallback plus `100dvh`, planned centering/colors/typography, and absence of scripts or linked/image assets. This was not an HTML validation or visual/browser test.
- **Blocked reason:** none for IP-01; HTML validation and manual browser/device checks remain for IP-02/IP-03.
- **Scope:** create root `index.html` in the delivery repository. Include valid document metadata and a mobile viewport declaration; render exactly one visible label whose source is `&lt;EPAM&gt;`; use the planned inline CSS, solid background, contrasting text, zero body margin, and responsive two-axis viewport centering with the fallback/progressive-enhancement sizing in A-PLAN-04. Do not add other visible content, JavaScript, external assets, or a nested application.
- **Verifiable completion criteria:**
  1. The source contains the escaped `&lt;EPAM&gt;` label and only the intended visible page content.
  2. The document includes the viewport metadata and the agreed viewport-height fallback/progressive enhancement.
  3. The CSS applies one solid background, readable text styling, and a single centering layout without fixed-position coordinates or clipping.
  4. Changes are limited to the planned root-level static page; no implementation or test result is claimed until actually checked.
- **Traceability:** S1 AC for exact text, escaping, centering, resizing, mobile fit, and no extra content; S2 AC for solid background/readability/no layout change; requirements FR-01–FR-05 and NFR-01–NFR-03; architecture components and DR-1.

### IP-02 — Run structural/source checks and record results

- **Priority:** P2 — required before final acceptance evidence.
- **Owner/delegation boundary:** one verification delegation focused on executable/structural checks and their report; do not combine this task with unperformed manual claims.
- **Dependencies:** IP-01.
- **Status:** COMPLETE — source checks passed and pinned HTML validation passed with one documented standards-focused rule override. This completes IP-02 only; manual/browser acceptance remains IP-03.
- **Blocked reason:** Resolved. The earlier attempt through `npm` failed because PowerShell selected `npm.ps1`; the follow-up used the native `npm.cmd` launcher without permission or execution-policy changes. See `verification.md` for the retained failure evidence and successful retry.
- **Evidence:** The earlier local Python `HTMLParser`/source assertions against delivery-root `index.html` passed all seven checks (HTML doctype, single escaped label, decoded visible text, one `main`, viewport metadata, no script/resource elements or resource attributes, and no CSS imports/URL resources). Then `html-validate@9.7.1` ran against the absolute delivery `index.html`. The default recommended preset reported only `doctype-style`, which enforces uppercase casing even though HTML doctype keywords are ASCII-case-insensitive; the run was repeated with only `doctype-style` disabled, retaining the recommended conformance checks, and completed with exit code 0, zero errors, and zero warnings. No implementation file was changed. These checks are not visual/browser evidence. See `verification.md` for commands, output, rationale, and limitations.
- **Scope:** validate the delivered root `index.html` with an HTML validator and inspect the source for the escaped label, single intended visible content, viewport metadata, and absence of unnecessary external/runtime dependencies. Create or update delivery-root `verification.md` with the actual input, tool/version/configuration, command or method, and results.
- **Verifiable completion criteria:**
  1. The validator was actually run against the delivered file and reports zero HTML validation errors for a passing result; record warnings separately.
  2. Source assertions/inspection are recorded as source checks only, not as evidence of centering, readability, browser rendering, or mobile behavior.
  3. `verification.md` distinguishes executed checks from pending manual checks and reports failures and limitations honestly.
- **Traceability:** requirements NFR-04 and AC-01/AC-07; S1 definition of done; design-review DR-2.

### IP-03 — Perform manual browser acceptance checks and complete evidence

- **Priority:** P2 — required to claim the story's visual/browser completion.
- **Owner/delegation boundary:** one verification delegation focused on manual browser/device behavior and final evidence; retain IP-02's source/validator results without conflating them with visual tests.
- **Dependencies:** IP-01 and IP-02.
- **Status:** COMPLETE — current-run final verification PASS with the dated Firefox/Safari-only waiver. No human acceptance is claimed.
- **Blocker:** None within the revised run-specific scope. Firefox and Safari remain explicitly waived/not tested, not passed. No other requirement is waived.
- **Final verification evidence:** Final re-evaluation reran the offline pinned html-validate 9.7.1 check (only doctype-style disabled; zero errors/warnings), all nine source assertions, and actual Chrome 156.0.8078.48 / Edge 156.0.4314.50 headless integration checks on Windows. Both browsers passed exact visible text, one main, desktop 1280×720 and mobile-sized 375×812 initial/resize centering and fit, solid computed background, no horizontal overflow, responsive font sizing, and zero console/page errors. Assistant-performed integrated-browser visual inspections at both sizes were relayed by the requester and are credited as such; this verifier did not inspect the screenshots. `index.html` SHA-256 remained `e90015b222c68314260fa9189845aa3ebb693a9a1561d6338bd6a1acbca98444`; no implementation edit occurred. See the final record in `verification.md` for exact commands, limitations, and the explicit waiver boundary. No PR draft/publication occurred.
- **Evidence:** The earlier requester-relayed report at `2026-10-30T16:53:03.852+05:30` included integrated-browser snapshot/screenshot description, automated geometry at `1280×720` and `375×812` (including earlier mobile offset `0.161` CSS px), and mobile reload evidence. A subsequent report at `2026-10-30T17:04:17.518+05:30` explicitly identifies the performer as an assistant and reports visual inspection/screenshots at both sizes, plus a later automated mobile offset of `0.094` CSS px, desktop center approximately zero, dark background, exact text/title, and no overflow. These measurements are distinct phases; the later value does not replace the earlier one. This verifier did not independently run or inspect either report. No engine/version is inferred for the integrated-browser reports. At the time of that earlier evidence update, Firefox/Safari were recorded as the remaining browser blocker; the dated, run-specific waiver and final re-evaluation below supersede that blocker for this run, without treating either browser as tested or passed. That earlier update changed evidence/status wording only and preceded the final test rerun below.
- **Scope (as amended for this run):** verify behavior in current Chrome and Edge, recording actual versions and tested scope. Firefox and Safari checks are explicitly waived for this run only; preserve S1:16 and report them as waived/not tested, not passed. Separately cover the source-required desktop/mobile visual acceptance using the assistant-performed integrated-browser evidence relayed for both sizes. No fixed browser-by-viewport matrix, one screenshot per size, or physical-device requirement is added.
- **Verifiable completion criteria:**
  1. Record tested browser/version/platform and actual viewport context. If device/emulation information is available, state it; the stories do not require physical-device coverage.
  2. Record actual observations for initial layout, resize behavior, background coverage, readability, horizontal overflow, and console errors.
  3. Record the centering/readability assessment method and any tolerance as a project evaluation choice, not a source requirement.
  4. Explicitly list unavailable or untested browsers/sizes and limitations. Keep browser-target evidence distinct from the explicitly manual desktop/mobile DoD; static checks do not substitute for that DoD, and no universal “any size” claim is made beyond checked bounds.
- **Traceability:** requirements AC-01–AC-07 and NFR-01–NFR-05; S1/S2 definitions of done; design-review DR-1 and DR-2.

## Dependency summary

```text
IP-01 (static page)
  └── IP-02 (validator and source evidence)
        └── IP-03 (manual browser/device acceptance and final evidence)
```

The order deliberately keeps manual and visual checks distinct from executable validation. If a browser/device or validator is unavailable, report the actual blocker/coverage gap in `verification.md`; do not mark the corresponding criterion as passed or ask for approval to proceed with available work.

## Completion boundary

This plan records the completed implementation and verification tasks for this run; it does not prepare a PR draft, claim human acceptance, or authorize publication. IP-01 through IP-03 are complete within the revised scope. Firefox and Safari remain explicitly waived/not tested, not passed. The checked viewport range is 1280×720 and 375×812; no universal viewport or physical-device coverage is claimed.
