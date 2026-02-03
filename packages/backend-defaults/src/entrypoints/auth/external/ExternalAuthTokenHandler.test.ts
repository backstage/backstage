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
import { ExternalAuthTokenHandler } from './ExternalAuthTokenHandler';
import { createExternalTokenHandler } from './helpers';
import { AccessRestrictionsMap, ExternalTokenHandler } from './types';
import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { randomBytes } from 'node:crypto';
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
    const handler1: ExternalTokenHandler<unknown> = createExternalTokenHandler({
      type: 'type1',
      initialize: jest.fn().mockResolvedValue(undefined),
      verifyToken: jest.fn().mockResolvedValue(undefined),
    });

    const handler2: ExternalTokenHandler<undefined> =
      createExternalTokenHandler({
        type: 'type2',
        initialize: jest.fn().mockResolvedValue(undefined),
        verifyToken: jest.fn().mockResolvedValue({
          subject: 'sub',
        }),
      });

    const accessRestrictions: AccessRestrictionsMap = new Map(
      Object.entries({
        plugin1: {
          permissionNames: ['do.it'],
        } satisfies BackstagePrincipalAccessRestrictions,
      }),
    );

    const plugin1 = new ExternalAuthTokenHandler('plugin1', [
      {
        context: undefined,
        handler: handler1,
      },
      {
        context: undefined,
        handler: handler2,
        allAccessRestrictions: accessRestrictions,
      },
    ]);
    const plugin2 = new ExternalAuthTokenHandler('plugin2', [
      {
        context: undefined,
        handler: handler1,
      },
      {
        context: undefined,
        handler: handler2,
        allAccessRestrictions: accessRestrictions,
      },
    ]);

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

    const handler = ExternalAuthTokenHandler.create({
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
  it('successfully uses legacy configs', async () => {
    const legacyKey = randomBytes(24);
    const factory = new FakeTokenFactory({
      issuer: 'my-company',
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

    const logger = mockServices.logger.mock();
    const handler = ExternalAuthTokenHandler.create({
      ownPluginId: 'catalog',
      logger,
      config: mockServices.rootConfig({
        data: {
          backend: {
            auth: {
              keys: [
                {
                  secret: legacyKey.toString('base64'),
                },
              ],
            },
          },
        },
      }),
    });

    expect(logger.warn).toHaveBeenCalledWith(
      `DEPRECATION WARNING: The backend.auth.keys config has been replaced by backend.auth.externalAccess, see https://backstage.io/docs/auth/service-to-service-auth`,
    );

    const legacyToken = await new SignJWT({
      sub: 'backstage-server',
      exp: DateTime.now().plus({ minutes: 1 }).toUnixInteger(),
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(legacyKey);

    await expect(handler.verifyToken(legacyToken)).resolves.toEqual({
      subject: 'external:backstage-plugin',
    });
  });
  it('successfully uses custom token handlers', async () => {
    const factory = new FakeTokenFactory({
      issuer: 'my-company',
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

    const verifyMock = jest.fn().mockResolvedValue({});
    const initializeMock = jest.fn().mockReturnValue({ context: 'a' });

    const handler = ExternalAuthTokenHandler.create({
      ownPluginId: 'catalog',
      logger: mockServices.logger.mock(),
      config: mockServices.rootConfig({
        data: {
          backend: {
            auth: {
              externalAccess: [
                {
                  type: 'internal-custom',
                  options: {
                    issuer: 'my-company',
                    subject: 'internal-subject',
                    audience: 'backstage',
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
      externalTokenHandlers: [
        createExternalTokenHandler({
          type: 'internal-custom',
          initialize: initializeMock,
          verifyToken: verifyMock,
        }),
      ],
    });

    expect(initializeMock).toHaveBeenCalledWith({
      options: expect.objectContaining({
        data: {
          issuer: 'my-company',
          subject: 'internal-subject',
          audience: 'backstage',
        },
      }),
    });

    const customToken = await factory.issueToken({
      claims: { sub: 'internal-subject' },
    });

    await handler.verifyToken(customToken);

    expect(verifyMock).toHaveBeenCalledWith(customToken, { context: 'a' });
  });
  it('should fail if custom handler has same type as builtin handlers', async () => {
    const logger = mockServices.logger.mock();
    const customStaticHandler: ExternalTokenHandler<unknown> =
      createExternalTokenHandler({
        type: 'static',
        initialize: jest.fn().mockResolvedValue(undefined),
        verifyToken: jest.fn().mockResolvedValue({
          subject: 'custom-static-subject',
        }),
      });

    const createHandler = () =>
      ExternalAuthTokenHandler.create({
        ownPluginId: 'catalog',
        logger,
        config: mockServices.rootConfig({
          data: {
            backend: {
              auth: {
                externalAccess: [
                  {
                    type: 'static',
                    options: {
                      token: 'mytoken',
                      subject: 'static-subject',
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
        externalTokenHandlers: [customStaticHandler],
      });

    expect(createHandler).toThrowErrorMatchingInlineSnapshot(
      `"Duplicate external token handler type 'static', each handler must have a unique type"`,
    );
  });
  it('should fail if 2 custom handlers have the same type', async () => {
    const createHandler = () =>
      ExternalAuthTokenHandler.create({
        ownPluginId: 'catalog',
        logger: mockServices.logger.mock(),
        config: mockServices.rootConfig(),
        externalTokenHandlers: [
          createExternalTokenHandler({
            type: 'internal-custom',
            initialize: jest.fn().mockResolvedValue(undefined),
            verifyToken: jest.fn().mockResolvedValue({
              subject: 'sub',
            }),
          }),
          createExternalTokenHandler({
            type: 'internal-custom',
            initialize: jest.fn().mockResolvedValue(undefined),
            verifyToken: jest.fn().mockResolvedValue({
              subject: 'sub',
            }),
          }),
        ],
      });

    expect(createHandler).toThrowErrorMatchingInlineSnapshot(
      `"Duplicate external token handler type 'internal-custom', each handler must have a unique type"`,
    );
  });
  it('should fail if config contains types not declared', async () => {
    const createHandler = () =>
      ExternalAuthTokenHandler.create({
        ownPluginId: 'catalog',
        logger: mockServices.logger.mock(),
        config: mockServices.rootConfig({
          data: {
            backend: {
              auth: {
                externalAccess: [
                  {
                    type: 'internal-custom',
                    options: {
                      issuer: 'my-company',
                      subject: 'internal-subject',
                      audience: 'backstage',
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

    expect(createHandler).toThrowErrorMatchingInlineSnapshot(
      `"Unknown type 'internal-custom' in backend.auth.externalAccess, expected one of 'static', 'legacy', 'jwks'"`,
    );
  });

  it('should show valid custom types in errors', async () => {
    const createHandler = () =>
      ExternalAuthTokenHandler.create({
        ownPluginId: 'catalog',
        logger: mockServices.logger.mock(),
        config: mockServices.rootConfig({
          data: {
            backend: {
              auth: {
                externalAccess: [
                  {
                    type: 'internal-custom-invalid',
                    options: {
                      issuer: 'my-company',
                      subject: 'internal-subject',
                      audience: 'backstage',
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
        externalTokenHandlers: [
          createExternalTokenHandler({
            type: 'internal-custom',
            initialize: jest.fn().mockResolvedValue(undefined),
            verifyToken: jest.fn().mockResolvedValue({
              subject: 'sub',
            }),
          }),
        ],
      });

    expect(createHandler).toThrowErrorMatchingInlineSnapshot(
      `"Unknown type 'internal-custom-invalid' in backend.auth.externalAccess, expected one of 'static', 'legacy', 'jwks', 'internal-custom'"`,
    );
  });
});
