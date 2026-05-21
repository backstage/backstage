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

import {
  randomBytes,
  scrypt,
  timingSafeEqual,
  ScryptOptions,
} from 'node:crypto';

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const SCRYPT_OPTIONS: ScryptOptions = { N: 16384, r: 8, p: 1 };

function scryptAsync(
  password: string,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, options, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

/**
 * Hash a token using scrypt
 * @internal
 */
async function hashToken(token: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const hash = await scryptAsync(token, salt, KEY_LENGTH, SCRYPT_OPTIONS);

  // Store salt + hash together
  return `${salt.toString('base64')}.${hash.toString('base64')}`;
}

/**
 * Generate a cryptographically secure refresh token with embedded session ID
 * and optional encrypted upstream token.
 *
 * @param id - The session ID to embed in the token
 * @param encryptedUpstreamToken - Optional base64url-encoded encrypted upstream refresh token
 * @returns Object containing the token and its hash
 * @internal
 */
export async function generateRefreshToken(
  id: string,
  encryptedUpstreamToken?: string,
): Promise<{
  token: string;
  hash: string;
}> {
  // Generate 32 bytes of random data
  const randomPart = randomBytes(32).toString('base64url');

  // Format: <id>.<random_bytes> or <id>.<random_bytes>.<encrypted_upstream_token>
  const token = encryptedUpstreamToken
    ? `${id}.${randomPart}.${encryptedUpstreamToken}`
    : `${id}.${randomPart}`;
  const hash = await hashToken(token);

  return { token, hash };
}

/**
 * Extract the session ID from a refresh token.
 * Supports both 2-part (legacy) and 3-part (with upstream token) formats.
 *
 * @param token - The refresh token
 * @returns The session ID
 * @throws Error if token format is invalid
 * @internal
 */
export function getRefreshTokenId(token: string): string {
  return parseRefreshTokenParts(token)[0];
}

/**
 * Extract the encrypted upstream token from a 3-part refresh token.
 *
 * @param token - The refresh token
 * @returns The encrypted upstream token, or undefined if not present (legacy format)
 * @throws Error if token format is invalid
 * @internal
 */
export function getEncryptedUpstreamToken(token: string): string | undefined {
  const parts = parseRefreshTokenParts(token);
  return parts.length === 3 ? parts[2] : undefined;
}

function parseRefreshTokenParts(
  token: string,
): [string, string] | [string, string, string] {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid refresh token format');
  }

  const parts = token.split('.');
  if ((parts.length !== 2 && parts.length !== 3) || !parts[0] || !parts[1]) {
    throw new Error('Invalid refresh token format');
  }

  return parts as [string, string] | [string, string, string];
}

/**
 * Verify a refresh token against a stored hash
 *
 * @param token - The refresh token to verify
 * @param storedHash - The stored hash (salt.hash format)
 * @returns true if token is valid, false otherwise
 * @internal
 */
export async function verifyRefreshToken(
  token: string,
  storedHash: string,
): Promise<boolean> {
  try {
    const [saltBase64, hashBase64] = storedHash.split('.');
    if (!saltBase64 || !hashBase64) {
      return false;
    }

    const salt = Buffer.from(saltBase64, 'base64');
    const storedHashBuffer = Buffer.from(hashBase64, 'base64');

    const computedHash = await scryptAsync(
      token,
      salt,
      KEY_LENGTH,
      SCRYPT_OPTIONS,
    );

    // Use timing-safe comparison to prevent timing attacks
    return timingSafeEqual(storedHashBuffer, computedHash);
  } catch {
    return false;
  }
}
