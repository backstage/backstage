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
import { createGithubEnvironmentAction } from './githubEnvironment';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import yaml from 'yaml';
import { examples } from './gitHubEnvironment.examples';

const mockOctokit = {
  rest: {
    actions: {
      getEnvironmentPublicKey: jest.fn(),
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

describe('github:environment:create examples', () => {
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

  const mockContext = createMockActionContext();

  beforeEach(() => {
    mockOctokit.rest.actions.getEnvironmentPublicKey.mockResolvedValue({
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

  it('Create a GitHub Environment (No Policies, No Variables, No Secrets)', async () => {
    const input = yaml.parse(examples[0].example).steps[0].input;

    await action.handler({
      ...mockContext,
      input,
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
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).not.toHaveBeenCalled();
    expect(
      mockOctokit.rest.actions.createEnvironmentVariable,
    ).not.toHaveBeenCalled();
    expect(
      mockOctokit.rest.actions.getEnvironmentPublicKey,
    ).not.toHaveBeenCalled();
    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).not.toHaveBeenCalled();
  });

  it('Create a GitHub Environment with Protected Branch Policy', async () => {
    const input = yaml.parse(examples[1].example).steps[0].input;

    await action.handler({
      ...mockContext,
      input,
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

    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).not.toHaveBeenCalled();
    expect(
      mockOctokit.rest.actions.createEnvironmentVariable,
    ).not.toHaveBeenCalled();
    expect(
      mockOctokit.rest.actions.getEnvironmentPublicKey,
    ).not.toHaveBeenCalled();
    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).not.toHaveBeenCalled();
  });

  it('Create a GitHub Environment with Custom Branch Policies', async () => {
    const input = yaml.parse(examples[2].example).steps[0].input;

    await action.handler({
      ...mockContext,
      input,
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

    expect(
      mockOctokit.rest.actions.createEnvironmentVariable,
    ).not.toHaveBeenCalled();

    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).not.toHaveBeenCalled();
  });

  it('Create a GitHub Environment with Environment Variables and Secrets', async () => {
    const input = yaml.parse(examples[3].example).steps[0].input;

    await action.handler({
      ...mockContext,
      input,
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
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).not.toHaveBeenCalled();

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

    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).toHaveBeenCalledTimes(2);
    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).toHaveBeenCalledWith({
      repository_id: 'repoid',
      environment_name: 'envname',
      secret_name: 'secret1',
      key_id: 'keyid',
      encrypted_value: expect.any(String),
    });
    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).toHaveBeenCalledWith({
      repository_id: 'repoid',
      environment_name: 'envname',
      secret_name: 'secret2',
      key_id: 'keyid',
      encrypted_value: expect.any(String),
    });
  });
});
