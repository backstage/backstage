/*
 * Copyright 2024 The Backstage Authors
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
  JWK,
  JWTPayload,
  KeyLike,
  SignJWT,
  exportJWK,
  generateKeyPair,
  importJWK,
} from 'jose';
import { createTokenValidator } from './helpers';
import { mockServices } from '@backstage/backend-test-utils';

const issuerURL = 'https://login.example.com';
const projectAudience = '111111111111111111';
const authProxyClientID = '444444444444444444@holos_platform';
const emailAddress = 'emanon@example.com';
const subject = '555555555555555555';

// createJwks creates a valid json web key set to mock the oidc identity issuer.
async function createJwks() {
  const { publicKey, privateKey } = await generateKeyPair('RS256');
  const jwk = await exportJWK(publicKey);
  return { keys: [jwk], privateKey };
}

const mockLogger = mockServices.logger.mock();

// issueIdToken issues a valid oidc id token signed by privateKey.
async function issueIdToken(
  privateKey: KeyLike | Uint8Array,
  transform?: (payload: JWTPayload) => JWTPayload,
) {
  const mapClaims = (payload: JWTPayload) => {
    if (transform) {
      return transform(payload);
    }
    return payload;
  };
  const now = Math.floor(Date.now() / 1000);

  const payload = mapClaims({
    iss: issuerURL,
    aud: [
      projectAudience,
      authProxyClientID,
      '222222222222222222@holos_platform', // project app 1 client id
      '333333333333333333@holos_platform', // project app 2 client id
    ],
    amr: ['user', 'mfa'],
    auth_time: now,
    iat: now,
    exp: now + 3600,
    azp: authProxyClientID,
    sub: subject,
    email: emailAddress,
    email_verified: true,
    name: 'Alice Doe',
    given_name: 'Alice',
    family_name: 'Doe',
    preferred_username: 'emanon@example.com',
    groups: ['prod-cluster-admin'],
  });

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'RS256' })
    .sign(privateKey);
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('helpers', () => {
  let jwks: (KeyLike | Uint8Array)[];
  let privateKey: KeyLike;

  beforeAll(async () => {
    const jwksData = await createJwks();
    privateKey = jwksData.privateKey;
    jwks = await Promise.all(
      jwksData.keys.map(async (jwk: JWK) => {
        try {
          return await importJWK(jwk);
        } catch (error) {
          throw new Error(`could not import jwk: ${error}`);
        }
      }),
    );
  });

  describe('createTokenValidator', () => {
    it('runs the happy path', async () => {
      const validator = createTokenValidator(
        mockLogger,
        issuerURL,
        projectAudience,
        jwks,
      );
      const idToken = await issueIdToken(privateKey);
      await expect(validator(idToken)).resolves.toMatchObject({
        iss: issuerURL,
        sub: subject,
        email: emailAddress,
      });
    });

    it('rejects invalid signature', async () => {
      const validator = createTokenValidator(
        mockLogger,
        issuerURL,
        projectAudience,
        jwks,
      );
      // Issue a token signed by another jwks.
      const jwksData = await createJwks();
      const otherIdToken = await issueIdToken(jwksData.privateKey);
      await expect(validator(otherIdToken)).rejects.toThrow(
        'could not validate id token: signature verification failed',
      );
    });

    it('rejects invalid token', async () => {
      const validator = createTokenValidator(
        mockLogger,
        issuerURL,
        projectAudience,
        jwks,
      );

      await expect(validator('{}')).rejects.toThrow(
        'could not validate id token: JWSInvalid: Invalid Compact JWS',
      );
    });

    it('rejects missing iss', async () => {
      const validator = createTokenValidator(
        mockLogger,
        issuerURL,
        projectAudience,
        jwks,
      );
      const idToken = await issueIdToken(privateKey, payload => {
        delete payload.iss;
        return payload;
      });

      await expect(validator(idToken)).rejects.toThrow(
        'could not validate id token: JWTClaimValidationFailed: missing required "iss" claim',
      );
    });

    it('rejects missing sub', async () => {
      const validator = createTokenValidator(
        mockLogger,
        issuerURL,
        projectAudience,
        jwks,
      );
      const idToken = await issueIdToken(privateKey, payload => {
        delete payload.sub;
        return payload;
      });

      await expect(validator(idToken)).rejects.toThrow(
        'could not validate id token: JWTClaimValidationFailed: missing required "sub" claim',
      );
    });

    it('rejects missing email', async () => {
      const validator = createTokenValidator(
        mockLogger,
        issuerURL,
        projectAudience,
        jwks,
      );
      const idToken = await issueIdToken(privateKey, payload => {
        delete payload.email;
        return payload;
      });

      await expect(validator(idToken)).rejects.toThrow(
        'could not validate id token: JWTClaimValidationFailed: missing required "email" claim',
      );
    });

    it('rejects missing aud', async () => {
      const validator = createTokenValidator(
        mockLogger,
        issuerURL,
        projectAudience,
        jwks,
      );
      const idToken = await issueIdToken(privateKey, payload => {
        delete payload.aud;
        return payload;
      });

      await expect(validator(idToken)).rejects.toThrow(
        'could not validate id token: JWTClaimValidationFailed: missing required "aud" claim',
      );
    });

    it('rejects invalid iss', async () => {
      const validator = createTokenValidator(
        mockLogger,
        issuerURL,
        projectAudience,
        jwks,
      );
      const idToken = await issueIdToken(privateKey, payload => {
        payload.iss = 'https://other.example.com';
        return payload;
      });

      await expect(validator(idToken)).rejects.toThrow(
        'could not validate id token: JWTClaimValidationFailed: unexpected "iss" claim value',
      );
    });

    it('rejects invalid aud', async () => {
      const validator = createTokenValidator(
        mockLogger,
        issuerURL,
        projectAudience,
        jwks,
      );
      const idToken = await issueIdToken(privateKey, payload => {
        payload.aud = ['some-other-service'];
        return payload;
      });

      await expect(validator(idToken)).rejects.toThrow(
        'could not validate id token: JWTClaimValidationFailed: unexpected "aud" claim value',
      );
    });

    it('rejects expired token', async () => {
      const validator = createTokenValidator(
        mockLogger,
        issuerURL,
        projectAudience,
        jwks,
      );
      const idToken = await issueIdToken(privateKey, payload => {
        payload.exp = 1581033600;
        return payload;
      });

      await expect(validator(idToken)).rejects.toThrow(
        'could not validate id token: JWTExpired: "exp" claim timestamp check failed',
      );
    });
  });
});
