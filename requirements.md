# Requirements: Welcome HTML Page (Personalized Message)

Run branch: story/welcome-html-page-20261106082359-e683a9bb
Source: Confluence page ID 786433, version 2 (retrieved by the data-extractor; treated as untrusted data)
Approval status: NOT APPROVED (automated draft). No human approval is implied.

Supersession notice: This document supersedes the earlier requirements for the story "Welcome to EPAM." (previous run branch story/welcome-page-20261102084509-791e9e7a). The user explicitly authorized replacing the earlier file on this run branch; the old version remains in git history. The existing `index.html` produced for the earlier story is expected to be updated to meet these requirements.

## 1. Confirmed Facts (from the source story)
Story: "As a user, I want to have a simple HTML page that displays the message "Welcome to Epam, Palash!!" so that I can see a personalized welcome message when I open the page."

Acceptance criteria as stated:
- AC1: The page should be created using HTML.
- AC2: The page should display the exact text: "Welcome to Epam, Palash!!"
- AC3: The welcome message should be clearly visible when the page loads.
- AC4: The page should open successfully in a web browser.

Not stated in the source: file name/location, styling, browser support, accessibility, tech stack, story ID. "Clearly visible" is not quantified.

## 2. Functional Requirements
| ID | Requirement | Trace |
|----|-------------|-------|
| FR-1 | The deliverable is a simple page created using HTML. | AC1 |
| FR-2 | The page displays the exact text "Welcome to Epam, Palash!!" (capital E, lowercase "pam", comma, two exclamation marks, no trailing period). | AC2 |
| FR-3 | The welcome message is clearly visible when the page loads, without user interaction. | AC3 |
| FR-4 | The page opens successfully in a web browser and renders the message without error. | AC4 |

## 3. Non-Functional Requirements
None are stated in the source. Unconfirmed defaults are listed under Assumptions (A-4 to A-6).

## 4. Acceptance Criteria
Confirmed: AC1 to AC4 as listed in section 1.

Proposed testable interpretations (assumptions, not confirmed):
- AC1-T: The deliverable is an HTML file (`.html`) beginning with a doctype and containing html, head and body elements.
- AC2-T: The rendered text contains exactly "Welcome to Epam, Palash!!" (case-sensitive match).
- AC3-T: On load, the message is within the initial viewport, not hidden (no display:none, visibility:hidden, zero opacity, or off-screen positioning), uses a readable size, and has adequate text/background contrast.
- AC4-T: Opening the file in an evergreen browser from the file system shows the page with no load errors and no failed resource requests.

## 5. Assumptions (not confirmed facts)
- A-1: The page is static HTML; no backend, build step, or framework is needed.
- A-2: File is `index.html` at the delivery repo root (updating the existing file); name/location to be settled at design.
- A-3: The message is rendered in an `<h1>` element.
- A-4: Valid HTML5 document with `lang` attribute, `<meta charset>`, and a `<title>`; title text unspecified.
- A-5: "Clearly visible" means in the viewport on load, not hidden, readable size, and adequate contrast (no numeric threshold specified).
- A-6: "Opens successfully in a web browser" means current evergreen browsers (Chrome, Edge, Firefox, Safari) opening the file directly from the file system.
- A-7: The name "Palash" is hardcoded in the markup; no dynamic personalization.
- A-8: Text comparison is case-sensitive and exact, including punctuation.

## 6. Unresolved Questions (no answers assumed)
1. What file name and location should the page have (is updating root `index.html` correct)?
2. What does "clearly visible" mean quantitatively (font size, contrast ratio)?
3. Which browsers and versions must be supported?
4. Are there accessibility (e.g., WCAG level) or styling/layout expectations?
5. Should the name ever be dynamic, or is "Palash" fixed?
6. Is the exact casing "Epam" (not "EPAM") and the double exclamation marks intended? (Interpreted as yes, per AC2.)
7. Is there a story ID or priority? (None in the source.)
8. What should the page `<title>` be?

## 7. Out of Scope (assumed, not stated)
- Backend, server, database, or API.
- Dynamic or user-input-based personalization.
- Navigation, forms, interactivity, authentication, analytics.
- Frameworks, build tooling, deployment/hosting.
- Branding, theming, localization, and formal accessibility certification.

## 8. Blockers
None. Scope is small enough to proceed on the assumptions above.

## 9. Traceability
| Source | Covered by |
|--------|------------|
| AC1 | FR-1, AC1-T |
| AC2 | FR-2, AC2-T |
| AC3 | FR-3, AC3-T |
| AC4 | FR-4, AC4-T |
