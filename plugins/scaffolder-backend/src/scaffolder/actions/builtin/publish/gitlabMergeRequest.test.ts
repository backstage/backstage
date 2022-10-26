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
import { getRootLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import mockFs from 'mock-fs';
import os from 'os';
import { resolve as resolvePath } from 'path';
import { Writable } from 'stream';
import { TemplateAction } from '../../types';
import { createPublishGitlabMergeRequestAction } from './gitlabMergeRequest';

const root = os.platform() === 'win32' ? 'C:\\root' : '/root';
const workspacePath = resolvePath(root, 'my-workspace');

const mockGitlabClient = {
  Namespaces: {
    show: jest.fn(),
  },
  Branches: {
    create: jest.fn(),
  },
  Commits: {
    create: jest.fn(),
  },
  MergeRequests: {
    create: jest.fn(async (_: any) => {
      return {
        default_branch: 'main',
      };
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
    username: jest.fn(async (user: string) => {
      if (user !== 'John Smith') throw new Error('user does not exist');
      else
        return [
          {
            id: 123,
          },
        ];
    }),
  },
};

jest.mock('@gitbeaker/node', () => ({
  Gitlab: class {
    constructor() {
      return mockGitlabClient;
    }
  },
}));

describe('createGitLabMergeRequest', () => {
  let instance: TemplateAction<any>;

  beforeEach(() => {
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

  afterEach(() => {
    mockFs.restore();
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
      mockFs({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });
      const ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
      await instance.handler(ctx);

      expect(mockGitlabClient.MergeRequests.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'main',
        'Create my new MR',
        { description: 'This MR is really good', removeSourceBranch: false },
      );
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
      mockFs({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
      await instance.handler(ctx);

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
      mockFs({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
      await instance.handler(ctx);

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
      mockFs({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
      await instance.handler(ctx);

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
      mockFs({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
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
      mockFs({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
      await instance.handler(ctx);

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
      mockFs({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
      await instance.handler(ctx);

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
      mockFs({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });
      const ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
      await instance.handler(ctx);

      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'new-mr',
        'Create my new MR',
        [
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
        ],
      );
    });
  });

  describe('createGitLabMergeRequestWithoutCommitAction', () => {
    it('default commitAction is create', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'This MR is really good',
        targetPath: 'source',
      };
      mockFs({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });
      const ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
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
      mockFs({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
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

    it('commitAction is update when update is passed in options', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'MR description',
        commitAction: 'update',
        targetPath: 'source',
      };
      mockFs({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
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

    it('commitAction is delete when delete is passed in options', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        title: 'Create my new MR',
        branchName: 'new-mr',
        description: 'other MR description',
        commitAction: 'delete',
        targetPath: 'source',
      };
      mockFs({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
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

      mockFs({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };

      await instance.handler(ctx);

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

      mockFs({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      const ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };

      await instance.handler(ctx);

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

      const ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };

      await expect(instance.handler(ctx)).rejects.toThrow(
        'Relative path is not allowed to refer to a directory outside its parent',
      );
    });
  });
});
