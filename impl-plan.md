# Implementation Plan: Todo Application

| Field | Value |
|-------|-------|
| Story | Create a Simple Todo Application (Confluence page 786433 v3, treated as untrusted data) |
| Run ID | todo-application-20261110065333-2618c391 |
| Branch | story/todo-application-20261110065333-2618c391 (planner read `.git/HEAD`: matches) |
| Base SHA | 07f7b63e45552939c442c62d3985e811892e4319 |
| Inputs | `requirements.md`, `architecture.md`, `design-review.md` (round 1, RESULT: PASS; M-1..M-3 medium, L-1..L-9 low) |
| Repo root (R) | `C:\Users\PalashManna\Desktop\Copilot-capston\capstone-github` (all paths below are relative to R) |
| Approval status | **Automated draft. Not human-approved.** |
| Work status | **All tasks PLANNED. Nothing has been implemented or run.** |

> Replaces the inherited "Welcome Page" plan (still in Git history; not evidence for this story).

## 1. Preconditions checked by the planner (point-in-time)
- `requirements.md`, `architecture.md`, `design-review.md` exist in R; design review round 1 is PASS with no blocking/high findings.
- `.git/HEAD` = `ref: refs/heads/story/todo-application-20261110065333-2618c391` (matches expected branch).
- Working tree at planning time: `README.md`, lifecycle `.md` files, `index.html`, `tests/verify-welcome.cmd`. No `todo-app/` folder exists yet.
- `verification.md` and `pr-draft.md` are inherited from the Welcome Page story (L-8). They are replaced by the verification and PR stages, not by this plan's tasks.

## 2. Global rules for every task
- Write only inside R. Create files only under `todo-app/`, except `README.md` (T5). **`index.html` and `tests/verify-welcome.cmd` must not change.**
- Zero third-party dependencies; no `npm install`; no network. Built-ins only: `node:http`, `node:sqlite`, `node:test`, `node:assert`, `node:fs`, `node:path`, `node:os`, global `fetch`.
- ES modules (`"type": "module"`). Use `npm.cmd`, never `npm` (PowerShell policy).
- No git commit/push/branch operations by implementers (orchestrator owns Git). Read-only `git status` / `git diff` are allowed for verification.
- Test files live only in `todo-app/test/` and are named `*.test.js`. No helper files under `test/` (Node would execute them); shared helpers go inside the test file or `src/`.
- `ExperimentalWarning: SQLite is an experimental feature` on stderr is expected and is not a failure (L-9, RD-4).
- Each task reports the exact commands run, their real output summary (pass/fail counts) and exit codes. Never claim a result that was not run.

### Canonical test command (Node 24, Windows)
```
cd /d C:\Users\PalashManna\Desktop\Copilot-capston\capstone-github\todo-app
node --test test/*.test.js
```
- `cmd.exe` does not expand the glob; Node 24's test runner expands it itself. The same string is the `test` script in `package.json`, so `npm.cmd test` is equivalent.
- Bare `node --test` (no args) also works because Node's default patterns match `test/**/*.js` and `**/*.test.js`, but the explicit glob is the documented, canonical form.
- A task's tests pass only if the summary shows `# fail 0` and the process exits 0. A single file can be run with `node --test test/<name>.test.js`.

### Welcome page regression (run in T5 and by verification)
```
cd /d C:\Users\PalashManna\Desktop\Copilot-capston\capstone-github
cmd /c tests\verify-welcome.cmd
git diff --exit-code 07f7b63e45552939c442c62d3985e811892e4319 -- index.html tests/verify-welcome.cmd
```
Both must exit 0.

## 3. Task summary (priority order = execution order)

| ID | Pri | Title | Depends on | Status | Blocked reason |
|----|-----|-------|-----------|--------|----------------|
| T1 | P1 | Scaffold, config, validation and DB layer + unit tests | none | PLANNED | none |
| T2 | P1 | Frontend static files (`public/`) + static check test | T1 | PLANNED | Waits for T1 (needs `package.json` and test layout). No other blocker. |
| T3 | P1 | HTTP server, API, static serving, security controls + API and persistence integration tests | T1, T2 | PLANNED | Waits for T1 (repository, validation, config) and T2 (files to serve). No other blocker. |
| T4 | P1 | Security test suite and hardening fixes | T3 | PLANNED | Waits for T3. No other blocker. |
| T5 | P2 | Docs (`todo-app/README.md`, root README pointer) and full regression run | T1–T4 | PLANNED | Waits for T1–T4. No other blocker. |

