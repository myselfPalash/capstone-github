'use strict';

const fs = require('node:fs');
const https = require('node:https');
const path = require('node:path');
const tls = require('node:tls');
const { X509Certificate, createPrivateKey } = require('node:crypto');

const LOOPBACK_ADDRESS = '127.0.0.1';
const DEFAULT_PORT = 3000;
const MAX_REQUEST_BODY_BYTES = 8 * 1024;
const LOGIN_FIXTURE = Object.freeze({ username: 'admin', password: 'admin' });
const REPOSITORY_ROOT = fs.realpathSync(__dirname);
const PUBLIC_ASSET_ROOT = path.join(REPOSITORY_ROOT, 'public');
const PUBLIC_ASSETS = new Map([
  ['/', { file: 'index.html', contentType: 'text/html; charset=utf-8' }],
  ['/index.html', { file: 'index.html', contentType: 'text/html; charset=utf-8' }],
  ['/styles.css', { file: 'styles.css', contentType: 'text/css; charset=utf-8' }],
  ['/app.js', { file: 'app.js', contentType: 'text/javascript; charset=utf-8' }],
]);
const LOGIN_API_PATH = '/api/login';

function isWithinRepository(candidatePath) {
  const relativePath = path.relative(REPOSITORY_ROOT, candidatePath);
  return relativePath === '' ||
    (!path.isAbsolute(relativePath) &&
      relativePath !== '..' &&
      !relativePath.startsWith(`..${path.sep}`));
}

function readExternalTlsFile(environmentVariable) {
  const configuredPath = process.env[environmentVariable];
  if (!configuredPath || !path.isAbsolute(configuredPath)) {
    throw new Error(`${environmentVariable} must be an absolute path to an external file`);
  }

  let realPath;
  let file;
  try {
    realPath = fs.realpathSync(configuredPath);
    if (isWithinRepository(realPath) || !fs.statSync(realPath).isFile()) {
      throw new Error();
    }
    file = fs.readFileSync(realPath);
  } catch {
    throw new Error(`${environmentVariable} must identify a readable file outside the repository`);
  }

  return file;
}

function loadTlsOptions() {
  const certificate = readExternalTlsFile('TLS_CERT_PATH');
  const privateKey = readExternalTlsFile('TLS_KEY_PATH');
  const leafCertificatePem = certificate.toString('utf8').match(
    /-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/,
  )?.[0];

  if (!leafCertificatePem) {
    throw new Error('TLS_CERT_PATH does not contain a valid PEM certificate');
  }

  let parsedCertificate;
  let parsedPrivateKey;
  try {
    parsedCertificate = new X509Certificate(leafCertificatePem);
    parsedPrivateKey = createPrivateKey(privateKey);
  } catch {
    throw new Error('TLS certificate or private key is invalid');
  }

  const now = Date.now();
  const validFrom = Date.parse(parsedCertificate.validFrom);
  const validTo = Date.parse(parsedCertificate.validTo);
  if (!Number.isFinite(validFrom) || !Number.isFinite(validTo) ||
      now < validFrom || now > validTo) {
    throw new Error('TLS certificate is not currently valid');
  }

  if (!parsedCertificate.checkHost('localhost', { subject: 'never' })) {
    throw new Error('TLS certificate must include localhost in its subject alternative names');
  }

  if (!parsedCertificate.checkPrivateKey(parsedPrivateKey)) {
    throw new Error('TLS certificate and private key do not match');
  }

  try {
    // Let OpenSSL validate the certificate/key combination and any supplied chain.
    tls.createSecureContext({ cert: certificate, key: privateKey });
  } catch {
    throw new Error('TLS certificate or private key cannot be used');
  }

  return { cert: certificate, key: privateKey };
}

function getPort() {
  const rawPort = process.env.PORT ?? String(DEFAULT_PORT);
  if (!/^[0-9]+$/.test(rawPort)) {
    throw new Error('PORT must be an integer from 1 to 65535');
  }

  const port = Number(rawPort);
  if (!Number.isSafeInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer from 1 to 65535');
  }
  return port;
}

function getExpectedOrigin(port) {
  return port === 443 ? 'https://localhost' : `https://localhost:${port}`;
}

