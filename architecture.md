# Architecture — Add Background Color to Page

## Status and scope

- Status: revised architecture draft; not approved. This document does not authorize implementation, review, planning, or workflow advancement.
- Run ID / expected branch: `story/user-story-2-20261029063822-059b6c6b`
- Delivery repository: `C:\Users\PalashManna\Desktop\capstone-github`
- Requirements source: `requirements.md` (draft; not approved)
- Story source: `C:\Users\PalashManna\Desktop\Copilot-capston\input\user-story-2.txt`
- Recorded base SHA supplied by the orchestrator: `ec2ffdd3251016341618d148abcb2935417259a1`
- Scope: architecture for the single visitor-facing page described by the story. No implementation or Git operation was performed.

## Revision authority and history

This is the current revision for run `story/user-story-2-20261029063822-059b6c6b`. The original round-1 draft below is retained as history; where it conflicts with this revision, the “Revision 1 — current architecture” section at the end is authoritative.

The explicit same-run user decision recorded in updated `requirements.md` authorizes creating `index.html` and defines the literal `<EPAM>` placement as centered in the viewport. No comparison to an old page or baseline is required. This resolves the prior draft's target/baseline blocker (DR-01); it does not assert that the round-1 design review is approved or that any acceptance check has been run.

## Repository context and addressability

The inspected delivery repository contains `.git`, `README.md` (only `# capstone-github`), and `requirements.md`. There is no existing page, application source, declared framework, build setup, or hosting convention in the available project files. Thus the intended page and its current centered-text baseline cannot be located or compared.

The visual request is safe to describe with a deliberately minimal, conditional architecture: a static HTML document and local CSS, without a framework, JavaScript, or new service. This is a proposed technology choice, not a fact about the repository or permission to create unrelated scaffolding. It is conditional on the eventual implementation target being a single page that can be served as static files. The architecture cannot establish that the text's prior centering is preserved because no baseline exists; this remains a material limitation against FR-03 / AC-03. Do not claim that acceptance criterion is satisfied until the target and centering baseline are identified.

## Architecture overview

### Components and responsibilities

| Component | Responsibility | Trace |
| --- | --- | --- |
| Static HTML page | Provide the page document and the single visible, literal `<EPAM>` label. In HTML source, encode the angle brackets as `&lt;EPAM&gt;` so the browser renders the literal text rather than treating it as markup. | FR-02; S1-S, S1-AC2 |
| Local page stylesheet | Apply one solid background color over the viewport and establish centered placement without adding background imagery, gradients, animation, themes, or a color control. | FR-01, FR-03, NFR-03, NFR-04; S1-AC1, S1-AC3, S1-OOS1–2 |
| Browser | Parse and render the static document and stylesheet. No browser-side application logic is needed for the described behavior. | NFR-02; S1-DOD |
| Existing file-serving environment (if any) | Deliver the static page and stylesheet to the browser. The repository does not establish a server, deployment platform, route, or hosting convention; this component is an integration dependency, not a new service decision. | A-01; Q-02, Q-05 |

### Technology choices

| Choice | Proposed direction | Rationale and trace |
| --- | --- | --- |
| Presentation | Plain semantic HTML plus CSS; static delivery, no framework or JavaScript. | The story describes one visual page and requires no interaction or dynamic data. This minimizes moving parts; the repository provides no stack to extend. Conditional assumption A-03. |
| Layout | CSS grid or flexbox on the page's main content region, with a viewport-height page container and zero default body margin. | Directly supports a full-viewport surface and stable centering without changing content. The exact centering axes remain unresolved by Q-02; do not treat a new two-axis layout as proven baseline preservation. |
| Background | One opaque CSS color value, not an image, gradient, or animation. | FR-01 / NFR-03 and S1-AC1 / S1-OOS1. The actual color is deliberately not selected because Q-01 is open. |
| Foreground | A fixed text color paired with the background and checked for readability. | FR-02 / NFR-01. Neither color nor a numeric contrast criterion is prescribed (Q-01, Q-04). |
| Dependencies and state | No external runtime dependency, network data, persistence, or user-selectable state. | No such behavior is required; avoids introducing themes or controls (NFR-04, S1-OOS2). |

