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

import OAuth2 from './OAuth2';
import MockOAuthApi from '../../OAuthRequestApi/MockOAuthApi';
import { UrlPatternDiscovery } from '../../DiscoveryApi';
import { mockApis } from '@backstage/test-utils';
import {
  OAuth2Session,
  AuthConnector,
  AuthConnectorRefreshSessionOptions,
  openLoginPopup,
  // OAuth2Response,
  OAuth2CreateOptionsWithAuthConnector,
} from '../../../../index';

const theFuture = new Date(Date.now() + 3600000);
const thePast = new Date(Date.now() - 10);

const PREFIX = 'https://www.googleapis.com/auth/';

const scopeTransform = (x: string[]) => x;

let getSession = jest.fn();

jest.mock('../../../../lib/AuthSessionManager', () => ({
  ...(jest.requireActual('../../../../lib/AuthSessionManager') as any),
  RefreshingAuthSessionManager: class {
    getSession = getSession;
  },
}));

const configApi = mockApis.config();

class CustomAuthConnector implements AuthConnector<OAuth2Session> {
  async createSession() {
    const s: OAuth2Session = {
      providerInfo: {
        idToken: '',
        accessToken: 'accessToken',
        scopes: new Set(['myScope']),
      },
      profile: {},
    };
    await openLoginPopup({ url: 'http://localhost', name: 'myPopup' });
    return Promise.resolve(s);
  }

  async refreshSession(_?: AuthConnectorRefreshSessionOptions): Promise<any> {}

  async removeSession(): Promise<void> {}
}

