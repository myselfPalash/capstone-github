# Architecture: Centered `<EPAM>` Page with Solid Background

## Status and run provenance

- Stage: architecture draft for run `20261030110659-19a9210a`; not approved.
- Delivery repository: `C:\Users\PalashManna\Desktop\capstone-github`.
- Requirements: `C:\Users\PalashManna\Desktop\capstone-github\requirements.md` (read; covers both supplied stories).
- Run branch: `story/centered-epam-background-20261030110659-19a9210a`.
- Base recorded for this run: `ec2ffdd3251016341618d148abcb2935417259a1`.
- Branch/working-tree preflight: the parent orchestrator reported checking the expected branch and base immediately before this stage, with `requirements.md` as the only untracked file. This specialist did not independently run Git commands.
- Existing project layout observed: root `README.md` (title only), `requirements.md`, and `.git`; no application files were present. Existing `architecture.md` did not exist, so this is a new artifact, not a replacement of user-authored architecture.
- Story sources read: `C:\Users\PalashManna\Desktop\Copilot-capston\input\user-story.txt` (S1) and `C:\Users\PalashManna\Desktop\Copilot-capston\input\user-story-2.txt` (S2).
- Workflow and artifact instructions read: `C:\Users\PalashManna\Desktop\Copilot-capston\docs\sdlc-workflow.mmd` and `C:\Users\PalashManna\Desktop\Copilot-capston\.github\instructions\delivery-artifacts.instructions.md`.
- No implementation, tests, browser checks, HTML validation, design review, approval, or stage advancement was performed or is implied.

## Scope and architectural intent

Deliver one minimal, static HTML page that displays the escaped label `&lt;EPAM&gt;` as visible text, centers it in the viewport, and fills the viewport with one solid background color. Preserve the combined requirements from S1 and S2. Do not introduce a nested application project, framework, build pipeline, backend, scripting, external assets, or additional page content.

The proposed implementation location is the repository root as `index.html` (**A-06: proposed location**, not specified by the stories). Confirm the eventual filename during implementation without changing the one-page, root-level scope. This document proposes architecture only; it does not assert that the file exists.

## Requirements traceability

| Requirement | Architectural response | Source |
| --- | --- | --- |
| FR-01, FR-05: one page, exact visible label, no additional visible content | A single HTML document with one visible label in the page content; no navigation, images, controls, or extra visible text. | Requirements § Functional requirements; S1 lines 6, 10, 18, 29 |
| FR-02: angle brackets are visible characters, not markup | Encode the text as `&lt;EPAM&gt;` in the HTML source. The browser decodes the entities into a text node; it does not interpret them as an element. | Requirements § Functional requirements; S1 line 14 |
| FR-03: horizontal/vertical centering and resizing | CSS viewport-sized layout container using native CSS Grid or Flexbox centering; no script or fixed coordinates. | Requirements § Functional requirements; S1 lines 11–13 |
| FR-04: solid full-viewport background, no layout change | Set a single solid CSS background on the page/root canvas, independently of the centering rule. No image, gradient, or animation. | Requirements § Functional requirements; S2 lines 10–12, 16 |
| NFR-01: readability and contrast | Select a readable foreground/background pair and legible font size; verify visually. Exact color, font, and quantitative contrast target are unresolved. | Requirements § Non-functional requirements; S1 line 15; S2 lines 11, 21 |
| NFR-02: mobile visibility, no horizontal overflow | Use fluid viewport layout, zero default body margin, and reasonable text/container sizing; manually check recorded small-screen sizes and overflow. | Requirements § Non-functional requirements; S1 lines 13, 17, 30 |
| NFR-03: current Chrome, Firefox, Safari, Edge | Use basic semantic HTML and broadly supported CSS Grid/Flexbox and viewport units; test actual browser/version combinations and record coverage. | Requirements § Non-functional requirements; S1 line 16 |
| NFR-04–05: no console/validator errors; manual desktop/mobile acceptance | Verify in browsers and with a selected HTML validator; record actual results, viewport dimensions, versions, and limitations in the verification artifact. | Requirements § Non-functional requirements; S1 lines 30–31 |

## Components and responsibilities

