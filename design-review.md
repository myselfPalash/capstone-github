# Design Review — Add Background Color to Page

## Review metadata

- Review round: **1 of at most 3**
- Run ID / expected branch: `story/user-story-2-20261029063822-059b6c6b`
- Delivery repository: `C:\Users\PalashManna\Desktop\capstone-github`
- Requirements reviewed: `requirements.md` (draft, not approved)
- Architecture reviewed: `architecture.md` (draft, not approved)
- Review date: 2026-10-29
- Outcome: **BLOCKED — do not advance to implementation planning**
- Pass/fail: **FAIL (no design pass)**

This is the first review artifact; no prior review decisions were present to revise. The orchestrator's report of a successful branch gate, matching expected branch, clean checkout, and no active Git operations was consumed as evidence; this reviewer did not run Git or independently verify that evidence. No human approval is claimed.

## Review scope and evidence

Reviewed the story source, requirements, architecture, and delivery-repository contents. The available project content is a minimal `README.md` (`# capstone-github`); no page/application files, framework, build, route, or hosting convention were available. The architecture explicitly presents static HTML/CSS as a conditional proposal, acknowledges the missing target and centered baseline, and does not claim AC-03 is satisfied.

Assessment covered requirements completeness and traceability, component boundaries, rendering/data flow, security/trust boundaries, failure behavior, reliability, accessibility/readability, testability, and scope. No implementation or plan was changed.

## Prioritized findings

### DR-01 — BLOCKING: no authorized target or centered baseline for the required change

- **Evidence:** Requirements Q-02 and Q-05 state that the target page, existing centered `<EPAM>` baseline, centering axes/tolerance, and technology/hosting conventions are unknown. Requirements also state that page scaffolding is not established by the source and must not be silently authorized. The repository has no page beyond its minimal README. Architecture Q-02/Q-05 and its limitations correctly leave AC-03 blocked.
- **Impact:** The design cannot identify where the background change belongs or demonstrate the mandatory “no layout changes” condition against an existing baseline. Creating a new static page would be an unapproved scope expansion and would establish a new layout, not prove preservation of the requested existing centered text. This is a material integration and acceptance gap, not an implementation detail that can safely be guessed.
- **Required mitigation / decision:** Obtain an authoritative target page and baseline, with the intended centering axes and acceptable tolerance; **or** obtain explicit scope authorization to create a page and an agreed definition/expected placement against which AC-03 can be evaluated. Then update requirements/architecture consistently and retain AC-03 as an acceptance check. Do not infer the target, framework, route, or centering behavior.
- **Disposition:** **Unresolved; blocks design approval.** The current conditional recommendation is appropriately transparent but does not resolve the missing decision.

### DR-02 — MEDIUM: readability and accessibility criterion is not objective

- **Evidence:** Requirements Q-01/Q-04 leave the foreground/background palette and any contrast threshold or conformance level open. Architecture postpones color selection and proposes a visual readability check.
- **Impact:** The design is directionally testable, but “clearly readable” has no agreed objective threshold; a visual-only check may yield inconsistent acceptance decisions.
- **Recommended mitigation:** Confirm the palette or permitted color-selection authority and agree whether a measurable contrast threshold/conformance target is required. If no numeric target is intended, record that decision and use a documented visual review without claiming a numeric accessibility pass.
- **Disposition:** Open; not by itself a blocker to the static architecture, but must be resolved or explicitly bounded before claiming FR-02/NFR-01 acceptance.

### DR-03 — LOW: browser and viewport coverage remains unspecified

- **Evidence:** Requirements Q-03 and architecture Q-03 leave supported browsers, devices, and viewport range undefined.
- **Impact:** Broad compatibility cannot be asserted, and the proposed viewport-height/layout behavior cannot be validated against a defined support matrix.
- **Recommended mitigation:** Establish the expected browser/device/viewport set before verification, or document the limits of the tested set. Favor broadly supported CSS and test relevant viewport edges once the target is known.
- **Disposition:** Open; does not independently block this minimal visual design.

## Design assessment

