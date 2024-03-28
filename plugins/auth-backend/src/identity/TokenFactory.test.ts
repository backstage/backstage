/*
 * Copyright 2020 The Backstage Authors
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
import { getVoidLogger } from '@backstage/backend-common';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { createLocalJWKSet, decodeProtectedHeader, jwtVerify } from 'jose';

import { MemoryKeyStore } from './MemoryKeyStore';
import { TokenFactory } from './TokenFactory';

const logger = getVoidLogger();

function jwtKid(jwt: string): string {
  const header = decodeProtectedHeader(jwt);
  if (!header.kid) {
    throw new Error('JWT Header did not contain a key ID (kid)');
  }
  return header.kid;
}

const entityRef = stringifyEntityRef({
  kind: 'User',
  namespace: 'default',
  name: 'JackFrost',
});

describe('TokenFactory', () => {
  it('should issue valid tokens signed by a listed key', async () => {
    const keyDurationSeconds = 5;
    const factory = new TokenFactory({
      issuer: 'my-issuer',
      keyStore: new MemoryKeyStore(),
      keyDurationSeconds,
      logger,
    });

    await expect(factory.listPublicKeys()).resolves.toEqual({ keys: [] });
    const token = await factory.issueToken({
      claims: {
        sub: entityRef,
        ent: [entityRef],
        'x-fancy-claim': 'my special claim',
        aud: 'this value will be overridden',
      },
    });

    const { keys } = await factory.listPublicKeys();
    const keyStore = createLocalJWKSet({ keys: keys });

    const verifyResult = await jwtVerify(token, keyStore);
    expect(verifyResult.payload).toEqual({
      iss: 'my-issuer',
      aud: 'backstage',
      sub: entityRef,
      ent: [entityRef],
      'x-fancy-claim': 'my special claim',
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
    expect(verifyResult.payload.exp).toBe(
      verifyResult.payload.iat! + keyDurationSeconds,
    );
  });

  it('should generate new signing keys when the current one expires', async () => {
    const fixedTime = Date.now();
    jest.spyOn(Date, 'now').mockImplementation(() => fixedTime);

    const factory = new TokenFactory({
      issuer: 'my-issuer',
      keyStore: new MemoryKeyStore(),
      keyDurationSeconds: 5,
      logger,
    });

    const token1 = await factory.issueToken({
      claims: { sub: entityRef },
    });
    const token2 = await factory.issueToken({
      claims: { sub: entityRef },
    });
    expect(jwtKid(token1)).toBe(jwtKid(token2));

    await expect(factory.listPublicKeys()).resolves.toEqual({
      keys: [
        expect.objectContaining({
          kid: jwtKid(token1),
        }),
      ],
    });

    jest.spyOn(Date, 'now').mockImplementation(() => fixedTime + 60000);

    await expect(factory.listPublicKeys()).resolves.toEqual({
      keys: [],
    });

    const token3 = await factory.issueToken({
      claims: { sub: entityRef },
    });
    expect(jwtKid(token3)).not.toBe(jwtKid(token2));

    await expect(factory.listPublicKeys()).resolves.toEqual({
      keys: [
        expect.objectContaining({
          kid: jwtKid(token3),
        }),
      ],
    });
  });

  it('should throw an error with a non entityRef sub claim', async () => {
    const keyDurationSeconds = 5;
    const factory = new TokenFactory({
      issuer: 'my-issuer',
      keyStore: new MemoryKeyStore(),
      keyDurationSeconds,
      logger,
    });

    await expect(() => {
      return factory.issueToken({
        claims: { sub: 'UserId' },
      });
    }).rejects.toThrow();
  });

  it('should throw error on empty algorithm string', async () => {
    const keyDurationSeconds = 5;
    const factory = new TokenFactory({
      issuer: 'my-issuer',
      keyStore: new MemoryKeyStore(),
      keyDurationSeconds,
      logger,
      algorithm: '',
    });

    await expect(() => {
      return factory.issueToken({
        claims: { sub: 'UserId' },
      });
    }).rejects.toThrow();
  });

  it('should refuse to issue excessively large tokens', async () => {
    const factory = new TokenFactory({
      issuer: 'my-issuer',
      keyStore: new MemoryKeyStore(),
      keyDurationSeconds: 5,
      logger,
    });

    await expect(() => {
      return factory.issueToken({
        claims: { sub: 'user:ns/n', ent: Array(10000).fill('group:ns/n') },
      });
    }).rejects.toThrow(
      /^Failed to issue a new user token. The resulting token is excessively large, with either too many ownership claims or too large custom claims./,
    );
  });

  it('should defaults to ES256 when no algorithm string is supplied', async () => {
    const keyDurationSeconds = 5;
    const factory = new TokenFactory({
      issuer: 'my-issuer',
      keyStore: new MemoryKeyStore(),
      keyDurationSeconds,
      logger,
    });

    const token = await factory.issueToken({
      claims: { sub: entityRef, ent: [entityRef] },
    });

    const { keys } = await factory.listPublicKeys();
    const keyStore = createLocalJWKSet({ keys: keys });

    const verifyResult = await jwtVerify(token, keyStore);
    expect(verifyResult.protectedHeader.alg).toBe('ES256');
  });
});
