'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { loadTlsOptions } = require('../server');

const root = path.resolve(__dirname, '..');

function startup(overrides) {
  const env = { ...process.env };
  for (const name of ['HOST', 'PORT', 'TLS_CERT_PATH', 'TLS_KEY_PATH']) delete env[name];
  Object.assign(env, overrides);
  return spawnSync(process.execPath, [path.join(root, 'server.js')], {
    cwd: root, env, encoding: 'utf8', timeout: 5000,
  });
}

test('startup fails closed for unsafe configuration or unavailable TLS files', () => {
  for (const [env, message] of [
    [{ HOST: '0.0.0.0' }, 'HOST may only be set'],
    [{ HOST: '::' }, 'HOST may only be set'],
    [{ PORT: '0' }, 'PORT must be an integer'],
    [{ PORT: '65536' }, 'PORT must be an integer'],
    [{ PORT: '3.5' }, 'PORT must be an integer'],
    [{}, 'TLS_CERT_PATH must be an absolute path'],
    [{ TLS_CERT_PATH: 'relative.pem' }, 'TLS_CERT_PATH must be an absolute path'],
    [{ TLS_CERT_PATH: path.join(root, 'README.md') }, 'outside the repository'],
    [{ TLS_CERT_PATH: path.join(root, 'nonexistent-test-certificate.pem') },
      'outside the repository'],
  ]) {
    const result = startup(env);
    assert.equal(result.error, undefined);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /HTTPS server startup failed:/);
    assert.equal(result.stderr.includes(message), true);
  }
});

test('TLS loader rejects malformed material without certificates, keys or listeners', async (t) => {
  // All external-file operations are mocked: no file is created or read outside
  // the repository, and no certificate/private-key fixture is stored anywhere.
  const syntheticCert = path.resolve(root, '..', 'synthetic-certificate.pem');
  const syntheticKey = path.resolve(root, '..', 'synthetic-key.pem');
  for (const [contents, message] of [
    ['not a certificate', /does not contain a valid PEM certificate/],
    ['-----BEGIN CERTIFICATE-----\ninvalid\n-----END CERTIFICATE-----',
      /TLS certificate or private key is invalid/],
  ]) {
    await t.test(message.source, (t) => {
      const originalEnvironment = {
        TLS_CERT_PATH: process.env.TLS_CERT_PATH,
        TLS_KEY_PATH: process.env.TLS_KEY_PATH,
      };
      t.after(() => {
        for (const [name, value] of Object.entries(originalEnvironment)) {
          if (value === undefined) delete process.env[name];
          else process.env[name] = value;
        }
      });
      process.env.TLS_CERT_PATH = syntheticCert;
      process.env.TLS_KEY_PATH = syntheticKey;
      t.mock.method(fs, 'realpathSync', (file) => file);
      t.mock.method(fs, 'statSync', () => ({ isFile: () => true }));
      t.mock.method(fs, 'readFileSync', (file) => {
        assert.ok(file === syntheticCert || file === syntheticKey);
        return Buffer.from(file === syntheticCert ? contents : 'invalid key');
      });
      assert.throws(loadTlsOptions, message);
    });
  }
});

// Minimal DER encoder used to build throwaway self-signed X.509 certificates
// at test time with node:crypto only (no OpenSSL CLI or third-party package).
function der(tag, contents) {
  const length = contents.length;
  let header;
  if (length < 0x80) header = Buffer.from([tag, length]);
  else if (length < 0x100) header = Buffer.from([tag, 0x81, length]);
  else header = Buffer.from([tag, 0x82, length >> 8, length & 0xff]);
  return Buffer.concat([header, contents]);
}
const sequence = (...items) => der(0x30, Buffer.concat(items));

function oid(value) {
  const [first, second, ...rest] = value.split('.').map(Number);
  const bytes = [first * 40 + second];
  for (const part of rest) {
    const encoded = [part & 0x7f];
    for (let remaining = part >> 7; remaining > 0; remaining >>= 7) {
      encoded.unshift((remaining & 0x7f) | 0x80);
    }
    bytes.push(...encoded);
  }
  return der(0x06, Buffer.from(bytes));
}

function time(date) {
  const text = date.toISOString().replace(/[-:T]/g, '').slice(0, 14) + 'Z';
  const year = date.getUTCFullYear();
  return year >= 1950 && year < 2050
    ? der(0x17, Buffer.from(text.slice(2)))
    : der(0x18, Buffer.from(text));
}

