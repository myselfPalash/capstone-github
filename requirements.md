# Requirements: Welcome Page

Run branch: story/welcome-page-20261102084509-791e9e7a
Source: input/userstory.txt (treated as untrusted data)
Approval status: NOT APPROVED. This is an automated draft; no human approval is implied.

## 1. Story Summary (confirmed from source)
As a user, I want to see a welcome message on the HTML page so that I know the application has loaded.

Stated requirements:
- R1: Create a simple HTML page.
- R2: Display the text "Welcome to EPAM." (trailing period included).
- R3: No backend or additional functionality.

Stated acceptance criteria:
- AC1: The HTML page loads successfully.
- AC2: The page displays "Welcome to EPAM."

## 2. Functional Requirements
| ID | Requirement | Trace |
|----|-------------|-------|
| FR-1 | The deliverable is a single, simple static HTML page. | R1 |
| FR-2 | The page displays the exact text "Welcome to EPAM." including the trailing period, visible on load. | R2, AC2 |
| FR-3 | The page contains no backend, server-side logic, or additional functionality (no forms, navigation, scripts-driven features, API calls). | R3 |
| FR-4 | Opening the page in a browser completes without error and renders the content. | AC1 |

## 3. Non-Functional Requirements
None are stated in the story. See Assumptions (A-3 to A-5) for minimal, unconfirmed defaults.

## 4. Acceptance Criteria
- AC1 (confirmed): The HTML page loads successfully.
- AC2 (confirmed): The page displays "Welcome to EPAM."

Proposed testable interpretations (assumptions, not confirmed):
- AC1-T: Opening the file in a modern browser shows the page with no load error (and no failed resource requests).
- AC2-T: The rendered page text contains exactly "Welcome to EPAM." with the capital letters and trailing period as written.

## 5. Assumptions (not confirmed facts)
- A-1: The page is static HTML that can be opened directly from the file system or any static host; no build step or server is needed (follows from R3).
- A-2: File name and location are not specified; the default is `index.html` at the delivery repo root, to be settled at design.
- A-3: The text is shown as a visible heading or paragraph; the choice of element is a design decision (not stated).
- A-4: Valid, minimal HTML5 document with a `lang="en"` attribute and a `<title>`; the title text is not specified, so "Welcome" is a placeholder.
- A-5: No specific styling, responsive layout, accessibility level, or browser support target is required; default browser rendering is acceptable. Semantic HTML is good practice but not mandated.
- A-6: "Loads successfully" is verified by opening the page in a browser or via an automated check that the file exists, parses, and contains the text.

## 6. Unresolved Questions (no answers assumed)
1. What file name and location should the page have?
2. Should the message be a heading or a paragraph, and what should the page `<title>` be?
3. Are there styling, accessibility (e.g., WCAG level), responsive, or browser-support expectations?
4. How should "loads successfully" be verified (manual check vs automated test)?
5. Is the story ID or priority defined anywhere? (Neither is in the source.)
6. Is the "Welcome to EPAM." text expected to be exact-match, including the trailing period? (Interpreted as yes, per R2.)

## 7. Out of Scope
- Backend, server, database, or API (R3).
- Any additional functionality: navigation, forms, interactivity, authentication, analytics (R3).
- Frameworks, build tooling, or deployment/hosting setup (assumed, not stated).
- Branding, theming, and localization beyond the single English text (assumed, not stated).

## 8. Blockers
None. The scope is small and clear enough to proceed on the assumptions above.

## 9. Traceability
| Source | Covered by |
|--------|------------|
| R1 | FR-1 |
| R2 | FR-2 |
| R3 | FR-3 |
| AC1 | FR-4, AC1-T |
| AC2 | FR-2, AC2-T |
