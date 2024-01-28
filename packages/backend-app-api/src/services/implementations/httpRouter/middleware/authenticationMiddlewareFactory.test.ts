/*
 * Copyright 2023 The Backstage Authors
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
import { authenticationMiddlewareFactory } from './authenticationMiddlewareFactory';
import { TokenManagerService } from '@backstage/backend-plugin-api';
import { AuthenticationError, ErrorLike } from '@backstage/errors';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { TokenManager } from '@backstage/backend-common';
import { randomUUID } from 'crypto';
import { Handler, Request, Response } from 'express';

const useFixture = (middleware: Handler) => async (req: Partial<Request>) => {
  let error: ErrorLike | undefined;

  await new Promise<void>(resolve => {
    middleware(req as Request, {} as Response, (err: any) => {
      error = err;
      resolve();
    });
  });

  return error;
};

const createMiddleware = (
  identityApi: IdentityApi,
  tokenManager: TokenManagerService,
) => useFixture(authenticationMiddlewareFactory(identityApi, tokenManager));

const mockAuthenticate = jest.fn();
const mockGetToken = jest.fn();
const mockGetIdentity = jest.fn();

describe('authenticationMiddlewareFactory', () => {
  const identityApi: IdentityApi = {
    getIdentity: mockGetIdentity,
  };
  const tokenManager: TokenManager = {
    getToken: mockGetToken,
    authenticate: mockAuthenticate,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw AuthenticationError when the token is not specified', async () => {
    const middleware = createMiddleware(identityApi, tokenManager);
    const err = await middleware({});

    expect(err).toBeDefined();
    expect(err?.name).toBe('AuthenticationError');
    expect(mockAuthenticate).not.toHaveBeenCalled();
    expect(mockGetIdentity).toHaveBeenCalled();
  });

  it("should fail when both user and service token don't match", async () => {
    mockGetIdentity.mockRejectedValue(new AuthenticationError('bad token1'));
    mockAuthenticate.mockRejectedValue(new AuthenticationError('bad token2'));
    const middleware = createMiddleware(identityApi, tokenManager);
    const err = await middleware({
      headers: { authorization: `Bearer myToken` },
    });

    expect(err).toBeDefined();
    expect(err?.name).toBe('AuthenticationError');

    expect(mockAuthenticate).toHaveBeenCalledTimes(1);
    expect(mockGetIdentity).toHaveBeenCalledTimes(1);
  });

  describe('using user token', () => {
    it('should next when the token is valid', async () => {
      mockGetIdentity.mockResolvedValue({});
      mockAuthenticate.mockRejectedValue(false);
      const middleware = createMiddleware(identityApi, tokenManager);
      const err = await middleware({
        headers: { authorization: `Bearer myToken` },
      });

      expect(err).toBeUndefined();

      expect(mockAuthenticate).toHaveBeenCalledTimes(1);
      expect(mockGetIdentity).toHaveBeenCalledTimes(1);
    });
  });

  describe('using server token', () => {
    it('should next when the token is valid', async () => {
      mockAuthenticate.mockResolvedValue(false);
      mockGetIdentity.mockRejectedValue(new AuthenticationError('bad token'));
      const middleware = createMiddleware(identityApi, tokenManager);
      const err = await middleware({
        headers: {
          authorization: `Bearer ${randomUUID()}`,
        },
      });

      expect(err).toBeUndefined();

      expect(mockAuthenticate).toHaveBeenCalledTimes(1);
      expect(mockGetIdentity).toHaveBeenCalledTimes(1);
    });
  });
});
