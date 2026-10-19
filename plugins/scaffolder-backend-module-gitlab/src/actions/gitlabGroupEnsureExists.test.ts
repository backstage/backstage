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

import { ScmIntegrations } from '@backstage/integration';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { createGitlabGroupEnsureExistsAction } from './gitlabGroupEnsureExists';
import { getClient } from '../util';
import { mockServices } from '@backstage/backend-test-utils';

const mockGitlabClient = {
  Namespaces: {
    show: jest.fn(),
  },
  Groups: {
    show: jest.fn(),
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
    mockGitlabClient.Groups.show.mockReset();
    mockGitlabClient.Groups.create.mockReset();
    mockGitlabClient.Namespaces.show.mockReset();
    mockGitlabClient.Namespaces.show.mockRejectedValue({
      cause: { response: { status: 404 } },
    });
  });

  const config = mockServices.rootConfig({
    data: {
      integrations: {
        gitlab: [
          {
            host: 'gitlab.com',
            token: 'tokenlols',
            apiBaseUrl: 'https://gitlab.com/api/v4',
          },
        ],
      },
    },
  });
  const integrations = ScmIntegrations.fromConfig(config);

  const action = createGitlabGroupEnsureExistsAction({ integrations });

  const mockContext = createMockActionContext();

  it('should create a new group from string if it does not exists', async () => {
    mockGitlabClient.Groups.show
      .mockResolvedValueOnce({ id: 2, full_path: 'foo' })
      .mockRejectedValueOnce({ cause: { response: { status: 404 } } });

    mockGitlabClient.Groups.create.mockResolvedValue({
      id: 3,
      full_path: 'foo/bar',
    });

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: ['foo', 'bar'],
        description: 'my cool group',
      },
    });

    expect(mockGitlabClient.Groups.create).toHaveBeenCalledWith('bar', 'bar', {
      description: 'my cool group',
      parentId: 2,
    });

    expect(mockContext.output).toHaveBeenCalledWith('groupId', 3);
  });

  it('should only apply description to the last created group', async () => {
    mockGitlabClient.Groups.create
      .mockResolvedValueOnce({
        id: 1,
        full_path: 'foo',
      })
      .mockResolvedValueOnce({
        id: 2,
        full_path: 'foo/bar',
      })
      .mockResolvedValueOnce({
        id: 3,
        full_path: 'foo/bar/baz',
      });

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: ['foo', 'bar', 'baz'],
        description: 'only for innermost group',
      },
    });

    expect(mockGitlabClient.Groups.create).toHaveBeenCalledTimes(3);

    // First group: no description
    expect(mockGitlabClient.Groups.create).toHaveBeenNthCalledWith(
      1,
      'foo',
      'foo',
      {},
    );

    // Second group: no description
    expect(mockGitlabClient.Groups.create).toHaveBeenNthCalledWith(
      2,
      'bar',
      'bar',
      { parentId: 1 },
    );

    // Third (last) group: has description
    expect(mockGitlabClient.Groups.create).toHaveBeenNthCalledWith(
      3,
      'baz',
      'baz',
      { parentId: 2, description: 'only for innermost group' },
    );

    expect(mockContext.output).toHaveBeenCalledWith('groupId', 3);
  });

  it('should create a new group from pathstring if it does not exists', async () => {
    mockGitlabClient.Groups.show
      .mockResolvedValueOnce({ id: 2, full_path: 'foo' })
      .mockRejectedValueOnce({ cause: { response: { status: 404 } } })
      .mockRejectedValueOnce({ cause: { response: { status: 404 } } });

    mockGitlabClient.Groups.create
      .mockResolvedValueOnce({ id: 3, full_path: 'foo/bar' })
      .mockResolvedValueOnce({ id: 4, full_path: 'foo/bar/baz' });

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: ['foo/bar', 'baz'],
      },
    });

    expect(mockGitlabClient.Groups.create).toHaveBeenNthCalledWith(
      1,
      'bar',
      'bar',
      {
        parentId: 2,
      },
    );

    expect(mockGitlabClient.Groups.create).toHaveBeenNthCalledWith(
      2,
      'baz',
      'baz',
      {
        parentId: 3,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('groupId', 4);
  });

  it('should create a new group from object if it does not exists', async () => {
    mockGitlabClient.Groups.show
      .mockResolvedValueOnce({ id: 2, full_path: 'foo' })
      .mockRejectedValueOnce({ cause: { response: { status: 404 } } });

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
    mockGitlabClient.Groups.show
      .mockResolvedValueOnce({ id: 2, full_path: 'foo' })
      .mockResolvedValueOnce({ id: 42, full_path: 'foo/bar' });

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

  it.each([['my-username'], [{ name: 'My User', slug: 'my-username' }]])(
    'should reuse an existing user namespace for path %j',
    async pathItem => {
      mockGitlabClient.Groups.show.mockRejectedValueOnce({
        cause: { response: { status: 404 } },
      });
      mockGitlabClient.Namespaces.show.mockResolvedValueOnce({
        id: 123,
        kind: 'user',
        full_path: 'my-username',
      });

      await action.handler({
        ...mockContext,
        input: {
          repoUrl: 'gitlab.com?repo=repo&owner=my-username',
          path: [pathItem],
        },
      });

      expect(mockGitlabClient.Groups.show).toHaveBeenCalledWith('my-username');
      expect(mockGitlabClient.Namespaces.show).toHaveBeenCalledWith(
        'my-username',
      );
      expect(mockGitlabClient.Groups.create).not.toHaveBeenCalled();
      expect(mockContext.output).toHaveBeenCalledWith('groupId', 123);
    },
  );

  it.each([['my-username/subgroup'], ['my-username', 'subgroup']])(
    'should reject subgroups under a user namespace for path %j',
    async (...path) => {
      mockGitlabClient.Groups.show.mockRejectedValueOnce({
        cause: { response: { status: 404 } },
      });
      mockGitlabClient.Namespaces.show.mockResolvedValueOnce({
        id: 123,
        kind: 'user',
        full_path: 'my-username',
      });

      await expect(
        action.handler({
          ...mockContext,
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=my-username',
            path,
          },
        }),
      ).rejects.toThrow(
        'Cannot create subgroups under user namespace "my-username"',
      );

      expect(mockGitlabClient.Groups.create).not.toHaveBeenCalled();
      expect(mockContext.output).not.toHaveBeenCalled();
    },
  );

  it.each([401, 403, 500])(
    'should propagate API errors with status %i',
    async status => {
      const error = { cause: { response: { status } } };
      const input = { repoUrl: 'gitlab.com', path: ['foo'] };
      mockGitlabClient.Groups.show.mockRejectedValueOnce(error);

      await expect(action.handler({ ...mockContext, input })).rejects.toBe(
        error,
      );
      expect(mockGitlabClient.Namespaces.show).not.toHaveBeenCalled();
      expect(mockGitlabClient.Groups.create).not.toHaveBeenCalled();

      mockGitlabClient.Groups.show.mockRejectedValueOnce({
        cause: { response: { status: 404 } },
      });
      mockGitlabClient.Namespaces.show.mockRejectedValueOnce(error);

      await expect(action.handler({ ...mockContext, input })).rejects.toBe(
        error,
      );
      expect(mockGitlabClient.Groups.create).not.toHaveBeenCalled();
      expect(mockContext.output).not.toHaveBeenCalled();
    },
  );

  it('should not call API on dryRun', async () => {
    await action.handler({
      ...mockContext,
      isDryRun: true,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: ['foo', 'bar'],
      },
    });

    expect(mockGitlabClient.Groups.show).not.toHaveBeenCalled();
    expect(mockGitlabClient.Namespaces.show).not.toHaveBeenCalled();
    expect(mockGitlabClient.Groups.create).not.toHaveBeenCalled();

    expect(mockContext.output).toHaveBeenCalledWith('groupId', 42);
  });

  it('should use the token from the integration config when none is provided', async () => {
    mockGitlabClient.Groups.show.mockResolvedValue({
      id: 1,
      full_path: 'foobar',
    });

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
    mockGitlabClient.Groups.show.mockResolvedValue({
      id: 1,
      full_path: 'foobar',
    });

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
