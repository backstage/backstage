/*
 * Copyright 2020 The Backstage Authors
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

import * as helpers from '../../lib/passport/PassportStrategyHelper';
import { makeProfileInfo } from '../../lib/passport';
import { AuthResolverContext } from '../types';
import {
  bitbucketServer,
  BitbucketServerAuthProvider,
  BitbucketServerOAuthResult,
} from './provider';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { rest } from 'msw';

jest.mock('../../lib/passport/PassportStrategyHelper', () => {
  return {
    ...jest.requireActual('../../lib/passport/PassportStrategyHelper'),
    executeFrameHandlerStrategy: jest.fn(),
    executeRefreshTokenStrategy: jest.fn(),
    executeFetchUserProfileStrategy: jest.fn(),
  };
});

const mockFrameHandler = jest.spyOn(
  helpers,
  'executeFrameHandlerStrategy',
) as unknown as jest.MockedFunction<
  () => Promise<{
    result: BitbucketServerOAuthResult;
    privateInfo: { refreshToken?: string };
  }>
>;

const passportProfile = {
  id: '123',
  username: 'john.doe',
  provider: 'bitubcketServer',
  displayName: 'John Doe',
  emails: [{ value: 'john@doe.com' }],
  photos: [{ value: 'https://bitbucket.org/user/123/avatar' }],
};

const mockHost = 'bitbucket.org';
const mockBaseUrl = `https://${mockHost}`;

const whoAmIHandler = (options?: { fail?: boolean; value?: string }) =>
  rest.get(
    `${mockBaseUrl}/plugins/servlet/applinks/whoami`,
    (_req, res, ctx) => {
      if (options?.fail) {
        res.networkError('error');
      }
      return res(
        ctx.status(200),
        ctx.set('X-Ausername', options?.value ?? passportProfile.username),
      );
    },
  );

const getUserHandler = (options?: {
  fail?: boolean;
  status?: number;
  avatarUrl?: string;
  noDisplayName?: boolean;
  noUserName?: boolean;
}) =>
  rest.get(
    `${mockBaseUrl}/rest/api/latest/users/${passportProfile.username}`,
    (_req, res, ctx) => {
      if (options?.fail) {
        res.networkError('error');
      }
      return res(
        ctx.status(options?.status ?? 200),
        ctx.json({
          name: options?.noUserName ? undefined : 'john.doe',
          emailAddress: 'john@doe.com',
          id: 123,
          displayName: options?.noDisplayName ? undefined : 'John Doe',
          active: true,
          slug: 'john.doe',
          type: 'NORMAL',
          links: {
            self: [
              {
                href: 'https://bitbucket.org/users/john.doe',
              },
            ],
          },
          avatarUrl: options?.avatarUrl ?? '/user/123/avatar',
        }),
      );
    },
  );

describe('BitbucketServerAuthProvider', () => {
  const provider = new BitbucketServerAuthProvider({
    resolverContext: {
      signInWithCatalogUser: jest.fn(info => {
        return {
          token: `token-for-user:${info.filter['spec.profile.email']}`,
        };
      }),
    } as unknown as AuthResolverContext,
    signInResolver:
      bitbucketServer.resolvers.emailMatchingUserEntityProfileEmail(),
    authHandler: async ({ fullProfile }) => ({
      profile: makeProfileInfo(fullProfile),
    }),
    callbackUrl: 'mock',
    clientId: 'mock',
    clientSecret: 'mock',
    host: mockHost,
    authorizationUrl: 'mock',
    tokenUrl: 'mock',
  });

  describe('when transforming to type OAuthResponse', () => {
    const server = setupServer();
    setupRequestMockHandlers(server);

    it('should map to a valid response', async () => {
      server.use(whoAmIHandler(), getUserHandler());

      const accessToken = '19xasczxcm9n7gacn9jdgm19me';
      const params = { scope: 'REPO_READ' };

      const expected = {
        backstageIdentity: {
          token: 'token-for-user:john@doe.com',
        },
        providerInfo: {
          accessToken: '19xasczxcm9n7gacn9jdgm19me',
          scope: 'REPO_READ',
        },
        profile: {
          email: 'john@doe.com',
          displayName: 'John Doe',
          picture: 'https://bitbucket.org/user/123/avatar',
        },
      };

      mockFrameHandler.mockResolvedValueOnce({
        result: { fullProfile: passportProfile, accessToken, params },
        privateInfo: {},
      });
      const { response } = await provider.handler({} as any);
      expect(response).toEqual(expected);
    });

    it('should throw if whoami fails', async () => {
      server.use(whoAmIHandler({ fail: true }), getUserHandler());

      const accessToken = '19xasczxcm9n7gacn9jdgm19me';
      const params = { scope: 'REPO_READ' };
      mockFrameHandler.mockResolvedValueOnce({
        result: { fullProfile: passportProfile, accessToken, params },
        privateInfo: {},
      });

      await expect(provider.handler({} as any)).rejects.toThrow(
        `Failed to retrieve the username of the logged in user`,
      );
    });

    it('should throw if whoami returns an invalid response', async () => {
      server.use(whoAmIHandler({ value: '' }), getUserHandler());

      const accessToken = '19xasczxcm9n7gacn9jdgm19me';
      const params = { scope: 'REPO_READ' };
      mockFrameHandler.mockResolvedValueOnce({
        result: { fullProfile: passportProfile, accessToken, params },
        privateInfo: {},
      });

      await expect(provider.handler({} as any)).rejects.toThrow(
        `Failed to retrieve the username of the logged in user`,
      );
    });

    it('should throw if get user fails', async () => {
      server.use(whoAmIHandler(), getUserHandler({ fail: true }));
      const accessToken = '19xasczxcm9n7gacn9jdgm19me';
      const params = { scope: 'REPO_READ' };
      mockFrameHandler.mockResolvedValueOnce({
        result: { fullProfile: passportProfile, accessToken, params },
        privateInfo: {},
      });

      await expect(provider.handler({} as any)).rejects.toThrow(
        `Failed to retrieve the user '${passportProfile.username}'`,
      );
    });

    it('should throw if get user is not ok', async () => {
      server.use(whoAmIHandler(), getUserHandler({ status: 500 }));
      const accessToken = '19xasczxcm9n7gacn9jdgm19me';
      const params = { scope: 'REPO_READ' };
      mockFrameHandler.mockResolvedValueOnce({
        result: { fullProfile: passportProfile, accessToken, params },
        privateInfo: {},
      });

      await expect(provider.handler({} as any)).rejects.toThrow(
        `Failed to retrieve the user '${passportProfile.username}'`,
      );
    });

    it('should not set an avatar url if not given', async () => {
      server.use(whoAmIHandler(), getUserHandler({ avatarUrl: '' }));
      const accessToken = '19xasczxcm9n7gacn9jdgm19me';
      const params = { scope: 'REPO_READ' };

      const expected = {
        backstageIdentity: {
          token: 'token-for-user:john@doe.com',
        },
        providerInfo: {
          accessToken: '19xasczxcm9n7gacn9jdgm19me',
          scope: 'REPO_READ',
        },
        profile: {
          email: 'john@doe.com',
          displayName: 'John Doe',
        },
      };

      mockFrameHandler.mockResolvedValueOnce({
        result: { fullProfile: passportProfile, accessToken, params },
        privateInfo: {},
      });
      const { response } = await provider.handler({} as any);
      expect(response).toEqual(expected);
    });

    it('should fallback to the username if no displayName is given', async () => {
      server.use(whoAmIHandler(), getUserHandler({ noDisplayName: true }));

      const accessToken = '19xasczxcm9n7gacn9jdgm19me';
      const params = { scope: 'REPO_READ' };

      const expected = {
        backstageIdentity: {
          token: 'token-for-user:john@doe.com',
        },
        providerInfo: {
          accessToken: '19xasczxcm9n7gacn9jdgm19me',
          scope: 'REPO_READ',
        },
        profile: {
          email: 'john@doe.com',
          displayName: 'john.doe',
          picture: 'https://bitbucket.org/user/123/avatar',
        },
      };

      mockFrameHandler.mockResolvedValueOnce({
        result: { fullProfile: passportProfile, accessToken, params },
        privateInfo: {},
      });
      const { response } = await provider.handler({} as any);
      expect(response).toEqual(expected);
    });

    it('should fallback to the user id if no name is given', async () => {
      server.use(
        whoAmIHandler(),
        getUserHandler({ noDisplayName: true, noUserName: true }),
      );

      const accessToken = '19xasczxcm9n7gacn9jdgm19me';
      const params = { scope: 'REPO_READ' };

      const expected = {
        backstageIdentity: {
          token: 'token-for-user:john@doe.com',
        },
        providerInfo: {
          accessToken: '19xasczxcm9n7gacn9jdgm19me',
          scope: 'REPO_READ',
        },
        profile: {
          email: 'john@doe.com',
          displayName: '123',
          picture: 'https://bitbucket.org/user/123/avatar',
        },
      };

      mockFrameHandler.mockResolvedValueOnce({
        result: { fullProfile: passportProfile, accessToken, params },
        privateInfo: {},
      });
      const { response } = await provider.handler({} as any);
      expect(response).toEqual(expected);
    });
  });

  describe('when authenticating', () => {
    const server = setupServer();
    setupRequestMockHandlers(server);

    it('should forward the refresh token', async () => {
      server.use(whoAmIHandler(), getUserHandler());

      const accessToken = '19xasczxcm9n7gacn9jdgm19me';
      const params = { scope: 'REPO_READ' };
      mockFrameHandler.mockResolvedValueOnce({
        result: { fullProfile: passportProfile, accessToken, params },
        privateInfo: { refreshToken: 'refresh-token' },
      });

      const response = await provider.handler({} as any);

      const expected = {
        response: {
          backstageIdentity: {
            token: 'token-for-user:john@doe.com',
          },
          providerInfo: {
            accessToken: '19xasczxcm9n7gacn9jdgm19me',
            scope: 'REPO_READ',
          },
          profile: {
            email: 'john@doe.com',
            displayName: 'John Doe',
            picture: 'https://bitbucket.org/user/123/avatar',
          },
        },
        refreshToken: 'refresh-token',
      };

      expect(response).toEqual(expected);
    });

    it('should forward a new refresh token on refresh', async () => {
      server.use(whoAmIHandler(), getUserHandler());

      const accessToken = '19xasczxcm9n7gacn9jdgm19me';
      const params = { scope: 'REPO_READ' };
      const mockRefreshToken = jest.spyOn(
        helpers,
        'executeRefreshTokenStrategy',
      ) as unknown as jest.MockedFunction<() => Promise<{}>>;
      mockRefreshToken.mockResolvedValueOnce({
        accessToken,
        refreshToken: 'dont-forget-to-send-refresh',
        params,
      });
      mockFrameHandler.mockResolvedValueOnce({
        result: { fullProfile: passportProfile, accessToken, params },
        privateInfo: { refreshToken: 'refresh-token' },
      });

      const expected = {
        response: {
          backstageIdentity: {
            token: 'token-for-user:john@doe.com',
          },
          providerInfo: {
            accessToken: '19xasczxcm9n7gacn9jdgm19me',
            scope: 'REPO_READ',
          },
          profile: {
            email: 'john@doe.com',
            displayName: 'John Doe',
            picture: 'https://bitbucket.org/user/123/avatar',
          },
        },
        refreshToken: 'dont-forget-to-send-refresh',
      };
      const response = await provider.refresh({ scope: 'REPO_WRITE' } as any);

      expect(response).toEqual(expected);
    });
  });
});
