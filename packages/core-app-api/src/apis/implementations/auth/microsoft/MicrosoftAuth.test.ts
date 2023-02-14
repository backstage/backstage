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
import * as loginPopup from '../../../../lib/loginPopup';
import { setupRequestMockHandlers } from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

jest.mock('../../../../lib/loginPopup', () => {
  return {
    showLoginPopup: jest.fn(),
  };
});

describe('MicrosoftAuth', () => {
  const server = setupServer();
  setupRequestMockHandlers(server);
  const microsoftAuth = MicrosoftAuth.create({
    oauthRequestApi: new MockOAuthApi(),
    discoveryApi: UrlPatternDiscovery.compile(
      'http://backstage.test/api/{{ pluginId }}',
    ),
  });
  const showLoginPopup = jest.spyOn(loginPopup, 'showLoginPopup');

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
                    JSON.stringify(MicrosoftAuth.expectedClaims(scope)),
                  ).toString('base64')}.signature`,
                  scope,
                },
              }),
            );
          },
        ),
      );
      showLoginPopup.mockRejectedValue(new Error('no popups should be shown'));
    });

    afterEach(() => {
      showLoginPopup.mockRestore();
    });

    it('gets access token for Microsoft Graph', async () => {
      const accessToken = await microsoftAuth.getAccessToken();

      expect(accessToken).toHaveJWTClaims({
        aud: '00000003-0000-0000-c000-000000000000',
        scp: 'openid profile email User.Read',
      });
    });

    it('gets access token for other azure resources', async () => {
      const accessToken = await microsoftAuth.getAccessToken(
        'azure-resource/scope',
      );

      expect(accessToken).toHaveJWTClaims({
        aud: 'azure-resource',
        scp: 'scope',
      });
    });
  });

  describe('without a refresh token', () => {
    let refreshTokenCookie: jest.Mock<(refreshToken: string) => void>;

    const getAccessTokenWaitingForPopup = async (scope?: string) => {
      const oauthRequestApi = new MockOAuthApi();

      const accessToken = MicrosoftAuth.create({
        oauthRequestApi,
        discoveryApi: UrlPatternDiscovery.compile(
          'http://backstage.test/api/{{ pluginId }}',
        ),
      }).getAccessToken(scope);

      await new Promise<void>(resolve => {
        const subscription = oauthRequestApi
          .authRequest$()
          .subscribe(requests => {
            if (requests.length > 0) {
              subscription.unsubscribe();
              Promise.all(requests.map(request => request.trigger())).then(() =>
                resolve(),
              );
            }
          });
      });

      return accessToken;
    };

    beforeEach(() => {
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

      refreshTokenCookie = jest.fn();

      showLoginPopup.mockImplementation(({ url }) => {
        const scope = new URL(url).searchParams.get('scope')!;
        if (scope.includes('offline_access')) {
          refreshTokenCookie('refreshToken');
        }
        return Promise.resolve({
          providerInfo: {
            accessToken: `header.${Buffer.from(
              JSON.stringify(MicrosoftAuth.expectedClaims(scope)),
            ).toString('base64')}.signature`,
          },
        });
      });
    });

    afterEach(() => {
      showLoginPopup.mockRestore();
    });

    it('gets access token for Microsoft Graph via a popup', async () => {
      const accessToken = await getAccessTokenWaitingForPopup();

      expect(accessToken).toHaveJWTClaims({
        aud: '00000003-0000-0000-c000-000000000000',
        scp: 'openid profile email User.Read',
      });
    });

    it('gets access token for other azure resources via popup', async () => {
      const accessToken = await getAccessTokenWaitingForPopup(
        'azure-resource/scope',
      );

      expect(accessToken).toHaveJWTClaims({
        aud: 'azure-resource',
        scp: 'scope',
      });
    });

    it('gets access token when scope contains a resource URI', async () => {
      const accessToken = await getAccessTokenWaitingForPopup(
        'api://customApiClientId/some.scope',
      );

      expect(accessToken).toHaveJWTClaims({
        aud: 'customApiClientId',
        scp: 'some.scope',
      });
    });

    it('gets refresh token when requesting other azure scopes via popup', async () => {
      await getAccessTokenWaitingForPopup('azure-resource/scope');

      expect(refreshTokenCookie).toHaveBeenCalledWith('refreshToken');
    });
  });
});
