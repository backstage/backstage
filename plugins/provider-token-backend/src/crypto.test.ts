/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { deriveKey, encrypt, decrypt, DEFAULT_HKDF_SALT } from './crypto';

const SECRET = Buffer.from('test-secret-at-least-32-bytes-long-ok').toString(
  'base64',
);

describe('deriveKey', () => {
  it('returns a 32-byte Buffer', () => {
    const key = deriveKey(SECRET);
    expect(key).toBeInstanceOf(Buffer);
    expect(key.length).toBe(32);
  });

  it('is deterministic — same secret yields same key', () => {
    const k1 = deriveKey(SECRET);
    const k2 = deriveKey(SECRET);
    expect(k1.equals(k2)).toBe(true);
  });

  it('different secrets yield different keys', () => {
    const other = Buffer.from('entirely-different-secret-string-xyz').toString(
      'base64',
    );
    expect(deriveKey(SECRET).equals(deriveKey(other))).toBe(false);
  });

  it('throws when decoded secret is shorter than 16 bytes', () => {
    const short = Buffer.from('tiny').toString('base64');
    expect(() => deriveKey(short)).toThrow(/encryptionSecret/);
  });

  it('uses DEFAULT_HKDF_SALT when salt is omitted', () => {
    const withDefault = deriveKey(SECRET, DEFAULT_HKDF_SALT);
    const withOmitted = deriveKey(SECRET);
    expect(withDefault.equals(withOmitted)).toBe(true);
  });

  it('custom salt produces a different key than the default salt (G4)', () => {
    const customKey = deriveKey(SECRET, 'custom-salt-for-dev-env');
    const defaultKey = deriveKey(SECRET);
    expect(customKey.equals(defaultKey)).toBe(false);
  });

  it('custom salt is deterministic — same salt yields same key (G4)', () => {
    const k1 = deriveKey(SECRET, 'my-custom-salt');
    const k2 = deriveKey(SECRET, 'my-custom-salt');
    expect(k1.equals(k2)).toBe(true);
  });
});

describe('encrypt / decrypt', () => {
  let key: Buffer;
  beforeAll(() => {
    key = deriveKey(SECRET);
  });

  it('round-trips plaintext correctly', () => {
    const plaintext = 'access-token-abc123';
    const ciphertext = encrypt(plaintext, key);
    expect(decrypt(ciphertext, key)).toBe(plaintext);
  });

  it('produces a v1: prefixed string', () => {
    expect(encrypt('x', key)).toMatch(
      /^v1:[0-9a-f]{24}:[0-9a-f]{32}:[0-9a-f]+$/,
    );
  });

  it('different calls produce different ciphertexts (random IV)', () => {
    const c1 = encrypt('same', key);
    const c2 = encrypt('same', key);
    expect(c1).not.toBe(c2);
  });

  it('decrypt throws on tampered ciphertext (auth tag verification)', () => {
    const ciphertext = encrypt('secret', key);
    // Flip the last hex digit
    const tampered =
      ciphertext.slice(0, -1) + (ciphertext.endsWith('0') ? '1' : '0');
    expect(() => decrypt(tampered, key)).toThrow();
  });

  it('decrypt throws on unknown version prefix', () => {
    const ciphertext = encrypt('x', key).replace('v1:', 'v99:');
    expect(() => decrypt(ciphertext, key)).toThrow(/Unsupported.*version/);
  });

  it('decrypt throws on malformed ciphertext (wrong number of parts)', () => {
    expect(() => decrypt('notvalid', key)).toThrow(/Malformed/);
  });

  it('decrypt throws on stored value with invalid auth tag hex length', () => {
    // tagHex must be exactly 32 hex chars (16 bytes); this one is only 2 chars
    const badTag = `v1:${'a'.repeat(24)}:ab:${'cc'.repeat(4)}`;
    expect(() => decrypt(badTag, key)).toThrow(/invalid auth tag length/);
  });

  it('handles unicode plaintext', () => {
    const unicode = '日本語テスト🔑';
    expect(decrypt(encrypt(unicode, key), key)).toBe(unicode);
  });
});
