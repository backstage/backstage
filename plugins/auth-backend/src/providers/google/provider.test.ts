/*
 * Copyright 2020 Spotify AB
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
  GoogleAuthProvider,
  THOUSAND_DAYS_MS,
  TEN_MINUTES_MS,
} from './provider';
import passport from 'passport';
import express from 'express';
import * as utils from './../utils';
import refresh from 'passport-oauth2-refresh';

const googleAuthProviderConfig = {
  provider: 'google',
  options: {
    clientID: 'a',
    clientSecret: 'b',
    callbackURL: 'c',
  },
};

const googleAuthProviderConfigInvalidOptions = {
  provider: 'google',
  options: {},
};

describe('GoogleAuthProvider', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('create a new provider', () => {
    it('should succeed with valid config', () => {
      const googleAuthProvider = new GoogleAuthProvider(
        googleAuthProviderConfig,
      );
      expect(googleAuthProvider).toBeDefined();
      expect(googleAuthProvider.start).toBeDefined();
      expect(googleAuthProvider.logout).toBeDefined();
      expect(googleAuthProvider.frameHandler).toBeDefined();
      expect(googleAuthProvider.strategy).toBeDefined();
    });
  });

  describe('start authentication handler', () => {
    const mockResponse = ({
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    } as unknown) as express.Response;
    const mockNext: express.NextFunction = jest.fn();

    it('should initiate authenticate request with provided scopes', () => {
      const mockRequest = ({
        header: () => 'XMLHttpRequest',
        query: {
          scope: 'a,b',
        },
      } as unknown) as express.Request;

      const spyPassport = jest
        .spyOn(passport, 'authenticate')
        .mockImplementation(() => jest.fn());

      const googleAuthProvider = new GoogleAuthProvider(
        googleAuthProviderConfig,
      );
      googleAuthProvider.start(mockRequest, mockResponse, mockNext);
      expect(spyPassport).toBeCalledTimes(1);
      expect(spyPassport).toBeCalledWith('google', {
        scope: 'a,b',
        accessType: 'offline',
        prompt: 'consent',
        state: expect.any(String),
      });
    });

    it('should set a nonce cookie', () => {
      const mockRequest = ({
        header: () => 'XMLHttpRequest',
        query: {
          scope: 'a,b',
        },
      } as unknown) as express.Request;

      const googleAuthProvider = new GoogleAuthProvider(
        googleAuthProviderConfig,
      );
      googleAuthProvider.start(mockRequest, mockResponse, mockNext);
      expect(mockResponse.cookie).toBeCalledTimes(1);
      expect(mockResponse.cookie).toBeCalledWith(
        'google-nonce',
        expect.any(String),
        expect.objectContaining({
          maxAge: TEN_MINUTES_MS,
          path: `/auth/${googleAuthProviderConfig.provider}/handler`,
        }),
      );
    });

    it('should throw error if no scopes provided', () => {
      const mockRequest = ({
        header: () => 'XMLHttpRequest',
        query: {},
      } as unknown) as express.Request;

      const googleAuthProvider = new GoogleAuthProvider(
        googleAuthProviderConfig,
      );
      expect(() => {
        googleAuthProvider.start(mockRequest, mockResponse, mockNext);
      }).toThrowError('missing scope parameter');
    });
  });

  describe('logout handler', () => {
    const mockRequest = ({
      header: () => 'XMLHttpRequest',
    } as unknown) as express.Request;

    it('should perform logout and respond with 200', () => {
      const mockResponse: any = ({
        send: jest.fn(),
        cookie: jest.fn(),
      } as unknown) as express.Response;

      const googleAuthProvider = new GoogleAuthProvider(
        googleAuthProviderConfig,
      );

      const spyResponse = jest
        .spyOn(mockResponse, 'send')
        .mockImplementation(() => jest.fn());

      googleAuthProvider.logout(mockRequest, mockResponse);
      expect(spyResponse).toBeCalledTimes(1);
      expect(spyResponse).toBeCalledWith('logout!');
      expect(mockResponse.cookie).toBeCalledTimes(1);
      expect(mockResponse.cookie).toBeCalledWith(
        'google-refresh-token',
        '',
        expect.objectContaining({ maxAge: 0 }),
      );
    });
  });

  describe('redirect frame handler', () => {
    const mockResponse: any = ({
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    } as unknown) as express.Response;
    const mockNext: express.NextFunction = jest.fn();

    it('should call authenticate and post a response', () => {
      const mockRequest = ({
        header: () => 'XMLHttpRequest',
        cookies: { 'google-nonce': 'NONCE' },
        query: {
          state: 'NONCE',
        },
      } as unknown) as express.Request;

      const spyPostMessage = jest
        .spyOn(utils, 'postMessageResponse')
        .mockImplementation(() => jest.fn());

      const spyPassport = jest
        .spyOn(passport, 'authenticate')
        .mockImplementation((_x, callbackFunc) => {
          const cb = callbackFunc as Function;
          cb(null, { refreshToken: 'REFRESH_TOKEN' });
          return jest.fn();
        });

      const googleAuthProvider = new GoogleAuthProvider(
        googleAuthProviderConfig,
      );

      googleAuthProvider.frameHandler(mockRequest, mockResponse, mockNext);
      expect(spyPassport).toBeCalledTimes(1);
      expect(spyPostMessage).toBeCalledTimes(1);
      expect(mockResponse.cookie).toBeCalledTimes(1);
      expect(mockResponse.cookie).toBeCalledWith(
        'google-refresh-token',
        'REFRESH_TOKEN',
        expect.objectContaining({
          path: '/auth/google',
          sameSite: 'none',
          httpOnly: true,
          maxAge: THOUSAND_DAYS_MS,
        }),
      );
    });

    it('should respond with a error message if no refresh token returned', () => {
      const mockRequest = ({
        header: () => 'XMLHttpRequest',
        cookies: { 'google-nonce': 'NONCE' },
        query: {
          state: 'NONCE',
        },
      } as unknown) as express.Request;

      const spyPassport = jest
        .spyOn(passport, 'authenticate')
        .mockImplementation((_x, callbackFunc) => {
          const cb = callbackFunc as Function;
          cb(null, {});
          return jest.fn();
        });

      const spyPostMessage = jest
        .spyOn(utils, 'postMessageResponse')
        .mockImplementation(() => jest.fn());

      const googleAuthProvider = new GoogleAuthProvider(
        googleAuthProviderConfig,
      );

      googleAuthProvider.frameHandler(mockRequest, mockResponse, mockNext);
      expect(spyPassport).toBeCalledTimes(1);
      expect(spyPostMessage).toBeCalledTimes(1);
      expect(spyPostMessage).toBeCalledWith(mockResponse, {
        type: 'auth-result',
        error: new Error('Missing refresh token'),
      });
    });

    it('should respond with a error message if auth failed', () => {
      const mockRequest = ({
        header: () => 'XMLHttpRequest',
        cookies: { 'google-nonce': 'NONCE' },
        query: {
          state: 'NONCE',
        },
      } as unknown) as express.Request;

      const spyPassport = jest
        .spyOn(passport, 'authenticate')
        .mockImplementation((_x, callbackFunc) => {
          const cb = callbackFunc as Function;
          cb(new Error('TokenError'), null);
          return jest.fn();
        });

      const spyPostMessage = jest
        .spyOn(utils, 'postMessageResponse')
        .mockImplementation(() => jest.fn());

      const googleAuthProvider = new GoogleAuthProvider(
        googleAuthProviderConfig,
      );

      googleAuthProvider.frameHandler(mockRequest, mockResponse, mockNext);
      expect(spyPassport).toBeCalledTimes(1);
      expect(spyPostMessage).toBeCalledTimes(1);
      expect(spyPostMessage).toBeCalledWith(mockResponse, {
        type: 'auth-result',
        error: new Error('Google auth failed, Error: TokenError'),
      });
    });

    it('should respond with a error message if cookie nonce is missing', () => {
      const mockRequest = ({
        header: () => 'XMLHttpRequest',
        cookies: {},
        query: { state: 'NONCE' },
      } as unknown) as express.Request;

      const googleAuthProvider = new GoogleAuthProvider(
        googleAuthProviderConfig,
      );

      googleAuthProvider.frameHandler(mockRequest, mockResponse, mockNext);
      expect(mockResponse.send).toBeCalledTimes(1);
      expect(mockResponse.send).toBeCalledWith('Missing nonce');
      expect(mockResponse.status).toBeCalledTimes(1);
      expect(mockResponse.status).toBeCalledWith(401);
    });

    it('should respond with a error message if state nonce is missing', () => {
      const mockRequest = ({
        header: () => 'XMLHttpRequest',
        cookies: { 'google-nonce': 'NONCE' },
        query: {},
      } as unknown) as express.Request;

      const googleAuthProvider = new GoogleAuthProvider(
        googleAuthProviderConfig,
      );

      googleAuthProvider.frameHandler(mockRequest, mockResponse, mockNext);
      expect(mockResponse.send).toBeCalledTimes(1);
      expect(mockResponse.send).toBeCalledWith('Missing nonce');
      expect(mockResponse.status).toBeCalledTimes(1);
      expect(mockResponse.status).toBeCalledWith(401);
    });

    it('should respond with a error message if nonce mismatch', () => {
      const mockRequest = ({
        header: () => 'XMLHttpRequest',
        cookies: { 'google-nonce': 'NONCA' },
        query: { state: 'NONCEB' },
      } as unknown) as express.Request;

      const googleAuthProvider = new GoogleAuthProvider(
        googleAuthProviderConfig,
      );

      googleAuthProvider.frameHandler(mockRequest, mockResponse, mockNext);
      expect(mockResponse.send).toBeCalledTimes(1);
      expect(mockResponse.send).toBeCalledWith('Invalid nonce');
      expect(mockResponse.status).toBeCalledTimes(1);
      expect(mockResponse.status).toBeCalledWith(401);
    });
  });

  describe('strategy handler', () => {
    it('should return a valid passport strategy', () => {
      const googleAuthProvider = new GoogleAuthProvider(
        googleAuthProviderConfig,
      );

      expect(googleAuthProvider.strategy()).toBeInstanceOf(passport.Strategy);
    });

    it('should throw an error for invalid options', () => {
      expect(() => {
        const googleAuthProvider = new GoogleAuthProvider(
          googleAuthProviderConfigInvalidOptions,
        );
        googleAuthProvider.strategy();
      }).toThrow();
    });
  });

  describe('refresh token handler', () => {
    const mockResponse = ({
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown) as express.Response;

    describe('no refresh token cookie', () => {
      it('should respond with a 401', () => {
        const mockRequest = ({
          cookies: jest.fn(),
          header: () => 'XMLHttpRequest',
        } as unknown) as express.Request;

        const googleAuthProvider = new GoogleAuthProvider(
          googleAuthProviderConfig,
        );

        googleAuthProvider.refresh(mockRequest, mockResponse);
        expect(mockResponse.send).toBeCalledTimes(1);
        expect(mockResponse.send).toBeCalledWith('Missing session cookie');

        expect(mockResponse.status).toBeCalledTimes(1);
        expect(mockResponse.status).toBeCalledWith(401);
      });
    });

    describe('refresh token cookie, no scope', () => {
      const mockRequest = ({
        header: () => 'XMLHttpRequest',
        cookies: { 'google-refresh-token': 'REFRESH_TOKEN' },
        query: {},
      } as unknown) as express.Request;

      const googleAuthProvider = new GoogleAuthProvider(
        googleAuthProviderConfig,
      );

      it('should request for a new access token and fail if no access token returned', () => {
        const spyRefresh = jest
          .spyOn(refresh, 'requestNewAccessToken')
          .mockImplementation((_x, _y, _z, callbackFunc) => {
            const cb = callbackFunc as Function;
            cb(undefined, undefined, undefined, {});
          });

        googleAuthProvider.refresh(mockRequest, mockResponse);
        expect(spyRefresh).toBeCalledTimes(1);
        expect(spyRefresh).toBeCalledWith(
          'google',
          'REFRESH_TOKEN',
          {},
          expect.any(Function),
        );
        expect(mockResponse.status).toBeCalledTimes(1);
        expect(mockResponse.status).toBeCalledWith(401);
        expect(mockResponse.send).toBeCalledTimes(1);
        expect(mockResponse.send).toBeCalledWith(
          'Failed to refresh access token',
        );
      });

      it('should request for a new access token and return 401 if any error', () => {
        const spyRefresh = jest
          .spyOn(refresh, 'requestNewAccessToken')
          .mockImplementation((_x, _y, _z, callbackFunc) => {
            const cb = callbackFunc as Function;
            cb({ error: 'ERROR' }, undefined, undefined, {});
          });

        googleAuthProvider.refresh(mockRequest, mockResponse);
        expect(spyRefresh).toBeCalledTimes(1);
        expect(spyRefresh).toBeCalledWith(
          'google',
          'REFRESH_TOKEN',
          {},
          expect.any(Function),
        );
        expect(mockResponse.status).toBeCalledTimes(1);
        expect(mockResponse.status).toBeCalledWith(401);
        expect(mockResponse.send).toBeCalledTimes(1);
        expect(mockResponse.send).toBeCalledWith(
          'Failed to refresh access token',
        );
      });

      it('should fetch and return a new access token', () => {
        const spyRefresh = jest
          .spyOn(refresh, 'requestNewAccessToken')
          .mockImplementation((_x, _y, _z, callbackFunc) => {
            const cb = callbackFunc as Function;
            cb(undefined, 'ACCESS_TOKEN', undefined, {
              expires_in: 'EXPIRES_IN',
              id_token: 'ID_TOKEN',
            });
          });

        googleAuthProvider.refresh(mockRequest, mockResponse);
        expect(spyRefresh).toBeCalledTimes(1);
        expect(spyRefresh).toBeCalledWith(
          'google',
          'REFRESH_TOKEN',
          {},
          expect.any(Function),
        );
        expect(mockResponse.send).toBeCalledTimes(1);
        expect(mockResponse.send).toBeCalledWith({
          accessToken: 'ACCESS_TOKEN',
          idToken: 'ID_TOKEN',
          expiresInSeconds: 'EXPIRES_IN',
          scope: undefined,
        });
      });
    });

    describe('refresh token cookie and scope', () => {
      const mockRequest = ({
        header: () => 'XMLHttpRequest',
        cookies: { 'google-refresh-token': 'REFRESH_TOKEN' },
        query: {
          scope: 'a,b',
        },
      } as unknown) as express.Request;

      const googleAuthProvider = new GoogleAuthProvider(
        googleAuthProviderConfig,
      );

      it('should fetch and return a new access token with scopes', () => {
        const spyRefresh = jest
          .spyOn(refresh, 'requestNewAccessToken')
          .mockImplementation((_x, _y, _z, callbackFunc) => {
            const cb = callbackFunc as Function;
            cb(undefined, 'ACCESS_TOKEN', undefined, {
              expires_in: 'EXPIRES_IN',
              id_token: 'ID_TOKEN',
              scope: 'a,b',
            });
          });

        googleAuthProvider.refresh(mockRequest, mockResponse);
        expect(spyRefresh).toBeCalledTimes(1);
        expect(spyRefresh).toBeCalledWith(
          'google',
          'REFRESH_TOKEN',
          { scope: 'a,b' },
          expect.any(Function),
        );
        expect(mockResponse.send).toBeCalledTimes(1);
        expect(mockResponse.send).toBeCalledWith({
          accessToken: 'ACCESS_TOKEN',
          idToken: 'ID_TOKEN',
          expiresInSeconds: 'EXPIRES_IN',
          scope: 'a,b',
        });
      });

      it('ensures x-requested-with header', () => {
        const mockHeaderRequest = ({
          header: () => 'TEST',
        } as unknown) as express.Request;

        googleAuthProvider.refresh(mockHeaderRequest, mockResponse);
        expect(mockResponse.send).toBeCalledTimes(1);
        expect(mockResponse.send).toBeCalledWith(
          'Invalid X-Requested-With header',
        );
        expect(mockResponse.status).toBeCalledTimes(1);
        expect(mockResponse.status).toBeCalledWith(401);
      });
    });
  });
});
