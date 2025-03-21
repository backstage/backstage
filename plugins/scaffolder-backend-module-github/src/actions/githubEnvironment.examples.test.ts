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
import { CatalogApi } from '@backstage/catalog-client';

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
    teams: {
      getByName: jest.fn(),
    },
    users: {
      getByUsername: jest.fn(),
    },
  },
};
const mockCatalogClient: Partial<CatalogApi> = {
  getEntitiesByRefs: jest.fn(),
};
jest.mock('octokit', () => ({
  Octokit: class {
    constructor() {
      return mockOctokit;
    }
  },
}));
jest.mock('@backstage/catalog-client', () => ({
  CatalogClient: mockCatalogClient,
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
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: {
        id: 1,
      },
    });
    mockOctokit.rest.teams.getByName.mockResolvedValue({
      data: {
        id: 2,
      },
    });
    (mockCatalogClient.getEntitiesByRefs as jest.Mock).mockResolvedValue({
      items: [
        {
          kind: 'User',
          metadata: {
            name: 'johndoe',
          },
        },
        {
          kind: 'Group',
          metadata: {
            name: 'team-a',
          },
        },
      ],
    });

    action = createGithubEnvironmentAction({
      integrations,
      catalogClient: mockCatalogClient as CatalogApi,
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
      deployment_branch_policy: undefined,
      wait_timer: undefined,
      reviewers: undefined,
      prevent_self_review: undefined,
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
      wait_timer: undefined,
      reviewers: undefined,
      prevent_self_review: undefined,
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
      wait_timer: undefined,
      reviewers: undefined,
      prevent_self_review: undefined,
    });

    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      environment_name: 'envname',
      name: 'main',
      type: 'branch',
    });

    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      environment_name: 'envname',
      name: '*.*.*',
      type: 'branch',
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
      deployment_branch_policy: undefined,
      wait_timer: undefined,
      reviewers: undefined,
      prevent_self_review: undefined,
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
      owner: 'owner',
      repo: 'repository',
      environment_name: 'envname',
      name: 'key1',
      value: 'val1',
    });
    expect(
      mockOctokit.rest.actions.createEnvironmentVariable,
    ).toHaveBeenCalledWith({
      repository_id: 'repoid',
      owner: 'owner',
      repo: 'repository',
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
      owner: 'owner',
      repo: 'repository',
      environment_name: 'envname',
      secret_name: 'secret1',
      key_id: 'keyid',
      encrypted_value: expect.any(String),
    });
    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).toHaveBeenCalledWith({
      repository_id: 'repoid',
      owner: 'owner',
      repo: 'repository',
      environment_name: 'envname',
      secret_name: 'secret2',
      key_id: 'keyid',
      encrypted_value: expect.any(String),
    });
  });

  it(`should ${examples[4].description}`, async () => {
    const input = yaml.parse(examples[4].example).steps[0].input;

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
      deployment_branch_policy: undefined,
      wait_timer: undefined,
      reviewers: undefined,
      prevent_self_review: undefined,
    });

    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).toHaveBeenCalledTimes(2);
    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).toHaveBeenCalledWith({
      environment_name: 'envname',
      name: 'release/*/*',
      owner: 'owner',
      repo: 'repository',
      type: 'tag',
    });
    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).toHaveBeenCalledWith({
      environment_name: 'envname',
      name: 'v*.*.*',
      owner: 'owner',
      repo: 'repository',
      type: 'tag',
    });

    expect(
      mockOctokit.rest.actions.createEnvironmentVariable,
    ).not.toHaveBeenCalled();

    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).not.toHaveBeenCalled();
  });

  it(`should ${examples[5].description}`, async () => {
    const input = yaml.parse(examples[5].example).steps[0].input;

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
        custom_branch_policies: true,
        protected_branches: false,
      },
      wait_timer: undefined,
      reviewers: undefined,
      prevent_self_review: undefined,
    });

    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).toHaveBeenCalledTimes(4);
    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).toHaveBeenCalledWith({
      environment_name: 'envname',
      name: 'release/*',
      owner: 'owner',
      repo: 'repository',
      type: 'tag',
    });
    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).toHaveBeenCalledWith({
      environment_name: 'envname',
      name: 'feature/*',
      owner: 'owner',
      repo: 'repository',
      type: 'branch',
    });

    expect(
      mockOctokit.rest.actions.createEnvironmentVariable,
    ).not.toHaveBeenCalled();

    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).not.toHaveBeenCalled();
  });

  it(`should ${examples[6].description}`, async () => {
    const input = yaml.parse(examples[6].example).steps[0].input;

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
        custom_branch_policies: true,
        protected_branches: false,
      },
      wait_timer: undefined,
      reviewers: undefined,
      prevent_self_review: undefined,
    });

    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).toHaveBeenCalledTimes(4);
    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).toHaveBeenCalledWith({
      environment_name: 'envname',
      name: 'dev/*',
      owner: 'owner',
      repo: 'repository',
      type: 'branch',
    });
    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).toHaveBeenCalledWith({
      environment_name: 'envname',
      name: 'test/*',
      owner: 'owner',
      repo: 'repository',
      type: 'branch',
    });

    expect(
      mockOctokit.rest.actions.createEnvironmentVariable,
    ).toHaveBeenCalledTimes(2);

    expect(
      mockOctokit.rest.actions.createEnvironmentVariable,
    ).toHaveBeenCalledWith({
      environment_name: 'envname',
      name: 'API_KEY',
      owner: 'owner',
      repo: 'repository',
      repository_id: 'repoid',
      value: '123456789',
    });
    expect(
      mockOctokit.rest.actions.createEnvironmentVariable,
    ).toHaveBeenCalledWith({
      environment_name: 'envname',
      name: 'NODE_ENV',
      owner: 'owner',
      repo: 'repository',
      repository_id: 'repoid',
      value: 'production',
    });

    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).toHaveBeenCalledTimes(2);
    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).toHaveBeenCalledWith({
      encrypted_value: expect.any(String),
      environment_name: 'envname',
      key_id: 'keyid',
      owner: 'owner',
      repo: 'repository',
      repository_id: 'repoid',
      secret_name: 'API_SECRET',
    });
    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).toHaveBeenCalledWith({
      encrypted_value: expect.any(String),
      environment_name: 'envname',
      key_id: 'keyid',
      owner: 'owner',
      repo: 'repository',
      repository_id: 'repoid',
      secret_name: 'DATABASE_URL',
    });
  });

  it(`should ${examples[7].description}`, async () => {
    const input = yaml.parse(examples[7].example).steps[0].input;

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
      deployment_branch_policy: undefined,
      wait_timer: undefined,
      reviewers: undefined,
      prevent_self_review: undefined,
    });

    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).not.toHaveBeenCalled();

    expect(
      mockOctokit.rest.actions.createEnvironmentVariable,
    ).not.toHaveBeenCalled();

    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).not.toHaveBeenCalled();
  });

  it(`should ${examples[8].description}`, async () => {
    const input = yaml.parse(examples[8].example).steps[0].input;

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
      deployment_branch_policy: undefined,
      wait_timer: undefined,
      reviewers: undefined,
      prevent_self_review: undefined,
    });

    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).not.toHaveBeenCalled();

    expect(
      mockOctokit.rest.actions.createEnvironmentVariable,
    ).not.toHaveBeenCalled();

    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).not.toHaveBeenCalled();
  });

  it(`should ${examples[9].description}`, async () => {
    const input = yaml.parse(examples[9].example).steps[0].input;

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
        custom_branch_policies: true,
        protected_branches: false,
      },
      wait_timer: undefined,
      reviewers: undefined,
      prevent_self_review: undefined,
    });

    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).toHaveBeenCalledTimes(4);
    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).toHaveBeenCalledWith({
      environment_name: 'envname',
      name: 'release/*',
      owner: 'owner',
      repo: 'repository',
      type: 'branch',
    });
    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).toHaveBeenCalledWith({
      environment_name: 'envname',
      name: 'hotfix/*',
      owner: 'owner',
      repo: 'repository',
      type: 'branch',
    });
    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).toHaveBeenCalledWith({
      environment_name: 'envname',
      name: 'v*',
      owner: 'owner',
      repo: 'repository',
      type: 'tag',
    });

    expect(
      mockOctokit.rest.actions.createEnvironmentVariable,
    ).not.toHaveBeenCalled();

    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).not.toHaveBeenCalled();
  });

  it(`should ${examples[10].description}`, async () => {
    const input = yaml.parse(examples[10].example).steps[0].input;

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
      deployment_branch_policy: undefined,
      wait_timer: undefined,
      reviewers: undefined,
      prevent_self_review: undefined,
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
      environment_name: 'envname',
      name: 'VAR1',
      owner: 'owner',
      repo: 'repository',
      repository_id: 'repoid',
      value: 'value1',
    });
    expect(
      mockOctokit.rest.actions.createEnvironmentVariable,
    ).toHaveBeenCalledWith({
      environment_name: 'envname',
      name: 'VAR2',
      owner: 'owner',
      repo: 'repository',
      repository_id: 'repoid',
      value: 'value2',
    });

    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).not.toHaveBeenCalled();
  });

  it(`should ${examples[11].description}`, async () => {
    const input = yaml.parse(examples[11].example).steps[0].input;

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
      deployment_branch_policy: undefined,
      wait_timer: undefined,
      reviewers: undefined,
      prevent_self_review: undefined,
    });

    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).not.toHaveBeenCalled();

    expect(
      mockOctokit.rest.actions.createEnvironmentVariable,
    ).not.toHaveBeenCalled();
    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).toHaveBeenCalledTimes(2);
    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).toHaveBeenCalledWith({
      encrypted_value: expect.any(String),
      environment_name: 'envname',
      key_id: 'keyid',
      owner: 'owner',
      repo: 'repository',
      repository_id: 'repoid',
      secret_name: 'SECRET1',
    });
    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).toHaveBeenCalledWith({
      encrypted_value: expect.any(String),
      environment_name: 'envname',
      key_id: 'keyid',
      owner: 'owner',
      repo: 'repository',
      repository_id: 'repoid',
      secret_name: 'SECRET2',
    });
  });

  it(`should ${examples[12].description}`, async () => {
    const input = yaml.parse(examples[12].example).steps[0].input;

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
        custom_branch_policies: false,
        protected_branches: true,
      },
      wait_timer: undefined,
      reviewers: undefined,
      prevent_self_review: undefined,
    });

    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).not.toHaveBeenCalled();

    expect(
      mockOctokit.rest.actions.createEnvironmentVariable,
    ).not.toHaveBeenCalled();
    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).not.toHaveBeenCalled();
  });

  it(`should ${examples[13].description}`, async () => {
    const input = yaml.parse(examples[13].example).steps[0].input;

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
      deployment_branch_policy: undefined,
      wait_timer: undefined,
      reviewers: undefined,
      prevent_self_review: undefined,
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
      environment_name: 'envname',
      name: 'VAR1',
      owner: 'owner',
      repo: 'repository',
      repository_id: 'repoid',
      value: 'value1',
    });
    expect(
      mockOctokit.rest.actions.createEnvironmentVariable,
    ).toHaveBeenCalledWith({
      environment_name: 'envname',
      name: 'VAR2',
      owner: 'owner',
      repo: 'repository',
      repository_id: 'repoid',
      value: 'value2',
    });

    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).toHaveBeenCalledTimes(2);
    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).toHaveBeenCalledWith({
      encrypted_value: expect.any(String),
      environment_name: 'envname',
      key_id: 'keyid',
      owner: 'owner',
      repo: 'repository',
      repository_id: 'repoid',
      secret_name: 'SECRET1',
    });
    expect(
      mockOctokit.rest.actions.createOrUpdateEnvironmentSecret,
    ).toHaveBeenCalledWith({
      encrypted_value: expect.any(String),
      environment_name: 'envname',
      key_id: 'keyid',
      owner: 'owner',
      repo: 'repository',
      repository_id: 'repoid',
      secret_name: 'SECRET2',
    });
  });

  it(`should ${examples[14].description}`, async () => {
    const input = yaml.parse(examples[14].example).steps[0].input;

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
      deployment_branch_policy: undefined,
      wait_timer: 1000,
      reviewers: undefined,
      prevent_self_review: undefined,
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

  it(`should ${examples[15].description}`, async () => {
    const input = yaml.parse(examples[15].example).steps[0].input;

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
      deployment_branch_policy: undefined,
      wait_timer: undefined,
      reviewers: undefined,
      prevent_self_review: true,
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

  it(`should ${examples[16].description}`, async () => {
    const input = yaml.parse(examples[16].example).steps[0].input;

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
      deployment_branch_policy: undefined,
      wait_timer: undefined,
      reviewers: [
        {
          type: 'User',
          id: 1,
        },
        {
          type: 'Team',
          id: 2,
        },
      ],
      prevent_self_review: undefined,
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
});
