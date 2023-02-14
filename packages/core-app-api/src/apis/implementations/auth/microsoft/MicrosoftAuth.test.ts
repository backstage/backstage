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

  describe('with a refresh token', () => {
    beforeEach(() => {
      server.use(
        rest.get(
          'http://backstage.test/api/auth/microsoft/refresh',
          async (req, res, ctx) => {
            const scopeParam = req.url.searchParams.get('scope');
            return res(
              ctx.json({
                providerInfo: {
                  accessToken: scopeParam
                    ? 'tokenForOtherResource'
                    : 'tokenForGrantScopes',
                  scope: scopeParam || 'grant-resource/scope',
                },
              }),
            );
          },
        ),
      );
    });

    it('gets access token with requested scopes for grant', async () => {
      const accessToken = await microsoftAuth.getAccessToken();

      expect(accessToken).toEqual('tokenForGrantScopes');
    });

    it('gets access token for other consented scopes besides those directly granted', async () => {
      const accessToken = await microsoftAuth.getAccessToken(
        'azure-resource/scope',
      );

      expect(accessToken).toEqual('tokenForOtherResource');
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

    it('gets access + refresh token for other azure resources via popup', async () => {
      await sut.getAccessToken('azure-resource/scope');

      expect(mockRequester).toHaveBeenCalledWith(
        new Set(['azure-resource/scope', 'offline_access']),
      );
    });

    it('requests scopes for resource ID when scope contains a resource URI', async () => {
      await sut.getAccessToken('api://customApiClientId/some.scope');

      expect(mockRequester).toHaveBeenCalledWith(
        new Set(['api://customApiClientId/some.scope', 'offline_access']),
      );
    });
  });
});
