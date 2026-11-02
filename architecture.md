# Architecture — Simple Login Form

## Status, scope, and evidence

Draft architecture revised for design-review round 2; not approved. Architecture stage only. No design review, implementation, testing, planning, or workflow advancement is represented by this document.

- Run ID: `20261102070435-f8d309f2`.
- Delivery branch: `story/simple-login-form-20261102070435-f8d309f2`.
- Supplied base SHA: `ec2ffdd3251016341618d148abcb2935417259a1`.
- Before writing this revision, repository `.git/HEAD` identified the required branch `story/simple-login-form-20261102070435-f8d309f2`, and its branch ref matched the supplied base SHA `ec2ffdd3251016341618d148abcb2935417259a1`.
- `requirements.md` exists and is the current requirements basis. Its FR, NFR, CON, AC, and UQ identifiers are used below.
- The delivery repository contains the existing `README.md`, `requirements.md`, `architecture.md`, and `design-review.md`; no application or dependency manifest is identified in the existing architecture's inspection record.
- The source story at `C:\Users\PalashManna\Desktop\Copilot-capston\input\user-story.txt` was independently read for this revision. It specifies the `admin` / `admin` pair, a form with Username and Password fields and Login button, HTTPS backend validation, success for that pair, and an error for invalid credentials. In this explicitly bounded architecture, the source-required pair is authorized as a known public demo fixture hardcoded in server-side validation code only.

This is explicitly a local, loopback-only demonstration. Within this bounded interpretation of “access the application,” successful backend validation displays a minimal local landing view. This does not claim to implement access to a broader application: the landing view is not a protected business resource, and success creates no session, token, or authorization state. This scope decision defines what this demo does; it is not evidence that the broader story goal is satisfied.

Remote exposure and production deployment are prohibited. Do not enter or process real, personal, confidential, or production data; use synthetic demonstration input only. This design makes no claim of secure or production-grade authentication.

### Round 2 revision note

- F-01: for this explicitly local demo, “access the application” is bounded to displaying a minimal local landing view after backend validation. The view is not a protected business resource; no session or authorization is created. This does not claim to fulfill a broader application-access goal.
- F-02: the source-required `admin` / `admin` pair is authorized here as a known public demo fixture, not a secret or production credential. It is a hardcoded server-side constant, never included in public assets, responses, or logs. It is permitted only for this loopback-only demo.
- F-03: retain the local-only direct-TLS topology with normal certificate/hostname validation, fail-closed startup, and the specified future verification evidence. Remote/public deployment remains prohibited by this scope.
- The architecture resolves the two round-2 findings only within this bounded demo. Requirements and design-review artifacts were not changed. No implementation or tests were run; this is not approval or a planning handoff.

## Proposed technology and deployment choices

These are architectural proposals, not user-approved requirements or evidence of an existing implementation.

| Decision | Proposal and rationale | Trace / status |
| --- | --- | --- |
| D-01 | Use plain HTML, CSS, and browser JavaScript for the form. No frontend framework or build pipeline is needed for the stated controls. Use a password-type input and accessible labels and status messaging. | FR-01, FR-02, FR-05; proposed usability safeguards, not new acceptance targets |
| D-02 | Use a supported Node.js LTS runtime with native HTTP/HTTPS and filesystem APIs for a small server. Serve an explicit allowlist of public assets and a JSON validation endpoint; do not expose arbitrary filesystem paths. Select an exact supported runtime version during implementation preparation. | FR-02–FR-05, NFR-01; no existing stack to preserve |
| D-03 | For the demo only, serve page and API from one HTTPS origin in one process, bound exclusively to loopback (`127.0.0.1`) and accessed as `https://localhost`. Reject non-loopback bind configuration; no database, remote/public listener, or deployment is included. | FR-03, CON-01, NFR-01; explicit local-demo scope |
| D-04 | Terminate TLS directly in the server. The local operator provisions a trusted development certificate and matching private key outside the repository. The certificate must be valid for `localhost` (and `127.0.0.1` if that address is used in the URL); the browser/client validates its trust chain, validity, and hostname normally. No warning bypass, plaintext login listener, HTTP fallback, or mixed-content path is permitted. | NFR-01, AC-04, UQ-04; local certificate/trust and operator lifecycle obligations are specified below |
| D-05 | Implement the source-required `admin` / `admin` pair as a hardcoded constant confined to server-side validation code. This is an explicitly authorized, known public demo fixture—not a secret or production credential. Never place it in browser assets, API responses, logs, or telemetry. Do not substitute runtime configuration, a database, arbitrary equal values, or another identity model. This decision applies only to the loopback-only demo. | FR-03, CON-01; explicit resolution of UQ-03 for this demo; not suitable for production |
| D-06 | On backend acceptance, return `200 {"accepted":true}` and have the browser display a minimal local landing view. This is the bounded demo interpretation of “access the application”; it does not provide a protected business resource, session, token, persistent authenticated state, logout, or authorization. It must not be represented as broader application access. | FR-04, AC-02, UQ-01; demo behavior is defined, broader product scope remains outside this architecture |

