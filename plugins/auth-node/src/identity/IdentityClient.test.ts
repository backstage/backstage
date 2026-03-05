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

import { registerMswTestHooks } from '@backstage/backend-test-utils';
import {
  decodeProtectedHeader,
  exportJWK,
  generateKeyPair,
  SignJWT,
} from 'jose';
import { cloneDeep } from 'lodash';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { v4 as uuid } from 'uuid';

import { IdentityClient } from './IdentityClient';
import { DiscoveryService } from '@backstage/backend-plugin-api';

interface AnyJWK extends Record<string, string> {
  use: 'sig';
  alg: string;
  kid: string;
  kty: string;
}

// Simplified copy of TokenFactory in @backstage/plugin-auth-backend
class FakeTokenFactory {
  private readonly keys = new Array<AnyJWK>();

  constructor(
    private readonly options: {
      issuer: string;
      keyDurationSeconds: number;
    },
  ) {}

  async issueToken(params: {
    claims: {
      sub: string;
      ent?: string[];
    };
  }): Promise<string> {
    const pair = await generateKeyPair('ES256');
    const publicKey = await exportJWK(pair.publicKey);
    const kid = uuid();
    publicKey.kid = kid;
    this.keys.push(publicKey as AnyJWK);

    const iss = this.options.issuer;
    const sub = params.claims.sub;
    const ent = params.claims.ent;
    const aud = 'backstage';
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + this.options.keyDurationSeconds;

    return new SignJWT({ iss, sub, aud, iat, exp, ent, kid })
      .setProtectedHeader({ alg: 'ES256', ent: ent, kid: kid })
      .setIssuer(iss)
      .setAudience(aud)
      .setSubject(sub)
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .sign(pair.privateKey);
  }

  async listPublicKeys(): Promise<{ keys: AnyJWK[] }> {
    return { keys: this.keys };
  }
}

function jwtKid(jwt: string): string {
  const header = decodeProtectedHeader(jwt);
  return header.kid ?? '';
}

const server = setupServer();
const mockBaseUrl = 'http://backstage:9191/i-am-a-mock-base';
const discovery: DiscoveryService = {
  async getBaseUrl() {
    return mockBaseUrl;
  },
  async getExternalBaseUrl() {
    return mockBaseUrl;
  },
};