These are architectural proposals only. No package, framework, repository convention, browser target, or color value is represented as already present or stakeholder-approved.

## Data and rendering flow

1. The file-serving environment, if one is identified, returns the static HTML document and its local stylesheet to the visitor's browser.
2. The browser parses the escaped text entity as the visible literal `<EPAM>` string and applies the stylesheet's layout and fixed color declarations.
3. The browser paints the same solid background across the viewport and renders the label at the page's centered position. There is no application data flow, user input, remote API, or runtime color selection.

The delivery mechanism and route are unknown. This flow assumes only ordinary static-file rendering; it does not prescribe deployment or hosting.

## Trust boundaries

- **Repository/deployment to browser:** HTML and CSS are deployment artifacts interpreted by the visitor's browser. Their source and delivery integrity depend on the as-yet-unspecified repository and hosting process.
- **Browser and viewport:** Rendering is performed in the visitor-controlled browser environment. Browser support and viewport matrix are unspecified (Q-03), so no universal rendering guarantee is claimed.
- **No application input boundary:** The proposed page has no forms, user-controlled content, scripts, API calls, or stored data. The label is fixed content, not interpolated input.
- **External serving environment:** Any server, CDN, route configuration, or transport is outside this architecture until project conventions are known. No security property of that infrastructure is assumed.

## Failure behavior and graceful degradation

| Failure or condition | Expected behavior / limitation |
| --- | --- |
| HTML cannot be retrieved or parsed | The browser's normal navigation/error behavior applies; there is no application recovery path in a static page. |
| Stylesheet is missing or fails to load | The label may remain available as ordinary document text, but the specified background and centered layout are not guaranteed. The page cannot self-repair without adding behavior outside the minimal design. |
| Browser lacks a selected CSS feature or viewport unit | Use broadly supported CSS layout and a viewport-height fallback where needed; unsupported rendering may fail the visual acceptance checks. Exact browser support is unresolved in Q-03. |
| Chosen foreground/background pair is not readable | FR-02 / NFR-01 is not met. Color selection must be checked before claiming acceptance; requirements specify no numeric threshold (Q-04). |
| Target page or centered baseline remains unidentified | Do not assert that the implementation preserves existing placement or satisfies AC-03. Resolve the integration target and meaning of “centered” first. |

No runtime telemetry, retries, or error UI are proposed; none is needed for this static visual feature.

## Testability and observable properties

The design is directly inspectable in a browser and in the page's computed styles:

- Confirm the visible text is exactly `<EPAM>` and that it is not interpreted as an HTML element (FR-02).
- Inspect the rendered page at recorded viewport dimensions to confirm one solid background reaches all viewport edges, with no gaps or decorative effects (FR-01, NFR-03).
- Check computed foreground/background colors and visually confirm readability; do not claim a numeric accessibility pass unless a threshold is established (NFR-01, Q-04).
- Compare placement with the identified pre-change page at the same viewport and against a clarified centering definition. That comparison is currently blocked by the missing page/baseline (FR-03, Q-02).
- Inspect the page and styles for absent scripts, color controls, theme behavior, gradients, images, and animation (NFR-03–04).

These are architectural observables, not test results; no browser test has been run.

## Traceability to requirements

| Architecture element | Requirements trace |
| --- | --- |
| Static page and escaped literal label | FR-02; S1-S, S1-AC2 |
| One solid viewport-wide color | FR-01, NFR-03; S1-AC1, S1-OOS1 |
| Centering layout, conditional on baseline clarification | FR-03; S1-AC3; Q-02 |
| Fixed foreground/background pair, pending selection | NFR-01; S1-AC2, S1-DOD; Q-01, Q-04 |
| No themes, controls, animation, images, or gradients | NFR-03–04; S1-OOS1–2 |
| Browser rendering and static delivery | NFR-02; S1-DOD; Q-03, Q-05 |