No third-party identity service, analytics service, or external credential transmission is proposed. This does not preclude a future production redesign.

## Components and responsibilities

| Component | Responsibility | Must not do |
| --- | --- | --- |
| Browser form and local landing view | Render Username, Password, and Login; submit the entered strings; after backend acceptance, display a minimal local landing view; expose accessible error/service-status feedback. | Contain the expected pair, decide validity locally, persist credentials in browser storage, or represent the landing view as protected business access or authorization. |
| Same-origin API client | Send a JSON `POST` to the validation endpoint over normally validated HTTPS; distinguish accepted, rejected, and unavailable outcomes. | Put credentials in URLs or query strings, retry credential submissions automatically, or disable certificate checks. |
| HTTPS server / router | Bind only to loopback for this demo; load TLS material; serve only public assets; route requests; enforce method/content-type/body limits; and emit non-cacheable API responses. | Serve configuration/private keys, log request bodies, expose a public listener, or listen on a fallback plaintext login endpoint. |
| Validation handler and fixture | Validate request shape; compare both submitted fields on the server against the hardcoded source-required public demo fixture; emit only the bounded result. | Identify which credential failed, echo inputs, expose the fixture through public assets/responses/logs, create sessions implicitly, or accept arbitrary equal username/password strings. |
| Local demo configuration | Supply the locally trusted certificate/key outside the repository; record certificate subject/SAN, trust installation and renewal owner; keep listener loopback-only. | Commit private keys, ask users to bypass trust validation, accept a non-loopback bind, or imply production security. |

## Data flow and proposed API contract

1. The browser opens `https://localhost` and requests the form and public assets from the loopback HTTPS server. The server presents a certificate whose chain and hostname the browser validates without warnings or bypass.
2. The user enters values; the browser sends `POST /api/login` with `Content-Type: application/json` and a body containing string fields `username` and `password`. This route/schema is a proposal, not a story-specified interface.
3. Before comparison, the server applies bounded body parsing, method/content-type checks, and structural validation. Exact size limits and malformed-input UX remain open; the server must not accept unbounded request bodies.
4. The handler compares both fields against the hardcoded server-side public demo fixture. No database or external service is contacted. The fixture is never sent to the client or written to logs.
5. Contract: `200` with `{"accepted":true}` for a match; `401` with a generic invalid-credentials indication for a mismatch. All login responses use `Cache-Control: no-store`; responses contain no submitted values. This response is not a session or authorization artifact.
6. On `200`, the browser displays a minimal local landing view only after backend acceptance. This is the demo's bounded interpretation of application access; the view has no protected business resources, and the success state is not persisted. On mismatch it displays a generic error; on transport/server failure it displays a distinct unavailable/service error.
7. Browser state holds inputs only as needed for submission. Password retention/clearing after a result is unresolved UX; no durable browser storage or telemetry capture is proposed.