function headerOccurrences(request, headerName) {
  let occurrences = 0;
  for (let index = 0; index < request.rawHeaders.length; index += 2) {
    if (request.rawHeaders[index].toLowerCase() === headerName) {
      occurrences += 1;
    }
  }
  return occurrences;
}

function sendResponse(response, statusCode, contentType, body, extraHeaders = {}) {
  const payload = Buffer.isBuffer(body) ? body : Buffer.from(body);
  response.writeHead(statusCode, {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Content-Type': contentType,
    'Content-Length': payload.length,
    ...extraHeaders,
  });
  response.end(payload);
}

function sendJson(response, statusCode, result, extraHeaders = {}) {
  sendResponse(
    response,
    statusCode,
    'application/json; charset=utf-8',
    JSON.stringify(result),
    extraHeaders,
  );
}

function isExpectedHost(request, port) {
  if (headerOccurrences(request, 'host') !== 1) {
    return false;
  }
  const expectedHost = port === 443 ? 'localhost' : `localhost:${port}`;
  return request.headers.host === expectedHost;
}

function readRequestBody(request) {
  return new Promise((resolve) => {
    const rawLength = request.headers['content-length'];
    if (rawLength !== undefined) {
      if (!/^[0-9]+$/.test(rawLength)) {
        request.resume();
        resolve({ error: 400 });
        return;
      }
      if (Number(rawLength) > MAX_REQUEST_BODY_BYTES) {
        request.resume();
        resolve({ error: 413 });
        return;
      }
    }

    const chunks = [];
    let totalBytes = 0;
    let settled = false;
    const finish = (result) => {
      if (settled) {
        return;
      }
      settled = true;
      resolve(result);
    };

    request.on('data', (chunk) => {
      totalBytes += chunk.length;
      if (totalBytes > MAX_REQUEST_BODY_BYTES) {
        chunks.length = 0;
        finish({ error: 413 });
        request.resume();
        return;
      }
      if (!settled) {
        chunks.push(chunk);
      }
    });
    request.once('end', () => finish({ body: Buffer.concat(chunks) }));
    request.once('aborted', () => finish({ error: 400 }));
    request.once('error', () => finish({ error: 400 }));
  });
}

function isJsonContentType(value) {
  return typeof value === 'string' &&
    /^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(value);
}

function isOriginAllowed(request, expectedOrigin) {
  return headerOccurrences(request, 'origin') === 1 &&
    request.headers.origin === expectedOrigin;
}

function isValidLoginPayload(payload) {
  return payload !== null &&
    typeof payload === 'object' &&
    !Array.isArray(payload) &&
    Object.keys(payload).length === 2 &&
    Object.hasOwn(payload, 'username') &&
    Object.hasOwn(payload, 'password') &&
    typeof payload.username === 'string' &&
    typeof payload.password === 'string';
}

function credentialsAreAccepted(credentials) {
  const usernameMatches = credentials.username === LOGIN_FIXTURE.username;
  const passwordMatches = credentials.password === LOGIN_FIXTURE.password;
  return usernameMatches && passwordMatches;
}

function servePublicAsset(response, asset) {
  let assetPath;
  try {
    const rootStats = fs.lstatSync(PUBLIC_ASSET_ROOT);
    if (!rootStats.isDirectory()) {
      sendJson(response, 404, { error: 'not_found' });
      return;
    }

    const publicRoot = fs.realpathSync(PUBLIC_ASSET_ROOT);
    const resolvedAssetPath = fs.realpathSync(path.join(publicRoot, asset.file));
    const relativeAssetPath = path.relative(publicRoot, resolvedAssetPath);
    if (!isWithinRepository(publicRoot) ||
        path.isAbsolute(relativeAssetPath) ||
        relativeAssetPath === '..' ||
        relativeAssetPath.startsWith(`..${path.sep}`) ||
        !fs.statSync(resolvedAssetPath).isFile()) {
      sendJson(response, 404, { error: 'not_found' });
      return;
    }
    assetPath = resolvedAssetPath;
  } catch {
    sendJson(response, 404, { error: 'not_found' });
    return;
  }

  fs.readFile(assetPath, (error, contents) => {
    if (error) {
      sendJson(response, 404, { error: 'not_found' });
      return;
    }
    sendResponse(response, 200, asset.contentType, contents);
  });
}

