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

import { DefaultAuthConnector } from './DefaultAuthConnector';
import MockOAuthApi from '../../apis/implementations/OAuthRequestApi/MockOAuthApi';
import * as loginPopup from '../loginPopup';
import { UrlPatternDiscovery } from '../../apis';
import { setupRequestMockHandlers } from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { ConfigReader } from '@backstage/config';
import { ConfigApi } from '@backstage/core-plugin-api';

jest.mock('../loginPopup', () => {
  return {
    showLoginPopup: jest.fn(),
  };
});

const configApi: ConfigApi = new ConfigReader({
  enableExperimentalRedirectFlow: false,
});

const defaultOptions = {
  discoveryApi: UrlPatternDiscovery.compile('http://my-host/api/{{pluginId}}'),
  environment: 'production',
  provider: {
    id: 'my-provider',
    title: 'My Provider',
    icon: () => null,
  },
  oauthRequestApi: new MockOAuthApi(),
  sessionTransform: ({ expiresInSeconds, ...res }: any) => ({
    ...res,
    scopes: new Set(res.scopes.split(' ')),
    expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
  }),
  configApi: configApi,
};

describe('DefaultAuthConnector', () => {
  const server = setupServer();
  setupRequestMockHandlers(server);

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should refresh a session with scope', async () => {
    server.use(
      rest.get('*', (req, res, ctx) =>
        res(
          ctx.json({
            idToken: 'mock-id-token',
            accessToken: 'mock-access-token',
            scopes: req.url.searchParams.get('scope') || 'default-scope',
            expiresInSeconds: '60',
          }),
        ),
      ),
    );

    const connector = new DefaultAuthConnector<any>(defaultOptions);
    const session = await connector.refreshSession(new Set(['a', 'b', 'c']));
    expect(session.idToken).toBe('mock-id-token');
    expect(session.accessToken).toBe('mock-access-token');
    expect(session.scopes).toEqual(new Set(['a', 'b', 'c']));
    expect(session.expiresAt.getTime()).toBeLessThan(Date.now() + 70000);
    expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now() + 50000);
  });

  it('should handle failure to refresh session', async () => {
    server.use(
      rest.get('*', (_req, res, ctx) =>
        res(ctx.status(500, 'Error: Network NOPE')),
      ),
    );

    const connector = new DefaultAuthConnector(defaultOptions);
    await expect(connector.refreshSession()).rejects.toThrow(
      'Auth refresh request failed, Error: Network NOPE',
    );
  });

  it('should handle failure response when refreshing session', async () => {
    server.use(rest.get('*', (_req, res, ctx) => res(ctx.status(401, 'NOPE'))));

    const connector = new DefaultAuthConnector(defaultOptions);
    await expect(connector.refreshSession()).rejects.toThrow(
      'Auth refresh request failed, NOPE',
    );
  });

  it('should fail if popup was rejected', async () => {
    const mockOauth = new MockOAuthApi();
    const connector = new DefaultAuthConnector({
      ...defaultOptions,
      oauthRequestApi: mockOauth,
    });
    const promise = connector.createSession({ scopes: new Set(['a', 'b']) });
    await mockOauth.rejectAll();
    await expect(promise).rejects.toMatchObject({ name: 'RejectedError' });
  });

  it('should create a session', async () => {
    const mockOauth = new MockOAuthApi();
    const popupSpy = jest
      .spyOn(loginPopup, 'showLoginPopup')
      .mockResolvedValue({
        idToken: 'my-id-token',
        accessToken: 'my-access-token',
        scopes: 'a b',
        expiresInSeconds: 3600,
      });
    const connector = new DefaultAuthConnector({
      ...defaultOptions,
      oauthRequestApi: mockOauth,
    });

    const sessionPromise = connector.createSession({
      scopes: new Set(['a', 'b']),
    });

    await mockOauth.triggerAll();

    expect(popupSpy).toHaveBeenCalledTimes(1);
    expect(popupSpy.mock.calls[0][0]).toMatchObject({
      url: 'http://my-host/api/auth/my-provider/start?scope=a%20b&origin=http%3A%2F%2Flocalhost&flow=popup&env=production',
    });

    await expect(sessionPromise).resolves.toEqual({
      idToken: 'my-id-token',
      accessToken: 'my-access-token',
      scopes: expect.any(Set),
      expiresAt: expect.any(Date),
    });
  });

  it('should instantly show popup if option is set', async () => {
    const popupSpy = jest
      .spyOn(loginPopup, 'showLoginPopup')
      .mockResolvedValue('my-session');
    const connector = new DefaultAuthConnector({
      ...defaultOptions,
      oauthRequestApi: new MockOAuthApi(),
      sessionTransform: str => str,
    });

    const sessionPromise = connector.createSession({
      scopes: new Set(),
      instantPopup: true,
    });

    await expect(sessionPromise).resolves.toBe('my-session');

    expect(popupSpy).toHaveBeenCalledTimes(1);
  });

  it('should use join func to join scopes', async () => {
    const mockOauth = new MockOAuthApi();
    const popupSpy = jest
      .spyOn(loginPopup, 'showLoginPopup')
      .mockResolvedValue({ scopes: '' });
    const connector = new DefaultAuthConnector({
      ...defaultOptions,
      joinScopes: scopes => `-${[...scopes].join('')}-`,
      oauthRequestApi: mockOauth,
    });

    connector.createSession({ scopes: new Set(['a', 'b']) });

    await mockOauth.triggerAll();

    expect(popupSpy).toHaveBeenCalledTimes(1);
    expect(popupSpy.mock.calls[0][0]).toMatchObject({
      url: 'http://my-host/api/auth/my-provider/start?scope=-ab-&origin=http%3A%2F%2Flocalhost&flow=popup&env=production',
    });
  });
});