The endpoint and response schema remain proposed implementation details. The demo success signal and bounded local landing view are explicit. Whether a broader application-access experience is required remains outside this scope; exact invalid-error wording is not specified.

### HTTPS deployment and evidence contract

- **Topology:** Local demo only. Browser → direct TLS in the single application process; bind exclusively to `127.0.0.1` and serve `https://localhost`. Reject non-loopback bind configuration. No proxy, backend hop, public/remote exposure, or plaintext login endpoint is part of this design. Remote deployment is prohibited under this scope and would require a new documented design.
- **Certificate and trust:** A local operator provisions a certificate and private key outside the repository. The certificate must chain to a trust anchor installed in the browser/OS trust store, be within its validity period, and have a Subject Alternative Name matching `localhost` (and `127.0.0.1` only if that address is used in the URL). The browser/client must perform ordinary chain, validity, and hostname checks. The operator owns trust setup, private-key permissions, renewal/replacement, and restart/reload procedure. No browser warning suppression or trust bypass is acceptable; without a locally trusted matching certificate the demo is unavailable.
- **Startup and transport:** Missing, unreadable, invalid, expired, or hostname-mismatched TLS material prevents server startup; never downgrade to HTTP. Serve the page and API only on the same HTTPS origin. A plain HTTP URL is unsupported, and credentials must never be submitted over it. Loopback-only binding and the public fixture limit this design strictly to local demonstration use; neither establishes production security.
- **Verification evidence required before claiming AC-04:** (1) record the tested URL and certificate issuer, subject/SAN, validity dates, and successful chain/hostname validation without exposing private-key material; (2) browser/network inspection shows page load and `POST /api/login` use `https://localhost` with no mixed content or HTTP credential request; (3) a trusted-client request succeeds with normal certificate verification, while tests with an untrusted, expired, or hostname-mismatched certificate are rejected; (4) confirm there is no non-loopback listener or plaintext login endpoint. Capture results without credential values. These are required future checks, not tests performed for this revision.
- **Unresolved beyond the demo:** A public hostname, public CA/managed certificate issuance, renewal automation, external network exposure, and any proxy/backend-hop encryption are intentionally not invented. They are required decisions before remote or production use.

### Required future acceptance and failure checks

These are verification needs derived from requirements, not results. Do not execute or report them as passed until implementation exists.

| Check | Expected evidence | Trace / prerequisite |
| --- | --- | --- |
| Form rendering | Username and Password controls and Login button are visible and usable; status/error region is accessible. | FR-01, AC-01 |
| Valid-pair success | Submit the source-specified pair; backend returns the success contract and the UI displays the minimal local landing view only after validation. Do not present this as a session, protected resource, or broader application authorization. | FR-02–FR-04, AC-02; local-demo scope, not executed |
| Invalid credentials | Incorrect username, incorrect password, and both incorrect are rejected with equivalent generic user-facing errors; no submitted value is echoed. | FR-03, FR-05, AC-03 |
| Backend authority and privacy | Confirm validation occurs server-side; the public fixture is not present in public assets, responses, logs, or telemetry; submitted values do not appear in URLs, responses, logs, browser storage, or public assets; login responses are non-cacheable. | FR-02–FR-05, CON-01; fixture is public by design but remains server-side |
| HTTPS transport | Execute the certificate and browser/network evidence in the HTTPS contract; verify both page and login POST use trusted HTTPS and the server has no plaintext/non-loopback listener. | NFR-01, AC-04 |
| TLS negative cases | Untrusted, expired, or hostname-mismatched certificate is rejected; missing/invalid server TLS material prevents startup rather than enabling HTTP. | NFR-01, AC-04; local-demo topology |
| Defensive failures | Malformed JSON, wrong field types, unsupported method/content type, oversized body, unavailable server, and unexpected error produce bounded non-acceptance outcomes without leaking secrets or internals; no automatic credential retry. | FR-02–FR-05; proposed safeguards, exact UX/limits remain open |

## Trust boundaries and security constraints

