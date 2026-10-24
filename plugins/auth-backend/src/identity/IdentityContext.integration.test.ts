/*
 * Copyright 2026 The Backstage Authors
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
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { authServiceFactory } from '@backstage/backend-defaults/auth';
import { discoveryServiceFactory } from '@backstage/backend-defaults/discovery';
import { BackstageUserIdentityContext } from '@backstage/backend-plugin-api';
import { decodeJwt } from 'jose';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { MemoryKeyStore } from './MemoryKeyStore';
import { TokenFactory } from './TokenFactory';

const server = setupServer();

describe('identity context integration', () => {
  registerMswTestHooks(server);

  afterEach(() => {
    jest.useRealTimers();
  });

  it('preserves issuer-produced context through successive plugin calls', async () => {
    const now = 1712071714;
    const tokenDurationSeconds = 300;
    jest.useFakeTimers({ now: now * 1000 });

    const tokenFactory = new TokenFactory({
      issuer: 'http://localhost:7007/api/auth',
      keyStore: new MemoryKeyStore(),
      keyDurationSeconds: tokenDurationSeconds,
      logger: mockServices.logger.mock(),
    });
    const tester = ServiceFactoryTester.from(authServiceFactory, {
      dependencies: [
        discoveryServiceFactory,
        mockServices.rootConfig.factory({
          data: {
            backend: {
              baseUrl: 'http://localhost',
              auth: { keys: [{ secret: 'abc' }] },
            },
          },
        }),
      ],
    });
    const searchAuth = await tester.getSubject('search');
    const catalogAuth = await tester.getSubject('catalog');
    const permissionAuth = await tester.getSubject('permission');

    server.use(
      http.get(
        'http://localhost:7007/api/auth/.well-known/jwks.json',
        async () => HttpResponse.json(await tokenFactory.listPublicKeys()),
      ),
      http.get(
        'http://localhost:7007/api/search/.backstage/auth/v1/jwks.json',
        async () => HttpResponse.json(await searchAuth.listPublicServiceKeys()),
      ),
      http.get(
        'http://localhost:7007/api/catalog/.backstage/auth/v1/jwks.json',
        async () =>
          HttpResponse.json(await catalogAuth.listPublicServiceKeys()),
      ),
    );

    const identityContext: BackstageUserIdentityContext = {
      issuer: 'https://portal.example.com/',
      attributes: {
        profile: 'organization',
        profileId: 'org_a',
        region: 'eu',
      },
    };
    const { token: userToken } = await tokenFactory.issueToken({
      claims: {
        sub: 'user:development/guest',
        ent: ['user:development/guest'],
      },
      identityContext,
    });

    const searchCredentials = await searchAuth.authenticate(userToken);
    expect(searchCredentials.principal).toMatchObject({
      type: 'user',
      userEntityRef: 'user:development/guest',
      identityContext,
    });

    const { token: catalogToken } = await searchAuth.getPluginRequestToken({
      onBehalfOf: searchCredentials,
      targetPluginId: 'catalog',
    });
    expect(decodeJwt(catalogToken).exp).toBe(now + tokenDurationSeconds);

    const catalogCredentials = await catalogAuth.authenticate(catalogToken);
    expect(catalogCredentials.principal).toMatchObject({
      type: 'user',
      userEntityRef: 'user:development/guest',
      identityContext,
      actor: { type: 'service', subject: 'plugin:search' },
    });

    const { token: permissionToken } = await catalogAuth.getPluginRequestToken({
      onBehalfOf: catalogCredentials,
      targetPluginId: 'permission',
    });
    expect(decodeJwt(permissionToken).exp).toBe(now + tokenDurationSeconds);

    const permissionCredentials = await permissionAuth.authenticate(
      permissionToken,
    );
    expect(permissionCredentials.principal).toEqual({
      type: 'user',
      userEntityRef: 'user:development/guest',
      identityContext,
      actor: { type: 'service', subject: 'plugin:catalog' },
    });
  });
});
