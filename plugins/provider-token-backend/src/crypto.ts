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

// Internal only — NOT exported from index.ts
import {
  hkdfSync,
  randomBytes,
  createCipheriv,
  createDecipheriv,
} from 'node:crypto';

const ALGO = 'aes-256-gcm' as const;
const KEY_VERSION = 'v1';

/** Derives a 32-byte AES key using HKDF-SHA-256 (RFC 5869). */
export function deriveKey(secret: string): Buffer {
  return Buffer.from(
    hkdfSync(
      'sha256',
      Buffer.from(secret, 'base64'),
      Buffer.from('backstage-provider-token-salt-v1', 'utf8'),
      Buffer.from('provider-token-service', 'utf8'),
      32,
    ),
  );
}

/**
 * Encrypts plaintext with AES-256-GCM.
 * Returns "v1:<iv_hex>:<tag_hex>:<ciphertext_hex>".
 * A fresh random 96-bit IV is generated per call — never reuse IV with the same key.
 */
export function encrypt(plaintext: string, key: Buffer): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `${KEY_VERSION}:${iv.toString('hex')}:${tag.toString(
    'hex',
  )}:${encrypted.toString('hex')}`;
}

/**
 * Decrypts a ciphertext produced by encrypt().
 * GCM auth tag is verified before returning plaintext — throws on tampered data.
 */
export function decrypt(stored: string, key: Buffer): string {
  const parts = stored.split(':');
  if (parts.length !== 4) {
    throw new Error('Malformed provider token ciphertext');
  }
  const [version, ivHex, tagHex, dataHex] = parts;
  if (version !== KEY_VERSION) {
    throw new Error(
      `Unsupported provider token ciphertext version: ${version}`,
    );
  }
  const decipher = createDecipheriv(ALGO, key, Buffer.from(ivHex, 'hex'), {
    authTagLength: 16,
  });
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  return (
    decipher.update(Buffer.from(dataHex, 'hex'), undefined, 'utf8') +
    decipher.final('utf8')
  );
}
