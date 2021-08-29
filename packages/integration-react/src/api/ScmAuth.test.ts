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

  getAccessToken = jest.fn(async () => {
    return this.accessToken;
  });
}

describe('ScmAuth', () => {
  it('should provide credentials for GitHub and GHE', async () => {
    const mockGithubAuth = new MockOAuthApi('github-access-token');
    const mockGheAuth = new MockOAuthApi('ghe-access-token');

    const api = ScmAuth.mux(
      ScmAuth.forGithub(mockGithubAuth),
      ScmAuth.forGithub(mockGheAuth, {
        host: 'ghe.example.com',
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
        additionalScope: {
          repoWrite: true,
        },
      }),
    ).resolves.toEqual({
      token: 'ghe-access-token',
      headers: {
        Authorization: 'Bearer ghe-access-token',
      },
    });

    expect(mockGithubAuth.getAccessToken).toHaveBeenCalledTimes(1);
    expect(mockGithubAuth.getAccessToken).toHaveBeenCalledWith(
      ['repo', 'read:org', 'read:user'],
      {},
    );
    expect(mockGheAuth.getAccessToken).toHaveBeenCalledTimes(1);
    expect(mockGheAuth.getAccessToken).toHaveBeenCalledWith(
      ['repo', 'read:org', 'read:user', 'gist'],
      {},
    );
  });

  it('should use correct scopes for each provider', async () => {
    const mockAuthApi = {
      getAccessToken: async (scopes: string[]) => {
        return scopes.join(' ');
      },
    };

    const githubAuth = ScmAuth.forGithub(mockAuthApi);
    await expect(
      githubAuth.getCredentials({ url: 'http://example.com' }),
    ).resolves.toMatchObject({
      token: 'repo read:org read:user',
    });
    await expect(
      githubAuth.getCredentials({
        url: 'http://example.com',
        additionalScope: { repoWrite: true },
      }),
    ).resolves.toMatchObject({
      token: 'repo read:org read:user gist',
    });

    const gitlabAuth = ScmAuth.forGitlab(mockAuthApi);
    await expect(
      gitlabAuth.getCredentials({ url: 'http://example.com' }),
    ).resolves.toMatchObject({
      token: 'read_user read_api read_repository',
    });
    await expect(
      gitlabAuth.getCredentials({
        url: 'http://example.com',
        additionalScope: { repoWrite: true },
      }),
    ).resolves.toMatchObject({
      token: 'read_user read_api write_repository api',
    });

    const azureAuth = ScmAuth.forAzure(mockAuthApi);
    await expect(
      azureAuth.getCredentials({ url: 'http://example.com' }),
    ).resolves.toMatchObject({
      token: 'vso.build vso.code vso.graph vso.project vso.profile',
    });
    await expect(
      azureAuth.getCredentials({
        url: 'http://example.com',
        additionalScope: { repoWrite: true },
      }),
    ).resolves.toMatchObject({
      token: 'vso.build vso.code_manage vso.graph vso.project vso.profile',
    });

    const bitbucketAuth = ScmAuth.forBitbucket(mockAuthApi);
    await expect(
      bitbucketAuth.getCredentials({ url: 'http://example.com' }),
    ).resolves.toMatchObject({
      token: 'account team pullrequest snippet issue',
    });
    await expect(
      bitbucketAuth.getCredentials({
        url: 'http://example.com',
        additionalScope: { repoWrite: true },
      }),
    ).resolves.toMatchObject({
      token: 'account team pullrequest:write snippet:write issue:write',
    });
  });

  it('should throw an error for unknown URLs', async () => {
    const emptyMux = ScmAuth.mux();
    await expect(
      emptyMux.getCredentials({ url: 'http://example.com' }),
    ).rejects.toThrow(
      "No authentication provider available for access to 'http://example.com'",
    );

    const scmAuth = ScmAuth.mux(
      ScmAuth.forAuthApi(new MockOAuthApi('token'), {
        host: 'example.com',
        scopeMapping: {
          default: ['a'],
          repoWrite: ['b'],
        },
      }),
    );
    await expect(
      scmAuth.getCredentials({ url: 'http://example.com' }),
    ).resolves.toMatchObject({ token: 'token' });
    await expect(
      scmAuth.getCredentials({ url: 'http://not.example.com' }),
    ).rejects.toThrow(
      "No authentication provider available for access to 'http://not.example.com'",
    );
    await expect(
      scmAuth.getCredentials({ url: 'http://example.com:8080' }),
    ).rejects.toThrow(
      "No authentication provider available for access to 'http://example.com:8080'",
    );
  });
});
