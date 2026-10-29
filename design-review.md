# Design Review: Centered EPAM Heading Page

**Review round:** 1 of at most 3  
**Decision:** REVISE — not approved to proceed on the current design  
**Story/source:** `C:\Users\PalashManna\Desktop\Copilot-capston\input\user-story.txt`  
**Delivery repository:** `C:\Users\PalashManna\Desktop\capstone-github`  
**Expected branch:** `story/centered-epam-heading-page-20261029054026-83cadfb4`  
**Run ID:** `20261029054026-83cadfb4`  
**Branch verification before writing:** `.git/HEAD` identifies the expected branch; its branch ref contains base SHA `ec2ffdd3251016341618d148abcb2935417259a1`.

## Review scope and outcome

Reviewed `requirements.md` and `architecture.md` against the current story, including acceptance criteria and Definition of Done. This is a design-only review; no implementation or human approval is claimed.

The proposed static HTML document with embedded CSS is appropriately simple, fits the repository (which has no existing application framework or build system), and avoids unnecessary runtime dependencies. The described encoded text node, semantic heading, CSS centering, trust boundaries, failure behavior, and manual verification approach generally map to the requirements. The design is understandable and testable, and its treatment of the story/AC text discrepancy and unspecified browser/visual details is appropriately explicit.

One high-severity mobile-layout gap remains. Therefore the design does not pass this round. The architect should address the finding below in `architecture.md`; this review does not modify that file.

## Prioritized findings

### DR-01 — High: Mobile viewport behavior is not sufficiently specified

**Traceability:** Requirements FR-04, NFR-03; AC-06 and AC-08.  
**Evidence:** The architecture calls for a viewport-height layout, responsive type, and small-screen visibility, but does not explicitly require a mobile viewport declaration or otherwise state how the CSS viewport is made to match the device viewport. “Use a viewport-height fallback appropriate to the target browser families” and “a size that accommodates narrow viewports” leave essential mobile layout behavior to implementation interpretation.

**Risk:** On mobile browsers, absent or incorrect viewport configuration can cause layout and sizing to use a wider layout viewport than the device viewport. The heading may consequently be scaled or positioned/sized unexpectedly, undermining readability, actual viewport centering, and the no-horizontal-scroll requirement. The architecture does not currently make this behavior or its prevention testable as a design constraint.

**Required mitigation / recommended architecture revision:** Specify that the HTML document declares a device-width viewport (with an appropriate initial scale), and define the layout contract: the page’s centering area tracks the visible viewport; default page margins are removed; the heading’s inline size is constrained/responsive so the full literal text stays visible without horizontal overflow. State the viewport-height strategy/fallback for the supported browser families without adding JavaScript or dependencies. Add explicit mobile checks to the verification approach: test representative narrow viewport dimensions, confirm actual visual centering and legibility, and verify `scrollWidth` does not exceed `clientWidth` (or an equivalent observable no-horizontal-scroll check). Keep exact breakpoint and typography/color decisions open unless requirements are clarified.

**Status:** Unresolved; requires architecture revision and review.

## Other assessment areas

- **Completeness and component boundaries:** Single HTML document, embedded CSS, browser renderer, and manual verification have clear, minimal responsibilities. No service, persistence, framework, or additional component is warranted.
- **Text and content constraints:** Character-reference encoding for `&lt;EPAM&gt;`, one semantic heading, and no other visible content directly address AC-01 and AC-07. The narrative/AC discrepancy is documented rather than silently resolved.
- **Centering and resize behavior:** CSS-driven horizontal/vertical centering and resize reflow are sensible, but the mobile viewport issue in DR-01 prevents confirming the all-size layout contract.
- **Accessibility and readability:** Semantic heading and readable, high-contrast type are appropriate. The source does not set a font-size minimum or numerical contrast threshold; the architecture correctly avoids inventing these, though verification should record the selected values and assess contrast/readability.
- **Security and trust boundaries:** Static authored content, escaped brackets, and no scripts, external resources, user input, or dynamic insertion keep the attack surface minimal. No material security design issue identified.
- **Failure behavior and reliability:** The page has no external service or stateful runtime dependency; styling failure and document/validation failure are identified. The proposed static design has no need for recovery machinery.
- **Testability and DoD:** Manual cross-browser, desktop/mobile, resize, console, and HTML validation checks are appropriate to the stated DoD. Record browser versions and viewport sizes when executed. These checks have not been performed in this review.
- **Scope and repository fit:** Root-level standalone HTML with embedded CSS is proportionate and avoids unjustified tooling. The filename/location remains a documented open requirement, not a blocking design concern at this stage.
- **Known requirement ambiguity:** “Current” browser versions, small-screen dimensions, exact visual tokens/contrast threshold, and the “EPAM” versus “<EPAM>” wording discrepancy remain open. The architecture records these and adopts the more specific AC/DoD interpretation; do not treat that assumption as human resolution.

## Decision and next step

