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

import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1 };

/**
 * Hash a token using scrypt
 * @internal
 */
function hashToken(token: string): string {
  const salt = randomBytes(SALT_LENGTH);
  const hash = scryptSync(token, salt, KEY_LENGTH, SCRYPT_OPTIONS);

  // Store salt + hash together
  return `${salt.toString('base64')}.${hash.toString('base64')}`;
}

/**
 * Generate a cryptographically secure refresh token with embedded session ID
 *
 * @param id - The session ID to embed in the token
 * @returns Object containing the token and its hash
 * @public
 */
export function generateRefreshToken(id: string): {
  token: string;
  hash: string;
} {
  // Generate 32 bytes of random data
  const randomPart = randomBytes(32).toString('base64url');

  // Format: <id>.<random_bytes>
  const token = `${id}.${randomPart}`;
  const hash = hashToken(token);

  return { token, hash };
}

/**
 * Extract the session ID from a refresh token
 *
 * @param token - The refresh token
 * @returns The session ID
 * @throws Error if token format is invalid
 * @public
 */
export function getRefreshTokenId(token: string): string {
  const parts = token.split('.');
  if (parts.length !== 2) {
    throw new Error('Invalid refresh token format');
  }
  return parts[0];
}

/**
 * Verify a refresh token against a stored hash
 *
 * @param token - The refresh token to verify
 * @param storedHash - The stored hash (salt.hash format)
 * @returns true if token is valid, false otherwise
 * @public
 */
export function verifyRefreshToken(token: string, storedHash: string): boolean {
  try {
    const [saltBase64, hashBase64] = storedHash.split('.');
    if (!saltBase64 || !hashBase64) {
      return false;
    }

    const salt = Buffer.from(saltBase64, 'base64');
    const storedHashBuffer = Buffer.from(hashBase64, 'base64');

    const computedHash = scryptSync(token, salt, KEY_LENGTH, SCRYPT_OPTIONS);

    // Use timing-safe comparison to prevent timing attacks
    return timingSafeEqual(storedHashBuffer, computedHash);
  } catch {
    return false;
  }
}