function handleUnexpectedError(response) {
  // Never log the error itself: it could include request data or paths.
  console.error('Unexpected error while handling a request');
  try {
    if (!response.headersSent) {
      sendJson(response, 500, { error: 'internal_error' });
      return;
    }
  } catch {
    // Fall through and discard the response safely.
  }
  if (typeof response.destroy === 'function') {
    response.destroy();
  }
}

function createRequestHandler(port) {
  const expectedOrigin = getExpectedOrigin(port);
  const handleRequest = createRouteHandler(port, expectedOrigin);

  return async (request, response) => {
    try {
      await handleRequest(request, response);
    } catch {
      handleUnexpectedError(response);
    }
  };
}

function createRouteHandler(port, expectedOrigin) {
  return async (request, response) => {
    if (!isExpectedHost(request, port)) {
      sendJson(response, 400, { error: 'bad_request' });
      return;
    }

    const requestTarget = request.url;
    if (typeof requestTarget !== 'string' ||
        !requestTarget.startsWith('/') ||
        requestTarget.startsWith('//') ||
        requestTarget.includes('?') ||
        requestTarget.includes('#')) {
      sendJson(response, 404, { error: 'not_found' });
      return;
    }

    if (requestTarget === LOGIN_API_PATH) {
      if (request.method !== 'POST') {
        sendJson(response, 405, { error: 'method_not_allowed' }, { Allow: 'POST' });
        return;
      }
      if (!isOriginAllowed(request, expectedOrigin)) {
        sendJson(response, 403, { error: 'forbidden' });
        return;
      }
      if (!isJsonContentType(request.headers['content-type'])) {
        request.resume();
        sendJson(response, 415, { error: 'unsupported_media_type' });
        return;
      }

      const bodyResult = await readRequestBody(request);
      if (bodyResult.error) {
        sendJson(response, bodyResult.error, {
          error: bodyResult.error === 413 ? 'payload_too_large' : 'bad_request',
        });
        return;
      }

      let payload;
      try {
        payload = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bodyResult.body));
      } catch {
        sendJson(response, 400, { error: 'bad_request' });
        return;
      }

      if (!isValidLoginPayload(payload)) {
        sendJson(response, 400, { error: 'bad_request' });
        return;
      }

      if (!credentialsAreAccepted(payload)) {
        sendJson(response, 401, {
          accepted: false,
          error: 'invalid_credentials',
        });
        return;
      }

      sendJson(response, 200, { accepted: true });
      return;
    }

    const asset = PUBLIC_ASSETS.get(requestTarget);
    if (asset) {
      if (request.method !== 'GET') {
        sendJson(response, 405, { error: 'method_not_allowed' }, { Allow: 'GET' });
        return;
      }
      servePublicAsset(response, asset);
      return;
    }

    sendJson(response, 404, { error: 'not_found' });
  };
}

function startServer() {
  if (process.env.HOST !== undefined && process.env.HOST !== LOOPBACK_ADDRESS) {
    throw new Error(`HOST may only be set to ${LOOPBACK_ADDRESS}`);
  }

  const port = getPort();
  const tlsOptions = loadTlsOptions();
  const server = https.createServer(
    {
      ...tlsOptions,
      maxHeaderSize: 8 * 1024,
      requestTimeout: 12_000,
      headersTimeout: 10_000,
    },
    createRequestHandler(port),
  );

  let listening = false;
  // Handle every server error, both during startup and after listening.
  server.on('error', (error) => {
    process.exitCode = 1;
    if (!listening) {
      console.error(`HTTPS server failed to start: ${error.message}`);
      return;
    }
    console.error(`HTTPS server error: ${error.message}`);
    server.close();
  });
  server.listen(port, LOOPBACK_ADDRESS, () => {
    listening = true;
    console.log(`HTTPS server listening at ${getExpectedOrigin(port)}`);
  });

  return server;
}

if (require.main === module) {
  try {
    startServer();
  } catch (error) {
    console.error(`HTTPS server startup failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { createRequestHandler, loadTlsOptions, startServer };
