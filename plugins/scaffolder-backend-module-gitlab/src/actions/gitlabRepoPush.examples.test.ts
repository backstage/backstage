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
import { examples } from './gitlabRepoPush.examples';
import yaml from 'yaml';

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
      id: 'f8a2c9bd4e2915b0792b43235c779e82ddad54af',
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

describe('gitlab:repo:push', () => {
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

  describe('Push changes to gitlab repository', () => {
    it(`Should ${examples[0].description}`, async () => {
      const input = yaml.parse(examples[0].example).steps[0].input;
      mockDir.setContent({
        [workspacePath]: {
          'abcd.txt': 'Test message',
        },
      });
      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledTimes(0);
      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'feature-branch',
        'Initial Commit',
        [
          {
            action: 'create',
            filePath: 'abcd.txt',
            content: 'VGVzdCBtZXNzYWdl',
            encoding: 'base64',
            execute_filemode: false,
          },
        ],
      );
      expect(ctx.output).toHaveBeenCalledWith(
        'commitHash',
        'f8a2c9bd4e2915b0792b43235c779e82ddad54af',
      );
    });
  });

  describe('Push changes to gitlab repository with a specific source and target path', () => {
    it(`Should ${examples[1].description}`, async () => {
      const input = yaml.parse(examples[1].example).steps[0].input;
      mockDir.setContent({
        [workspacePath]: {
          'abcd.txt': 'Test message',
          source: {
            'abcd.txt': 'Test message',
          },
        },
      });
      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledTimes(0);
      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'feature-branch',
        'Initial Commit',
        [
          {
            action: 'create',
            filePath: 'abcd.txt',
            content: 'VGVzdCBtZXNzYWdl',
            encoding: 'base64',
            execute_filemode: false,
          },
        ],
      );
      expect(ctx.output).toHaveBeenCalledWith(
        'commitHash',
        'f8a2c9bd4e2915b0792b43235c779e82ddad54af',
      );
    });
  });

  describe('Push changes to gitlab repository with a specific commit action', () => {
    it(`Should ${examples[2].description}`, async () => {
      const input = yaml.parse(examples[2].example).steps[0].input;
      mockDir.setContent({
        [workspacePath]: {
          'abcd.txt': 'Test message',
        },
      });
      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Branches.create).toHaveBeenCalledTimes(0);
      expect(mockGitlabClient.Commits.create).toHaveBeenCalledWith(
        'owner/repo',
        'feature-branch',
        'Initial Commit',
        [
          {
            action: 'update',
            filePath: 'abcd.txt',
            content: 'VGVzdCBtZXNzYWdl',
            encoding: 'base64',
            execute_filemode: false,
          },
        ],
      );
      expect(ctx.output).toHaveBeenCalledWith(
        'commitHash',
        'f8a2c9bd4e2915b0792b43235c779e82ddad54af',
      );
    });
  });
});
