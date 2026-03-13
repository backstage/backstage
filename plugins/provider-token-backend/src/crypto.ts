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

/** Default HKDF salt. Kept in sync with the config default in plugin.ts. */
export const DEFAULT_HKDF_SALT = 'backstage-provider-token-salt-v1';

/**
 * Derives a 32-byte AES key using HKDF-SHA-256 (RFC 5869).
 *
 * @param secret - Base64-encoded input key material from config.
 * @param salt   - Optional HKDF salt override (G4: configurable via providerToken.hkdfSalt).
 *                 Defaults to DEFAULT_HKDF_SALT. Use a custom salt for key-namespace isolation
 *                 (e.g., separate dev/staging/prod environments sharing the same secret).
 */
export function deriveKey(secret: string, salt?: string): Buffer {
  const ikm = Buffer.from(secret, 'base64');
  if (ikm.length < 16) {
    throw new Error(
      'providerToken.encryptionSecret is too short: must decode to at least 16 bytes. Use `openssl rand -base64 32` to generate a suitable secret.',
    );
  }
  return Buffer.from(
    hkdfSync(
      'sha256',
      ikm,
      Buffer.from(salt ?? DEFAULT_HKDF_SALT, 'utf8'),
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

  // Sanitize version before including in error messages to prevent log injection
  // from a tampered DB row (restrict to safe identifier characters).
  if (!/^[a-z0-9_-]{1,16}$/.test(version ?? '')) {
    throw new Error('Malformed provider token ciphertext: invalid version');
  }
  if (version !== KEY_VERSION) {
    throw new Error(
      `Unsupported provider token ciphertext version: ${version}`,
    );
  }

  // Validate component lengths before allocating buffers:
  // 12-byte IV = 24 hex chars, 16-byte GCM tag = 32 hex chars, data must be even-length hex.
  if (!ivHex || ivHex.length !== 24) {
    throw new Error('Malformed provider token ciphertext: invalid IV length');
  }
  if (!tagHex || tagHex.length !== 32) {
    throw new Error(
      'Malformed provider token ciphertext: invalid auth tag length',
    );
  }
  if (!dataHex || dataHex.length % 2 !== 0) {
    throw new Error('Malformed provider token ciphertext: invalid data length');
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

/**
 * Decrypts a ciphertext using the primary key; if that fails and a fallback key is
 * provided, attempts decryption with the fallback key (G5 dual-key rotation).
 *
 * Returns `{ plaintext, usedFallback: true }` when the fallback key was needed so
 * the caller can lazily re-encrypt with the current key.
 *
 * Throws if neither key can decrypt — the error is from the primary key attempt so
 * callers never log the fallback key value. If no fallback is provided, behaves
 * identically to `decrypt()`.
 */
export function decryptWithFallback(
  stored: string,
  key: Buffer,
  fallbackKey?: Buffer,
): { plaintext: string; usedFallback: boolean } {
  try {
    return { plaintext: decrypt(stored, key), usedFallback: false };
  } catch (primaryErr) {
    if (!fallbackKey) throw primaryErr;
    try {
      return { plaintext: decrypt(stored, fallbackKey), usedFallback: true };
    } catch {
      // Re-throw the primary error — it carries the most relevant context.
      throw primaryErr;
    }
  }
}