## Assumptions

| ID | Explicit working assumption | Qualification |
| --- | --- | --- |
| A-03 | If the requested page must be created, a single static HTML/CSS page with no framework or JavaScript is the least-complex starting architecture. | This is a conditional recommendation, not an established repository convention or confirmed authorization for scaffolding. Revisit if an existing application or hosting convention is identified. |
| A-04 | The label is fixed content and does not need runtime updates. | Inferred from the single literal label in S1; no dynamic behavior is requested. |
| A-05 | A CSS viewport-height layout primitive can be used, with a fallback if a target browser requires it. | Browser targets are unknown; this assumption does not establish compatibility. |

## Unknowns and unresolved decisions

| ID | Open item | Architectural consequence |
| --- | --- | --- |
| Q-01 | Exact background and foreground colors / brand palette. | Color values remain undecided; a readability check is necessary before completion. |
| Q-02 | Intended page location and centered baseline; whether centered means horizontal, vertical, or both, and acceptable tolerance. | No integration target or preservation claim can be made; AC-03 remains blocked. |
| Q-03 | Supported browsers, devices, and viewport range. | CSS feature choices and coverage cannot be finalized or claimed. |
| Q-04 | Required readability metric or accessibility conformance level. | Visual readability can be checked, but no numeric pass criterion is available. |
| Q-05 | Existing technology, build, route, and hosting conventions; whether a new static page is appropriate. | The proposed static architecture remains conditional until the project target is established. |

## Limitations and stage boundary

This architecture describes a minimal candidate for the story, not an implementation specification for an unidentified application. The repository's lack of a page and baseline is a material implementation/integration gap. The visual behavior can be specified conditionally without inventing a framework, route, hosting platform, colors, browser matrix, or baseline; however, FR-03 / AC-03 cannot be demonstrated until Q-02 is resolved. No assumptions here silently close the listed questions.

No implementation, design review, planning, testing, approval, or workflow advancement was performed.

## Revision 1 — current architecture

### Scope, decisions, and traceability

The design covers one new visitor-facing `index.html` page. The literal `<EPAM>` text is centered horizontally and vertically against the viewport itself, as authorized by D1 and specified in FR-03 / AC-04; there is no pre-change page or baseline comparison. The page has a solid viewport-filling background (FR-01 / AC-01), readable literal text (FR-02 / AC-03), and the authorized location (FR-04 / AC-02). It introduces no gradients, background images, animation, themes, or color controls (NFR-03–04 / AC-05–06).

### Components and responsibilities

| Component | Responsibility | Trace |
| --- | --- | --- |
| `index.html` static document | Provide the page at the authorized path, semantic page structure, and a fixed text element whose source escapes the angle brackets as `&lt;EPAM&gt;`, rendering the literal `<EPAM>`. | FR-02, FR-04; D1 |
| Embedded page CSS | In this one-file design, provide the fixed solid background and foreground colors, reset default body margin, fill the viewport, and center the text in both axes. Embedding the small stylesheet avoids an extra asset dependency. | FR-01–03, NFR-01, NFR-03–04 |
| Browser | Parse and render the document and CSS; no client-side application code is required. | NFR-02; S1-DOD |
| File-serving environment | Make `index.html` retrievable. The project does not establish a hosting platform or build convention; none is added or assumed. | FR-04; Q-05 |

### Technology and presentation choices

