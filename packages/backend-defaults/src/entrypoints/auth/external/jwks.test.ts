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

  it('accepts and rejects tokens based on the claims filter predicate', async () => {
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
          tier: { $in: ['gold', 'silver'] },
          // matched against one entry of a claim that is an array
          groups: { $contains: 'admins' },
          // matched against one entry of the space-delimited `scope` claim
          scope: { $contains: 'catalog:read' },
          // nested claims are matched by dot-separated path
          'realm_access.roles': { $contains: 'operator' },
          // numbers and booleans are matched by value
          ver: 2,
          verified: true,
        },
      }),
    });

    const claims = {
      sub: mockSubject,
      department: 'platform',
      tier: 'silver',
      groups: ['viewers', 'admins'],
      scope: 'catalog:read catalog:write',
      realm_access: { roles: ['operator'] },
      ver: 2,
      verified: true,
    };

    // All claims must match, so a single mismatching or missing claim rejects
    const { department: _, ...withoutDepartment } = claims;
    const mismatches = [
      { ...claims, tier: 'bronze' },
      { ...claims, groups: ['viewers'] },
      { ...claims, scope: 'catalog:write' },
      { ...claims, realm_access: { roles: ['auditor'] } },
      { ...claims, ver: 3 },
      { ...claims, verified: false },
      withoutDepartment,
    ];

    // All tokens are issued before the first verification, since the JWKS is
    // only fetched once and would not contain keys created afterwards
    const matchingToken = await factory.issueToken({ claims });
    const mismatchingTokens = await Promise.all(
      mismatches.map(mismatch => factory.issueToken({ claims: mismatch })),
    );

    await expect(
      jwksTokenHandler.verifyToken(matchingToken, context),
    ).resolves.toEqual({ subject: `external:${mockSubject}` });
    for (const token of mismatchingTokens) {
      await expect(
        jwksTokenHandler.verifyToken(token, context),
      ).resolves.toBeUndefined();
    }
  });

  it('supports logical operators in the claims filter predicate', async () => {
    const context = jwksTokenHandler.initialize({
      options: new ConfigReader({
        url: `${mockBaseUrl}/.well-known/jwks.json`,
        algorithm: 'RS256',
        issuer: mockBaseUrl,
        audience: 'backstage',
        claims: {
          $any: [
            { department: 'platform' },
            { scope: { $contains: 'catalog:admin' } },
          ],
        },
      }),
    });

    const [departmentToken, scopeToken, otherToken] = await Promise.all([
      factory.issueToken({
        claims: { sub: mockSubject, department: 'platform' },
      }),
      factory.issueToken({
        claims: { sub: mockSubject, scope: 'catalog:read catalog:admin' },
      }),
      factory.issueToken({
        claims: { sub: mockSubject, department: 'sales', scope: 'other' },
      }),
    ]);

    await expect(
      jwksTokenHandler.verifyToken(departmentToken, context),
    ).resolves.toEqual({ subject: `external:${mockSubject}` });
    await expect(
      jwksTokenHandler.verifyToken(scopeToken, context),
    ).resolves.toEqual({ subject: `external:${mockSubject}` });
    await expect(
      jwksTokenHandler.verifyToken(otherToken, context),
    ).resolves.toBeUndefined();
  });

  it('only splits the `scope` claim on spaces, not other claims', async () => {
    const context = jwksTokenHandler.initialize({
      options: new ConfigReader({
        url: `${mockBaseUrl}/.well-known/jwks.json`,
        algorithm: 'RS256',
        issuer: mockBaseUrl,
        audience: 'backstage',
        claims: { name: { $contains: 'jane' } },
      }),
    });

    // A `name` of "jane doe" must not match "jane" just because "jane" is one
    // of its space-separated words.
    const token = await factory.issueToken({
      claims: { sub: mockSubject, name: 'jane doe' },
    });

    await expect(
      jwksTokenHandler.verifyToken(token, context),
    ).resolves.toBeUndefined();
  });

  it('rejects an invalid claims config value', () => {
    expect(() => {
      jwksTokenHandler.initialize({
        options: new ConfigReader({
          url: `${mockBaseUrl}/.well-known/jwks.json`,
          claims: { department: ['platform', 'sales'] },
        }),
      });
    }).toThrow(/Could not read filter predicate from config at 'claims':/);
  });

  it('supports claim names containing dots and slashes', async () => {
    // Claim names are commonly namespaced with dots and slashes, which must
    // still be matched as opaque keys.
    const context = jwksTokenHandler.initialize({
      options: new ConfigReader({
        url: `${mockBaseUrl}/.well-known/jwks.json`,
        algorithm: 'RS256',
        issuer: mockBaseUrl,
        audience: 'backstage',
        claims: {
          'example.com/access_policy': 'allow',
          'https://example.com/roles': { $contains: 'auditor' },
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
    // Same valid issuer/audience, but a `sub` that is not in the allowed set.
    const wrongSubject = await factory.issueToken({
      claims: { sub: 'someone_else' },
    });

    await expect(
      jwksTokenHandler.verifyToken(matching, context),
    ).resolves.toEqual({
      subject: `external:custom-prefix:${mockSubject}`,
    });
    await expect(
      jwksTokenHandler.verifyToken(wrongSubject, context),
    ).resolves.toBeUndefined();
  });
});
