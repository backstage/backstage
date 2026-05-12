/*
 * Copyright 2025 The Backstage Authors
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

import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Generate a random AES-256-GCM encryption key.
 * @returns base64url-encoded key
 * @internal
 */
export function generateEncryptionKey(): string {
  return randomBytes(KEY_LENGTH).toString('base64url');
}

/**
 * Encrypt a plaintext string using AES-256-GCM with a random IV.
 * The output is a single base64url string containing IV + ciphertext + auth tag.
 *
 * @param plaintext - The string to encrypt
 * @param key - base64url-encoded AES-256 key
 * @returns base64url-encoded encrypted payload
 * @internal
 */
export function encryptToken(plaintext: string, key: string): string {
  const keyBuffer = Buffer.from(key, 'base64url');
  if (keyBuffer.length !== KEY_LENGTH) {
    throw new Error('Invalid encryption key length');
  }

  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, keyBuffer, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // Pack as: IV (12) + ciphertext (variable) + authTag (16)
  const packed = Buffer.concat([iv, encrypted, authTag]);
  return packed.toString('base64url');
}

/**
 * Decrypt a payload encrypted by {@link encryptToken}.
 *
 * @param encrypted - base64url-encoded encrypted payload
 * @param key - base64url-encoded AES-256 key
 * @returns The original plaintext
 * @internal
 */
export function decryptToken(encrypted: string, key: string): string {
  const keyBuffer = Buffer.from(key, 'base64url');
  if (keyBuffer.length !== KEY_LENGTH) {
    throw new Error('Invalid encryption key length');
  }

  const packed = Buffer.from(encrypted, 'base64url');
  if (packed.length < IV_LENGTH + AUTH_TAG_LENGTH) {
    throw new Error('Invalid encrypted token');
  }

  const iv = packed.subarray(0, IV_LENGTH);
  const authTag = packed.subarray(packed.length - AUTH_TAG_LENGTH);
  const ciphertext = packed.subarray(
    IV_LENGTH,
    packed.length - AUTH_TAG_LENGTH,
  );

  const decipher = createDecipheriv(ALGORITHM, keyBuffer, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}
