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

jest.mock('./gitHelpers', () => {
  return {
    ...jest.requireActual('./gitHelpers'),
    entityRefToName: jest.fn(),
  };
});

import { ConfigReader } from '@backstage/config';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { createGithubRepoCreateAction } from './githubRepoCreate';
import { entityRefToName } from './gitHelpers';

const publicKey = '2Sg8iYjAxxmI2LvUXpJjkYrMxURPc8r+dB7TJyvvcCU=';

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
      getByName: jest.fn(),
    },
    actions: {
      createRepoVariable: jest.fn(),
      createOrUpdateRepoSecret: jest.fn(),
      getRepoPublicKey: jest.fn(),
    },
    activity: {
      setRepoSubscription: jest.fn(),
    },
  },
  request: jest.fn(),
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

  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'github.com?repo=repo&owner=owner',
      description: 'description',
      repoVisibility: 'private' as const,
      access: 'owner/blam',
    },
  });

  beforeEach(() => {
    githubCredentialsProvider =
      DefaultGithubCredentialsProvider.fromIntegrations(integrations);
    action = createGithubRepoCreateAction({
      integrations,
      githubCredentialsProvider,
    });
    (entityRefToName as jest.Mock).mockImplementation((s: string) => s);
    mockOctokit.rest.actions.getRepoPublicKey.mockResolvedValue({
      data: {
        key: publicKey,
        key_id: 'keyid',
      },
    });
  });

  afterEach(jest.resetAllMocks);

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

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        customProperties: {
          foo: 'bar',
          foo2: 'bar2',
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
      visibility: 'private',
      custom_properties: {
        foo: 'bar',
        foo2: 'bar2',
      },
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

    // Custom properties on user repos should be ignored
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        customProperties: {
          foo: 'bar',
          foo2: 'bar2',
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

  it('should subscribe user to repository', async () => {
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
});
