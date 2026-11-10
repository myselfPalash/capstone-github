# Requirements: Todo Application (current story)

| Field | Value |
|-------|-------|
| Story | Create a Simple Todo Application |
| Source | Confluence page 786433, version 3: https://epam-sdlc-pipeline.atlassian.net/wiki/spaces/githubcaps/pages/786433/User+Story+Todo+Application. The orchestrator fetched it and passed the text to this stage. It is treated as untrusted data. |
| Run ID | todo-application-20261110065333-2618c391 |
| Branch | story/todo-application-20261110065333-2618c391 |
| Base SHA | 07f7b63e45552939c442c62d3985e811892e4319 (origin/main) |
| Status | **Draft – automated, not human-approved** |

> This document replaces the previous "Welcome Page" story's requirements. That content is still in Git history and is not evidence for this story.

## 1. Story Summary (confirmed from source)
As a user, I want to add, view, update, and delete tasks in a Todo application so that I can manage and track my daily activities easily.

Source acceptance criteria (verbatim):
- AC1: User can add a new task by entering a task description.
- AC2: User can view all added tasks in a list.
- AC3: User can mark a task as completed or pending.
- AC4: User can edit an existing task.
- AC5: User can delete a task from the list.
- AC6: Tasks should remain available after refreshing the page.

Source scope: (S1) simple and user-friendly UI; (S2) basic frontend and backend functionality; (S3) store tasks in a database; (S4) no user login or authentication required.
Expected outcome: a simple Todo app that supports basic CRUD operations on tasks.

## 2. Functional Requirements
| ID | Requirement | Trace |
|----|-------------|-------|
| FR-1 | The UI provides a text input and an "Add" control. Submitting a valid description creates a task through the backend and shows it in the list. New tasks start as *pending*. | AC1, S1, S2 |
| FR-2 | The UI shows all stored tasks in a list. Each item shows its description and its completed or pending status. When there are no tasks, an empty-state message is shown. | AC2 |
| FR-3 | Each task has a control that switches it between *completed* and *pending*. The change is saved by the backend and shown visibly in the list. | AC3 |
| FR-4 | Each task has an edit action. The user can change the description, then save or cancel. A saved edit is persisted and is subject to the same validation as FR-1. | AC4 |
| FR-5 | Each task has a delete action. Deleting removes the task from storage and from the list. | AC5 |
| FR-6 | Tasks are stored in a database through the backend. After a page refresh or a server restart, the list shows the same tasks and statuses. | AC6, S3 |
| FR-7 | The backend exposes CRUD operations for tasks: list, create, update (description and/or status), and delete. The frontend uses these operations for every change. | S2, Expected outcome |
| FR-8 | No login, accounts, or authentication. Everyone using the app shares one task list. | S4 |

## 3. Non-Functional Requirements
These are derived defaults. The story does not state them; see Assumptions.

| ID | Requirement |
|----|-------------|
| NFR-1 Validation | The server trims each description. Empty or whitespace-only descriptions are rejected. The maximum length is 200 characters (assumed limit). Status must be a boolean or one of the two allowed values. Invalid input returns HTTP 400 with a clear message. The client also checks input before sending. |
| NFR-2 Safe rendering | Task text is always displayed as text, never as HTML (for example, through `textContent`), so stored input cannot cause XSS. The database uses parameterized queries only. |
| NFR-3 Local-only | The server binds to `127.0.0.1` by default. Port and database path are configurable, with sensible defaults. |
| NFR-4 Error handling | Unknown task IDs return 404. Malformed JSON returns 400. Unexpected errors return 500 without exposing stack traces. When a request fails, the UI shows a visible error and keeps the user's input. |
| NFR-5 Testability | Automated tests cover the API CRUD operations, validation, and persistence across a server restart. Tests run from one documented command and can use a temporary or in-memory database. |
| NFR-6 Accessibility basics | Uses semantic HTML. Inputs have labels, and buttons have accessible names (for example, "Delete task: …"). Everything works with the keyboard (Enter submits). Status is not shown by color alone. |
| NFR-7 Simplicity | Few or no external dependencies, and no network installs required. The app runs locally with documented start steps. |

## 4. Out of Scope
- Authentication, user accounts, and separate lists per user (S4).
- Deployment, hosting, CI/CD, and production hardening (HTTPS, rate limiting).
- Additional features: due dates, priorities, categories, search, filters, sorting options, reordering, bulk actions, undo, and real-time sync.
- Mobile apps, offline mode, and localization.

## 5. Assumptions (not confirmed)
- A-1: The existing welcome page (`index.html`) and `tests/verify-welcome.cmd` stay unchanged unless a change is strictly necessary. The Todo app gets its own entry point or path, to be decided at design.
- A-2: The stack is chosen at design. A feasible zero-install option is Node.js v24 with the built-in `node:sqlite` module for the "database" (S3) and `node:test` for tests.
- A-3: The 200-character maximum, trimming, and the error codes in NFR-1 and NFR-4 are reasonable defaults, not stated requirements.
- A-4: Concurrent use by several users is not a concern. With the last-write-wins approach, the most recent save overwrites earlier ones.
- A-5: Tasks are shown in creation order, oldest first, with no sorting controls.
- A-6: Deletion is immediate and has no confirmation dialog.
- A-7: "Refreshing the page" (AC6) also implies the data survives a server restart, because tasks are stored in the database.

## 6. Unresolved Questions (non-blocking)
1. Which database or technology is required, or is any persistent store acceptable?
2. What is the required maximum description length, and are duplicate descriptions allowed?
3. Should deleting a task require a confirmation step?
4. How should the Todo app relate to the existing welcome page: replace it, link to it, or exist alongside it?
5. Are there browser-support or WCAG-level targets?
6. What sort order should the list use, and should completed tasks be grouped separately?

## 7. Blockers
None. The scope is clear enough to proceed using the assumptions above.

## 8. Acceptance Test Mapping
| AC | FRs | Proposed test (automated API test plus manual UI check) |
|----|-----|-------------------------------------|
| AC1 | FR-1, FR-7, NFR-1 | Creating "  Buy milk  " returns 201 with the trimmed text and *pending* status. Empty or whitespace-only input, and input over 200 characters, returns 400. UI: Enter or Add puts the item in the list. |
| AC2 | FR-2, FR-7 | Listing returns every created task. UI: the list shows each task and its status, or the empty-state message when there are none. |
| AC3 | FR-3 | Toggling to completed and back to pending saves each change. An unknown ID returns 404. UI: the status display changes. |
| AC4 | FR-4, NFR-1 | Updating the description saves the new text, and an empty edit returns 400. UI: edit then save updates the text, and cancel restores the original. |
| AC5 | FR-5 | Deleting returns success, the task no longer appears in the list, and a second delete returns 404. |
| AC6 | FR-6 | Create tasks, restart the server with the same DB file, then list: the same tasks and statuses are present. UI: tasks are still there after a browser refresh. |
| NFR-2 | – | A description such as `<img src=x onerror=alert(1)>` is stored and shown as literal text, and no script runs. |
| NFR-3 | – | By default the server listens only on 127.0.0.1. |