function createCertificatePem({ keyPair, notBefore, notAfter, dnsNames }) {
  const name = sequence(der(0x31, sequence(oid('2.5.4.3'),
    der(0x0c, Buffer.from('synthetic-test-certificate')))));
  const signatureAlgorithm = sequence(oid('1.2.840.10045.4.3.2'));
  const serial = crypto.randomBytes(8);
  serial[0] = (serial[0] & 0x7f) | 0x01;
  const extensions = dnsNames.length === 0 ? [] : [der(0xa3, sequence(sequence(
    oid('2.5.29.17'),
    der(0x04, sequence(...dnsNames.map((dnsName) => der(0x82, Buffer.from(dnsName))))),
  )))];
  const tbsCertificate = sequence(
    der(0xa0, der(0x02, Buffer.from([2]))),
    der(0x02, serial),
    signatureAlgorithm,
    name,
    sequence(time(notBefore), time(notAfter)),
    name,
    keyPair.publicKey.export({ type: 'spki', format: 'der' }),
    ...extensions,
  );
  const signature = crypto.sign('sha256', tbsCertificate, keyPair.privateKey);
  const certificate = sequence(
    tbsCertificate,
    signatureAlgorithm,
    der(0x03, Buffer.concat([Buffer.from([0]), signature])),
  );
  const base64 = certificate.toString('base64').match(/.{1,64}/g).join('\n');
  return `-----BEGIN CERTIFICATE-----\n${base64}\n-----END CERTIFICATE-----\n`;
}

test('TLS loader fails closed for unusable certificates and loads valid material', async (t) => {
  // Throwaway material is generated per run in os.tmpdir() and removed afterwards.
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'login-demo-tls-'));
  const originalEnvironment = {
    TLS_CERT_PATH: process.env.TLS_CERT_PATH,
    TLS_KEY_PATH: process.env.TLS_KEY_PATH,
  };
  t.after(() => {
    fs.rmSync(directory, { recursive: true, force: true });
    for (const [name, value] of Object.entries(originalEnvironment)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  });

  const keyPair = crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
  const otherKeyPair = crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
  const day = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const valid = { keyPair, notBefore: new Date(now - day), notAfter: new Date(now + day),
    dnsNames: ['localhost'] };

  for (const [label, certificateOptions, privateKey, expected] of [
    ['expired certificate', { ...valid, notBefore: new Date(now - 3 * day),
      notAfter: new Date(now - day) }, keyPair.privateKey, /not currently valid/],
    ['not-yet-valid certificate', { ...valid, notBefore: new Date(now + day),
      notAfter: new Date(now + 3 * day) }, keyPair.privateKey, /not currently valid/],
    ['certificate without SANs', { ...valid, dnsNames: [] }, keyPair.privateKey,
      /must include localhost/],
    ['certificate without localhost SAN', { ...valid, dnsNames: ['other.example'] },
      keyPair.privateKey, /must include localhost/],
    ['private key not matching certificate', valid, otherKeyPair.privateKey,
      /do not match/],
    ['valid localhost certificate and matching key', valid, keyPair.privateKey, null],
  ]) {
    await t.test(label, () => {
      const certPath = path.join(directory, 'cert.pem');
      const keyPath = path.join(directory, 'key.pem');
      const certificatePem = createCertificatePem(certificateOptions);
      const keyPem = privateKey.export({ type: 'pkcs8', format: 'pem' });
      fs.writeFileSync(certPath, certificatePem, { mode: 0o600 });
      fs.writeFileSync(keyPath, keyPem, { mode: 0o600 });
      process.env.TLS_CERT_PATH = certPath;
      process.env.TLS_KEY_PATH = keyPath;
      try {
        if (expected) {
          assert.throws(loadTlsOptions, (error) => {
            assert.match(error.message, expected);
            assert.equal(error.message.includes(directory), false);
            return true;
          });
        } else {
          const options = loadTlsOptions();
          assert.equal(options.cert.toString(), certificatePem);
          assert.equal(options.key.toString(), keyPem);
        }
      } finally {
        fs.rmSync(certPath, { force: true });
        fs.rmSync(keyPath, { force: true });
      }
    });
  }
});
