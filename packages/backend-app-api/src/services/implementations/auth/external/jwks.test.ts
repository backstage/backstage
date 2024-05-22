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
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { SignJWT, exportJWK, generateKeyPair } from 'jose';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { v4 as uuid } from 'uuid';
import { JWKSHandler } from './jwks';

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
    const pair = await generateKeyPair('RS256');
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
      .setProtectedHeader({ alg: 'RS256', ent: ent, kid: kid })
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

const server = setupServer();
const mockBaseUrl = 'http://backstage:9191/i-am-a-mock-base';

describe('JWKSHandler', () => {
  let factory: FakeTokenFactory;
  let mockSubject: string;
  const keyDurationSeconds = 5;

  setupRequestMockHandlers(server);

  beforeEach(() => {
    mockSubject = 'test_subject';

    factory = new FakeTokenFactory({
      issuer: mockBaseUrl,
      keyDurationSeconds,
    });

    server.use(
      rest.get(`${mockBaseUrl}/.well-known/jwks.json`, async (_, res, ctx) => {
        const keys = await factory.listPublicKeys();
        return res(ctx.json(keys));
      }),
    );
  });

  it('verifies token with valid entry', async () => {
    const validEntry = {
      url: `${mockBaseUrl}/.well-known/jwks.json`,
      algorithms: ['RS256'],
      issuers: [mockBaseUrl],
      audiences: ['backstage'],
    };
    const jwksHandler = new JWKSHandler();

    jwksHandler.add(new ConfigReader(validEntry));

    const token = await factory.issueToken({
      claims: { sub: mockSubject },
    });

    const result = await jwksHandler.verifyToken(token);

    expect(result).toEqual({ subject: `external:${mockSubject}` });
  });

  it('skips invalid entry and continues verification', async () => {
    const invalidEntry = {
      url: `${mockBaseUrl}/.well-known/jwks.json`,
      algorithms: ['RS256'],
      issuers: ['fakeIssuer'],
      audiences: ['fakeAud'],
    };

    const validEntry = {
      url: `${mockBaseUrl}/.well-known/jwks.json`,
      algorithms: ['RS256'],
      issuers: ['multiple-issuers', mockBaseUrl],
      audiences: ['multiple-audiences', 'backstage'],
    };
    const jwksHandler = new JWKSHandler();

    jwksHandler.add(new ConfigReader(invalidEntry));
    jwksHandler.add(new ConfigReader(validEntry));

    const token = await factory.issueToken({
      claims: { sub: mockSubject },
    });

    const result = await jwksHandler.verifyToken(token);

    expect(result).toEqual({ subject: `external:${mockSubject}` });
  });

  it('returns undefined if no valid entry found', async () => {
    const invalidEntry1 = {
      url: `${mockBaseUrl}/.well-known/jwks.json`,
      algorithms: ['RS256'],
      issuers: [mockBaseUrl],
      audiences: [],
    };

    const invalidEntry2 = {
      url: `${mockBaseUrl}/.well-known/jwks.json`,
      algorithms: ['HS256'],
      issuers: [],
      audiences: ['backstage'],
    };
    const jwksHandler = new JWKSHandler();

    jwksHandler.add(new ConfigReader(invalidEntry1));
    jwksHandler.add(new ConfigReader(invalidEntry2));

    const token = await factory.issueToken({
      claims: { sub: mockSubject },
    });

    const result = await jwksHandler.verifyToken(token);

    expect(result).toBeUndefined();
  });

  it('rejects bad config', () => {
    const jwksHandler = new JWKSHandler();

    expect(() => {
      jwksHandler.add(
        new ConfigReader({
          url: 'https://exampl e.com/jwks',
        }),
      );
    }).toThrow('Invalid URL');
    expect(() => {
      jwksHandler.add(
        new ConfigReader({
          url: 'https://example.com/jwks\n',
        }),
      );
    }).toThrow('Illegal URL, must be a set of non-space characters');
  });

  it('gracefully handles no added tokens', async () => {
    const handler = new JWKSHandler();
    await expect(handler.verifyToken('ghi')).resolves.toBeUndefined();
  });

  it('uses custom subject prefix if provided', async () => {
    const validEntry = {
      url: `${mockBaseUrl}/.well-known/jwks.json`,
      algorithms: ['RS256'],
      issuers: [mockBaseUrl],
      audiences: ['backstage'],
      subjectPrefix: 'custom-prefix',
    };
    const jwksHandler = new JWKSHandler();

    jwksHandler.add(new ConfigReader(validEntry));

    const token = await factory.issueToken({
      claims: { sub: mockSubject },
    });

    const result = await jwksHandler.verifyToken(token);

    expect(result).toEqual({
      subject: `external:${validEntry.subjectPrefix}:${mockSubject}`,
    });
  });
});
