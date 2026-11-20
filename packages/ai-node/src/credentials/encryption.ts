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

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

/** Authenticated encryption algorithm persisted with every sealed credential. */
export const CREDENTIAL_ALGORITHM = 'aes-256-gcm';

/** Version of {@link CREDENTIAL_ALGORITHM} persisted with every sealed credential. */
export const CREDENTIAL_KEY_VERSION = 1;

const KEY_BYTES = 32;
const NONCE_BYTES = 12;
const TAG_BYTES = 16;

/** A credential after encryption, in the exact shape persisted in the database. */
export interface SealedCredential {
  readonly algorithm: string;
  readonly keyVersion: number;
  readonly nonce: string;
  readonly ciphertext: string;
  readonly tag: string;
}

/**
 * Validates the configured key material before any store is handed out. The
 * error never contains key material.
 */
export function assertEncryptionKey(encryptionKey: unknown): Buffer {
  if (!(encryptionKey instanceof Uint8Array)) {
    throw new Error(
      `Invalid credential encryption key: expected a Uint8Array of exactly ${KEY_BYTES} bytes`,
    );
  }
  if (encryptionKey.length !== KEY_BYTES) {
    throw new Error(
      `Invalid credential encryption key: expected exactly ${KEY_BYTES} bytes for ${CREDENTIAL_ALGORITHM}, got ${encryptionKey.length}`,
    );
  }
  return Buffer.from(encryptionKey);
}

/**
 * Binds a sealed value to its algorithm, key version, scope and provider.
 */
export function credentialAad(
  scopeKey: string,
  providerId: string,
  keyVersion: number = CREDENTIAL_KEY_VERSION,
): Buffer {
  return Buffer.from(
    JSON.stringify([
      'backstage-ai-credential',
      CREDENTIAL_ALGORITHM,
      keyVersion,
      scopeKey,
      providerId,
    ]),
    'utf8',
  );
}

/**
 * Encrypts a credential with a fresh nonce. Every call produces a unique nonce,
 * so equal plaintext never repeats a ciphertext.
 */
export function sealCredential(
  key: Buffer,
  aad: Buffer,
  plaintext: string,
): SealedCredential {
  const nonce = randomBytes(NONCE_BYTES);
  const cipher = createCipheriv(CREDENTIAL_ALGORITHM, key, nonce);
  cipher.setAAD(aad);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  return {
    algorithm: CREDENTIAL_ALGORITHM,
    keyVersion: CREDENTIAL_KEY_VERSION,
    nonce: nonce.toString('base64'),
    ciphertext: ciphertext.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
  };
}

/**
 * Decrypts a stored credential. Any corruption, wrong key, foreign scope or
 * unsupported algorithm/key version rejects instead of returning a partial
 * value.
 */
export function openCredential(
  key: Buffer,
  scopeKey: string,
  providerId: string,
  sealed: SealedCredential,
): string {
  if (sealed.algorithm !== CREDENTIAL_ALGORITHM) {
    throw new Error(
      `Stored credential for ${providerId} uses unsupported algorithm ${JSON.stringify(
        sealed.algorithm,
      )}`,
    );
  }
  if (sealed.keyVersion !== CREDENTIAL_KEY_VERSION) {
    throw new Error(
      `Stored credential for ${providerId} uses unsupported key version ${sealed.keyVersion}`,
    );
  }
  const nonce = Buffer.from(sealed.nonce, 'base64');
  const tag = Buffer.from(sealed.tag, 'base64');
  if (nonce.length !== NONCE_BYTES || tag.length !== TAG_BYTES) {
    throw new Error(`Stored credential for ${providerId} is corrupted`);
  }
  try {
    const decipher = createDecipheriv(CREDENTIAL_ALGORITHM, key, nonce);
    decipher.setAAD(credentialAad(scopeKey, providerId, sealed.keyVersion));
    decipher.setAuthTag(tag);
    return Buffer.concat([
      decipher.update(Buffer.from(sealed.ciphertext, 'base64')),
      decipher.final(),
    ]).toString('utf8');
  } catch {
    throw new Error(
      `Stored credential for ${providerId} could not be decrypted: the ciphertext, key or scope binding does not match`,
    );
  }
}
