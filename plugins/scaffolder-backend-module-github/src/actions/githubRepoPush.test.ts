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

const mockGit = {
  init: jest.fn(),
  add: jest.fn(),
  checkout: jest.fn(),
  commit: jest
    .fn()
    .mockResolvedValue('220f19cc36b551763d157f1b5e4a4b446165dbd6'),
  fetch: jest.fn(),
  addRemote: jest.fn(),
  push: jest.fn(),
};

jest.mock('@backstage/backend-common', () => ({
  loggerToWinstonLogger: jest.requireActual('@backstage/backend-common')
    .loggerToWinstonLogger,
  Git: {
    fromAuth() {
      return mockGit;
    },
  },
}));

jest.mock('./gitHelpers', () => {
  return {
    ...jest.requireActual('./gitHelpers'),
    entityRefToName: jest.fn(),
    enableBranchProtectionOnDefaultRepoBranch: jest.fn(),
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

import {
  TemplateAction,
  initRepoAndPush,
} from '@backstage/plugin-scaffolder-node';
import { ConfigReader } from '@backstage/config';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { enableBranchProtectionOnDefaultRepoBranch } from './gitHelpers';
import { createGithubRepoPushAction } from './githubRepoPush';

const initRepoAndPushMocked = initRepoAndPush as jest.Mock<
  Promise<{ commitHash: string }>
>;

const mockOctokit = {
  rest: {
    repos: {
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

describe('github:repo:push', () => {
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
      repoUrl: 'github.com?repo=repository&owner=owner',
      description: 'description',
      repoVisibility: 'private' as const,
      access: 'owner/blam',
    },
  });

  beforeEach(() => {
    jest.resetAllMocks();

    initRepoAndPushMocked.mockResolvedValue({ commitHash: 'test123' });

    githubCredentialsProvider =
      DefaultGithubCredentialsProvider.fromIntegrations(integrations);
    action = createGithubRepoPushAction({
      integrations,
      config,
      githubCredentialsProvider,
    });
  });

  it('should call initRepoAndPush with the correct values', async () => {
    mockOctokit.rest.repos.get.mockResolvedValue({
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
    mockOctokit.rest.repos.get.mockResolvedValue({
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
    const customAuthorAction = createGithubRepoPushAction({
      integrations: customAuthorIntegrations,
      config: customAuthorConfig,
      githubCredentialsProvider,
    });

    mockOctokit.rest.repos.get.mockResolvedValue({
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
    const customAuthorAction = createGithubRepoPushAction({
      integrations: customAuthorIntegrations,
      config: customAuthorConfig,
      githubCredentialsProvider,
    });

    mockOctokit.rest.repos.get.mockResolvedValue({
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

  it('should call output with the remoteUrl and the repoContentsUrl', async () => {
    mockOctokit.rest.repos.get.mockResolvedValue({
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
    mockOctokit.rest.repos.get.mockResolvedValue({
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
    mockOctokit.rest.repos.get.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler(mockContext);

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repository',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      requiredCommitSigning: false,
      restrictions: undefined,
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
      repoName: 'repository',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: true,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      requiredCommitSigning: false,
      restrictions: undefined,
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
      repoName: 'repository',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      requiredCommitSigning: false,
      restrictions: undefined,
    });
  });

  it('should call enableBranchProtectionOnDefaultRepoBranch with the correct values of enforceAdmins', async () => {
    mockOctokit.rest.repos.get.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler(mockContext);

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repository',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      requiredCommitSigning: false,
      restrictions: undefined,
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
      repoName: 'repository',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      requiredCommitSigning: false,
      restrictions: undefined,
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
      repoName: 'repository',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: false,
      dismissStaleReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      requiredCommitSigning: false,
      restrictions: undefined,
    });
  });

  it('should call enableBranchProtectionOnDefaultRepoBranch with the correct values of requiredStatusCheckContexts and requireBranchesToBeUpToDate', async () => {
    mockOctokit.rest.repos.get.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler(mockContext);

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repository',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      requiredCommitSigning: false,
      restrictions: undefined,
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
      repoName: 'repository',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      requiredStatusCheckContexts: ['statusCheck'],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      requiredCommitSigning: false,
      restrictions: undefined,
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
      repoName: 'repository',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      requiredStatusCheckContexts: ['statusCheck'],
      requireBranchesToBeUpToDate: false,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      requiredCommitSigning: false,
      restrictions: undefined,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        requiredStatusCheckContexts: [],
        requireBranchesToBeUpToDate: true,
        requiredConversationResolution: false,
      },
    });

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repository',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      requiredCommitSigning: false,
      restrictions: undefined,
    });
  });

  it('should not call enableBranchProtectionOnDefaultRepoBranch with protectDefaultBranch disabled', async () => {
    mockOctokit.rest.repos.get.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
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

  it('should call enableBranchProtectionOnDefaultRepoBranch with the correct values of dismissStaleReviews', async () => {
    mockOctokit.rest.repos.get.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler(mockContext);

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repository',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      requiredCommitSigning: false,
      restrictions: undefined,
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
      repoName: 'repository',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: true,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      requiredCommitSigning: false,
      restrictions: undefined,
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
      repoName: 'repository',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      requiredCommitSigning: false,
      restrictions: undefined,
    });
  });

  it('should call enableBranchProtectionOnDefaultRepoBranch with the correct values of requiredConversationResolution', async () => {
    mockOctokit.rest.repos.get.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler(mockContext);

    expect(enableBranchProtectionOnDefaultRepoBranch).toHaveBeenCalledWith({
      owner: 'owner',
      client: mockOctokit,
      repoName: 'repository',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      requiredCommitSigning: false,
      restrictions: undefined,
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
      repoName: 'repository',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: true,
      enforceAdmins: true,
      dismissStaleReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      requiredCommitSigning: false,
      restrictions: undefined,
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
      repoName: 'repository',
      logger: mockContext.logger,
      defaultBranch: 'master',
      requireCodeOwnerReviews: false,
      requiredStatusCheckContexts: [],
      requireBranchesToBeUpToDate: true,
      requiredConversationResolution: false,
      enforceAdmins: true,
      dismissStaleReviews: false,
      bypassPullRequestAllowances: undefined,
      requiredApprovingReviewCount: 1,
      requiredCommitSigning: false,
      restrictions: undefined,
    });
  });
});
