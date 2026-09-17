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
jest.mock('./gitHelpers', () => {
  return {
    ...jest.requireActual('./gitHelpers'),
    enableBranchProtectionOnDefaultRepoBranch: jest.fn(),
    entityRefToName: jest.fn(),
  };
});

jest.mock('@backstage/plugin-scaffolder-node', () => {
  return {
    ...jest.requireActual('@backstage/plugin-scaffolder-node'),
    initRepoAndPush: jest.fn().mockResolvedValue({
      commitHash: '220f19cc36b551763d157f1b5e4a4b446165dbd6',
    }),
    commitAndPushRepo: jest.fn().mockResolvedValue({
      commitHash: '220f19cc36b551763d157f1b5e4a4b446165dbd6',
    }),
  };
});

import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { ConfigReader } from '@backstage/config';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { createPublishGithubAction } from './github';
import { initRepoAndPush } from '@backstage/plugin-scaffolder-node';
import {
  enableBranchProtectionOnDefaultRepoBranch,
  entityRefToName,
} from './gitHelpers';
import { promises as fsPromises } from 'node:fs';
import { Octokit } from 'octokit';

const publicKey = '2Sg8iYjAxxmI2LvUXpJjkYrMxURPc8r+dB7TJyvvcCU=';

const initRepoAndPushMocked = initRepoAndPush as jest.Mock<
  Promise<{ commitHash: string }>
>;

const octokitMock = Octokit as unknown as jest.Mock;
const mockOctokit = {
  rest: {
    users: {
      getByUsername: jest.fn(),
    },
    repos: {
      get: jest
        .fn()
        .mockResolvedValue({ data: { size: 0, default_branch: 'main' } }),
      addCollaborator: jest.fn(),
      createInOrg: jest.fn(),
      createForAuthenticatedUser: jest.fn(),
      replaceAllTopics: jest.fn(),
      createOrUpdateFileContents: jest.fn(),
    },
    teams: {
      getByName: jest.fn(),
      addOrUpdateRepoPermissionsInOrg: jest.fn(),
    },
    actions: {
      createRepoVariable: jest.fn(),
      createOrUpdateRepoSecret: jest.fn(),
      getRepoPublicKey: jest.fn(),
    },
    activity: {
      setRepoSubscription: jest.fn(),
    },
    git: {
      getRef: jest.fn(),
    },
  },
  request: jest.fn(),
  graphql: jest.fn(),
};
jest.mock('octokit', () => ({
  Octokit: jest.fn(),
}));

