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

import { TemplateAction } from '../../types';

jest.mock('../helpers');

import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { when } from 'jest-when';
import { PassThrough } from 'stream';
import {
  enableBranchProtectionOnDefaultRepoBranch,
  initRepoAndPush,
} from '../helpers';
import { createPublishGithubAction } from './github';

const mockOctokit = {
  rest: {
    users: {
      getByUsername: jest.fn(),
    },
    repos: {
      addCollaborator: jest.fn(),
      createInOrg: jest.fn(),
      createForAuthenticatedUser: jest.fn(),
      replaceAllTopics: jest.fn(),
    },
    teams: {
      addOrUpdateRepoPermissionsInOrg: jest.fn(),
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

describe('publish:github', () => {
  const config = new ConfigReader({
    integrations: {
      github: [
        { host: 'github.com', token: 'tokenlols' },
        { host: 'ghe.github.com' },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  let githubCredentialsProvider: GithubCredentialsProvider;
  let action: TemplateAction<any>;

  const mockContext = {
    input: {
      repoUrl: 'github.com?repo=repo&owner=owner',
      description: 'description',
      repoVisibility: 'private' as const,
      access: 'owner/blam',
    },
    workspacePath: 'lol',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    githubCredentialsProvider =
      DefaultGithubCredentialsProvider.fromIntegrations(integrations);
    action = createPublishGithubAction({
      integrations,
      config,
      githubCredentialsProvider,
    });
  });

  it('should call the githubApis with the correct values for createInOrg', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
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
      visibility: 'private',
      has_wiki: true,
      has_projects: true,
      has_issues: true,
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
      visibility: 'private',
      has_wiki: false,
      has_projects: false,
      has_issues: false,
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
      has_wiki: true,
      has_projects: true,
      has_issues: true,
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
      has_wiki: false,
      has_projects: false,
      has_issues: false,
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
      defaultBranch: 'master',
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
      defaultBranch: 'master',
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
      defaultBranch: 'master',
      auth: { username: 'x-access-token', password: 'tokenlols' },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
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

    when(mockOctokit.rest.teams.addOrUpdateRepoPermissionsInOrg)
      .calledWith({
        org: 'owner',
        owner: 'owner',
        repo: 'repo',
        team_slug: 'robot-1',
        permission: 'pull',
      })
      .mockRejectedValueOnce(new Error('Something bad happened') as never);

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
      'https://github.com/html/url/blob/master',
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

  it('should call enableBranchProtectionOnDefaultRepoBranch with the correct values of requireCodeOwnerReviews', async () => {
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
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        requireCodeOwnerReviews: true,
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: true,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        requireCodeOwnerReviews: false,
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
    });
  });

  it('should call enableBranchProtectionOnDefaultRepoBranch with the correct values of enforceAdmins', async () => {
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
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        protectEnforceAdmins: false,
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: false,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        protectEnforceAdmins: true,
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
    });
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
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
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
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
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
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: ['statusCheck'],
      requireBranchesToBeUpToDate: false,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
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
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
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

  it('should call enableBranchProtectionOnDefaultRepoBranch with the correct values of dismissStaleReviews', async () => {
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
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        dismissStaleReviews: true,
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: true,
      requiredCommitSigning: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        dismissStaleReviews: false,
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
    });
  });
  it('should call enableBranchProtectionOnDefaultRepoBranch with the correct values of requiredConversationResolution', async () => {
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
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        requiredConversationResolution: true,
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: true,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        requiredConversationResolution: false,
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
    });
  });
  it('should call enableBranchProtectionOnDefaultRepoBranch with the correct values of requiredApprovingReviewCount', async () => {
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
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        requiredApprovingReviewCount: 2,
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 2,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        requiredApprovingReviewCount: 0,
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 0,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
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
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
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
      defaultBranch: 'master',
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
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
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
      defaultBranch: 'master',
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
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
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
      defaultBranch: 'master',
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
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
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
      defaultBranch: 'master',
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
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
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
      defaultBranch: 'master',
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
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
    });
  });
  it('should call enableBranchProtectionOnDefaultRepoBranch with the correct values of requiredCommitSigning', async () => {
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
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        requiredCommitSigning: false,
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        requiredCommitSigning: true,
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repo',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: true,
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
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
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
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: {
        users: ['user'],
      },
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
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
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: {
        teams: ['team'],
      },
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
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
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      bypassPullRequestAllowances: {
        apps: ['app'],
      },
      requiredApprovingReviewCount: 1,
      restrictions: undefined,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
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
      defaultBranch: 'master',
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
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
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
      defaultBranch: 'master',
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
      enforceAdmins: true,
      dismissStaleReviews: false,
      requiredCommitSigning: false,
    });
  });
});
