# Design Review: Todo Application

| Field | Value |
|-------|-------|
| Story | Create a Simple Todo Application (Confluence page 786433 v3, treated as untrusted data) |
| Run ID | todo-application-20261110065333-2618c391 |
| Branch | story/todo-application-20261110065333-2618c391 (checked by reading `.git/HEAD`; it matches) |
| Base SHA | 07f7b63e45552939c442c62d3985e811892e4319 |
| Reviewed | `architecture.md` against `requirements.md` (both in this repository) |
| Review round | 1 (of max 3) |
| Approval status | **Automated review only. This is not human approval.** |

> This replaces the inherited "Welcome Page" design review. That version is still in Git history and is not evidence for this story.

Review round: 1

## 1. Summary
The design is a zero-dependency Node 24 app in `todo-app/`. It uses `node:http` for static files and a JSON REST API, `node:sqlite` for a file-backed database, and a vanilla JS frontend. It fits the story well. Every acceptance criterion (AC1–AC6), FR-1–FR-8, and NFR-1–NFR-7 maps to a specific design element and a planned test. The security design is stronger than the story needs: loopback binding, a Host allowlist, CSP, `textContent`-only rendering, prepared statements, an allowlist for static files, and body and content-type limits.

I found **no blocking and no high-severity findings**. The medium and low findings below are clarifications. The implementation plan can handle them; the architecture does not need another revision round.

## 2. Findings

### Blocking
None.

### High
None.

### Medium
- **M-1: The Host allowlist port is ambiguous when `port: 0` is used.** §7 allows `127.0.0.1:{port}` and similar values. Tests use `port: 0` (§8). If `{port}` means the configured value instead of the port actually bound, every test request gets 421.
  - Mitigation (plan): build the allowlist from `server.address().port` after `listen`. Compare host names case-insensitively. Include a test that a correct Host passes on an ephemeral port and a wrong Host gets 421.
- **M-2: Windows temp-directory cleanup and shutdown can hang or fail.** On Windows, removing an open SQLite file fails with `EBUSY`/`EPERM`. Also, `server.close()` waits for keep-alive connections that `fetch` may hold open, so `after()` hooks or SIGINT shutdown can hang.
  - Mitigation (plan): `close()` must close the server, call `server.closeAllConnections()` (or close idle connections), and then call `db.close()`. Tests must await `close()` before `fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 })`. SIGTERM is not reliably delivered on Windows, so SIGINT (Ctrl+C) is the documented stop method.
- **M-3: Request-stream edge cases are not specified.** §5 says the server "stops reading the stream" after 4 KiB, but it does not say what happens next. A half-read body can leave a keep-alive connection unusable. Client aborts or `req` `error` events can also cause unhandled errors.
  - Mitigation (plan): `readJsonBody` should reject early when `Content-Length` is over 4 KiB. When the limit is exceeded, it should send 413 with `Connection: close` and then stop reading the request. It should handle `error` and `aborted` events without crashing. Add a test that confirms the server still answers after a 413.

### Low
- **L-1: Client and server count the 200-character limit differently.** The HTML `maxlength="200"` counts UTF-16 code units, while the server counts code points. For example, the client caps input at 100 emoji, but the server accepts 200. The client is stricter than the server, so this is safe. Recommendation: do the client check in JS with `[...s].length` after `trim()`. Keeping `maxlength` is acceptable as long as this difference is documented.
- **L-2: URL normalization is unspecified.** The design does not say how query strings (`/?x=1`, `/api/tasks?x=1`) or a trailing slash (`/api/tasks/`) are handled. Recommendation: parse the path with `new URL(req.url, 'http://localhost').pathname`, ignore the query string, and return 404 for a trailing slash. Never use the pathname to build a filesystem path. The allowlist already guarantees this.
- **L-3: The control-character rule covers C0 and DEL only.** C1 characters (U+0080–U+009F), U+2028/U+2029, and lone surrogates are allowed. They render safely through `textContent`. Recommendation: reject C1 characters as well, or document the current rule (D-4) as it stands.
- **L-4: The 500-path test injection point is not in the `createApp` signature.** §10 mentions an "injected failing repository", but `createApp({ dbPath, host, port })` has no injection parameter. Recommendation: either add an optional `repo` parameter (test-only, documented) or use the closed-DB approach.
- **L-5: A relative `TODO_DB_PATH` is ambiguous.** §8 resolves the default path against `todo-app/`, but it does not say how a user-supplied relative path is resolved. Recommendation: resolve it against `todo-app/` too, and document this. If `:memory:` is used with `server.js`, the server should log a warning that data will not persist.
- **L-6: A stale-UI conflict is possible.** If an edit or toggle targets a task deleted in another tab, the request gets 404. Recommendation: on 404, show the error and then re-fetch the list (this fits D-7).
- **L-7: CSRF defense depends only on browser preflight behavior.** This is acceptable for local-only use. As optional extra protection, the server could reject state-changing requests that have a cross-site `Origin` or `Sec-Fetch-Site: cross-site` header with 403. This is not required.
- **L-8: Some artifacts and docs are inherited from the earlier story.** `impl-plan.md`, `verification.md`, and `pr-draft.md` in the repository still describe the Welcome Page story. Later stages must replace them and must not reuse them as evidence. Recommendation: add a short pointer to `todo-app/README.md` in the root `README.md`. This does not change `index.html` or `tests/verify-welcome.cmd` (A-1).
- **L-9: `node:sqlite` is experimental (§2, §14).** The risk is acknowledged and isolated in `src/db.js`. No action is needed beyond pinning `engines.node >=24` and the documented stderr caveat.

