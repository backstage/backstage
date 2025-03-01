/*
 * Copyright 2022 The Backstage Authors
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

import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { createPublishGitlabMergeRequestAction } from './gitlabMergeRequest';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { examples } from './gitlabMergeRequest.examples';
import yaml from 'yaml';

const mockGitlabClient = {
  Namespaces: {
    show: jest.fn(),
  },
  Branches: {
    create: jest.fn(),
  },
  Commits: {
    create: jest.fn(() => ({ id: 'mockId' })),
  },
  MergeRequests: {
    create: jest.fn(async (_: any) => {
      return {
        default_branch: 'main',
      };
    }),
    show: jest.fn(async (_: any) => {
      return {
        default_branch: 'main',
      };
    }),
    edit: jest.fn(async (_: any) => {
      return {
        default_branch: 'main',
      };
    }),
  },
  MergeRequestApprovals: {
    allApprovalRules: jest.fn(async (_: any) => {
      return [
        {
          id: 123,
          name: 'rule1',
          rule_type: 'regular',
          eligible_approvers: [
            {
              id: 123,
              username: 'John Smith',
            },
            {
              id: 456,
              username: 'Jane Doe',
            },
          ],
          approvals_required: 1,
          users: [],
          contains_hidden_groups: false,
          report_type: null,
          section: null,
          source_rule: { approvals_required: 1 },
          overridden: false,
        },
        {
          id: 456,
          name: 'All Members',
          rule_type: 'any_approver',
          eligible_approvers: [],
          approvals_required: 1,
          users: [],
          groups: [],
          contains_hidden_groups: false,
          report_type: null,
          section: null,
          source_rule: { approvals_required: 1 },
          overridden: false,
        },
      ];
    }),
  },
  Projects: {
    create: jest.fn(),
    show: jest.fn(async (_: any) => {
      return {
        default_branch: 'main',
      };
    }),
  },
  Users: {
    current: jest.fn(),
    all: jest.fn(async (userOptions: { username: string }) => {
      const users: string[] = ['John Smith', 'my-assignee'];
      if (!users.includes(userOptions.username))
        throw new Error('user does not exist');
      else
        return [
          {
            id: 123,
          },
        ];
    }),
  },
};

jest.mock('@gitbeaker/rest', () => ({
  Gitlab: class {
    constructor() {
      return mockGitlabClient;
    }
  },
}));

describe('createGitLabMergeRequest', () => {
  let instance: TemplateAction<any>;

  const mockDir = createMockDirectory();
  const workspacePath = mockDir.resolve('workspace');

  beforeEach(() => {
    jest.clearAllMocks();

    mockDir.clear();

    const config = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'gitlab.com',
            token: 'token',
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
    instance = createPublishGitlabMergeRequestAction({ integrations });
  });

  describe('createGitLabMergeRequestWithAssignee', () => {
    it(`Should ${examples[0].description}`, async () => {
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const input = yaml.parse(examples[0].example).steps[0].input;
      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        {
          description: 'This MR is really good',
          removeSourceBranch: false,
          assigneeId: 123,
        },
      );
    });

    it('assignee is not set when a valid assignee username is not passed in options', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'This is an important change',
        removeSourceBranch: false,
        targetPath: 'Subdirectory',
        assingnee: 'John Doe',
      };
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        {
          description: 'This is an important change',
          removeSourceBranch: false,
          assigneeId: undefined,
        },
      );
    });
  });

  describe('createGitLabMergeRequestWithRemoveBranch', () => {
    it(`Should ${examples[1].description}`, async () => {
      const input = yaml.parse(examples[1].example).steps[0].input;
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        { description: 'This MR is really good', removeSourceBranch: true },
      );
    });
  });

  describe('createGitLabMergeRequestWithSpecifiedTargetBranch', () => {
    it(`Should ${examples[2].description}`, async () => {
      const input = yaml.parse(examples[2].example).steps[0].input;
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });
      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Projects.show).not.toHaveBeenCalled();
      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'test',
      );
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'test',
        'Create my new MR',
        { description: 'This MR is really good', removeSourceBranch: false },
      );
      expect(ctx.output).toHaveBeenCalledWith('targetBranchName', 'test');
    });
  });

  describe('createGitLabMergeRequestWithCommitAction', () => {
    it(`Should ${examples[3].description}`, async () => {
      const input = yaml.parse(examples[3].example).steps[0].input;
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'Create my new MR',
        [
          {
            action: 'create',
            filePath: 'source/foo.txt',
            content: 'SGVsbG8gdGhlcmUh',
            encoding: 'base64',
            execute_filemode: false,
          },
        ],
      );
    });

    it(`Should ${examples[4].description}`, async () => {
      const input = yaml.parse(examples[4].example).steps[0].input;
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'Create my new MR',
        [
          {
            action: 'delete',
            filePath: 'source/foo.txt',
            content: 'SGVsbG8gdGhlcmUh',
            encoding: 'base64',
            execute_filemode: false,
          },
        ],
      );
    });

    it(`Should ${examples[5].description}`, async () => {
      const input = yaml.parse(examples[5].example).steps[0].input;
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'Create my new MR',
        [
          {
            action: 'update',
            filePath: 'source/foo.txt',
            content: 'SGVsbG8gdGhlcmUh',
            encoding: 'base64',
            execute_filemode: false,
          },
        ],
      );
    });
  });
});
