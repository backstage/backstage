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

import {
  getGitRepoType,
  getGithubHostToken,
  getTokenForGitRepo,
  getGitlabHostToken,
  getAzureHostToken,
} from './git-auth';
import { ConfigReader } from '@backstage/config';

const createConfig = (data: any) =>
  ConfigReader.fromConfigs([
    {
      context: 'app-config.yaml',
      data,
    },
  ]);

const testConfig = createConfig({
  integrations: {
    github: [
      {
        host: 'github.com',
        token: 'githubToken',
      },
    ],
    azure: [
      {
        host: 'dev.azure.com',
        token: 'azureToken',
      },
    ],
    gitlab: [
      {
        host: 'gitlab.com',
        token: 'gitlabToken',
      },
    ],
  },
});

describe('getGitRepoType', () => {
  it('should get the repo type github', async () => {
    const url = 'https://github.com/backstage/backstage/blob/master/subfolder/';

    const output = getGitRepoType(url);

    expect(output).toBe('github');
  });

  it('should get the repo type gitlab', async () => {
    const url = 'https://gitlab.com/backstage/backstage/blob/master/subfolder/';

    const output = getGitRepoType(url);

    expect(output).toBe('gitlab');
  });
  it('should get the repo type azure/api', async () => {
    const url = 'https://azure.com/backstage/backstage/blob/master/subfolder/';

    const output = getGitRepoType(url);

    expect(output).toBe('azure/api');
  });
});
describe('getGithubHostToken', () => {
  it('should get the github host token from the config file', async () => {
    const host = 'github.com';

    const output = getGithubHostToken(testConfig, host);

    expect(output).toBe('githubToken');
  });
});
describe('getGitlabHostToken', () => {
  it('should get the gitlab token for the git repo', async () => {
    const host = 'gitlab.com';
    const output = getGitlabHostToken(testConfig, host);

    expect(output).toBe('gitlabToken');
  });
});
describe('getAzureHostToken', () => {
  it('should get the azure token for the repo', async () => {
    const host = 'dev.azure.com';
    const output = getAzureHostToken(testConfig, host);

    expect(output).toBe('azureToken');
  });
});
describe('getTokenForGitRepo', () => {
  it('should get the github token for github repo from env', async () => {
    process.env.GITHUB_TOKEN = 'githubMockToken';
    const repositoryUrl =
      'https://github.com/backstage/backstage/blob/master/subfolder/';

    const output = await getTokenForGitRepo(repositoryUrl);

    expect(output).toBe('githubMockToken');
  });
  it('should get the gitlab token for git repo from env', async () => {
    process.env.GITLAB_TOKEN = 'gitlabMockToken';
    const repositoryUrl =
      'https://gitlab.com/backstage/backstage/blob/master/subfolder/';

    const output = await getTokenForGitRepo(repositoryUrl);

    expect(output).toBe('gitlabMockToken');
  });
  it('should get the azure token from env', async () => {
    process.env.AZURE_TOKEN = 'azureMockToken';
    const repositoryUrl =
      'https://azure.com/backstage/backstage/blob/master/subfolder/';

    const output = await getTokenForGitRepo(repositoryUrl);

    expect(output).toBe('azureMockToken');
  });
  it('should return undefined due to GITHUB_TOKEN not beein set', async () => {
    process.env.GITHUB_TOKEN = undefined;
    const repositoryUrl =
      'https://github.com/backstage/backstage/blob/master/subfolder/';

    const output = await getTokenForGitRepo(repositoryUrl);

    expect(output).toBe('undefined');
  });
});
