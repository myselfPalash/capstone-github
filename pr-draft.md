# Add loopback-only HTTPS simple login form demo

> **AI-generated PR.** This change and its lifecycle artifacts were produced by an AI-assisted SDLC workflow (run `20261102070435-f8d309f2`). Automated design review, code review and verification passes are **not human approval**, do not mean the code is production-ready, and do not authorize a merge. A human must review it.

- **Branch:** `story/simple-login-form-20261102070435-f8d309f2`
- **Base:** `main` @ `ec2ffdd3251016341618d148abcb2935417259a1`
- **Source story:** `input/user-story.txt` (Simple Login Form)

## Summary

This PR adds a small login demo for local use only. A Node.js server serves a page with Username and Password fields and a Login button. The server checks the submitted credentials over HTTPS against a fixed public demo credential pair that is hardcoded in server-side code, as the user story requires. The server listens only on `127.0.0.1`, uses only built-in Node.js 24.22.1 modules with no third-party dependencies, and refuses to start if its TLS certificate or key is missing or invalid. It has no plain-HTTP fallback. It is **demo-only**: it is not production authentication and creates no sessions, tokens or authenticated state. After the backend accepts a login, the page shows a display-only landing view.

## Changes Made

**Application and configuration**

| File | Change |
| --- | --- |
| `.nvmrc` | Pins Node.js `24.22.1`. |
| `package.json` | Private package with `engines.node` `24.22.1`. `npm start` runs `node server.js` and `npm test` runs `node --test`. No dependencies. |
| `README.md` | (Modified.) Documents the Node baseline, loopback-only HTTPS startup (`TLS_CERT_PATH` / `TLS_KEY_PATH`, which must point outside the repo, plus `PORT` and `HOST`), fail-closed startup with no HTTP fallback, and the rule that `POST /api/login` requires an exact `Origin` header. |
| `server.js` | Native `node:https` server bound to `127.0.0.1` only. It loads and checks TLS material from outside the repo, rejecting certificates that are malformed, expired, not yet valid, missing a SAN, issued for a name other than `localhost`, or paired with the wrong key. It serves only an allowlist of static assets and `POST /api/login`. It checks Host and Origin, allows no CORS, and checks the method and content type. Request bodies are limited to 8 KiB, and login responses are sent with `Cache-Control: no-store`. A match returns `{"accepted":true}`. Every mismatch returns the same generic 401, and server errors return a generic 500. The fixture credential pair exists only in server-side code. |
| `public/index.html` | Labeled Username and Password fields and a Login button, an `aria-live` status area, and a display-only "Local demo landing view" that states no session or token was created. |
| `public/styles.css` | Minimal styling. |
| `public/app.js` | Sends a same-origin JSON `POST`. It shows the landing view only after the backend accepts the login, shows a generic invalid-credentials message on 401, and shows a separate message when the service is unavailable or times out. It refuses to submit if the page was loaded over plain HTTP. It doesn't include the credential values and doesn't store credentials. |

**Tests (built-in `node:test`)**

| File | Coverage |
| --- | --- |
| `test/server.test.js` | Calls the request handler directly; malformed, oversized and interrupted bodies; method, content-type, Host and Origin rules; the asset allowlist; checks that the fixture value is not in public assets; generic error responses. |
| `test/startup.test.js` | Fail-closed startup; TLS loader rejecting bad certificate/key material and accepting valid material. All TLS material is generated in `os.tmpdir()` while the test runs. |
| `test/ui.test.js` | Runs `public/app.js` in `node:vm` against a **simulated DOM**. Covers the markup, the success, invalid, unavailable and timeout flows, and refusal over plain HTTP. |

**Lifecycle artifacts:** `requirements.md`, `architecture.md`, `design-review.md`, `impl-plan.md`, `verification.md`, `pr-draft.md` (this description).

No TLS key or certificate files are committed.

## Test Evidence

All results below are the recorded runs from `verification.md`, on Windows with Node `v24.22.1`. No CI was run, and this PR claims no CI evidence.

