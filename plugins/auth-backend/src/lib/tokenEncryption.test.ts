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

import {
  generateEncryptionKey,
  encryptToken,
  decryptToken,
} from './tokenEncryption';

describe('tokenEncryption', () => {
  describe('generateEncryptionKey', () => {
    it('should generate a base64url-encoded 32-byte key', () => {
      const key = generateEncryptionKey();
      const decoded = Buffer.from(key, 'base64url');
      expect(decoded.length).toBe(32);
    });

    it('should generate unique keys', () => {
      const key1 = generateEncryptionKey();
      const key2 = generateEncryptionKey();
      expect(key1).not.toBe(key2);
    });
  });

  describe('encryptToken / decryptToken', () => {
    it('should round-trip a plaintext string', () => {
      const key = generateEncryptionKey();
      const plaintext = 'ya29.upstream-refresh-token-value';

      const encrypted = encryptToken(plaintext, key);
      const decrypted = decryptToken(encrypted, key);

      expect(decrypted).toBe(plaintext);
    });

    it('should produce base64url output without dots', () => {
      const key = generateEncryptionKey();
      const encrypted = encryptToken('test-token', key);

      expect(encrypted).not.toContain('.');
      expect(encrypted).not.toContain('+');
      expect(encrypted).not.toContain('/');
      expect(encrypted).not.toContain('=');
    });

    it('should produce different ciphertexts for the same plaintext', () => {
      const key = generateEncryptionKey();
      const plaintext = 'same-token';

      const encrypted1 = encryptToken(plaintext, key);
      const encrypted2 = encryptToken(plaintext, key);

      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should fail to decrypt with the wrong key', () => {
      const key1 = generateEncryptionKey();
      const key2 = generateEncryptionKey();
      const encrypted = encryptToken('secret', key1);

      expect(() => decryptToken(encrypted, key2)).toThrow();
    });

    it('should fail to decrypt tampered ciphertext', () => {
      const key = generateEncryptionKey();
      const encrypted = encryptToken('secret', key);

      const buf = Buffer.from(encrypted, 'base64url');
      buf[buf.length - 1] ^= 0xff;
      const tampered = buf.toString('base64url');

      expect(() => decryptToken(tampered, key)).toThrow();
    });

    it('should handle empty plaintext', () => {
      const key = generateEncryptionKey();
      const encrypted = encryptToken('', key);
      expect(decryptToken(encrypted, key)).toBe('');
    });

    it('should handle large tokens', () => {
      const key = generateEncryptionKey();
      const plaintext = 'x'.repeat(10000);
      const encrypted = encryptToken(plaintext, key);
      expect(decryptToken(encrypted, key)).toBe(plaintext);
    });

    it('should reject invalid key length', () => {
      const shortKey = Buffer.from('too-short').toString('base64url');
      expect(() => encryptToken('test', shortKey)).toThrow(
        'Invalid encryption key length',
      );
      expect(() => decryptToken('test', shortKey)).toThrow(
        'Invalid encryption key length',
      );
    });

    it('should reject truncated encrypted data', () => {
      const key = generateEncryptionKey();
      const tooShort = Buffer.alloc(10).toString('base64url');
      expect(() => decryptToken(tooShort, key)).toThrow(
        'Invalid encrypted token',
      );
    });
  });
});
