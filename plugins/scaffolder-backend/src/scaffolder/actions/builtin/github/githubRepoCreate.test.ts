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
import { createGithubRepoCreateAction } from './githubRepoCreate';

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

describe('github:repo:create', () => {
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
    action = createGithubRepoCreateAction({
      integrations,
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
      homepage: 'https://example.com',
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

  it('should call output with the remoteUrl', async () => {
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
  });
});
