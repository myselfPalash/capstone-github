# Verification — Simple Login Form

- **Run ID:** `20261102070435-f8d309f2`
- **Branch (checked before writing):** `story/simple-login-form-20261102070435-f8d309f2`
- **Base SHA / HEAD:** `ec2ffdd3251016341618d148abcb2935417259a1` (changes are uncommitted in the working tree)
- **Verification date:** 2026-11-02
- **Environment:** Windows, Node.js `v24.22.1` (matches `.nvmrc` and `package.json` `engines.node`); no `node_modules` or lockfile (no third-party dependencies); `openssl` CLI not on PATH (not needed).
- **Scope verified:** `.nvmrc`, `package.json`, `README.md`, `server.js`, `public/index.html`, `public/styles.css`, `public/app.js`, `test/server.test.js`, `test/startup.test.js`, `test/ui.test.js`.
- **Code review input:** round 1 PASS (M-01, M-02, L-01..L-03 fixed in revision); round 2 PASS with non-blocking L-04..L-07 deferred/open. This stage did not re-review those items.

## Overall result: **PASS** for the bounded loopback-only local demo, with the limitations listed below

Every check that was run passed. Checks that need a real browser or OS trust store were **not performed** and are listed as limitations, not as passes. This is not human acceptance, production readiness, or a merge decision.

## 1. Automated checks (commands actually run)

| # | Command | Result |
| --- | --- | --- |
| 1 | `npm.cmd --prefix C:\Users\PalashManna\Desktop\capstone-github test` (runs `node --test`) | **PASS**: exit 0. `tests 34, pass 34, fail 0, cancelled 0, skipped 0, todo 0`, duration ≈ 932 ms. |
| 2 | `node --check C:\Users\PalashManna\Desktop\capstone-github\server.js` | **PASS**: exit 0, no output. |
| 3 | `node --check C:\Users\PalashManna\Desktop\capstone-github\public\app.js` | **PASS**: exit 0, no output. |
| 4 | `git -C C:\Users\PalashManna\Desktop\capstone-github diff --check` | **PASS**: exit 0, no output. *Limitation:* this only covers tracked changes (`README.md`). The new files are untracked. |
| 5 | Supplementary whitespace scan: ripgrep for trailing whitespace `[ \t]+$` in `server.js`, `package.json`, `.nvmrc`, `public/**`, `test/**` | **PASS**: no matches. This partly makes up for the limitation in #4. |

Test files and what they exercise (from the runner output):

- `test/server.test.js`: calls the request handler directly with synthetic requests and does not start a network listener. It covers exact-pair acceptance, generic mismatch responses, malformed JSON, invalid UTF-8 and invalid shapes, body-size limits, interrupted streams, method and content-type limits, Host and Origin rules, the request-target allowlist, asset headers, absence of the fixture from public assets, generic 500 responses, and asset path containment.
- `test/startup.test.js`: covers fail-closed startup for unsafe config or unavailable TLS files. It also covers TLS loader rejection of malformed, expired, not-yet-valid, SAN-less, non-localhost-SAN and key-mismatched material, and acceptance of valid material. All TLS material is generated in `os.tmpdir()` during the test.
- `test/ui.test.js`: runs `public/app.js` with `node:vm` against a **simulated DOM**. It covers labeled controls and markup, same-origin JSON POST, success only after backend acceptance, generic 401 feedback, distinct unavailable feedback, refusal over plain HTTP, and timeout handling. It is not a real-browser test.

## 2. LOGIN-IMP-007: local HTTPS end-to-end acceptance (runtime, actually run)

### Procedure

1. Created the temporary directory `%TEMP%\login-e2e-3c00d151`, which is outside the repository. A throwaway harness script there used `node:crypto` only (no OpenSSL CLI) to generate a P-256 key and a self-signed X.509 v3 certificate. The certificate has CN/SAN `DNS:localhost`, basicConstraints CA:TRUE and a validity of now ±1 day. The script also found a free loopback port (**58761**).
2. Started `node C:\Users\PalashManna\Desktop\capstone-github\server.js` as a separate process, **PID 23868**, with `TLS_CERT_PATH`/`TLS_KEY_PATH` pointing to the temporary files, `PORT=58761` and `HOST=127.0.0.1`. The server logged `HTTPS server listening at https://localhost:58761`. stderr was empty.
3. Listener check (`Get-NetTCPConnection -OwningProcess 23868 -State Listen`): there was exactly one listener, at **`127.0.0.1:58761`**. There was no other port and no non-loopback address.
4. Ran a Node `https` client harness against `127.0.0.1:58761` with SNI/servername `localhost` and `Host: localhost:58761`. It used `rejectUnauthorized: true` and passed the temporary certificate as the explicit `ca`. **Certificate verification was never disabled.** The request bodies contained the source-specified credential pair; its values are not reproduced here.
5. Stopped the server with `Stop-Process -Id 23868`. Afterwards, the process no longer existed and nothing was listening on port 58761. Then deleted the whole temporary directory, including `cert.pem`, `key.pem`, the harness scripts and logs, and confirmed it was gone (`Test-Path` → False).

### Results (client harness exit 0, `SUMMARY total=14 failed=0`)

