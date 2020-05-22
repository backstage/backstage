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

import { GoogleAuthProvider } from './provider';
import passport from 'passport';
import express from 'express';
import * as passportGoogleAuth20 from 'passport-google-oauth20';
import * as utils from './../utils';

const googleAuthProviderConfig = {
  provider: 'google',
  options: {
    clientID: 'a',
    clientSecret: 'b',
    callbackURL: 'c',
  },
};

const googleAuthProviderConfigFromEnv = {
  provider: 'google',
  options: {
    clientID: process.env.AUTH_GOOGLE_CLIENT_ID,
    clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    callbackURL: 'c',
  },
};

const googleAuthProviderConfigMissingInEnv = {
  provider: 'google',
  options: {
    clientID: process.env.MISSING_CLIENT_ID,
    clientSecret: process.env.MISSING_CLIENT_SECRET,
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
    const mockResponse: any = ({} as unknown) as express.Response;
    const mockNext: express.NextFunction = jest.fn();

    it('should initiate authenticate request with provided scopes', () => {
      const mockRequest = ({
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
      });
    });

    it('should throw error if no scopes provided', () => {
      const mockRequest = ({
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
    const mockRequest = ({} as unknown) as express.Request;

    it('should perform logout and respond with 200', () => {
      const mockResponse: any = ({
        send: jest.fn(),
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
    });
  });

  describe('redirect frame handler', () => {
    const mockRequest = ({} as unknown) as express.Request;
    const mockResponse: any = ({
      send: jest.fn(),
    } as unknown) as express.Response;
    const mockNext: express.NextFunction = jest.fn();

    it('should call authenticate and post a response ', () => {
      const spyPostMessage = jest
        .spyOn(utils, 'postMessageResponse')
        .mockImplementation(() => jest.fn());

      const spyPassport = jest
        .spyOn(passport, 'authenticate')
        .mockImplementation(() => jest.fn());

      const googleAuthProvider = new GoogleAuthProvider(
        googleAuthProviderConfig,
      );

      googleAuthProvider.frameHandler(mockRequest, mockResponse, mockNext);
      const callbackFunc = spyPassport.mock.calls[0][1] as Function;
      callbackFunc();
      expect(spyPassport).toBeCalledTimes(1);
      expect(spyPostMessage).toBeCalledTimes(1);
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
});
