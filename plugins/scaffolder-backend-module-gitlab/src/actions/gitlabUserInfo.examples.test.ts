/*
 * Copyright 2026 The Backstage Authors
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

import { ScmIntegrations } from '@backstage/integration';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { createGitlabUserInfoAction } from './gitlabUserInfo';
import { examples } from './gitlabUserInfo.examples';
import yaml from 'yaml';
import { mockServices } from '@backstage/backend-test-utils';

const mockGitlabClient = {
  Users: {
    show: jest.fn(),
    showCurrentUser: jest.fn(),
  },
};
jest.mock('@gitbeaker/rest', () => ({
  Gitlab: class {
    constructor() {
      return mockGitlabClient;
    }
  },
}));

describe('gitlab:user:info examples', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const config = mockServices.rootConfig({
    data: {
      integrations: {
        gitlab: [
          {
            host: 'gitlab.com',
            token: 'sample-token',
            apiBaseUrl: 'https://gitlab.com/api/v4',
          },
          {
            host: 'gitlab.example.com',
            token: 'example-token',
            apiBaseUrl: 'https://gitlab.example.com/api/v4',
          },
        ],
      },
    },
  });
  const integrations = ScmIntegrations.fromConfig(config);

  const action = createGitlabUserInfoAction({ integrations });

  it(`should ${examples[0].description}`, async () => {
    const input = yaml.parse(examples[0].example).steps[0].input;

    const mockContext = createMockActionContext({
      input,
      workspacePath: '/tmp/workspace',
    });

    mockGitlabClient.Users.showCurrentUser.mockResolvedValue({
      id: 1,
      username: 'currentuser',
      name: 'Current User',
      state: 'active',
      web_url: 'https://gitlab.com/currentuser',
    });

    await action.handler(mockContext);

    expect(mockGitlabClient.Users.showCurrentUser).toHaveBeenCalled();
    expect(mockContext.output).toHaveBeenCalledWith('id', 1);
    expect(mockContext.output).toHaveBeenCalledWith('username', 'currentuser');
  });

  it(`should ${examples[1].description}`, async () => {
    const input = yaml.parse(examples[1].example).steps[0].input;

    const mockContext = createMockActionContext({
      input,
      workspacePath: '/tmp/workspace',
    });

    mockGitlabClient.Users.show.mockResolvedValue({
      id: 12345,
      username: 'user12345',
      name: 'User 12345',
      state: 'active',
      web_url: 'https://gitlab.com/user12345',
    });

    await action.handler(mockContext);

    expect(mockGitlabClient.Users.show).toHaveBeenCalledWith(12345);
    expect(mockContext.output).toHaveBeenCalledWith('id', 12345);
  });

  it(`should ${examples[2].description}`, async () => {
    const input = yaml.parse(examples[2].example).steps[0].input;

    const mockContext = createMockActionContext({
      input,
      workspacePath: '/tmp/workspace',
    });

    mockGitlabClient.Users.show.mockResolvedValue({
      id: 12345,
      username: 'user12345',
      name: 'User 12345',
      state: 'active',
      web_url: 'https://gitlab.com/user12345',
    });

    await action.handler(mockContext);

    expect(mockGitlabClient.Users.show).toHaveBeenCalledWith(12345);
    expect(mockContext.output).toHaveBeenCalledWith('id', 12345);
  });

  it(`should ${examples[3].description}`, async () => {
    const input = yaml.parse(examples[3].example).steps[0].input;

    const mockContext = createMockActionContext({
      input,
      workspacePath: '/tmp/workspace',
    });

    mockGitlabClient.Users.show.mockResolvedValue({
      id: 12345,
      username: 'user12345',
      name: 'User 12345',
      state: 'active',
      web_url: 'https://gitlab.example.com/user12345',
    });

    await action.handler(mockContext);

    expect(mockGitlabClient.Users.show).toHaveBeenCalledWith(12345);
    expect(mockContext.output).toHaveBeenCalledWith('id', 12345);
    expect(mockContext.output).toHaveBeenCalledWith(
      'webUrl',
      'https://gitlab.example.com/user12345',
    );
  });
});