- **Completeness and traceability:** The architecture maps its proposed static page, stylesheet, colors, layout, and exclusions to the story requirements. It marks technology, color, browser support, and target-page assumptions as conditional/open rather than facts. DR-01 prevents an approved implementation target.
- **Boundaries and flow:** The responsibilities of static document, local stylesheet, browser, and unspecified file-serving environment are separated adequately for a static visual feature. The simple document/style-to-browser rendering flow has no unnecessary API, state, or service.
- **Security and trust:** The fixed label, absence of user input, scripts, remote APIs, and persistence keep the application attack surface minimal. The design appropriately makes no security claims about an unknown hosting/deployment environment. No material security finding was identified for the described scope.
- **Failure behavior and reliability:** The stated behavior for document/style retrieval or parsing failures and unsupported CSS is proportionate; the design does not invent recovery services or telemetry. A missing stylesheet can invalidate visual acceptance, which is plainly acknowledged.
- **Accessibility and testability:** Literal text escaping and color-pair review are sensible. Browser inspection/computed-style checks and explicit exclusion checks are observable. Readability criteria remain qualitative (DR-02); comparison against the centered pre-change baseline is expressly blocked (DR-01).
- **Scope:** The proposal avoids themes, controls, gradients, images, animation, and unrelated services. Static HTML/CSS is presented as a conditional candidate, not an established stack. The lack of explicit authorization and baseline for creating/targeting a page remains decisive.

## Decisions and outcome

1. **Do not approve or pass this architecture in round 1.** A pass requires no unresolved blocking or high-severity design finding; DR-01 is unresolved and blocking.
2. **Outcome is BLOCKED, not PASS.** This is not a judgment that the static-page option is inherently unsafe or technically unsuitable. It is blocked because an external target/baseline or explicit scope authorization is needed to satisfy the stated preservation requirement without inventing facts.
3. Keep the existing requirements and architecture open questions intact. Do not mark assumptions A-03/A-05 or Q-01–Q-05 as accepted merely to remove the blocker.
4. No implementation, implementation plan, verification plan, or human approval is authorized or produced by this review.

## Revision required before another review

The orchestrator should obtain and record the missing target/baseline and centering decision, or explicit authorization and an acceptance definition for creating a new page. Reflect that decision in the appropriate requirements and architecture documents, then request round 2. Resolve or explicitly bound palette/readability and browser-coverage decisions as needed for verifiable acceptance. Maximum design-revision rounds: **3**; rounds used: **1**; rounds remaining: **2**. If the blocker remains unresolved at the limit, report it as a blocker rather than forcing a pass.

## Files changed

- Created `C:\Users\PalashManna\Desktop\capstone-github\design-review.md` only.

---

# Design Review — Add Background Color to Page (Round 2)

## Review metadata

- Review round: **2 of at most 3**
- Run ID / expected branch: `story/user-story-2-20261029063822-059b6c6b`
- Delivery repository: `C:\Users\PalashManna\Desktop\capstone-github`
- Requirements reviewed: `requirements.md` (revised draft; not approved)
- Architecture reviewed: `architecture.md` (Revision 1 — current architecture; draft, not approved)
- Review date: 2026-10-29
- Outcome: **PASS — no unresolved blocking or high-severity design finding**
- Pass/fail: **PASS (design review only)**
- Round count: **2 of 3 used; 1 round remains**

Round 1 and its BLOCKED outcome above are preserved as historical evidence and are not rewritten. This round assesses the revised requirements and the architecture's explicitly authoritative “Revision 1 — current architecture” section. The orchestrator's report that the branch gate passed was consumed; this reviewer did not run Git or independently verify that evidence. No human approval is claimed.

## Review scope and evidence

Reviewed the revised requirements and current architecture for completeness and traceability, component boundaries, data/rendering flow, security and trust boundaries, failure behavior, reliability, accessibility/readability, testability, and scope. The requirements record the same-run user decision authorizing a new `index.html`, defining literal `<EPAM>` placement as horizontal and vertical viewport centering, and specifying that no exact palette was supplied. The architecture labels its color pair as an engineering choice, not a user-provided or approved palette. No implementation or plan was changed.

## Prioritized findings and round-1 disposition

### DR-01 — BLOCKING in round 1: unauthorized target and missing centered baseline

- **Round-1 disposition:** **Resolved by explicit scope decision.** The revised requirements document records authorization to create `index.html` and defines centering against the viewport, with no old-page comparison. The current architecture reflects this as its scope and test criterion.
- **Review conclusion:** No longer blocks design approval. The decision resolves the target and placement ambiguity without treating an absent baseline as evidence.

### DR-02 — MEDIUM in round 1: readability and accessibility criterion was not objective

- **Round-1 disposition:** **Bounded for this design, with a correction finding below.** The revised architecture explicitly treats `#1F4E79` background and `#FFFFFF` foreground as an engineering choice, documents an internal minimum 7:1 contrast guardrail, and disclaims user prescription and formal accessibility conformance. Requirements likewise do not claim a user-specified palette or numeric standard.
- **Review conclusion:** The former lack of a design-time objective check is materially addressed; no formal conformance claim is made. The architecture's stated contrast calculation is inaccurate, recorded as DR-04 below. “Readable” remains subject to later rendered-page verification; the internal contrast check alone is not a test result.

