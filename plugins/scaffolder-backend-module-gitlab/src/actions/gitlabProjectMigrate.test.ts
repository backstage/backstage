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
import { createGitlabProjectMigrateAction } from './gitlabProjectMigrate';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { createMockDirectory } from '@backstage/backend-test-utils';

const mockGitlabClient = {
  Migrations: {
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

describe('createGitlabRepoMigrate', () => {
  let instance: TemplateAction<any>;

  beforeEach(() => {
    jest.clearAllMocks();

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
    instance = createGitlabProjectMigrateAction({ integrations });
  });

  describe('createGitlabRepoImportAction', () => {
    const workspacePath = createMockDirectory().resolve('workspace');

    it('default repo import action is created', async () => {
      const input = {
        destinationAccessToken: 'moreLOLsToken',
        destinationUrl:
          'gitlab.com?owner=migrated%2Ffoo%2Fbar&repo=migrated-go-lang',
        sourceUrl: 'https://gitlab.remote.com',
        sourceAccessToken: 'lolstoken',
        sourceFullPath: 'foo/bar/go-lang',
      };
      const ctx = createMockActionContext({ input, workspacePath });
      await instance.handler(ctx);

      expect(mockGitlabClient.Migrations.create).toHaveBeenCalledWith(
        {
          url: 'https://gitlab.remote.com',
          access_token: 'lolstoken',
        },
        [
          {
            sourceType: 'project_entity',
            sourceFullPath: 'foo/bar/go-lang',
            destinationSlug: 'migrated-go-lang',
            destinationNamespace: 'migrated/foo/bar',
          },
        ],
      );
    });
  });
});
