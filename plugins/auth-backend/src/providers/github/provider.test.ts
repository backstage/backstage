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

import { Profile as PassportProfile } from 'passport';
import { GithubAuthProvider, GithubOAuthResult, github } from './provider';
import * as helpers from '../../lib/passport/PassportStrategyHelper';
import { makeProfileInfo } from '../../lib/passport/PassportStrategyHelper';
import { OAuthStartRequest, encodeState } from '../../lib/oauth';
import { AuthResolverContext } from '../types';

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
    result: GithubOAuthResult;
    privateInfo: { refreshToken?: string };
  }>
>;

describe('GithubAuthProvider', () => {
  const provider = new GithubAuthProvider({
    resolverContext: {
      signInWithCatalogUser: jest.fn(({ entityRef }) => ({
        token: `token-for-user:${entityRef.name}`,
      })),
    } as unknown as AuthResolverContext,
    signInResolver: github.resolvers.usernameMatchingUserEntityName(),
    authHandler: async ({ fullProfile }) => ({
      profile: makeProfileInfo(fullProfile),
    }),
    stateEncoder: async (req: OAuthStartRequest) => ({
      encodedState: encodeState(req.state),
    }),
    callbackUrl: 'mock',
    clientId: 'mock',
    clientSecret: 'mock',
  });

  describe('should transform to type OAuthResponse', () => {
    it('when all fields are present, it should be able to map them', async () => {
      const accessToken = '19xasczxcm9n7gacn9jdgm19me';
      const fullProfile = {
        id: 'uid-123',
        username: 'jimmymarkum',
        provider: 'github',
        displayName: 'Jimmy Markum',
        emails: [
          {
            value: 'jimmymarkum@gmail.com',
          },
        ],
        photos: [
          {
            value:
              'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters_opt/p-mystic-river-sean-penn.jpg',
          },
        ],
      };

      const params = {
        scope: 'read:scope',
      };

      const expected = {
        backstageIdentity: {
          token: 'token-for-user:jimmymarkum',
        },
        providerInfo: {
          accessToken: '19xasczxcm9n7gacn9jdgm19me',
          scope: 'read:scope',
          expiresInSeconds: 3600,
        },
        profile: {
          email: 'jimmymarkum@gmail.com',
          displayName: 'Jimmy Markum',
          picture:
            'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters_opt/p-mystic-river-sean-penn.jpg',
        },
      };

      mockFrameHandler.mockResolvedValueOnce({
        result: { fullProfile, accessToken, params },
        privateInfo: {},
      });
      const { response } = await provider.handler({} as any);
      expect(response).toEqual(expected);
    });

    it('when "email" is missing, it should be able to create the profile without it', async () => {
      const accessToken = '19xasczxcm9n7gacn9jdgm19me';
      const fullProfile = {
        id: 'uid-123',
        username: 'jimmymarkum',
        provider: 'github',
        displayName: 'Jimmy Markum',
        emails: null,
        photos: [
          {
            value:
              'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters_opt/p-mystic-river-sean-penn.jpg',
          },
        ],
      } as unknown as PassportProfile;

      const params = {
        scope: 'read:scope',
      };

      const expected = {
        backstageIdentity: {
          token: 'token-for-user:jimmymarkum',
        },
        providerInfo: {
          accessToken: '19xasczxcm9n7gacn9jdgm19me',
          scope: 'read:scope',
          expiresInSeconds: 3600,
        },
        profile: {
          displayName: 'Jimmy Markum',
          picture:
            'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters_opt/p-mystic-river-sean-penn.jpg',
        },
      };

      mockFrameHandler.mockResolvedValueOnce({
        result: { fullProfile, accessToken, params },
        privateInfo: {},
      });
      const { response } = await provider.handler({} as any);
      expect(response).toEqual(expected);
    });

    it('when "displayName" is missing, it should be able to create the profile and map "displayName" with "username"', async () => {
      const accessToken = '19xasczxcm9n7gacn9jdgm19me';
      const fullProfile = {
        id: 'uid-123',
        username: 'jimmymarkum',
        provider: 'github',
        displayName: null,
        emails: null,
        photos: [
          {
            value:
              'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters_opt/p-mystic-river-sean-penn.jpg',
          },
        ],
      } as unknown as PassportProfile;

      const params = {
        scope: 'read:scope',
      };
      const expected = {
        backstageIdentity: {
          token: 'token-for-user:jimmymarkum',
        },
        providerInfo: {
          accessToken: '19xasczxcm9n7gacn9jdgm19me',
          scope: 'read:scope',
          expiresInSeconds: 3600,
        },
        profile: {
          displayName: 'jimmymarkum',
          picture:
            'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters_opt/p-mystic-river-sean-penn.jpg',
        },
      };

      mockFrameHandler.mockResolvedValueOnce({
        result: { fullProfile, accessToken, params },
        privateInfo: {},
      });
      const { response } = await provider.handler({} as any);
      expect(response).toEqual(expected);
    });

    it('when "photos" is missing, it should be able to create the profile without it', async () => {
      const accessToken =
        'ajakljsdoiahoawxbrouawucmbawe.awkxjemaneasdxwe.sodijxqeqwexeqwxe';
      const fullProfile = {
        id: 'ipd12039',
        username: 'daveboyle',
        provider: 'github',
        displayName: 'Dave Boyle',
        emails: [
          {
            value: 'daveboyle@github.org',
          },
        ],
      };

      const params = {
        scope: 'read:user',
      };

      const expected = {
        backstageIdentity: {
          token: 'token-for-user:daveboyle',
        },
        providerInfo: {
          accessToken:
            'ajakljsdoiahoawxbrouawucmbawe.awkxjemaneasdxwe.sodijxqeqwexeqwxe',
          scope: 'read:user',
          expiresInSeconds: 3600,
        },
        profile: {
          displayName: 'Dave Boyle',
          email: 'daveboyle@github.org',
        },
      };

      mockFrameHandler.mockResolvedValueOnce({
        result: { fullProfile, accessToken, params },
        privateInfo: {},
      });
      const { response } = await provider.handler({} as any);
      expect(response).toEqual(expected);
    });

    it('should forward a refresh token', async () => {
      mockFrameHandler.mockResolvedValueOnce({
        result: {
          fullProfile: {
            id: 'ipd12039',
            username: 'daveboyle',
            provider: 'github',
            displayName: 'Dave Boyle',
          },
          accessToken: 'a.b.c',
          params: {
            scope: 'read:user',
            expires_in: '123',
          },
        },
        privateInfo: { refreshToken: 'refresh-me' },
      });

      const response = await provider.handler({} as any);

      expect(response).toEqual({
        response: {
          backstageIdentity: {
            token: 'token-for-user:daveboyle',
          },
          providerInfo: {
            accessToken: 'a.b.c',
            scope: 'read:user',
            expiresInSeconds: 123,
          },
          profile: {
            displayName: 'Dave Boyle',
          },
        },
        refreshToken: 'refresh-me',
      });
    });

    it('should fail if username is not available', async () => {
      mockFrameHandler.mockResolvedValueOnce({
        result: {
          fullProfile: {
            id: 'ipd12039',
            provider: 'github',
            displayName: 'Dave Boyle',
          },
          accessToken: 'a.b.c',
          params: {
            scope: 'read:user',
            expires_in: '123',
          },
        },
        privateInfo: { refreshToken: 'refresh-me' },
      });

      await expect(provider.handler({} as any)).rejects.toThrow(
        'GitHub user profile does not contain a username',
      );
    });

    it('should forward a new refresh token on refresh', async () => {
      const mockRefreshToken = jest.spyOn(
        helpers,
        'executeRefreshTokenStrategy',
      ) as unknown as jest.MockedFunction<() => Promise<{}>>;

      mockRefreshToken.mockResolvedValueOnce({
        accessToken: 'a.b.c',
        refreshToken: 'dont-forget-to-send-refresh',
        params: {
          id_token: 'my-id',
          expires_in: '123',
          scope: 'read_user',
        },
      });

      const mockUserProfile = jest.spyOn(
        helpers,
        'executeFetchUserProfileStrategy',
      ) as unknown as jest.MockedFunction<() => Promise<PassportProfile>>;

      mockUserProfile.mockResolvedValueOnce({
        id: 'mockid',
        username: 'mockuser',
        provider: 'github',
        displayName: 'Mocked User',
        emails: [
          {
            value: 'mockuser@gmail.com',
          },
        ],
      });

      const result = await provider.refresh({ scope: 'actual-scope' } as any);

      expect(result).toEqual({
        response: {
          backstageIdentity: {
            token: 'token-for-user:mockuser',
          },
          profile: {
            displayName: 'Mocked User',
            email: 'mockuser@gmail.com',
            picture: undefined,
          },
          providerInfo: {
            accessToken: 'a.b.c',
            expiresInSeconds: 123,
            scope: 'actual-scope',
          },
        },
        refreshToken: 'dont-forget-to-send-refresh',
      });

      mockRefreshToken.mockRestore();
      mockUserProfile.mockRestore();
    });

    it('should use access token as refresh token', async () => {
      const mockUserProfile = jest.spyOn(
        helpers,
        'executeFetchUserProfileStrategy',
      ) as unknown as jest.MockedFunction<() => Promise<PassportProfile>>;

      mockUserProfile.mockResolvedValueOnce({
        id: 'mockid',
        username: 'mockuser',
        provider: 'github',
        displayName: 'Mocked User',
        emails: [
          {
            value: 'mockuser@gmail.com',
          },
        ],
      });

      const result = await provider.refresh({
        refreshToken: 'access-token.le-token',
        scope: 'the-scope',
      } as any);

      expect(mockUserProfile).toHaveBeenCalledTimes(1);
      expect(mockUserProfile).toHaveBeenCalledWith(
        expect.anything(),
        'le-token',
      );
      expect(result).toEqual({
        response: {
          backstageIdentity: {
            token: 'token-for-user:mockuser',
          },
          profile: {
            displayName: 'Mocked User',
            email: 'mockuser@gmail.com',
            picture: undefined,
          },
          providerInfo: {
            accessToken: 'le-token',
            expiresInSeconds: 3600,
            scope: 'the-scope',
          },
        },
        refreshToken: 'access-token.le-token',
      });

      mockUserProfile.mockRestore();
    });
  });
});
