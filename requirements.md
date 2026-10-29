# Requirements: Centered EPAM Heading Page

**Status:** Draft — not approved; no human approval is claimed  
**Source:** `C:\Users\PalashManna\Desktop\Copilot-capston\input\user-story.txt`  
**Delivery repository:** `C:\Users\PalashManna\Desktop\capstone-github`  
**Base SHA:** `ec2ffdd3251016341618d148abcb2935417259a1`  
**Branch:** `story/centered-epam-heading-page-20261029054026-83cadfb4`  
**Run ID:** `20261029054026-83cadfb4`  
**Current-run evidence:** The source TXT was read directly. The delivery repository’s `.git/HEAD` points to the expected branch, and that branch reference contains the stated base SHA.

## Source summary

The story requests a simple HTML page that makes the EPAM brand name visible in the center of the screen on page load. The acceptance criteria and Definition of Done specify the literal visible text `<EPAM>`, including angle brackets, with responsive viewport centering, readable styling, browser and mobile support, and no other visible content.

## Confirmed facts from the source

- **CF-01:** The story title is “Display ‘EPAM’ centered on a web page”; the narrative asks for “EPAM” centered and visible as soon as the page loads.
- **CF-02:** The acceptance criteria and Definition of Done require the exact visible text `<EPAM>`, including angle brackets.
- **CF-03:** The text must be horizontally and vertically centered in the browser window, and remain centered when the window is resized.
- **CF-04:** The angle brackets must render as visible characters, not as an HTML tag; the source markup must escape them as `&lt;EPAM&gt;`.
- **CF-05:** Styling must be readable at a glance (48px or larger is an example, not an explicit minimum) and have sufficient contrast against the background.
- **CF-06:** The page must behave the same in current versions of Chrome, Firefox, Safari, and Edge.
- **CF-07:** On small screens the text must remain centered and fully visible without horizontal scrolling.
- **CF-08:** There must be no other visible text, images, or navigation.
- **CF-09:** The HTML file must open in a browser and display `<EPAM>` centered in the viewport. The acceptance criteria must be manually verified at desktop and mobile sizes; there must be no console errors or HTML validator errors.
- **CF-10:** Explicitly out of scope: animations/transitions, links/buttons/interactive elements, multiple pages/routing, and localization.

## Functional requirements

| ID | Requirement | Source |
|---|---|---|
| FR-01 | On opening the HTML page, display the literal text `<EPAM>` as visible page content. | CF-02, CF-09 |
| FR-02 | Encode the visible angle brackets in the HTML source as `&lt;` and `&gt;` so they render as characters rather than markup. | CF-04 |
| FR-03 | Center the text horizontally and vertically within the browser viewport, including after viewport resizing. | CF-03 |
| FR-04 | Keep the text centered and entirely visible on small screens without horizontal scrolling. | CF-07 |
| FR-05 | Show no other visible text, images, or navigation on the page. | CF-08 |

## Non-functional requirements

| ID | Requirement | Source |
|---|---|---|
| NFR-01 | Style the text so it is readable at a glance and has sufficient contrast against its background. The example size of 48px is guidance, not a confirmed minimum. | CF-05 |
| NFR-02 | Render consistently in current versions of Chrome, Firefox, Safari, and Edge. | CF-06 |
| NFR-03 | Support desktop and small-screen viewport sizes and maintain the specified centering and visibility. | CF-03, CF-07, CF-09 |
| NFR-04 | The HTML file must open in a browser without console errors or HTML validator errors. | CF-09 |

## Acceptance criteria

1. **AC-01 (FR-01, FR-02):** Opening the HTML file displays exactly `<EPAM>` as visible text, with both angle brackets visible; the source uses `&lt;EPAM&gt;` for the text.
2. **AC-02 (FR-03):** The visible text is horizontally and vertically centered in the viewport.
3. **AC-03 (FR-03):** Resizing the browser window preserves horizontal and vertical centering.
4. **AC-04 (NFR-01):** The text is readable at a glance and has sufficient contrast against the background.
5. **AC-05 (NFR-02):** The page behaves the same in current Chrome, Firefox, Safari, and Edge.
6. **AC-06 (FR-04, NFR-03):** At small-screen sizes the text remains centered and fully visible, with no horizontal scrolling.
7. **AC-07 (FR-05):** No other visible text, images, or navigation appear.
8. **AC-08 (NFR-04):** Manual checks at desktop and mobile sizes confirm the acceptance criteria; opening and using the page produces no console errors, and HTML validation reports no errors.

## Assumptions and interpretation

- **A-01:** Because the story narrative says “EPAM” while the acceptance criteria and Definition of Done explicitly require literal `<EPAM>`, the acceptance criteria and Definition of Done are used as the measurable display-text requirement. This records the source’s more specific criteria; it does not resolve or erase the wording mismatch.
- **A-02:** “Current versions,” “small screens,” “readable,” and “sufficient contrast” are retained as stated. No browser-version floor, breakpoint, exact font size, color, or contrast threshold is inferred.

## Unresolved questions

- **UQ-01:** Which versions of Chrome, Firefox, Safari, and Edge define “current” for verification?
- **UQ-02:** What viewport dimensions or breakpoint define “small screens”?
- **UQ-03:** What exact font, size, colors, and contrast threshold are required? The source gives 48px only as an example and does not specify a numeric contrast value.
- **UQ-04:** What filename and location should the HTML file use?
- **UQ-05:** Does “same way” across browsers require pixel-identical rendering, or consistent behavior and visible result?

## Out of scope

- Animations or transitions.
- Links, buttons, or interactive elements.
- Multiple pages or routing.
- Localization.

## Limitations

- This artifact records requirements only. No implementation, browser/device checks, manual verification, console inspection, or HTML validation was performed as part of drafting this document.
- The source does not specify browser-version ranges, device breakpoints, exact typography or colors, a numeric contrast threshold, or the HTML filename/location.
- Requirements remain a draft and have not received human approval.

## Revised run acceptance scope — 2026-10-29

**User decision:** “that is enough move to the next phase”. For run `20261029054026-83cadfb4` only, the user explicitly waives the remaining manual desktop/mobile checks and Firefox/Safari product checks. This revises the acceptance gate for this verification run; it does not change the original source story or establish that any waived check passed. The unperformed checks remain unproven, and the complete original cross-browser/manual Definition of Done remains unmet/unverified. All other applicable requirements remain in scope. This scope decision is not human approval of the requirements, implementation, or PR.