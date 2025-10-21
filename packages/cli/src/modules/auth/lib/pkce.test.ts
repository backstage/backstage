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
    it('should generate a verifier of default length', () => {
      const verifier = generateVerifier();

      expect(verifier).toBeDefined();
      expect(typeof verifier).toBe('string');
      expect(verifier.length).toBeGreaterThan(0);
    });

    it('should generate different verifiers on each call', () => {
      const verifier1 = generateVerifier();
      const verifier2 = generateVerifier();

      expect(verifier1).not.toBe(verifier2);
    });

    it('should generate base64url encoded string without padding', () => {
      const verifier = generateVerifier();

      // Base64url should not contain =, +, or /
      expect(verifier).not.toContain('=');
      expect(verifier).not.toContain('+');
      expect(verifier).not.toContain('/');

      // Should only contain base64url characters
      expect(verifier).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it('should generate verifier with custom length', () => {
      const shortVerifier = generateVerifier(32);
      const longVerifier = generateVerifier(96);

      expect(shortVerifier).toBeDefined();
      expect(longVerifier).toBeDefined();
      expect(shortVerifier.length).toBeGreaterThan(0);
      expect(longVerifier.length).toBeGreaterThan(shortVerifier.length);
    });

    it('should enforce minimum length of 32 bytes', () => {
      const verifier = generateVerifier(10); // Less than minimum

      expect(verifier).toBeDefined();
      // With 32 bytes minimum, base64url encoding should produce at least 43 chars
      expect(verifier.length).toBeGreaterThanOrEqual(43);
    });

    it('should enforce maximum length of 96 bytes', () => {
      const verifier = generateVerifier(200); // More than maximum

      expect(verifier).toBeDefined();
      // With 96 bytes maximum, base64url encoding should produce at most 128 chars
      expect(verifier.length).toBeLessThanOrEqual(128);
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
    it('should generate a challenge from a verifier', () => {
      const verifier = 'test-verifier-string';
      const challenge = challengeFromVerifier(verifier);

      expect(challenge).toBeDefined();
      expect(typeof challenge).toBe('string');
      expect(challenge.length).toBeGreaterThan(0);
    });

    it('should generate consistent challenge for same verifier', () => {
      const verifier = 'test-verifier-string';
      const challenge1 = challengeFromVerifier(verifier);
      const challenge2 = challengeFromVerifier(verifier);

      expect(challenge1).toBe(challenge2);
    });

    it('should generate different challenges for different verifiers', () => {
      const verifier1 = 'test-verifier-1';
      const verifier2 = 'test-verifier-2';
      const challenge1 = challengeFromVerifier(verifier1);
      const challenge2 = challengeFromVerifier(verifier2);

      expect(challenge1).not.toBe(challenge2);
    });

    it('should generate base64url encoded challenge without padding', () => {
      const verifier = 'test-verifier-string';
      const challenge = challengeFromVerifier(verifier);

      // Base64url should not contain =, +, or /
      expect(challenge).not.toContain('=');
      expect(challenge).not.toContain('+');
      expect(challenge).not.toContain('/');

      // Should only contain base64url characters
      expect(challenge).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it('should generate SHA-256 hash of correct length', () => {
      const verifier = 'test-verifier-string';
      const challenge = challengeFromVerifier(verifier);

      // SHA-256 produces 32 bytes, which in base64url is 43 characters (without padding)
      expect(challenge.length).toBe(43);
    });

    it('should handle empty verifier', () => {
      const verifier = '';
      const challenge = challengeFromVerifier(verifier);

      expect(challenge).toBeDefined();
      expect(challenge.length).toBe(43); // SHA-256 always produces 32 bytes
    });

    it('should handle very long verifier', () => {
      const verifier = 'a'.repeat(1000);
      const challenge = challengeFromVerifier(verifier);

      expect(challenge).toBeDefined();
      expect(challenge.length).toBe(43); // SHA-256 always produces 32 bytes
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

      expect(challenge1).toBe(challenge2);
      expect(challenge2).toBe(challenge3);
    });
  });
});
