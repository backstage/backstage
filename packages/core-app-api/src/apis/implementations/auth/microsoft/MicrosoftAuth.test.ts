/*
 * Copyright 2023 The Backstage Authors
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

import MicrosoftAuth from './MicrosoftAuth';
import MockOAuthApi from '../../OAuthRequestApi/MockOAuthApi';
import { UrlPatternDiscovery } from '../../DiscoveryApi';
import { ConfigReader } from '@backstage/config';
import { microsoftAuthApiRef } from '@backstage/core-plugin-api';
import { setupRequestMockHandlers } from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

describe('MicrosoftAuth', () => {
  const server = setupServer();
  setupRequestMockHandlers(server);
  const microsoftAuth = MicrosoftAuth.create({
    configApi: new ConfigReader(undefined),
    oauthRequestApi: new MockOAuthApi(),
    discoveryApi: UrlPatternDiscovery.compile(
      'http://backstage.test/api/{{ pluginId }}',
    ),
  });

  const toHaveJWTClaims = function toHaveJWTClaims(
    this: jest.MatcherContext,
    received: string,
    expected: Record<string, any>,
  ): jest.CustomMatcherResult {
    let parsedClaims: Record<string, any>;
    try {
      parsedClaims = JSON.parse(
        Buffer.from(received.split('.')[1], 'base64').toString(),
      );
    } catch (e) {
      return {
        pass: false,
        message: () =>
          `Expected JWT with claims: ${this.utils.printExpected(
            expected,
          )}\nReceived invalid JWT ${this.utils.printReceived(
            received,
          )}\nError: ${e}`,
      };
    }
    const expectedResult = expect.objectContaining(expected);
    return {
      pass: this.equals(parsedClaims, expectedResult),
      message: () =>
        `Expected JWT with claims: ${this.utils.printExpected(
          expected,
        )}\nReceived JWT with claims: ${this.utils.printReceived(
          parsedClaims,
        )}\n\n${this.utils.diff(expectedResult, parsedClaims)}`,
    };
  };
  expect.extend({ toHaveJWTClaims });

  describe('with a refresh token', () => {
    beforeEach(() => {
      server.use(
        rest.get(
          'http://backstage.test/api/auth/microsoft/refresh',
          (req, res, ctx) => {
            const scope =
              req.url.searchParams.get('scope') ||
              'openid profile email User.Read';
            return res(
              ctx.json({
                providerInfo: {
                  accessToken: `header.${Buffer.from(
                    JSON.stringify({
                      aud: '00000003-0000-0000-c000-000000000000',
                      scp: 'openid profile email User.Read',
                    }),
                  ).toString('base64')}.signature`,
                  scope,
                },
              }),
            );
          },
        ),
      );
    });

    it('gets access token for Microsoft Graph', async () => {
      const accessToken = await microsoftAuth.getAccessToken();

      expect(accessToken).toHaveJWTClaims({
        aud: '00000003-0000-0000-c000-000000000000',
        scp: 'openid profile email User.Read',
      });
    });
  });

  describe('without a refresh token', () => {
    let mockRequester: jest.Mock;
    let sut: typeof microsoftAuthApiRef.T;

    beforeEach(() => {
      mockRequester = jest.fn();
      sut = MicrosoftAuth.create({
        configApi: new ConfigReader(undefined),
        oauthRequestApi: {
          createAuthRequester: jest.fn().mockReturnValue(mockRequester),
          authRequest$: jest.fn(),
        },
        discoveryApi: UrlPatternDiscovery.compile(
          'http://backstage.test/api/{{ pluginId }}',
        ),
      });
      server.use(
        rest.get(
          'http://backstage.test/api/auth/microsoft/refresh',
          (_, res, ctx) => {
            return res(
              ctx.status(401),
              ctx.json({
                error: {
                  name: 'AuthenticationError',
                  message:
                    'Refresh failed; caused by InputError: Missing session cookie',
                  cause: {
                    name: 'InputError',
                    message: 'Missing session cookie',
                  },
                },
                request: {
                  method: 'GET',
                  url: '/api/auth/microsoft/refresh?env=development',
                },
                response: {
                  statusCode: 401,
                },
              }),
            );
          },
        ),
      );
    });

    it('gets access token for Microsoft Graph via popup', async () => {
      await sut.getAccessToken();

      expect(mockRequester).toHaveBeenCalledWith(
        new Set(['User.Read', 'email', 'offline_access', 'openid', 'profile']),
      );
    });

    it('gets access token for other azure resources via popup', async () => {
      await sut.getAccessToken('azure-resource/scope');

      expect(mockRequester).toHaveBeenCalledWith(
        new Set(['azure-resource/scope']),
      );
    });

    it('requests scopes for resource ID when scope contains a resource URI', async () => {
      await sut.getAccessToken('api://customApiClientId/some.scope');

      expect(mockRequester).toHaveBeenCalledWith(
        new Set(['api://customApiClientId/some.scope']),
      );
    });
  });
});