- **Technology:** Plain HTML and CSS in a single static `index.html`; no framework, JavaScript, packages, network calls, persistence, or application state. This is a minimal design choice for the authorized single visual page, not a claim about an existing repository convention (Q-05).
- **Layout:** Use a zero-margin page root and a grid or flex container with centered alignment on both axes. Apply a viewport-height fallback and a modern dynamic viewport-height value where supported; keep the background on the root/page surface so it paints behind the viewport. This implements the viewport-relative placement authorized by D1 rather than preserving an existing layout.
- **Color selection:** For this architecture candidate, select a single solid background `#1F4E79` and white foreground `#FFFFFF`. This is an engineering design choice only; the user did not prescribe or approve these colors, and no brand palette was provided (Q-01). No theme or runtime selection is included.
- **Objective readability check:** For these sRGB color values, the relative-luminance contrast calculation is approximately **8.66:1** (orchestrator-executed design-time calculation, not browser-verification evidence; provenance and precision below). Use **at least 7:1** as an internal design/verification guardrail for the chosen pair, and confirm the rendered computed colors match the selected values. Neither the palette nor this guardrail was specified by the story. The guardrail is not a claim of required WCAG conformance; no conformance level or formal contrast requirement is established (Q-04).
- **Exclusions:** No images, gradients, animation, interactive color choice, or alternate themes. (S1-OOS1–2; NFR-03–04.)

### Data and rendering flow

1. The file-serving environment, if configured, returns `index.html` to the visitor's browser.
2. The browser parses the escaped entity and displays the literal `<EPAM>` text. It applies the embedded CSS without fetching stylesheets, scripts, fonts, or other application assets.
3. CSS paints the selected solid color behind the viewport and aligns the text element's center with the viewport center on both axes.

There is no user input, dynamic data, external API, persistence, or runtime color selection. No hosting, route configuration beyond the authorized file path, or deployment behavior is inferred.

### Trust boundaries

- **Source and file-serving environment → browser:** The static HTML/CSS are interpreted by the visitor's browser. The repository and any eventual delivery process control the artifacts; hosting integrity and transport are outside this page architecture and are not security-assessed here.
- **Browser and viewport:** The visitor's browser determines rendering. Browser, device, and viewport support targets remain unspecified (Q-03), so the design makes no universal compatibility guarantee.
- **Application content:** The only page text is fixed content, not interpolated input. There are no forms, scripts, APIs, stored data, or user-controlled style values in the proposed design.

### Failure behavior and limitations

| Condition | Expected behavior / limitation |
| --- | --- |
| `index.html` cannot be retrieved or parsed | The browser's ordinary navigation/error behavior applies; the static page has no recovery mechanism. |
| CSS is rejected or unsupported | Text may still render as document content, but background, centering, and readability are not guaranteed; the relevant visual criteria fail. |
| Dynamic viewport-height units are unsupported | Fall back to the broadly supported viewport-height unit. Browser chrome and mobile viewport behavior may differ; verify in the tested browser/viewport rather than asserting all-device behavior. |
| The rendered colors differ from the selected pair or the calculated contrast check falls below the internal 7:1 guardrail | Do not claim the design readability check passes; correct the fixed declarations and recalculate. No automatic adjustment or user color control is proposed. |
| A particular brand palette or formal accessibility target is later required | The present color choice/guardrail may need revision; neither represents a stakeholder-approved palette or conformance commitment (Q-01, Q-04). |
| Hosting or build conventions conflict with a standalone static file | Integration may require a separately authorized adaptation. The existing project conventions are not known (Q-05). |

No telemetry, retry service, custom error screen, or fallback interaction is introduced.

### Objective checks and practical browser coverage

These are architectural observables for later verification, not executed tests or a verification plan:

- Confirm the document is available as `index.html`, displays exactly the literal `<EPAM>`, and has no additional interactive elements (FR-02, FR-04).
- At each recorded viewport, verify the background is a single solid computed color and reaches every visible viewport edge, without gaps or decorative effects (FR-01, NFR-03).
- Check computed foreground/background values against `#FFFFFF` and `#1F4E79`; independently calculate the sRGB relative-luminance contrast and compare with the internal 7:1 guardrail. Record it as an engineering check, not as user-prescribed criteria or a formal conformance result (FR-02, NFR-01, Q-01, Q-04).
- Measure the text element's bounding-box center against `(innerWidth / 2, innerHeight / 2)`; the absolute horizontal and vertical offsets should each be no more than **1 CSS pixel**. Record viewport dimensions and browser. This directly tests viewport centering; no old-page comparison is applicable (FR-03, D1).
- Inspect the resulting document/styles to confirm there are no gradients, background images, animation, multiple themes, or user-selectable colors (NFR-03–04).

