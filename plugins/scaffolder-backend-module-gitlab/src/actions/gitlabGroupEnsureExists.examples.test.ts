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

import { ConfigReader } from '@backstage/core-app-api';
import { ScmIntegrations } from '@backstage/integration';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import yaml from 'yaml';
import { createGitlabGroupEnsureExistsAction } from './gitlabGroupEnsureExists';
import { examples } from './gitlabGroupEnsureExists.examples';

const mockGitlabClient = {
  Groups: {
    search: jest.fn(),
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

describe('gitlab:group:ensureExists', () => {
  const mockContext = createMockActionContext();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it(`Should ${examples[0].description}`, async () => {
    mockGitlabClient.Groups.search.mockResolvedValue([]);
    mockGitlabClient.Groups.create.mockResolvedValue({
      id: 3,
      full_path: 'group1',
    });

    const config = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'gitlab.com',
            token: 'tokenlols',
            apiBaseUrl: 'https://gitlab.com/api/v4',
          },
        ],
      },
    });
    const integrations = ScmIntegrations.fromConfig(config);

    const action = createGitlabGroupEnsureExistsAction({ integrations });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[0].example).steps[0].input,
    });

    expect(mockGitlabClient.Groups.create).toHaveBeenCalledWith(
      'group1',
      'group1',
      {},
    );

    expect(mockContext.output).toHaveBeenCalledWith('groupId', 3);
  });

  it(`Should ${examples[1].description}`, async () => {
    mockGitlabClient.Groups.search.mockResolvedValue([
      {
        id: 1,
        full_path: 'group1',
      },
    ]);
    mockGitlabClient.Groups.create.mockResolvedValue({
      id: 3,
      full_path: 'group1/group2',
    });

    const config = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'gitlab.com',
            token: 'tokenlols',
            apiBaseUrl: 'https://api.gitlab.com',
          },
        ],
      },
    });
    const integrations = ScmIntegrations.fromConfig(config);

    const action = createGitlabGroupEnsureExistsAction({ integrations });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[1].example).steps[0].input,
    });

    expect(mockGitlabClient.Groups.create).toHaveBeenCalledWith(
      'group2',
      'group2',
      {
        parentId: 1,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('groupId', 3);
  });

  it(`Should ${examples[2].description}`, async () => {
    mockGitlabClient.Groups.search.mockResolvedValue([
      {
        id: 1,
        full_path: 'group1',
      },
      {
        id: 2,
        full_path: 'group1/group2',
      },
    ]);
    mockGitlabClient.Groups.create.mockResolvedValue({
      id: 3,
      full_path: 'group1/group2/group3',
    });

    const config = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'gitlab.com',
            token: 'tokenlols',
            apiBaseUrl: 'https://api.gitlab.com',
          },
        ],
      },
    });
    const integrations = ScmIntegrations.fromConfig(config);

    const action = createGitlabGroupEnsureExistsAction({ integrations });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[2].example).steps[0].input,
    });

    expect(mockGitlabClient.Groups.create).toHaveBeenCalledWith(
      'group3',
      'group3',
      {
        parentId: 2,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('groupId', 3);
  });

  it(`Should ${examples[3].description}`, async () => {
    const config = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'gitlab.com',
            token: 'tokenlols',
            apiBaseUrl: 'https://api.gitlab.com',
          },
        ],
      },
    });
    const integrations = ScmIntegrations.fromConfig(config);

    const action = createGitlabGroupEnsureExistsAction({ integrations });

    await action.handler({
      ...mockContext,
      isDryRun: yaml.parse(examples[3].example).steps[0].isDryRun,
      input: yaml.parse(examples[3].example).steps[0].input,
    });

    expect(mockGitlabClient.Groups.search).not.toHaveBeenCalled();
    expect(mockGitlabClient.Groups.create).not.toHaveBeenCalled();

    expect(mockContext.output).toHaveBeenCalledWith('groupId', 42);
  });

  it(`Should ${examples[4].description}`, async () => {
    mockGitlabClient.Groups.search.mockResolvedValue([
      {
        id: 1,
        full_path: 'group1',
      },
      {
        id: 2,
        full_path: 'group1/group2',
      },
    ]);
    mockGitlabClient.Groups.create.mockResolvedValue({
      id: 3,
      full_path: 'group1/group2/group3',
    });

    const config = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'gitlab.com',
            token: 'tokenlols',
            apiBaseUrl: 'https://api.gitlab.com',
          },
        ],
      },
    });
    const integrations = ScmIntegrations.fromConfig(config);

    const action = createGitlabGroupEnsureExistsAction({ integrations });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[4].example).steps[0].input,
    });

    expect(mockGitlabClient.Groups.create).toHaveBeenCalledWith(
      'Group 3',
      'group3',
      {
        parentId: 2,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('groupId', 3);
  });
});
