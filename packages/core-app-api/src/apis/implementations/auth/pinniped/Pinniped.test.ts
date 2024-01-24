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
import MockOAuthApi from '../../OAuthRequestApi/MockOAuthApi';
import { UrlPatternDiscovery } from '../../DiscoveryApi';
import { OAuth2Session } from '../oauth2';

const createSession = jest.fn();
const refreshSession = jest.fn();

jest.mock('../../../../lib/AuthConnector/DefaultAuthConnector', () => ({
  ...(jest.requireActual(
    '../../../../lib/AuthConnector/DefaultAuthConnector',
  ) as any),
  DefaultAuthConnector: class {
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
    expect(createSession).toHaveBeenCalledWith(
      expect.objectContaining({ audience: 'myAudience' }),
    );
  });

  it.skip('uses refresh token when present', async () => {
    const refreshedSession: OAuth2Session = {
      providerInfo: {
        idToken: 'Not a cluster scope IdToken',
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

    expect(idToken).toBe('It is a cluster scope IdToken');
  });
});
