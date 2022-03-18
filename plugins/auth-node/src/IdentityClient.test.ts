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

import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { JSONWebKey, JWK, JWS, JWT } from 'jose';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { v4 as uuid } from 'uuid';
import { IdentityClient } from './IdentityClient';

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
    const key = await JWK.generate('EC', 'P-256', {
      use: 'sig',
      kid: uuid(),
      alg: 'ES256',
    });
    this.keys.push(key.toJWK(false) as unknown as AnyJWK);

    const iss = this.options.issuer;
    const sub = params.claims.sub;
    const ent = params.claims.ent;
    const aud = 'backstage';
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + this.options.keyDurationSeconds;

    return JWS.sign({ iss, sub, aud, iat, exp, ent }, key, {
      alg: key.alg,
      kid: key.kid,
    });
  }

  async listPublicKeys(): Promise<{ keys: AnyJWK[] }> {
    return { keys: this.keys };
  }
}

function jwtKid(jwt: string): string {
  const { header } = JWT.decode(jwt, { complete: true }) as {
    header: { kid: string };
  };
  return header.kid;
}

const server = setupServer();
const mockBaseUrl = 'http://backstage:9191/i-am-a-mock-base';
const discovery: PluginEndpointDiscovery = {
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

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  beforeEach(() => {
    client = IdentityClient.create({ discovery, issuer: mockBaseUrl });
    factory = new FakeTokenFactory({
      issuer: mockBaseUrl,
      keyDurationSeconds,
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

    it('should use the correct endpoint', async () => {
      await factory.issueToken({ claims: { sub: 'foo' } });
      const keys = await factory.listPublicKeys();
      const response = await (client as any).listPublicKeys();
      expect(response).toEqual(keys);
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
      // Move forward in time where the signing key has been rotated
      jest.spyOn(Date, 'now').mockImplementation(() => fixedTime);
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
  });

  describe('listPublicKeys', () => {
    const defaultServiceResponse: {
      keys: JSONWebKey[];
    } = {
      keys: [
        {
          crv: 'P-256',
          x: 'JWy80Goa-8C3oaeDLnk0ANVPPMfI9T3u_T5T7W2b_ls',
          y: 'Ge6jAhCDW1PFBfme2RA5ZsXN0cESiCwW29LMRPX5wkw',
          kty: 'EC',
          kid: 'kid-a',
          alg: 'ES256',
          use: 'sig',
        },
      ],
    };

    beforeEach(() => {
      server.use(
        rest.get(`${mockBaseUrl}/.well-known/jwks.json`, (_, res, ctx) => {
          return res(ctx.json(defaultServiceResponse));
        }),
      );
    });

    it('should use the correct endpoint', async () => {
      const response = await (client as any).listPublicKeys();
      expect(response).toEqual(defaultServiceResponse);
    });
  });
});
