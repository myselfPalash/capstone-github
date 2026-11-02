'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { Readable } = require('node:stream');
const { test } = require('node:test');
const { createRequestHandler } = require('../server');

const root = path.resolve(__dirname, '..');
const origin = 'https://localhost:3000';
// The architecture explicitly authorizes this public demo fixture.
const validBody = JSON.stringify({ username: 'admin', password: 'admin' });
const bodyLimit = 8 * 1024;

// Invoke the exported handler with a real readable stream, without opening a
// plaintext listener or pretending to verify HTTPS/certificate trust.
async function request(options = {}) {
  const headers = {
    host: 'localhost:3000',
    origin,
    'content-type': 'application/json',
    ...options.headers,
  };
  for (const name of Object.keys(headers)) {
    if (headers[name] === undefined) delete headers[name];
  }
  const rawHeaders = Object.entries(headers).flat();
  rawHeaders.push(...(options.extraRawHeaders || []));
  const incoming = options.stream || Readable.from(
    options.chunks || [Buffer.from(options.body ?? validBody)],
  );
  Object.assign(incoming, {
    headers,
    rawHeaders,
    method: options.method || 'POST',
    url: options.url ?? '/api/login',
  });
  let status;
  let responseHeaders;
  const completed = new Promise((resolve) => {
    const response = {
      writeHead(code, values) {
        status = code;
        responseHeaders = Object.fromEntries(
          Object.entries(values).map(([name, value]) => [name.toLowerCase(), value]),
        );
      },
      end(body) {
        resolve({ status, headers: responseHeaders, body: Buffer.from(body) });
      },
    };
    Promise.resolve(createRequestHandler(options.port ?? 3000)(incoming, response))
      .catch(resolve);
  });
  const result = await completed;
  if (result instanceof Error) throw result;
  assert.equal(result.headers['cache-control'], 'no-store');
  assert.equal(result.headers['x-content-type-options'], 'nosniff');
  assert.equal(result.headers['content-length'], result.body.length);
  assert.equal(result.headers['set-cookie'], undefined);
  assert.equal(Object.keys(result.headers).some((name) =>
    name.startsWith('access-control-')), false);
  return result;
}

function expectJson(result, status, body) {
  assert.equal(result.status, status);
  assert.equal(result.headers['content-type'], 'application/json; charset=utf-8');
  assert.deepEqual(JSON.parse(result.body.toString()), body);
}

test('only the exact credential pair is accepted; mismatches are generic', async (t) => {
  const logged = [];
  for (const method of ['log', 'info', 'warn', 'error', 'debug']) {
    t.mock.method(console, method, (...args) => logged.push(args));
  }
  expectJson(await request(), 200, { accepted: true });
  for (const [username, password] of [
    ['wrong-user-marker', 'admin'],
    ['admin', 'wrong-password-marker'],
    ['wrong-user-marker', 'wrong-password-marker'],
    ['same-but-not-fixture', 'same-but-not-fixture'],
    ['', ''], ['Admin', 'admin'], ['admin', 'Admin'],
    [' admin', 'admin'], ['admin', 'admin '],
  ]) {
    const result = await request({ body: JSON.stringify({ username, password }) });
    expectJson(result, 401, { accepted: false, error: 'invalid_credentials' });
    assert.equal(result.body.includes(Buffer.from('marker')), false);
  }
  assert.deepEqual(logged, [], 'login handling must not log credentials or results');
});

test('malformed JSON, invalid UTF-8 and invalid shapes fail without disclosure', async () => {
  const bodies = [
    '', '{', 'null', '[]', '"string"', '42', 'true',
    '{}', '{"username":"marker"}', '{"password":"marker"}',
    '{"username":null,"password":"marker"}',
    '{"username":"marker","password":17}',
    '{"username":[],"password":{}}',
    '{"username":"admin","password":"admin","extra":"marker"}',
    Buffer.from([0x7b, 0xff, 0x7d]),
  ];
  for (const body of bodies) {
    expectJson(await request({ body }), 400, { error: 'bad_request' });
  }
});

