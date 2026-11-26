/*
 * Copyright 2024 The Backstage Authors
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

import { DefaultHttpAuthService } from './httpAuthServiceFactory';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { createRequest, createResponse } from 'node-mocks-http';
import { AuthenticationError } from '@backstage/errors';

function limitedUserCredentials(userEntityRef: string, expiresAt: Date) {
  return {
    ...mockCredentials.user(userEntityRef),
    expiresAt,
  };
}

describe('DefaultHttpAuthService', () => {
  it('should extract token from custom header', async () => {
    const auth = mockServices.auth.mock();
    const httpAuthService = DefaultHttpAuthService.create({
      discovery: mockServices.discovery(),
      auth,
      pluginId: 'test',
      getTokenFromRequest: req => {
        let token: string | undefined;
        const header = req.headers.test;
        if (typeof header === 'string') {
          token = header;
        }
        return { token };
      },
    });
    await httpAuthService.credentials(
      createRequest({ headers: { test: 'mock-user-token' } }),
    );
    expect(auth.authenticate).toHaveBeenCalledWith('mock-user-token');
  });

  it('keeps credentials scoped to each service instance', async () => {
    const request = createRequest({
      headers: {
        authorization: mockCredentials.service.header({
          onBehalfOf: mockCredentials.service('external:test'),
          targetPluginId: 'Catalog',
        }),
      },
    });
    const firstService = DefaultHttpAuthService.create({
      discovery: mockServices.discovery(),
      auth: mockServices.auth({ pluginId: 'Catalog' }),
      pluginId: 'Catalog',
    });
    const secondAuth = mockServices.auth({ pluginId: 'catalog' });
    const secondAuthenticate = jest.spyOn(secondAuth, 'authenticate');
    const secondService = DefaultHttpAuthService.create({
      discovery: mockServices.discovery(),
      auth: secondAuth,
      pluginId: 'catalog',
    });

    await expect(firstService.credentials(request)).resolves.toEqual(
      mockCredentials.service('external:test'),
    );
    await expect(secondService.credentials(request)).rejects.toThrow();
    expect(secondAuthenticate).toHaveBeenCalledTimes(1);
  });
});

describe('DefaultHttpAuthService issueUserCookie', () => {
  function setup(options: {
    bearerToken: string;
    cookieToken?: string;
    authenticate: (token: string) => any;
  }) {
    const auth = mockServices.auth.mock();
    auth.authenticate.mockImplementation(async (token: string) =>
      options.authenticate(token),
    );
    auth.isPrincipal.mockImplementation(
      (credentials: any, type: string) => credentials?.principal?.type === type,
    );
    auth.getLimitedUserToken.mockImplementation(async (credentials: any) => ({
      token: `limited-token-for-${credentials.principal.userEntityRef}`,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    }));
    const httpAuthService = DefaultHttpAuthService.create({
      discovery: mockServices.discovery(),
      auth,
      pluginId: 'test',
    });
    const headers: Record<string, string> = {
      authorization: `Bearer ${options.bearerToken}`,
    };
    if (options.cookieToken) {
      headers.cookie = `backstage-auth=${options.cookieToken}`;
    }
    const request = createRequest({ headers });
    const response = Object.assign(createResponse(), { req: request });
    return { auth, httpAuthService, request, response };
  }

  it('replaces an existing cookie that belongs to a different user', async () => {
    const { auth, httpAuthService, response } = setup({
      bearerToken: 'token-b',
      cookieToken: 'token-a',
      authenticate: token =>
        token === 'token-b'
          ? mockCredentials.user('user:default/attacker-b')
          : limitedUserCredentials(
              'user:default/victim-a',
              new Date(Date.now() + 60 * 60 * 1000),
            ),
    });
    const cookieSpy = jest.spyOn(response, 'cookie');

    const { expiresAt } = await httpAuthService.issueUserCookie(response);

    expect(cookieSpy).toHaveBeenCalledWith(
      'backstage-auth',
      'limited-token-for-user:default/attacker-b',
      expect.objectContaining({ expires: expect.any(Date) }),
    );
    expect(auth.getLimitedUserToken).toHaveBeenCalledWith(
      mockCredentials.user('user:default/attacker-b'),
    );
    expect(expiresAt.getTime()).toBeGreaterThan(Date.now() + 30 * 60 * 1000);
  });

  it('reuses an existing cookie for the same user when it does not expire soon', async () => {
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const { auth, httpAuthService, response } = setup({
      bearerToken: 'token-a2',
      cookieToken: 'token-a',
      authenticate: token =>
        token === 'token-a2'
          ? mockCredentials.user('user:default/victim-a')
          : limitedUserCredentials('user:default/victim-a', expiresAt),
    });
    const cookieSpy = jest.spyOn(response, 'cookie');

    const result = await httpAuthService.issueUserCookie(response);

    expect(cookieSpy).not.toHaveBeenCalled();
    expect(auth.getLimitedUserToken).not.toHaveBeenCalled();
    expect(result).toEqual({ expiresAt });
  });

  it('replaces an existing cookie that expires soon, even for the same user', async () => {
    const { auth, httpAuthService, response } = setup({
      bearerToken: 'token-a2',
      cookieToken: 'token-a',
      authenticate: token =>
        token === 'token-a2'
          ? mockCredentials.user('user:default/victim-a')
          : limitedUserCredentials(
              'user:default/victim-a',
              new Date(Date.now() + 2 * 60 * 1000),
            ),
    });
    const cookieSpy = jest.spyOn(response, 'cookie');

    await httpAuthService.issueUserCookie(response);

    expect(cookieSpy).toHaveBeenCalled();
    expect(auth.getLimitedUserToken).toHaveBeenCalled();
  });

  it('replaces an invalid existing cookie', async () => {
    const { auth, httpAuthService, response } = setup({
      bearerToken: 'token-b',
      cookieToken: 'token-a',
      authenticate: token => {
        if (token === 'token-b') {
          return mockCredentials.user('user:default/attacker-b');
        }
        throw new AuthenticationError('invalid token');
      },
    });
    const cookieSpy = jest.spyOn(response, 'cookie');

    await httpAuthService.issueUserCookie(response);

    expect(cookieSpy).toHaveBeenCalledWith(
      'backstage-auth',
      'limited-token-for-user:default/attacker-b',
      expect.anything(),
    );
    expect(auth.getLimitedUserToken).toHaveBeenCalled();
  });
});