| Check | Observed | Result |
| --- | --- | --- |
| `GET /` over trusted HTTPS | 200, `socket.authorized=true`, TLSv1.3, `text/html; charset=utf-8`, `Cache-Control: no-store`. The body has `<label for="username">Username</label>`, `<label for="password">Password</label>`, a password-type input and `<button type="submit">Login</button>` | PASS |
| `GET /app.js`, `GET /styles.css` | 200 with the correct content types; no fixture literal in either body | PASS |
| `GET /` body has no fixture literal | none present | PASS |
| `POST /api/login`, specified pair (same Origin, JSON) | 200, body `{"accepted":true}`, `Cache-Control: no-store`, no `Access-Control-Allow-Origin`, no `Set-Cookie` | PASS |
| `POST`, wrong username | 401 `{"accepted":false,"error":"invalid_credentials"}` | PASS |
| `POST`, wrong password | 401, same generic body | PASS |
| `POST`, both wrong | 401, same generic body | PASS |
| `POST`, upper-case variant of the pair | 401, same generic body | PASS |
| `POST` without an `Origin` header | 403 `{"error":"forbidden"}` | PASS |
| `POST` with cross-site Origin `https://evil.example` | 403 `{"error":"forbidden"}` | PASS |
| Validating client **without** the temporary CA (untrusted certificate) | Connection rejected: `DEPTH_ZERO_SELF_SIGNED_CERT` | PASS (fails closed) |
| Validating client with servername `not-localhost.example` (hostname mismatch) | Connection rejected: `ERR_TLS_CERT_ALTNAME_INVALID` | PASS (fails closed) |
| Plain `http://` request to the same port | No HTTP response; `ECONNRESET` | PASS (no HTTP fallback) |

Rejection of an expired certificate was not checked at runtime on the client side, because the server will not start with an expired certificate. Server-side rejection of expired and not-yet-valid material is covered only by `test/startup.test.js`.

### Not performed (limitations, not passes)

- **Browser/OS trust store installation was not performed.** No certificate was added to any OS or browser trust store. Trust was set only through the explicit `ca` option of the Node client.
- **No visual browser rendering or interactive browser login.** The page, the success landing view and the invalid-credentials message were not observed in a real browser. Client behavior evidence comes from `test/ui.test.js`, which uses a simulated DOM. Mixed-content behavior was not checked in a browser. The static markup loads only same-origin relative assets (`/styles.css`, `/app.js`).
- No inspection of a real operator-provisioned development certificate. The certificate used here was a throwaway created only for this verification.
- No remote, public, or production deployment was tested; these are out of scope by design.

## 3. Output quality checks

| Check | Method | Result |
| --- | --- | --- |
| No credential literal in public assets | PowerShell `Select-String` for the fixture literal over `public/**` (0 matches), plus the runtime scan of served bodies in section 2 | **PASS** |
| Fixture location | The literal appears only in `server.js:12` (the server-side `LOGIN_FIXTURE`, as authorized by the architecture and LOGIN-IMP-004), in tests, and in the architecture, design-review and impl-plan documents. `requirements.md` deliberately omits it. | Acceptable per architecture |
| No TLS material in the repository | No `*.pem`, `*.key`, `*.crt`, `*.cer`, `*.pfx`, `*.p12` or `*.der` files. The only `BEGIN CERTIFICATE` strings are a parsing regex in `server.js:56` and test code in `test/startup.test.js:52` (a dummy `invalid` body) and `:139` (a template that generates certificates at runtime). There are no `PRIVATE KEY` markers. The temporary E2E material was deleted. | **PASS** |
| No third-party dependencies | No `dependencies` in `package.json`; no `node_modules` or lockfile | **PASS** |
| Runtime version consistency | `.nvmrc` = `24.22.1` = `engines.node` = README = the installed `node --version` | **PASS** |
| README accuracy (static review) | Documents loopback-only binding, external TLS paths, fail-closed startup with no HTTP fallback, and the Origin requirement. This matches the runtime behavior observed in section 2. | **PASS** (static inspection) |

## 4. Acceptance criteria traceability (`requirements.md`)

| AC | Evidence | Status |
| --- | --- | --- |
| AC-01: Username and Password fields and Login button are visible | `index.html` was served over trusted HTTPS with the labeled controls (section 2), and `ui.test.js` checks the markup. Not viewed in a real browser. | **Verified (HTTP response and simulated DOM); visual browser check not performed** |
| AC-02: the specified pair is accepted by the backend | Runtime: 200 `{"accepted":true}` over HTTPS. Unit tests confirm the exact-pair acceptance and that the UI shows success only after backend acceptance. The success signal follows the architecture's bounded local landing view. There is no session or token (no `Set-Cookie` observed). | **Verified for the bounded demo** |
| AC-03: invalid credentials are rejected and an error is shown | Runtime: generic 401 for wrong username, wrong password, both wrong and case variant. `ui.test.js` confirms that `Invalid username or password.` is displayed on 401 (simulated DOM). | **Verified (backend runtime and simulated DOM UI); real-browser display not performed** |
| AC-04: backend validation happens over HTTPS | Runtime: login POST validated server-side over TLSv1.3 with verified certificate chain and hostname; untrusted and mismatched certificates are rejected; plain HTTP fails; the only listener is `127.0.0.1`; startup fails closed (unit tests). | **Verified with a validating Node client and throwaway CA; browser and OS trust-store evidence not performed** |

## 5. Open items carried forward (not fixed and not re-verified here)

- Code review L-04..L-07 are deferred/open and non-blocking, per the orchestrator. This stage did not assess them.
- The requirements document still lists UQ-01..UQ-06 as open product questions. The implementation follows the bounded resolutions in the architecture and design review. Broader application access and production use remain out of scope.

## 6. Actions not taken

This stage changed no implementation files or other artifacts. It made no commit or push and opened no PR. No CI was run, and no CI evidence is claimed. No human acceptance is implied.