- **Design review:** PASS at round 3 of 3, for the bounded loopback-only local demo only. Rounds 1 and 2 were REVISE. That history is kept in `design-review.md`.
- **Code review:** Round 1 PASS. A revision then fixed M-01, M-02 and L-01 to L-03. Round 2 PASS, with non-blocking items L-04 to L-07 still open. (These results come from the orchestrator. There is no separate code-review artifact in this repo.)
- **Verification: PASS** for the bounded demo:
  - `npm test`: **34/34 passed**, 0 failed, 0 skipped.
  - `node --check server.js` and `node --check public/app.js`: both passed.
  - `git diff --check`: passed. It only covers tracked changes. A separate scan of the new files found no trailing whitespace.
  - **End-to-end local HTTPS run: 14/14 checks passed.** The test used a throwaway self-signed `localhost` certificate created in `%TEMP%`, and the server was started with that certificate and its key. A Node `https` client checked the certificate normally (`rejectUnauthorized: true`, with that certificate supplied explicitly as its trusted CA). Results:
    - The page and assets were served over TLSv1.3.
    - The fixture credential pair returned 200 `{"accepted":true}` with no `Set-Cookie` header.
    - A wrong username, a wrong password, both wrong, and an uppercase version of the pair each returned the same generic 401.
    - A missing Origin and a cross-site Origin each returned 403.
    - An untrusted certificate and a hostname mismatch were both rejected.
    - A plain-HTTP request got no response (`ECONNRESET`).
    - The server listened only on `127.0.0.1`.
    - No fixture credential values appeared in the served pages or assets.
    - The temporary certificate and key were deleted afterwards.
- **Not performed:** No certificate was installed in any browser or OS trust store. Nothing was rendered or logged into in a real browser, and mixed-content behavior was not checked in a browser. Client-side behavior is covered only by the simulated-DOM tests. Expired-certificate rejection is covered only by unit tests.

Acceptance criteria (see `verification.md` §4):

| AC | Status |
| --- | --- |
| AC-01 | Verified from the HTTPS response and the simulated DOM. Not checked visually in a browser. |
| AC-02 | Verified for the bounded demo, which shows a landing view and creates no session. |
| AC-03 | Verified at runtime in the backend and in the simulated-DOM UI. Not checked in a real browser. |
| AC-04 | Verified with a Node client and the throwaway certificate as its CA. No browser or OS trust-store evidence. |

## Known Limitations

- **Demo only, not production authentication.** The credentials are a public demo pair hardcoded in `server.js`, as the story requires. They are not a secret. Use synthetic input only.
- **No sessions, tokens, logout or protected resources.** The landing view only shows that the login was accepted. The story's broader goal of giving the user access to the application is **not** met.
- **Local machine only.** The server binds only to `127.0.0.1`. Remote, public or production deployment is out of scope, and changing that would need revised requirements and a new architecture and security review.
- **You need your own TLS certificate.** The person running the demo must create a `localhost` certificate and key outside the repo and have the browser trust it. No real browser or OS trust store was tested.
- **No real-browser testing.** Browser behavior was tested only with a simulated DOM.
- **Open code-review items:** L-04 to L-07 are deferred and non-blocking, and verification did not reassess them.
- **Open product questions from `requirements.md`:**
  - **UQ-01:** What the success screen should show, and whether a session is needed.
  - **UQ-02:** The error message wording and how it is displayed.
  - **UQ-03:** Where the credentials are stored and how they are protected.
  - **UQ-04:** How the TLS certificate is provided and trusted, and where TLS ends.
  - **UQ-05:** Whether this is a demo or meant for production.
  - **UQ-06:** How empty, whitespace, different-case or malformed input should be handled.

  The implementation follows the bounded design decisions from the architecture and design review. The open questions still need answers from the person who requested the story.

## Reviewer Checklist

- [ ] Confirm the scope (local-only demo, landing view, no session) is acceptable for this story given UQ-01 to UQ-06, or send it back for revised requirements.
- [ ] Confirm the fixture credentials appear only in server-side `server.js` and tests, and not in `public/**`, responses or logs.
- [ ] Review `server.js` for: binding only to `127.0.0.1`, fail-closed TLS loading from outside the repo, no HTTP fallback, Host/Origin/CORS rules, the 8 KiB body limit, `no-store` caching, and generic error responses.
- [ ] Review `public/app.js` for: success shown only after the backend accepts, refusal over plain HTTP, and no credentials stored or put in URLs.
- [ ] Make sure no `*.pem`, `*.key`, `*.crt`, `*.pfx` or other TLS material is committed.
- [ ] Run `npm test` on Node 24.22.1 and check that you get 34/34.
- [ ] Optionally, check it in a real browser with a trusted local `localhost` certificate. This was not done during verification.
- [ ] Decide what to do about code-review items L-04 to L-07.
- [ ] Remember this PR is AI-generated: the automated review and verification passes are not human approval or merge authorization.
