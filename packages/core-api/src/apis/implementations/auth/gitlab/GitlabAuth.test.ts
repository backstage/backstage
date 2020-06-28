/*
 * Copyright 2020 Spotify AB
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

import GitlabAuth from './GitlabAuth';

describe('GitlabAuth', () => {
  it('should get access token', async () => {
    const getSession = jest
      .fn()
      .mockResolvedValue({ providerInfo: { accessToken: 'access-token' } });
    const gitlabAuth = new GitlabAuth({ getSession } as any);

    expect(await gitlabAuth.getAccessToken()).toBe('access-token');
    expect(getSession).toBeCalledTimes(1);
  });

  it('should normalize scope', () => {
    const tests = [
      {
        arguments: ['read_user api write_repository'],
        expect: new Set(['read_user', 'api', 'write_repository']),
      },
      {
        arguments: ['read_repository sudo'],
        expect: new Set(['read_repository', 'sudo']),
      },
    ];

    for (const test of tests) {
      expect(GitlabAuth.normalizeScope(...test.arguments)).toEqual(test.expect);
    }
  });
});