describe('publish:github', () => {
  const config = new ConfigReader({
    integrations: {
      github: [
        { host: 'github.com', token: 'tokenlols' },
        { host: 'ghe.github.com' },
      ],
    },
  });

  const { entityRefToName: realFamiliarizeEntityName } =
    jest.requireActual('./gitHelpers');
  const integrations = ScmIntegrations.fromConfig(config);
  let githubCredentialsProvider: GithubCredentialsProvider;
  let action: TemplateAction<any, any, any>;

  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'github.com?repo=repo&owner=owner',
      description: 'description',
      repoVisibility: 'private' as const,
      access: 'owner/blam',
    },
  });

  beforeEach(() => {
    octokitMock.mockImplementation(() => mockOctokit);
    initRepoAndPushMocked.mockResolvedValue({
      commitHash: '220f19cc36b551763d157f1b5e4a4b446165dbd6',
    });
    githubCredentialsProvider =
      DefaultGithubCredentialsProvider.fromIntegrations(integrations);
    action = createPublishGithubAction({
      integrations,
      config,
      githubCredentialsProvider,
    });

    // restore real implementation
    (entityRefToName as jest.Mock).mockImplementation(
      realFamiliarizeEntityName,
    );
    mockOctokit.rest.actions.getRepoPublicKey.mockResolvedValue({
      data: {
        key: publicKey,
        key_id: 'keyid',
      },
    });
  });

  afterEach(jest.resetAllMocks);

  it('should pass context logger to Octokit client', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    await action.handler(mockContext);

    expect(octokitMock).toHaveBeenCalledWith(
      expect.objectContaining({ log: mockContext.logger }),
    );
  });

  it('should fail to create if the team is not found in the org', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.teams.getByName.mockRejectedValue({
      response: {
        status: 404,
        data: {
          message: 'Not Found',
          documentation_url:
            'https://docs.github.com/en/rest/teams/teams#add-or-update-team-repository-permissions',
        },
      },
    });

    await expect(action.handler(mockContext)).rejects.toThrow(
      "Received 'Not Found' from the API;",
    );

    expect(mockOctokit.rest.repos.createInOrg).not.toHaveBeenCalled();
  });

  it('should call the githubApis with the correct values for createInOrg', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.teams.getByName.mockResolvedValue({
      data: {
        name: 'blam',
        id: 42,
      },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    await action.handler(mockContext);
    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
      description: 'description',
      name: 'repo',
      org: 'owner',
      private: true,
      delete_branch_on_merge: false,
      allow_squash_merge: true,
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      squash_merge_commit_message: 'COMMIT_MESSAGES',
      allow_merge_commit: true,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      allow_update_branch: false,
      custom_properties: undefined,
      has_issues: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
      visibility: 'private',
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        repoVisibility: 'public',
      },
    });
    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
      description: 'description',
      name: 'repo',
      org: 'owner',
      private: false,
      delete_branch_on_merge: false,
      allow_squash_merge: true,
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      squash_merge_commit_message: 'COMMIT_MESSAGES',
      allow_merge_commit: true,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      allow_update_branch: false,
      custom_properties: undefined,
      has_issues: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
      visibility: 'public',
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        homepage: 'https://example.com',
      },
    });
    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
      description: 'description',
      name: 'repo',
      homepage: 'https://example.com',
      org: 'owner',
      private: true,
      delete_branch_on_merge: false,
      allow_squash_merge: true,
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      squash_merge_commit_message: 'COMMIT_MESSAGES',
      allow_merge_commit: true,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      allow_update_branch: false,
      visibility: 'private',
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        hasWiki: true,
        hasProjects: true,
        hasIssues: true,
      },
    });
    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
      description: 'description',
      name: 'repo',
      org: 'owner',
      private: true,
      delete_branch_on_merge: false,
      allow_squash_merge: true,
      squash_merge_commit_message: 'COMMIT_MESSAGES',
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      allow_merge_commit: true,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      allow_update_branch: false,
      customElements: undefined,
      visibility: 'private',
      has_wiki: undefined,
      has_projects: undefined,
      has_issues: undefined,
      homepage: 'https://example.com',
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        hasWiki: false,
        hasProjects: false,
        hasIssues: false,
      },
    });
    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
      description: 'description',
      name: 'repo',
      org: 'owner',
      private: true,
      delete_branch_on_merge: false,
      allow_squash_merge: true,
      squash_merge_commit_message: 'COMMIT_MESSAGES',
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      allow_merge_commit: true,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      allow_update_branch: false,
      custom_properties: undefined,
      visibility: 'private',
      has_wiki: undefined,
      has_projects: undefined,
      has_issues: undefined,
      homepage: 'https://example.com',
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        customProperties: {
          foo: 'bar',
          foo2: ['bar2', 'bar3'],
        },
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
      description: 'description',
      name: 'repo',
      org: 'owner',
      private: true,
      delete_branch_on_merge: false,
      allow_squash_merge: true,
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      squash_merge_commit_message: 'COMMIT_MESSAGES',
      allow_merge_commit: true,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      allow_update_branch: false,
      custom_properties: undefined,
      has_issues: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: 'https://example.com',
      visibility: 'private',
    });
  });

  it('should call the githubApis with the correct values for createForAuthenticatedUser', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {},
    });

    await action.handler(mockContext);
    expect(
      mockOctokit.rest.repos.createForAuthenticatedUser,
    ).toHaveBeenCalledWith({
      description: 'description',
      name: 'repo',
      private: true,
      delete_branch_on_merge: false,
      allow_squash_merge: true,
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      squash_merge_commit_message: 'COMMIT_MESSAGES',
      allow_merge_commit: true,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      allow_update_branch: false,
      has_issues: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        repoVisibility: 'public',
      },
    });
    expect(
      mockOctokit.rest.repos.createForAuthenticatedUser,
    ).toHaveBeenCalledWith({
      description: 'description',
      name: 'repo',
      private: false,
      delete_branch_on_merge: false,
      allow_squash_merge: true,
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      squash_merge_commit_message: 'COMMIT_MESSAGES',
      allow_merge_commit: true,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      allow_update_branch: false,
      has_issues: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        homepage: 'https://example.com',
      },
    });
    expect(
      mockOctokit.rest.repos.createForAuthenticatedUser,
    ).toHaveBeenCalledWith({
      description: 'description',
      homepage: 'https://example.com',
      name: 'repo',
      private: true,
      delete_branch_on_merge: false,
      allow_squash_merge: true,
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      squash_merge_commit_message: 'COMMIT_MESSAGES',
      allow_merge_commit: true,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      allow_update_branch: false,
      has_issues: undefined,
      has_projects: undefined,
      has_wiki: undefined,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        hasWiki: true,
        hasProjects: true,
        hasIssues: true,
      },
    });
    expect(
      mockOctokit.rest.repos.createForAuthenticatedUser,
    ).toHaveBeenCalledWith({
      description: 'description',
      name: 'repo',
      private: true,
      delete_branch_on_merge: false,
      allow_squash_merge: true,
      squash_merge_commit_message: 'COMMIT_MESSAGES',
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      allow_merge_commit: true,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      allow_update_branch: false,
      has_wiki: undefined,
      has_projects: undefined,
      has_issues: undefined,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        hasWiki: false,
        hasProjects: false,
        hasIssues: false,
      },
    });
    expect(
      mockOctokit.rest.repos.createForAuthenticatedUser,
    ).toHaveBeenCalledWith({
      description: 'description',
      name: 'repo',
      private: true,
      delete_branch_on_merge: false,
      allow_squash_merge: true,
      squash_merge_commit_message: 'COMMIT_MESSAGES',
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      allow_merge_commit: true,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      allow_update_branch: false,
      has_wiki: undefined,
      has_projects: undefined,
      has_issues: undefined,
      homepage: 'https://example.com',
    });

    // Custom properties on user repos should be ignored
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        customProperties: {
          foo: 'bar',
          foo2: ['bar2', 'bar3'],
        },
      },
    });

    expect(
      mockOctokit.rest.repos.createForAuthenticatedUser,
    ).toHaveBeenCalledWith({
      description: 'description',
      name: 'repo',
      private: true,
      delete_branch_on_merge: false,
      allow_squash_merge: true,
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      squash_merge_commit_message: 'COMMIT_MESSAGES',
      allow_merge_commit: true,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      allow_update_branch: false,
      has_issues: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: 'https://example.com',
    });
  });

  it('should call initRepoAndPush with the correct values', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler(mockContext);

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://github.com/clone/url.git',
      defaultBranch: 'main',
      auth: { username: 'x-access-token', password: 'tokenlols' },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: {},
    });
  });

  it('should call initRepoAndPush with the correct defaultBranch main', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        defaultBranch: 'main',
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://github.com/clone/url.git',
      defaultBranch: 'main',
      auth: { username: 'x-access-token', password: 'tokenlols' },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: {},
    });
  });

  it('should call initRepoAndPush with the configured defaultAuthor', async () => {
    const customAuthorConfig = new ConfigReader({
      integrations: {
        github: [
          { host: 'github.com', token: 'tokenlols' },
          { host: 'ghe.github.com' },
        ],
      },
      scaffolder: {
        defaultAuthor: {
          name: 'Test',
          email: 'example@example.com',
        },
      },
    });

    const customAuthorIntegrations =
      ScmIntegrations.fromConfig(customAuthorConfig);

    const customAuthorAction = createPublishGithubAction({
      integrations: customAuthorIntegrations,
      config: customAuthorConfig,
      githubCredentialsProvider,
    });

    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await customAuthorAction.handler(mockContext);

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://github.com/clone/url.git',
      defaultBranch: 'main',
      auth: { username: 'x-access-token', password: 'tokenlols' },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: { name: 'Test', email: 'example@example.com' },
    });
  });

  it('should call initRepoAndPush with the configured defaultCommitMessage', async () => {
    const customAuthorConfig = new ConfigReader({
      integrations: {
        github: [
          { host: 'github.com', token: 'tokenlols' },
          { host: 'ghe.github.com' },
        ],
      },
      scaffolder: {
        defaultCommitMessage: 'Test commit message',
      },
    });

    const customAuthorIntegrations =
      ScmIntegrations.fromConfig(customAuthorConfig);
    const customAuthorAction = createPublishGithubAction({
      integrations: customAuthorIntegrations,
      config: customAuthorConfig,
      githubCredentialsProvider,
    });

    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await customAuthorAction.handler(mockContext);

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://github.com/clone/url.git',
      defaultBranch: 'main',
      auth: { username: 'x-access-token', password: 'tokenlols' },
      logger: mockContext.logger,
      commitMessage: 'Test commit message',
      gitAuthorInfo: { email: undefined, name: undefined },
    });
  });

  it('should add access for the team when it starts with the owner', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler(mockContext);

    expect(
      mockOctokit.rest.teams.addOrUpdateRepoPermissionsInOrg,
    ).toHaveBeenCalledWith({
      org: 'owner',
      team_slug: 'blam',
      owner: 'owner',
      repo: 'repo',
      permission: 'admin',
    });
  });

  it('should provide an adequate failure message when adding access', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.teams.getByName.mockRejectedValue({
      response: {
        status: 404,
        data: {
          message: 'Not Found',
          documentation_url:
            'https://docs.github.com/en/rest/teams/teams#add-or-update-team-repository-permissions',
        },
      },
    });
    await expect(action.handler(mockContext)).rejects.toThrow(
      "Received 'Not Found' from the API;",
    );

    expect(
      mockOctokit.rest.repos.createForAuthenticatedUser,
    ).not.toHaveBeenCalled();
  });

  it('should add outside collaborators when provided', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        access: 'outsidecollaborator',
      },
    });

    expect(mockOctokit.rest.repos.addCollaborator).toHaveBeenCalledWith({
      username: 'outsidecollaborator',
      owner: 'owner',
      repo: 'repo',
      permission: 'admin',
    });
  });

  it('should add multiple collaborators when provided', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        collaborators: [
          {
            access: 'pull',
            user: 'robot-1',
          },
          {
            access: 'push',
            team: 'robot-2',
          },
        ],
      },
    });

    const commonProperties = {
      owner: 'owner',
      repo: 'repo',
    };

    expect(mockOctokit.rest.repos.addCollaborator).toHaveBeenCalledWith({
      ...commonProperties,
      username: 'robot-1',
      permission: 'pull',
    });

    expect(
      mockOctokit.rest.teams.addOrUpdateRepoPermissionsInOrg,
    ).toHaveBeenCalledWith({
      ...commonProperties,
      org: 'owner',
      team_slug: 'robot-2',
      permission: 'push',
    });
  });

  it('should familiarize entity names while adding collaborators', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        collaborators: [
          {
            access: 'pull',
            user: 'user:robot-1',
          },
          {
            access: 'push',
            team: 'group:default/robot-2',
          },
        ],
      },
    });

    const commonProperties = {
      owner: 'owner',
      repo: 'repo',
    };

    expect(mockOctokit.rest.repos.addCollaborator).toHaveBeenCalledWith({
      ...commonProperties,
      username: 'robot-1',
      permission: 'pull',
    });

    expect(
      mockOctokit.rest.teams.addOrUpdateRepoPermissionsInOrg,
    ).toHaveBeenCalledWith({
      ...commonProperties,
      org: 'owner',
      team_slug: 'robot-2',
      permission: 'push',
    });

    expect(entityRefToName).toHaveBeenCalledWith('user:robot-1');
    expect(entityRefToName).toHaveBeenCalledWith('group:default/robot-2');
  });

  it('should ignore failures when adding multiple collaborators', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    mockOctokit.rest.teams.addOrUpdateRepoPermissionsInOrg.mockImplementation(
      async opts => {
        if (opts.team_slug === 'robot-1') {
          throw Error('Something bad happened');
        }
      },
    );

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        collaborators: [
          {
            access: 'pull',
            team: 'robot-1',
          },
          {
            access: 'push',
            team: 'robot-2',
          },
        ],
      },
    });

    expect(
      mockOctokit.rest.teams.addOrUpdateRepoPermissionsInOrg.mock.calls[2],
    ).toEqual([
      {
        org: 'owner',
        owner: 'owner',
        repo: 'repo',
        team_slug: 'robot-2',
        permission: 'push',
      },
    ]);
  });

  it('should add topics when provided', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    mockOctokit.rest.repos.replaceAllTopics.mockResolvedValue({
      data: {
        names: ['node.js'],
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        topics: ['node.js'],
      },
    });

    expect(mockOctokit.rest.repos.replaceAllTopics).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      names: ['node.js'],
    });
  });

  it('should lowercase topics when provided', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    mockOctokit.rest.repos.replaceAllTopics.mockResolvedValue({
      data: {
        names: ['backstage'],
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        topics: ['BACKSTAGE'],
      },
    });

    expect(mockOctokit.rest.repos.replaceAllTopics).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      names: ['backstage'],
    });
  });

  it('should add variables when provided', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        repoVariables: {
          foo: 'bar',
        },
      },
    });

    expect(mockOctokit.rest.actions.createRepoVariable).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      name: 'foo',
      value: 'bar',
    });
  });

  it('should add secrets when provided', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        secrets: {
          foo: 'bar',
        },
      },
    });

    expect(
      mockOctokit.rest.actions.createOrUpdateRepoSecret,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      secret_name: 'foo',
      key_id: 'keyid',
      encrypted_value: expect.any(String),
    });
  });

  it('should configure oidc customizations when provided', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        oidcCustomization: {
          useDefault: false,
          includeClaimKeys: ['foo', 'bar'],
        },
      },
    });

    expect(mockOctokit.request).toHaveBeenCalledWith(
      'PUT /repos/{owner}/{repo}/actions/oidc/customization/sub',
      {
        include_claim_keys: ['foo', 'bar'],
        owner: 'owner',
        repo: 'repo',
        use_default: false,
      },
    );
  });

  it('should call output with the remoteUrl and the repoContentsUrl', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler(mockContext);

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://github.com/clone/url.git',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://github.com/html/url/blob/main',
    );
  });

  it('should use main as default branch', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        defaultBranch: 'main',
      },
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://github.com/clone/url.git',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://github.com/html/url/blob/main',
    );
  });

  it('should call enableBranchProtectionOnDefaultRepoBranch with the correct values of requiredStatusCheckContexts and requireBranchesToBeUpToDate', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        name: 'repo',
      },
    });

    await action.handler(mockContext);

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'main',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      requireLastPushApproval: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
      requiredLinearHistory: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        requiredStatusCheckContexts: ['statusCheck'],
        requireBranchesToBeUpToDate: true,
        requiredConversationResolution: false,
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'main',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      requireLastPushApproval: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
      requiredLinearHistory: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        requiredStatusCheckContexts: ['statusCheck'],
        requireBranchesToBeUpToDate: false,
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'main',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: ['statusCheck'],
      requireBranchesToBeUpToDate: false,
      requiredConversationResolution: false,
      requireLastPushApproval: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
      requiredLinearHistory: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        requiredStatusCheckContexts: [],
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'main',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      requireLastPushApproval: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
      requiredLinearHistory: false,
    });
  });

  it('should not call enableBranchProtectionOnDefaultRepoBranch with protectDefaultBranch disabled', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        name: 'repo',
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        protectDefaultBranch: false,
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).not.toHaveBeenCalled();
  });

  it('should add homepage when provided', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    mockOctokit.rest.repos.replaceAllTopics.mockResolvedValue({
      data: {
        names: ['node.js'],
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        topics: ['node.js'],
      },
    });

    expect(mockOctokit.rest.repos.replaceAllTopics).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      names: ['node.js'],
    });
  });

  it('should call enableBranchProtectionOnDefaultRepoBranch with the correct values of restrictions', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        name: 'repo',
      },
    });

    await action.handler(mockContext);

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'main',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      requireLastPushApproval: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
      requiredLinearHistory: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        restrictions: {
          users: ['user'],
          teams: [],
        },
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'main',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: {
        users: ['user'],
        teams: [],
      },
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      requireLastPushApproval: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
      requiredLinearHistory: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        restrictions: {
          users: [],
          teams: ['team'],
        },
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'main',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: {
        users: [],
        teams: ['team'],
      },
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      requireLastPushApproval: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
      requiredLinearHistory: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        restrictions: {
          users: [],
          teams: [],
          apps: ['app'],
        },
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'main',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: {
        users: [],
        teams: [],
        apps: ['app'],
      },
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      requireLastPushApproval: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
      requiredLinearHistory: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        restrictions: {
          users: ['user'],
          teams: ['team'],
          apps: ['app'],
        },
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'main',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: {
        users: ['user'],
        teams: ['team'],
        apps: ['app'],
      },
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      requireLastPushApproval: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
      requiredLinearHistory: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        restrictions: {
          users: ['user1', 'user2'],
          teams: ['team1', 'team2'],
          apps: ['app1', 'app2'],
        },
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'main',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: {
        users: ['user1', 'user2'],
        teams: ['team1', 'team2'],
        apps: ['app1', 'app2'],
      },
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      requireLastPushApproval: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
      requiredLinearHistory: false,
    });
  });
  it('should call enableBranchProtectionOnDefaultRepoBranch with the correct values of bypassPullRequestAllowances', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        name: 'repo',
      },
    });

    await action.handler(mockContext);

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'main',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      requireLastPushApproval: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
      requiredLinearHistory: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        bypassPullRequestAllowances: {
          users: ['user'],
        },
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'main',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: {
        users: ['user'],
      },
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      requireLastPushApproval: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
      requiredLinearHistory: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        bypassPullRequestAllowances: {
          teams: ['team'],
        },
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'main',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: {
        teams: ['team'],
      },
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      requireLastPushApproval: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
      requiredLinearHistory: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        bypassPullRequestAllowances: {
          apps: ['app'],
        },
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'main',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: {
        apps: ['app'],
      },
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      requireLastPushApproval: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
      requiredLinearHistory: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        bypassPullRequestAllowances: {
          users: ['user'],
          teams: ['team'],
          apps: ['app'],
        },
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'main',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: {
        users: ['user'],
        teams: ['team'],
        apps: ['app'],
      },
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      requireLastPushApproval: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
      requiredLinearHistory: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        bypassPullRequestAllowances: {
          users: ['user1', 'user2'],
          teams: ['team1', 'team2'],
          apps: ['app1', 'app2'],
        },
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'main',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: {
        users: ['user1', 'user2'],
        teams: ['team1', 'team2'],
        apps: ['app1', 'app2'],
      },
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      requireLastPushApproval: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
      requiredLinearHistory: false,
    });
  });

  it.each([
    {
      inputProperty: 'dismissStaleReviews',
      defaultValue: false,
      overrideValue: true,
    },
    {
      inputProperty: 'requiredConversationResolution',
      defaultValue: false,
      overrideValue: true,
    },
    {
      inputProperty: 'requireLastPushApproval',
      defaultValue: false,
      overrideValue: true,
    },
    {
      inputProperty: 'requiredApprovingReviewCount',
      defaultValue: 1,
      overrideValue: 2,
    },
    {
      inputProperty: 'requiredCommitSigning',
      defaultValue: false,
      overrideValue: true,
    },
    {
      inputProperty: 'requiredLinearHistory',
      defaultValue: false,
      overrideValue: true,
    },
    {
      inputProperty: 'protectEnforceAdmins',
      defaultValue: true,
      overrideValue: false,
      octokitParameter: 'enforceAdmins',
    },
    {
      inputProperty: 'requireCodeOwnerReviews',
      defaultValue: false,
      overrideValue: true,
    },
  ])(
    'should call enableBranchProtectionOnDefaultRepoBranch with the correct values of $inputProperty',
    async ({
      inputProperty,
      defaultValue,
      overrideValue,
      octokitParameter,
    }) => {
      mockOctokit.rest.users.getByUsername.mockResolvedValue({
        data: { type: 'User' },
      });

      mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
        data: {
          name: 'repo',
        },
      });

      await action.handler(mockContext);

      expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
        owner: 'owner',
        client: mockOctokit,
        repoName: 'repo',
        logger: mockContext.logger,
        defaultBranch: 'main',
        requireCodeOwnerReviews: false,
        bypassPullRequestAllowances: undefined,
        requiredApprovingReviewCount: 1,
        restrictions: undefined,
        requiredStatusCheckContexts: [],
        requireBranchesToBeUpToDate: true,
        requiredConversationResolution: false,
        requireLastPushApproval: false,
        enforceAdmins: true,
        dismissStaleReviews: false,
        requiredCommitSigning: false,
        requiredLinearHistory: false,
        [octokitParameter || inputProperty]: defaultValue,
      });

      await action.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
          [inputProperty]: overrideValue,
        },
      });

      expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
        owner: 'owner',
        client: mockOctokit,
        repoName: 'repo',
        logger: mockContext.logger,
        defaultBranch: 'main',
        requireCodeOwnerReviews: false,
        bypassPullRequestAllowances: undefined,
        requiredApprovingReviewCount: 1,
        restrictions: undefined,
        requiredStatusCheckContexts: [],
        requireBranchesToBeUpToDate: true,
        requiredConversationResolution: false,
        requireLastPushApproval: false,
        enforceAdmins: true,
        dismissStaleReviews: false,
        requiredCommitSigning: false,
        requiredLinearHistory: false,
        [octokitParameter || inputProperty]: overrideValue,
      });

      await action.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
          [inputProperty]: defaultValue,
        },
      });

      expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
        owner: 'owner',
        client: mockOctokit,
        repoName: 'repo',
        logger: mockContext.logger,
        defaultBranch: 'main',
        requireCodeOwnerReviews: false,
        bypassPullRequestAllowances: undefined,
        requiredApprovingReviewCount: 1,
        restrictions: undefined,
        requiredStatusCheckContexts: [],
        requireBranchesToBeUpToDate: true,
        requiredConversationResolution: false,
        requireLastPushApproval: false,
        enforceAdmins: true,
        dismissStaleReviews: false,
        requiredCommitSigning: false,
        requiredLinearHistory: false,
        [octokitParameter || inputProperty]: defaultValue,
      });
    },
  );

  it('should add user subscription', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });
    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        subscribe: true,
      },
    });

    expect(mockOctokit.rest.activity.setRepoSubscription).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      subscribed: true,
      ignored: false,
    });
  });

  describe('GraphQL API fallback', () => {
    let readdirSpy: jest.SpyInstance;
    let readFileSpy: jest.SpyInstance;

    beforeEach(() => {
      readdirSpy = jest.spyOn(fsPromises, 'readdir');
      readFileSpy = jest.spyOn(fsPromises, 'readFile');
    });

    afterEach(() => {
      readdirSpy.mockRestore();
      readFileSpy.mockRestore();
    });

    function setupFallbackMocks(error: Error) {
      initRepoAndPushMocked.mockRejectedValue(error);
      mockOctokit.rest.users.getByUsername.mockResolvedValue({
        data: { type: 'User' },
      });
      mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
        data: {
          clone_url: 'https://github.com/clone/url.git',
          html_url: 'https://github.com/html/url',
        },
      });
    }

    function mockFilesOnDisk(
      files: {
        name: string;
        isDirectory?: boolean;
        isSymbolicLink?: boolean;
        isFile?: boolean;
      }[],
      content: Buffer = Buffer.from('file content'),
    ) {
      readdirSpy.mockResolvedValue(
        files.map(f => ({
          name: f.name,
          isDirectory: () => f.isDirectory ?? false,
          isSymbolicLink: () => f.isSymbolicLink ?? false,
          isFile: () =>
            f.isFile ??
            (!(f.isDirectory ?? false) && !(f.isSymbolicLink ?? false)),
        })),
      );
      readFileSpy.mockResolvedValue(content);
    }

    it('should fall back to GraphQL API when git push fails with ECONNRESET', async () => {
      const econnError = new Error('socket hang up');
      (econnError as NodeJS.ErrnoException).code = 'ECONNRESET';
      setupFallbackMocks(econnError);
      mockFilesOnDisk([{ name: 'README.md' }, { name: 'index.ts' }]);

      mockOctokit.rest.git.getRef.mockResolvedValue({
        data: { object: { sha: 'head-sha' } },
      });
      mockOctokit.graphql.mockResolvedValue({
        createCommitOnBranch: { commit: { oid: 'new-commit-sha' } },
      });

      await action.handler({
        ...mockContext,
        input: { ...mockContext.input, protectDefaultBranch: false },
      });

      expect(initRepoAndPush).toHaveBeenCalled();
      expect(mockOctokit.graphql).toHaveBeenCalledWith(
        expect.stringContaining('createCommitOnBranch'),
        expect.objectContaining({
          input: expect.objectContaining({
            branch: {
              repositoryNameWithOwner: 'owner/repo',
              branchName: 'main',
            },
            expectedHeadOid: 'head-sha',
            fileChanges: {
              additions: expect.arrayContaining([
                expect.objectContaining({ path: 'README.md' }),
                expect.objectContaining({ path: 'index.ts' }),
              ]),
            },
          }),
        }),
      );
      expect(mockContext.output).toHaveBeenCalledWith(
        'commitHash',
        'new-commit-sha',
      );
    });

    it('should fall back to GraphQL API when git push fails with ECONNREFUSED', async () => {
      const econnError = new Error('connect ECONNREFUSED');
      (econnError as NodeJS.ErrnoException).code = 'ECONNREFUSED';
      setupFallbackMocks(econnError);
      mockFilesOnDisk([{ name: 'README.md' }]);

      mockOctokit.rest.git.getRef.mockResolvedValue({
        data: { object: { sha: 'head-sha' } },
      });
      mockOctokit.graphql.mockResolvedValue({
        createCommitOnBranch: { commit: { oid: 'refused-commit-sha' } },
      });

      await action.handler({
        ...mockContext,
        input: { ...mockContext.input, protectDefaultBranch: false },
      });

      expect(initRepoAndPush).toHaveBeenCalled();
      expect(mockOctokit.graphql).toHaveBeenCalledWith(
        expect.stringContaining('createCommitOnBranch'),
        expect.anything(),
      );
      expect(mockContext.output).toHaveBeenCalledWith(
        'commitHash',
        'refused-commit-sha',
      );
    });

    it('should initialize empty repo via Contents API in fallback', async () => {
      const econnError = new Error('socket hang up');
      (econnError as NodeJS.ErrnoException).code = 'ECONNRESET';
      setupFallbackMocks(econnError);
      mockFilesOnDisk([{ name: 'README.md' }], Buffer.from('content'));

      const notFoundError = Object.assign(new Error('Not Found'), {
        status: 404,
      });
      mockOctokit.rest.git.getRef.mockRejectedValue(notFoundError);
      mockOctokit.rest.repos.get.mockResolvedValue({
        data: { size: 0, default_branch: 'main' },
      });
      mockOctokit.rest.repos.createOrUpdateFileContents.mockResolvedValue({
        data: { commit: { sha: 'init-sha' } },
      });
      mockOctokit.graphql.mockResolvedValue({
        createCommitOnBranch: { commit: { oid: 'new-commit-sha' } },
      });

      await action.handler({
        ...mockContext,
        input: { ...mockContext.input, protectDefaultBranch: false },
      });

      expect(
        mockOctokit.rest.repos.createOrUpdateFileContents,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          owner: 'owner',
          repo: 'repo',
          path: '.gitkeep',
        }),
      );
      expect(mockOctokit.graphql).toHaveBeenCalledWith(
        expect.stringContaining('createCommitOnBranch'),
        expect.objectContaining({
          input: expect.objectContaining({
            expectedHeadOid: 'init-sha',
            fileChanges: expect.objectContaining({
              deletions: [{ path: '.gitkeep' }],
            }),
          }),
        }),
      );
    });

    it('should initialize empty repo via Contents API when getRef returns 409', async () => {
      const econnError = new Error('socket hang up');
      (econnError as NodeJS.ErrnoException).code = 'ECONNRESET';
      setupFallbackMocks(econnError);
      mockFilesOnDisk([{ name: 'README.md' }], Buffer.from('content'));

      const emptyRepoError = Object.assign(
        new Error('Git Repository is empty.'),
        { status: 409 },
      );
      mockOctokit.rest.git.getRef.mockRejectedValue(emptyRepoError);
      mockOctokit.rest.repos.createOrUpdateFileContents.mockResolvedValue({
        data: { commit: { sha: 'init-sha-409' } },
      });
      mockOctokit.graphql.mockResolvedValue({
        createCommitOnBranch: { commit: { oid: 'commit-from-409' } },
      });

      await action.handler({
        ...mockContext,
        input: { ...mockContext.input, protectDefaultBranch: false },
      });

      expect(
        mockOctokit.rest.repos.createOrUpdateFileContents,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '.gitkeep',
        }),
      );
      expect(mockOctokit.graphql).toHaveBeenCalledWith(
        expect.stringContaining('createCommitOnBranch'),
        expect.objectContaining({
          input: expect.objectContaining({
            expectedHeadOid: 'init-sha-409',
          }),
        }),
      );
      expect(mockContext.output).toHaveBeenCalledWith(
        'commitHash',
        'commit-from-409',
      );
    });

    it('should throw when getRef returns 404 and repo does not exist', async () => {
      const econnError = new Error('socket hang up');
      (econnError as NodeJS.ErrnoException).code = 'ECONNRESET';
      setupFallbackMocks(econnError);
      mockFilesOnDisk([{ name: 'README.md' }], Buffer.from('content'));

      const refNotFound = Object.assign(new Error('Not Found'), {
        status: 404,
      });
      mockOctokit.rest.git.getRef.mockRejectedValue(refNotFound);

      const repoNotFound = Object.assign(new Error('Not Found'), {
        status: 404,
      });
      mockOctokit.rest.repos.get.mockRejectedValue(repoNotFound);

      await expect(
        action.handler({
          ...mockContext,
          input: { ...mockContext.input, protectDefaultBranch: false },
        }),
      ).rejects.toThrow('Not Found');

      expect(
        mockOctokit.rest.repos.createOrUpdateFileContents,
      ).not.toHaveBeenCalled();
      expect(mockOctokit.graphql).not.toHaveBeenCalled();
    });

    it('should fall back to GraphQL API when error.cause.code is ECONNRESET', async () => {
      const wrappedError = new Error('request failed');
      (wrappedError as any).cause = Object.assign(new Error('socket hang up'), {
        code: 'ECONNRESET',
      });
      setupFallbackMocks(wrappedError);
      mockFilesOnDisk([{ name: 'README.md' }], Buffer.from('content'));

      mockOctokit.rest.git.getRef.mockResolvedValue({
        data: { object: { sha: 'head-sha' } },
      });
      mockOctokit.graphql.mockResolvedValue({
        createCommitOnBranch: { commit: { oid: 'cause-commit-sha' } },
      });

      await action.handler({
        ...mockContext,
        input: { ...mockContext.input, protectDefaultBranch: false },
      });

      expect(initRepoAndPush).toHaveBeenCalled();
      expect(mockOctokit.graphql).toHaveBeenCalledWith(
        expect.stringContaining('createCommitOnBranch'),
        expect.anything(),
      );
      expect(mockContext.output).toHaveBeenCalledWith(
        'commitHash',
        'cause-commit-sha',
      );
    });

    it('should skip symlinks during file collection in fallback', async () => {
      const econnError = new Error('socket hang up');
      (econnError as NodeJS.ErrnoException).code = 'ECONNRESET';
      setupFallbackMocks(econnError);

      readdirSpy.mockResolvedValue([
        {
          name: 'README.md',
          isDirectory: () => false,
          isSymbolicLink: () => false,
          isFile: () => true,
        },
        {
          name: 'dangerous-link',
          isDirectory: () => false,
          isSymbolicLink: () => true,
          isFile: () => false,
        },
      ]);
      readFileSpy.mockResolvedValue(Buffer.from('content'));

      mockOctokit.rest.git.getRef.mockResolvedValue({
        data: { object: { sha: 'head-sha' } },
      });
      mockOctokit.graphql.mockResolvedValue({
        createCommitOnBranch: { commit: { oid: 'symlink-commit-sha' } },
      });

      await action.handler({
        ...mockContext,
        input: { ...mockContext.input, protectDefaultBranch: false },
      });

      const graphqlCall = mockOctokit.graphql.mock.calls[0];
      const additions = graphqlCall[1].input.fileChanges.additions;
      expect(additions).toHaveLength(1);
      expect(additions[0].path).toBe('README.md');
    });

    it('should skip unsupported filesystem entry types during file collection', async () => {
      const econnError = new Error('socket hang up');
      (econnError as NodeJS.ErrnoException).code = 'ECONNRESET';
      setupFallbackMocks(econnError);

      readdirSpy.mockResolvedValue([
        {
          name: 'README.md',
          isDirectory: () => false,
          isSymbolicLink: () => false,
          isFile: () => true,
        },
        {
          name: 'socket.sock',
          isDirectory: () => false,
          isSymbolicLink: () => false,
          isFile: () => false,
        },
      ]);
      readFileSpy.mockResolvedValue(Buffer.from('content'));

      mockOctokit.rest.git.getRef.mockResolvedValue({
        data: { object: { sha: 'head-sha' } },
      });
      mockOctokit.graphql.mockResolvedValue({
        createCommitOnBranch: { commit: { oid: 'unsupported-type-sha' } },
      });

      await action.handler({
        ...mockContext,
        input: { ...mockContext.input, protectDefaultBranch: false },
      });

      expect(readFileSpy).toHaveBeenCalledTimes(1);
      const graphqlCall = mockOctokit.graphql.mock.calls[0];
      const additions = graphqlCall[1].input.fileChanges.additions;
      expect(additions).toHaveLength(1);
      expect(additions[0].path).toBe('README.md');
    });

    it('should collect files from nested directories with correct paths', async () => {
      const econnError = new Error('socket hang up');
      (econnError as NodeJS.ErrnoException).code = 'ECONNRESET';
      setupFallbackMocks(econnError);

      readdirSpy
        .mockResolvedValueOnce([
          {
            name: 'README.md',
            isDirectory: () => false,
            isSymbolicLink: () => false,
            isFile: () => true,
          },
          {
            name: '.git',
            isDirectory: () => true,
            isSymbolicLink: () => false,
            isFile: () => false,
          },
          {
            name: 'src',
            isDirectory: () => true,
            isSymbolicLink: () => false,
            isFile: () => false,
          },
        ])
        .mockResolvedValueOnce([
          {
            name: 'index.ts',
            isDirectory: () => false,
            isSymbolicLink: () => false,
            isFile: () => true,
          },
          {
            name: 'utils',
            isDirectory: () => true,
            isSymbolicLink: () => false,
            isFile: () => false,
          },
        ])
        .mockResolvedValueOnce([
          {
            name: 'helper.ts',
            isDirectory: () => false,
            isSymbolicLink: () => false,
            isFile: () => true,
          },
        ]);
      readFileSpy.mockResolvedValue(Buffer.from('content'));

      mockOctokit.rest.git.getRef.mockResolvedValue({
        data: { object: { sha: 'head-sha' } },
      });
      mockOctokit.graphql.mockResolvedValue({
        createCommitOnBranch: { commit: { oid: 'nested-sha' } },
      });

      await action.handler({
        ...mockContext,
        input: { ...mockContext.input, protectDefaultBranch: false },
      });

      const graphqlCall = mockOctokit.graphql.mock.calls[0];
      const additions = graphqlCall[1].input.fileChanges.additions;
      const paths = additions.map((a: { path: string }) => a.path).sort();
      expect(paths).toEqual([
        'README.md',
        'src/index.ts',
        'src/utils/helper.ts',
      ]);
    });

    it('should throw when getRef returns 404 and repo is non-empty (wrong branch)', async () => {
      const econnError = new Error('socket hang up');
      (econnError as NodeJS.ErrnoException).code = 'ECONNRESET';
      setupFallbackMocks(econnError);
      mockFilesOnDisk([{ name: 'README.md' }]);

      const refNotFound = Object.assign(new Error('Not Found'), {
        status: 404,
      });
      mockOctokit.rest.git.getRef.mockRejectedValue(refNotFound);
      mockOctokit.rest.repos.get.mockResolvedValue({
        data: { size: 100, default_branch: 'master' },
      });

      await expect(
        action.handler({
          ...mockContext,
          input: { ...mockContext.input, protectDefaultBranch: false },
        }),
      ).rejects.toThrow("Branch 'main' not found");

      expect(
        mockOctokit.rest.repos.createOrUpdateFileContents,
      ).not.toHaveBeenCalled();
    });

    it('should retry once on HEAD OID mismatch', async () => {
      const econnError = new Error('socket hang up');
      (econnError as NodeJS.ErrnoException).code = 'ECONNRESET';
      setupFallbackMocks(econnError);
      mockFilesOnDisk([{ name: 'README.md' }]);

      mockOctokit.rest.git.getRef
        .mockResolvedValueOnce({
          data: { object: { sha: 'stale-sha' } },
        })
        .mockResolvedValueOnce({
          data: { object: { sha: 'fresh-sha' } },
        });
      mockOctokit.graphql
        .mockRejectedValueOnce(new Error('expectedHeadOid does not match'))
        .mockResolvedValueOnce({
          createCommitOnBranch: { commit: { oid: 'retry-commit-sha' } },
        });

      await action.handler({
        ...mockContext,
        input: { ...mockContext.input, protectDefaultBranch: false },
      });

      expect(mockOctokit.graphql).toHaveBeenCalledTimes(2);
      expect(mockContext.output).toHaveBeenCalledWith(
        'commitHash',
        'retry-commit-sha',
      );
    });

    it('should rethrow non-connection errors from git push', async () => {
      const authError = new Error('Authentication failed');
      (authError as NodeJS.ErrnoException).code = 'AuthError';
      initRepoAndPushMocked.mockRejectedValue(authError);

      mockOctokit.rest.users.getByUsername.mockResolvedValue({
        data: { type: 'User' },
      });
      mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
        data: {
          clone_url: 'https://github.com/clone/url.git',
          html_url: 'https://github.com/html/url',
        },
      });

      await expect(action.handler(mockContext)).rejects.toThrow(
        'Authentication failed',
      );

      expect(mockOctokit.graphql).not.toHaveBeenCalled();
    });
  });
});
