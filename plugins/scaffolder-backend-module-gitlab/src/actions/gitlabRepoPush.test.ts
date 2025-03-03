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

import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { createGitlabRepoPushAction } from './gitlabRepoPush';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';

const mockGitlabClient = {
  Projects: {
    create: jest.fn(),
    show: jest.fn(async (_: any) => {
      return {
        default_branch: 'main',
      };
    }),
  },
  Branches: {
    create: jest.fn(),
    show: jest.fn(),
  },
  Commits: {
    create: jest.fn(async (_: any) => ({
      id: 'bb6bce457ed069a38ef8d16ef38602972c7735c5',
    })),
  },
};

jest.mock('@gitbeaker/rest', () => ({
  Gitlab: class {
    constructor() {
      return mockGitlabClient;
    }
  },
}));

describe('createGitLabCommit', () => {
  let instance: TemplateAction<any>;

  const mockDir = createMockDirectory();
  const workspacePath = mockDir.resolve('workspace');

  beforeEach(() => {
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
    instance = createGitlabRepoPushAction({ integrations });
  });

  describe('createGitLabCommitWithoutCommitAction', () => {
    it('default commitAction is create', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        commitMessage: 'Create my new commit',
        branchName: 'some-branch',
      };
      mockDir.setContent({
        [workspacePath]: {
          'foo.txt': 'Hello there!',
        },
      });
      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledTimes(0);
      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'some-branch',
        'Create my new commit',
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
      expect(ctx.output).toHaveBeenCalledWith(
        'commitHash',
        'bb6bce457ed069a38ef8d16ef38602972c7735c5',
      );
    });
  });

  describe('createGitLabCommitWithCommitAction', () => {
    it('commitAction is create when create is passed in options', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        commitMessage: 'Create my new commit',
        branchName: 'some-branch',
        commitAction: 'create',
      };
      mockDir.setContent({
        [workspacePath]: {
          'foo.txt': 'Hello there!',
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledTimes(0);
      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'some-branch',
        'Create my new commit',
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
      expect(ctx.output).toHaveBeenCalledWith(
        'commitHash',
        'bb6bce457ed069a38ef8d16ef38602972c7735c5',
      );
    });

    it('commitAction is update when update is passed in options', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        commitMessage: 'Create my new commit',
        branchName: 'some-branch',
        commitAction: 'update',
      };
      mockDir.setContent({
        [workspacePath]: {
          'foo.txt': 'Hello there!',
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledTimes(0);
      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'some-branch',
        'Create my new commit',
        [
          {
            action: 'update',
            filePath: 'foo.txt',
            content: 'SGVsbG8gdGhlcmUh',
            encoding: 'base64',
            execute_filemode: false,
          },
        ],
      );
      expect(ctx.output).toHaveBeenCalledWith(
        'commitHash',
        'bb6bce457ed069a38ef8d16ef38602972c7735c5',
      );
    });

    it('commitAction is delete when delete is passed in options', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        commitMessage: 'Create my new commit',
        branchName: 'some-branch',
        commitAction: 'delete',
      };
      mockDir.setContent({
        [workspacePath]: {
          'foo.txt': 'Hello there!',
        },
      });

      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledTimes(0);
      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'some-branch',
        'Create my new commit',
        [
          {
            action: 'delete',
            filePath: 'foo.txt',
            content: 'SGVsbG8gdGhlcmUh',
            encoding: 'base64',
            execute_filemode: false,
          },
        ],
      );
      expect(ctx.output).toHaveBeenCalledWith(
        'commitHash',
        'bb6bce457ed069a38ef8d16ef38602972c7735c5',
      );
    });
  });

  describe('with sourcePath', () => {
    it('creates a commit with only relevant files', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        commitMessage: 'Create my new commit',
        branchName: 'some-branch',
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

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledTimes(0);
      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'some-branch',
        'Create my new commit',
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
      expect(ctx.output).toHaveBeenCalledWith(
        'commitHash',
        'bb6bce457ed069a38ef8d16ef38602972c7735c5',
      );
    });

    it('creates a commit with only relevant files placed under different targetPath', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        commitMessage: 'Create my new commit',
        branchName: 'some-branch',
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

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledTimes(0);
      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'some-branch',
        'Create my new commit',
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
      expect(ctx.output).toHaveBeenCalledWith(
        'commitHash',
        'bb6bce457ed069a38ef8d16ef38602972c7735c5',
      );
    });

    it('should not allow to use files outside of the workspace', async () => {
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        commitMessage: 'Create my new commit',
        branchName: 'some-branch',
        sourcePath: '../../test',
        commitAction: 'create',
      };

      const ctx = createMockActionContext({ input, workspacePath });

      await expect(instance.handler(ctx)).rejects.toThrow(
        'Relative path is not allowed to refer to a directory outside its parent',
      );
    });
  });

  describe('createCommitToBranchThatDoesNotExist', () => {
    it('should create a new branch', async () => {
      mockGitlabClient.Branches.show.mockRejectedValue({
        cause: {
          response: {
            status: 404,
          },
        },
      });
      const input = {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        commitMessage: 'Create my new commit',
        branchName: 'some-branch',
      };
      mockDir.setContent({
        [workspacePath]: {
          'foo.txt': 'Hello there!',
        },
      });
      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledWith(
        'owner/repo',
        'some-branch',
        'main',
      );
      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'some-branch',
        'Create my new commit',
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
      expect(ctx.output).toHaveBeenCalledWith(
        'commitHash',
        'bb6bce457ed069a38ef8d16ef38602972c7735c5',
      );
    });
  });
});