The story does not define supported browsers or devices. Practical spot coverage can include current stable desktop Chrome, Edge, and Firefox (and Safari where available), with a narrow and a wide viewport, for example 360×800, 1366×768, and 1920×1080 CSS pixels. This is a suggested representative sample, not a promised support matrix; it does not establish mobile Safari, older versions, all zoom settings, assistive-technology behavior, or every viewport as supported. Record actual browser/version and viewport in any later result.

### Assumptions, unknowns, and unresolved decisions

**Assumptions (explicit, not requirements):**

| ID | Assumption | Consequence |
| --- | --- | --- |
| A-03 (revised) | A single plain static HTML/CSS file is the least-complex fit for the authorized new page. | Revisit only if actual hosting/build conventions require a different integration; no framework is presumed. |
| A-04 | `<EPAM>` is fixed page content with no runtime updates. | No dynamic content path is designed. |
| A-05 (revised) | A viewport-height CSS layout with fallback and progressive enhancement is sufficient for the practical browser sample. | It does not imply support for all browser/viewport combinations. |
| A-06 | The selected fixed color pair is suitable as a candidate absent a supplied brand palette. | This is an engineering choice, not a user decision; a later brand requirement can supersede it. |

**Known unknowns / open decisions:**

| ID | Open item | Current handling |
| --- | --- | --- |
| Q-01 | Brand palette or stakeholder-preferred exact colors are unknown. | A fixed candidate pair is chosen in this architecture to make the design concrete; it is not user-prescribed or brand-validated. |
| Q-03 | Required browsers, devices, and viewport range are unspecified. | Only representative practical spot coverage is suggested; no complete compatibility claim is made. |
| Q-04 | Required contrast threshold or accessibility conformance level is unspecified. | An internal 7:1 design guardrail is documented, without attributing it to the user or claiming conformance. |
| Q-05 | Existing technology, build, and hosting conventions are unknown. | Standalone static HTML/CSS is the minimal proposed choice; deployment integration remains outside scope. |

Q-02 from the round-1 draft (target page and centering interpretation) is resolved for this run by D1: create `index.html` and center the label against the viewport. There is no baseline-preservation requirement. The prior review's DR-01 is therefore addressed by the user decision, not by an assertion of review approval. DR-02 and DR-03 remain bounded by the documented internal contrast check and practical sample limitations; no design-review outcome is claimed.

### Revision boundary

This revision updates the architecture only. Requirements and the round-1 review are read-only inputs; no implementation, test, planning, review, approval, or workflow advancement is performed. The document remains a draft for the orchestrator and must not be interpreted as its own design approval.

### Contrast correction — 2026-10-29 (DR-04)

Corrected the authoritative current value from 7.06:1 to approximately **8.66:1**, using the supplied **orchestrator-executed design-time PowerShell calculation**, not execution by this architecture specialist or browser evidence. For background RGB `(31, 78, 121)`, normalize each channel as `v = c / 255`; linearize as `v / 12.92` when `v <= 0.04045`, otherwise `((v + 0.055) / 1.055)^2.4`. Compute `L = 0.2126*r + 0.7152*g + 0.0722*b`, then white-on-background contrast as `1.05 / (L + 0.05)`. The orchestrator reported `luminance=0.071205609185`, `contrast=8.662965411080:1`, and `>=7:1=True`. This actual result, rather than the reviewer's approximate 8.65:1, is the correction's basis.

This is a numerical correction only: the engineering-selected palette and internal guardrail are unchanged, neither is user-required, and no formal accessibility conformance or rendered verification is claimed (FR-02 / NFR-01; Q-01 / Q-04). Previous history and the saved round-3/3 review remain unchanged; no new architecture decision, design review, implementation, approval, or workflow advancement is performed.
