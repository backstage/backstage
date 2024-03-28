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

import express from 'express';
import { UnsecuredJWT } from 'jose';
import passport from 'passport';
import { InternalOAuthError } from 'passport-oauth2';
import {
  executeRedirectStrategy,
  executeFrameHandlerStrategy,
  executeRefreshTokenStrategy,
  makeProfileInfo,
} from './PassportStrategyHelper';
import { PassportProfile } from './types';

const mockRequest = {} as unknown as express.Request;

describe('PassportStrategyHelper', () => {
  describe('makeProfileInfo', () => {
    it('retrieves email from passport profile', () => {
      const profile: PassportProfile = {
        emails: [{ value: 'email' }],
        provider: '',
        id: '',
        displayName: '',
      };

      const profileInfo = makeProfileInfo(profile);

      expect(profileInfo.email).toEqual('email');
    });

    it('retrieves picture from passport profile avatarUrl', () => {
      const profile: PassportProfile = {
        avatarUrl: 'avatarUrl',
        provider: '',
        id: '',
        displayName: '',
      };

      const profileInfo = makeProfileInfo(profile);

      expect(profileInfo.picture).toEqual('avatarUrl');
    });

    it('falls back to picture from passport profile photos field', () => {
      const profile: PassportProfile = {
        photos: [{ value: 'picture' }],
        provider: '',
        id: '',
        displayName: '',
      };

      const profileInfo = makeProfileInfo(profile);

      expect(profileInfo.picture).toEqual('picture');
    });

    it('falls back to email from ID token', async () => {
      const profile: PassportProfile = {
        provider: '',
        id: '',
        displayName: '',
      };

      const profileInfo = makeProfileInfo(
        profile,
        await new UnsecuredJWT({ email: 'email' }).encode(),
      );

      expect(profileInfo.email).toEqual('email');
    });

    it('falls back to picture from ID token', async () => {
      const profile: PassportProfile = {
        provider: '',
        id: '',
        displayName: '',
      };

      const profileInfo = makeProfileInfo(
        profile,
        await new UnsecuredJWT({ picture: 'picture' }).encode(),
      );

      expect(profileInfo.picture).toEqual('picture');
    });

    it('falls back to name from ID token', async () => {
      const profile: PassportProfile = {
        provider: '',
        id: '',
        displayName: '',
      };

      const profileInfo = makeProfileInfo(
        profile,
        await new UnsecuredJWT({ name: 'name' }).encode(),
      );

      expect(profileInfo.displayName).toEqual('name');
    });

    it('fails when attempting to fall back to invalid JWT', () => {
      const profile: PassportProfile = {
        provider: '',
        id: '',
        displayName: '',
      };

      expect(() => makeProfileInfo(profile, 'invalid JWT')).toThrow(
        'Failed to parse id token and get profile info',
      );
    });
  });

  class MyCustomRedirectStrategy extends passport.Strategy {
    authenticate() {
      this.redirect('a', 302);
    }
  }

  describe('executeRedirectStrategy', () => {
    it('should call authenticate and resolve with OAuthStartResponse', async () => {
      const mockStrategy = new MyCustomRedirectStrategy();
      const spyAuthenticate = jest.spyOn(mockStrategy, 'authenticate');
      const redirectStrategyPromise = executeRedirectStrategy(
        mockRequest,
        mockStrategy,
        {},
      );
      expect(spyAuthenticate).toHaveBeenCalledTimes(1);
      await expect(redirectStrategyPromise).resolves.toStrictEqual(
        expect.objectContaining({ url: 'a', status: 302 }),
      );
    });
  });

  describe('executeFrameHandlerStrategy', () => {
    class MyCustomAuthSuccessStrategy extends passport.Strategy {
      authenticate() {
        this.success(
          { accessToken: 'ACCESS_TOKEN' },
          { refreshToken: 'REFRESH_TOKEN' },
        );
      }
    }
    class MyCustomAuthErrorStrategy extends passport.Strategy {
      authenticate() {
        this.error(
          new InternalOAuthError('MyCustomAuth error', {
            data: '{ "message": "Custom message" }',
          }),
        );
      }
    }
    class MyCustomAuthRedirectStrategy extends passport.Strategy {
      authenticate() {
        this.redirect('URL', 302);
      }
    }
    class MyCustomAuthFailStrategy extends passport.Strategy {
      authenticate() {
        this.fail('challenge', 302);
      }
    }

    it('should resolve with user and info on success', async () => {
      const mockStrategy = new MyCustomAuthSuccessStrategy();
      const spyAuthenticate = jest.spyOn(mockStrategy, 'authenticate');
      const frameHandlerStrategyPromise = executeFrameHandlerStrategy(
        mockRequest,
        mockStrategy,
      );
      expect(spyAuthenticate).toHaveBeenCalledTimes(1);
      await expect(frameHandlerStrategyPromise).resolves.toStrictEqual(
        expect.objectContaining({
          result: { accessToken: 'ACCESS_TOKEN' },
          privateInfo: { refreshToken: 'REFRESH_TOKEN' },
        }),
      );
    });

    it('should reject on error', async () => {
      const mockStrategy = new MyCustomAuthErrorStrategy();
      const spyAuthenticate = jest.spyOn(mockStrategy, 'authenticate');
      const frameHandlerStrategyPromise = executeFrameHandlerStrategy(
        mockRequest,
        mockStrategy,
      );
      expect(spyAuthenticate).toHaveBeenCalledTimes(1);
      await expect(frameHandlerStrategyPromise).rejects.toThrow(
        'Authentication failed, MyCustomAuth error - Custom message',
      );
    });

    it('should reject on redirect', async () => {
      const mockStrategy = new MyCustomAuthRedirectStrategy();
      const spyAuthenticate = jest.spyOn(mockStrategy, 'authenticate');
      const frameHandlerStrategyPromise = executeFrameHandlerStrategy(
        mockRequest,
        mockStrategy,
      );
      expect(spyAuthenticate).toHaveBeenCalledTimes(1);
      await expect(frameHandlerStrategyPromise).rejects.toThrow(
        'Unexpected redirect',
      );
    });

    it('should reject on fail', async () => {
      const mockStrategy = new MyCustomAuthFailStrategy();
      const spyAuthenticate = jest.spyOn(mockStrategy, 'authenticate');
      const frameHandlerStrategyPromise = executeFrameHandlerStrategy(
        mockRequest,
        mockStrategy,
      );
      expect(spyAuthenticate).toHaveBeenCalledTimes(1);
      await expect(frameHandlerStrategyPromise).rejects.toThrow();
    });
  });

  describe('executeRefreshTokenStrategy', () => {
    it('should resolve with a new access token, scope and expiry', async () => {
      class MyCustomOAuth2Success {
        getOAuthAccessToken(
          _refreshToken: string,
          _options: any,
          callback: Function,
        ) {
          callback(null, 'ACCESS_TOKEN', 'REFRESH_TOKEN', {
            scope: 'a',
            expires_in: 10,
          });
        }
      }
      class MyCustomRefreshTokenSuccess extends passport.Strategy {
        _oauth2 = new MyCustomOAuth2Success();
        userProfile(_accessToken: string, callback: Function) {
          callback(null, {
            provider: 'a',
            email: 'b',
            name: 'c',
            picture: 'd',
          });
        }
      }

      const mockStrategy = new MyCustomRefreshTokenSuccess();
      const refreshTokenPromise = executeRefreshTokenStrategy(
        mockStrategy,
        'REFRESH_TOKEN',
        'a',
      );
      await expect(refreshTokenPromise).resolves.toStrictEqual(
        expect.objectContaining({
          accessToken: 'ACCESS_TOKEN',
          params: expect.objectContaining({ scope: 'a', expires_in: 10 }),
        }),
      );
    });

    it('should reject with an error if refresh failed', async () => {
      class MyCustomOAuth2Error {
        getOAuthAccessToken(
          _refreshToken: string,
          _options: any,
          callback: Function,
        ) {
          callback(new Error('Unknown error'));
        }
      }
      class MyCustomRefreshTokenSuccess extends passport.Strategy {
        _oauth2 = new MyCustomOAuth2Error();
      }

      const mockStrategy = new MyCustomRefreshTokenSuccess();
      const refreshTokenPromise = executeRefreshTokenStrategy(
        mockStrategy,
        'REFRESH_TOKEN',
        'a',
      );
      await expect(refreshTokenPromise).rejects.toThrow(
        'Failed to refresh access token Error: Unknown error',
      );
    });

    it('should reject with an error if access token missing in refresh callback', async () => {
      class MyCustomOAuth2AccessTokenMissing {
        getOAuthAccessToken(
          _refreshToken: string,
          _options: any,
          callback: Function,
        ) {
          callback(null, '');
        }
      }
      class MyCustomRefreshTokenSuccess extends passport.Strategy {
        _oauth2 = new MyCustomOAuth2AccessTokenMissing();
      }

      const mockStrategy = new MyCustomRefreshTokenSuccess();
      const refreshTokenPromise = executeRefreshTokenStrategy(
        mockStrategy,
        'REFRESH_TOKEN',
        'a',
      );
      await expect(refreshTokenPromise).rejects.toThrow(
        'Failed to refresh access token, no access token received',
      );
    });
  });
});
