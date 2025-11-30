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

import crypto from 'crypto';
import { generateVerifier, challengeFromVerifier } from './pkce';

describe('pkce', () => {
  describe('generateVerifier', () => {
    it('should generate verifiers with proper encoding and length', () => {
      // Test default length
      const defaultVerifier = generateVerifier();
      expect(defaultVerifier).toBeDefined();
      expect(typeof defaultVerifier).toBe('string');
      expect(defaultVerifier.length).toBeGreaterThan(0);

      // Test custom lengths
      const shortVerifier = generateVerifier(32);
      const longVerifier = generateVerifier(96);
      expect(shortVerifier).toBeDefined();
      expect(longVerifier).toBeDefined();
      expect(shortVerifier.length).toBeGreaterThan(0);
      expect(longVerifier.length).toBeGreaterThan(shortVerifier.length);

      // Test base64url encoding (no padding, proper characters)
      const verifier = generateVerifier();
      expect(verifier).not.toContain('=');
      expect(verifier).not.toContain('+');
      expect(verifier).not.toContain('/');
      expect(verifier).toMatch(/^[A-Za-z0-9_-]+$/);

      // Test uniqueness
      const verifier1 = generateVerifier();
      const verifier2 = generateVerifier();
      expect(verifier1).not.toBe(verifier2);
    });

    it('should enforce minimum and maximum length constraints', () => {
      // Test minimum length enforcement
      const minVerifier = generateVerifier(10); // Less than minimum
      expect(minVerifier).toBeDefined();
      expect(minVerifier.length).toBeGreaterThanOrEqual(43); // 32 bytes = 43 base64url chars

      // Test maximum length enforcement
      const maxVerifier = generateVerifier(200); // More than maximum
      expect(maxVerifier).toBeDefined();
      expect(maxVerifier.length).toBeLessThanOrEqual(128); // 96 bytes = 128 base64url chars
    });

    it('should produce consistent results for same byte sequence', () => {
      // Mock crypto.randomBytes to return predictable values
      const mockBytes = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);
      jest.spyOn(crypto, 'randomBytes').mockImplementation(_count => mockBytes);

      const verifier1 = generateVerifier(8);
      const verifier2 = generateVerifier(8);

      expect(verifier1).toBe(verifier2);

      (crypto.randomBytes as jest.Mock).mockRestore();
    });
  });

  describe('challengeFromVerifier', () => {
    it('should generate challenges with proper encoding and consistency', () => {
      const verifier = 'test-verifier-string';
      const challenge = challengeFromVerifier(verifier);

      // Basic properties
      expect(challenge).toBeDefined();
      expect(typeof challenge).toBe('string');
      expect(challenge.length).toBe(43); // SHA-256 = 32 bytes = 43 base64url chars

      // Base64url encoding (no padding, proper characters)
      expect(challenge).not.toContain('=');
      expect(challenge).not.toContain('+');
      expect(challenge).not.toContain('/');
      expect(challenge).toMatch(/^[A-Za-z0-9_-]+$/);

      // Consistency for same verifier
      const challenge1 = challengeFromVerifier(verifier);
      const challenge2 = challengeFromVerifier(verifier);
      expect(challenge1).toBe(challenge2);
      expect(challenge1).toBe(challenge);

      // Different challenges for different verifiers
      const verifier2 = 'test-verifier-2';
      const challenge3 = challengeFromVerifier(verifier2);
      expect(challenge3).not.toBe(challenge);
    });

    it('should handle edge cases for verifier length', () => {
      // Empty verifier
      const emptyChallenge = challengeFromVerifier('');
      expect(emptyChallenge).toBeDefined();
      expect(emptyChallenge.length).toBe(43);

      // Very long verifier
      const longVerifier = 'a'.repeat(1000);
      const longChallenge = challengeFromVerifier(longVerifier);
      expect(longChallenge).toBeDefined();
      expect(longChallenge.length).toBe(43); // SHA-256 always produces 32 bytes
    });

    it('should produce RFC 7636 compliant challenge', () => {
      // Test with a known verifier
      const verifier = generateVerifier();
      const challenge = challengeFromVerifier(verifier);

      // Verify it's using SHA-256 correctly
      const expectedHash = crypto
        .createHash('sha256')
        .update(verifier)
        .digest();
      const expectedChallenge = expectedHash
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

      expect(challenge).toBe(expectedChallenge);
    });
  });

  describe('PKCE flow integration', () => {
    it('should generate valid verifier and challenge pair', () => {
      const verifier = generateVerifier();
      const challenge = challengeFromVerifier(verifier);

      expect(verifier).toBeDefined();
      expect(challenge).toBeDefined();
      expect(verifier).not.toBe(challenge);

      // Verifier should be longer than challenge
      expect(verifier.length).toBeGreaterThan(challenge.length);
    });

    it('should generate multiple unique pairs', () => {
      const pair1 = {
        verifier: generateVerifier(),
        challenge: '',
      };
      pair1.challenge = challengeFromVerifier(pair1.verifier);

      const pair2 = {
        verifier: generateVerifier(),
        challenge: '',
      };
      pair2.challenge = challengeFromVerifier(pair2.verifier);

      expect(pair1.verifier).not.toBe(pair2.verifier);
      expect(pair1.challenge).not.toBe(pair2.challenge);
    });

    it('should maintain one-to-one mapping between verifier and challenge', () => {
      const verifier = generateVerifier();
      const challenge1 = challengeFromVerifier(verifier);
      const challenge2 = challengeFromVerifier(verifier);
      const challenge3 = challengeFromVerifier(verifier);

      // All challenges from same verifier should be identical
      expect(challenge1).toBe(challenge2);
      expect(challenge2).toBe(challenge3);
    });
  });
});
