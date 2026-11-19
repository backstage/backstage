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
import { AuthConnectionError } from './errors';
import MockOAuthApi from '../../apis/implementations/OAuthRequestApi/MockOAuthApi';
import * as loginPopup from '../loginPopup';
import { UrlPatternDiscovery } from '../../apis';
import { registerMswTestHooks } from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { ConfigReader } from '@backstage/config';
import { ConfigApi } from '@backstage/core-plugin-api';

jest.mock('../loginPopup', () => {
  return {
    openLoginPopup: jest.fn(),
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
  registerMswTestHooks(server);

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should refresh a session with scope', async () => {
    server.use(
      http.get('*', ({ request }) => {
        const url = new URL(request.url);
        return HttpResponse.json({
          idToken: 'mock-id-token',
          accessToken: 'mock-access-token',
          scopes: url.searchParams.get('scope') || 'default-scope',
          expiresInSeconds: '60',
        });
      }),
    );

    const connector = new DefaultAuthConnector<any>(defaultOptions);
    const session = await connector.refreshSession({
      scopes: new Set(['a', 'b', 'c']),
    });
    expect(session.idToken).toBe('mock-id-token');
    expect(session.accessToken).toBe('mock-access-token');
    expect(session.scopes).toEqual(new Set(['a', 'b', 'c']));
    expect(session.expiresAt.getTime()).toBeLessThan(Date.now() + 70000);
    expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now() + 50000);
  });

  describe('with Web Locks', () => {
    const originalLocks = Object.getOwnPropertyDescriptor(
      window.navigator,
      'locks',
    );
    const requestLock = jest.fn();

    beforeEach(() => {
      const pending = new Map<string, Promise<unknown>>();
      requestLock.mockImplementation(
        (name: string, callback: LockGrantedCallback<unknown>) => {
          const result = (pending.get(name) ?? Promise.resolve())
            .catch(() => {})
            .then(() => callback({ name, mode: 'exclusive' }));
          pending.set(name, result);
          return result;
        },
      );
      Object.defineProperty(window.navigator, 'locks', {
        configurable: true,
        value: { request: requestLock },
      });
    });

    afterEach(() => {
      if (originalLocks) {
        Object.defineProperty(window.navigator, 'locks', originalLocks);
      } else {
        Reflect.deleteProperty(window.navigator, 'locks');
      }
    });

    it('serializes refreshes across connectors with different scopes and environments', async () => {
      let releaseFirst!: () => void;
      const firstResponse = new Promise<void>(resolve => {
        releaseFirst = resolve;
      });
      let onFirstRequest!: () => void;
      const firstRequest = new Promise<void>(resolve => {
        onFirstRequest = resolve;
      });
      let requests = 0;
      server.use(
        http.get('*', async ({ request }) => {
          requests += 1;
          if (requests === 1) {
            onFirstRequest();
            await firstResponse;
          }
          return HttpResponse.json({
            scopes: new URL(request.url).searchParams.get('scope'),
            expiresInSeconds: 60,
          });
        }),
      );

      const sessions = Promise.all(
        ['a', 'b', 'c', 'd', 'e'].map(scope =>
          new DefaultAuthConnector({
            ...defaultOptions,
            environment: scope,
          }).refreshSession({ scopes: new Set([scope]) }),
        ),
      );
      await firstRequest;
      expect(requestLock).toHaveBeenCalledTimes(5);
      expect(requestLock.mock.calls.map(([name]) => name)).toEqual(
        Array(5).fill(
          'backstage-auth-refresh:http://my-host/api/auth/my-provider/refresh',
        ),
      );
      expect(requests).toBe(1);

      releaseFirst();
      expect((await sessions).map(session => [...session.scopes])).toEqual([
        ['a'],
        ['b'],
        ['c'],
        ['d'],
        ['e'],
      ]);
      expect(requests).toBe(5);
    });

    it('releases the lock after a failed refresh without retrying the failed request', async () => {
      let requests = 0;
      server.use(
        http.get('*', () => {
          requests += 1;
          if (requests === 1) {
            return HttpResponse.error();
          }
          return HttpResponse.json({ scopes: 'a', expiresInSeconds: 60 });
        }),
      );

      const results = await Promise.allSettled([
        new DefaultAuthConnector(defaultOptions).refreshSession(),
        new DefaultAuthConnector(defaultOptions).refreshSession(),
      ]);

      expect(results[0]).toEqual({
        status: 'rejected',
        reason: expect.objectContaining({
          message: expect.stringContaining('Auth refresh request failed'),
        }),
      });
      expect(results[1]).toEqual({
        status: 'fulfilled',
        value: expect.objectContaining({ scopes: new Set(['a']) }),
      });
      expect(requests).toBe(2);
    });

    it('allows different provider endpoints to refresh independently', async () => {
      let releaseResponses!: () => void;
      const responses = new Promise<void>(resolve => {
        releaseResponses = resolve;
      });
      let onBothRequests!: () => void;
      const bothRequests = new Promise<void>(resolve => {
        onBothRequests = resolve;
      });
      let requests = 0;
      server.use(
        http.get('*', async () => {
          requests += 1;
          if (requests === 2) {
            onBothRequests();
          }
          await responses;
          return HttpResponse.json({ scopes: 'a', expiresInSeconds: 60 });
        }),
      );

      const sessions = Promise.all([
        new DefaultAuthConnector(defaultOptions).refreshSession(),
        new DefaultAuthConnector({
          ...defaultOptions,
          provider: { ...defaultOptions.provider, id: 'other-provider' },
        }).refreshSession(),
      ]);

      await bothRequests;
      releaseResponses();
      expect(await sessions).toHaveLength(2);
      expect(requestLock.mock.calls.map(([name]) => name)).toEqual([
        'backstage-auth-refresh:http://my-host/api/auth/my-provider/refresh',
        'backstage-auth-refresh:http://my-host/api/auth/other-provider/refresh',
      ]);
    });
  });

  it('should handle failure to refresh session', async () => {
    server.use(
      http.get(
        '*',
        () =>
          new HttpResponse('', {
            status: 500,
            statusText: 'Error: Network NOPE',
          }),
      ),
    );

    const connector = new DefaultAuthConnector(defaultOptions);
    await expect(connector.refreshSession()).rejects.toThrow(
      'Auth refresh request failed, Error: Network NOPE',
    );
  });

  it('should handle failure response when refreshing session', async () => {
    server.use(
      http.get('*', () =>
        HttpResponse.text('', { status: 401, statusText: 'NOPE' }),
      ),
    );

    const connector = new DefaultAuthConnector(defaultOptions);
    await expect(connector.refreshSession()).rejects.toThrow(
      'Auth refresh request failed, NOPE',
    );
  });

  it('should throw an AuthConnectionError when the refresh request cannot reach the backend', async () => {
    server.use(http.get('*', () => HttpResponse.error()));

    const connector = new DefaultAuthConnector(defaultOptions);
    await expect(connector.refreshSession()).rejects.toThrow(
      AuthConnectionError,
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
      .spyOn(loginPopup, 'openLoginPopup')
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
      .spyOn(loginPopup, 'openLoginPopup')
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
    expect(popupSpy).toHaveBeenCalledWith({
      name: 'My Provider Login',
      url: 'http://my-host/api/auth/my-provider/start?scope=&origin=http%3A%2F%2Flocalhost&flow=popup&env=production',
      width: 450,
      height: 730,
    });
  });

  it('should show popup fullscreen', async () => {
    const popupSpy = jest
      .spyOn(loginPopup, 'openLoginPopup')
      .mockResolvedValue('my-session');

    jest.spyOn(window.screen, 'width', 'get').mockReturnValue(1000);
    jest.spyOn(window.screen, 'height', 'get').mockReturnValue(1000);

    const connector = new DefaultAuthConnector({
      ...defaultOptions,
      oauthRequestApi: new MockOAuthApi(),
      sessionTransform: str => str,
      popupOptions: {
        size: {
          fullscreen: true,
        },
      },
    });

    const sessionPromise = connector.createSession({
      scopes: new Set(),
      instantPopup: true,
    });

    await expect(sessionPromise).resolves.toBe('my-session');

    expect(popupSpy).toHaveBeenCalledWith({
      height: 1000,
      name: 'My Provider Login',
      url: 'http://my-host/api/auth/my-provider/start?scope=&origin=http%3A%2F%2Flocalhost&flow=popup&env=production',
      width: 1000,
    });
  });

  it('should show popup with special width and height', async () => {
    const popupSpy = jest
      .spyOn(loginPopup, 'openLoginPopup')
      .mockResolvedValue('my-session');
    const connector = new DefaultAuthConnector({
      ...defaultOptions,
      oauthRequestApi: new MockOAuthApi(),
      sessionTransform: str => str,
      popupOptions: {
        size: {
          width: 500,
          height: 1000,
        },
      },
    });

    const sessionPromise = connector.createSession({
      scopes: new Set(),
      instantPopup: true,
    });

    await expect(sessionPromise).resolves.toBe('my-session');

    expect(popupSpy).toHaveBeenCalledWith({
      name: 'My Provider Login',
      url: 'http://my-host/api/auth/my-provider/start?scope=&origin=http%3A%2F%2Flocalhost&flow=popup&env=production',
      width: 500,
      height: 1000,
    });
  });

  it('should use join func to join scopes', async () => {
    const mockOauth = new MockOAuthApi();
    const popupSpy = jest
      .spyOn(loginPopup, 'openLoginPopup')
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

  it('should not resolve when provider returns a logoutUrl', async () => {
    const logoutUrl =
      'https://test.auth0.com/v2/logout?federated&client_id=abc&returnTo=http%3A%2F%2Flocalhost';

    server.use(http.post('*', () => HttpResponse.json({ logoutUrl })));

    const connector = new DefaultAuthConnector(defaultOptions);

    // When a logoutUrl is returned, removeSession redirects the browser and
    // returns a never-resolving promise. Race against a short delay to verify
    // that it does not resolve.
    const result = await Promise.race([
      connector.removeSession().then(() => 'resolved'),
      new Promise<'timeout'>(r => setTimeout(() => r('timeout'), 50)),
    ]);

    expect(result).toBe('timeout');
  });

  it('should complete normally when provider returns empty logout response', async () => {
    server.use(http.post('*', () => new HttpResponse(null, { status: 200 })));

    const connector = new DefaultAuthConnector(defaultOptions);
    await connector.removeSession();
    // No redirect, no error — the original behavior
  });

  it('should complete normally when response is not JSON', async () => {
    server.use(http.post('*', () => HttpResponse.text('OK', { status: 200 })));

    const connector = new DefaultAuthConnector(defaultOptions);
    await connector.removeSession();
    // Should complete without error — non-JSON responses are ignored
  });

  it('should ignore logoutUrl with non-HTTPS protocol', async () => {
    server.use(
      http.post('*', () =>
        HttpResponse.json({ logoutUrl: 'http://evil.com/steal' }),
      ),
    );

    const connector = new DefaultAuthConnector(defaultOptions);
    await connector.removeSession();
    // Should complete normally without redirecting - http:// is rejected
  });
});
