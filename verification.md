# Verification: Todo Application

| Field | Value |
|-------|-------|
| Story | Create a Simple Todo Application (Confluence page 786433 v3) |
| Run ID | todo-application-20261110065333-2618c391 |
| Branch | story/todo-application-20261110065333-2618c391 (confirmed with `git -C <repo> branch --show-current`; HEAD = base SHA, changes uncommitted) |
| Base SHA | 07f7b63e45552939c442c62d3985e811892e4319 |
| Date | 2026-11-10 |
| Environment | Windows, Windows PowerShell 5, Node v24.22.1 |
| Inputs | `requirements.md`, `architecture.md`, `design-review.md` (round 1 PASS), `impl-plan.md`, code review round 1 (PASS, non-blocking N-1..N-4) |
| Status | **Automated verification only. No human approval is implied.** |

> This replaces the inherited "Welcome Page" verification. That version is still in Git history and is not evidence for this story.

**Overall outcome: PASS** (all applicable checks ran and passed; see §6 for untested items and §7 for non-blocking observations).

Repo below = `C:\Users\PalashManna\Desktop\Copilot-capston\capstone-github`.

## 1. Automated unit and integration tests
Command:
```
cmd /c "cd /d C:\Users\PalashManna\Desktop\Copilot-capston\capstone-github\todo-app && node --test test/*.test.js"
```
Summary from the actual output:
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
Exit code: **0**. The suite was run three times in this stage (the second and third runs filtered output for warnings/failures and suite names); all three exited 0 and no `✖`/`not ok` lines or ExperimentalWarning lines appeared.

Suites that ran (top level): API and static integration (AC1–AC5 sub-suites), 500 path with a closed database (L-4), loadConfig, db repository (:memory:), db repository: IDs are never reused, db close(), db open errors, db repository (temp file), public/app.js, public/index.html, public/styles.css, persistence across restart (AC6), security controls, loopback binding (NFR-3), MAX_DESCRIPTION, validateCreate, validatePatch, validateDescription, parseId.

## 2. Welcome-page regression
Command: `cmd /c C:\Users\PalashManna\Desktop\Copilot-capston\capstone-github\tests\verify-welcome.cmd`
```
Checking: C:\Users\PalashManna\Desktop\Copilot-capston\capstone-github\tests\..\index.html
PASS: file exists and is non-empty
PASS: exact heading text
PASS: doctype, html lang, meta charset present
PASS: no forbidden content
RESULT: ALL CHECKS PASSED
```
Exit code: **0**.

Command: `git -C <repo> diff --exit-code 07f7b63e45552939c442c62d3985e811892e4319 -- index.html tests/verify-welcome.cmd`
Output: none. Exit code: **0** (both files unchanged from base).

## 3. Working-tree scope
Command: `git -C <repo> status --short --untracked-files=all` (run before and after the smoke test; identical both times):
```
 M README.md
 M architecture.md
 M design-review.md
 M impl-plan.md
 M requirements.md
?? todo-app/.gitignore
?? todo-app/README.md
?? todo-app/package.json
?? todo-app/public/app.js
?? todo-app/public/index.html
?? todo-app/public/styles.css
?? todo-app/server.js
?? todo-app/src/api.js
?? todo-app/src/app.js
?? todo-app/src/config.js
?? todo-app/src/db.js
?? todo-app/src/http-utils.js
?? todo-app/src/static.js
?? todo-app/src/validation.js
?? todo-app/test/api.test.js
?? todo-app/test/config.test.js
?? todo-app/test/db.test.js
?? todo-app/test/frontend-static.test.js
?? todo-app/test/persistence.test.js
?? todo-app/test/security.test.js
?? todo-app/test/validation.test.js
```
Result: **PASS**. Only the allowed paths are changed. No `todo-app/data/`, `node_modules/`, `package-lock.json`, `.env` or other secret files. `todo-app/package.json` has no dependencies; `todo-app/.gitignore` contains `data/`. (This `verification.md` becomes ` M verification.md` once written by this stage.)

## 4. End-to-end HTTP smoke test (real server process)
Setup: free loopback port found with a .NET `TcpListener` on port 0 → **52592**. Temp DB: `<repo>\.verify-smoke-2618c391.db` (did not exist before). Server started with `TODO_PORT=52592`, `TODO_DB_PATH=<temp DB>` via `Start-Process node server.js` (working dir `todo-app`), PID 24860. Requests made with `Invoke-WebRequest` against `http://127.0.0.1:52592`.

