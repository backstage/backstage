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

import { BackstagePrincipalAccessRestrictions } from '@backstage/backend-plugin-api';
import { ExternalTokenHandler } from './ExternalTokenHandler';
import { TokenHandler } from './types';
import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { randomBytes } from 'crypto';
import { SignJWT, exportJWK, generateKeyPair } from 'jose';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Simplified copy of TokenFactory in @backstage/plugin-auth-backend
interface AnyJWK extends Record<string, string> {
  use: 'sig';
  alg: string;
  kid: string;
  kty: string;
}
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

describe('ExternalTokenHandler', () => {
  const server = setupServer();
  registerMswTestHooks(server);

  it('skips over inner handlers that do not match, and applies plugin restrictions', async () => {
    const handler1: TokenHandler = {
      add: jest.fn(),
      verifyToken: jest.fn().mockResolvedValue(undefined),
    };

    const handler2: TokenHandler = {
      add: jest.fn(),
      verifyToken: jest.fn().mockResolvedValue({
        subject: 'sub',
        allAccessRestrictions: new Map(
          Object.entries({
            plugin1: {
              permissionNames: ['do.it'],
            } satisfies BackstagePrincipalAccessRestrictions,
          }),
        ),
      }),
    };

    const plugin1 = new ExternalTokenHandler('plugin1', [handler1, handler2]);
    const plugin2 = new ExternalTokenHandler('plugin2', [handler1, handler2]);

    await expect(plugin1.verifyToken('token')).resolves.toEqual({
      subject: 'sub',
      accessRestrictions: { permissionNames: ['do.it'] },
    });
    await expect(
      plugin2.verifyToken('token'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"This token's access is restricted to plugin(s) 'plugin1'"`,
    );
  });

  it('successfully parses known methods', async () => {
    const legacyKey = randomBytes(24);

    const factory = new FakeTokenFactory({
      issuer: 'blah',
      keyDurationSeconds: 100,
    });

    server.use(
      rest.get(
        'https://example.com/.well-known/jwks.json',
        async (_, res, ctx) => {
          const keys = await factory.listPublicKeys();
          return res(ctx.json(keys));
        },
      ),
    );

    const handler = ExternalTokenHandler.create({
      ownPluginId: 'catalog',
      logger: mockServices.logger.mock(),
      config: mockServices.rootConfig({
        data: {
          backend: {
            auth: {
              externalAccess: [
                {
                  type: 'legacy',
                  options: {
                    secret: legacyKey.toString('base64'),
                    subject: 'legacy-subject',
                  },
                  accessRestrictions: [
                    { plugin: 'catalog', permission: 'catalog.entity.read' },
                  ],
                },
                {
                  type: 'static',
                  options: {
                    token: 'defdefdef',
                    subject: 'static-subject',
                  },
                  accessRestrictions: [
                    { plugin: 'catalog', permission: 'catalog.entity.read' },
                  ],
                },
                {
                  type: 'jwks',
                  options: {
                    url: 'https://example.com/.well-known/jwks.json',
                    algorithm: 'RS256',
                    issuer: 'blah',
                    audience: 'backstage',
                    subjectPrefix: 'custom-prefix',
                  },
                  accessRestrictions: [
                    { plugin: 'catalog', permission: 'catalog.entity.read' },
                  ],
                },
              ],
            },
          },
        },
      }),
    });

    const legacyToken = await new SignJWT({
      sub: 'backstage-server',
      exp: DateTime.now().plus({ minutes: 1 }).toUnixInteger(),
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(legacyKey);

    await expect(handler.verifyToken(legacyToken)).resolves.toEqual({
      subject: 'legacy-subject',
      accessRestrictions: { permissionNames: ['catalog.entity.read'] },
    });

    await expect(handler.verifyToken('defdefdef')).resolves.toEqual({
      subject: 'static-subject',
      accessRestrictions: { permissionNames: ['catalog.entity.read'] },
    });

    const jwksToken = await factory.issueToken({
      claims: { sub: 'jwks-subject' },
    });
    await expect(handler.verifyToken(jwksToken)).resolves.toEqual({
      subject: 'external:custom-prefix:jwks-subject',
      accessRestrictions: { permissionNames: ['catalog.entity.read'] },
    });
  });
});
