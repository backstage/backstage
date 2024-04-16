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

import { getGithubIntegrationConfig } from './GitHub';
import {
  ScmIntegrationRegistry,
  GithubIntegration,
  GithubIntegrationConfig,
} from '@backstage/integration';

describe('GitHub', () => {
  const githubIntegrationConfig: GithubIntegrationConfig = {
    host: 'https://github.com',
    apiBaseUrl: 'https://api.github.com',
    rawBaseUrl: 'https://raw.githubusercontent.com',
    token: 'token',
  };
  const githubIntegration: GithubIntegration = new GithubIntegration(
    githubIntegrationConfig,
  );
  const mockIntegration = {
    byUrl: jest.fn(),
    list: jest.fn(),
    byHost: jest.fn(),
  };
  const mockGitHubIntegration = {
    byUrl: jest.fn(() => {
      return githubIntegration;
    }),
    list: jest.fn(),
    byHost: jest.fn(),
  };
  const scmIntegrationsApi: ScmIntegrationRegistry = {
    awsCodeCommit: mockIntegration,
    awsS3: mockIntegration,
    azure: mockIntegration,
    bitbucket: mockIntegration,
    bitbucketCloud: mockIntegration,
    bitbucketServer: mockIntegration,
    gerrit: mockIntegration,
    github: mockGitHubIntegration,
    gitlab: mockIntegration,
    gitea: mockIntegration,
    resolveUrl: jest.fn(),
    resolveEditUrl: jest.fn(),
    list: jest.fn(),
    byUrl: jest.fn(),
    byHost: jest.fn(),
  };
  it('tests getGithubIntegrationConfig', () => {
    const location = 'https://github.com/backstage/backstage';
    expect(scmIntegrationsApi.github.byUrl).not.toHaveBeenCalled();
    const result = getGithubIntegrationConfig(scmIntegrationsApi, location);
    expect(scmIntegrationsApi.github.byUrl).toHaveBeenCalledWith(location);
    expect(scmIntegrationsApi.github.byUrl).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      githubIntegrationConfig: {
        apiBaseUrl: 'https://api.github.com',
        host: 'https://github.com',
        rawBaseUrl: 'https://raw.githubusercontent.com',
        token: 'token',
      },
      owner: 'backstage',
      repo: 'backstage',
    });
  });
});
