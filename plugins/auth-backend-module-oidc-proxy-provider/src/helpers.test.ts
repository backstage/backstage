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
  FlattenedJWSInput,
  GetKeyFunction,
  JWK,
  JWSHeaderParameters,
  JWTPayload,
  KeyLike,
  SignJWT,
  exportJWK,
  generateKeyPair,
  importJWK,
} from 'jose';
import { randomUUID } from 'crypto';
import { createTokenValidator } from './helpers';
import { mockServices } from '@backstage/backend-test-utils';
import { KeyStoreClient } from './JwksClient';

const issuerURL = 'https://login.example.com';
const projectAudience = '111111111111111111';
const authProxyClientID = '444444444444444444@holos_platform';
const emailAddress = 'emanon@example.com';
const subject = '555555555555555555';

// createJwks creates a valid json web key set to mock the oidc identity issuer.
async function createJwks() {
  const kid = randomUUID();
  const { publicKey, privateKey } = await generateKeyPair('RS256');
  const publicJwk = await exportJWK(publicKey);
  publicJwk.kid = kid;
  return { keys: [publicJwk], privateKey, kid };
}

const mockLogger = mockServices.logger.mock();

class MockJwksClient implements KeyStoreClient {
  #keyStore: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;
  #keyStoreUpdated: number = 0;

  constructor(
    keyStore: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>,
  ) {
    this.#keyStore = keyStore;
  }

  get getKey() {
    return this.#keyStore;
  }

  async refreshKeyStore(_: string): Promise<void> {
    this.#keyStoreUpdated += 1;
  }
}

// issueIdToken issues a valid oidc id token signed by privateKey.
async function issueIdToken(
  kid: string,
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
    .setProtectedHeader({ alg: 'RS256', kid: kid })
    .sign(privateKey);
}

beforeEach(() => {
  jest.clearAllMocks();
});

// Type guard to check if the value is a KeyLike
function isKeyLike(key: KeyLike | Uint8Array): key is KeyLike {
  return (key as KeyLike).type !== undefined;
}

describe('helpers', () => {
  let privateKey: KeyLike;
  let kid: string;
  let jwksClient: MockJwksClient;

  beforeAll(async () => {
    const jwksData = await createJwks();
    kid = jwksData.kid;
    privateKey = jwksData.privateKey;

    const keyMap: Record<string, KeyLike> = {};
    jwksData.keys.map(async (jwk: JWK) => {
      try {
        const key = await importJWK(jwk);
        if (jwk.kid && isKeyLike(key)) {
          keyMap[jwk.kid] = key;
        }
        return key;
      } catch (error) {
        throw new Error(`could not import jwk: ${error}`);
      }
    });

    jwksClient = new MockJwksClient(async header => {
      const { kid: keyID } = header;
      if (!keyID) {
        throw new Error(
          `JWS header ${JSON.stringify(header)} does not contain a kid`,
        );
      }
      const key = keyMap[keyID];
      if (!key) {
        throw new Error(`Key with kid ${keyID} not found`);
      }
      return key;
    });
  });

  describe('createTokenValidator', () => {
    it('runs the happy path', async () => {
      const validator = createTokenValidator(
        mockLogger,
        issuerURL,
        projectAudience,
        jwksClient,
      );
      const idToken = await issueIdToken(kid, privateKey);
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
        jwksClient,
      );
      // Issue a token signed by another jwks.
      const jwksData = await createJwks();
      const otherIdToken = await issueIdToken(kid, jwksData.privateKey);
      await expect(validator(otherIdToken)).rejects.toThrow(
        'JWSSignatureVerificationFailed: signature verification failed',
      );
    });

    it('rejects invalid token', async () => {
      const validator = createTokenValidator(
        mockLogger,
        issuerURL,
        projectAudience,
        jwksClient,
      );

      await expect(validator('{}')).rejects.toThrow(
        'JWSInvalid: Invalid Compact JWS',
      );
    });

    it('rejects missing iss', async () => {
      const validator = createTokenValidator(
        mockLogger,
        issuerURL,
        projectAudience,
        jwksClient,
      );
      const idToken = await issueIdToken(kid, privateKey, payload => {
        delete payload.iss;
        return payload;
      });

      await expect(validator(idToken)).rejects.toThrow(
        'JWTClaimValidationFailed: missing required "iss" claim',
      );
    });

    it('rejects missing sub', async () => {
      const validator = createTokenValidator(
        mockLogger,
        issuerURL,
        projectAudience,
        jwksClient,
      );
      const idToken = await issueIdToken(kid, privateKey, payload => {
        delete payload.sub;
        return payload;
      });

      await expect(validator(idToken)).rejects.toThrow(
        'JWTClaimValidationFailed: missing required "sub" claim',
      );
    });

    it('rejects missing email', async () => {
      const validator = createTokenValidator(
        mockLogger,
        issuerURL,
        projectAudience,
        jwksClient,
      );
      const idToken = await issueIdToken(kid, privateKey, payload => {
        delete payload.email;
        return payload;
      });

      await expect(validator(idToken)).rejects.toThrow(
        'JWTClaimValidationFailed: missing required "email" claim',
      );
    });

    it('rejects missing aud', async () => {
      const validator = createTokenValidator(
        mockLogger,
        issuerURL,
        projectAudience,
        jwksClient,
      );
      const idToken = await issueIdToken(kid, privateKey, payload => {
        delete payload.aud;
        return payload;
      });

      await expect(validator(idToken)).rejects.toThrow(
        'JWTClaimValidationFailed: missing required "aud" claim',
      );
    });

    it('rejects invalid iss', async () => {
      const validator = createTokenValidator(
        mockLogger,
        issuerURL,
        projectAudience,
        jwksClient,
      );
      const idToken = await issueIdToken(kid, privateKey, payload => {
        payload.iss = 'https://other.example.com';
        return payload;
      });

      await expect(validator(idToken)).rejects.toThrow(
        'JWTClaimValidationFailed: unexpected "iss" claim value',
      );
    });

    it('rejects invalid aud', async () => {
      const validator = createTokenValidator(
        mockLogger,
        issuerURL,
        projectAudience,
        jwksClient,
      );
      const idToken = await issueIdToken(kid, privateKey, payload => {
        payload.aud = ['some-other-service'];
        return payload;
      });

      await expect(validator(idToken)).rejects.toThrow(
        'JWTClaimValidationFailed: unexpected "aud" claim value',
      );
    });

    it('rejects expired token', async () => {
      const validator = createTokenValidator(
        mockLogger,
        issuerURL,
        projectAudience,
        jwksClient,
      );
      const idToken = await issueIdToken(kid, privateKey, payload => {
        payload.exp = 1581033600;
        return payload;
      });

      await expect(validator(idToken)).rejects.toThrow(
        'JWTExpired: "exp" claim timestamp check failed',
      );
    });
  });
});