1. **Static HTML document (`index.html`, proposed root path)**
   - Provides document metadata and a minimal semantic content structure, such as a `main` landmark containing the single label.
   - Stores the label as the escaped source text `&lt;EPAM&gt;`.
   - Contains no form, navigation, application state, event handlers, or other visible content.
   - Could contain its small stylesheet inline to keep delivery self-contained; a separate CSS file is unnecessary for this scope. The final choice is an implementation detail, not a user requirement.

2. **CSS presentation**
   - Resets the browser's default body margin so the layout can occupy the viewport.
   - Uses a viewport-height layout and CSS Grid (`place-items: center`) or equivalent Flexbox centering. Select one mechanism in implementation; do not combine competing layout systems without need.
   - Applies a single solid background and a contrasting text color to the page canvas, and sets readable typography.
   - Avoids fixed-position coordinates, scripts, external fonts, gradients, images, animation, and interaction.

3. **Browser rendering engine**
   - Parses the document, decodes the two character references into the literal visible characters, computes CSS layout for the current viewport, and paints the background and centered text.
   - Resizes/reflows using native browser layout; no application-side state or resize listener is required.

There are no services, APIs, databases, user accounts, or persistence components in this design.

## Technology choices and rationale

| Choice | Rationale and traceability |
| --- | --- |
| Plain HTML5 | Meets the simple HTML-page requirement directly and supports semantic structure and escaped text without runtime dependencies (FR-01, FR-02, FR-05). |
| CSS, using Grid or Flexbox | Native responsive layout can center the element on both axes and react to viewport resizing without JavaScript (FR-03, NFR-02). |
| One static root-level page (proposed `index.html`) | Smallest architecture consistent with the no-multiple-pages requirement and observed empty application layout. Exact filename was not specified (A-05 in requirements; A-06 here). |
| Inline CSS is acceptable; no framework, build tool, or JavaScript | Avoids an implementation project structure and needless runtime or deployment complexity for one static view. Inline versus separate CSS remains an implementation choice. |
| No remote libraries, fonts, images, or network calls | The requirements need only text and a solid color. Local-only assets reduce failure modes and avoid external trust/dependency boundaries. |
| Viewport-relative minimum height with a standard CSS fallback | Supports full-screen centering across named current browsers. A final implementation may add a newer viewport unit only with a fallback and verification; browser chrome and extreme viewport behavior remain limitations. |

**Design choice not yet selected:** exact colors, font family, font size, and any numeric contrast target. The requirements give 48px only as an example, not a mandatory minimum. Choose and document a palette/size during implementation, preserving legibility and the short label's fit at tested mobile widths (A-02/A-03; Q-01/Q-02).

## Data flow and rendering

1. A visitor opens the static HTML document from a local file or a static web host (hosting method is unspecified).
2. The browser reads the HTML and stylesheet. The encoded label is parsed as text; `&lt;EPAM&gt;` becomes visible `<EPAM>` characters, not a tag.
3. CSS determines the available viewport area, applies the solid background, and centers the label on both axes.
4. The browser paints the page. A viewport resize causes normal CSS reflow and repaint; there is no data submission, persistence, asynchronous processing, or network request initiated by the page.

## Trust boundaries and security considerations

- **Repository/source to browser:** the checked-in static document and its styles are trusted deliverables. Review source changes before opening/publishing it; do not add untrusted dynamic content.
- **Browser sandbox:** the browser controls file access, rendering, and its own console. The page has no reason to request privileged access.
- **Network/third parties:** none are required. No external script, stylesheet, font, image, analytics, or API should be introduced for this scope.
- **Input boundary:** there is no visitor input or content interpolation. Escaping the label as character references prevents it from being interpreted as an HTML tag.
- **Data handling:** no personal, secret, or user data is collected, transmitted, or stored.

## Failure behavior and recovery