### DR-03 — LOW in round 1: browser and viewport coverage unspecified

- **Round-1 disposition:** **Bounded, not fully resolved.** The current architecture proposes representative browser/viewport spot coverage, requires recording actual browser/version and dimensions, and explicitly says this sample is not a support guarantee. Requirements continue to record the support matrix as unknown.
- **Review conclusion:** This limitation is transparent and proportionate for the simple static page. Do not claim universal compatibility; test the agreed or actually selected target set during verification. The unspecified matrix is not a blocker to the architecture.

### DR-04 — MEDIUM: current architecture overstates the selected pair's contrast ratio

- **Evidence:** Current architecture reports the white-on-`#1F4E79` sRGB contrast as approximately **8.7:1**, while setting an internal guardrail of at least **7:1**.
- **Impact:** The selected pair's ratio is approximately **7.06:1**, not 8.7:1, using the standard sRGB relative-luminance contrast calculation. It narrowly clears the documented 7:1 internal guardrail, but the stated value is materially inaccurate and provides a misleading margin. This is a calculation/reporting defect, not evidence that the specified pair falls below its own guardrail.
- **Recommended mitigation:** Correct the architecture's calculation to approximately 7.06:1 (and retain sufficient precision when checking against 7:1), or choose a darker background with a more comfortable margin. Independently recalculate the actual selected pair and verify computed rendered colors before asserting the internal check passes. Keep the palette identified as an engineering choice and do not claim user selection or formal conformance.
- **Disposition:** **Open, MEDIUM; not a design-pass blocker.** Correct before recording verification or citing this numeric result as evidence of acceptance.

## Design assessment

- **Completeness and traceability:** The current architecture maps the authorized single-page scope to FR-01–FR-04 and AC-01–AC-06. It explicitly defines both centering axes, viewport-based measurement tolerance, page path, solid background, literal text, and exclusions. DR-01 is resolved by documented authorization and a direct placement definition.
- **Boundaries and data flow:** `index.html`, embedded CSS, browser rendering, and an unspecified file-serving environment have appropriately limited responsibilities. The HTML entity escapes the angle brackets so the browser renders the literal label. The static flow has no unnecessary state, APIs, or runtime dependency.
- **Security and trust:** Fixed content, no user input, scripts, external resources, persistence, or user-controlled styling make the described page's application attack surface minimal. Hosting integrity is correctly left outside the design claims. No material security finding was identified.
- **Failure behavior and reliability:** The document describes normal retrieval/parse failures, stylesheet/CSS failure, viewport-unit limitations, and color-check failure without inventing retries, telemetry, or recovery infrastructure. This is proportionate to a static visual page; no availability target was provided.
- **Accessibility and readability:** The explicit engineering palette and internal contrast threshold bound the previously open design choice, while the architecture avoids claiming formal conformance. DR-04 requires correction of the reported ratio. Later rendered verification must still inspect visible text and actual computed colors; numeric contrast does not by itself prove every aspect of readability.
- **Testability:** The architecture gives observable checks for exact rendered text, viewport-edge background coverage, color values, contrast, centering offsets, and excluded features. It distinguishes checks from test results. Practical browser/viewport sampling is stated as a suggestion rather than a promise.
- **Scope:** Creating one static `index.html` is expressly authorized in the revised requirements. No extra pages, controls, themes, images, gradients, animations, services, or unrelated implementation are proposed. The selected color is clearly an engineering choice, not a user-specified palette.

## Decisions and outcome

1. **PASS for design review round 2.** No unresolved blocking or high-severity design finding remains. DR-01 is resolved; DR-02 is bounded; DR-03 is explicitly limited; DR-04 is a non-blocking medium-severity correction.
2. The pass is not human approval, implementation authorization, evidence of completed verification, or a claim that the requirements/architecture drafts have stakeholder approval.
3. Recommend correcting DR-04 before using the contrast number as verification evidence. Do not represent the chosen colors as user-selected, or claim formal accessibility conformance.
4. Preserve the round-1 BLOCKED record above. Round count is **2 of a maximum 3**, with **1 round remaining**; if a later review finds an unresolved blocking or high-severity issue at the limit, report the blocker rather than forcing a pass.
5. No implementation, planning, testing, or workflow advancement was performed by this review.

## Files changed in round 2

- Appended this round-2 review to `C:\Users\PalashManna\Desktop\capstone-github\design-review.md` only.

---

# Design Review — Add Background Color to Page (Round 3)

## Review metadata

