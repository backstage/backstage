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
import { hashValidationToken, newValidationToken } from './validationToken';

describe('hashValidationToken', () => {
  it('produces a deterministic hash for the same token and salt', () => {
    const token = 'test-token';
    const salt = 'test-salt';
    const hash1 = hashValidationToken(token, salt);
    const hash2 = hashValidationToken(token, salt);
    expect(hash1).toBe(hash2);
    expect(typeof hash1).toBe('string');
    expect(hash1.length).toBe(64); // 32 bytes in hex
  });

  it('produces different hashes for different tokens or salts', () => {
    const hashA = hashValidationToken('tokenA', 'saltA');
    const hashB = hashValidationToken('tokenB', 'saltA');
    const hashC = hashValidationToken('tokenA', 'saltB');
    expect(hashA).not.toBe(hashB);
    expect(hashA).not.toBe(hashC);
  });
});

describe('newValidationToken', () => {
  it('generates a new token, hash, and salt', () => {
    const { validationToken, hash, salt } = newValidationToken();
    expect(typeof validationToken).toBe('string');
    expect(typeof hash).toBe('string');
    expect(typeof salt).toBe('string');
    expect(validationToken.length).toBe(64); // 32 bytes in hex
    expect(salt.length).toBe(32); // 16 bytes in hex
    expect(hash.length).toBe(64); // 32 bytes in hex
  });

  it('hash matches hashValidationToken output', () => {
    const { validationToken, hash, salt } = newValidationToken();
    const expectedHash = hashValidationToken(validationToken, salt);
    expect(hash).toBe(expectedHash);
  });

  it('generates unique tokens and salts each time', () => {
    const first = newValidationToken();
    const second = newValidationToken();
    expect(first.validationToken).not.toBe(second.validationToken);
    expect(first.salt).not.toBe(second.salt);
    expect(first.hash).not.toBe(second.hash);
  });
});
