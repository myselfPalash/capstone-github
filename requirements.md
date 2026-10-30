# Requirements: Centered `<EPAM>` Page with Solid Background

## Status and run provenance

- Stage: requirements only; drafted, not approved. No human approval is recorded or implied.
- Run ID: `20261030110659-19a9210a`.
- Delivery repository: `C:\Users\PalashManna\Desktop\capstone-github`.
- Artifact: `C:\Users\PalashManna\Desktop\capstone-github\requirements.md`.
- Run branch: `story/centered-epam-background-20261030110659-19a9210a`.
- Recorded base/current HEAD supplied for this stage: `ec2ffdd3251016341618d148abcb2935417259a1`.
- Pre-write check: the parent orchestrator reports directly checking branch, HEAD, and working-tree status immediately before this stage; expected branch and HEAD matched, and the checkout was clean. This specialist accepts that stage check and did not independently execute Git commands.
- Existing artifact check: reading the target returned “does not exist”; this is a new artifact, not a replacement of existing material.
- Intake method: supplied TXT files read directly and line numbers confirmed using local content search. The document-extractor skill was unavailable; no external fetch, Jira query, or Confluence query was performed.
- Workflow references read: `C:\Users\PalashManna\Desktop\Copilot-capston\docs\sdlc-workflow.mmd` and `C:\Users\PalashManna\Desktop\Copilot-capston\.github\instructions\delivery-artifacts.instructions.md`.
- No implementation, browser tests, HTML validation, approval, or stage advancement is claimed by this document.

## Sources and traceability

Only these two jointly requested stories define product scope:

| Key | Exact source |
| --- | --- |
| S1 | `C:\Users\PalashManna\Desktop\Copilot-capston\input\user-story.txt` |
| S2 | `C:\Users\PalashManna\Desktop\Copilot-capston\input\user-story-2.txt` |

References below use one-based source line numbers, including blank lines. Workflow references govern artifact handling, not additional product features.

## Source summary and confirmed facts

The visitor opens a simple HTML page and immediately sees the exact visible text `<EPAM>`, centered horizontally and vertically. The layout must retain centering when resized and on mobile, without extra visible content. The second story adds a solid, full-viewport background while retaining text readability and centering.

- Exact visible content includes angle brackets; the source must escape it as `&lt;EPAM&gt;` (S1:10,14).
- Centering, resizing, mobile visibility, and no horizontal scrolling are explicit (S1:11–13,17).
- The text must be readable at a glance and contrast with its background; “at least 48px” is an example, not a mandated minimum (S1:15).
- Current Chrome, Firefox, Safari, and Edge are named targets (S1:16).
- The background must be solid, cover the whole viewport, preserve readability, and not change centering (S2:10–12).
- Completion includes opening the HTML in a browser, manual desktop/mobile acceptance checks, and no console or HTML-validator errors (S1:29–31; S2:21).

## Functional requirements

| ID | Requirement | Source |
| --- | --- | --- |
| FR-01 | Provide a simple HTML page that displays the exact text `<EPAM>` when opened in a browser, visible upon page load. | S1:6,10,29 |
| FR-02 | Encode the visible label in the HTML source as `&lt;EPAM&gt;`, so angle brackets are characters, not an HTML tag. | S1:14 |
| FR-03 | Center the label horizontally and vertically within the browser viewport and preserve centering when the window is resized. | S1:11–13 |
| FR-04 | Apply a solid background color across the entire viewport without changing the centered layout. | S2:10,12 |
| FR-05 | Show no other visible text, images, or navigation. | S1:18 |

## Non-functional requirements

| ID | Requirement | Source |
| --- | --- | --- |
| NFR-01 | Keep the label large enough to read at a glance, with sufficient contrast against the selected background. No exact font size or quantitative contrast threshold is specified. | S1:15; S2:11,21 |
| NFR-02 | On small screens, retain centering and full label visibility without horizontal scrolling. Retain the full-viewport layout across window resizing. The minimum feasible supported viewport is unresolved (Q-03). | S1:13,17 |
| NFR-03 | Render consistently in current versions of Chrome, Firefox, Safari, and Edge. Exact versions and acceptable rendering tolerances are unresolved (Q-04). | S1:16 |
| NFR-04 | Opening and rendering the page must produce no console errors and no HTML-validator errors. | S1:31 |
| NFR-05 | Completion evidence must include manual verification of acceptance criteria at desktop and mobile sizes. This requirement does not assert that verification has already occurred. | S1:30 |

## Acceptance criteria and planned evidence

These are verification obligations, not executed results. Shared criteria apply to the combined page, including its background.

