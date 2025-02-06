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

import { createPublishGitlabAction } from './gitlab';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { initRepoAndPush } from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';

const mockGitlabClient = {
  Namespaces: {
    show: jest.fn(),
  },
  Groups: {
    allProjects: jest.fn(),
  },
  Projects: {
    create: jest.fn(),
  },
  Users: {
    showCurrentUser: jest.fn(),
  },
  ProjectMembers: {
    add: jest.fn(),
  },
  Branches: {
    create: jest.fn(),
  },
  ProtectedBranches: {
    protect: jest.fn(),
  },
  ProjectVariables: {
    create: jest.fn(),
  },
};
jest.mock('@gitbeaker/rest', () => ({
  Gitlab: class {
    constructor() {
      return mockGitlabClient;
    }
  },
}));

describe('publish:gitlab', () => {
  const config = new ConfigReader({
    integrations: {
      gitlab: [
        {
          host: 'gitlab.com',
          token: 'tokenlols',
          apiBaseUrl: 'https://api.gitlab.com',
        },
        {
          host: 'hosted.gitlab.com',
          apiBaseUrl: 'https://api.hosted.gitlab.com',
        },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = createPublishGitlabAction({ integrations, config });

  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'gitlab.com?repo=repo&owner=owner',
      repoVisibility: 'private' as const,
      settings: {
        ci_config_path: '.gitlab-ci.yml',
      },
    },
  });
  const mockContextWithSettings = createMockActionContext({
    input: {
      repoUrl: 'gitlab.com?repo=repo&owner=owner',
      repoVisibility: 'private' as const,
      topics: ['topic'],
      settings: {
        ci_config_path: '.gitlab-ci.yml',
        visibility: 'internal' as const,
        topics: ['topic1', 'topic2'],
      },
    },
  });
  const mockContextWithBranches = createMockActionContext({
    input: {
      repoUrl: 'gitlab.com?repo=repo&owner=owner',
      repoVisibility: 'private' as const,
      branches: [
        {
          name: 'dev',
          create: true,
          ref: 'master',
          protect: true,
        },
        {
          name: 'stage',
          create: true,
        },
        {
          name: 'perf',
          protect: true,
        },
      ],
    },
  });
  const mockContextWithVariables = createMockActionContext({
    input: {
      repoUrl: 'gitlab.com?repo=repo&owner=owner',
      repoVisibility: 'private' as const,
      projectVariables: [
        {
          key: 'key',
          value: 'value',
          description: 'description',
          protected: true,
          masked: true,
        },
      ],
    },
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an error when the repoUrl is not well formed', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'gitlab.com?repo=bob' },
      }),
    ).rejects.toThrow(/missing owner/);

    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'gitlab.com?owner=owner' },
      }),
    ).rejects.toThrow(/missing repo/);
  });

  it('should throw if there is no integration config provided', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'missing.com?repo=bob&owner=owner' },
      }),
    ).rejects.toThrow(/No matching integration configuration/);
  });

  it('should throw if there is no token in the integration config that is returned', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'hosted.gitlab.com?repo=bob&owner=owner',
        },
      }),
    ).rejects.toThrow(/No token available for host/);
  });

  it('should work when there is a token provided through ctx.input', async () => {
    mockGitlabClient.Users.showCurrentUser.mockResolvedValue({ id: 12345 });
    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: 1234 });
    mockGitlabClient.Groups.allProjects.mockResolvedValue([]);
    mockGitlabClient.Projects.create.mockResolvedValue({
      http_url_to_repo: 'http://mockurl.git',
    });

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'hosted.gitlab.com?repo=bob&owner=owner',
        token: 'token',
      },
    });

    expect(mockGitlabClient.Namespaces.show).toHaveBeenCalledWith('owner');
    expect(mockGitlabClient.Projects.create).toHaveBeenCalledWith({
      namespaceId: 1234,
      name: 'bob',
      visibility: 'private',
    });
    expect(mockGitlabClient.Branches.create).not.toHaveBeenCalled();
    expect(mockGitlabClient.ProtectedBranches.protect).not.toHaveBeenCalled();
  });

  it('should call the correct Gitlab APIs when the owner is an organization', async () => {
    mockGitlabClient.Users.showCurrentUser.mockResolvedValue({ id: 12345 });
    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: 1234 });
    mockGitlabClient.Groups.allProjects.mockResolvedValue([]);
    mockGitlabClient.Projects.create.mockResolvedValue({
      http_url_to_repo: 'http://mockurl.git',
    });

    await action.handler(mockContext);

    expect(mockGitlabClient.Namespaces.show).toHaveBeenCalledWith('owner');
    expect(mockGitlabClient.Projects.create).toHaveBeenCalledWith({
      namespaceId: 1234,
      name: 'repo',
      visibility: 'private',
      ci_config_path: '.gitlab-ci.yml',
    });
    expect(mockGitlabClient.Branches.create).not.toHaveBeenCalled();
    expect(mockGitlabClient.ProtectedBranches.protect).not.toHaveBeenCalled();
  });

  it('should call the correct Gitlab APIs when the owner is not an organization', async () => {
    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: null });
    mockGitlabClient.Users.showCurrentUser.mockResolvedValue({ id: 12345 });
    mockGitlabClient.Groups.allProjects.mockResolvedValue([]);
    mockGitlabClient.Projects.create.mockResolvedValue({
      http_url_to_repo: 'http://mockurl.git',
    });

    await action.handler(mockContext);

    expect(mockGitlabClient.Namespaces.show).toHaveBeenCalledWith('owner');
    expect(mockGitlabClient.Projects.create).toHaveBeenCalledWith({
      namespaceId: 12345,
      name: 'repo',
      visibility: 'private',
      ci_config_path: '.gitlab-ci.yml',
    });
    expect(mockGitlabClient.Branches.create).not.toHaveBeenCalled();
    expect(mockGitlabClient.ProtectedBranches.protect).not.toHaveBeenCalled();
  });

  it('should not call the creation Gitlab APIs when the repository already exists', async () => {
    mockGitlabClient.Users.showCurrentUser.mockResolvedValue({ id: 12345 });
    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: 1234 });
    mockGitlabClient.Groups.allProjects.mockResolvedValue([
      {
        path: 'repo',
        http_url_to_repo: 'http://mockurl.git',
      },
      {
        path: 'repo-name',
        http_url_to_repo: 'http://mockurl.git',
      },
    ]);

    await action.handler({
      ...mockContext,
      input: { ...mockContext.input, skipExisting: true },
    });

    expect(mockGitlabClient.Namespaces.show).toHaveBeenCalledWith('owner');
    expect(mockGitlabClient.Projects.create).not.toHaveBeenCalled();
    expect(mockGitlabClient.Branches.create).not.toHaveBeenCalled();
    expect(mockGitlabClient.ProtectedBranches.protect).not.toHaveBeenCalled();
  });

  it('should call the creation Gitlab APIs when the repository does not yet exists', async () => {
    mockGitlabClient.Users.showCurrentUser.mockResolvedValue({ id: 12345 });
    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: 1234 });
    mockGitlabClient.Groups.allProjects.mockResolvedValue([
      {
        path: 'repo-name',
      },
    ]);
    mockGitlabClient.Projects.create.mockResolvedValue({
      http_url_to_repo: 'http://mockurl.git',
    });

    await action.handler(mockContext);

    expect(mockGitlabClient.Namespaces.show).toHaveBeenCalledWith('owner');
    expect(mockGitlabClient.Projects.create).toHaveBeenCalledWith({
      namespaceId: 1234,
      name: 'repo',
      visibility: 'private',
      ci_config_path: '.gitlab-ci.yml',
    });
    expect(mockGitlabClient.Branches.create).not.toHaveBeenCalled();
    expect(mockGitlabClient.ProtectedBranches.protect).not.toHaveBeenCalled();
  });

  it('should call the correct Gitlab APIs when using project settings with override of visibility and topics', async () => {
    mockGitlabClient.Users.showCurrentUser.mockResolvedValue({ id: 12345 });
    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: 1234 });
    mockGitlabClient.Groups.allProjects.mockResolvedValue([]);
    mockGitlabClient.Projects.create.mockResolvedValue({
      http_url_to_repo: 'http://mockurl.git',
    });

    await action.handler(mockContextWithSettings);

    expect(mockGitlabClient.Namespaces.show).toHaveBeenCalledWith('owner');
    expect(mockGitlabClient.Projects.create).toHaveBeenCalledWith({
      namespaceId: 1234,
      name: 'repo',
      visibility: 'internal',
      topics: ['topic1', 'topic2'],
      ci_config_path: '.gitlab-ci.yml',
    });
    expect(mockGitlabClient.Branches.create).not.toHaveBeenCalled();
    expect(mockGitlabClient.ProtectedBranches.protect).not.toHaveBeenCalled();
  });

  it('should call the correct Gitlab APIs for branches and protectd branches when branch settings provided', async () => {
    mockGitlabClient.Users.showCurrentUser.mockResolvedValue({ id: 12345 });
    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: 1234 });
    mockGitlabClient.Groups.allProjects.mockResolvedValue([]);
    mockGitlabClient.Projects.create.mockResolvedValue({
      id: 123456,
      http_url_to_repo: 'http://mockurl.git',
    });

    await action.handler(mockContextWithBranches);

    expect(mockGitlabClient.Namespaces.show).toHaveBeenCalledWith('owner');
    expect(mockGitlabClient.Projects.create).toHaveBeenCalledWith({
      namespaceId: 1234,
      name: 'repo',
      visibility: 'private',
    });
    expect(mockGitlabClient.Branches.create).toHaveBeenCalledTimes(2);
    expect(mockGitlabClient.ProtectedBranches.protect).toHaveBeenCalledTimes(2);

    expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
      123456,
      'dev',
      'master',
    );
    expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
      123456,
      'stage',
      'master',
    );

    expect(mockGitlabClient.ProtectedBranches.protect).toHaveBeenCalledWith(
      123456,
      'dev',
    );
    expect(mockGitlabClient.ProtectedBranches.protect).toHaveBeenCalledWith(
      123456,
      'perf',
    );
  });

  it('should call the correct Gitlab APIs for variables when their configuration is provided', async () => {
    mockGitlabClient.Users.showCurrentUser.mockResolvedValue({ id: 12345 });
    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: 1234 });
    mockGitlabClient.Groups.allProjects.mockResolvedValue([]);
    mockGitlabClient.Projects.create.mockResolvedValue({
      id: 123456,
      http_url_to_repo: 'http://mockurl.git',
    });

    await action.handler(mockContextWithVariables);

    expect(mockGitlabClient.Namespaces.show).toHaveBeenCalledWith('owner');
    expect(mockGitlabClient.Projects.create).toHaveBeenCalledWith({
      namespaceId: 1234,
      name: 'repo',
      visibility: 'private',
    });

    expect(mockGitlabClient.ProjectVariables.create).toHaveBeenCalledWith(
      123456,
      'key',
      'value',
      {
        description: 'description',
        variableType: 'env_var',
        protected: true,
        masked: true,
        raw: false,
        environmentScope: '*',
      },
    );
  });

  it('should call initRepoAndPush with the correct values', async () => {
    mockGitlabClient.Users.showCurrentUser.mockResolvedValue({ id: 12345 });
    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: 1234 });
    mockGitlabClient.Groups.allProjects.mockResolvedValue([]);
    mockGitlabClient.Projects.create.mockResolvedValue({
      http_url_to_repo: 'http://mockurl.git',
    });

    await action.handler(mockContext);

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      defaultBranch: 'master',
      remoteUrl: 'http://mockurl.git',
      auth: { username: 'oauth2', password: 'tokenlols' },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: {},
    });
  });

  it('should not call initRepoAndPush when sourcePath is false', async () => {
    mockGitlabClient.Users.showCurrentUser.mockResolvedValue({ id: 12345 });
    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: 1234 });
    mockGitlabClient.Groups.allProjects.mockResolvedValue([]);
    mockGitlabClient.Projects.create.mockResolvedValue({
      http_url_to_repo: 'http://mockurl.git',
    });

    await action.handler({
      ...mockContext,
      input: { ...mockContext.input, sourcePath: false },
    });

    expect(initRepoAndPush).not.toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      defaultBranch: 'master',
      remoteUrl: 'http://mockurl.git',
      auth: { username: 'oauth2', password: 'tokenlols' },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: {},
    });
  });

  it('should call initRepoAndPush with the correct default branch', async () => {
    mockGitlabClient.Users.showCurrentUser.mockResolvedValue({ id: 12345 });
    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: 1234 });
    mockGitlabClient.Groups.allProjects.mockResolvedValue([]);
    mockGitlabClient.Projects.create.mockResolvedValue({
      http_url_to_repo: 'http://mockurl.git',
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
      defaultBranch: 'main',
      remoteUrl: 'http://mockurl.git',
      auth: { username: 'oauth2', password: 'tokenlols' },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: {},
    });
  });

  it('should call initRepoAndPush with the configured defaultAuthor', async () => {
    const customAuthorConfig = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'gitlab.com',
            token: 'tokenlols',
            apiBaseUrl: 'https://api.gitlab.com',
          },
          {
            host: 'hosted.gitlab.com',
            apiBaseUrl: 'https://api.hosted.gitlab.com',
          },
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
    const customAuthorAction = createPublishGitlabAction({
      integrations: customAuthorIntegrations,
      config: customAuthorConfig,
    });

    mockGitlabClient.Users.showCurrentUser.mockResolvedValue({ id: 12345 });
    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: 1234 });
    mockGitlabClient.Groups.allProjects.mockResolvedValue([]);
    mockGitlabClient.Projects.create.mockResolvedValue({
      http_url_to_repo: 'http://mockurl.git',
    });

    await customAuthorAction.handler(mockContext);

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'http://mockurl.git',
      auth: { username: 'oauth2', password: 'tokenlols' },
      logger: mockContext.logger,
      defaultBranch: 'master',
      commitMessage: 'initial commit',
      gitAuthorInfo: { name: 'Test', email: 'example@example.com' },
    });
  });

  it('should call initRepoAndPush with the configured defaultCommitMessage', async () => {
    const customAuthorConfig = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'gitlab.com',
            token: 'tokenlols',
            apiBaseUrl: 'https://api.gitlab.com',
          },
          {
            host: 'hosted.gitlab.com',
            apiBaseUrl: 'https://api.hosted.gitlab.com',
          },
        ],
      },
      scaffolder: {
        defaultCommitMessage: 'Test commit message',
      },
    });

    const customAuthorIntegrations =
      ScmIntegrations.fromConfig(customAuthorConfig);
    const customAuthorAction = createPublishGitlabAction({
      integrations: customAuthorIntegrations,
      config: customAuthorConfig,
    });

    mockGitlabClient.Users.showCurrentUser.mockResolvedValue({ id: 12345 });
    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: 1234 });
    mockGitlabClient.Groups.allProjects.mockResolvedValue([]);
    mockGitlabClient.Projects.create.mockResolvedValue({
      http_url_to_repo: 'http://mockurl.git',
    });

    await customAuthorAction.handler(mockContext);

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'http://mockurl.git',
      auth: { username: 'oauth2', password: 'tokenlols' },
      defaultBranch: 'master',
      commitMessage: 'initial commit',
      gitAuthorInfo: { email: undefined, name: undefined },
      logger: mockContext.logger,
    });
  });

  it('should call output with the remoteUrl and repoContentsUrl and projectId', async () => {
    mockGitlabClient.Users.showCurrentUser.mockResolvedValue({ id: 12345 });
    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: 1234 });
    mockGitlabClient.Groups.allProjects.mockResolvedValue([]);
    mockGitlabClient.Projects.create.mockResolvedValue({
      http_url_to_repo: 'http://mockurl.git',
      id: 1234,
    });

    await action.handler(mockContext);

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'http://mockurl',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'http://mockurl/-/blob/master',
    );
    expect(mockContext.output).toHaveBeenCalledWith('projectId', 1234);
  });

  it('should call the correct Gitlab APIs when setUserAsOwner option is true and integration config has a token', async () => {
    const customAuthorConfig = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'gitlab.com',
            token: 'tokenlols',
            apiBaseUrl: 'https://api.gitlab.com',
          },
        ],
      },
    });

    const customAuthorIntegrations =
      ScmIntegrations.fromConfig(customAuthorConfig);
    const customAuthorAction = createPublishGitlabAction({
      integrations: customAuthorIntegrations,
      config: customAuthorConfig,
    });

    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: 1234 });
    mockGitlabClient.Users.showCurrentUser.mockResolvedValue({ id: 12345 });
    mockGitlabClient.Groups.allProjects.mockResolvedValue([]);
    mockGitlabClient.Projects.create.mockResolvedValue({
      id: 123456,
      http_url_to_repo: 'http://mockurl.git',
    });

    await customAuthorAction.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        token: 'token',
        setUserAsOwner: true,
      },
    });

    expect(mockGitlabClient.Namespaces.show).toHaveBeenCalledWith('owner');
    expect(mockGitlabClient.Users.showCurrentUser).toHaveBeenCalled();
    expect(mockGitlabClient.ProjectMembers.add).toHaveBeenCalledWith(
      123456,
      12345,
      50,
    );
    expect(mockGitlabClient.Projects.create).toHaveBeenCalledWith({
      namespaceId: 1234,
      name: 'repo',
      visibility: 'private',
    });
  });

  it('should show proper error message when token has insufficient permissions or namespace not found', async () => {
    mockGitlabClient.Namespaces.show.mockRejectedValue({
      response: {
        statusCode: 404,
      },
    });
    const owner = 'infrastructure/devex';
    const repoName = 'backstage';

    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: `gitlab.com?owner=${owner}&repo=${repoName}` },
      }),
    ).rejects.toThrow(
      `The namespace ${owner} is not found or the user doesn't have permissions to access it`,
    );
  });
});
