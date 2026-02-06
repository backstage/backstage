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
  generateRefreshToken,
  getRefreshTokenId,
  verifyRefreshToken,
} from './refreshToken';

describe('refreshToken', () => {
  describe('generateRefreshToken', () => {
    it('should generate a token with embedded ID', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const { token, hash } = await generateRefreshToken(sessionId);

      expect(token).toBeDefined();
      expect(hash).toBeDefined();
      expect(token).toContain('.');
      expect(hash).toContain('.');

      // Verify ID is embedded in token
      const extractedId = getRefreshTokenId(token);
      expect(extractedId).toBe(sessionId);
    });

    it('should generate unique tokens for the same ID', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const result1 = await generateRefreshToken(sessionId);
      const result2 = await generateRefreshToken(sessionId);

      expect(result1.token).not.toBe(result2.token);
      expect(result1.hash).not.toBe(result2.hash);
    });

    it('should generate different hashes for different tokens', async () => {
      const sessionId1 = '123e4567-e89b-4d3a-a456-426614174000';
      const sessionId2 = '223e4567-e89b-4d3a-a456-426614174001';

      const result1 = await generateRefreshToken(sessionId1);
      const result2 = await generateRefreshToken(sessionId2);

      expect(result1.hash).not.toBe(result2.hash);
    });
  });

  describe('getRefreshTokenId', () => {
    it('should extract the session ID from a valid token', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const { token } = await generateRefreshToken(sessionId);

      const extractedId = getRefreshTokenId(token);
      expect(extractedId).toBe(sessionId);
    });

    it('should handle tokens with any session ID format', async () => {
      const sessionId = 'any-session-id-format';
      const { token } = await generateRefreshToken(sessionId);

      const extractedId = getRefreshTokenId(token);
      expect(extractedId).toBe(sessionId);
    });

    it('should throw on invalid token format', () => {
      expect(() => getRefreshTokenId('invalid-token')).toThrow(
        'Invalid refresh token format',
      );
      expect(() => getRefreshTokenId('too.many.parts.here')).toThrow(
        'Invalid refresh token format',
      );
      expect(() => getRefreshTokenId('')).toThrow(
        'Invalid refresh token format',
      );
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid token against its hash', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const { token, hash } = await generateRefreshToken(sessionId);

      const isValid = await verifyRefreshToken(token, hash);
      expect(isValid).toBe(true);
    });

    it('should reject an invalid token', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const { hash } = await generateRefreshToken(sessionId);
      const { token: wrongToken } = await generateRefreshToken(sessionId);

      const isValid = await verifyRefreshToken(wrongToken, hash);
      expect(isValid).toBe(false);
    });

    it('should reject a modified token', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const { token, hash } = await generateRefreshToken(sessionId);

      // Modify the token slightly
      const modifiedToken = `${token.slice(0, -1)}X`;

      const isValid = await verifyRefreshToken(modifiedToken, hash);
      expect(isValid).toBe(false);
    });

    it('should reject with invalid hash format', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const { token } = await generateRefreshToken(sessionId);

      const isValid = await verifyRefreshToken(token, 'invalid-hash');
      expect(isValid).toBe(false);
    });

    it('should reject with empty hash', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const { token } = await generateRefreshToken(sessionId);

      const isValid = await verifyRefreshToken(token, '');
      expect(isValid).toBe(false);
    });

    it('should handle malformed hash gracefully', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const { token } = await generateRefreshToken(sessionId);

      expect(await verifyRefreshToken(token, 'not.a.valid.hash')).toBe(false);
      expect(await verifyRefreshToken(token, '.')).toBe(false);
    });

    it('should be timing-safe (multiple verifications should work)', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const { token, hash } = await generateRefreshToken(sessionId);

      // Verify multiple times to ensure timing safety
      for (let i = 0; i < 10; i++) {
        expect(await verifyRefreshToken(token, hash)).toBe(true);
      }
    });
  });
});
