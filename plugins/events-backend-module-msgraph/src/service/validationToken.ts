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
import crypto from 'node:crypto';

const ITERATIONS = 100_000;
const KEY_LEN = 32; // 256-bit
const DIGEST = 'sha256';

/**
 * Hashes a validation token with the given salt using PBKDF2.
 * @param token
 * @param salt
 */
export const hashValidationToken = (token: string, salt: string) =>
  crypto.pbkdf2Sync(token, salt, ITERATIONS, KEY_LEN, DIGEST).toString('hex');

/**
 * Generates a new validation token, its salt, and the corresponding hash.
 */
export function newValidationToken() {
  const validationToken = crypto.randomBytes(32).toString('hex');
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashValidationToken(validationToken, salt);
  return { validationToken, hash, salt };
}