Actual results (timestamps as returned):
```
GET / -> 200 len=1108 title=Todo
GET /api/tasks -> 200 {"tasks":[]}
POST /api/tasks {"description":"  Buy milk  "} -> 201 {"id":1,"description":"Buy milk","completed":false,"createdAt":"2026-11-10T07:26:52.575Z","updatedAt":"2026-11-10T07:26:52.575Z"}
POST /api/tasks {"description":"   "} -> 400 {"error":{"code":"VALIDATION_ERROR","message":"Description must not be empty."}}
POST /api/tasks (201 x 'a') -> 400 {"error":{"code":"VALIDATION_ERROR","message":"Description must be at most 200 characters."}}
POST /api/tasks {"description":"Walk dog"} -> 201 {"id":2,"description":"Walk dog","completed":false,...}
GET /api/tasks -> 200 {"tasks":[{"id":1,"description":"Buy milk","completed":false,...},{"id":2,"description":"Walk dog","completed":false,...}]}
PATCH /api/tasks/1 {"completed":true}  -> 200 {"id":1,...,"completed":true,...,"updatedAt":"2026-11-10T07:26:52.733Z"}
PATCH /api/tasks/1 {"completed":false} -> 200 {"id":1,...,"completed":false,...,"updatedAt":"2026-11-10T07:26:52.806Z"}
PATCH /api/tasks/1 {"completed":true}  -> 200 {"id":1,...,"completed":true,...,"updatedAt":"2026-11-10T07:26:52.849Z"}
PATCH /api/tasks/999 {"completed":true} -> 404 {"error":{"code":"NOT_FOUND","message":"Task not found."}}
PATCH /api/tasks/1 {"description":"Buy oat milk"} -> 200 {"id":1,"description":"Buy oat milk","completed":true,...}
PATCH /api/tasks/1 {"description":""} -> 400 {"error":{"code":"VALIDATION_ERROR","message":"Description must not be empty."}}
POST /api/tasks '{bad json' -> 400 {"error":{"code":"INVALID_JSON","message":"Request body is not valid JSON."}}
DELETE /api/tasks/2 -> 204
DELETE /api/tasks/2 -> 404 {"error":{"code":"NOT_FOUND","message":"Task not found."}}
GET /api/tasks -> 200 {"tasks":[{"id":1,"description":"Buy oat milk","completed":true,"createdAt":"2026-11-10T07:26:52.575Z","updatedAt":"2026-11-10T07:26:52.900Z"}]}
```
(The 400/404 bodies were captured in a second pass with PowerShell `ErrorDetails`, because the first pass could not read error bodies in PowerShell 5; status codes were identical in both passes. The repeat `DELETE /api/tasks/2` and invalid-input requests do not change state.)

Response headers on `GET /` included: `Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY`, `Content-Type: text/html; charset=utf-8`.

Bind address (`netstat -ano`): `TCP 127.0.0.1:52592 0.0.0.0:0 LISTENING 24860` — loopback only (NFR-3).

Restart (AC6): `Stop-Process -Id 24860` → process no longer running; temp DB file present (12288 bytes). Restarted with the same env (PID 8852):
```
GET /api/tasks (after restart) -> 200 {"tasks":[{"id":1,"description":"Buy oat milk","completed":true,"createdAt":"2026-11-10T07:26:52.575Z","updatedAt":"2026-11-10T07:26:52.900Z"}]}
```
Same task, text and status as before the restart. `Stop-Process -Id 8852` → not running. Cleanup: deleted `.verify-smoke-2618c391.db` (no `-wal`/`-shm` files existed); 0 matching files remain; `todo-app/data` does not exist.

Note: the server was stopped with `Stop-Process` (forced termination), not Ctrl+C, so graceful shutdown was not exercised. Data still persisted.

Result: **PASS**.