Dependency graph: `T1 → T2 → T3 → T4 → T5` (T2 only needs T1; it is ordered before T3 so T3's static-serving tests have real files).

## 4. Task details

### T1 — Scaffold, config, validation and DB layer + unit tests
**Goal:** Project skeleton and the pure/persistence core, fully unit-tested, with no HTTP yet.

**Files to create**
- `todo-app/package.json` — `{"name":"todo-app","private":true,"type":"module","engines":{"node":">=24"},"scripts":{"start":"node --disable-warning=ExperimentalWarning server.js","test":"node --test test/*.test.js"}}`. No `dependencies`/`devDependencies` (L-9, RD-4).
- `todo-app/.gitignore` — `data/`.
- `todo-app/src/validation.js` — pure: `validateCreate(body)`, `validatePatch(body)`, `parseId(str)`, plus exported `MAX_DESCRIPTION = 200`. Return `{ ok:true, value }` or `{ ok:false, message }`.
  - Body must be a plain object (not array/null/primitive). Unknown fields rejected. `PATCH {}` rejected.
  - `description`: string, `trim()`, 1–200 code points (`[...s].length`), and rejects (L-3, adopted, extends D-4): C0 `U+0000–U+001F`, `U+007F`, C1 `U+0080–U+009F`, `U+2028`, `U+2029`, and non-well-formed strings (lone surrogates, `!s.isWellFormed()`).
  - `completed`: JSON boolean only (D-3).
  - `parseId`: `^[1-9][0-9]{0,15}$` and `Number.isSafeInteger`, else `null` (→ 404 at the API layer).
- `todo-app/src/config.js` — *(plan decision: a small addition to the §3 layout so env parsing is unit-testable)* `loadConfig(env, appDir)` → `{ host, port, dbPath, warnings[] }` or throws a one-line `Error`.
  - `TODO_HOST` default `127.0.0.1`; a non-loopback value adds a warning.
  - `TODO_PORT` default `3000`; must be an integer 0–65535, otherwise throw.
  - `TODO_DB_PATH` default `<appDir>/data/todos.db`. A **relative** value resolves against `appDir` (`todo-app/`), not the cwd (L-5, adopted). `:memory:` is kept as-is and adds the warning "data will not persist" (L-5).
- `todo-app/src/db.js` — `openDatabase(path)` → repository `{ list(), get(id), create(description), update(id, {description?, completed?}), remove(id), close() }`.
  - `DatabaseSync`; schema exactly as architecture §6 (`AUTOINCREMENT`, CHECK constraints), `CREATE TABLE IF NOT EXISTS`, `PRAGMA user_version = 1`, default journal mode (not WAL).
  - Prepared statements with `?` placeholders only; no SQL built from input (NFR-2).
  - Row mapping: `completed` 0/1 ↔ boolean, `created_at`/`updated_at` → `createdAt`/`updatedAt` (ISO-8601 UTC from the app). `update` sets a new `updatedAt`; `update`/`remove`/`get` return `null`/`false` for unknown IDs. `list()` orders by `id ASC` (A-5).
  - `close()` is idempotent (a second call is a no-op), needed by M-2 and the closed-DB 500 test (L-4).
  - The parent directory is **not** created here (that is `server.js`'s job, §8); `openDatabase` throws a clear error if the open fails.
- `todo-app/test/validation.test.js` — trimming (`"  Buy milk  "` → `"Buy milk"`); empty/whitespace-only; exactly 200 vs 201 code points, including 200 emoji (accepted) vs 201 emoji (rejected); each control-character class above; lone surrogate; non-string description; `completed` as `"true"`, `1`, `null`; unknown field; `id`/`createdAt` in the body; `{}` PATCH; array/null/number bodies; `parseId` for `"1"`, `"0"`, `"01"`, `"-1"`, `"1.5"`, `"abc"`, 17 digits, `"9007199254740993"`.
- `todo-app/test/config.test.js` — defaults; relative DB path resolved under `appDir`; absolute path kept; `:memory:` warning; invalid ports (`-1`, `65536`, `abc`, `3.5`) throw; `0` accepted; non-loopback host warning.
- `todo-app/test/db.test.js` (`:memory:` and a temp-file DB) — CRUD round trip; `id ASC` order; boolean mapping; new task is `completed:false`; `updatedAt` refreshed on update (assert `>= createdAt`, not strictly greater); deleted ID is not reused (create 1, 2 → delete 2 → create → id 3); CHECK constraints reject an empty and a 201-character description when inserted directly; SQL-looking input (`'); DROP TABLE tasks;--`) is stored literally; `close()` twice does not throw; temp-file DB reopened after `close()` keeps rows and `user_version = 1`. Temp dirs: `fs.mkdtempSync(path.join(os.tmpdir(), 'todo-'))`, removed in `after()` **after** `close()` with `fs.rmSync(dir, { recursive:true, force:true, maxRetries:3 })` (M-2).

**Acceptance / verification**
1. `cd /d R\todo-app && node --test test/*.test.js` → exit 0, `# fail 0`, three test files run (validation, config, db).
2. `package.json` has no `dependencies`/`devDependencies`; no `node_modules/` or `package-lock.json` created.
3. No `todo-app/data/` folder created by tests.
4. `git status --short` shows only new paths under `todo-app/`.

**Traces:** FR-1, FR-4, FR-6, FR-7 (data layer), NFR-1, NFR-2, NFR-3 (config), NFR-5, NFR-7; A-3, A-5, D-3, D-4, D-5, D-8. **Review findings:** L-3 (adopted), L-4 (closed-DB approach enabled via idempotent `close()`), L-5 (adopted), L-9 (adopted), M-2 (DB close + Windows-safe temp cleanup).

---

### T2 — Frontend static files + static check test
**Goal:** The complete vanilla UI, written against the API contract in architecture §5, plus a static safety/accessibility check. Behaviour against a live server is exercised in T3 (smoke) and in the manual UI check.

**Files to create**
- `todo-app/public/index.html` — `<!DOCTYPE html>`, `lang="en"`, `<meta charset="utf-8">`, viewport, title "Todo". `<link rel="stylesheet" href="/styles.css">` and `<script type="module" src="/app.js"></script>` only. Semantic structure: `<main>`, `<h1>`, `<form id="add-form">` with `<label for="new-task">` + `<input id="new-task" name="description" maxlength="200" required autocomplete="off">` + `<button type="submit">Add</button>`; an error region `<p id="error" role="status" aria-live="polite">`; `<ul id="task-list">`; an empty-state element ("No tasks yet."); `<noscript>` message (§11). **No** inline `<script>`/`<style>`, no `style=` attributes, and no `on*=` handlers (so the CSP in §7 does not block anything).
- `todo-app/public/styles.css` — simple readable layout; visible focus outline; completed items have strikethrough **and** a text badge (not colour alone, NFR-6); a `.visually-hidden` utility if needed.
- `todo-app/public/app.js` — frontend logic per architecture §9 / D-7:
  - On load: `GET /api/tasks` and render.
  - Rendering uses only `document.createElement`, `textContent`, `value`, `setAttribute`, `append`/`replaceChildren`. No `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval`, `new Function`, or string `setTimeout`.
  - Per item: checkbox (`aria-label` "Mark complete: {desc}" / "Mark pending: {desc}"); text badge "Completed"/"Pending"; "Edit" button (`aria-label` "Edit task: {desc}") switching to an input with Save/Cancel (Enter saves, Escape cancels, Cancel restores the original text); "Delete" button (`aria-label` "Delete task: {desc}"), immediate (A-6).
  - Client validation (L-1, adopted): `trim()` then `[...s].length` between 1 and 200 and the same control-character rule as the server; shows the message and does not send. `maxlength="200"` is kept; the known difference (UTF-16 units vs code points, so the client can be stricter for emoji) is documented in the T5 README.
  - After each successful mutation: re-fetch the list (D-7). On failure: show the server `error.message` (or "Cannot reach server" when `fetch` rejects) in `#error`; keep the add/edit input text; the list stays as it was (NFR-4).
  - On a **404** from toggle/edit/delete: show the error, **then** re-fetch the list (L-6, adopted).
  - Disable controls while a request is in flight. Clear the add input only on success. Clear `#error` on the next successful action.
  - All requests use relative URLs (`/api/tasks…`) and `Content-Type: application/json` for POST/PATCH.
- `todo-app/test/frontend-static.test.js` — reads files with `fs` (no server):
  - `public/app.js` does not contain `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval(`, `new Function`.
  - `public/index.html` has no inline `<script>` with content, no `<style>`, no `style=`, no `on[a-z]+=` attribute; has `<label for="new-task">` and `id="new-task"`; references only `/app.js` and `/styles.css` (no other `src=`/`href=` values, no `http:`/`https:`); has `aria-live`; has `<noscript>`.
  - `public/app.js` contains the strings `textContent`, `Delete task: `, `Edit task: `, and a code-point length check (`[...`).

**Acceptance / verification**
1. `cd /d R\todo-app && node --test test/frontend-static.test.js` → exit 0, `# fail 0`.
2. `node --test test/*.test.js` → all T1 + T2 tests pass.
3. `node --check public/app.js` → exit 0 (syntax check; it is an ES module, so if `--check` reports module-syntax issues, run `node --input-type=module --check < public\app.js` instead and record which was used).
4. `git status --short` shows only new paths under `todo-app/`.

**Traces:** FR-1, FR-2, FR-3, FR-4, FR-5, FR-6 (reload on load), FR-7, NFR-1 (client mirror), NFR-2, NFR-4, NFR-6; A-5, A-6, D-7. **Review findings:** L-1 (adopted), L-6 (adopted).

---

### T3 — HTTP server, API, static serving and security controls + integration tests
**Goal:** A working server that serves the T2 files and the full REST API from architecture §5, with every control from §7 and the M-1/M-2/M-3 mitigations, tested over real HTTP.

**Files to create**
- `todo-app/src/http-utils.js`
  - `sendJson(res, status, obj)`, `sendError(res, status, code, message)` (error shape `{ error: { code, message } }`, never a stack or SQL text), `applySecurityHeaders(res, { api })` (exact CSP string, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY`; API adds `Cache-Control: no-store`). No CORS headers ever.
  - `readJsonBody(req, { limit = 4096 })` (**M-3**):
    - Checks `Content-Type` media type is `application/json` (parameters allowed, case-insensitive) **before** reading → 415.
    - If `Content-Length` > 4096 → reject with 413 immediately, without reading.
    - While streaming, counts bytes; once over 4096 → stop buffering (discard further chunks) and reject with 413.
    - Every 413 response sets `Connection: close` so the half-read connection is not reused.
    - Listens for `req` `error` and `aborted`/`close`-before-end: settles the promise once, with no unhandled rejection or crash, and does not try to write a response to a destroyed socket.
    - `JSON.parse` failure → 400 `INVALID_JSON`.
- `todo-app/src/static.js` — allowlist map: `/` and `/index.html` → `public/index.html` (`text/html; charset=utf-8`), `/app.js` (`text/javascript; charset=utf-8`), `/styles.css` (`text/css; charset=utf-8`). Files are resolved from fixed paths built with `import.meta.dirname`; the request path is **never** joined to a filesystem path. Only `GET`/`HEAD` (HEAD sends headers only); other methods → 405 with `Allow: GET, HEAD`. Anything else → 404.
- `todo-app/src/api.js` — handlers for `GET/POST /api/tasks`, `GET/PATCH/DELETE /api/tasks/{id}` exactly per §5: 201 + `Location: /api/tasks/{id}`; 204 with no body on delete; 404 `NOT_FOUND` for unknown/invalid IDs; 400 `VALIDATION_ERROR` with the validation message; 405 + `Allow` (`GET, POST` for the collection; `GET, PATCH, DELETE` for an item); unknown `/api/...` → 404.
- `todo-app/src/app.js` — `createApp({ dbPath, host = '127.0.0.1', port = 0 })` → `{ server, db, listen(), close(), address() }`.
  - Pipeline per request: Host check → security headers → URL parse → route (`/api/` prefix → API, else static) → `try/catch` around everything → generic 500 `INTERNAL_ERROR`, with details logged to `console.error` only.
  - **URL normalization (L-2, adopted):** `new URL(req.url, 'http://localhost').pathname`; the query string is ignored; no trailing-slash normalization (`/api/tasks/` → 404); the pathname is never used as a filesystem path.
  - **Host allowlist (M-1):** built in `listen()` **after** binding, from `server.address().port`: `127.0.0.1:{port}`, `localhost:{port}`, `[::1]:{port}`, plus `{configuredHost}:{port}`. Compared case-insensitively. A missing or non-allowlisted `Host` → 421 `MISDIRECTED_REQUEST`.
  - `listen()` returns a Promise that resolves to `{ host, port }` (the bound values) and rejects on `error` (e.g. `EADDRINUSE`).
  - **`close()` (M-2):** idempotent Promise. It calls `server.close()`, then `server.closeAllConnections()` so keep-alive `fetch` sockets do not hang it, awaits the close callback, then calls `db.close()`. If the server never listened, it only closes the DB.
  - **500 test hook (L-4):** the closed-DB approach is chosen; no extra `repo` parameter is added (optional parameter declined to keep the API as designed).
- `todo-app/server.js` — CLI: `loadConfig(process.env, import.meta.dirname)`; prints warnings; creates the DB parent directory (`fs.mkdirSync(..., { recursive:true })`) unless `:memory:`; `createApp(...).listen()`; logs `Todo app listening on http://{host}:{port}`. On a config/DB/listen error, logs one line and exits with code 1. Handles **SIGINT** (Ctrl+C, the documented stop method on Windows, M-2) and SIGTERM (best-effort): `await app.close()` then exits 0.
- `todo-app/test/api.test.js` — one `createApp({ dbPath: ':memory:', port: 0 })` per suite; `before` → `listen()`, `after` → `await close()`; requests via `fetch` to `http://127.0.0.1:{port}`.
  - AC1: POST `"  Buy milk  "` → 201, trimmed, `completed:false`, `Location` header; empty, whitespace-only and 201-char → 400.
  - AC2: GET list returns all created tasks in creation order.
  - AC3: PATCH `completed:true` then `false` → 200 each and persisted (re-GET); unknown ID → 404.
  - AC4: PATCH description → 200 with the new text; empty edit → 400; `updatedAt` present.
  - AC5: DELETE → 204, empty body; task gone from list; second DELETE → 404.
  - GET `/api/tasks/{id}` 200/404; invalid ID forms (`0`, `abc`, `01`) → 404.
  - Invalid JSON → 400 `INVALID_JSON`; array body → 400; unknown field → 400; `completed:"true"` → 400.
  - 415 on `text/plain`; `application/json; charset=utf-8` accepted.
  - 405 + correct `Allow` on `PUT /api/tasks` and `POST /api/tasks/1`; unknown `/api/nope` → 404; `/api/tasks/` → 404; `/api/tasks?x=1` → 200 (L-2).
  - **M-3:** 413 for a 5 KiB body (with `Content-Length`) and for a ~64 KiB body sent **chunked** (via `node:http` request without `Content-Length`); each response has `Connection: close`; **afterwards a normal `GET /api/tasks` still returns 200**. A client that aborts mid-body (`req.destroy()` after a partial write) does not crash the server (a follow-up GET returns 200).
  - **M-1:** every request above runs on an ephemeral port with the default `fetch` Host header, so it proves the bound-port allowlist works; plus an explicit test that `Host: LOCALHOST:{port}` passes (case-insensitive).
  - 500 path (L-4): a separate app instance; call `app.db.close()`, then `GET /api/tasks` → 500, body `{ error: { code:'INTERNAL_ERROR' } }`, and the body has no `at ` stack frames or `SQL` text; then `await app.close()` does not throw.
  - Static smoke: `GET /` → 200 `text/html`, `GET /app.js` → 200 `text/javascript`, `GET /styles.css` → 200 `text/css`, `HEAD /` → 200 with empty body, `GET /?x=1` → 200, `POST /` → 405.
- `todo-app/test/persistence.test.js` — AC6/FR-6 on a temp-file DB: app A creates 3 tasks and toggles one → `await A.close()` → app B `createApp` on the **same file** → list is deep-equal (ids, descriptions, completed, timestamps) → B creates one more and gets the next id → `await B.close()` → `fs.rmSync(dir, { recursive:true, force:true, maxRetries:3 })` (M-2). The test must finish without hanging (the default test runner timeout is not relied on; add `{ timeout: 30000 }` on the suite).

**Acceptance / verification**
1. `cd /d R\todo-app && node --test test/*.test.js` → exit 0, `# fail 0`; files validation, config, db, frontend-static, api, persistence all run; the run completes (no hang from open handles).
2. Startup smoke (record actual output; skip and record "not run" only if background processes are impossible in the environment):
   `set TODO_PORT=3999&& set TODO_DB_PATH=%TEMP%\todo-smoke.db&& node server.js` in one console, then `curl -s -i http://127.0.0.1:3999/api/tasks` → `200` with `{"tasks":[]}` (or prior smoke data); `curl -s -o NUL -w "%{http_code}" -H "Host: evil.example" http://127.0.0.1:3999/` → `421`. Stop with Ctrl+C (exit 0), then delete `%TEMP%\todo-smoke.db`.
3. Invalid config: `set TODO_PORT=abc&& node server.js` → one-line error, exit code 1 (`echo %ERRORLEVEL%`).
4. No `todo-app/data/` created by tests; `git status --short` shows only new paths under `todo-app/`.

**Traces:** FR-1…FR-8, NFR-1, NFR-2, NFR-3, NFR-4, NFR-5, NFR-7; AC1–AC6; A-4, A-7, D-6, D-8. **Review findings:** M-1, M-2, M-3 (all required, handled here), L-2 (adopted), L-4 (closed-DB approach; optional `repo` param declined), L-7 (declined, see §6).

---

### T4 — Security test suite and hardening fixes
**Goal:** An independent, adversarial check of the §7 controls. Any defect found is fixed in `src/` within this task.

**Files to create / modify**
- Create `todo-app/test/security.test.js`:
  - **Headers:** on `/`, `/app.js`, `/api/tasks`, a 404 and a 400, the exact CSP string, `nosniff`, `no-referrer`, `DENY` are present; API responses have `Cache-Control: no-store`; no `Access-Control-Allow-Origin` anywhere (including the response to an `OPTIONS /api/tasks` with `Origin` and `Access-Control-Request-Method: DELETE`, which must not be 2xx with CORS headers).
  - **Path traversal:** send **raw** paths with `node:http.request({ path })`, **not** `fetch`, because WHATWG URL parsing in `fetch` normalizes `..`, `%2e%2e` and `\` before sending: `/../server.js`, `/%2e%2e/src/db.js`, `/public/../package.json`, `/..%2fpackage.json`, `/\..\server.js`, `/public/index.html`, `/server.js`, `/src/app.js`, `/data/todos.db` → all 404, and no body contains file contents (e.g. no `import ` / `CREATE TABLE`).
  - **Host check (M-1):** `Host: evil.example`, `Host: 127.0.0.1:{otherPort}` → 421; `Host: 127.0.0.1:{port}`, `localhost:{port}`, `[::1]:{port}` → not 421. (Send raw with `node:http` so the Host header can be set.)
  - **Binding (NFR-3):** `createApp({ dbPath:':memory:', port:0 })` with **no host** → after `listen()`, `server.address().address === '127.0.0.1'`.
  - **XSS round trip (NFR-2):** POST `<img src=x onerror=alert(1)>` → 201; GET returns the identical literal string; response `Content-Type` is JSON (not HTML).
  - **SQL injection:** POST `x'); DROP TABLE tasks;--` → stored literally; list still works.
  - **Error disclosure:** malformed JSON and the closed-DB 500 contain no stack frames, file paths or SQL.
  - **Content-type / CSRF-style:** `POST` with `application/x-www-form-urlencoded` and `text/plain` (the "simple" cross-site form types) → 415, and no task is created.
- Modify (only if a test exposes a defect): `todo-app/src/*.js`. Each fix is listed in the task report with the test that found it.

**Acceptance / verification**
1. `cd /d R\todo-app && node --test test/security.test.js` → exit 0, `# fail 0`.
2. `node --test test/*.test.js` → all 7 files pass, exit 0, no hang.
3. Report lists every defect found and fixed (or "none found").

**Traces:** NFR-2, NFR-3, NFR-4, FR-8 (no auth, no CORS); architecture §7 controls. **Review findings:** M-1 (negative cases), L-2 (raw-path checks), L-7 (verifies the preflight/415 basis for declining it).

---

### T5 — Documentation and full regression run
**Goal:** Users can start, configure, stop and test the app; the welcome page is proven unchanged; the full suite is green.

**Files**
- Create `todo-app/README.md`: purpose; requirements (Node ≥ 24, no install step); start (`cd todo-app` → `npm.cmd start` or `node server.js`), URL `http://127.0.0.1:3000`; stop with **Ctrl+C** (SIGTERM is not reliable on Windows, M-2); config table (`TODO_HOST`, `TODO_PORT`, `TODO_DB_PATH`, relative paths resolved against `todo-app/`, `:memory:` does not persist — L-5); data location and `.gitignore`; test command `node --test test/*.test.js` / `npm.cmd test`; API summary table (from §5); the expected `ExperimentalWarning` caveat (L-9); limitations (shared list with no auth, local-only, no automated browser tests, `maxlength` vs code-point difference — L-1, single-line descriptions and rejected control/C1/line-separator characters — L-3, delete has no confirmation — A-6); open questions Q1–Q6 as unconfirmed defaults.
- Modify `README.md` (root): add a short "Todo application" section that points to `todo-app/README.md` and gives the start and test commands (L-8). Keep the existing `# capstone-github` heading.
- No change to `index.html`, `tests/verify-welcome.cmd`, or the lifecycle documents.

**Acceptance / verification**
1. `cd /d R\todo-app && node --test test/*.test.js` → exit 0, `# fail 0`, 7 test files.
2. `cd /d R\todo-app && npm.cmd test` → exit 0 (same result).
3. Welcome regression (§2): `cmd /c tests\verify-welcome.cmd` → exit 0, and `git diff --exit-code 07f7b63e45552939c442c62d3985e811892e4319 -- index.html tests/verify-welcome.cmd` → exit 0.
4. `git status --short` shows only `todo-app/` (new), `README.md` (modified) and the lifecycle `.md` files changed by earlier stages; no `todo-app/data/`, `node_modules/` or `package-lock.json`.
5. Every command in `todo-app/README.md` was run at least once in T3 or T5 (state which).

**Traces:** NFR-5, NFR-7, A-1, FR-8 (documented). **Review findings:** L-1, L-3, L-5, L-8, L-9 (documentation parts), M-2 (documented stop method).

## 5. Requirement and acceptance-criterion coverage
| Req / AC | Implemented in | Automated test | Manual (verification stage) |
|----------|----------------|----------------|-----------------------------|
| AC1 / FR-1 | T1, T2, T3 | validation, api | Add via Enter and button |
| AC2 / FR-2 | T1, T2, T3 | db, api | List + empty state |
| AC3 / FR-3 | T1, T2, T3 | db, api | Checkbox + text badge |
| AC4 / FR-4 | T1, T2, T3 | validation, api | Edit save/cancel, Escape |
| AC5 / FR-5 | T1, T2, T3 | db, api | Delete button |
| AC6 / FR-6 | T1, T3 | db, persistence | Browser refresh, server restart |
| FR-7 | T3 | api | UI uses API for every change |
| FR-8 | T3, T5 | security (no CORS/auth) | — |
| NFR-1 | T1, T2, T3 | validation, api, frontend-static | Client error message |
| NFR-2 | T1, T2, T3, T4 | frontend-static, security, db | XSS payload shown as text |
| NFR-3 | T1, T3, T4 | config, security | — |
| NFR-4 | T2, T3 | api, security | Stop server → "Cannot reach server", input kept |
| NFR-5 | T1–T5 | all; one command | — |
| NFR-6 | T2 | frontend-static | Keyboard-only run |
| NFR-7 | T1, T5 | package.json check | — |

## 6. Design-review findings disposition
| Finding | Disposition | Task |
|---------|-------------|------|
| M-1 Host allowlist vs `port:0` | **Handled:** allowlist built from the bound port after `listen()`, case-insensitive; positive and negative tests | T3, T4 |
| M-2 Windows cleanup / shutdown hang | **Handled:** `close()` = `server.close()` + `closeAllConnections()` → `db.close()`, idempotent; tests await `close()` before `rmSync(..., maxRetries:3)`; SIGINT documented as stop method | T1, T3, T5 |
| M-3 Request-stream edge cases | **Handled:** early `Content-Length` 413, streaming cap, `Connection: close`, `error`/`aborted` handling; tests prove the server still answers after 413 and after a client abort | T3 |
| L-1 maxlength vs code points | Adopted: JS code-point check; `maxlength` kept and difference documented | T2, T5 |
| L-2 URL normalization | Adopted: `URL.pathname`, query ignored, trailing slash → 404 | T3, T4 |
| L-3 C1 / separators / surrogates | Adopted: also reject C1, U+2028, U+2029, lone surrogates (extends D-4) | T1, T2, T5 |
| L-4 500-path injection | Adopted the closed-DB approach; optional `repo` parameter **declined** (keeps `createApp` signature as designed) | T1, T3 |
| L-5 Relative `TODO_DB_PATH`, `:memory:` warning | Adopted | T1, T5 |
| L-6 Stale UI 404 | Adopted: show error then re-fetch | T2 |
| L-7 Origin / Sec-Fetch-Site 403 | **Declined** (optional per review): local-only, no CORS headers, JSON-only writes force a preflight, and simple form content types get 415 (tested in T4). Can be added later without design change. | T4 (verifies basis) |
| L-8 Inherited artifacts, root README pointer | Adopted: this plan replaces the old one; root README pointer in T5; `verification.md` / `pr-draft.md` are for later stages | T5 |
| L-9 `node:sqlite` experimental | Adopted: `engines.node >=24`, usage isolated in `db.js`, warning documented, `start` script disables the warning (RD-4) | T1, T5 |

## 7. Assumptions (unconfirmed; no human approval)
- P-1: Requirements A-1…A-7 and architecture D-1…D-8 hold as accepted defaults (RD-1, RD-2).
- P-2: Node v24.22.1 provides `node:sqlite` without a flag, `node --test` glob expansion, `--disable-warning`, `String.prototype.isWellFormed`, and `server.closeAllConnections()`. T1's first test run confirms this.
- P-3: Adding `src/config.js` and `test/config.test.js` (not in architecture §3) is an acceptable small refinement for testability; it changes no behaviour in the design.
- P-4: Node's `fetch` sends a `Host` header of the form `127.0.0.1:{port}` when requesting `http://127.0.0.1:{port}`, so it passes the allowlist.
- P-5: Test files may run in parallel processes (`node --test` default); each uses its own ephemeral port and `:memory:` / temp DB, so they do not conflict.
- P-6: Port 3999 is free for the T3 startup smoke; if not, any free port may be used and recorded.
- P-7: UI behaviour (add/toggle/edit/delete in a browser, keyboard-only use, refresh) is verified manually by the verification stage, not by these tasks (no browser automation without dependencies).

## 8. Out of scope
Authentication/accounts/per-user lists; deployment, CI/CD, HTTPS, rate limiting, backups, migrations framework; due dates, priorities, categories, search, filters, sorting, reordering, bulk actions, undo, real-time sync; mobile/offline/localization; automated browser tests; delete confirmation; linking the welcome page to the app; any change to `index.html` or `tests/verify-welcome.cmd`; Origin/Sec-Fetch-Site checks (L-7, declined); replacing `verification.md` / `pr-draft.md` (later stages).

## 9. Blockers and unresolved scope questions
- **Blockers: none.** Every task's only "blocked" state is waiting for its listed dependencies.
- Unresolved (non-blocking, proceed on defaults): requirements Q1–Q6 / architecture §15 items 1–6 (database choice, 200-character limit and duplicates, delete confirmation, welcome page relation, browser/WCAG targets, sort order). Item 7 (hide the ExperimentalWarning in `start`) is resolved by RD-4: yes in `start`, not in tests.

## 10. Completed work
None. Later stages update this section only with work that actually happened.