test('body size is bounded for declared lengths and streaming bytes', async () => {
  const atLimit = validBody + ' '.repeat(bodyLimit - Buffer.byteLength(validBody));
  expectJson(await request({
    body: atLimit, headers: { 'content-length': String(bodyLimit) },
  }), 200, { accepted: true });
  expectJson(await request({ body: atLimit + ' ' }), 413, { error: 'payload_too_large' });
  expectJson(await request({
    headers: { 'content-length': String(bodyLimit + 1) },
  }), 413, { error: 'payload_too_large' });
  // Count UTF-8 bytes, not JS characters, and enforce limits even with no
  // Content-Length (or a claimed small length).
  for (const headers of [{}, { 'content-length': '1' }]) {
    expectJson(await request({
      headers,
      chunks: [Buffer.from(validBody), Buffer.from('é'.repeat(bodyLimit / 2))],
    }), 413, { error: 'payload_too_large' });
  }
  for (const length of ['-1', '1.5', 'abc', '']) {
    expectJson(await request({ headers: { 'content-length': length } }),
      400, { error: 'bad_request' });
  }
  expectJson(await request({
    chunks: [Buffer.from(validBody.slice(0, 10)), Buffer.from(validBody.slice(10))],
  }), 200, { accepted: true });
});

test('interrupted body streams fail closed', async () => {
  for (const event of ['aborted', 'error']) {
    const stream = new Readable({
      read() {
        this.emit(event, new Error('synthetic-input-marker'));
        this.push(null);
      },
    });
    expectJson(await request({ stream }), 400, { error: 'bad_request' });
  }
});

test('API methods and content types are restricted', async () => {
  for (const method of ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS']) {
    const result = await request({ method });
    expectJson(result, 405, { error: 'method_not_allowed' });
    assert.equal(result.headers.allow, 'POST');
  }
  for (const type of [undefined, 'text/plain', 'application/x-www-form-urlencoded',
    'application/json; charset=latin1', 'application/json; extra=value',
    'application/json, text/plain']) {
    expectJson(await request({ headers: { 'content-type': type } }),
      415, { error: 'unsupported_media_type' });
  }
  for (const type of ['application/json', 'Application/JSON; charset=UTF-8']) {
    expectJson(await request({ headers: { 'content-type': type } }), 200, { accepted: true });
  }
});

test('Host must occur exactly once and match the configured local origin', async () => {
  for (const host of [undefined, '', 'evil.example:3000', 'localhost:3001',
    '127.0.0.1:3000', 'localhost', 'localhost:3000.evil.example']) {
    expectJson(await request({ headers: { host } }), 400, { error: 'bad_request' });
  }
  expectJson(await request({ extraRawHeaders: ['Host', 'localhost:3000'] }),
    400, { error: 'bad_request' });
  expectJson(await request({
    port: 443, headers: { host: 'localhost', origin: 'https://localhost' },
  }), 200, { accepted: true });
  expectJson(await request({
    port: 443, headers: { host: 'localhost:443', origin: 'https://localhost' },
  }), 400, { error: 'bad_request' });
});

test('API Origin is required, singular and exactly same-origin; no CORS preflight', async () => {
  for (const value of [undefined, '', 'null', 'http://localhost:3000',
    'https://localhost:3001', 'https://evil.example', origin + '/',
    origin + '.evil.example']) {
    expectJson(await request({ headers: { origin: value } }), 403, { error: 'forbidden' });
  }
  expectJson(await request({ extraRawHeaders: ['Origin', origin] }),
    403, { error: 'forbidden' });
  expectJson(await request({
    method: 'OPTIONS',
    headers: { origin: 'https://evil.example', 'access-control-request-method': 'POST' },
  }), 405, { error: 'method_not_allowed' });
});

