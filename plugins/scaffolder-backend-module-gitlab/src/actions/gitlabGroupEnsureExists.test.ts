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

import { ConfigReader } from '@backstage/core-app-api';
import { ScmIntegrations } from '@backstage/integration';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { createGitlabGroupEnsureExistsAction } from './gitlabGroupEnsureExists';
import { getClient } from '../util';

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

jest.mock('../util', () => ({
  getClient: jest.fn().mockImplementation(() => mockGitlabClient),
  parseRepoUrl: () => ({ host: 'gitlab.com', owner: 'owner', repo: 'repo' }),
}));

describe('gitlab:group:ensureExists', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  const mockContext = createMockActionContext();

  it('should create a new group from string if it does not exists', async () => {
    mockGitlabClient.Groups.search.mockResolvedValue([
      {
        id: 1,
        full_path: 'bar',
      },
      {
        id: 2,
        full_path: 'foo',
      },
    ]);

    mockGitlabClient.Groups.create.mockResolvedValue({
      id: 3,
      full_path: 'foo/bar',
    });

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: ['foo', 'bar'],
      },
    });

    expect(mockGitlabClient.Groups.create).toHaveBeenCalledWith('bar', 'bar', {
      parentId: 2,
    });

    expect(mockContext.output).toHaveBeenCalledWith('groupId', 3);
  });

  it('should create a new group from object if it does not exists', async () => {
    mockGitlabClient.Groups.search.mockResolvedValue([
      {
        id: 1,
        full_path: 'bar',
      },
      {
        id: 2,
        full_path: 'foo',
      },
    ]);

    mockGitlabClient.Groups.create.mockResolvedValue({
      id: 3,
      full_path: 'foo/bar',
    });

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: [
          { name: 'Foo', slug: 'foo' },
          { name: 'Bar is a nice name', slug: 'bar' },
        ],
      },
    });

    expect(mockGitlabClient.Groups.create).toHaveBeenCalledWith(
      'Bar is a nice name',
      'bar',
      {
        parentId: 2,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('groupId', 3);
  });

  it('should return existing group if it does exists', async () => {
    mockGitlabClient.Groups.search.mockResolvedValue([
      {
        id: 1,
        full_path: 'bar',
      },
      {
        id: 2,
        full_path: 'foo',
      },
      {
        id: 42,
        full_path: 'foo/bar',
      },
    ]);

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: ['foo', 'bar'],
      },
    });

    expect(mockGitlabClient.Groups.create).not.toHaveBeenCalled();

    expect(mockContext.output).toHaveBeenCalledWith('groupId', 42);
  });

  it('should not call API on dryRun', async () => {
    await action.handler({
      ...mockContext,
      isDryRun: true,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: ['foo', 'bar'],
      },
    });

    expect(mockGitlabClient.Groups.search).not.toHaveBeenCalled();
    expect(mockGitlabClient.Groups.create).not.toHaveBeenCalled();

    expect(mockContext.output).toHaveBeenCalledWith('groupId', 42);
  });

  it('should use the token from the integration config when none is provided', async () => {
    mockGitlabClient.Groups.search.mockResolvedValue([
      {
        id: 1,
        full_path: 'foobar',
      },
    ]);

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: ['foobar'],
      },
    });

    expect(getClient).toHaveBeenCalledWith(
      expect.not.objectContaining({
        token: expect.anything(),
      }),
    );
  });

  it('should use a provided token as bearer authentication', async () => {
    mockGitlabClient.Groups.search.mockResolvedValue([
      {
        id: 1,
        full_path: 'foobar',
      },
    ]);

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: ['foobar'],
        token: 'mysecrettoken',
      },
    });

    expect(getClient).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'mysecrettoken',
      }),
    );
  });
});
