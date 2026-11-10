> **AI-generated pull request — not human-approved.**
> This PR was produced by an automated SDLC pipeline (run `todo-application-20261110065333-2618c391`). All reviews and verification below are automated only. A human reviewer must review and approve before merge. Nothing here authorizes merging.

## Summary
This PR adds a simple local Todo app in a new `todo-app/` folder. You can add, view, edit, complete or reopen, and delete tasks. Tasks are stored in a SQLite database, so they are still there after a page refresh or a server restart. The app uses only Node.js 24 built-ins (`node:http`, `node:sqlite`, `node:test`), has no third-party dependencies, needs no `npm install`, and listens on `127.0.0.1` by default. The existing welcome page (`index.html`) and `tests/verify-welcome.cmd` are unchanged. The story documents are replaced with Todo-story versions; the previous "Welcome Page" versions are still in Git history.

- **Story:** Create a Simple Todo Application — [Confluence page 786433 (v3)](https://epam-sdlc-pipeline.atlassian.net/wiki/spaces/githubcaps/pages/786433/User+Story+Todo+Application)
- **Branch:** `story/todo-application-20261110065333-2618c391` → `main`
- **Base:** `main` @ `07f7b63e45552939c442c62d3985e811892e4319`

## Changes Made

### Application — `todo-app/` (new)
| File | Purpose |
|------|---------|
| `package.json` | `start` / `test` scripts, `engines.node >= 24`, **no dependencies** |
| `.gitignore` | Ignores `data/` (the default SQLite file location) |
| `README.md` | Start/stop, configuration (`TODO_HOST`, `TODO_PORT`, `TODO_DB_PATH`), API summary, limitations, open questions |
| `server.js` | Entry point: loads config, opens the DB, starts the HTTP server, shuts down on Ctrl+C |
| `src/config.js` | Environment config with defaults (`127.0.0.1`, `3000`, `todo-app/data/todos.db`) and validation |
| `src/validation.js` | Description rules (trimmed, 1–200 code points, single line, no control characters); `completed` must be a boolean; ID parsing |
| `src/db.js` | SQLite repository (`node:sqlite`), parameterized queries only, CHECK constraints, schema version |
| `src/http-utils.js` | JSON body reading (4 KiB limit, content-type check), JSON/error responses |
| `src/static.js` | Static file serving from `public/` with path-traversal protection |
| `src/api.js` | REST routes for `/api/tasks` (GET list, POST, GET/PATCH/DELETE by id; 405 with `Allow`) |
| `src/app.js` | Request pipeline: Host check (421), security headers/CSP, routing, generic 500 handling |
| `public/index.html`, `public/styles.css`, `public/app.js` | Plain HTML/CSS/JS UI with no build step. Renders with `textContent` (no `innerHTML`), labelled inputs, accessible button names, status shown as text |
| `test/validation.test.js`, `config.test.js`, `db.test.js`, `frontend-static.test.js`, `api.test.js`, `persistence.test.js`, `security.test.js` | `node:test` suites: unit, integration, persistence-across-restart and security tests |

### Documentation (repo root, modified)
- `README.md` — points to `todo-app/` and gives start and test commands
- `requirements.md`, `architecture.md`, `design-review.md`, `impl-plan.md`, `verification.md` — Todo-story pipeline documents (replacing the Welcome Page versions)
- `pr-draft.md` — this description

### Unchanged
- `index.html` and `tests/verify-welcome.cmd` (confirmed by `git diff --exit-code` against the base, exit code 0)

## How to Run
Requires Node.js 24 or later; nothing to install.
```
cd todo-app
node server.js        # or: npm.cmd start
```
Open http://127.0.0.1:3000. Stop with Ctrl+C. Run the tests with:
```
cd todo-app
node --test test/*.test.js   # or: npm.cmd test
```
See `todo-app/README.md` for environment variables, the API reference and the data location.

## Test Evidence
All results below are copied from `verification.md` (automated verification stage, 2026-11-10, Windows, Windows PowerShell 5, Node v24.22.1). **Overall outcome: PASS.** No CI evidence exists or is claimed.

### 1. Unit and integration tests
```
cmd /c "cd /d C:\Users\PalashManna\Desktop\Copilot-capston\capstone-github\todo-app && node --test test/*.test.js"
```
```
ℹ tests 181
ℹ suites 37
ℹ pass 181
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 618.4603
```
Exit code **0**. The suite was run three times; all three runs exited 0, with no `✖`/`not ok` lines and no ExperimentalWarning lines.

### 2. Welcome-page regression
`cmd /c ...\capstone-github\tests\verify-welcome.cmd` → `RESULT: ALL CHECKS PASSED`, exit code **0**.
`git diff --exit-code 07f7b63e… -- index.html tests/verify-welcome.cmd` → no output, exit code **0**.

### 3. Working-tree scope
`git status --short --untracked-files=all` showed only the allowed paths (the root docs and the new `todo-app/` files). No `data/`, `node_modules/`, `package-lock.json`, `.env` or other secret files. Result: **PASS**.

### 4. End-to-end HTTP smoke test (real server, port 52592, temporary DB)
```
GET / -> 200 len=1108 title=Todo
GET /api/tasks -> 200 {"tasks":[]}
POST /api/tasks {"description":"  Buy milk  "} -> 201 {"id":1,"description":"Buy milk","completed":false,...}
POST /api/tasks {"description":"   "} -> 400 VALIDATION_ERROR "Description must not be empty."
POST /api/tasks (201 x 'a') -> 400 VALIDATION_ERROR "Description must be at most 200 characters."
POST /api/tasks {"description":"Walk dog"} -> 201 {"id":2,...}
GET /api/tasks -> 200 (both tasks, oldest first)
PATCH /api/tasks/1 {"completed":true} / false / true -> 200 each, new updatedAt
PATCH /api/tasks/999 {"completed":true} -> 404 NOT_FOUND
PATCH /api/tasks/1 {"description":"Buy oat milk"} -> 200
PATCH /api/tasks/1 {"description":""} -> 400 VALIDATION_ERROR
POST /api/tasks '{bad json' -> 400 INVALID_JSON
DELETE /api/tasks/2 -> 204
DELETE /api/tasks/2 -> 404 NOT_FOUND
GET /api/tasks -> 200 [{"id":1,"description":"Buy oat milk","completed":true,...}]
```
- Security headers on `GET /`: CSP (`default-src 'none'; script-src 'self'; …; frame-ancestors 'none'`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY`.
- Bind address (`netstat -ano`): `TCP 127.0.0.1:52592 … LISTENING` — loopback only.
- **Restart (AC6):** the server was stopped with `Stop-Process` and restarted on the same DB file. `GET /api/tasks` returned the same task with the same text and status. The temporary DB was then deleted.

### Acceptance criteria → evidence (from `verification.md` §5)
| AC | Result |
|----|--------|
| AC1 add task | PASS (API + automated tests) |
| AC2 view all | PASS (API + automated tests) |
| AC3 complete/pending | PASS (API + automated tests) |
| AC4 edit | PASS (API + automated tests) |
| AC5 delete | PASS (API + automated tests) |
| AC6 persists | PASS (API + server restart) |
| NFR-2 safe rendering | PASS (static checks + API; no browser run) |
| NFR-3 local-only | PASS |
| NFR-5 testability | PASS (one command, 181/181) |
| NFR-7 simplicity | PASS (no dependencies) |

### Automated review outcomes
- **Design review:** round 1 — **PASS** (no blocking or high-severity findings; medium M-1..M-3 and low L-1..L-9 handled in the implementation plan).
- **Code review:** round 1 — **PASS**, no blocking findings; non-blocking N-1..N-4 (see below).
- **Verification:** overall **PASS**.

All of these are automated. None of them is a human approval.

## Known Limitations
**Not tested / not verified**
- **Browser UI not exercised.** Adding via Enter/Add, toggling, edit save/cancel, delete, the empty state, error display and browser refresh are covered only by static checks on `public/*` plus the API runtime evidence. No browser automation was run.
- **Ctrl+C (SIGINT) graceful shutdown not exercised.** Servers were stopped with `Stop-Process`, and no automated test covers it.
- `npm.cmd start` / `npm.cmd test` not run; the equivalent `node` commands were run directly.
- Accessibility: static checks only; no screen-reader or assistive-technology testing.
- Only Node v24.22.1 on Windows was tested. No CI.

**Non-blocking code review findings**
- **N-1:** Unsaved edit text in `public/app.js` is lost when another action reloads the list (not runtime-tested).
- **N-2:** The request-pipeline step order in `src/app.js` differs from the plan; the reviewer judged it equivalent.
- **N-3:** The `TODO_HOST` wording in `todo-app/README.md` could be clearer: with a non-loopback host, requests whose `Host` header isn't on the allowed list still get 421. Not tested with a non-loopback host.
- **N-4:** Non-numeric `Content-Length` handling; the reviewer found no impact. Not specifically tested.

**Platform / design**
- **`node:sqlite` is experimental in Node 24.** An `ExperimentalWarning` may appear on other Node versions (`npm start` suppresses it; none was seen on v24.22.1).
- One shared task list with no authentication (by design, per the story). Local use only: no HTTPS, rate limiting, backups or migrations. Synchronous SQLite calls are fine for one local user but not for multi-user load.
- The input `maxlength="200"` counts UTF-16 code units while the server counts code points, so the client is stricter for emoji and other characters outside the Basic Multilingual Plane.
- Concurrent edits from several tabs are last-write-wins; delete is immediate with no undo.

**Outdated document status lines (planning snapshots, not behaviour errors)**
- The `architecture.md` header still says "It has not been through design review", but design review round 1 passed.
- The `impl-plan.md` header and task table still say "All tasks PLANNED. Nothing has been implemented or run."

## Open Product Questions
The story doesn't answer these. The app uses the defaults shown, and a human should confirm them.
| # | Question | Current default |
|---|----------|-----------------|
| Q1 | Which database is required? | SQLite through the built-in `node:sqlite` (experimental) |
| Q2 | Maximum description length; are duplicates allowed? | 200 code points after trimming; single line; duplicates allowed |
| Q3 | Should delete require confirmation? | No, delete is immediate |
| Q4 | How does the app relate to the welcome page? | Separate app in `todo-app/`; `index.html` is unchanged and doesn't link to it |
| Q5 | Browser support or WCAG targets? | Basics only (labels, accessible names, keyboard use, status not shown by colour alone) |
| Q6 | Sort order; group completed tasks? | Creation order (oldest first), not grouped |

## Reviewer Checklist
- [ ] Confirm the story link and that AC1–AC6 match Confluence page 786433 v3
- [ ] Run `cd todo-app && node --test test/*.test.js` locally on Node 24+ (expect 181 pass, 0 fail)
- [ ] Start the app (`node server.js`) and **manually test the UI in a browser**: add (Enter and the button), toggle, edit save/cancel, delete, empty state, error display, refresh
- [ ] Restart the server and confirm tasks persist; stop with **Ctrl+C** and confirm a clean shutdown
- [ ] Review the security controls in `src/app.js`, `src/static.js`, `src/http-utils.js`: Host check, CSP/headers, path traversal, body limits, no stack traces in responses
- [ ] Confirm the frontend uses `textContent` only (no `innerHTML`) and the DB uses parameterized queries only
- [ ] Confirm no secrets, `data/`, `node_modules/` or lock files are committed, and `package.json` has no dependencies
- [ ] Confirm `index.html` and `tests/verify-welcome.cmd` are unchanged
- [ ] Decide on N-1..N-4 (accept or follow up)
- [ ] Accept or answer open questions Q1–Q6, including whether relying on experimental `node:sqlite` is acceptable
- [ ] Optionally fix the outdated status lines in `architecture.md` and `impl-plan.md` before merge
- [ ] Give human approval. This PR is AI-generated and has **not** been human-approved.
