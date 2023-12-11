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

import {
  ALB_ACCESS_TOKEN_HEADER,
  ALB_JWT_HEADER,
  awsAlbAuthenticator,
} from './authenticator';
import { jwtVerify } from 'jose';
import express from 'express';
import { AuthenticationError } from '@backstage/errors';
import { Config } from '@backstage/config';

const jwtMock = jwtVerify as jest.Mocked<any>;
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

beforeEach(() => {
  jest.clearAllMocks();
});
describe('AwsAlbProvider', () => {
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

  describe('should transform to type AwsAlbResponse', () => {
    it('when JWT is valid and identity is resolved successfully', async () => {
      jwtMock.mockReturnValueOnce(Promise.resolve({ payload: mockClaims }));

      const response = await awsAlbAuthenticator.authenticate(
        { req: mockRequest },
        { issuer: 'ISSUER_URL', getKey: jest.fn() },
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
      jwtMock.mockImplementationOnce(() => {
        throw new Error('bad JWT');
      });

      await expect(
        awsAlbAuthenticator.authenticate(
          { req: mockRequest },
          { issuer: 'ISSUER_URL', getKey: jest.fn() },
        ),
      ).rejects.toThrow(
        'Exception occurred during JWT processing: Error: bad JWT',
      );
    });

    it('issuer is missing', async () => {
      jwtMock.mockReturnValueOnce({});

      await expect(
        awsAlbAuthenticator.authenticate(
          { req: mockRequest },
          { issuer: 'ISSUER_URL', getKey: jest.fn() },
        ),
      ).rejects.toThrow(
        'Exception occurred during JWT processing: AuthenticationError: Issuer mismatch on JWT token',
      );
    });

    it('issuer is invalid', async () => {
      jwtMock.mockReturnValueOnce({
        iss: 'INVALID_ISSUE_URL',
      });

      await expect(
        awsAlbAuthenticator.authenticate(
          { req: mockRequest },
          { issuer: 'ISSUER_URL', getKey: jest.fn() },
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
