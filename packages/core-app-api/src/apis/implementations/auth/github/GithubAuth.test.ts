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

import { UrlPatternDiscovery } from '../../DiscoveryApi';
import MockOAuthApi from '../../OAuthRequestApi/MockOAuthApi';
import GithubAuth from './GithubAuth';

const getSession = jest.fn();

jest.mock('../../../../lib/AuthSessionManager', () => ({
  ...(jest.requireActual('../../../../lib/AuthSessionManager') as any),
  RefreshingAuthSessionManager: class {
    getSession = getSession;
  },
}));

describe('GithubAuth', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should forward access token request to session manager', async () => {
    const githubAuth = GithubAuth.create({
      oauthRequestApi: new MockOAuthApi(),
      discoveryApi: UrlPatternDiscovery.compile('http://example.com'),
    });

    githubAuth.getAccessToken('repo');
    expect(getSession).toHaveBeenCalledWith({
      scopes: new Set(['repo']),
    });
  });
});
