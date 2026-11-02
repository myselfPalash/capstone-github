# capstone-github

## Node.js baseline

This local demo targets Node.js **24.22.1**, an exact Node.js LTS release. The
same version is recorded in `.nvmrc` and the `engines.node` field in
`package.json`. No third-party runtime dependencies are required.

- `npm start` starts the planned server entry point (`server.js`).
- `npm test` runs the built-in Node.js test runner over the tests in `test/`.

## Local HTTPS startup

The demo listens only on `127.0.0.1` and is opened at
`https://localhost:3000` by default. Before starting it, provide a trusted
development certificate for `localhost` and its matching private key in
external files (never in this repository or its public assets):

- `TLS_CERT_PATH`: absolute path to the PEM certificate (and optional chain).
- `TLS_KEY_PATH`: absolute path to the matching PEM private key.
- `PORT`: optional port from 1 to 65535; defaults to `3000`.
- `HOST`: optional safety check; if set, it must be exactly `127.0.0.1`.

For example, set those environment variables in the local shell and run
`npm start`. Startup stops on missing, unreadable, malformed, expired, not-yet-
valid, hostname-mismatched, or non-matching TLS material; it never falls back
to HTTP. The certificate must be trusted by the local browser/client normally.
Do not bypass certificate validation or use this demo with real or sensitive
data.

## Login API Origin requirement

`POST /api/login` requires exactly one `Origin` header whose value is exactly
`https://localhost:<port>` (for example `https://localhost:3000`; on port 443
it is `https://localhost`). Requests without it, or with any other value, are
rejected with `403`. Browsers send this header automatically from the demo
page; non-browser clients such as `curl` must send it explicitly, together with
`Content-Type: application/json`.
