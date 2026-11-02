# Implementation Plan — Simple Login Form

## Plan status and authority

- **Run ID:** `20261102070435-f8d309f2`
- **Delivery branch checked before planning:** `story/simple-login-form-20261102070435-f8d309f2`
- **Base SHA recorded in the source artifacts:** `ec2ffdd3251016341618d148abcb2935417259a1`
- **Planning basis:** `requirements.md`, `architecture.md`, `design-review.md` (round 3 of 3, **PASS for the bounded loopback-only local demo**), and `input/user-story.txt`.
- **Plan status:** all tasks below are **PLANNED**; none are completed. This plan is not implementation, test evidence, human approval, production authorization, or publication approval.
- **Repository inspection:** the delivery repository contains the planning documents and `README.md`; no application source, package manifest, or test suite was found. The architecture proposes plain HTML/CSS/browser JavaScript and native Node.js HTTPS APIs, with no framework or third-party dependency required.

The round-3 pass applies only to the loopback-only local demo. Implement only that architecture: a server-side fixed public demo fixture; local success view after backend validation; no session, token, persistent authenticated state, protected business resource, remote exposure, production use, or real/sensitive data. Do not present this as broader application access or production-grade authentication.

## Prioritized task sequence

| Order / priority | Stable ID | Planned task and scope | Dependencies | Verifiable completion criteria | Status / blocked reason |
| --- | --- | --- | --- | --- | --- |
| 1 / P0 | `LOGIN-IMP-001` | Establish the minimal Node.js project baseline consistent with the architecture. Select and record an exact supported Node.js LTS version; add a minimal package manifest and start/test scripts only as needed. Use native APIs and avoid adding a framework or unnecessary dependencies. | None | Runtime version is stated consistently in project metadata/documentation; package scripts resolve to the intended server and test entry points; no unnecessary third-party runtime dependency is introduced. | **PLANNED** |
| 2 / P0 | `LOGIN-IMP-002` | Implement direct-TLS server startup and local certificate loading. Keep certificate and private key outside the repository/public asset tree; bind only to `127.0.0.1`; reject non-loopback configuration; fail startup for missing, unreadable, invalid, expired, or otherwise unusable TLS material. Do not add an HTTP listener or certificate-validation bypass. | `LOGIN-IMP-001` | With valid locally trusted TLS material, the server listens only on loopback at the documented HTTPS origin. Invalid/missing TLS material causes startup failure and never falls back to HTTP. No key or certificate private material is committed. | **PLANNED**; local operator must provision the development certificate/key outside the repository. |
| 3 / P0 | `LOGIN-IMP-003` | Implement the bounded HTTPS router and public-asset serving. Serve only an explicit allowlist of the login-page assets and API route; constrain accepted Host values to the intended local hostname/port, reject unexpected or missing values, restrict browser API requests to the expected same origin, and disable permissive CORS. Apply method, content-type, request-size, and response-cache controls. | `LOGIN-IMP-002` | Requests for non-allowlisted paths/files and disallowed Host/Origin/method/content-type/body cases are rejected without exposing filesystem paths or internals. No permissive CORS, plaintext endpoint, non-loopback listener, or cacheable login response exists. | **PLANNED** |
| 4 / P0 | `LOGIN-IMP-004` | Implement the backend login-validation handler using the architecture-authorized fixed `admin` / `admin` public demo fixture in server-side code only. Validate request shape and compare both submitted fields; return the defined accepted or generic rejected result. Never echo inputs or disclose the fixture in browser assets, responses, logs, or telemetry. Do not create sessions or authorization state. | `LOGIN-IMP-003` | The specified pair is accepted by the backend; wrong username, wrong password, and both wrong are rejected with equivalent generic outcomes. Malformed input is boundedly rejected. Inspection confirms no fixture/input disclosure and no session/token behavior. | **PLANNED** |
| 5 / P1 | `LOGIN-IMP-005` | Implement the minimal browser experience using the established repository/architecture pattern (plain HTML, CSS, and browser JavaScript). Provide labeled Username and Password fields and Login button, submit to the same-origin HTTPS endpoint, display a generic invalid-credentials message, distinguish service-unavailable feedback, and show the minimal local landing view only after backend acceptance. | `LOGIN-IMP-003`, `LOGIN-IMP-004` | The page exposes the required controls and accessible status feedback. A success view appears only after accepted backend response; invalid and unavailable outcomes are distinguishable. Browser code does not contain the fixture, store credentials durably, submit credentials in a URL, or claim protected application access. | **PLANNED** |
| 6 / P0 | `LOGIN-IMP-006` | Add focused automated coverage for the defined local-demo behavior and security boundaries, using the selected runtime's built-in test facilities unless a concrete need justifies otherwise. Cover valid/invalid submissions, malformed and oversized requests, method/content-type rejection, non-disclosure, cache behavior, Host/Origin/CORS restrictions, and fail-closed TLS startup. | `LOGIN-IMP-002`, `LOGIN-IMP-003`, `LOGIN-IMP-004`, `LOGIN-IMP-005` | Tests exist for the listed cases and are runnable using the documented project command. Test results are to be recorded only when the verification stage actually runs them; this planning task has not executed tests. | **PLANNED** |
| 7 / P0 | `LOGIN-IMP-007` | Perform the end-to-end local HTTPS acceptance and security verification specified by the architecture. Check page and login POST in a normally validating browser/client; inspect certificate chain, validity, hostname/SAN, listener binding, absence of HTTP/mixed content, and rejection of untrusted, expired, or hostname-mismatched certificates. Record evidence without credential values or private-key material. | `LOGIN-IMP-006` | AC-01–AC-04 have recorded results for the bounded demo; trusted HTTPS succeeds, negative certificate cases fail closed, and no public/non-loopback or plaintext path is present. Do not report AC-04 as verified absent this evidence. | **BLOCKED** until an operator provisions a matching locally trusted development certificate/key outside the repository and the required browser/OS trust is installed. No such setup was identified during repository inspection. |

