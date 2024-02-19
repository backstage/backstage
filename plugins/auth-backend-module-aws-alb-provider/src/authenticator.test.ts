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
import { SignJWT } from 'jose';
import {
  ALB_ACCESS_TOKEN_HEADER,
  ALB_JWT_HEADER,
  awsAlbAuthenticator,
} from './authenticator';
import { Config } from '@backstage/config';
import { AuthenticationError } from '@backstage/errors';

describe('AwsAlbProvider', () => {
  const mockAccessToken = 'ACCESS_TOKEN';
  const mockClaims = {
    sub: '1234567890',
    name: 'User Name',
    family_name: 'Name',
    given_name: 'User',
    picture: 'PICTURE_URL',
    email: 'user.name@email.test',
    exp: Date.now() + 10000,
    iss: 'ISSUER_URL',
  };
  const signingKey = new TextEncoder().encode('signingKey');
  let mockJwt: string;
  const mockRequest = {
    header: jest.fn(name => {
      if (name === ALB_JWT_HEADER) {
        return mockJwt;
      } else if (name === ALB_ACCESS_TOKEN_HEADER) {
        return mockAccessToken;
      }
      return undefined;
    }),
  } as unknown as express.Request;
  const mockRequestWithInvalidJwt = {
    header: jest.fn(name => {
      if (name === ALB_JWT_HEADER) {
        return 'invalid.jwt';
      } else if (name === ALB_ACCESS_TOKEN_HEADER) {
        return mockAccessToken;
      }
      return undefined;
    }),
  } as unknown as express.Request;
  const mockRequestWithoutJwt = {
    header: jest.fn(name => {
      if (name === ALB_ACCESS_TOKEN_HEADER) {
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

  beforeEach(async () => {
    mockJwt = await new SignJWT(mockClaims)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(signingKey);
  });

  describe('should transform to type AwsAlbResponse', () => {
    it('when JWT is valid and identity is resolved successfully', async () => {
      const response = await awsAlbAuthenticator.authenticate(
        { req: mockRequest },
        {
          issuer: 'ISSUER_URL',
          getKey: jest.fn().mockResolvedValue(signingKey),
        },
      );
      expect(response).toEqual({
        result: {
          fullProfile: {
            provider: 'unknown',
            id: mockClaims.sub,
            displayName: mockClaims.name,
            username: mockClaims.email.split('@')[0].toLowerCase(),
            name: {
              familyName: mockClaims.family_name,
              givenName: mockClaims.given_name,
            },
            emails: [{ value: mockClaims.email.toLowerCase() }],
            photos: [{ value: mockClaims.picture }],
          },
          expiresInSeconds: mockClaims.exp,
          accessToken: mockAccessToken,
        },
      });
    });
  });
  describe('should fail when', () => {
    it('Access token is missing', async () => {
      await expect(
        awsAlbAuthenticator.authenticate(
          { req: mockRequestWithoutAccessToken },
          { issuer: 'ISSUER_URL', getKey: jest.fn() },
        ),
      ).rejects.toThrow(AuthenticationError);
    });

    it('JWT is missing', async () => {
      await expect(
        awsAlbAuthenticator.authenticate(
          { req: mockRequestWithoutJwt },
          { issuer: 'ISSUER_URL', getKey: jest.fn() },
        ),
      ).rejects.toThrow(AuthenticationError);
    });

    it('JWT is invalid', async () => {
      await expect(
        awsAlbAuthenticator.authenticate(
          { req: mockRequestWithInvalidJwt },
          { issuer: 'ISSUER_URL', getKey: jest.fn() },
        ),
      ).rejects.toThrow(
        'Exception occurred during JWT processing: JWSInvalid: Invalid Compact JWS',
      );
    });

    it('issuer is missing', async () => {
      const jwt = await new SignJWT({})
        .setProtectedHeader({ alg: 'HS256' })
        .sign(signingKey);
      const req = {
        header: jest.fn(name => {
          if (name === ALB_JWT_HEADER) {
            return jwt;
          } else if (name === ALB_ACCESS_TOKEN_HEADER) {
            return mockAccessToken;
          }
          return undefined;
        }),
      } as unknown as express.Request;

      await expect(
        awsAlbAuthenticator.authenticate(
          { req },
          {
            issuer: 'ISSUER_URL',
            getKey: jest.fn().mockResolvedValue(signingKey),
          },
        ),
      ).rejects.toThrow(
        'Exception occurred during JWT processing: AuthenticationError: Issuer mismatch on JWT token',
      );
    });

    it('issuer is invalid', async () => {
      const jwt = await new SignJWT({ iss: 'INVALID_ISSUER_URL' })
        .setProtectedHeader({ alg: 'HS256' })
        .sign(signingKey);
      const req = {
        header: jest.fn(name => {
          if (name === ALB_JWT_HEADER) {
            return jwt;
          } else if (name === ALB_ACCESS_TOKEN_HEADER) {
            return mockAccessToken;
          }
          return undefined;
        }),
      } as unknown as express.Request;

      await expect(
        awsAlbAuthenticator.authenticate(
          { req },
          {
            issuer: 'ISSUER_URL',
            getKey: jest.fn().mockResolvedValue(signingKey),
          },
        ),
      ).rejects.toThrow(
        'Exception occurred during JWT processing: AuthenticationError: Issuer mismatch on JWT token',
      );
    });
  });
  describe('should initialize', () => {
    it('with default options', async () => {
      const config = {
        config: {
          getString: jest
            .fn()
            .mockReturnValueOnce('ISSUER_URL')
            .mockReturnValueOnce('TEST_REGION'),
        } as unknown as Config,
      };

      expect(awsAlbAuthenticator.initialize(config)).toEqual({
        issuer: 'ISSUER_URL',
        getKey: expect.any(Function),
      });
    });
  });
});