**Decision: REVISE.** DR-01 is high severity and unresolved, so this round is a fail. Revise the architecture to make mobile viewport sizing, responsive fit, and corresponding no-overflow checks explicit, then request the next design-review round. Do not treat this as approval or as evidence that the implementation passes the acceptance criteria.

**Review-round count:** 1 of 3 maximum. No prior `design-review.md` existed at the target path before this review, so there was no prior review material or decision to overwrite.

## Limitations

This was a static document review only. No code was changed, and no browser/device execution, HTML validation, console inspection, accessibility tooling, or manual visual verification was performed. This automated review is not human approval.

---

## Review round 2

**Review round:** 2 of at most 3  
**Decision:** PASS — no unresolved blocking or high-severity design findings; planning may begin  
**Story/source:** `C:\Users\PalashManna\Desktop\Copilot-capston\input\user-story.txt`  
**Delivery repository:** `C:\Users\PalashManna\Desktop\capstone-github`  
**Expected branch:** `story/centered-epam-heading-page-20261029054026-83cadfb4`  
**Run ID:** `20261029054026-83cadfb4`  
**Base SHA:** `ec2ffdd3251016341618d148abcb2935417259a1`  
**Branch verification before writing:** `.git/HEAD` identifies the expected branch; its branch ref contains the stated base SHA.

### Scope and prior finding disposition

Reviewed the revised `architecture.md` against `requirements.md` and the story source, with particular attention to round-1 finding DR-01. The revision resolves DR-01 at the architecture-design level. This is a static automated review; it does not assert implementation or test completion, and it is not human approval.

**DR-01 (round 1, High — mobile viewport behavior): Resolved.** The architecture now explicitly specifies a device-width, initial-scale viewport declaration; zero default page margins; viewport-based centering with a `100vh` fallback followed by `100dvh`; and a bounded, responsive heading with wrapping rather than clipping. It explicitly prohibits masking overflow and calls for checking that `scrollWidth <= clientWidth` at recorded desktop and narrow/mobile viewport sizes, including 320 CSS px, while visually checking centering, visibility, and browser-chrome changes. These statements make mobile layout intent and its verification observable. The disclosed legacy `100vh` limitation is bounded to browsers lacking dynamic viewport units and is not an unresolved blocker for the stated current-browser target.

### Prioritized findings

No unresolved blocking or high-severity design findings.

**Informational / non-blocking open requirements:** The source still does not define browser version floors, a small-screen boundary, exact visual tokens or numeric contrast threshold, the HTML filename/location, or pixel-identical versus behaviorally consistent browser rendering; it also contains the documented “EPAM” versus `<EPAM>` wording discrepancy. The architecture preserves these as explicit unknowns and adopts the requirements’ more specific AC/DoD display text without claiming that a human resolved the discrepancy. These open points do not prevent planning the minimal static-page design; chosen values and test environments should be recorded during implementation/verification without representing them as source-mandated requirements.

### Assessment

- **Completeness and boundaries:** A single standalone HTML document, embedded CSS, browser renderer, and manual verification responsibility remain appropriately minimal. No application services, framework, dependencies, storage, network calls, or interactive components are warranted.
- **Acceptance criteria and DoD:** The encoded text node, sole semantic heading, dual-axis viewport centering, resize behavior, mobile fit, no-extra-content constraint, readability/contrast check, cross-browser checks, console inspection, and HTML validation are all mapped to design decisions or a validation plan. AC-08 is planned for later verification, not claimed as already satisfied by execution.
- **Mobile visibility, centering, and overflow:** The viewport declaration and explicit CSS layout/fit contracts address the prior gap. The architecture requires full text visibility, responsive sizing, and wrapping instead of clipping; its no-horizontal-overflow check is measurable.
- **Security and trust boundaries:** Fixed authored content, escaped brackets, and no scripts, external resources, user input, or dynamic insertion keep the design attack surface minimal. No material security issue identified.
- **Failure behavior and reliability:** The static document has no remote or stateful dependency. Styling/document failures and the legacy viewport fallback limitation are described without proposing unjustified recovery machinery.
- **Testability and scope:** The validation plan specifies viewports, recorded dimensions/browser versions, resizing and mobile browser-chrome checks, a horizontal overflow measurement, console inspection, and HTML validation. It does not claim these checks have run. The architecture remains proportionate to the story.

### Decision and next step

**Decision: PASS.** Round-1 DR-01 is resolved in the revised design. There are no unresolved blocking or high-severity design findings, so planning may begin. This pass approves the architecture for progression only; it is not human approval and is not evidence that an implementation has passed acceptance testing.

**Cumulative review-round count:** 2 of 3 maximum. Prior round-1 findings and decision above are preserved. No architecture or implementation changes were made as part of this review.

### Round-2 limitations

No implementation was reviewed or modified. No browser/device execution, manual visual check, console inspection, HTML validation, or accessibility tooling was performed. Requirements remain draft and the listed ambiguities remain open. This automated review is not human approval.
