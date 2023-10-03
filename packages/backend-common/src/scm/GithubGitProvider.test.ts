/*
 * Copyright 2023 The Backstage Authors
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
import { GithubCredentialsProvider } from '@backstage/integration';
import { GithubGitProvider } from './GithubGitProvider';
import { Git } from '@backstage/backend-common';

describe('GithubGitProvider', () => {
  let githubGitProvider: GithubGitProvider;
  beforeEach(() => {
    jest.resetAllMocks();

    jest.spyOn(Git, 'fromAuth');
    const credentialsProvider: GithubCredentialsProvider = {
      async getCredentials() {
        return {
          token: 'test-token',
          headers: {},
          type: 'token',
        };
      },
    };
    githubGitProvider = new GithubGitProvider(credentialsProvider);
  });

  it('should return a Git instance with the correct authentication', async () => {
    const git = await githubGitProvider.getGit(
      'https://github.com/backstage/backstage.git',
    );
    expect(git).toBeInstanceOf(Git);
    expect(Git.fromAuth).toHaveBeenCalledWith({
      username: 'x-access-token',
      password: 'test-token',
    });
  });
});
