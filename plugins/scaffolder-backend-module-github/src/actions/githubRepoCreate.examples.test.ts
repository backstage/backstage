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

import { TemplateAction } from '@backstage/plugin-scaffolder-node';

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
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { createGithubRepoCreateAction } from './githubRepoCreate';
import { entityRefToName } from './gitHelpers';
import yaml from 'yaml';
import { examples } from './githubRepoCreate.examples';

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
  },
  request: jest.fn().mockResolvedValue({}),
};
jest.mock('octokit', () => ({
  Octokit: class {
    constructor() {
      return mockOctokit;
    }
  },
}));

describe('github:repo:create examples', () => {
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

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[0].example).steps[0].input,
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
  });

  it('should call the githubApis with a description for createInOrg', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[1].example).steps[0].input,
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
      name: 'repo',
      description: 'My new repository',
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
  });

  it('should call the githubApis with wiki and issues disabled for createInOrg', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[2].example).steps[0].input,
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: false, // disable issues
      has_wiki: false, // disable wiki
    });
  });

  it(`Should ${examples[3].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[3].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: 'https://example.com',
    });
  });

  it(`Should ${examples[4].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[4].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[5].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[5].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[6].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[6].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[7].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[7].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
      name: 'repo',
      org: 'owner',
      private: true,
      delete_branch_on_merge: false,
      allow_squash_merge: true,
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      squash_merge_commit_message: 'COMMIT_MESSAGES',
      allow_merge_commit: false,
      allow_rebase_merge: false,
      allow_auto_merge: false,
      visibility: 'private',
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[8].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[8].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
      name: 'repo',
      org: 'owner',
      private: true,
      delete_branch_on_merge: false,
      allow_squash_merge: true,
      squash_merge_commit_title: 'pull_request_title',
      squash_merge_commit_message: 'COMMIT_MESSAGES',
      allow_merge_commit: true,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      visibility: 'private',
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[9].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[9].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
      name: 'repo',
      org: 'owner',
      private: true,
      delete_branch_on_merge: false,
      allow_squash_merge: true,
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      squash_merge_commit_message: 'blank',
      allow_merge_commit: true,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      visibility: 'private',
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[10].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[10].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
      name: 'repo',
      org: 'owner',
      private: true,
      delete_branch_on_merge: false,
      allow_squash_merge: true,
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      squash_merge_commit_message: 'COMMIT_MESSAGES',
      allow_merge_commit: true,
      allow_rebase_merge: true,
      allow_auto_merge: true,
      visibility: 'private',
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[11].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[11].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[12].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[12].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[13].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[13].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[14].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[14].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[15].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[15].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[16].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[16].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[17].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[17].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
      name: 'repo',
      org: 'owner',
      private: true,
      delete_branch_on_merge: true,
      allow_squash_merge: true,
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      squash_merge_commit_message: 'COMMIT_MESSAGES',
      allow_merge_commit: true,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      visibility: 'private',
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[18].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[18].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[19].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[19].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[20].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[20].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      visibility: 'internal',
      has_issues: undefined,
      description: 'A repository for project XYZ',
      has_projects: undefined,
      has_wiki: undefined,
      homepage: 'https://project-xyz.com',
    });
  });

  it(`Should ${examples[21].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[21].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[22].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[22].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[23].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[23].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: true,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[24].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[24].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
      name: 'repo',
      org: 'owner',
      private: true,
      delete_branch_on_merge: false,
      allow_squash_merge: true,
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      squash_merge_commit_message: 'COMMIT_MESSAGES',
      allow_merge_commit: false,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      visibility: 'private',
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[25].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[25].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      visibility: 'internal',
      has_issues: false,
      description: undefined,
      has_projects: false,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[26].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[26].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[27].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[27].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[28].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[28].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: 'Repository for project ABC',
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[29].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[29].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[30].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[30].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[31].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[31].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[32].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[32].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[33].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[33].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[34].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[34].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      visibility: 'internal',
      has_issues: undefined,
      description: 'Internal repository for team collaboration',
      has_projects: undefined,
      has_wiki: undefined,
      homepage: 'https://internal.example.com',
    });
  });

  it(`Should ${examples[35].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[35].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[36].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[36].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: true,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[37].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[37].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[38].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[38].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[39].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[39].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      visibility: 'internal',
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[40].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[40].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: 'Repository for web application project',
      has_projects: undefined,
      has_wiki: undefined,
      homepage: 'https://webapp.example.com',
    });
  });

  it(`Should ${examples[41].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[41].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
      name: 'repo',
      org: 'owner',
      private: true,
      delete_branch_on_merge: false,
      allow_squash_merge: true,
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      squash_merge_commit_message: 'pull_request_description',
      allow_merge_commit: false,
      allow_rebase_merge: false,
      allow_auto_merge: false,
      visibility: 'private',
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[42].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[42].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
      name: 'repo',
      org: 'owner',
      private: true,
      delete_branch_on_merge: false,
      allow_squash_merge: false,
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      squash_merge_commit_message: 'COMMIT_MESSAGES',
      allow_merge_commit: false,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      visibility: 'private',
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[43].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[43].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[44].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[44].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[45].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[45].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[46].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[46].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: false,
      description: 'Repository for backend service',
      has_projects: undefined,
      has_wiki: false,
      homepage: undefined,
    });
  });

  it(`Should ${examples[47].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[47].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[48].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[48].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[49].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[49].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[50].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[50].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
      name: 'repo',
      org: 'owner',
      private: true,
      delete_branch_on_merge: false,
      allow_squash_merge: true,
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      squash_merge_commit_message: 'COMMIT_MESSAGES',
      allow_merge_commit: false,
      allow_rebase_merge: true,
      allow_auto_merge: true,
      visibility: 'private',
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[51].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[51].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: 'https://example.com',
    });
  });

  it(`Should ${examples[52].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[52].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: 'Repository for microservice development',
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[53].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[53].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[54].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[54].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
      name: 'repo',
      org: 'owner',
      private: true,
      delete_branch_on_merge: true,
      allow_squash_merge: true,
      squash_merge_commit_title: 'COMMIT_OR_PR_TITLE',
      squash_merge_commit_message: 'COMMIT_MESSAGES',
      allow_merge_commit: true,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      visibility: 'private',
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[55].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[55].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });

  it(`Should ${examples[56].description}`, async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockOctokit.rest.repos.createInOrg.mockResolvedValue({ data: {} });

    let input;
    try {
      input = yaml.parse(examples[56].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockOctokit.rest.repos.createInOrg).toHaveBeenCalledWith({
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
      has_issues: undefined,
      description: undefined,
      has_projects: undefined,
      has_wiki: undefined,
      homepage: undefined,
    });
  });
});