describe('OAuth2', () => {
  it('should get refreshed access token', async () => {
    getSession = jest.fn().mockResolvedValue({
      providerInfo: { accessToken: 'access-token', expiresAt: theFuture },
    });
    const oauth2 = OAuth2.create({
      configApi: configApi,
      scopeTransform: scopeTransform,
      oauthRequestApi: new MockOAuthApi(),
      discoveryApi: UrlPatternDiscovery.compile('http://example.com'),
    });

    expect(await oauth2.getAccessToken('my-scope my-scope2')).toBe(
      'access-token',
    );
    expect(getSession).toHaveBeenCalledWith(
      expect.objectContaining({ scopes: new Set(['my-scope', 'my-scope2']) }),
    );
  });

  it('should transform scopes', async () => {
    getSession = jest.fn().mockResolvedValue({
      providerInfo: { accessToken: 'access-token', expiresAt: theFuture },
    });
    const oauth2 = OAuth2.create({
      configApi: configApi,
      scopeTransform: scopes => scopes.map(scope => `my-prefix/${scope}`),
      oauthRequestApi: new MockOAuthApi(),
      discoveryApi: UrlPatternDiscovery.compile('http://example.com'),
    });

    expect(await oauth2.getAccessToken('my-scope')).toBe('access-token');
    expect(getSession).toHaveBeenCalledWith(
      expect.objectContaining({
        scopes: new Set(['my-prefix/my-scope']),
      }),
    );
  });

  it('should forward backstage identity', async () => {
    getSession = jest.fn().mockResolvedValue({
      providerInfo: { accessToken: 'access-token', expiresAt: theFuture },
      backstageIdentity: {
        token: 'a.b.c',
        expiresAt: theFuture,
        identity: {
          type: 'user',
          userEntityRef: 'user:default/mock',
          ownershipEntityRefs: [],
        },
      },
    });
    const oauth2 = OAuth2.create({
      configApi: configApi,
      scopeTransform: scopes => scopes.map(scope => `my-prefix/${scope}`),
      oauthRequestApi: new MockOAuthApi(),
      discoveryApi: UrlPatternDiscovery.compile('http://example.com'),
    });

    await expect(oauth2.getBackstageIdentity()).resolves.toEqual({
      token: 'a.b.c',
      expiresAt: theFuture,
      identity: {
        type: 'user',
        userEntityRef: 'user:default/mock',
        ownershipEntityRefs: [],
      },
    });
  });

  it('should get refreshed id token', async () => {
    getSession = jest.fn().mockResolvedValue({
      providerInfo: { idToken: 'id-token', expiresAt: theFuture },
    });

    const oauth2 = OAuth2.create({
      configApi: configApi,
      scopeTransform: scopeTransform,
      oauthRequestApi: new MockOAuthApi(),
      discoveryApi: UrlPatternDiscovery.compile('http://example.com'),
    });

    expect(await oauth2.getIdToken()).toBe('id-token');
    expect(getSession).toHaveBeenCalledWith(
      expect.objectContaining({
        scopes: new Set(['openid']),
      }),
    );
  });

  it('should get optional id token', async () => {
    getSession = jest.fn().mockResolvedValue({
      providerInfo: { idToken: 'id-token', expiresAt: theFuture },
    });
    const oauth2 = OAuth2.create({
      configApi: configApi,
      scopeTransform: scopes => scopes.map(scope => `my-prefix/${scope}`),
      oauthRequestApi: new MockOAuthApi(),
      discoveryApi: UrlPatternDiscovery.compile('http://example.com'),
    });

    expect(await oauth2.getIdToken({ optional: true })).toBe('id-token');
    expect(getSession).toHaveBeenCalledWith(
      expect.objectContaining({
        scopes: new Set(['openid']),
      }),
    );
  });

  it('should share popup closed errors', async () => {
    const error = new Error('NOPE');
    error.name = 'RejectedError';
    getSession = jest
      .fn()
      .mockResolvedValueOnce({
        providerInfo: {
          accessToken: 'access-token',
          expiresAt: theFuture,
          scopes: new Set([`${PREFIX}not-enough`]),
        },
      })
      .mockRejectedValue(error);
    const oauth2 = OAuth2.create({
      configApi: configApi,
      scopeTransform: scopes => scopes.map(scope => `my-prefix/${scope}`),
      oauthRequestApi: new MockOAuthApi(),
      discoveryApi: UrlPatternDiscovery.compile('http://example.com'),
    });

    // Make sure we have a session before we do the double request, so that we get past the !this.currentSession check
    await expect(oauth2.getAccessToken()).resolves.toBe('access-token');

    const promise1 = oauth2.getAccessToken('more');
    const promise2 = oauth2.getAccessToken('more');
    await expect(promise1).rejects.toBe(error);
    await expect(promise2).rejects.toBe(error);
    expect(getSession).toHaveBeenCalledTimes(3);
  });

  it('should wait for all session refreshes', async () => {
    const initialSession = {
      providerInfo: {
        idToken: 'token1',
        expiresAt: theFuture,
        scopes: new Set(),
      },
    };
    getSession = jest
      .fn()
      .mockResolvedValueOnce(initialSession)
      .mockResolvedValue({
        providerInfo: {
          idToken: 'token2',
          expiresAt: theFuture,
          scopes: new Set(),
        },
      });
    const oauth2 = OAuth2.create({
      configApi: configApi,
      scopeTransform: scopes => scopes.map(scope => `my-prefix/${scope}`),
      oauthRequestApi: new MockOAuthApi(),
      discoveryApi: UrlPatternDiscovery.compile('http://example.com'),
    });

    // Grab the expired session first
    await expect(oauth2.getIdToken()).resolves.toBe('token1');
    expect(getSession).toHaveBeenCalledTimes(1);

    initialSession.providerInfo.expiresAt = thePast;

    const promise1 = oauth2.getIdToken();
    const promise2 = oauth2.getIdToken();
    const promise3 = oauth2.getIdToken();
    await expect(promise1).resolves.toBe('token2');
    await expect(promise2).resolves.toBe('token2');
    await expect(promise3).resolves.toBe('token2');
    expect(getSession).toHaveBeenCalledTimes(4); // De-duping of session requests happens in client
  });
  it('should use provided auth provider', async () => {
    getSession = jest.fn().mockResolvedValue({
      providerInfo: { accessToken: 'access-token', expiresAt: theFuture },
    });

    const customAuthConnector = new CustomAuthConnector();

    const options: OAuth2CreateOptionsWithAuthConnector = {
      scopeTransform,
      defaultScopes: ['myScope'],
      authConnector: customAuthConnector,
    };
    const oauth2 = OAuth2.create(options);

    expect(await oauth2.getAccessToken('my-scope my-scope2')).toBe(
      'access-token',
    );
    expect(getSession).toHaveBeenCalledWith(
      expect.objectContaining({ scopes: new Set(['my-scope', 'my-scope2']) }),
    );
  });
});
