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
import { getVoidLogger } from '@backstage/backend-common';
import express from 'express';
import { JWT } from 'jose';

import {
  ALB_ACCESSTOKEN_HEADER,
  ALB_JWT_HEADER,
  AwsAlbAuthProvider,
} from './provider';
import { TokenIssuer } from '../../identity/types';
import { CatalogIdentityClient } from '../../lib/catalog';
import { makeProfileInfo } from '../../lib/passport';

const jwtMock = JWT as jest.Mocked<any>;

const mockKey = async () => {
  return `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEnuN4LlaJhaUpx+qZFTzYCrSBLk0I
yOlxJ2VW88mLAQGJ7HPAvOdylxZsItMnzCuqNzZvie8m/NJsOjhDncVkrw==
-----END PUBLIC KEY-----
`;
};
const mockJwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IktFWV9JRCIsImlzcyI6IklTU1VFUl9VUkwifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlVzZXIgTmFtZSIsImlhdCI6MTUxNjIzOTAyMn0.uMCSBGhij1xn5pnot8XgD-huQuTIBOFGs6kkW_p_X94';
const mockAccessToken = 'ACCESS_TOKEN';
const mockClaims = {
  sub: '1234567890',
  name: 'User Name',
  family_name: 'Name',
  given_name: 'User',
  picture: 'PICTURE_URL',
  email: 'user.name@email.test',
  exp: 1632833763,
  iss: 'ISSUER_URL',
};