- **Document cannot be opened or is missing:** the browser displays its own file/host error; this page has no application-level recovery path. Restore or serve the static document at the intended location.
- **CSS is unsupported, blocked, or malformed:** content should remain present as plain text, but centering, background, or visual quality may fail. Check the browser console and validator, and correct the stylesheet. No script fallback is needed.
- **Viewport is unusually small, zoomed, or text-scaled:** the label may no longer fit while retaining readability. Do not hide or clip it to force a centered appearance; record the exact tested bounds and limitation. Requirements do not define a minimum viewport or scaling envelope.
- **Browser/platform rendering differs:** font rasterization and viewport behavior can vary. Check the named browser families, record versions/platforms, and report untested combinations rather than claiming universal equivalence.
- **No runtime dependency failure modes:** with no scripts, remote assets, or services, there is no API, network, or service availability behavior to recover.

## Verification feasibility and limitations

All stated acceptance criteria are feasible to assess for selected environments, but completion cannot be demonstrated by architecture alone:

- **Manual browser checks are required by the stories.** Open the page in desktop and mobile-sized contexts; verify exact visible text, center alignment initially and after resizing, full-viewport solid background, readability, and absence of horizontal scrolling. Record viewport dimensions, browser/version/platform, and the method/tolerance used for any centering judgment.
- **Mobile evidence:** use a real mobile device when available. Browser responsive emulation can supplement checks but should be labeled as emulation, not real-device verification. The stories do not define minimum dimensions, zoom, or dynamic browser-chrome conditions.
- **Cross-browser coverage:** check current Chrome, Firefox, Safari, and Edge where available. Record unavailable browsers and exact versions/platforms; the meaning of “current” is unspecified.
- **Console and HTML validation:** inspect the browser console and run an HTML validator selected during verification. Record the validator/configuration and actual result. No validator choice or result exists yet.
- **Automated checks:** a source-level check for the escaped string or a validator can supplement manual work, but cannot establish visual centering, color readability, or real mobile behavior by itself.
- **Not run in this stage:** no implementation exists in the observed layout, so no browser, console, validator, or product acceptance check was run. No result is claimed.

## Assumptions, unknowns, and unresolved questions

### Assumptions / proposed choices

- **A-01 (requirements):** S2 extends S1 into one combined page rather than a separate page; retained as the working scope.
- **A-02–A-04 (requirements):** a palette/font/size may be selected to achieve qualitative readability; 48px is an example; cross-browser consistency means equivalent appearance/behavior, not pixel-identical rasterization.
- **A-05 (requirements) and A-06 (this architecture):** no file layout was prescribed; root `index.html` is proposed to keep the result a single simple page and avoid a nested project.
- **A-07 (architecture):** inline CSS and a semantic `main` landmark are suitable minimal implementation choices. These do not add visible content or alter the requested appearance.
- **A-08 (architecture):** a static document opened locally or served by any simple static host is sufficient; a hosting environment is not specified.

### Open questions carried from requirements

- **Q-01:** What exact colors, font family, and final font size are intended?
- **Q-02:** Is a quantitative contrast/accessibility target required?
- **Q-03:** What minimum viewport dimensions, zoom/text scaling, and mobile viewport behavior define the supported range?
- **Q-04:** Which exact browser versions/platforms are “current,” and what rendering/centering tolerance is acceptable?
- **Q-05:** Which HTML validator and configuration should be used?
- **Q-06:** Which desktop/mobile sizes and manual evidence format satisfy completion?

### Additional implementation decisions still open

- Confirm the root HTML filename and whether the small stylesheet is inline or in a separate root-level file.
- Choose and document the foreground/background colors and typography. Any numeric contrast threshold or fixed 48px minimum would be a design decision unless separately confirmed as a requirement.
- Choose the specific viewport-height CSS fallback strategy and evaluate it on supported browsers/mobile devices.

These are documented decisions for later work, not a request for interactive approval and not evidence of human approval.

## Scope exclusions and limitations

- No application framework, nested project, build/deployment system, backend, routing, or API.
- No JavaScript, interactive controls, links, navigation, images, gradients, animations, themes, localization, or additional visible content (S1/S2 out-of-scope requirements).
- No user-provided visual brand specification, supported-device matrix, or quantitative accessibility target was supplied.
- Pixel-identical rendering across browser engines and behavior at every mathematically possible viewport cannot be guaranteed.

## Stage outcome

Architecture is drafted and traceable to the requirements and both source stories. It makes no claim that implementation or verification has occurred. Status remains **not approved**; this artifact does not perform design review or authorize planning or any later stage.
