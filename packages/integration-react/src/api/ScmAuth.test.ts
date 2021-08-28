/*
 * Copyright 2021 The Backstage Authors
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

import { OAuthApi } from '@backstage/core-plugin-api';
import { ScmAuth } from './ScmAuth';

class MockOAuthApi implements OAuthApi {
  constructor(private readonly accessToken: string) {}

  async getAccessToken() {
    return this.accessToken;
  }
}

const mockApis = {
  github: new MockOAuthApi('github-access-token'),
  ghe: new MockOAuthApi('ghe-access-token'),
};

describe('ScmAuth', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should provide credentials for GitHub and GHE', async () => {
    const api = ScmAuth.mux(
      ScmAuth.forGithub(mockApis.github),
      ScmAuth.forGithub(mockApis.ghe, {
        hostname: 'ghe.example.com',
      }),
    );

    await expect(
      api.getCredentials({ url: 'https://github.com/backstage/backstage' }),
    ).resolves.toEqual({
      token: 'github-access-token',
      headers: {
        Authorization: 'Bearer github-access-token',
      },
    });
    await expect(
      api.getCredentials({
        url: 'https://ghe.example.com/backstage/backstage',
      }),
    ).resolves.toEqual({
      token: 'ghe-access-token',
      headers: {
        Authorization: 'Bearer ghe-access-token',
      },
    });
  });
});