describe('IdentityClient', () => {
  let client: IdentityClient;
  let factory: FakeTokenFactory;
  const keyDurationSeconds = 5;

  registerMswTestHooks(server);

  beforeEach(() => {
    client = IdentityClient.create({ discovery, issuer: mockBaseUrl });
    factory = new FakeTokenFactory({
      issuer: mockBaseUrl,
      keyDurationSeconds,
    });
  });

  describe('identity client configuration', () => {
    beforeEach(() => {
      server.use(
        rest.get(
          `${mockBaseUrl}/.well-known/jwks.json`,
          async (_, res, ctx) => {
            const keys = await factory.listPublicKeys();
            return res(ctx.json(keys));
          },
        ),
      );
    });

    it('should defaults to ES256 when no algorithm is supplied', async () => {
      const identityClient = IdentityClient.create({
        discovery,
        issuer: mockBaseUrl,
      });

      const token = await factory.issueToken({ claims: { sub: 'foo' } });
      const response = await identityClient.authenticate(token);

      // expect that the authenticate is able to validate a token with ES256, which is the one set to FakeTokenFactory.
      // This means that IdentityClient set ES256 by default.
      expect(response).toEqual({
        token: token,
        identity: {
          type: 'user',
          userEntityRef: 'foo',
          ownershipEntityRefs: [],
        },
      });
    });

    it('should throw error on empty algorithms array', async () => {
      const identityClient = IdentityClient.create({
        discovery,
        issuer: mockBaseUrl,
        algorithms: [''],
      });

      const token = await factory.issueToken({ claims: { sub: 'foo' } });
      return expect(
        async () => await identityClient.authenticate(token),
      ).rejects.toThrow();
    });

    it('should throw error on empty algorithm string', async () => {
      const identityClient = IdentityClient.create({
        discovery,
        issuer: mockBaseUrl,
        algorithms: [],
      });

      const token = await factory.issueToken({ claims: { sub: 'foo' } });
      return expect(
        async () => await identityClient.authenticate(token),
      ).rejects.toThrow();
    });
  });

  describe('authenticate', () => {
    beforeEach(() => {
      server.use(
        rest.get(
          `${mockBaseUrl}/.well-known/jwks.json`,
          async (_, res, ctx) => {
            const keys = await factory.listPublicKeys();
            return res(ctx.json(keys));
          },
        ),
      );
    });

    it('should throw on undefined header', async () => {
      return expect(async () => {
        await client.authenticate(undefined);
      }).rejects.toThrow();
    });

    it('should accept fresh token', async () => {
      const token = await factory.issueToken({ claims: { sub: 'foo' } });
      const response = await client.authenticate(token);
      expect(response).toEqual({
        token: token,
        identity: {
          type: 'user',
          userEntityRef: 'foo',
          ownershipEntityRefs: [],
        },
      });
    });

    it('should decode claims correctly', async () => {
      const token = await factory.issueToken({
        claims: { sub: 'foo', ent: ['entity1', 'entity2'] },
      });
      const response = await client.authenticate(token);
      expect(response).toEqual({
        token: token,
        identity: {
          type: 'user',
          userEntityRef: 'foo',
          ownershipEntityRefs: ['entity1', 'entity2'],
        },
      });
    });

    it('should throw on incorrect issuer', async () => {
      const hackerFactory = new FakeTokenFactory({
        issuer: 'hacker',
        keyDurationSeconds,
      });
      return expect(async () => {
        const token = await hackerFactory.issueToken({
          claims: { sub: 'foo' },
        });
        await client.authenticate(token);
      }).rejects.toThrow();
    });

    it('should throw on expired token', async () => {
      return expect(async () => {
        const fixedTime = Date.now();
        jest
          .spyOn(Date, 'now')
          .mockImplementation(() => fixedTime - keyDurationSeconds * 1000 * 2);
        const token = await factory.issueToken({
          claims: { sub: 'foo' },
        });
        jest.spyOn(Date, 'now').mockImplementation(() => fixedTime);
        await client.authenticate(token);
      }).rejects.toThrow();
    });

    it('should throw on incorrect signing key', async () => {
      const hackerFactory = new FakeTokenFactory({
        issuer: mockBaseUrl,
        keyDurationSeconds,
      });
      return expect(async () => {
        const token = await hackerFactory.issueToken({
          claims: { sub: 'foo' },
        });
        await client.authenticate(token);
      }).rejects.toThrow();
    });

    it('should accept token from new key', async () => {
      const fixedTime = Date.now();
      jest
        .spyOn(Date, 'now')
        .mockImplementation(() => fixedTime - keyDurationSeconds * 1000 * 2);
      const token1 = await factory.issueToken({ claims: { sub: 'foo1' } });
      try {
        // This throws as token has already expired
        await client.authenticate(token1);
      } catch (_err) {
        // Ignore thrown error
      }
      // Move forward in time where the signing key has been rotated and the
      // cooldown period to look up a new public key has elapsed.
      jest
        .spyOn(Date, 'now')
        .mockImplementation(
          () => fixedTime + 30 * keyDurationSeconds * 1000 + 2,
        );
      const token = await factory.issueToken({ claims: { sub: 'foo' } });
      const response = await client.authenticate(token);
      expect(response).toEqual({
        token: token,
        identity: {
          type: 'user',
          userEntityRef: 'foo',
          ownershipEntityRefs: [],
        },
      });
    });

    it('should not be fooled by the none algorithm', async () => {
      return expect(async () => {
        const token = await factory.issueToken({ claims: { sub: 'foo' } });
        const header = btoa(
          JSON.stringify({ alg: 'none', kid: jwtKid(token) }),
        );
        const payload = btoa(
          JSON.stringify({
            iss: mockBaseUrl,
            sub: 'foo',
            aud: 'backstage',
            iat: Date.now() / 1000,
            exp: Date.now() / 1000 + 60000,
          }),
        );
        const fakeToken = `${header}.${payload}.`;
        return await client.authenticate(fakeToken);
      }).rejects.toThrow();
    });

    it('should use an updated endpoint when the key is not found', async () => {
      const updatedURL = 'http://backstage:9191/an-updated-base';
      const getBaseUrl = discovery.getBaseUrl;
      const getExternalBaseUrl = discovery.getExternalBaseUrl;
      // Generate a key and sign a token with it
      await factory.issueToken({ claims: { sub: 'foo' } });
      // Only return the key from a single token
      const singleKey = cloneDeep(await factory.listPublicKeys());
      server.use(
        rest.get(
          `${mockBaseUrl}/.well-known/jwks.json`,
          async (_, res, ctx) => {
            return res(ctx.json(singleKey));
          },
        ),
      );
      // Update the discovery endpoint to point to a new URL
      discovery.getBaseUrl = async () => {
        return updatedURL;
      };
      discovery.getExternalBaseUrl = async () => {
        return updatedURL;
      };
      let calledUpdatedEndpoint = false;
      server.use(
        rest.get(`${updatedURL}/.well-known/jwks.json`, async (_, res, ctx) => {
          const keys = await factory.listPublicKeys();
          calledUpdatedEndpoint = true;
          return res(ctx.json(keys));
        }),
      );
      // Advance time
      const future_11s = Date.now() + 11 * 1000;
      const dateSpy = jest
        .spyOn(Date, 'now')
        .mockImplementation(() => future_11s);
      // Issue a new token
      const token = await factory.issueToken({ claims: { sub: 'foo2' } });
      const response = await client.authenticate(token);
      // Verify that the endpoint was updated.
      expect(calledUpdatedEndpoint).toBeTruthy();
      expect(response).toEqual({
        token: token,
        identity: {
          type: 'user',
          userEntityRef: 'foo2',
          ownershipEntityRefs: [],
        },
      });
      // Restore the discovery endpoint and time
      discovery.getBaseUrl = getBaseUrl;
      discovery.getExternalBaseUrl = getExternalBaseUrl;
      dateSpy.mockClear();
    });
  });
});
