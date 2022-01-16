/*
 * Copyright 2021 The Backstage Authors
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

jest.mock('jose', () => ({
  JWT: {
    decode: jest.fn(),
  },
}));
jest.mock('@backstage/catalog-client');

import express from 'express';
import { JWT } from 'jose';
import { Logger } from 'winston';
import { TokenIssuer } from '@backstage/plugin-auth-node';
import {
  AuthHandler,
  SignInResolver,
  AuthProviderFactoryOptions,
} from '../types';

import { CatalogIdentityClient } from '../../lib/catalog';

import {
  createOauth2ProxyProvider,
  Oauth2ProxyAuthProvider,
  Oauth2ProxyProviderOptions,
  OAuth2ProxyResult,
  OAUTH2_PROXY_JWT_HEADER,
} from './provider';

describe('Oauth2ProxyAuthProvider', () => {
  const mockToken =
    'eyblob.eyJzdWIiOiJqaW1teW1hcmt1bSIsImVudCI6WyJ1c2VyOmRlZmF1bHQvamltbXltYXJrdW0iXX0=.eyblob';

  let provider: Oauth2ProxyAuthProvider<any>;
  let logger: jest.Mocked<Logger>;
  let signInResolver: jest.MockedFunction<
    SignInResolver<OAuth2ProxyResult<any>>
  >;
  let authHandler: jest.MockedFunction<AuthHandler<OAuth2ProxyResult<any>>>;
  let mockResponse: jest.Mocked<express.Response>;
  let mockRequest: jest.Mocked<express.Request>;
  let JWTMock: jest.Mocked<typeof JWT>;

  beforeEach(() => {
    jest.resetAllMocks();

    JWTMock = JWT as jest.Mocked<typeof JWT>;
    authHandler = jest.fn();
    signInResolver = jest.fn();
    logger = { error: jest.fn() } as unknown as jest.Mocked<Logger>;

    mockResponse = {
      status: jest.fn(),
      end: jest.fn(),
      json: jest.fn(),
    } as unknown as jest.Mocked<express.Response>;

    mockRequest = {
      body: {},
      header: jest.fn(),
    } as unknown as jest.Mocked<express.Request>;

    provider = new Oauth2ProxyAuthProvider<any>({
      authHandler,
      logger,
      signInResolver,
      catalogIdentityClient: {} as CatalogIdentityClient,
      tokenIssuer: {} as TokenIssuer,
    });
  });

  describe('frameHandler()', () => {
    it('should do nothing and return undefined', async () => {
      const result = await provider.frameHandler();

      expect(result).toBeUndefined();
    });
  });

  describe('start()', () => {
    it('should do nothing and return undefined', async () => {
      const result = await provider.start();

      expect(result).toBeUndefined();
    });
  });

  describe('refresh()', () => {
    it('should throw an error when auth header is missing', async () => {
      mockRequest.header.mockReturnValue(undefined);

      await provider.refresh(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('should throw an error if the bearer token is invalid', async () => {
      mockRequest.header.mockReturnValue('Basic asdf=');

      await provider.refresh(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('should return if auth header is set and valid', async () => {
      mockRequest.header.mockReturnValue(`Bearer token`);
      authHandler.mockResolvedValue({
        profile: {},
      });
      signInResolver.mockResolvedValue({
        id: 'some-id',
        token: mockToken,
      });

      await provider.refresh(mockRequest, mockResponse);

      expect(mockRequest.header).toBeCalledWith(OAUTH2_PROXY_JWT_HEADER);
      expect(JWTMock.decode).toHaveBeenCalledWith('token');
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should load profile from authHandler and backstage identity from signInResolver', async () => {
      const decodedToken = {
        oid: 'oid',
        name: 'name',
        upn: 'john.doe@example.com',
      };
      const profile = { displayName: 'some value' };
      mockRequest.header.mockReturnValue(`Bearer token`);
      signInResolver.mockResolvedValue({
        id: 'some-id',
        token: mockToken,
      });
      authHandler.mockResolvedValue({ profile: profile });
      JWTMock.decode.mockReturnValue(decodedToken as any);

      await provider.refresh(mockRequest, mockResponse);

      expect(signInResolver).toHaveBeenCalledWith(
        {
          profile: profile,
          result: {
            accessToken: 'token',
            fullProfile: decodedToken,
          },
        },
        { catalogIdentityClient: {}, logger, tokenIssuer: {} },
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        backstageIdentity: {
          id: 'some-id',
          idToken: mockToken,
          identity: {
            ownershipEntityRefs: ['user:default/jimmymarkum'],
            type: 'user',
            userEntityRef: 'user:default/jimmymarkum',
          },
          token: mockToken,
        },
        profile: { displayName: 'some value' },
        providerInfo: {
          accessToken: 'token',
        },
      });
    });
  });

  describe('createOauth2ProxyProvider()', () => {
    beforeEach(() => {
      mockRequest.header.mockReturnValue(`Bearer token`);
      authHandler.mockResolvedValue({
        profile: {},
      });
      signInResolver.mockResolvedValue({
        id: 'some-id',
        token: mockToken,
      });
    });

    it('should create a valid provider', async () => {
      const providerOptions = {
        authHandler,
        signIn: { resolver: signInResolver },
      } as Oauth2ProxyProviderOptions<any>;
      const factoryOptions = {
        logger,
        catalogApi: {},
        tokenIssuer: {},
      } as unknown as AuthProviderFactoryOptions;

      const factory = createOauth2ProxyProvider(providerOptions);
      const handler = factory(factoryOptions);
      await handler.refresh!(mockRequest, mockResponse);

      expect(mockRequest.header).toBeCalledWith(OAUTH2_PROXY_JWT_HEADER);
      expect(JWTMock.decode).toHaveBeenCalledWith('token');
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });
});