jest.mock('jose');
jest.mock('cross-fetch', () => ({
  __esModule: true,
  default: async () => {
    return {
      text: async () => {
        return mockKey();
      },
    };
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AwsAlbAuthProvider', () => {
  const tokenIssuer: TokenIssuer = {
    listPublicKeys: jest.fn(),
    async issueToken(params) {
      return `token-for-${params.claims.sub}`;
    },
  };
  const catalogIdentityClient: CatalogIdentityClient = {
    findUser: jest.fn(),
  } as unknown as CatalogIdentityClient;

  const mockRequest = {
    header: jest.fn(name => {
      if (name === ALB_JWT_HEADER) {
        return mockJwt;
      } else if (name === ALB_ACCESSTOKEN_HEADER) {
        return mockAccessToken;
      }
      return undefined;
    }),
  } as unknown as express.Request;
  const mockRequestWithoutJwt = {
    header: jest.fn(name => {
      if (name === ALB_ACCESSTOKEN_HEADER) {
        return mockAccessToken;
      }
      return undefined;
    }),
  } as unknown as express.Request;
  const mockRequestWithoutAccessToken = {
    header: jest.fn(name => {
      if (name === ALB_JWT_HEADER) {
        return mockJwt;
      }
      return undefined;
    }),
  } as unknown as express.Request;

  const mockResponse = {
    end: jest.fn(),
    header: () => jest.fn(),
    json: jest.fn().mockReturnThis(),
    status: jest.fn(),
  } as unknown as express.Response;

  describe('should transform to type AwsAlbResponse', () => {
    it('when JWT is valid and identity is resolved successfully', async () => {
      const provider = new AwsAlbAuthProvider({
        region: 'eu-west-1',
        issuer: 'ISSUER_URL',
        logger: getVoidLogger(),
        catalogIdentityClient,
        tokenIssuer,
        authHandler: async ({ fullProfile }) => ({
          profile: makeProfileInfo(fullProfile),
        }),
        signInResolver: async () => {
          return { id: 'user.name', token: 'TOKEN' };
        },
      });

      jwtMock.verify.mockReturnValueOnce(mockClaims);

      await provider.refresh(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({
        backstageIdentity: {
          id: 'user.name',
          token: 'TOKEN',
        },
        profile: {
          displayName: 'User Name',
          email: 'user.name@email.test',
          picture: 'PICTURE_URL',
        },
        providerInfo: {
          accessToken: mockAccessToken,
          expiresInSeconds: mockClaims.exp,
        },
      });
    });
  });

  describe('should fail when', () => {
    it('Access token is missing', async () => {
      const provider = new AwsAlbAuthProvider({
        region: 'eu-west-1',
        issuer: 'ISSUER_URL',
        logger: getVoidLogger(),
        catalogIdentityClient,
        tokenIssuer,
        authHandler: async ({ fullProfile }) => ({
          profile: makeProfileInfo(fullProfile),
        }),
        signInResolver: async () => {
          return { id: 'user.name', token: 'TOKEN' };
        },
      });

      await provider.refresh(mockRequestWithoutAccessToken, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('JWT is missing', async () => {
      const provider = new AwsAlbAuthProvider({
        region: 'eu-west-1',
        issuer: 'ISSUER_URL',
        logger: getVoidLogger(),
        catalogIdentityClient,
        tokenIssuer,
        authHandler: async ({ fullProfile }) => ({
          profile: makeProfileInfo(fullProfile),
        }),
        signInResolver: async () => {
          return { id: 'user.name', token: 'TOKEN' };
        },
      });

      await provider.refresh(mockRequestWithoutJwt, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('JWT is invalid', async () => {
      const provider = new AwsAlbAuthProvider({
        region: 'eu-west-1',
        issuer: 'ISSUER_URL',
        logger: getVoidLogger(),
        catalogIdentityClient,
        tokenIssuer,
        authHandler: async ({ fullProfile }) => ({
          profile: makeProfileInfo(fullProfile),
        }),
        signInResolver: async () => {
          return { id: 'user.name', token: 'TOKEN' };
        },
      });

      jwtMock.verify.mockImplementationOnce(() => {
        throw new Error('bad JWT');
      });

      await provider.refresh(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('issuer is missing', async () => {
      const provider = new AwsAlbAuthProvider({
        region: 'eu-west-1',
        issuer: 'ISSUER_URL',
        logger: getVoidLogger(),
        catalogIdentityClient,
        tokenIssuer,
        authHandler: async ({ fullProfile }) => ({
          profile: makeProfileInfo(fullProfile),
        }),
        signInResolver: async () => {
          return { id: 'user.name', token: 'TOKEN' };
        },
      });

      jwtMock.verify.mockReturnValueOnce({});

      await provider.refresh(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('issuer is invalid', async () => {
      const provider = new AwsAlbAuthProvider({
        region: 'eu-west-1',
        issuer: 'ISSUER_URL',
        logger: getVoidLogger(),
        catalogIdentityClient,
        tokenIssuer,
        authHandler: async ({ fullProfile }) => ({
          profile: makeProfileInfo(fullProfile),
        }),
        signInResolver: async () => {
          return { id: 'user.name', token: 'TOKEN' };
        },
      });

      jwtMock.verify.mockReturnValueOnce({
        iss: 'INVALID_ISSUE_URL',
      });

      await provider.refresh(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('SignInResolver rejects', async () => {
      const provider = new AwsAlbAuthProvider({
        region: 'eu-west-1',
        issuer: 'ISSUER_URL',
        logger: getVoidLogger(),
        catalogIdentityClient,
        tokenIssuer,
        authHandler: async ({ fullProfile }) => ({
          profile: makeProfileInfo(fullProfile),
        }),
        signInResolver: async () => {
          throw new Error();
        },
      });

      jwtMock.verify.mockReturnValueOnce(mockClaims);

      await provider.refresh(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.end).toHaveBeenCalledTimes(1);
    });

    it('AuthHandler rejects', async () => {
      const provider = new AwsAlbAuthProvider({
        region: 'eu-west-1',
        issuer: 'ISSUER_URL',
        logger: getVoidLogger(),
        catalogIdentityClient,
        tokenIssuer,
        authHandler: async () => {
          throw new Error();
        },
        signInResolver: async () => {
          return { id: 'user.name', token: 'TOKEN' };
        },
      });

      jwtMock.verify.mockReturnValueOnce(mockClaims);

      await provider.refresh(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.end).toHaveBeenCalledTimes(1);
    });
  });
});
