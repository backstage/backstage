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
} from '@backstage/backend-test-utils';
import {
  InternalBackstageCredentials,
  authServiceFactory,
} from './authServiceFactory';
import { base64url, decodeJwt } from 'jose';
import { discoveryServiceFactory } from '../discovery';
import {
  BackstageServicePrincipal,
  BackstageUserPrincipal,
} from '@backstage/backend-plugin-api';
import { tokenManagerServiceFactory } from '../tokenManager';

// TODO: Ship discovery mock service in the service factory tester
const mockDeps = [
  discoveryServiceFactory(),
  tokenManagerServiceFactory,
  mockServices.rootConfig.factory({
    data: {
      backend: {
        baseUrl: 'http://localhost',
        auth: { keys: [{ secret: 'abc' }] },
      },
    },
  }),
];

describe('authServiceFactory', () => {
  it('should authenticate issued tokens', async () => {
    const tester = ServiceFactoryTester.from(authServiceFactory, {
      dependencies: mockDeps,
    });

    const searchAuth = await tester.get('search');
    const catalogAuth = await tester.get('catalog');

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

  it('should forward user tokens', async () => {
    const tester = ServiceFactoryTester.from(authServiceFactory, {
      dependencies: mockDeps,
    });

    const catalogAuth = await tester.get('catalog');

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
        targetPluginId: 'catalog',
      }),
    ).resolves.toEqual({ token: 'alice-token' });
  });

  it('should not forward service tokens', async () => {
    const tester = ServiceFactoryTester.from(authServiceFactory, {
      dependencies: mockDeps,
    });

    const catalogAuth = await tester.get('catalog');

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
      targetPluginId: 'catalog',
    });

    expect(decodeJwt(token)).toEqual(
      expect.objectContaining({
        sub: 'backstage-server',
      }),
    );
  });

  it('should issue limited user tokens', async () => {
    const publicKey = [
      {
        kty: 'EC',
        x: 'Xd7ATJLz0085GTqYTKdl3oSZqHwcs-l1bMxrG7iFMOw',
        y: 'EvFsODRaJsNWKLgknbHeCE1KxAPZL2WiSNkXB5gO1WM',
        crv: 'P-256',
        kid: 'b49bc495-e926-4ff9-b44f-4100e2dc069d',
        alg: 'ES256',
      },
    ];

    const tester = ServiceFactoryTester.from(authServiceFactory, {
      dependencies: mockDeps,
    });

    const catalogAuth = await tester.get('catalog');

    const fullToken =
      'eyJhbGciOiJFUzI1NiIsImtpZCI6ImI0OWJjNDk1LWU5MjYtNGZmOS1iNDRmLTQxMDBlMmRjMDY5ZCJ9.eyJ0eXAiOiJ2bmQuYmFja3N0YWdlLnVzZXIiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjcwMDcvYXBpL2F1dGgiLCJzdWIiOiJ1c2VyOmRldmVsb3BtZW50L2d1ZXN0IiwiZW50IjpbInVzZXI6ZGV2ZWxvcG1lbnQvZ3Vlc3QiLCJncm91cDpkZWZhdWx0L3RlYW0tYSJdLCJhdWQiOiJiYWNrc3RhZ2UiLCJpYXQiOjE3MTIwNjQ0NzksImV4cCI6MTcxMjA2ODA3OSwidWlwIjoiMVQxR1JIcGpsdF9oRl8zM2trUFZ2QjdqM1dkWlJqcFowVHVnLXJTaXQwRHNQclJLY1V4eGU3VGVpZDhCbDhCTDE2QnRtTTRWTzJzQ0ExcjVkWUdLS2ZnIn0.5fFibx-RJVPHOvJNSCLGbUg3_sJVUMnyfN6QAq5abyKi8wtbDCCUAI9_x0Rb22KYCmBolV_cdjut-V6wQ3YmBg';

    const credentials = await catalogAuth.authenticate(fullToken);
    if (!catalogAuth.isPrincipal(credentials, 'user')) {
      throw new Error('no a user principal');
    }

    const { token: limitedToken, expiresAt } =
      await catalogAuth.getLimitedUserToken(credentials);

    expect(expiresAt).toEqual(new Date(1712068079 * 1000));

    const expectedTokenHeader = base64url.encode(
      JSON.stringify({
        alg: 'ES256',
        kid: 'b49bc495-e926-4ff9-b44f-4100e2dc069d',
      }),
    );
    const expectedTokenPayload = base64url.encode(
      JSON.stringify({
        typ: 'vnd.backstage.limited-user',
        sub: 'user:development/guest',
        ent: ['user:development/guest', 'group:default/team-a'],
        iat: 1712064479,
        exp: 1712068079,
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
  });
});