- Review round: **3 of at most 3**
- Run ID / expected branch: `story/user-story-2-20261029063822-059b6c6b`
- Delivery repository: `C:\Users\PalashManna\Desktop\capstone-github`
- Requirements reviewed: `requirements.md` (draft; not approved)
- Architecture reviewed: `architecture.md` (“Revision 1 — current architecture”; draft, not approved)
- Review date: 2026-10-29
- Outcome: **PASS — no unresolved blocking or high-severity design finding**
- Pass/fail: **PASS (design review only; DR-04 remains a non-blocking finding)**
- Round count: **3 of 3 used; no review rounds remain**

Round-1 BLOCKED and round-2 PASS records above are preserved unchanged. This round is narrowly focused on the revised DR-04 contrast calculation and whether round 2's pass outcome remains valid. The architecture's color calculation is a design-time calculation, not runtime or browser-verification evidence. No human approval is claimed.

## DR-04 — MEDIUM: corrected contrast value is still inaccurate

- **Current architecture statement:** White `#FFFFFF` on background `#1F4E79` is said to have approximately **7.06:1** contrast, described as a design-time calculation, and the internal guardrail is at least **7:1**.
- **Independent calculation check:** Applying the standard sRGB transfer function and relative-luminance weights to `#1F4E79` gives background relative luminance approximately **0.0714**. Against white (`1.0`), the contrast is `(1.0 + 0.05) / (0.0714 + 0.05)`, approximately **8.65:1**, not 7.06:1. Thus the current value is an underestimate; the actual selected pair still exceeds the architecture's internal 7:1 guardrail.
- **Historical correction:** Round 2 described the earlier architecture value of approximately 8.7:1 as an overstatement and 7.06:1 as the correction. That comparison was itself reversed: approximately 8.7:1 is consistent with the standard calculation for this pair. The current 7.06:1 statement is not verified by the standard calculation. The round-2 review record remains preserved as history; this round supersedes its calculation assessment, not its recorded outcome.
- **Impact:** This is a calculation/reporting accuracy defect in the design document. It does not indicate a runtime failure, does not invalidate the selected pair's satisfaction of the internal guardrail, and does not create a blocking/high-severity architectural gap. The architecture correctly labels the calculation as design-time rather than runtime test evidence and makes no formal accessibility-conformance claim.
- **Required mitigation:** Correct the architecture's value to approximately **8.65:1** (or record the independently recalculated value with method/precision), retaining the statement that it is design-time only. In any later rendered verification, separately inspect computed colors; do not present this calculation as browser-test evidence or as a stakeholder-required WCAG target.
- **Disposition:** **Open, MEDIUM, non-blocking.** It is not marked resolved because the current architecture still contains the inaccurate 7.06:1 value.

## Confirmation of round-2 outcome

The round-2 **PASS outcome remains valid under the stated pass rule**: DR-04 is non-blocking, and this review found no unresolved blocking or high-severity design finding. However, the round-2 calculation rationale is not affirmed; the numeric contrast assessment above supersedes it. The recorded pass is a design-review outcome only, not human approval, implementation authorization, or evidence that browser verification has run.

## Focused recheck and final disposition

- **Completeness and requirements fit:** The authorized single `index.html` scope, literal text, viewport centering, solid background, and exclusions remain consistent with requirements. The palette remains expressly an engineering selection rather than a user-specified or approved brand choice.
- **Boundaries, flow, and security:** The static document, embedded CSS, browser, and unspecified file-serving environment retain appropriately limited roles. Fixed content, with no user input, scripts, external data, or state, leaves no newly identified security/trust-boundary issue.
- **Failure behavior, reliability, and scope:** The documented static-page limitations and lack of recovery infrastructure remain proportionate. No new service, interaction, theme, image, gradient, animation, or out-of-scope component was introduced.
- **Testability:** The architecture distinguishes the design-time calculation from runtime evidence and specifies checking computed colors and centering in later verification. No test result is claimed here.

## Final decisions and outcome

1. **PASS for design review round 3.** No unresolved blocking or high-severity design finding remains. The round-2 PASS remains valid as an outcome under the same criterion.
2. Keep DR-04 explicitly open at MEDIUM severity until the inaccurate `7.06:1` value is corrected. Do not treat the stated value as verified or suppress the finding to force a pass.
3. This review does not modify `architecture.md`, implementation, planning, or verification artifacts; the recommended architecture revision is to replace the contrast value with an independently calculated approximately `8.65:1` and preserve its design-time-only qualification.
4. **Round limit reached: 3 of 3.** No review rounds remain. No blocker is reported because the remaining finding is non-blocking; if a later assessment elevates any unresolved issue to blocking/high severity, report that blocker rather than treating this pass as sufficient.
5. No human approval, implementation, testing, planning, or workflow advancement is claimed.

## Files changed in round 3

- Appended this round-3 review to `C:\Users\PalashManna\Desktop\capstone-github\design-review.md` only.
