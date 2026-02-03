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
import yaml from 'yaml';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';

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
import { initRepoAndPush } from '@backstage/plugin-scaffolder-node';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { examples } from './gitlab.examples';

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
    },
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should call initRepoAndPush with the correct values', async () => {
    mockGitlabClient.Users.showCurrentUser.mockResolvedValue({ id: 12345 });
    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: 1234 });
    mockGitlabClient.Groups.allProjects.mockResolvedValue([]);
    mockGitlabClient.Projects.create.mockResolvedValue({
      http_url_to_repo: 'http://mockurl.git',
    });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[0].example).steps[0].input,
    });

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
});
