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

import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { SignJWT, exportJWK, generateKeyPair } from 'jose';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { randomUUID as uuid } from 'node:crypto';
import { jwksTokenHandler } from './jwks';

// Simplified copy of TokenFactory in @backstage/plugin-auth-backend
interface AnyJWK extends Record<string, string> {
  use: 'sig';
  alg: string;
  kid: string;
  kty: string;
}
class FakeTokenFactory {
  private readonly keys = new Array<AnyJWK>();
  private readonly options: {
    issuer: string;
    keyDurationSeconds: number;
  };

  constructor(options: { issuer: string; keyDurationSeconds: number }) {
    this.options = options;
  }

  async issueToken(params: {
    claims: {
      sub: string;
      ent?: string[];
      [claim: string]: unknown;
    };
  }): Promise<string> {
    const pair = await generateKeyPair('RS256');
    const publicKey = await exportJWK(pair.publicKey);
    const kid = uuid();
    publicKey.kid = kid;
    this.keys.push(publicKey as AnyJWK);

    const iss = this.options.issuer;
    const { sub, ...extraClaims } = params.claims;
    const aud = 'backstage';
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + this.options.keyDurationSeconds;

    return new SignJWT({ ...extraClaims, iss, sub, aud, iat, exp, kid })
      .setProtectedHeader({ alg: 'RS256', kid })
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

  registerMswTestHooks(server);

  beforeEach(() => {
    mockSubject = 'test_subject';

    factory = new FakeTokenFactory({
      issuer: mockBaseUrl,
      keyDurationSeconds,
    });

    server.use(
      http.get(`${mockBaseUrl}/.well-known/jwks.json`, async () => {
        const keys = await factory.listPublicKeys();
        return HttpResponse.json(keys);
      }),
    );
  });

  it('verifies token with valid entry', async () => {
    const validEntry = {
      url: `${mockBaseUrl}/.well-known/jwks.json`,
      algorithm: 'RS256',
      issuer: mockBaseUrl,
      audience: 'backstage',
    };
    const context = jwksTokenHandler.initialize({
      options: new ConfigReader(validEntry),
    });

    const token = await factory.issueToken({
      claims: { sub: mockSubject },
    });

    const result = await jwksTokenHandler.verifyToken(token, context);

    expect(result).toEqual({ subject: `external:${mockSubject}` });
  });

  it('rejects bad config', () => {
    expect(() => {
      return jwksTokenHandler.initialize({
        options: new ConfigReader({
          url: 'https://exampl e.com/jwks',
        }),
      });
    }).toThrow('Illegal JWKS URL, must be a set of non-space characters');
    expect(() => {
      return jwksTokenHandler.initialize({
        options: new ConfigReader({
          url: 'https://example.com/jwks\n',
        }),
      });
    }).toThrow('Illegal JWKS URL, must be a set of non-space characters');
  });

  it('gracefully handles no added tokens', async () => {
    await expect(
      jwksTokenHandler.verifyToken('ghi', {} as any),
    ).resolves.toBeUndefined();
  });

  it('uses custom subject prefix if provided', async () => {
    const validEntry = {
      options: {
        url: `${mockBaseUrl}/.well-known/jwks.json`,
        algorithm: 'RS256',
        issuer: mockBaseUrl,
        audience: 'backstage',
        subjectPrefix: 'custom-prefix',
      },
    };
    const context = jwksTokenHandler.initialize({
      options: new ConfigReader(validEntry.options),
    });

    const token = await factory.issueToken({
      claims: { sub: mockSubject },
    });

    const result = await jwksTokenHandler.verifyToken(token, context);

    expect(result).toEqual({
      subject: `external:${validEntry.options.subjectPrefix}:${mockSubject}`,
    });
  });

  it('accepts a token whose claims match the required values', async () => {
    const context = jwksTokenHandler.initialize({
      options: new ConfigReader({
        url: `${mockBaseUrl}/.well-known/jwks.json`,
        algorithm: 'RS256',
        issuer: mockBaseUrl,
        audience: 'backstage',
        claims: {
          // single exact value
          department: 'platform',
          // one-of a configured list
          tier: ['gold', 'silver'],
          // matched against one entry of a claim that is an array
          groups: 'admins',
          // matched against one token of a space-delimited claim
          scope: 'catalog:read',
        },
      }),
    });

    const token = await factory.issueToken({
      claims: {
        sub: mockSubject,
        department: 'platform',
        tier: 'silver',
        groups: ['viewers', 'admins'],
        scope: 'catalog:read catalog:write',
      },
    });

    const result = await jwksTokenHandler.verifyToken(token, context);

    expect(result).toEqual({ subject: `external:${mockSubject}` });
  });

  it('matches numeric and boolean claim values by their string form', async () => {
    const context = jwksTokenHandler.initialize({
      options: new ConfigReader({
        url: `${mockBaseUrl}/.well-known/jwks.json`,
        algorithm: 'RS256',
        issuer: mockBaseUrl,
        audience: 'backstage',
        claims: { ver: 2, verified: true },
      }),
    });

    const token = await factory.issueToken({
      claims: { sub: mockSubject, ver: 2, verified: true },
    });

    const result = await jwksTokenHandler.verifyToken(token, context);

    expect(result).toEqual({ subject: `external:${mockSubject}` });
  });

  it('treats a single string allowed value as one exact value, not comma/space-split', async () => {
    const context = jwksTokenHandler.initialize({
      options: new ConfigReader({
        url: `${mockBaseUrl}/.well-known/jwks.json`,
        algorithm: 'RS256',
        issuer: mockBaseUrl,
        audience: 'backstage',
        claims: { department: 'platform, other-department' },
      }),
    });

    // Unlike `issuer`/`audience`/`algorithm`, a single `claims` string value is
    // not split on comma/space - use an array for multiple allowed values.
    const exactMatch = await factory.issueToken({
      claims: { sub: mockSubject, department: 'platform, other-department' },
    });
    await expect(
      jwksTokenHandler.verifyToken(exactMatch, context),
    ).resolves.toEqual({ subject: `external:${mockSubject}` });

    const partialMatch = await factory.issueToken({
      claims: { sub: mockSubject, department: 'platform' },
    });
    await expect(
      jwksTokenHandler.verifyToken(partialMatch, context),
    ).resolves.toBeUndefined();
  });

  it('rejects a token when a required claim does not match', async () => {
    const context = jwksTokenHandler.initialize({
      options: new ConfigReader({
        url: `${mockBaseUrl}/.well-known/jwks.json`,
        algorithm: 'RS256',
        issuer: mockBaseUrl,
        audience: 'backstage',
        claims: {
          department: 'platform',
          tier: ['gold', 'silver'],
        },
      }),
    });

    // `tier` is not one of the allowed values, even though `department` matches
    const token = await factory.issueToken({
      claims: { sub: mockSubject, department: 'platform', tier: 'bronze' },
    });

    const result = await jwksTokenHandler.verifyToken(token, context);

    expect(result).toBeUndefined();
  });

  it('rejects an invalid claims config value', () => {
    expect(() => {
      jwksTokenHandler.initialize({
        options: new ConfigReader({
          url: `${mockBaseUrl}/.well-known/jwks.json`,
          claims: { department: {} },
        }),
      });
    }).toThrow(
      "Invalid value for 'claims.department' in JWKS external access config, expected a non-empty string, number, boolean, or array of those",
    );
  });

  it('rejects a token that is missing a required claim entirely', async () => {
    const context = jwksTokenHandler.initialize({
      options: new ConfigReader({
        url: `${mockBaseUrl}/.well-known/jwks.json`,
        algorithm: 'RS256',
        issuer: mockBaseUrl,
        audience: 'backstage',
        claims: { department: 'platform' },
      }),
    });

    const token = await factory.issueToken({
      claims: { sub: mockSubject },
    });

    const result = await jwksTokenHandler.verifyToken(token, context);

    expect(result).toBeUndefined();
  });

  it('supports claim names containing dots and slashes', async () => {
    // Regression test: claim names are commonly namespaced with dots and
    // slashes, which are not valid `Config` key path segments. Reading them via
    // `Config.get(claimName)` would throw `Invalid config key`, so both config
    // parsing and matching must treat claim names as opaque strings.
    const context = jwksTokenHandler.initialize({
      options: new ConfigReader({
        url: `${mockBaseUrl}/.well-known/jwks.json`,
        algorithm: 'RS256',
        issuer: mockBaseUrl,
        audience: 'backstage',
        claims: {
          'example.com/access_policy': 'allow',
          'https://example.com/roles': ['operator', 'auditor'],
        },
      }),
    });

    const token = await factory.issueToken({
      claims: {
        sub: mockSubject,
        'example.com/access_policy': 'allow',
        'https://example.com/roles': ['auditor'],
      },
    });

    const result = await jwksTokenHandler.verifyToken(token, context);

    expect(result).toEqual({ subject: `external:${mockSubject}` });
  });

  it('applies claim checks alongside issuer and audience verification', async () => {
    const context = jwksTokenHandler.initialize({
      options: new ConfigReader({
        url: `${mockBaseUrl}/.well-known/jwks.json`,
        algorithm: 'RS256',
        issuer: mockBaseUrl,
        audience: 'backstage',
        subjectPrefix: 'custom-prefix',
        claims: { sub: mockSubject },
      }),
    });

    const matching = await factory.issueToken({
      claims: { sub: mockSubject },
    });
    await expect(
      jwksTokenHandler.verifyToken(matching, context),
    ).resolves.toEqual({
      subject: `external:custom-prefix:${mockSubject}`,
    });

    // Same valid issuer/audience, but a `sub` that is not in the allowed set.
    const wrongSubject = await factory.issueToken({
      claims: { sub: 'someone_else' },
    });
    await expect(
      jwksTokenHandler.verifyToken(wrongSubject, context),
    ).resolves.toBeUndefined();
  });
});
