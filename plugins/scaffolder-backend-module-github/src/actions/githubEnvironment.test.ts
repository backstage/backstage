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

import { createGithubEnvironmentAction } from './githubEnvironment';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { CatalogApi } from '@backstage/catalog-client';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';

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

  const credentials = mockCredentials.user();

  const token = mockCredentials.service.token({
    onBehalfOf: credentials,
    targetPluginId: 'catalog',
  });

  let action: TemplateAction<any>;

  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'github.com?repo=repository&owner=owner',
      name: 'envname',
    },
    secrets: { backstageToken: token },
  });

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
      auth: mockServices.auth(),
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
      deployment_branch_policy: undefined,
      reviewers: undefined,
      wait_timer: undefined,
      prevent_self_review: undefined,
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
      reviewers: undefined,
      wait_timer: undefined,
      prevent_self_review: undefined,
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
      reviewers: undefined,
      wait_timer: undefined,
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
  });

  it('should work specify deploymentTagPolicy custom', async () => {
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        deploymentBranchPolicy: {
          protected_branches: false,
          custom_branch_policies: true,
        },
        customTagPolicyNames: ['main', '*.*.*'],
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
      reviewers: undefined,
      wait_timer: undefined,
      prevent_self_review: undefined,
    });

    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      environment_name: 'envname',
      name: 'main',
      type: 'tag',
    });
    expect(
      mockOctokit.rest.repos.createDeploymentBranchPolicy,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      environment_name: 'envname',
      name: '*.*.*',
      type: 'tag',
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
      deployment_branch_policy: undefined,
      reviewers: undefined,
      wait_timer: undefined,
      prevent_self_review: undefined,
    });

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
      deployment_branch_policy: undefined,
      reviewers: undefined,
      wait_timer: undefined,
      prevent_self_review: undefined,
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
      secret_name: 'key1',
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
      secret_name: 'key2',
      key_id: 'keyid',
      encrypted_value: expect.any(String),
    });
    expect(
      mockOctokit.rest.actions.getEnvironmentPublicKey,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockOctokit.rest.actions.getEnvironmentPublicKey,
    ).toHaveBeenCalledWith({
      repository_id: 'repoid',
      owner: 'owner',
      repo: 'repository',
      environment_name: 'envname',
    });
  });

  it('should work with wait_timer', async () => {
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        waitTimer: 1000,
      },
    });

    expect(
      mockOctokit.rest.repos.createOrUpdateEnvironment,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      environment_name: 'envname',
      deployment_branch_policy: undefined,
      reviewers: undefined,
      wait_timer: 1000,
      prevent_self_review: undefined,
    });
  });

  it('should work with wait_timer 0', async () => {
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        waitTimer: 0,
      },
    });

    expect(
      mockOctokit.rest.repos.createOrUpdateEnvironment,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      environment_name: 'envname',
      deployment_branch_policy: undefined,
      reviewers: undefined,
      wait_timer: 0,
      prevent_self_review: undefined,
    });
  });

  it('should work with preventSelfReview set to true', async () => {
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        preventSelfReview: true,
      },
    });

    expect(
      mockOctokit.rest.repos.createOrUpdateEnvironment,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      environment_name: 'envname',
      deployment_branch_policy: undefined,
      reviewers: undefined,
      wait_timer: undefined,
      prevent_self_review: true,
    });
  });

  it('should work with preventSelfReview set to false', async () => {
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        preventSelfReview: false,
      },
    });

    expect(
      mockOctokit.rest.repos.createOrUpdateEnvironment,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      environment_name: 'envname',
      deployment_branch_policy: undefined,
      reviewers: undefined,
      wait_timer: undefined,
      prevent_self_review: false,
    });
  });

  it('should work with reviewers', async () => {
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        reviewers: ['group:default/team-a', 'user:default/johndoe'],
      },
    });

    expect(mockCatalogClient.getEntitiesByRefs).toHaveBeenCalledWith(
      {
        entityRefs: ['group:default/team-a', 'user:default/johndoe'],
      },
      { token },
    );

    expect(
      mockOctokit.rest.repos.createOrUpdateEnvironment,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      environment_name: 'envname',
      deployment_branch_policy: undefined,
      wait_timer: undefined,
      prevent_self_review: undefined,
      reviewers: [
        {
          id: 1,
          type: 'User',
        },
        {
          id: 2,
          type: 'Team',
        },
      ],
    });
  });
});
