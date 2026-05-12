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
  getEncryptedUpstreamToken,
  verifyRefreshToken,
} from './refreshToken';

describe('refreshToken', () => {
  describe('generateRefreshToken', () => {
    it('should generate a 2-part token without upstream token', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const { token, hash } = await generateRefreshToken(sessionId);

      expect(token).toBeDefined();
      expect(hash).toBeDefined();
      expect(token.split('.')).toHaveLength(2);

      const extractedId = getRefreshTokenId(token);
      expect(extractedId).toBe(sessionId);
    });

    it('should generate a 3-part token with upstream token', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const encryptedUpstream = 'abc123encryptedtoken';
      const { token, hash } = await generateRefreshToken(
        sessionId,
        encryptedUpstream,
      );

      expect(token).toBeDefined();
      expect(hash).toBeDefined();
      expect(token.split('.')).toHaveLength(3);

      expect(getRefreshTokenId(token)).toBe(sessionId);
      expect(getEncryptedUpstreamToken(token)).toBe(encryptedUpstream);
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
    it('should extract the session ID from a 2-part token', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const { token } = await generateRefreshToken(sessionId);

      expect(getRefreshTokenId(token)).toBe(sessionId);
    });

    it('should extract the session ID from a 3-part token', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const { token } = await generateRefreshToken(
        sessionId,
        'encrypted-upstream',
      );

      expect(getRefreshTokenId(token)).toBe(sessionId);
    });

    it('should handle tokens with any session ID format', async () => {
      const sessionId = 'any-session-id-format';
      const { token } = await generateRefreshToken(sessionId);

      expect(getRefreshTokenId(token)).toBe(sessionId);
    });

    it('should throw on invalid token format', () => {
      expect(() => getRefreshTokenId('invalid-token')).toThrow(
        'Invalid refresh token format',
      );
      expect(() => getRefreshTokenId('too.many.parts.here.four')).toThrow(
        'Invalid refresh token format',
      );
      expect(() => getRefreshTokenId('')).toThrow(
        'Invalid refresh token format',
      );
    });
  });

  describe('getEncryptedUpstreamToken', () => {
    it('should return the encrypted token from a 3-part token', async () => {
      const encrypted = 'my-encrypted-upstream-token';
      const { token } = await generateRefreshToken('session-id', encrypted);

      expect(getEncryptedUpstreamToken(token)).toBe(encrypted);
    });

    it('should return undefined for a 2-part token', async () => {
      const { token } = await generateRefreshToken('session-id');

      expect(getEncryptedUpstreamToken(token)).toBeUndefined();
    });

    it('should throw on invalid token format', () => {
      expect(() => getEncryptedUpstreamToken('invalid-token')).toThrow(
        'Invalid refresh token format',
      );
      expect(() => getEncryptedUpstreamToken('')).toThrow(
        'Invalid refresh token format',
      );
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid 2-part token against its hash', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const { token, hash } = await generateRefreshToken(sessionId);

      expect(await verifyRefreshToken(token, hash)).toBe(true);
    });

    it('should verify a valid 3-part token against its hash', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const { token, hash } = await generateRefreshToken(
        sessionId,
        'encrypted-upstream',
      );

      expect(await verifyRefreshToken(token, hash)).toBe(true);
    });

    it('should reject an invalid token', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const { hash } = await generateRefreshToken(sessionId);
      const { token: wrongToken } = await generateRefreshToken(sessionId);

      expect(await verifyRefreshToken(wrongToken, hash)).toBe(false);
    });

    it('should reject a modified token', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const { token, hash } = await generateRefreshToken(sessionId);

      const modifiedToken = `${token.slice(0, -1)}X`;
      expect(await verifyRefreshToken(modifiedToken, hash)).toBe(false);
    });

    it('should reject a 3-part token with tampered upstream portion', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const { token, hash } = await generateRefreshToken(
        sessionId,
        'original-encrypted',
      );

      const parts = token.split('.');
      const tamperedToken = `${parts[0]}.${parts[1]}.tampered-encrypted`;
      expect(await verifyRefreshToken(tamperedToken, hash)).toBe(false);
    });

    it('should reject with invalid hash format', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const { token } = await generateRefreshToken(sessionId);

      expect(await verifyRefreshToken(token, 'invalid-hash')).toBe(false);
    });

    it('should reject with empty hash', async () => {
      const sessionId = '123e4567-e89b-4d3a-a456-426614174000';
      const { token } = await generateRefreshToken(sessionId);

      expect(await verifyRefreshToken(token, '')).toBe(false);
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

      for (let i = 0; i < 10; i++) {
        expect(await verifyRefreshToken(token, hash)).toBe(true);
      }
    });
  });
});
