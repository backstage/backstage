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
import { makeProfileInfo } from '../../lib/passport/PassportStrategyHelper';
import { AuthResolverContext } from '../types';
import {
  BitbucketServerAuthProvider,
  BitbucketServerOAuthResult,
} from './provider';
import { commonByEmailResolver } from '../resolvers';

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

const mockFetchUserRequests = (
  failOnWhoAmI: boolean = false,
  whoAmIValue: string = passportProfile.username,
  failOnGetUser: boolean = false,
  getUserOk: boolean = true,
  avatarUrl: string = '/user/123/avatar',
  setDisplayName: boolean = true,
  setUserName: boolean = true,
) => {
  const fetchMock = global.fetch as jest.Mock;
  if (failOnWhoAmI) {
    fetchMock.mockRejectedValueOnce(() => {});
  } else {
    fetchMock.mockResolvedValueOnce({
      headers: { get: jest.fn(() => whoAmIValue) },
    });
  }
  if (failOnGetUser) {
    fetchMock.mockRejectedValueOnce(() => {});
  } else {
    fetchMock.mockResolvedValueOnce({
      ok: getUserOk,
      json: () => ({
        name: setUserName ? 'john.doe' : undefined,
        emailAddress: 'john@doe.com',
        id: 123,
        displayName: setDisplayName ? 'John Doe' : undefined,
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
        avatarUrl: avatarUrl,
      }),
    });
  }
};

describe('BitbucketServerAuthProvider', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  const provider = new BitbucketServerAuthProvider({
    resolverContext: {
      signInWithCatalogUser: jest.fn(info => {
        return {
          token: `token-for-user:${info.filter['spec.profile.email']}`,
        };
      }),
    } as unknown as AuthResolverContext,
    signInResolver: commonByEmailResolver,
    authHandler: async ({ fullProfile }) => ({
      profile: makeProfileInfo(fullProfile),
    }),
    callbackUrl: 'mock',
    clientId: 'mock',
    clientSecret: 'mock',
    host: 'bitbucket.org',
    authorizationUrl: 'mock',
    tokenUrl: 'mock',
  });

  describe('when transforming to type OAuthResponse', () => {
    it('should map to a valid response', async () => {
      mockFetchUserRequests();
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
      mockFetchUserRequests(true);
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
      mockFetchUserRequests(false, '');
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
      mockFetchUserRequests(false, passportProfile.username, true);
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
      mockFetchUserRequests(false, passportProfile.username, false, false);
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
      mockFetchUserRequests(false, passportProfile.username, false, true, '');
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
      mockFetchUserRequests(
        false,
        passportProfile.username,
        false,
        true,
        '/user/123/avatar',
        false,
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
      mockFetchUserRequests(
        false,
        passportProfile.username,
        false,
        true,
        '/user/123/avatar',
        false,
        false,
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
    it('should forward the refresh token', async () => {
      mockFetchUserRequests();
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
      mockFetchUserRequests();
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
