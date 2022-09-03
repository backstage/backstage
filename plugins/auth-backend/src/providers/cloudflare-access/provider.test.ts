/*
 * Copyright 2022 The Backstage Authors
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
import { jwtVerify } from 'jose';
import {
  CF_JWT_HEADER,
  CF_AUTH_IDENTITY,
  CloudflareAccessAuthProvider,
} from './provider';
import { AuthResolverContext } from '../types';
import fetch from 'node-fetch';

const jwtMock = jwtVerify as jest.Mocked<any>;
const mockJwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IktFWV9JRCIsImlzcyI6IklTU1VFUl9VUkwifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlVzZXIgTmFtZSIsImlhdCI6MTUxNjIzOTAyMn0.uMCSBGhij1xn5pnot8XgD-huQuTIBOFGs6kkW_p_X94';
const mockClaims = {
  sub: '1234567890',
  email: 'user.name@email.test',
  iat: 1632833760,
  exp: 1632833763,
  iss: 'ISSUER_URL',
};
const mockCfIdentity = {
  name: 'foo',
  id: '123',
  email: 'foo@bar.com',
  groups: [
    {
      id: '123',
      email: 'foo@bar.com',
      name: 'foo',
    },
  ],
};

const identityOkResponse = {
  backstageIdentity: {
    identity: {
      ownershipEntityRefs: ['user:default/jimmymarkum'],
      type: 'user',
      userEntityRef: 'user:default/jimmymarkum',
    },
    token:
      'eyblob.eyJzdWIiOiJ1c2VyOmRlZmF1bHQvamltbXltYXJrdW0iLCJlbnQiOlsidXNlcjpkZWZhdWx0L2ppbW15bWFya3VtIl19.eyblob',
  },
  profile: {
    email: 'user.name@email.test',
  },
  providerInfo: {
    cfAccessIdentityProfile: {
      email: 'foo@bar.com',
      groups: [
        {
          email: 'foo@bar.com',
          id: '123',
          name: 'foo',
        },
      ],
      id: '123',
      name: 'foo',
    },
    claims: mockClaims,
    expiresInSeconds: 3,
  },
};

const mockAuthenticatedUserEmail = 'user.name@email.test';
const mockCacheClient = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
};

jest.mock('jose');
jest.mock('node-fetch', () => {
  const original = jest.requireActual('node-fetch');
  return {
    __esModule: true,
    default: jest.fn(),
    Headers: original.Headers,
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CloudflareAccessAuthProvider', () => {
  // Cloudflare access provides jwt in two ways.
  const mockRequestWithJwtHeader = {
    header: jest.fn(name => {
      if (name === CF_JWT_HEADER) {
        return mockJwt;
      } else if (name === CF_AUTH_IDENTITY) {
        return mockAuthenticatedUserEmail;
      }
      return undefined;
    }),
  } as unknown as express.Request;
  const mockRequestWithJwtCookie = {
    header: jest.fn(_ => {
      return undefined;
    }),
    cookies: {
      CF_Authorization: `${mockJwt}`,
    },
  } as unknown as express.Request;

  const mockRequestWithoutJwt = {
    header: jest.fn(_ => {
      return undefined;
    }),
  } as unknown as express.Request;

  const mockResponse = {
    end: jest.fn(),
    header: () => jest.fn(),
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as express.Response;

  const mockFetch = fetch as unknown as jest.Mocked<any>;

  const provider = new CloudflareAccessAuthProvider({
    teamName: 'foobar',
    resolverContext: {} as AuthResolverContext,
    authHandler: async result => {
      expect(result).toEqual(
        expect.objectContaining({
          claims: mockClaims,
          cfIdentity: mockCfIdentity,
          token: mockJwt,
        }),
      );
      return {
        profile: {
          email: result.claims.email,
        },
      };
    },
    signInResolver: async ({ result }) => {
      expect(result).toEqual(
        expect.objectContaining({
          claims: mockClaims,
          cfIdentity: mockCfIdentity,
          token: mockJwt,
        }),
      );
      return {
        token:
          'eyblob.eyJzdWIiOiJ1c2VyOmRlZmF1bHQvamltbXltYXJrdW0iLCJlbnQiOlsidXNlcjpkZWZhdWx0L2ppbW15bWFya3VtIl19.eyblob',
      };
    },
    cache: mockCacheClient,
  });

  describe('when JWT is valid', () => {
    it('returns cfidentity also when get-identity succeeds', async () => {
      jwtMock.mockReturnValue(Promise.resolve({ payload: mockClaims }));
      mockFetch.mockReturnValueOnce(
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => {
            return mockCfIdentity;
          },
        }),
      );
      await provider.refresh(mockRequestWithJwtHeader, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith(identityOkResponse);
    });

    it('should resolve when passed in cookie', async () => {
      jwtMock.mockReturnValue(Promise.resolve({ payload: mockClaims }));
      // when mockFetch resolves and there nothing gets returned from /get-identity
      mockFetch.mockReturnValueOnce(
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => {
            return mockCfIdentity;
          },
        }),
      );
      await provider.refresh(mockRequestWithJwtCookie, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith(identityOkResponse);
    });

    it('should resolve an identity and populate access groups when there are groups', async () => {
      // when get-identity api responds and responds with status 200
      mockFetch.mockResolvedValueOnce(
        Promise.resolve({
          ok: () => {
            return true;
          },
          status: 200,
          json: () => {
            return Promise.resolve({
              name: 'foo',
              id: '123',
              email: 'foo@bar.com',
              groups: [
                {
                  id: '123',
                  email: 'foo@bar.com',
                  name: 'foo',
                },
              ],
            });
          },
        }),
      );
      jwtMock.mockReturnValueOnce(Promise.resolve({ payload: mockClaims }));
      await provider.refresh(mockRequestWithJwtCookie, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith(identityOkResponse);
    });

    it('should throw an error when get-identity fails', async () => {
      mockFetch.mockReturnValue(Promise.reject());
      await expect(
        provider.refresh(mockRequestWithJwtCookie, mockResponse),
      ).rejects.toThrow();
    });
  });

  describe('should fail when', () => {
    it('JWT is missing', async () => {
      await expect(
        provider.refresh(mockRequestWithoutJwt, mockResponse),
      ).rejects.toThrow();
    });

    it('JWT is invalid', async () => {
      jwtMock.mockImplementation(() => {
        throw new Error('bad JWT');
      });
      await expect(
        provider.refresh(mockRequestWithJwtCookie, mockResponse),
      ).rejects.toThrow();
      await expect(
        provider.refresh(mockRequestWithJwtHeader, mockResponse),
      ).rejects.toThrow();
      jwtMock.mockReset();
    });

    it('SignInResolver rejects', async () => {
      jwtMock.mockReturnValue(mockClaims);
      await expect(
        provider.refresh(mockRequestWithJwtCookie, mockResponse),
      ).rejects.toThrow();
      await expect(
        provider.refresh(mockRequestWithJwtHeader, mockResponse),
      ).rejects.toThrow();
      jwtMock.mockReset();
    });

    it('AuthHandler rejects', async () => {
      jwtMock.mockReturnValue(mockClaims);

      await expect(
        provider.refresh(mockRequestWithJwtCookie, mockResponse),
      ).rejects.toThrow();
      await expect(
        provider.refresh(mockRequestWithJwtHeader, mockResponse),
      ).rejects.toThrow();
      jwtMock.mockReset();
    });
  });
});
