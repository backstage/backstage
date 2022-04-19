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
  decodeJwt: jest.fn(),
}));
jest.mock('@backstage/catalog-client');

import { AuthenticationError } from '@backstage/errors';
import express from 'express';
import * as jose from 'jose';
import { Logger } from 'winston';
import { AuthHandler, AuthResolverContext, SignInResolver } from '../types';
import {
  createOauth2ProxyProvider,
  Oauth2ProxyAuthProvider,
  OAuth2ProxyResult,
  OAUTH2_PROXY_JWT_HEADER,
} from './provider';

describe('Oauth2ProxyAuthProvider', () => {
  const mockToken =
    'eyblob.eyJzdWIiOiJ1c2VyOmRlZmF1bHQvamltbXltYXJrdW0iLCJlbnQiOlsidXNlcjpkZWZhdWx0L2ppbW15bWFya3VtIl19.eyblob';

  let provider: Oauth2ProxyAuthProvider<any>;
  let logger: jest.Mocked<Logger>;
  let signInResolver: jest.MockedFunction<
    SignInResolver<OAuth2ProxyResult<any>>
  >;
  let authHandler: jest.MockedFunction<AuthHandler<OAuth2ProxyResult<any>>>;
  let mockResponse: jest.Mocked<express.Response>;
  let mockRequest: jest.Mocked<express.Request>;
  let mockJwtDecode: jest.MockedFunction<typeof jose.decodeJwt>;

  beforeEach(() => {
    jest.resetAllMocks();

    mockJwtDecode = jose.decodeJwt as jest.MockedFunction<
      typeof jose.decodeJwt
    >;
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
      signInResolver,
      resolverContext: {
        _: 'resolver-context',
      } as unknown as AuthResolverContext,
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

      await expect(provider.refresh(mockRequest, mockResponse)).rejects.toThrow(
        AuthenticationError,
      );
    });

    it('should throw an error if the bearer token is invalid', async () => {
      mockRequest.header.mockReturnValue('Basic asdf=');

      await expect(provider.refresh(mockRequest, mockResponse)).rejects.toThrow(
        AuthenticationError,
      );
    });

    it('should return if auth header is set and valid', async () => {
      mockRequest.header.mockReturnValue(`Bearer token`);
      authHandler.mockResolvedValue({
        profile: {},
      });
      signInResolver.mockResolvedValue({
        token: mockToken,
      });

      await provider.refresh(mockRequest, mockResponse);

      expect(mockRequest.header).toBeCalledWith(OAUTH2_PROXY_JWT_HEADER);
      expect(mockJwtDecode).toHaveBeenCalledWith('token');
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
        token: mockToken,
      });
      authHandler.mockResolvedValue({ profile: profile });
      mockJwtDecode.mockReturnValue(decodedToken as any);

      await provider.refresh(mockRequest, mockResponse);

      expect(signInResolver).toHaveBeenCalledWith(
        {
          profile: profile,
          result: {
            accessToken: 'token',
            fullProfile: decodedToken,
          },
        },
        { _: 'resolver-context' },
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        backstageIdentity: {
          identity: {
            type: 'user',
            userEntityRef: 'user:default/jimmymarkum',
            ownershipEntityRefs: ['user:default/jimmymarkum'],
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
        token: mockToken,
      });
    });

    it('should create a valid provider', async () => {
      const factory = createOauth2ProxyProvider({
        authHandler,
        signIn: { resolver: signInResolver },
      });
      const handler = factory({
        logger,
        catalogApi: {},
        tokenIssuer: {},
      } as any);
      await handler.refresh!(mockRequest, mockResponse);

      expect(mockRequest.header).toBeCalledWith(OAUTH2_PROXY_JWT_HEADER);
      expect(mockJwtDecode).toHaveBeenCalledWith('token');
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });
});
