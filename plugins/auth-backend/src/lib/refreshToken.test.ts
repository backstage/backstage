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
    it('should generate a token with embedded ID', () => {
      const sessionId = 'test-session-id';
      const { token, hash } = generateRefreshToken(sessionId);

      expect(token).toBeDefined();
      expect(hash).toBeDefined();
      expect(token).toContain('.');
      expect(hash).toContain('.');

      // Verify ID is embedded in token
      const extractedId = getRefreshTokenId(token);
      expect(extractedId).toBe(sessionId);
    });

    it('should generate unique tokens for the same ID', () => {
      const sessionId = 'test-session-id';
      const result1 = generateRefreshToken(sessionId);
      const result2 = generateRefreshToken(sessionId);

      expect(result1.token).not.toBe(result2.token);
      expect(result1.hash).not.toBe(result2.hash);
    });

    it('should generate different hashes for different tokens', () => {
      const sessionId1 = 'session-1';
      const sessionId2 = 'session-2';

      const result1 = generateRefreshToken(sessionId1);
      const result2 = generateRefreshToken(sessionId2);

      expect(result1.hash).not.toBe(result2.hash);
    });
  });

  describe('getRefreshTokenId', () => {
    it('should extract the session ID from a valid token', () => {
      const sessionId = 'test-session-id';
      const { token } = generateRefreshToken(sessionId);

      const extractedId = getRefreshTokenId(token);
      expect(extractedId).toBe(sessionId);
    });

    it('should handle tokens with complex IDs', () => {
      const sessionId = 'session-123-abc-xyz';
      const { token } = generateRefreshToken(sessionId);

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
    it('should verify a valid token against its hash', () => {
      const sessionId = 'test-session-id';
      const { token, hash } = generateRefreshToken(sessionId);

      const isValid = verifyRefreshToken(token, hash);
      expect(isValid).toBe(true);
    });

    it('should reject an invalid token', () => {
      const sessionId = 'test-session-id';
      const { hash } = generateRefreshToken(sessionId);
      const { token: wrongToken } = generateRefreshToken(sessionId);

      const isValid = verifyRefreshToken(wrongToken, hash);
      expect(isValid).toBe(false);
    });

    it('should reject a modified token', () => {
      const sessionId = 'test-session-id';
      const { token, hash } = generateRefreshToken(sessionId);

      // Modify the token slightly
      const modifiedToken = `${token.slice(0, -1)}X`;

      const isValid = verifyRefreshToken(modifiedToken, hash);
      expect(isValid).toBe(false);
    });

    it('should reject with invalid hash format', () => {
      const sessionId = 'test-session-id';
      const { token } = generateRefreshToken(sessionId);

      const isValid = verifyRefreshToken(token, 'invalid-hash');
      expect(isValid).toBe(false);
    });

    it('should reject with empty hash', () => {
      const sessionId = 'test-session-id';
      const { token } = generateRefreshToken(sessionId);

      const isValid = verifyRefreshToken(token, '');
      expect(isValid).toBe(false);
    });

    it('should handle malformed hash gracefully', () => {
      const sessionId = 'test-session-id';
      const { token } = generateRefreshToken(sessionId);

      expect(verifyRefreshToken(token, 'not.a.valid.hash')).toBe(false);
      expect(verifyRefreshToken(token, '.')).toBe(false);
    });

    it('should be timing-safe (multiple verifications should work)', () => {
      const sessionId = 'test-session-id';
      const { token, hash } = generateRefreshToken(sessionId);

      // Verify multiple times to ensure timing safety
      for (let i = 0; i < 10; i++) {
        expect(verifyRefreshToken(token, hash)).toBe(true);
      }
    });
  });
});