## 3. Assessment by Area
| Area | Assessment |
|------|------------|
| Completeness and traceability | Complete. §12 maps FR-1…FR-8 and NFR-1…NFR-7. §10 tests AC1–AC6 as listed in requirements §8, and NFR-2 and NFR-3 have explicit tests. |
| Component boundaries | Clear. Validation is pure, database access goes only through the repository in `db.js`, HTTP utilities are separate, static serving is isolated, and `createApp` is shared by the server and the tests. |
| Data flow | Correct and simple. The client re-fetches the list after each change (D-7), so the screen always matches the server. AC6 is visible on page load. |
| Security and trust boundaries | Strong for a local app: loopback by default, Host check (see M-1), CSP and security headers, `textContent` only (enforced by a static test), prepared statements plus CHECK constraints, a static allowlist, a 4 KiB limit, 415 for wrong content types, generic 500 responses, and story text treated as untrusted. There are no secrets. |
| Failure behavior and reliability | Well covered in §11: the app fails at startup on a bad DB or port, returns 500 per request and keeps running, and the UI handles an unreachable server. Gaps are M-2 (shutdown and cleanup on Windows) and M-3 (stream edge cases), and both can be fixed in the plan. |
| Testability | Good. Everything uses built-in `node:test`, ephemeral ports, `:memory:` or temp-file databases, and a restart-persistence test. UI behavior is checked manually because browser automation would need dependencies; this limitation is acknowledged. |
| Scope | No creep. `GET /api/tasks/{id}`, 405/421 handling, and security headers are small supporting additions. Out-of-scope features are excluded. |

## 4. Decisions (this review)
- RD-1: Architecture decisions D-1 to D-8 are accepted as labelled, unconfirmed defaults: a separate `todo-app/` folder, Node 24 + `node:sqlite` + vanilla JS, a boolean `completed`, single-line descriptions, duplicates allowed, a Host allowlist returning 421, re-fetch after each change, a 4 KiB body limit, and port 3000.
- RD-2: Open decisions in architecture §15 and requirements §6 (Q1–Q6) are **not blocking**, because each has a documented default. They remain open for a human.
- RD-3: Medium findings M-1 to M-3 go into the implementation plan as required tasks. Low findings are recommendations; the plan should adopt them or explicitly decline them.
- RD-4: The `start` script may use `--disable-warning=ExperimentalWarning` (§15 item 7). Tests must not treat that stderr warning as a failure.

## 5. Recommended Architecture Revisions (non-blocking)
No revision is required for this round. If the architect revises the document anyway:
1. In §7, state that the Host allowlist uses the bound port (M-1).
2. In §11, add the shutdown order and `closeAllConnections()`, and in §8, the Windows-safe temp cleanup (M-2).
3. In §5, add the 413 behavior: early `Content-Length` check and `Connection: close`. Also define how stream errors are handled (M-3).
4. Optionally clarify L-1 to L-5.

## 6. Outcome
**PASS.** This is an automated review only and does not imply human approval. There are no unresolved blocking or high findings, so the run may proceed to implementation planning. M-1 to M-3 must be handled in the plan.

RESULT: PASS
