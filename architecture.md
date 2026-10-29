# Architecture: Centered EPAM Heading Page

**Status:** Draft — architecture only; no human approval is claimed  
**Story/source:** `C:\Users\PalashManna\Desktop\Copilot-capston\input\user-story.txt`  
**Requirements:** `C:\Users\PalashManna\Desktop\capstone-github\requirements.md`  
**Delivery repository:** `C:\Users\PalashManna\Desktop\capstone-github`  
**Branch checked before writing:** `story/centered-epam-heading-page-20261029054026-83cadfb4`  
**Base SHA / branch ref observed:** `ec2ffdd3251016341618d148abcb2935417259a1`  
**Run ID:** `20261029054026-83cadfb4`

## Purpose and scope

Describe the smallest suitable architecture for the requirements in `requirements.md`. This is a static, single-page presentation with no application behavior beyond displaying one centered heading. This revision responds to round-1 finding DR-01; it does not cover implementation, design approval, or delivery planning.

The story narrative says “EPAM,” while its acceptance criteria and Definition of Done require the literal visible text `<EPAM>`. Consistent with requirements assumption A-01, this architecture treats `<EPAM>` as the measurable display value and records rather than resolves the discrepancy.

## Repository evidence and placement

- The delivery repository contains `README.md` (a title only) and `requirements.md`; no existing application source, static-site framework, or project-specific instructions were found at the repository root or in the searched files.
- The architecture therefore proposes one standalone HTML document at the repository root, with its small amount of CSS embedded in the document. No framework, build process, package dependency, or asset pipeline is justified for this scope.
- The requirements do not specify the HTML filename or location, and repository evidence does not establish a naming convention. Root placement is a minimal proposal, not a confirmed requirement; the filename remains unresolved (see UQ-04).

## Components and responsibilities

| Component | Responsibility | Traceability |
|---|---|---|
| Standalone HTML document (proposed repository root) | Provide the document structure and the sole visible content, represented semantically as a heading. Encode the text as `&lt;EPAM&gt;` so the browser renders the brackets as text. | FR-01, FR-02, FR-05; AC-01, AC-07 |
| Embedded CSS in that document | Remove default page spacing, establish a layout tied to the mobile-visible viewport with a viewport-height fallback, center the heading on both axes, and choose readable high-contrast typography that fits narrow viewports without horizontal overflow. | FR-03, FR-04; NFR-01, NFR-03; AC-02–AC-04, AC-06 |
| Browser rendering engine | Parse the static document, decode the character references, apply CSS layout and paint the heading; respond to viewport changes through normal CSS re-layout. | NFR-02, NFR-03; AC-03, AC-05, AC-06 |
| Manual verification | Check the rendered result at desktop and mobile viewport sizes in the required browser families, and check browser console and HTML validation results. | NFR-04; AC-05, AC-08 |

## Technology and layout choices

- **HTML:** Standards-based static HTML, using a semantic heading for the only visible content. The text node must be exactly `&lt;EPAM&gt;` in source. No script or user-controlled markup is needed.
- **Mobile viewport configuration:** Include `<meta name="viewport" content="width=device-width, initial-scale=1">` in the document head. This makes the CSS layout viewport use the device width at the initial scale on mobile browsers rather than an assumed wider desktop layout viewport. This is the explicit design response to review finding DR-01 and supports FR-04 / NFR-03.
- **CSS viewport and centering contract:** Use standard CSS only. Remove default `html`/`body` margins; size the page’s centering area to the viewport; and center its sole heading on both axes with grid or flex alignment. Declare `min-height: 100vh` as a fallback, followed by `min-height: 100dvh` where supported, so browsers supporting the dynamic viewport unit track the currently visible mobile viewport as browser chrome changes. Use the fallback for browsers that do not support `dvh`; no JavaScript viewport measurement or dependency is warranted. Keep resize and viewport changes CSS-driven.
- **Responsive sizing and fit contract:** Constrain the heading’s inline size to the available content width, center its text, and use responsive font sizing that decreases with a narrower viewport while retaining a readable minimum and a capped maximum. Reset the heading’s default margin and apply border-box sizing to the layout. The selected sizing must fit the unbroken literal `<EPAM>` at the narrow validation widths without clipping or creating horizontal overflow; do not hide overflow to mask a sizing defect. At widths below the chosen single-line fit, allow wrapping rather than clipping or horizontal overflow; the centered heading block must retain all visible text. The 48px value is an example, not a mandatory minimum. Do not infer a requirement breakpoint, exact font, color, or contrast threshold.
- **Implementation decisions (not additional user requirements):** Use `100vh` followed by `100dvh` as the height fallback sequence; use device-width initial-scale viewport configuration; and use `font-size: clamp(1rem, 10vw, 3rem)` with `max-inline-size: 100%`, centered text, and `overflow-wrap: anywhere` as the fluid fit strategy. The selected values are design choices, not source-mandated typography. For a repeatable narrow-screen check, include 320 CSS px width as a representative validation point, and record the actual viewport dimensions used. The source does not define 320px (or any breakpoint) as the boundary of “small screens”; the source also does not specify whether wrapping is preferred, so wrapping is retained as a no-clipping fallback only below the one-line fit width.
- **Rendering compatibility:** Prefer broadly supported HTML and CSS primitives and avoid dependencies or browser-specific APIs. “Current” browser versions and the meaning of “same way” are not quantified by the source.
- **No extra features:** No visible explanatory copy, imagery, navigation, controls, animation, routes, localization, or interactive behavior.

## Data flow