**TB-01 — Browser to server/network:** Treat all client data and UI state as untrusted. Validation occurs on the server regardless of client checks. Use HTTPS for the page and submission, with no mixed-content login path. A browser-side acceptance flag grants no access rights. (FR-02–FR-04, NFR-01)

**TB-02 — Public assets to server-side code and private material:** Only explicitly public assets may be served. The source-required `admin` / `admin` pair is authorized as a known public demo fixture and may be hardcoded in server-side validation code only; it is not secret, but must never be copied into public assets, API responses, logs, or telemetry. Keep TLS private keys and deployment configuration outside the repository and static asset tree. Redact submitted credential bodies and headers from diagnostics. (FR-03, CON-01, UQ-03/UQ-04; fixture authorization is limited to this demo)

**TB-03 — Deployment operator to process:** For this local demo, the operator supplies TLS certificate/key material outside the repository and the process binds exclusively to `127.0.0.1`. Non-loopback bind configuration is rejected. Missing, unreadable, invalid, expired, or hostname-mismatched TLS configuration prevents startup; there is no HTTP fallback. Private-key permissions, local trust installation, and certificate renewal/replacement belong to the operator. Instructing users to bypass certificate validation is not a solution. (NFR-01, AC-04, UQ-04)

**TB-04 — TLS termination to backend:** Direct TLS in the application process means this local topology has no separate proxy-to-backend hop. A reverse proxy or remote deployment is outside this decision and requires explicit design of proxy trust, backend exposure, forwarded-header trust, certificate management, and encryption on every hop. Do not assume plaintext on a future hop satisfies NFR-01. (NFR-01, UQ-04)

**Security scope:** A fixed shared credential pair is a demonstration constraint, not a production authentication design. HTTPS protects transport when correctly configured; it does not address leaked credentials, brute-force attempts, XSS, host compromise, or authorization. Rate limiting, abuse monitoring, security headers, dependency maintenance, and safe comparison mechanisms require production-oriented review. Sessions would additionally require explicit cookie/token, CSRF, expiration, revocation, and logout design; none is supplied here.

The source story and CON-01 require the fixed `admin` / `admin` pair. This architecture explicitly authorizes it as a known public demo fixture hardcoded in server-side validation code. It is not secret and not a production credential; this does not authorize exposing it through browser assets, responses, logs, or telemetry. This is a deliberate local-demo interpretation, not a protected credential store or a production authentication model.

## Failure behavior

The following are proposed safe defaults; precise presentation is still subject to the unresolved UX requirements.

| Failure | Bounded behavior | Trace |
| --- | --- | --- |
| Credential mismatch | Reject with the same generic invalid-credentials result regardless of which field failed; display an error without echoing inputs. | FR-05, AC-03, UQ-02 |
| Malformed JSON, wrong field types, unsupported method/content type, oversized body | Reject before credential comparison, with an appropriate bounded 4xx response. Exact limits/status mapping and user-facing wording require review. | FR-02/FR-03; defensive handling; UQ-06 |
| Network failure, TLS validation failure, or unavailable server | Do not report acceptance or mislabel the event as incorrect credentials. Present a proposed service/connection error; no automatic retry and no HTTP fallback. | NFR-01; UQ-02/UQ-04 |
| Required fixture absent from server-side validation code, or fixture is found in public assets/responses/logs | Fail startup or disable validation; do not substitute another pair. Remove any exposure before operation. | FR-03, CON-01; D-05 |
| Non-loopback bind configuration or bind failure | Reject configuration or fail startup; never expose the service remotely. | D-03; local-only security boundary |
| Missing, unreadable, invalid, expired, or untrusted TLS configuration | Fail startup; never use HTTP or allow certificate bypass. | NFR-01, AC-04, UQ-04 |
| Unexpected backend error | Return a generic 5xx result without stack traces, inputs, secrets, or internals; sanitized operational diagnostics only. | FR-03, FR-05; proposed safeguard |
| Process restart or concurrent submissions | No session continuity is promised. Each submitted request is independently validated; no queue, persistence, or automatic credential replay is introduced. | UQ-01; bounded single-process design |

