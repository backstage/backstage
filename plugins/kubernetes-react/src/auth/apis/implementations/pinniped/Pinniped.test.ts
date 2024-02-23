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

import Pinniped from './Pinniped';
import { ConfigReader } from '@backstage/config';
import {
  MockOAuthApi,
  OAuth2Session,
  UrlPatternDiscovery,
} from '@backstage/core-app-api';

const createSession = jest.fn();
const refreshSession = jest.fn();

jest.mock('../../../AuthConnector/AudienceScopedAuthConnector', () => ({
  ...(jest.requireActual(
    '../../../AuthConnector/AudienceScopedAuthConnector',
  ) as any),
  AudienceScopedAuthConnector: class {
    createSession = createSession;
    refreshSession = refreshSession;
  },
}));

describe('Pinniped', () => {
  beforeEach(() => {
    createSession.mockReset();
    refreshSession.mockReset();
  });

  it('provisions fresh token', async () => {
    refreshSession.mockRejectedValue(
      new Error('Auth refresh request failed, Unauthorized'),
    );

    const createdSession: OAuth2Session = {
      providerInfo: {
        idToken: 'It is a cluster scope IdToken',
        accessToken: '',
        scopes: new Set(),
        expiresAt: undefined,
      },
      profile: {
        email: undefined,
        displayName: undefined,
        picture: undefined,
      },
    };

    createSession.mockResolvedValue(createdSession);

    const pinnipedAuth = Pinniped.create({
      configApi: new ConfigReader(undefined),
      oauthRequestApi: new MockOAuthApi(),
      discoveryApi: UrlPatternDiscovery.compile(
        'http://backstage.test/api/{{ pluginId }}',
      ),
    });

    const idToken = await pinnipedAuth.getClusterScopedIdToken('myAudience');

    expect(idToken).toBe('It is a cluster scope IdToken');
  });

  it('The session is renewed when there is less than 5 minutes until expiration', async () => {
    refreshSession.mockRejectedValue(
      new Error('Auth refresh request failed, Unauthorized'),
    );

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + 60 * 5 - 1);

    const createdSession: OAuth2Session = {
      providerInfo: {
        idToken: 'It is a cluster scope IdToken',
        accessToken: '',
        scopes: new Set(),
        expiresAt,
      },
      profile: {
        email: undefined,
        displayName: undefined,
        picture: undefined,
      },
    };

    createSession.mockResolvedValue(createdSession);

    const pinnipedAuth = Pinniped.create({
      configApi: new ConfigReader(undefined),
      oauthRequestApi: new MockOAuthApi(),
      discoveryApi: UrlPatternDiscovery.compile(
        'http://backstage.test/api/{{ pluginId }}',
      ),
    });

    await pinnipedAuth.getClusterScopedIdToken('myAudience');

    const refreshedSession: OAuth2Session = {
      providerInfo: {
        idToken: 'A refreshed cluster scope IdToken',
        accessToken: '',
        scopes: new Set(),
        expiresAt: undefined,
      },
      profile: {
        email: undefined,
        displayName: undefined,
        picture: undefined,
      },
    };

    refreshSession.mockResolvedValue(refreshedSession);

    const idToken2 = await pinnipedAuth.getClusterScopedIdToken('myAudience');

    expect(idToken2).toBe('A refreshed cluster scope IdToken');
    expect(createSession).toHaveBeenCalledTimes(1);
    expect(refreshSession).toHaveBeenCalledTimes(2);
  });

  it('The session is not renewed when there is more than 5 minutes to expire', async () => {
    refreshSession.mockRejectedValue(
      new Error('Auth refresh request failed, Unauthorized'),
    );

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + 60 * 5 + 5);

    const createdSession: OAuth2Session = {
      providerInfo: {
        idToken: 'It is a cluster scope IdToken',
        accessToken: '',
        scopes: new Set(),
        expiresAt,
      },
      profile: {
        email: undefined,
        displayName: undefined,
        picture: undefined,
      },
    };

    createSession.mockResolvedValue(createdSession);

    const pinnipedAuth = Pinniped.create({
      configApi: new ConfigReader(undefined),
      oauthRequestApi: new MockOAuthApi(),
      discoveryApi: UrlPatternDiscovery.compile(
        'http://backstage.test/api/{{ pluginId }}',
      ),
    });

    const idToken = await pinnipedAuth.getClusterScopedIdToken('myAudience');

    expect(idToken).toBe('It is a cluster scope IdToken');
    expect(createSession).toHaveBeenCalledTimes(1);
    expect(refreshSession).toHaveBeenCalledTimes(1);

    const idToken2 = await pinnipedAuth.getClusterScopedIdToken('myAudience');

    expect(idToken2).toBe('It is a cluster scope IdToken');
    expect(createSession).toHaveBeenCalledTimes(1);
    expect(refreshSession).toHaveBeenCalledTimes(1);
  });

  it('uses refresh token when present', async () => {
    const refreshedSession: OAuth2Session = {
      providerInfo: {
        idToken: 'It is a refresh IdToken',
        accessToken: '',
        scopes: new Set(),
        expiresAt: undefined,
      },
      profile: {
        email: undefined,
        displayName: undefined,
        picture: undefined,
      },
    };

    refreshSession.mockResolvedValue(refreshedSession);

    const createdSession: OAuth2Session = {
      providerInfo: {
        idToken: 'It is a cluster scope IdToken',
        accessToken: '',
        scopes: new Set(),
        expiresAt: undefined,
      },
      profile: {
        email: undefined,
        displayName: undefined,
        picture: undefined,
      },
    };

    createSession.mockResolvedValue(createdSession);

    const pinnipedAuth = Pinniped.create({
      configApi: new ConfigReader(undefined),
      oauthRequestApi: new MockOAuthApi(),
      discoveryApi: UrlPatternDiscovery.compile(
        'http://backstage.test/api/{{ pluginId }}',
      ),
    });

    const idToken = await pinnipedAuth.getClusterScopedIdToken('myAudience');

    expect(idToken).toBe('It is a refresh IdToken');
  });
});