## Dependency order

`LOGIN-IMP-001` → `LOGIN-IMP-002` → `LOGIN-IMP-003` → `LOGIN-IMP-004` → `LOGIN-IMP-005` → `LOGIN-IMP-006` → `LOGIN-IMP-007`

`LOGIN-IMP-006` additionally depends on `LOGIN-IMP-002` and `LOGIN-IMP-003`. The server-side test task and UI task can be developed independently after their listed prerequisites, but the end-to-end verification remains last.

## Cross-task security and scope constraints

- Bind only to loopback (`127.0.0.1`) and serve `https://localhost` using direct TLS in the application process. No proxy, remote/public listener, plaintext login endpoint, HTTP fallback, mixed-content login path, or certificate warning/trust bypass.
- Keep TLS private-key material outside the repository and public assets. Require normal certificate chain, validity, and hostname validation.
- The fixed pair is an intentionally public local-demo fixture, not a secret or production credential. Keep it only in server-side validation code; never put it in client assets, responses, logs, or telemetry.
- Do not place submitted credentials in URLs, echo them, log them, cache login responses, persist them in browser storage, or automatically replay submissions.
- Enforce bounded request parsing, explicit static-asset allowlisting, same-origin/Host defenses, and no permissive CORS. These include the round-3 review's non-blocking F-04 hardening recommendation.
- The local landing view is a display-only success signal. Do not add sessions, tokens, logout, protected resources, user management, registration, or authorization behavior.
- Use synthetic demonstration input only. Any remote/production use, broader authenticated application access, or different credential model is outside this plan and requires revised requirements and a new architecture/security review.

## Assumptions and unresolved scope

- **A-01 — Stack:** As no application code or package manifest was found, there is no existing implementation stack/pattern to preserve. The plan follows the reviewed architecture's proposed plain web assets and native Node.js server; the exact supported LTS version remains a setup decision in `LOGIN-IMP-001`.
- **A-02 — Demo success:** For implementation planning, use the architecture's reviewed interpretation: backend acceptance followed by a minimal local landing view, with no authenticated state. This is a bounded demo assumption, not a claim that the story's broader “access the application” goal is met.
- **A-03 — Credential fixture:** Use only the architecture-authorized fixed public demo pair, server-side, and only for loopback demonstration.
- **A-04 — TLS provisioning:** Certificate and key provisioning, local trust installation, renewal, and operator ownership are environmental prerequisites, not repository artifacts. Keep them outside version control.
- **Unresolved scope question:** Does the product require actual access to an application resource beyond the explicitly bounded local landing view? The round-3 review passes only for the latter. If broader access is required, this plan is insufficient and implementation must not silently add sessions or protected resources; revised requirements and a new design/review are required.
- **Verification blocker:** `LOGIN-IMP-007` cannot produce AC-04 evidence until the local trusted certificate and browser/OS trust prerequisites are available. Remote/public deployment and production readiness are prohibited by the reviewed scope, not deferred implementation tasks.

## Explicitly not performed

No application files or other artifacts were changed. No implementation, tests, certificate setup, verification, commits, pushes, or publication actions were performed. No human approval is claimed.
