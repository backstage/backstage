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
  ServiceFactoryTester,
  mockServices,
  setupRequestMockHandlers,
} from '@backstage/backend-test-utils';
import { tokenManagerServiceFactory } from '@backstage/backend-app-api';
import {
  authServiceFactory,
  authTokenHandlersServiceRef,
} from './authServiceFactory';
import { base64url, decodeJwt } from 'jose';
import { discoveryServiceFactory } from '../discovery';
import {
  BackstageServicePrincipal,
  BackstageUserPrincipal,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { InternalBackstageCredentials } from './types';
import { toInternalBackstageCredentials } from './helpers';

const server = setupServer();

// TODO: Ship discovery mock service in the service factory tester
const mockDeps = [
  discoveryServiceFactory(),
  tokenManagerServiceFactory,
  mockServices.rootConfig.factory({
    data: {
      backend: {
        baseUrl: 'http://localhost',
        auth: {
          keys: [{ secret: 'abc' }],
          externalAccess: [
            {
              type: 'static',
              options: {
                token: 'limited-static-token',
                subject: 'limited-static-subject',
              },
              accessRestrictions: [{ plugin: 'catalog', permission: 'do.it' }],
            },
            {
              type: 'static',
              options: {
                token: 'unlimited-static-token',
                subject: 'unlimited-static-subject',
              },
            },
          ],
        },
      },
    },
  }),
];

describe('authServiceFactory', () => {
  setupRequestMockHandlers(server);

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should authenticate issued tokens with legacy auth', async () => {
    server.use(
      rest.get(
        'http://localhost:7007/api/catalog/.backstage/auth/v1/jwks.json',
        (_req, res, ctx) => res(ctx.status(404)),
      ),
    );

    const tester = ServiceFactoryTester.from(authServiceFactory, {
      dependencies: mockDeps,
    });

    const searchAuth = await tester.getSubject('search');
    const catalogAuth = await tester.getSubject('catalog');

    const { token: searchToken } = await searchAuth.getPluginRequestToken({
      onBehalfOf: await searchAuth.getOwnServiceCredentials(),
      targetPluginId: 'catalog',
    });

    await expect(searchAuth.authenticate(searchToken)).resolves.toEqual(
      expect.objectContaining({
        principal: {
          type: 'service',
          subject: 'external:backstage-plugin',
        },
      }),
    );
    await expect(catalogAuth.authenticate(searchToken)).resolves.toEqual(
      expect.objectContaining({
        principal: {
          type: 'service',
          subject: 'external:backstage-plugin',
        },
      }),
    );
  });

  it('should authenticate issued tokens with new auth', async () => {
    const tester = ServiceFactoryTester.from(authServiceFactory, {
      dependencies: mockDeps,
    });

    const searchAuth = await tester.getSubject('search');
    const catalogAuth = await tester.getSubject('catalog');

    server.use(
      rest.get(
        'http://localhost:7007/api/catalog/.backstage/auth/v1/jwks.json',
        async (_req, res, ctx) =>
          res(ctx.json(await catalogAuth.listPublicServiceKeys())),
      ),
      rest.get(
        'http://localhost:7007/api/search/.backstage/auth/v1/jwks.json',
        async (_req, res, ctx) =>
          res(ctx.json(await searchAuth.listPublicServiceKeys())),
      ),
    );

    const { token: searchToken } = await searchAuth.getPluginRequestToken({
      onBehalfOf: await searchAuth.getOwnServiceCredentials(),
      targetPluginId: 'catalog',
    });

    await expect(searchAuth.authenticate(searchToken)).rejects.toThrow(
      'Invalid plugin token',
    );
    await expect(catalogAuth.authenticate(searchToken)).resolves.toEqual(
      expect.objectContaining({
        principal: {
          type: 'service',
          subject: 'plugin:search',
        },
      }),
    );
  });

  it('should forward user token if target plugin does not support new auth service', async () => {
    server.use(
      rest.get(
        'http://localhost:7007/api/permission/.backstage/auth/v1/jwks.json',
        (_req, res, ctx) => res(ctx.status(404)),
      ),
    );

    const tester = ServiceFactoryTester.from(authServiceFactory, {
      dependencies: mockDeps,
    });

    const catalogAuth = await tester.getSubject('catalog');

    await expect(
      catalogAuth.getPluginRequestToken({
        onBehalfOf: {
          $$type: '@backstage/BackstageCredentials',
          version: 'v1',
          authMethod: 'token',
          token: 'alice-token',
          principal: {
            type: 'user',
            userEntityRef: 'user:default/alice',
          },
        } as InternalBackstageCredentials<BackstageUserPrincipal>,
        targetPluginId: 'permission',
      }),
    ).resolves.toEqual({ token: 'alice-token' });
  });

  it('should issue a new service token with token manager if target plugin does not support new auth service', async () => {
    server.use(
      rest.get(
        'http://localhost:7007/api/permission/.backstage/auth/v1/jwks.json',
        (_req, res, ctx) => res(ctx.status(404)),
      ),
    );

    const tester = ServiceFactoryTester.from(authServiceFactory, {
      dependencies: mockDeps,
    });

    const catalogAuth = await tester.getSubject('catalog');

    const { token } = await catalogAuth.getPluginRequestToken({
      onBehalfOf: {
        $$type: '@backstage/BackstageCredentials',
        version: 'v1',
        authMethod: 'token',
        token: 'some-upstream-service-token',
        principal: {
          type: 'service',
          subject: 'external:upstream-service',
        },
      } as InternalBackstageCredentials<BackstageServicePrincipal>,
      targetPluginId: 'permission',
    });

    expect(decodeJwt(token)).toEqual(
      expect.objectContaining({
        sub: 'backstage-server',
      }),
    );
  });

  it('should issue limited user tokens', async () => {
    /* Corresponding private key in case this test needs to be updated in the future:
     {
       kty: 'EC',
       x: 'c9cPvv_S7zETBKDlAa3oOjr7RvyUueIYIak0TRph7mg',
       y: 'bKaxDRAWgmEJ9Ix8e85blH_IsnbQxX31x0oQTVwLZ2c',
       crv: 'P-256',
       d: '2eJlhCDdGx9fxKDL1D9BnY3CCTEKxL60Bkms0hmubmY',
       kid: '8d01c3db-56f9-45f0-86dd-05b3c835b3d3',
       alg: 'ES256'
     }
    */
    server.use(
      rest.get(
        'http://localhost:7007/api/auth/.well-known/jwks.json',
        (_req, res, ctx) =>
          res(
            ctx.json({
              keys: [
                {
                  kty: 'EC',
                  x: 'c9cPvv_S7zETBKDlAa3oOjr7RvyUueIYIak0TRph7mg',
                  y: 'bKaxDRAWgmEJ9Ix8e85blH_IsnbQxX31x0oQTVwLZ2c',
                  crv: 'P-256',
                  kid: '8d01c3db-56f9-45f0-86dd-05b3c835b3d3',
                  alg: 'ES256',
                },
              ],
            }),
          ),
      ),
    );

    const expectedIssuedAt = 1712071714;
    const expectedExpiresAt = 1712075314;

    jest.useFakeTimers({
      now: expectedIssuedAt * 1000 + 600_000,
    });

    const tester = ServiceFactoryTester.from(authServiceFactory, {
      dependencies: mockDeps,
    });

    const catalogAuth = await tester.getSubject('catalog');

    const fullToken =
      'eyJ0eXAiOiJ2bmQuYmFja3N0YWdlLnVzZXIiLCJhbGciOiJFUzI1NiIsImtpZCI6IjhkMDFjM2RiLTU2ZjktNDVmMC04NmRkLTA1YjNjODM1YjNkMyJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjcwMDcvYXBpL2F1dGgiLCJzdWIiOiJ1c2VyOmRldmVsb3BtZW50L2d1ZXN0IiwiZW50IjpbInVzZXI6ZGV2ZWxvcG1lbnQvZ3Vlc3QiLCJncm91cDpkZWZhdWx0L3RlYW0tYSJdLCJhdWQiOiJiYWNrc3RhZ2UiLCJpYXQiOjE3MTIwNzE3MTQsImV4cCI6MTcxMjA3NTMxNCwidWlwIjoiSmwxVEpycG9VUjR1NENjUE9nalJMeHpEMi1FMGZPR3ptSm81UWI2eS1aN19meG5oVVBEdWVWRE1CS0l6WF9pc0lvSDhlZm9EUFA5bG9aQnpPblB5Z2cifQ.1gVMq1ofO8PzRctu72D6c4IMqXuIabT79WdGEhW6vIrBRs_qhuWAa94Wvz_KYKpBTb2nxgzXJ5OeddeoYApMyQ';

    const credentials = await catalogAuth.authenticate(fullToken);
    if (!catalogAuth.isPrincipal(credentials, 'user')) {
      throw new Error('no a user principal');
    }

    const { token: limitedToken, expiresAt } =
      await catalogAuth.getLimitedUserToken(credentials);

    expect(expiresAt).toEqual(new Date(expectedExpiresAt * 1000));

    const expectedTokenHeader = base64url.encode(
      JSON.stringify({
        typ: 'vnd.backstage.limited-user',
        alg: 'ES256',
        kid: '8d01c3db-56f9-45f0-86dd-05b3c835b3d3',
      }),
    );
    const expectedTokenPayload = base64url.encode(
      JSON.stringify({
        sub: 'user:development/guest',
        iat: expectedIssuedAt,
        exp: expectedExpiresAt,
      }),
    );
    const expectedTokenSignature = JSON.parse(
      atob(fullToken.split('.')[1]),
    ).uip;

    const expectedToken = `${expectedTokenHeader}.${expectedTokenPayload}.${expectedTokenSignature}`;

    expect(limitedToken).toBe(expectedToken);

    const limitedCredentials = await catalogAuth.authenticate(limitedToken, {
      allowLimitedAccess: true,
    });

    if (!catalogAuth.isPrincipal(limitedCredentials, 'user')) {
      throw new Error('Not user credentials');
    }
    expect(limitedCredentials.principal.userEntityRef).toBe(
      'user:development/guest',
    );
    expect(limitedCredentials.expiresAt).toEqual(
      new Date(expectedExpiresAt * 1000),
    );
  });

  it('should issue service on-behalf-of user tokens', async () => {
    const tester = ServiceFactoryTester.from(authServiceFactory, {
      dependencies: mockDeps,
    });

    const searchAuth = await tester.getSubject('search');
    const catalogAuth = await tester.getSubject('catalog');
    const permissionAuth = await tester.getSubject('permission');

    /* Corresponding private key in case this test needs to be updated in the future:
     {
       kty: 'EC',
       x: 'c9cPvv_S7zETBKDlAa3oOjr7RvyUueIYIak0TRph7mg',
       y: 'bKaxDRAWgmEJ9Ix8e85blH_IsnbQxX31x0oQTVwLZ2c',
       crv: 'P-256',
       d: '2eJlhCDdGx9fxKDL1D9BnY3CCTEKxL60Bkms0hmubmY',
       kid: '8d01c3db-56f9-45f0-86dd-05b3c835b3d3',
       alg: 'ES256'
     }
    */
    server.use(
      rest.get(
        'http://localhost:7007/api/auth/.well-known/jwks.json',
        (_req, res, ctx) =>
          res(
            ctx.json({
              keys: [
                {
                  kty: 'EC',
                  x: 'c9cPvv_S7zETBKDlAa3oOjr7RvyUueIYIak0TRph7mg',
                  y: 'bKaxDRAWgmEJ9Ix8e85blH_IsnbQxX31x0oQTVwLZ2c',
                  crv: 'P-256',
                  kid: '8d01c3db-56f9-45f0-86dd-05b3c835b3d3',
                  alg: 'ES256',
                },
              ],
            }),
          ),
      ),
      rest.get(
        'http://localhost:7007/api/catalog/.backstage/auth/v1/jwks.json',
        async (_req, res, ctx) =>
          res(ctx.json(await catalogAuth.listPublicServiceKeys())),
      ),
      rest.get(
        'http://localhost:7007/api/search/.backstage/auth/v1/jwks.json',
        async (_req, res, ctx) =>
          res(ctx.json(await searchAuth.listPublicServiceKeys())),
      ),
      rest.get(
        'http://localhost:7007/api/permission/.backstage/auth/v1/jwks.json',
        async (_req, res, ctx) =>
          res(ctx.json(await permissionAuth.listPublicServiceKeys())),
      ),
      rest.get(
        'http://localhost:7007/api/kubernetes/.backstage/auth/v1/jwks.json',
        (_req, res, ctx) => res(ctx.status(404)),
      ),
    );

    const expectedIssuedAt = 1712071714;
    const expectedExpiresAt = 1712075314;

    jest.useFakeTimers({
      now: expectedIssuedAt * 1000 + 600_000,
    });

    const fullToken =
      'eyJ0eXAiOiJ2bmQuYmFja3N0YWdlLnVzZXIiLCJhbGciOiJFUzI1NiIsImtpZCI6IjhkMDFjM2RiLTU2ZjktNDVmMC04NmRkLTA1YjNjODM1YjNkMyJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjcwMDcvYXBpL2F1dGgiLCJzdWIiOiJ1c2VyOmRldmVsb3BtZW50L2d1ZXN0IiwiZW50IjpbInVzZXI6ZGV2ZWxvcG1lbnQvZ3Vlc3QiLCJncm91cDpkZWZhdWx0L3RlYW0tYSJdLCJhdWQiOiJiYWNrc3RhZ2UiLCJpYXQiOjE3MTIwNzE3MTQsImV4cCI6MTcxMjA3NTMxNCwidWlwIjoiSmwxVEpycG9VUjR1NENjUE9nalJMeHpEMi1FMGZPR3ptSm81UWI2eS1aN19meG5oVVBEdWVWRE1CS0l6WF9pc0lvSDhlZm9EUFA5bG9aQnpPblB5Z2cifQ.1gVMq1ofO8PzRctu72D6c4IMqXuIabT79WdGEhW6vIrBRs_qhuWAa94Wvz_KYKpBTb2nxgzXJ5OeddeoYApMyQ';

    const credentials = await searchAuth.authenticate(fullToken);
    if (!searchAuth.isPrincipal(credentials, 'user')) {
      throw new Error('not a user principal');
    }
    const { token: limitedToken } = await searchAuth.getLimitedUserToken(
      credentials,
    );

    const { token: oboToken } = await searchAuth.getPluginRequestToken({
      onBehalfOf: credentials,
      targetPluginId: 'catalog',
    });
    expect(oboToken).not.toBe(fullToken);
    expect(decodeJwt(oboToken).obo).toBe(limitedToken);
    expect(decodeJwt(oboToken).exp).toBe(expectedExpiresAt);

    const oboCredentials = await catalogAuth.authenticate(oboToken);
    if (!catalogAuth.isPrincipal(oboCredentials, 'user')) {
      throw new Error('obo credential is not a user principal');
    }
    expect(oboCredentials.principal.userEntityRef).toBe(
      'user:development/guest',
    );
    expect(toInternalBackstageCredentials(oboCredentials).token).toBe(
      limitedToken,
    );

    const { token: oboToken2 } = await catalogAuth.getPluginRequestToken({
      onBehalfOf: oboCredentials,
      targetPluginId: 'permission',
    });
    expect(decodeJwt(oboToken2).obo).toBe(limitedToken);

    await expect(
      catalogAuth.getPluginRequestToken({
        onBehalfOf: oboCredentials,
        targetPluginId: 'kubernetes',
      }),
    ).rejects.toThrow(
      "Unable to call 'kubernetes' plugin on behalf of user, because the target plugin does not support on-behalf-of tokens or the plugin doesn't exist",
    );
  });

  it('should eagerly reject access to external access tokens based on plugin id', async () => {
    const tester = ServiceFactoryTester.from(authServiceFactory, {
      dependencies: mockDeps,
    });

    const catalogAuth = await tester.getSubject('catalog');

    await expect(
      catalogAuth.authenticate('limited-static-token'),
    ).resolves.toMatchObject({
      principal: {
        subject: 'limited-static-subject',
        accessRestrictions: { permissionNames: ['do.it'] },
      },
    });

    await expect(
      catalogAuth.authenticate('unlimited-static-token'),
    ).resolves.toMatchObject({
      principal: {
        subject: 'unlimited-static-subject',
      },
    });

    const scaffolderAuth = await tester.getSubject('scaffolder');

    await expect(
      scaffolderAuth.authenticate('limited-static-token'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"This token's access is restricted to plugin(s) 'catalog'"`,
    );

    await expect(
      scaffolderAuth.authenticate('unlimited-static-token'),
    ).resolves.toMatchObject({
      principal: { subject: 'unlimited-static-subject' },
    });
  });

  it('should support custom token handlers', async () => {
    const tester = ServiceFactoryTester.from(authServiceFactory, {
      dependencies: [
        discoveryServiceFactory(),
        mockServices.rootConfig.factory({
          data: {
            backend: {
              baseUrl: 'http://localhost',
              auth: {
                externalAccess: [
                  {
                    type: 'test',
                    options: {
                      token: 'test-token',
                    },
                  },
                ],
              },
            },
          },
        }),
        createServiceFactory({
          service: authTokenHandlersServiceRef,
          deps: {},
          factory() {
            const tokens = new Array<string>();
            return {
              type: 'test',
              add(config) {
                tokens.push(config.getString('options.token'));
              },
              async verifyToken(token) {
                if (!tokens.includes(token)) {
                  return undefined;
                }
                return {
                  subject: 'tester',
                };
              },
            };
          },
        }),
      ],
    });

    const catalogAuth = await tester.getSubject('catalog');

    await expect(catalogAuth.authenticate('test-token')).resolves.toMatchObject(
      {
        principal: {
          subject: 'tester',
        },
      },
    );

    await expect(
      catalogAuth.authenticate('other-token'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Illegal token"`);
  });

  it('should throw an error if defautl token handlers are overriden', async () => {
    const tester = ServiceFactoryTester.from(authServiceFactory, {
      dependencies: [
        discoveryServiceFactory(),
        mockServices.rootConfig.factory({
          data: {
            backend: {
              baseUrl: 'http://localhost',
            },
          },
        }),
        createServiceFactory({
          service: authTokenHandlersServiceRef,
          deps: {},
          factory() {
            return {
              type: 'legacy',
              add() {},
              verifyToken: async () => undefined,
            };
          },
        }),
      ],
    });

    await expect(
      tester.getSubject('catalog'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to instantiate service 'core.auth' for 'catalog' because the factory function threw an error, Error: Refused to install duplicate external token handler for type 'legacy'"`,
    );
  });
});
