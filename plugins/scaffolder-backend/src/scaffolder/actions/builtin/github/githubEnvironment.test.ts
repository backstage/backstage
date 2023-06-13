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

import { PassThrough } from 'stream';
import { createGithubEnvironmentAction } from './githubEnvironment';
import { getVoidLogger } from '@backstage/backend-common';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';

const mockOctokit = {
  rest: {
    actions: {
      getRepoPublicKey: jest.fn(),
      createEnvironmentVariable: jest.fn(),
      createOrUpdateEnvironmentSecret: jest.fn(),
    },
    repos: {
      createDeploymentBranchPolicy: jest.fn(),
      createOrUpdateEnvironment: jest.fn(),
      get: jest.fn(),
    },
  },
};
jest.mock('octokit', () => ({
  Octokit: class {
    constructor() {
      return mockOctokit;
    }
  },
}));

const publicKey = '2Sg8iYjAxxmI2LvUXpJjkYrMxURPc8r+dB7TJyvvcCU=';

describe('github:environment:create', () => {
  const config = new ConfigReader({
    integrations: {
      github: [
        { host: 'github.com', token: 'tokenlols' },
        { host: 'ghe.github.com' },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  let action: TemplateAction<any>;

  const mockContext = {
    input: {
      repoUrl: 'github.com?repo=repository&owner=owner',
      name: 'envname',
    },
    workspacePath: 'lol',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  beforeEach(() => {
    mockOctokit.rest.actions.getRepoPublicKey.mockResolvedValue({
      data: {
        key: publicKey,
        key_id: 'keyid',
      },
    });
    mockOctokit.rest.repos.get.mockResolvedValue({
      data: {
        id: 'repoid',
      },
    });

    action = createGithubEnvironmentAction({
      integrations,
    });
  });

  afterEach(jest.resetAllMocks);

  it('should work happy path', async () => {
    await action.handler(mockContext);

    expect(
      mockOctokit.rest.repos.createOrUpdateEnvironment,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      environment_name: 'envname',
      deployment_branch_policy: null,
    });
  });

  it('should work specify deploymentBranchPolicy protected', async () => {
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        deploymentBranchPolicy: {
          protected_branches: true,
          custom_branch_policies: false,
        },
      },
    });

    expect(
      mockOctokit.rest.repos.createOrUpdateEnvironment,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      environment_name: 'envname',
      deployment_branch_policy: {
        protected_branches: true,
        custom_branch_policies: false,
      },
    });
  });
  it('should work specify deploymentBranchPolicy custom', async () => {
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        deploymentBranchPolicy: {
          protected_branches: false,
          custom_branch_policies: true,
        },
        customBranchPolicyNames: ['main', '*.*.*'],
      },
    });

    expect(
      mockOctokit.rest.repos.createOrUpdateEnvironment,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      environment_name: 'envname',
      deployment_branch_policy: {
        protected_branches: false,
        custom_branch_policies: true,
      },
    });

    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      environment_name: 'envname',
      name: 'main',
    });
    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      environment_name: 'envname',
      name: '*.*.*',
    });
  });

  it('should work specify environment variables', async () => {
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        environmentVariables: {
          key1: 'val1',
          key2: 'val2',
        },
      },
    });

    expect(
      mockOctokit.rest.repos.createOrUpdateEnvironment,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      environment_name: 'envname',
      deployment_branch_policy: null,
    });

    expect(
      mockOctokit.rest.actions.createEnvironmentVariable,
    ).toHaveBeenCalledTimes(2);
    expect(
      mockOctokit.rest.actions.createEnvironmentVariable,
    ).toHaveBeenCalledWith({
      repository_id: 'repoid',
      environment_name: 'envname',
      name: 'key1',
      value: 'val1',
    });
    expect(
      mockOctokit.rest.actions.createEnvironmentVariable,
    ).toHaveBeenCalledWith({
      repository_id: 'repoid',
      environment_name: 'envname',
      name: 'key2',
      value: 'val2',
    });
  });

  it('should work specify secrets', async () => {
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        secrets: {
          key1: 'val1',
          key2: 'val2',
        },
      },
    });

    expect(
      mockOctokit.rest.repos.createOrUpdateEnvironment,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      environment_name: 'envname',
      deployment_branch_policy: null,
    });

    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).toHaveBeenCalledTimes(2);
    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).toHaveBeenCalledWith({
      repository_id: 'repoid',
      environment_name: 'envname',
      secret_name: 'key1',
      key_id: 'keyid',
      encrypted_value: expect.any(String),
    });
    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).toHaveBeenCalledWith({
      repository_id: 'repoid',
      environment_name: 'envname',
      secret_name: 'key2',
      key_id: 'keyid',
      encrypted_value: expect.any(String),
    });
  });
});