test('only exact allowlisted request targets are routed', async () => {
  for (const url of [
    '', '//localhost:3000/api/login', 'https://localhost:3000/api/login',
    '/api/login?username=synthetic-marker', '/api/login#fragment', '/api/login/',
    '/server.js', '/package.json', '/requirements.md', '/.git/config',
    '/TLS_KEY_PATH', '/public/app.js', '/../server.js', '/%2e%2e/server.js',
    '/..\\server.js', '/%2fapp.js', '/APP.JS', '/styles.css?query', '/unknown',
  ]) {
    const result = await request({ url, method: 'GET' });
    expectJson(result, 404, { error: 'not_found' });
    assert.equal(result.body.includes(Buffer.from(root)), false);
  }
});

test('public assets match allowlisted files, have safe headers and no fixture', async () => {
  for (const [url, file, contentType] of [
    ['/', 'index.html', 'text/html'],
    ['/index.html', 'index.html', 'text/html'],
    ['/styles.css', 'styles.css', 'text/css'],
    ['/app.js', 'app.js', 'text/javascript'],
  ]) {
    const result = await request({ url, method: 'GET', headers: { origin: undefined } });
    assert.equal(result.status, 200);
    assert.equal(result.headers['content-type'], `${contentType}; charset=utf-8`);
    assert.deepEqual(result.body, fs.readFileSync(path.join(root, 'public', file)));
    assert.equal(result.body.toString().includes('admin'), false);
    for (const method of ['POST', 'HEAD', 'OPTIONS']) {
      const rejected = await request({ url, method });
      expectJson(rejected, 405, { error: 'method_not_allowed' });
      assert.equal(rejected.headers.allow, 'GET');
    }
  }
});

test('unexpected internal errors return a generic 500 without echoing input', async (t) => {
  const marker = 'internal-error-input-marker';
  await t.test('asset reader throws', async (t) => {
    const logged = [];
    t.mock.method(console, 'error', (...args) => logged.push(args));
    t.mock.method(fs, 'readFile', () => { throw new Error(`${marker} ${root}`); });
    const result = await request({
      url: '/app.js', method: 'GET', headers: { authorization: marker, 'x-probe': marker },
    });
    expectJson(result, 500, { error: 'internal_error' });
    assert.equal(result.body.includes(Buffer.from(marker)), false);
    assert.deepEqual(logged, [['Unexpected error while handling a request']]);
  });
  await t.test('login body reader throws', async (t) => {
    const logged = [];
    t.mock.method(console, 'error', (...args) => logged.push(args));
    const stream = Readable.from([Buffer.from(JSON.stringify({
      username: `${marker}-user`, password: `${marker}-password`,
    }))]);
    stream.on = () => { throw new Error(`${marker}-password`); };
    const result = await request({ stream });
    expectJson(result, 500, { error: 'internal_error' });
    assert.equal(result.body.includes(Buffer.from(marker)), false);
    assert.deepEqual(logged, [['Unexpected error while handling a request']]);
  });
});

test('asset filesystem failures are generic and resolved paths cannot escape', async (t) => {
  const realpath = fs.realpathSync;
  const stat = fs.statSync;
  for (const failure of ['outside-root', 'missing', 'directory', 'read-error']) {
    await t.test(failure, async (t) => {
      if (failure === 'outside-root' || failure === 'missing') {
        t.mock.method(fs, 'realpathSync', (file, ...args) => {
          if (file === path.join(root, 'public', 'app.js')) {
            if (failure === 'missing') throw new Error('private-path-marker');
            return path.join(root, 'server.js');
          }
          return realpath(file, ...args);
        });
      } else if (failure === 'directory') {
        t.mock.method(fs, 'statSync', (file, ...args) =>
          file === path.join(root, 'public', 'app.js')
            ? { isFile: () => false } : stat(file, ...args));
      } else {
        t.mock.method(fs, 'readFile', (file, callback) =>
          callback(new Error('private-path-marker')));
      }
      expectJson(await request({ url: '/app.js', method: 'GET' }),
        404, { error: 'not_found' });
    });
  }
});
