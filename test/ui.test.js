'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const publicRoot = path.resolve(__dirname, '..', 'public');
const source = fs.readFileSync(path.join(publicRoot, 'app.js'), 'utf8');

// A deliberately small DOM adapter exercises the actual browser script. These
// tests do not claim browser rendering, native form validation or HTTPS evidence.
function ui(fetchResponse, protocol = 'https:') {
  const ids = ['login-form', 'login-fields', 'username', 'password', 'feedback',
    'login-view', 'success-view', 'success-heading'];
  const elements = Object.fromEntries(ids.map((id) => [id, {
    value: '', textContent: '', hidden: id === 'success-view', disabled: true,
    attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; },
    addEventListener(name, callback) {
      assert.equal(name, 'submit');
      this.submit = callback;
    },
    focus() { this.focused = true; },
  }]));
  elements['login-form'].reset = () => {
    elements.username.value = '';
    elements.password.value = '';
  };
  elements.username.value = 'synthetic-user-marker';
  elements.password.value = 'synthetic-password-marker';
  const calls = [];
  const timers = new Map();
  let timerId = 0;
  vm.runInNewContext(source, {
    document: { getElementById: (id) => {
      assert.ok(elements[id], `unknown element: ${id}`);
      return elements[id];
    } },
    window: { location: { protocol } },
    AbortController,
    fetch: (...args) => {
      calls.push(args);
      return fetchResponse(...args);
    },
    setTimeout: (callback, delay) => {
      assert.equal(delay, 10_000);
      timers.set(++timerId, callback);
      return timerId;
    },
    clearTimeout: (id) => timers.delete(id),
  }, { filename: 'public/app.js' });
  return {
    elements, calls, timers,
    submit() {
      let prevented = false;
      const result = elements['login-form'].submit({
        preventDefault() { prevented = true; },
      });
      assert.equal(prevented, true);
      return result;
    },
  };
}

function expectSettled(view, accepted = false) {
  assert.equal(view.elements.password.value, '');
  assert.equal(view.elements['login-fields'].disabled, false);
  assert.equal(view.elements['login-form'].attributes['aria-busy'], undefined);
  assert.equal(view.elements['success-view'].hidden, !accepted);
  assert.equal(view.elements['login-view'].hidden, accepted);
  assert.equal(view.timers.size, 0);
}

test('markup provides labeled controls, accessible feedback and hidden success view', () => {
  const html = fs.readFileSync(path.join(publicRoot, 'index.html'), 'utf8');
  assert.match(html, /<label for="username">Username<\/label>/);
  assert.match(html, /<label for="password">Password<\/label>/);
  assert.match(html, /<input id="password"[^>]*type="password"[^>]*required>/);
  assert.match(html, /<button type="submit">Login<\/button>/);
  assert.match(html, /<fieldset id="login-fields" disabled>/);
  assert.match(html, /id="feedback" role="status" aria-live="polite"/);
  assert.match(html, /<section id="success-view"[^>]* hidden>/);
  assert.match(html, /<script src="\/app.js" defer>/);
  assert.doesNotMatch(html + source, /admin|localStorage|sessionStorage|document\.cookie/);
});

test('submission uses only the same-origin JSON POST; success waits for backend acceptance', async () => {
  let resolveResponse;
  const view = ui(() => new Promise((resolve) => { resolveResponse = resolve; }));
  assert.equal(view.elements['login-fields'].disabled, false);
  const pending = view.submit();
  assert.equal(view.calls.length, 1);
  const [url, options] = view.calls[0];
  assert.equal(url, '/api/login');
  assert.equal(options.method, 'POST');
  assert.equal(options.mode, 'same-origin');
  assert.equal(options.credentials, 'omit');
  assert.equal(options.cache, 'no-store');
  assert.equal(options.redirect, 'error');
  assert.equal(options.headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(options.body), {
    username: 'synthetic-user-marker', password: 'synthetic-password-marker',
  });
  assert.equal(view.elements.password.value, '');
  assert.equal(view.elements['login-fields'].disabled, true);
  assert.equal(view.elements['login-form'].attributes['aria-busy'], 'true');
  assert.equal(view.elements['success-view'].hidden, true);
  await view.submit();
  assert.equal(view.calls.length, 1, 'duplicate submission must not replay credentials');
  resolveResponse({ status: 200, json: async () => ({ accepted: true }) });
  await pending;
  expectSettled(view, true);
  assert.equal(view.elements.username.value, '');
  assert.equal(view.elements.feedback.textContent, '');
  assert.equal(view.elements['success-heading'].focused, true);
});

test('401 gives generic feedback and allows a later user-initiated retry', async () => {
  const view = ui(async () => ({
    status: 401,
    json() { throw new Error('must not display or inspect rejection body'); },
  }));
  await view.submit();
  expectSettled(view);
  assert.equal(view.elements.feedback.textContent, 'Invalid username or password.');
  assert.equal(view.calls.length, 1);
  view.elements.password.value = 'second-synthetic-marker';
  await view.submit();
  expectSettled(view);
  assert.equal(view.calls.length, 2);
});

test('unavailable, malformed and non-accepted responses never show success or retry', async () => {
  const responses = [
    async () => { throw new Error('synthetic-network-marker'); },
    async () => ({ status: 500 }),
    async () => ({ status: 403 }),
    async () => ({ status: 302 }),
    async () => ({ status: 200, json: async () => ({ accepted: false }) }),
    async () => ({ status: 200, json: async () => ({ accepted: 'true' }) }),
    async () => ({ status: 200, json: async () => ({}) }),
    async () => ({ status: 200, json: async () => null }),
    async () => ({ status: 200, json: async () => { throw new Error('invalid JSON'); } }),
  ];
  for (const response of responses) {
    const view = ui(response);
    await view.submit();
    expectSettled(view);
    assert.equal(view.elements.feedback.textContent, 'Login service unavailable. Please try again.');
    assert.equal(view.calls.length, 1);
  }
});

test('HTTP copies never transmit credentials', async () => {
  const view = ui(() => { throw new Error('must not fetch'); }, 'http:');
  await view.submit();
  expectSettled(view);
  assert.equal(view.calls.length, 0);
  assert.equal(view.elements.feedback.textContent,
    'Open this demo over trusted local HTTPS to submit.');
});

test('request timeout aborts, clears sensitive state and reports unavailability', async () => {
  const view = ui((url, options) => new Promise((resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
  }));
  const pending = view.submit();
  assert.equal(view.timers.size, 1);
  [...view.timers.values()][0]();
  await pending;
  expectSettled(view);
  assert.equal(view.calls[0][1].signal.aborted, true);
  assert.equal(view.calls.length, 1);
  assert.equal(view.elements.feedback.textContent, 'Login service unavailable. Please try again.');
});
