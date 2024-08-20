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

import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { ConfigReader } from '@backstage/config';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { createGithubPagesEnableAction } from './githubPagesEnable';
import { examples } from './githubPagesEnable.examples';
import yaml from 'yaml';

const mockOctokit = {
  request: jest.fn(),
};

jest.mock('octokit', () => ({
  Octokit: class {
    constructor() {
      return mockOctokit;
    }
  },
}));

describe('github:pages', () => {
  const config = new ConfigReader({
    integrations: {
      github: [
        { host: 'github.com', token: 'mock-token' },
        { host: 'ghe.github.com' },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  let githubCredentialsProvider: GithubCredentialsProvider;
  let action: TemplateAction<any>;

  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'github.com?repo=repo&owner=owner',
      buildType: 'workflow',
      sourceBranch: 'main',
      sourcePath: '/',
      token: 'gph_YourGitHubToken',
    },
  });

  beforeEach(() => {
    githubCredentialsProvider =
      DefaultGithubCredentialsProvider.fromIntegrations(integrations);
    action = createGithubPagesEnableAction({
      integrations,
      githubCredentialsProvider,
    });
  });

  afterEach(jest.resetAllMocks);

  it(`Should ${examples[0].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[0].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.request).toHaveBeenCalledWith(
      'POST /repos/{owner}/{repo}/pages',
      {
        owner: 'owner',
        repo: 'repo',
        build_type: 'workflow',
        source: {
          branch: 'main',
          path: '/',
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
  });
  it(`Should ${examples[1].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[1].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.request).toHaveBeenCalledWith(
      'POST /repos/{owner}/{repo}/pages',
      {
        owner: 'customOwner',
        repo: 'customPathRepo',
        build_type: 'workflow',
        source: {
          branch: 'main',
          path: '/docs',
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
  });

  it(`Should ${examples[2].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[2].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });
    expect(mockOctokit.request).toHaveBeenCalledWith(
      'POST /repos/{owner}/{repo}/pages',
      {
        owner: 'legacyOwner',
        repo: 'legacyRepo',
        build_type: 'legacy',
        source: {
          branch: 'main',
          path: '/',
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
  });

  it(`Should ${examples[3].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[3].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });
    expect(mockOctokit.request).toHaveBeenCalledWith(
      'POST /repos/{owner}/{repo}/pages',
      {
        owner: 'branchOwner',
        repo: 'customBranchRepo',
        build_type: 'workflow',
        source: {
          branch: 'develop',
          path: '/',
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
  });
  it(`Should ${examples[4].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[4].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });
    expect(mockOctokit.request).toHaveBeenCalledWith(
      'POST /repos/{owner}/{repo}/pages',
      {
        owner: 'customOwner',
        repo: 'fullCustomRepo',
        build_type: 'workflow',
        source: {
          branch: 'main',
          path: '/docs',
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
  });

  it(`Should ${examples[5].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[5].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });
    expect(mockOctokit.request).toHaveBeenCalledWith(
      'POST /repos/{owner}/{repo}/pages',
      {
        owner: 'minimalOwner',
        repo: 'minimalRepo',
        build_type: 'workflow',
        source: {
          branch: 'main',
          path: '/',
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
  });
  it(`Should ${examples[6].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[6].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });
    expect(mockOctokit.request).toHaveBeenCalledWith(
      'POST /repos/{owner}/{repo}/pages',
      {
        owner: 'customOwner',
        repo: 'customBuildPathRepo',
        build_type: 'legacy',
        source: {
          branch: 'main',
          path: '/custom-path',
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
  });

  it(`Should ${examples[7].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[7].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });
    expect(mockOctokit.request).toHaveBeenCalledWith(
      'POST /repos/{owner}/{repo}/pages',
      {
        owner: 'branchPathOwner',
        repo: 'customBranchPathRepo',
        build_type: 'workflow',
        source: {
          branch: 'feature-branch',
          path: '/project-docs',
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
  });

  it(`Should ${examples[8].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[8].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });
    expect(mockOctokit.request).toHaveBeenCalledWith(
      'POST /repos/{owner}/{repo}/pages',
      {
        owner: 'customOwnerName',
        repo: 'customRepoName',
        build_type: 'workflow',
        source: {
          branch: 'main',
          path: '/',
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
  });

  it(`Should ${examples[9].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[9].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });
    expect(mockOctokit.request).toHaveBeenCalledWith(
      'POST /repos/{owner}/{repo}/pages',
      {
        owner: 'tokenOwner',
        repo: 'customTokenRepo',
        build_type: 'workflow',
        source: {
          branch: 'main',
          path: '/site',
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
  });

  it(`Should ${examples[10].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[10].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });
    expect(mockOctokit.request).toHaveBeenCalledWith(
      'POST /repos/{owner}/{repo}/pages',
      {
        owner: 'tokenOwner',
        repo: 'specificTokenRepo',
        build_type: 'workflow',
        source: {
          branch: 'main',
          path: '/',
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
  });

  it(`Should ${examples[11].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[11].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });
    expect(mockOctokit.request).toHaveBeenCalledWith(
      'POST /repos/{owner}/{repo}/pages',
      {
        owner: 'docsOwner',
        repo: 'docSiteRepo',
        build_type: 'workflow',
        source: {
          branch: 'docs-branch',
          path: '/docs-site',
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
  });
});
