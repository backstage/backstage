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
import { createRootLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { createPublishGitlabMergeRequestAction } from './gitlabMergeRequest';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';

// Make sure root logger is initialized ahead of FS mock
createRootLogger();

const mockGitlabClient = {
  Namespaces: {
    show: jest.fn(),
  },
  Branches: {
    create: jest.fn(),
    show: jest.fn(async (_repoID: string | number, name: string) => {
      if (['main', 'existing-branch'].includes(name)) {
        return {
          name,
          merged: name === 'main',
          protected: name === 'main',
          default: name === 'main',
          developers_can_push: name !== 'main',
          developers_can_merge: name !== 'main',
          can_push: name !== 'main',
          web_url: `https://foo.bar.baz/owner/repo/-/tree/${name}`,
          commit: { message: 'last change' },
        };
      }
      throw new Error(`Unknown branch ${name}`);
    }),
  },
  Commits: {
    create: jest.fn(),
  },
  MergeRequests: {
    create: jest.fn(async (repoId: string) => {
      if (repoId === 'owner/repo-without-approvals') {
        return {
          iid: 5,
        };
      }
      return {
        default_branch: 'main',
        iid: 4,
      };
    }),
    show: jest.fn(async (repoId: string, iid: number) => {
      if (repoId === 'owner/repo' && iid === 4) {
        return {
          iid: 4,
        };
      } else if (repoId === 'owner/repo-without-approvals' && iid === 5) {
        return {
          iid: 5,
        };
      }
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
    allApprovalRules: jest.fn(
      async (repoId: string, options: { mergerequestIId: number }) => {
        if (
          repoId === 'owner/repo-without-approvals' &&
          options.mergerequestIId === 5
        ) {
          return [];
        }
        return [
          {
            id: 123,
            name: 'rule1',
            rule_type: 'regular',
            eligible_approvers: [
              {
                id: 234,
                username: 'Bob Vance',
              },
              {
                id: 345,
                username: 'Dina Fox',
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
      },
    ),
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
    all: jest.fn(async (userOptions: { username: string }) => {
      switch (userOptions.username) {
        case 'John Smith':
          return [
            {
              id: 123,
            },
          ];
        case 'Bob Vance':
          return [
            {
              id: 234,
            },
          ];
        case 'Jane Doe':
          return [
            {
              id: 456,
            },
          ];
        default:
          throw new Error('user does not exist');
      }
    }),
  },
  Repositories: {
    allRepositoryTrees: jest.fn(
      async (
        repoID: string | number,
        options: { ref: string; recursive: boolean; path: string | undefined },
      ) => {
        if (repoID !== 'owner/repo') throw new Error('repo does not exist');
        if (options.recursive === false) throw new Error('malformed options');
        else {
          return [
            {
              id: 'a1e8f8d745cc87e3a9248358d9352bb7f9a0aeba',
              name: 'auto.txt',
              type: 'blob',
              path: 'source/auto.txt',
              mode: '040000',
            },
          ];
        }
      },
    ),
  },
  RepositoryFiles: {
    show: jest.fn(
      async (repoID: string | number, filePath: string, ref: string) => {
        if (repoID !== 'owner/repo') throw new Error('repo does not exist');
        if (filePath !== 'source/auto.txt')
          throw new Error('filePath does not exist');
        return {
          file_name: 'auto.txt',
          file_path: 'source/auto.txt',
          size: 11,
          encoding: 'base64',
          content: 'Zm9vLWJhci1iYXo=',
          content_sha256:
            '269dce1a5bb90188b2d9cf542a7c30e410c7d8251e34a97bfea56062df51ae23',
          ref,
          blob_id: 'a1e8f8d745cc87e3a9248358d9352bb7f9a0aeba',
          commit_id: 'd5a3ff139356ce33e37e73add446f16869741b50',
          last_commit_id: '570e7b2abdd848b95f2f578043fc23bd6f6fd24d',
        };
      },
    ),
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

  describe('createGitLabMergeRequestWithSpecifiedTargetBranch', () => {
    it('removeSourceBranch is false by default when not passed in options', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        targetBranchName: 'test',
        description: 'This MR is really good',
        targetPath: 'Subdirectory',
      };
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
      expect(mockGitlabClient.Commits.create).not.toHaveBeenCalled();
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

  describe('createGitLabMergeRequestWithoutRemoveBranch', () => {
    it('removeSourceBranch is false by default when not passed in options', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'This MR is really good',
        targetPath: 'Subdirectory',
      };
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });
      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Projects.show).toHaveBeenCalledWith('owner/repo');
      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
      expect(mockGitlabClient.Commits.create).not.toHaveBeenCalled();
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        { description: 'This MR is really good', removeSourceBranch: false },
      );
      expect(ctx.output).toHaveBeenCalledWith('targetBranchName', 'main');
    });
  });

  describe('createGitLabMergeRequestWithRemoveBranch', () => {
    it('removeSourceBranch is true when true is passed in options', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'MR description',
        removeSourceBranch: true,
        targetPath: 'Subdirectory',
      };
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
      expect(mockGitlabClient.Commits.create).not.toHaveBeenCalled();
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        { description: 'MR description', removeSourceBranch: true },
      );
    });

    it('removeSourceBranch is false when false is passed in options', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'other MR description',
        removeSourceBranch: false,
        targetPath: 'Subdirectory',
      };
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
      expect(mockGitlabClient.Commits.create).not.toHaveBeenCalled();
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        {
          description: 'other MR description',
          removeSourceBranch: false,
        },
      );
    });
  });

  describe('createGitLabMergeRequestWithAssignee', () => {
    it('assignee is set correcly when a valid assignee username is passed in options', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'This is an important change',
        removeSourceBranch: false,
        targetPath: 'Subdirectory',
        assignee: 'John Smith',
      };
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
      expect(mockGitlabClient.Commits.create).not.toHaveBeenCalled();
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        {
          description: 'This is an important change',
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

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
      expect(mockGitlabClient.Commits.create).not.toHaveBeenCalled();
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
  describe('createGitLabMergeRequestWithoutAssignee', () => {
    it('merge request is successfully created without an assignee when assignee username is not passed in options', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'This is an important change',
        removeSourceBranch: false,
        targetPath: 'Subdirectory',
      };
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
      expect(mockGitlabClient.Commits.create).not.toHaveBeenCalled();
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        {
          description: 'This is an important change',
          removeSourceBranch: false,
        },
      );
    });

    it('merge request is successfully created without an assignee when assignee is not found in Gitlab', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'This is an important change',
        removeSourceBranch: false,
        targetPath: 'Subdirectory',
        assignee: 'Unknown',
      };
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
      expect(mockGitlabClient.Commits.create).not.toHaveBeenCalled();
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        {
          description: 'This is an important change',
          removeSourceBranch: false,
        },
      );
    });

    it('use workspacePath as default when no sourcePath or targetPath is specified', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'This MR is really good',
      };
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });
      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'Create my new MR',
        expect.arrayContaining([
          {
            action: 'create',
            filePath: 'irrelevant/bar.txt',
            encoding: 'base64',
            content: 'Tm90aGluZyB0byBzZWUgaGVyZQ==',
            execute_filemode: false,
          },
          {
            action: 'create',
            filePath: 'source/foo.txt',
            encoding: 'base64',
            content: 'SGVsbG8gdGhlcmUh',
            execute_filemode: false,
          },
        ]),
      );
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        {
          description: 'This MR is really good',
          removeSourceBranch: false,
        },
      );
    });
  });

  describe('createGitlabMergeRequestWithReviewers', () => {
    it('no reviewers are set when a no reviewer are passed in options', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'This is an important change',
        removeSourceBranch: false,
        targetPath: 'Subdirectory',
        assignee: 'John Smith',
      };
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
      expect(mockGitlabClient.Commits.create).not.toHaveBeenCalled();
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        {
          description: 'This is an important change',
          removeSourceBranch: false,
          assigneeId: 123,
        },
      );
      expect(
        mockGitlabClient.MergeRequestApprovals.allApprovalRules,
      ).toHaveBeenCalled();
      expect(mockGitlabClient.MergeRequests.edit).toHaveBeenCalledWith(
        'owner/repo',
        4,
        {
          reviewerIds: [234, 345], // Approval Rule Members
        },
      );
    });

    it('reviewer is set correcly when a valid reviewer username is passed in options in combination with MR approval rules', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'This is an important change',
        removeSourceBranch: false,
        targetPath: 'Subdirectory',
        assignee: 'John Smith',
        reviewers: ['Jane Doe', 'Bob Vance'],
      };
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
      expect(mockGitlabClient.Commits.create).not.toHaveBeenCalled();
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        {
          description: 'This is an important change',
          removeSourceBranch: false,
          assigneeId: 123,
          reviewerIds: [456, 234], // Jane Doe and Bob Vance
        },
      );
      expect(
        mockGitlabClient.MergeRequestApprovals.allApprovalRules,
      ).toHaveBeenCalled();
      expect(mockGitlabClient.MergeRequests.edit).toHaveBeenCalledWith(
        'owner/repo',
        4,
        {
          reviewerIds: [234, 345, 456], // Approval Rule Members + Jane Doe (individual reviewer) but no duplicates (Bob Vance)
        },
      );
    });

    it('reviewer is set correcly when a valid reviewer username is passed in options and no MR rules exist', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo-without-approvals&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'This is an important change',
        removeSourceBranch: false,
        targetPath: 'Subdirectory',
        assignee: 'John Smith',
        reviewers: ['Jane Doe', 'Bob Vance'],
      };
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo-without-approvals',
        'new-mr',
        'main',
      );
      expect(mockGitlabClient.Commits.create).not.toHaveBeenCalled();
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo-without-approvals',
        'new-mr',
        'main',
        'Create my new MR',
        {
          description: 'This is an important change',
          removeSourceBranch: false,
          assigneeId: 123,
          reviewerIds: [456, 234], // Jane Doe and Bob Vance
        },
      );
      expect(
        mockGitlabClient.MergeRequestApprovals.allApprovalRules,
      ).toHaveBeenCalledWith('owner/repo-without-approvals', {
        mergerequestIId: 5,
      });
      expect(mockGitlabClient.MergeRequests.edit).not.toHaveBeenCalled();
    });

    it('reviewers are set correcly when valid reviewers username are passed in options', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'This is an important change',
        removeSourceBranch: false,
        targetPath: 'Subdirectory',
        assignee: 'John Smith',
        reviewers: ['Jane Doe', 'John Smith'],
      };
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
      expect(mockGitlabClient.Commits.create).not.toHaveBeenCalled();
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        {
          description: 'This is an important change',
          removeSourceBranch: false,
          assigneeId: 123,
          reviewerIds: [456, 123],
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
        reviewers: ['John Doe'],
      };
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
      expect(mockGitlabClient.Commits.create).not.toHaveBeenCalled();
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        {
          description: 'This is an important change',
          removeSourceBranch: false,
          assigneeId: undefined,
          reviewerIds: [],
        },
      );
    });
  });

  describe('createGitLabMergeRequestWithoutCommitAction', () => {
    it('default commitAction is auto', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'This MR is really good',
        targetPath: 'source',
      };
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!', 'auto.txt': 'File exist' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });
      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'Create my new MR',
        expect.arrayContaining([
          {
            action: 'update',
            filePath: 'source/auto.txt',
            content: 'RmlsZSBleGlzdA==',
            encoding: 'base64',
            execute_filemode: false,
          },
          {
            action: 'create',
            filePath: 'source/foo.txt',
            content: 'SGVsbG8gdGhlcmUh',
            encoding: 'base64',
            execute_filemode: false,
          },
        ]),
      );
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        {
          description: 'This MR is really good',
          removeSourceBranch: false,
        },
      );
    });
  });

  describe('createGitLabMergeRequestWithCommitAction', () => {
    it('commitAction is create when create is passed in options', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'MR description',
        commitAction: 'create',
        targetPath: 'source',
      };
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
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
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        {
          description: 'MR description',
          removeSourceBranch: false,
        },
      );
    });

    it('commitAction is update when update is passed in options', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'MR description',
        commitAction: 'update',
        targetPath: 'source',
      };
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
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
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        {
          description: 'MR description',
          removeSourceBranch: false,
        },
      );
    });

    it('commitAction is auto when auto is passed in options', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'MR description',
        commitAction: 'auto',
      };
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!', 'auto.txt': 'File exist' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'Create my new MR',
        expect.arrayContaining([
          {
            action: 'update',
            filePath: 'source/auto.txt',
            content: 'RmlsZSBleGlzdA==',
            encoding: 'base64',
            execute_filemode: false,
          },
          {
            action: 'create',
            filePath: 'source/foo.txt',
            content: 'SGVsbG8gdGhlcmUh',
            encoding: 'base64',
            execute_filemode: false,
          },
        ]),
      );
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        {
          description: 'MR description',
          removeSourceBranch: false,
        },
      );
    });

    it('commitAction is auto when auto is passed in options with targetPath', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'MR description',
        commitAction: 'auto',
        targetPath: 'source',
      };
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!', 'auto.txt': 'File exist' },
          irrevelant: {},
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'Create my new MR',
        expect.arrayContaining([
          {
            action: 'update',
            filePath: 'source/auto.txt',
            content: 'RmlsZSBleGlzdA==',
            encoding: 'base64',
            execute_filemode: false,
          },
          {
            action: 'create',
            filePath: 'source/foo.txt',
            content: 'SGVsbG8gdGhlcmUh',
            encoding: 'base64',
            execute_filemode: false,
          },
        ]),
      );
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        {
          description: 'MR description',
          removeSourceBranch: false,
        },
      );
    });

    it('commitAction is delete when delete is passed in options', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'other MR description',
        commitAction: 'delete',
        targetPath: 'source',
      };
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
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
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        {
          description: 'other MR description',
          removeSourceBranch: false,
        },
      );
    });
    it('commitAction skip skips commit', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'MR description',
        commitAction: 'skip',
      };
      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
      expect(mockGitlabClient.Commits.create).not.toHaveBeenCalled();
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        {
          description: 'MR description',
          removeSourceBranch: false,
        },
      );
    });
    it('commitAction skip reuses existing branch', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'existing-branch',
        description: 'MR description',
        commitAction: 'skip',
      };
      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.show).toHaveBeenCalledWith(
        'owner/repo',
        'existing-branch',
      );
      expect(mockGitlabClient.Branches.create).not.toHaveBeenCalled();
      expect(mockGitlabClient.Commits.create).not.toHaveBeenCalled();
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'existing-branch',
        'main',
        'Create my new MR',
        {
          description: 'MR description',
          removeSourceBranch: false,
        },
      );
    });
    it('commitAction auto skips unmodified files', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'MR description',
        commitAction: 'auto',
      };
      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!', 'auto.txt': 'foo-bar-baz' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'Create my new MR',
        expect.arrayContaining([
          {
            action: 'create',
            filePath: 'source/foo.txt',
            content: 'SGVsbG8gdGhlcmUh',
            encoding: 'base64',
            execute_filemode: false,
          },
        ]),
      );
      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        {
          description: 'MR description',
          removeSourceBranch: false,
        },
      );
    });
  });

  describe('with sourcePath', () => {
    it('creates a Merge Request with only relevant files', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'MR description',
        sourcePath: 'source',
        commitAction: 'create',
      };

      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });

      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'Create my new MR',
        [
          {
            action: 'create',
            filePath: 'foo.txt',
            content: 'SGVsbG8gdGhlcmUh',
            encoding: 'base64',
            execute_filemode: false,
          },
        ],
      );
    });

    it('creates a Merge Request with only relevant files placed under different targetPath', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'MR description',
        sourcePath: 'source',
        targetPath: 'target',
        commitAction: 'create',
      };

      mockDir.setContent({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });

      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
      );
      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'Create my new MR',
        [
          {
            action: 'create',
            filePath: 'target/foo.txt',
            content: 'SGVsbG8gdGhlcmUh',
            encoding: 'base64',
            execute_filemode: false,
          },
        ],
      );
    });

    it('should not allow to use files outside of the workspace', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'MR description',
        sourcePath: '../../test',
        commitAction: 'create',
      };

      const ctx = createMockActionContext({ input, workspacePath });

      await expect(instance.handler(ctx)).rejects.toThrow(
        'Relative path is not allowed to refer to a directory outside its parent',
      );
    });
  });
});