## Assumptions, unknowns, and decisions requiring review

| ID | Assumption or open decision | Consequence / requirement linkage |
| --- | --- | --- |
| A-01 | The source story was read for this revision and matches the supplied requirements evidence for the UI, fixed pair, HTTPS backend validation, success, and invalid-credential error. | Requirements trace is checked against the supplied source file; the bounded local landing view does not establish broader application access. |
| A-02 | For this bounded demo, “access the application” means display a minimal local landing view only after backend validation; the view is not a protected business resource, with no session or persistent authenticated state. | D-06 provides a testable signal for FR-04/AC-02; this narrowed interpretation does not claim that broader application access is delivered. |
| A-03 | A single-origin, single-process loopback demo is the selected scope for this revision; this is not evidence that any deployment or certificate setup exists. | D-01–D-04; no performance, browser-support, availability, or scale target is inferred. |
| A-04 | Local HTTPS is exercised at `https://localhost` using a normally trusted development certificate; this is not a public deployment. | D-03/D-04; hostname, SAN, trust, and evidence are specified for local demo only. |
| OD-01 | If the product requires more than the bounded local landing view, define the broader application destination and authenticated-state lifecycle (including logout/revocation as applicable) in revised requirements and a new design. | FR-04, AC-02, UQ-01; this architecture does not claim protected application access or full satisfaction of broader scope. |
| OD-02 | Confirm exact invalid-credential, malformed-input, and service-error wording/presentation. The demo success status is defined above. | UQ-02, FR-05; generic error existence is required, exact error UX is not supplied. |
| OD-03 | The `admin` / `admin` pair is authorized only as a public demo fixture hardcoded server-side; it is not secret or production suitable. No separate loading mechanism is needed for this bounded design. Any change to credential source or use requires revised requirements and design. | FR-03, CON-01, UQ-03; resolved for local demo only |
| OD-04 | The local-only direct TLS topology is selected for this demonstration. Before any change to remote deployment, specify the public hostname, CA/trust and issuance method, renewal owner, network exposure, termination point, and encryption on every backend hop; verify certificates as in the evidence contract. | NFR-01, AC-04, UQ-04; local demo contract is defined, remote topology is prohibited and out of scope |
| OD-05 | Production use is prohibited by this architecture. Any future production intent requires revised requirements, a separate security/operational baseline, and a different credential model. | UQ-05; resolved only for the current local-demo scope |
| OD-06 | Define empty-input, case, whitespace, Unicode, length, and malformed-submission behavior. Candidate comparison remains exact string equality without trimming, case folding, or normalization pending confirmation. | UQ-06, FR-03/FR-04; not settled product behavior. |
| OD-07 | Review runtime choice/version, request limits, response schema/statuses, and interface naming. | Proposed implementation details supporting FR-01–FR-05, not confirmed story requirements. |
| OD-08 | Establish the requested HTTPS evidence from a trusted browser/client, including successful page/API certificate validation, rejection of untrusted/mismatched certificates, and no HTTP credential path. | AC-04, NFR-01; evidence contract defines required future checks; none has been executed. |

## Limits and non-goals

- This artifact establishes component boundaries and candidate decisions, not a production-security claim or an implementation-ready resolution of every requirement.
- Registration, password reset, account management, multiple users, roles, MFA, and external identity providers are not added.
- No sessions, tokens, logout, protected business resources, or broader application-access behavior are implemented. The public fixture is permitted only for this local demo; remote TLS/deployment is prohibited and undefined.
- No database, durable audit store, distributed deployment, availability guarantees, performance targets, or browser matrix is invented.
- No application code exists in the inspected repository to validate these technology assumptions against. No code, requirements/review/other artifact, tests, commits, pushes, or pull requests were changed or executed during this stage; only this architecture artifact was revised.
- The architecture addresses design-review round 2 findings only within the explicitly bounded local demo. The wider application-access product scope remains outside this design, and the local HTTPS evidence and all proposed acceptance checks remain unexecuted. This artifact grants no approval and does not advance to planning.