| ID | Acceptance condition | Planned evidence | Traceability |
| --- | --- | --- | --- |
| AC-01 | Opening the HTML in a browser shows exactly `<EPAM>` as visible text, including both angle brackets, with no other visible text, images, or navigation. | Inspect the rendered page; inspect source to confirm `&lt;EPAM&gt;` rather than an interpreted custom tag. | FR-01, FR-02, FR-05; S1:10,14,18,29 |
| AC-02 | The label is centered on both viewport axes at initial load and remains centered after resizing and after the background is applied. | Manual desktop/mobile checks and resize observations; record actual viewport sizes and any measurement method/tolerance used. | FR-03, FR-04; S1:11–13,30; S2:12 |
| AC-03 | A uniform solid background covers the complete viewport at the checked sizes, without uncovered areas or gradients. | Inspect the rendered viewport at recorded desktop/mobile sizes. | FR-04; S2:10,16,21 |
| AC-04 | The label is readable at a glance and clearly distinguishable from the background. | Record chosen text/background colors and font size; inspect readability. Any adopted numeric contrast target must be labeled as a design choice, not a source requirement. | NFR-01; S1:15; S2:11,21 |
| AC-05 | At checked mobile sizes, the complete label stays visible and centered without horizontal scrolling. | Manual checks recording viewport dimensions and horizontal-overflow observations; explicitly report limits rather than claiming all possible sizes. | NFR-02; S1:13,17,30 |
| AC-06 | The page provides consistent content, centering, background coverage, and readability in current Chrome, Firefox, Safari, and Edge. | Record browser versions, platforms, and actual checks; disclose unavailable browsers or unverified combinations. | NFR-03; S1:16 |
| AC-07 | The page produces no console errors and no HTML-validator errors. | Record console inspection and the validator/tool version, input, and actual result. | NFR-04; S1:31 |

## Run-specific verification variance — 2026-10-30

- **Decision (2026-10-30T17:07:46.787+05:30):** The user stated, “no need to test on firefox and safari. i checje all the tests . go for the next phase”. For this run only, this is treated as an explicit waiver of the Firefox and Safari acceptance checks.
- **Revised verification scope:** Check the browser behavior in current Chrome and Edge. Keep the existing desktop/mobile manual-verification scope in force; any already-collected desktop/mobile evidence may be referenced if its scope and results are documented. This amendment itself supplies no test evidence.
- **Source preserved:** S1:16 remains unchanged and continues to name current Chrome, Firefox, Safari, and Edge as the source criterion. This run-specific variance changes the verification obligation for Firefox and Safari only; it does not establish their behavior or imply that either browser was tested.
- **AC-06 disposition for this run:** The planned evidence in the AC-06 row above is narrowed to current Chrome and Edge, together with the desktop/mobile evidence required by S1:30. Record actual browser versions, platforms, viewport coverage, and results when verification is performed. Firefox and Safari results must be reported as waived/not tested, not passed.
- **No implied result or authorization:** The user’s statement is a scope decision, not evidence that tests ran or passed, and is not human approval of other SDLC stages. All other acceptance criteria and verification obligations are unchanged. This variance does not approve the requirements, claim that any final gate passed, or authorize merger or publication.

## Assumptions and proposed interpretations — not confirmed user facts

- A-01: The stories describe one combined page; the background story extends rather than replaces the centered-label story. Basis: S2:6,12. This is the working interpretation of the jointly requested scope.
- A-02: Implementation may select a readable text/background palette because none is supplied. No specific brand palette, color value, or non-white background is confirmed.
- A-03: A font size around 48px may be a starting design choice, subject to readability and small-screen fit. S1:15 gives an example, not a mandatory 48px floor.
- A-04: Browser consistency is interpreted as equivalent required appearance and behavior, not pixel-identical font rasterization. Exact tolerances remain unresolved.
- A-05: No framework, hosting platform, repository layout, or delivery filename for the HTML is prescribed by the stories. Choosing these later must not be presented as a user requirement.

## Unresolved questions

These are recorded gaps, not requests for interactive approval.

| ID | Gap | Impact / disposition |
| --- | --- | --- |
| Q-01 | Which exact background/text colors, font family, and final font size are intended? | Visual choices remain open; any later selection must be documented as a design decision under A-02/A-03. |
| Q-02 | Is a quantitative contrast/accessibility target required? | Only qualitative readability is confirmed. Do not silently add a specific contrast ratio or conformance level. |
| Q-03 | What minimum viewport dimensions, zoom/text-scaling conditions, and mobile viewport behavior define the supported range? | “Any window size” has no stated lower bound; a readable nonempty label cannot fit every arbitrarily small viewport. Verification must record checked sizes and limitations. |
| Q-04 | Which exact browser versions/platforms constitute “current,” and what centering/rendering tolerance is acceptable? | Record versions and evaluation method when verification occurs; do not claim universal browser coverage. |
| Q-05 | Which HTML validator and validation configuration should be used? | Select and document the actual validator during verification; no result is currently available. |
| Q-06 | Which desktop/mobile sizes and manual evidence format satisfy completion? | S1 explicitly requires manual checks but does not define a test matrix. Missing manual evidence must be disclosed rather than replaced silently by automation. |

## Out of scope

- Animations and transitions (S1:22), including animated backgrounds (S2:16).
- Links, buttons, and interactive elements (S1:23).
- Multiple pages and routing (S1:24).
- Localization (S1:25).
- Gradients and background images (S2:16).
- Multiple themes and user-selectable colors (S2:17).
- Additional visible content, images, and navigation are prohibited by FR-05 (S1:18).
- No additional stories, features, branding assets, or integrations are introduced by this artifact.

## Stage outcome and limitations

- Requirements draft covers both supplied stories with source-line traceability.
- Blockers to drafting: none. Source files were readable and essential combined scope is sufficiently clear.
- The document-extractor skill was unavailable; direct TXT intake was used as instructed. No external extraction was needed.
- Open visual and verification details remain explicitly unresolved; they have not been fabricated into confirmed requirements.
- Verification status: only source/reference reads, source-line confirmation, and the target nonexistence check were performed by this specialist; Git pre-write verification was supplied by the parent. No product acceptance criterion has been tested here.
- Approval status: no human approval; no automated approval asserted. This stage does not authorize or perform progression to another stage.
