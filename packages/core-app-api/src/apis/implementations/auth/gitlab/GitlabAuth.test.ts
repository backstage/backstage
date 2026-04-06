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

import { vi } from 'vitest';

import MockOAuthApi from '../../OAuthRequestApi/MockOAuthApi';
import { UrlPatternDiscovery } from '../../DiscoveryApi';
import GitlabAuth from './GitlabAuth';
import { mockApis } from '@backstage/test-utils';

const getSession = vi.fn();

vi.mock('../../../../lib/AuthSessionManager', async () => ({
  ...((await vi.importActual('../../../../lib/AuthSessionManager')) as any),
  RefreshingAuthSessionManager: class {
    getSession = getSession;
  },
}));

describe('GitlabAuth', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it.each([
    [
      'read_user api write_repository',
      ['read_user', 'api', 'write_repository'],
    ],
    ['read_repository sudo', ['read_repository', 'sudo']],
  ])(`should normalize scopes correctly - %p`, (scope, scopes) => {
    const configApi = mockApis.config();

    const gitlabAuth = GitlabAuth.create({
      configApi: configApi,
      oauthRequestApi: new MockOAuthApi(),
      discoveryApi: UrlPatternDiscovery.compile('http://example.com'),
    });

    gitlabAuth.getAccessToken(scope);
    expect(getSession).toHaveBeenCalledWith({ scopes: new Set(scopes) });
  });
});