1. A visitor opens the standalone HTML document in a browser.
2. The browser parses the document and decodes `&lt;EPAM&gt;` in the heading text node to the visible characters `<EPAM>`; it is not parsed as an element.
3. Embedded CSS lays out the page against the viewport and centers the heading horizontally and vertically.
4. On mobile, the declared device-width viewport establishes the intended CSS layout width. The browser uses the dynamic viewport height when supported and the `100vh` fallback otherwise; CSS grid/flex alignment centers the heading in that area.
5. On viewport resize or mobile browser-chrome changes, the browser recalculates the CSS layout; bounded responsive text sizing and the heading width constraint keep the literal visible content in the available inline space.

There is no application data store, network request, server-side processing, or external runtime dependency in this design.

## Trust boundaries and security considerations

- The input is a fixed, authored HTML document; there is no user input, remote data, or dynamic HTML insertion.
- The browser is the rendering boundary. Character-reference encoding of the angle brackets ensures the required text is treated as text rather than markup.
- The proposed page has no scripts, third-party resources, forms, or outbound data flow. This minimizes attack surface but is not a substitute for validating the eventual document.
- This architecture makes no claims about repository hosting, deployment, or transport security; those are outside the stated story.

## Failure behavior

- If the document cannot be opened, the browser cannot render the page; no server or runtime recovery behavior is specified or required.
- If styling fails or is unsupported, the escaped text should still be present as ordinary document text, but viewport centering, typography, and small-screen presentation may not meet the requirements.
- If a browser does not support `100dvh`, `100vh` remains the height fallback. On mobile browsers where legacy `100vh` does not track the currently visible area as browser chrome changes, vertical centering may differ from the dynamic-viewport behavior; verify supported current browser versions and record any observed limitation. The device-width viewport declaration and width-constrained heading remain in effect.
- If the heading width exceeds the available viewport width, that is a layout failure to correct through responsive sizing; clipping or suppressing horizontal overflow is not an acceptable recovery behavior.
- A markup error could prevent correct text rendering or produce validation failures; validate the delivered HTML and inspect the browser console as required by AC-08.
- There are no external services or stateful operations whose outages or partial failures need handling.

## Validation approach

Validation belongs to the later implementation/verification activity and has not been performed for this architecture artifact. At minimum, verify:

1. The HTML opens in a browser and shows only `<EPAM>`, with the source spelling `&lt;EPAM&gt;`.
2. Check desktop and mobile CSS viewport sizes, including a representative narrow width of 320 CSS px, and record the actual width and height for each check. Confirm the document has the device-width, initial-scale viewport declaration; visually confirm the entire literal `<EPAM>` remains legible and centered in the currently visible viewport, including after resizing and, on mobile, when browser chrome changes.
3. At every recorded viewport size, check the page’s `document.documentElement.scrollWidth <= document.documentElement.clientWidth` (or an equivalent browser measurement) and confirm no horizontal scrollbar is present. A failed comparison is a sizing defect, not something to conceal with overflow clipping. Record dimensions and outcome; 320 CSS px is a repeatable test point, not a source-defined breakpoint or requirement threshold.
4. Readability and contrast are acceptable; record the chosen typography and colors during verification without treating them as source-specified values.
5. Behavior is checked manually in current Chrome, Firefox, Safari, and Edge as available; record actual browser versions and viewport sizes used rather than assuming them.
6. Browser console inspection reports no errors and an HTML validator reports no errors.

## Assumptions

- **A-01 (from requirements):** The acceptance criteria and Definition of Done take precedence as the measurable display-text specification (`<EPAM>`), while the narrative’s “EPAM” wording discrepancy remains documented and unresolved.
- **A-02:** A single root-level HTML document with embedded CSS is the minimal fit given the repository evidence; the precise filename and placement are not confirmed.
- **A-03:** Semantic HTML and standard CSS are sufficient; JavaScript and external dependencies are unnecessary for the specified behavior.
- **A-04:** “Same way” means consistent visible content and layout behavior, not pixel-identical rasterization; this interpretation is provisional pending UQ-05.
- **A-05 (DR-01 design decision):** The device-width/initial-scale viewport declaration, `100vh` then `100dvh` fallback ordering, fluid bounded heading sizing, and 320 CSS px repeatable test point are implementation choices to make the responsive-fit contract concrete. They do not define “small screens,” impose a new font-size requirement, or otherwise revise the source requirements.

## Unknowns and unresolved questions

- **UQ-01:** Which versions of Chrome, Firefox, Safari, and Edge define “current” for compatibility checks?
- **UQ-02:** Which viewport dimensions or breakpoint define “small screens”?
- **UQ-03:** What exact font, size, colors, and contrast threshold are required? The 48px size is guidance only.
- **UQ-04:** What filename and location should the HTML document use? The repository has no established convention to resolve this; root placement is only a proposal.
- **UQ-05:** Does cross-browser “same way” mean consistent behavior and visible result or pixel-identical rendering?
- **UQ-06:** Should the narrative’s “EPAM” or the more specific AC/DoD `<EPAM>` ultimately be authoritative? This architecture follows requirements assumption A-01 without closing the discrepancy.
- **UQ-07:** What dimensions define “small screens,” and which mobile browser versions are in scope? The 320 CSS px check is only a chosen repeatable test point, not an answer to either question.

## Limitations

- This document describes architecture only. No source implementation, browser check, console inspection, or HTML validation was performed. Round-1 review findings are recorded as input; this revision is not a design approval.
- Exact browser-version targets, viewport breakpoints, visual tokens, and document filename/location are unspecified; compatibility and appearance claims remain bounded by those unknowns. The `100vh` fallback may not track mobile browser chrome as precisely as `100dvh` in browsers lacking dynamic viewport units.
- Requirements remain in draft status. No human approval is claimed.