## 5. Acceptance criteria → evidence
| AC | Automated test evidence (§1) | Runtime smoke evidence (§4) | Result |
|----|------------------------------|-----------------------------|--------|
| AC1 add task | "AC1 add task" suite; validateCreate "trims the description (AC1)", length/empty rules | POST trimmed "Buy milk" → 201, `completed:false`; empty → 400; 201 chars → 400 | PASS (API) |
| AC2 view all | "AC2 list tasks" suite | GET list returns both tasks, oldest first; empty list `{"tasks":[]}` | PASS (API) |
| AC3 complete/pending | "AC3 toggle status" › "marks complete and pending again, persisted" | PATCH true → false → true, each 200 with new `updatedAt`; unknown id → 404 | PASS (API) |
| AC4 edit | "AC4 edit description" suite; validatePatch "applies the description rules to edits (AC4)" | PATCH description → 200 new text; empty → 400 | PASS (API) |
| AC5 delete | "AC5 delete task" suite | DELETE → 204, gone from list; second DELETE → 404 | PASS (API) |
| AC6 persists | "persistence across restart (AC6)"; "db repository (temp file)" › persists across close/reopen | Server killed and restarted on same DB file: task and status unchanged | PASS (API/server restart) |
| NFR-2 safe rendering | public/app.js static checks (no `innerHTML`), security controls (XSS/SQL round trips) | CSP header present | PASS (static + API; no browser run) |
| NFR-3 local-only | "loopback binding (NFR-3)" | netstat shows 127.0.0.1 only | PASS |
| NFR-5 testability | One documented command, 181/181 pass | – | PASS |
| NFR-7 simplicity | – | `package.json` has no dependencies; no install performed | PASS |

AC1–AC6 UI behaviour (typing, buttons, Enter key, edit/cancel, browser refresh) was **not** exercised in a browser; see §6.

## 6. Not tested / unavailable checks
- **Real browser UI interaction**: no browser automation is available and none is in scope. UI behaviour (add via Enter/Add, toggle, edit save/cancel, delete, empty-state, error message display, browser refresh) is covered only by static checks on `public/*` files plus the API runtime evidence above. Not runtime-verified.
- **Ctrl+C (SIGINT) graceful shutdown**: not exercised; servers were terminated with `Stop-Process`. Also not covered by an automated test (documented in `todo-app/README.md`).
- **`npm.cmd start` / `npm.cmd test`**: not run; the equivalent `node` commands were run directly.
- **Accessibility (screen reader, keyboard)**: only static checks (labels etc.); no assistive-technology testing.
- **CI**: no CI evidence exists or is claimed.
- **Other Node versions / OSes**: only Node v24.22.1 on Windows.

## 7. Known limitations and observations (non-blocking)
From code review round 1:
- **N-1**: unsaved edit text in `public/app.js` is lost when the list reloads due to another action. Not runtime-tested here (UI).
- **N-2**: `public/app.js` step order differs from the plan; reviewer judged it equivalent. No impact on test results.
- **N-3**: `todo-app/README.md` `TODO_HOST` wording: with a non-loopback host, requests whose `Host` header is not one of the allowed values still get 421. The README Host-check paragraph lists the allowed values; the wording could be clearer. Not tested with a non-loopback host.
- **N-4**: non-numeric `Content-Length` handling; reviewer found no impact. Not specifically tested in this stage.

Document-quality observations (this stage):
- `architecture.md` header still says "It has not been through design review" although `design-review.md` round 1 is PASS. Stale point-in-time status label.
- `impl-plan.md` header and task table still say "All tasks PLANNED. Nothing has been implemented or run." Stale point-in-time status after implementation.
- Both are planning-stage snapshots and do not misstate behaviour; they are recorded so the PR/human reviewer is not misled. Not treated as blocking.

## 8. Output-document quality check
| Document | Story/run/branch/base labelling | Consistency with implemented behaviour | Result |
|----------|---------------------------------|----------------------------------------|--------|
| `requirements.md` | Todo story, run ID, branch, base SHA; states it replaces Welcome Page | AC1–AC6, NFR-1 (trim, 200 limit, 400), NFR-3 (127.0.0.1), NFR-4 (404/400) match smoke results | PASS |
| `architecture.md` | Correct story/run/branch/base | Status codes (200/201/204/400/404/…/421/500), boolean `completed` (D-3) match runtime | PASS (stale status label, §7) |
| `design-review.md` | Correct; round 1; `RESULT: PASS`; states automated only | – | PASS |
| `impl-plan.md` | Correct; automated draft | Commands and file list match the tree | PASS (stale work status, §7) |
| `todo-app/README.md` | Marked automated draft, not human-approved | Start/test commands, env vars and defaults (match `src/config.js`), API table, error shape, 200-char limit, 204 delete, `data/` ignored, limitations (no browser tests, Ctrl+C untested) all match code and runtime results | PASS (N-3 wording) |
| Root `README.md` | Points to `todo-app/` | Start/test commands correct; welcome page "unchanged" confirmed by `git diff` exit 0 | PASS |

## 9. Constraints honoured
No implementation files edited; no commit, push, branch switch, stash, reset or package install. Only file written in the repo: this `verification.md` (plus the temporary smoke DB, which was deleted). Both server processes (PIDs 24860, 8852) were stopped by PID.
