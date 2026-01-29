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
import { createGitlabGroupAccessAction } from './gitlabGroupAccessAction';
import { getClient } from '../util';
import { mockServices } from '@backstage/backend-test-utils';

const mockGitlabClient = {
  GroupMembers: {
    add: jest.fn(),
    edit: jest.fn(),
    remove: jest.fn(),
  },
  Groups: {
    share: jest.fn(),
    unshare: jest.fn(),
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

describe('gitlab:group:access', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  const action = createGitlabGroupAccessAction({ integrations });

  const mockContext = createMockActionContext();

  // User tests
  it('should add a single user to a group with the specified access level', async () => {
    mockGitlabClient.GroupMembers.add.mockResolvedValue({
      id: 1,
      user_id: 456,
      group_id: 123,
      access_level: 30,
    });

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        userIds: [456],
        accessLevel: 30,
      },
    });

    expect(mockGitlabClient.GroupMembers.add).toHaveBeenCalledWith(
      123,
      456,
      30,
    );

    expect(mockContext.output).toHaveBeenCalledWith('userIds', [456]);
    expect(mockContext.output).toHaveBeenCalledWith('path', 123);
    expect(mockContext.output).toHaveBeenCalledWith('accessLevel', 30);
  });

  it('should add multiple users to a group with the specified access level', async () => {
    mockGitlabClient.GroupMembers.add.mockResolvedValue({});

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        userIds: [456, 789, 101],
        accessLevel: 30,
      },
    });

    expect(mockGitlabClient.GroupMembers.add).toHaveBeenCalledTimes(3);
    expect(mockGitlabClient.GroupMembers.add).toHaveBeenCalledWith(
      123,
      456,
      30,
    );
    expect(mockGitlabClient.GroupMembers.add).toHaveBeenCalledWith(
      123,
      789,
      30,
    );
    expect(mockGitlabClient.GroupMembers.add).toHaveBeenCalledWith(
      123,
      101,
      30,
    );

    expect(mockContext.output).toHaveBeenCalledWith('userIds', [456, 789, 101]);
    expect(mockContext.output).toHaveBeenCalledWith('path', 123);
    expect(mockContext.output).toHaveBeenCalledWith('accessLevel', 30);
  });

  it('should default to add action when action is not specified', async () => {
    mockGitlabClient.GroupMembers.add.mockResolvedValue({});

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        userIds: [456],
        accessLevel: 30,
      },
    });

    expect(mockGitlabClient.GroupMembers.add).toHaveBeenCalledWith(
      123,
      456,
      30,
    );
    expect(mockGitlabClient.GroupMembers.remove).not.toHaveBeenCalled();
  });

  it('should remove a single user from a group', async () => {
    mockGitlabClient.GroupMembers.remove.mockResolvedValue(undefined);

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        userIds: [456],
        action: 'remove',
      },
    });

    expect(mockGitlabClient.GroupMembers.remove).toHaveBeenCalledWith(123, 456);

    expect(mockContext.output).toHaveBeenCalledWith('userIds', [456]);
    expect(mockContext.output).toHaveBeenCalledWith('path', 123);
    expect(mockContext.output).not.toHaveBeenCalledWith(
      'accessLevel',
      expect.anything(),
    );
  });

  it('should remove multiple users from a group', async () => {
    mockGitlabClient.GroupMembers.remove.mockResolvedValue(undefined);

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        userIds: [456, 789],
        action: 'remove',
      },
    });

    expect(mockGitlabClient.GroupMembers.remove).toHaveBeenCalledTimes(2);
    expect(mockGitlabClient.GroupMembers.remove).toHaveBeenCalledWith(123, 456);
    expect(mockGitlabClient.GroupMembers.remove).toHaveBeenCalledWith(123, 789);

    expect(mockContext.output).toHaveBeenCalledWith('userIds', [456, 789]);
    expect(mockContext.output).toHaveBeenCalledWith('path', 123);
  });

  it('should default to accessLevel 30 (Developer) when not specified', async () => {
    mockGitlabClient.GroupMembers.add.mockResolvedValue({});

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        userIds: [456],
      },
    });

    expect(mockGitlabClient.GroupMembers.add).toHaveBeenCalledWith(
      123,
      456,
      30,
    );
    expect(mockContext.output).toHaveBeenCalledWith('accessLevel', 30);
  });

  it('should not call API on dryRun for add action', async () => {
    await action.handler({
      ...mockContext,
      isDryRun: true,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        userIds: [456, 789],
        accessLevel: 30,
      },
    });

    expect(mockGitlabClient.GroupMembers.add).not.toHaveBeenCalled();

    expect(mockContext.output).toHaveBeenCalledWith('userIds', [456, 789]);
    expect(mockContext.output).toHaveBeenCalledWith('path', 123);
    expect(mockContext.output).toHaveBeenCalledWith('accessLevel', 30);
  });

  it('should not call API on dryRun for remove action', async () => {
    await action.handler({
      ...mockContext,
      isDryRun: true,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        userIds: [456],
        action: 'remove',
      },
    });

    expect(mockGitlabClient.GroupMembers.remove).not.toHaveBeenCalled();

    expect(mockContext.output).toHaveBeenCalledWith('userIds', [456]);
    expect(mockContext.output).toHaveBeenCalledWith('path', 123);
    expect(mockContext.output).not.toHaveBeenCalledWith(
      'accessLevel',
      expect.anything(),
    );
  });

  it('should use the token from the integration config when none is provided', async () => {
    mockGitlabClient.GroupMembers.add.mockResolvedValue({});

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        userIds: [456],
        accessLevel: 30,
      },
    });

    expect(getClient).toHaveBeenCalledWith(
      expect.not.objectContaining({
        token: expect.anything(),
      }),
    );
  });

  it('should use a provided token for authentication', async () => {
    mockGitlabClient.GroupMembers.add.mockResolvedValue({});

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        userIds: [456],
        accessLevel: 30,
        token: 'mysecrettoken',
      },
    });

    expect(getClient).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'mysecrettoken',
      }),
    );
  });

  it('should add users as Guest (accessLevel 10)', async () => {
    mockGitlabClient.GroupMembers.add.mockResolvedValue({});

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        userIds: [456],
        accessLevel: 10,
      },
    });

    expect(mockGitlabClient.GroupMembers.add).toHaveBeenCalledWith(
      123,
      456,
      10,
    );
  });

  it('should add users as Maintainer (accessLevel 40)', async () => {
    mockGitlabClient.GroupMembers.add.mockResolvedValue({});

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        userIds: [456],
        accessLevel: 40,
      },
    });

    expect(mockGitlabClient.GroupMembers.add).toHaveBeenCalledWith(
      123,
      456,
      40,
    );
  });

  it('should add users as Owner (accessLevel 50)', async () => {
    mockGitlabClient.GroupMembers.add.mockResolvedValue({});

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        userIds: [456],
        accessLevel: 50,
      },
    });

    expect(mockGitlabClient.GroupMembers.add).toHaveBeenCalledWith(
      123,
      456,
      50,
    );
  });

  it('should accept string accessLevel "developer"', async () => {
    mockGitlabClient.GroupMembers.add.mockResolvedValue({});

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        userIds: [456],
        accessLevel: 'developer',
      },
    });

    expect(mockGitlabClient.GroupMembers.add).toHaveBeenCalledWith(
      123,
      456,
      30,
    );
    expect(mockContext.output).toHaveBeenCalledWith('accessLevel', 30);
  });

  it('should accept string accessLevel "maintainer" (case insensitive)', async () => {
    mockGitlabClient.GroupMembers.add.mockResolvedValue({});

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        userIds: [456],
        accessLevel: 'MAINTAINER',
      },
    });

    expect(mockGitlabClient.GroupMembers.add).toHaveBeenCalledWith(
      123,
      456,
      40,
    );
    expect(mockContext.output).toHaveBeenCalledWith('accessLevel', 40);
  });

  it('should throw an error for invalid string accessLevel', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'gitlab.com?repo=repo&owner=owner',
          path: 123,
          userIds: [456],
          accessLevel: 'invalid_level',
        },
      }),
    ).rejects.toThrow('Invalid access level: "invalid_level"');

    expect(mockGitlabClient.GroupMembers.add).not.toHaveBeenCalled();
  });

  it('should handle 409 conflict by editing existing user member', async () => {
    mockGitlabClient.GroupMembers.add.mockRejectedValue({
      cause: { response: { status: 409 } },
    });
    mockGitlabClient.GroupMembers.edit.mockResolvedValue({});

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        userIds: [456],
        accessLevel: 30,
      },
    });

    expect(mockGitlabClient.GroupMembers.add).toHaveBeenCalledWith(
      123,
      456,
      30,
    );
    expect(mockGitlabClient.GroupMembers.edit).toHaveBeenCalledWith(
      123,
      456,
      30,
    );
    expect(mockContext.output).toHaveBeenCalledWith('userIds', [456]);
  });

  // Group sharing tests
  it('should share a single group with another group', async () => {
    mockGitlabClient.Groups.share.mockResolvedValue({});

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        groupIds: [456],
        accessLevel: 30,
      },
    });

    expect(mockGitlabClient.Groups.share).toHaveBeenCalledWith(
      123,
      456,
      30,
      {},
    );

    expect(mockContext.output).toHaveBeenCalledWith('groupIds', [456]);
    expect(mockContext.output).toHaveBeenCalledWith('path', 123);
    expect(mockContext.output).toHaveBeenCalledWith('accessLevel', 30);
  });

  it('should share multiple groups with a group', async () => {
    mockGitlabClient.Groups.share.mockResolvedValue({});

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        groupIds: [456, 789],
        accessLevel: 30,
      },
    });

    expect(mockGitlabClient.Groups.share).toHaveBeenCalledTimes(2);
    expect(mockGitlabClient.Groups.share).toHaveBeenCalledWith(
      123,
      456,
      30,
      {},
    );
    expect(mockGitlabClient.Groups.share).toHaveBeenCalledWith(
      123,
      789,
      30,
      {},
    );

    expect(mockContext.output).toHaveBeenCalledWith('groupIds', [456, 789]);
    expect(mockContext.output).toHaveBeenCalledWith('path', 123);
    expect(mockContext.output).toHaveBeenCalledWith('accessLevel', 30);
  });

  it('should unshare groups from a group', async () => {
    mockGitlabClient.Groups.unshare.mockResolvedValue(undefined);

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        groupIds: [456, 789],
        action: 'remove',
      },
    });

    expect(mockGitlabClient.Groups.unshare).toHaveBeenCalledTimes(2);
    expect(mockGitlabClient.Groups.unshare).toHaveBeenCalledWith(123, 456, {});
    expect(mockGitlabClient.Groups.unshare).toHaveBeenCalledWith(123, 789, {});

    expect(mockContext.output).toHaveBeenCalledWith('groupIds', [456, 789]);
    expect(mockContext.output).toHaveBeenCalledWith('path', 123);
  });

  it('should handle 409 conflict for group sharing by re-sharing', async () => {
    mockGitlabClient.Groups.share.mockRejectedValueOnce({
      cause: { response: { status: 409 } },
    });
    mockGitlabClient.Groups.unshare.mockResolvedValue(undefined);
    mockGitlabClient.Groups.share.mockResolvedValueOnce({});

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        groupIds: [456],
        accessLevel: 30,
      },
    });

    expect(mockGitlabClient.Groups.share).toHaveBeenCalledTimes(2);
    expect(mockGitlabClient.Groups.unshare).toHaveBeenCalledWith(123, 456, {});
    expect(mockContext.output).toHaveBeenCalledWith('groupIds', [456]);
  });

  it('should not call API on dryRun for group sharing', async () => {
    await action.handler({
      ...mockContext,
      isDryRun: true,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        groupIds: [456, 789],
        accessLevel: 30,
      },
    });

    expect(mockGitlabClient.Groups.share).not.toHaveBeenCalled();

    expect(mockContext.output).toHaveBeenCalledWith('groupIds', [456, 789]);
    expect(mockContext.output).toHaveBeenCalledWith('path', 123);
    expect(mockContext.output).toHaveBeenCalledWith('accessLevel', 30);
  });

  // Mixed mode tests
  it('should add users and share groups simultaneously', async () => {
    mockGitlabClient.GroupMembers.add.mockResolvedValue({});
    mockGitlabClient.Groups.share.mockResolvedValue({});

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        userIds: [456, 789],
        groupIds: [101, 102],
        accessLevel: 30,
      },
    });

    expect(mockGitlabClient.GroupMembers.add).toHaveBeenCalledTimes(2);
    expect(mockGitlabClient.GroupMembers.add).toHaveBeenCalledWith(
      123,
      456,
      30,
    );
    expect(mockGitlabClient.GroupMembers.add).toHaveBeenCalledWith(
      123,
      789,
      30,
    );

    expect(mockGitlabClient.Groups.share).toHaveBeenCalledTimes(2);
    expect(mockGitlabClient.Groups.share).toHaveBeenCalledWith(
      123,
      101,
      30,
      {},
    );
    expect(mockGitlabClient.Groups.share).toHaveBeenCalledWith(
      123,
      102,
      30,
      {},
    );

    expect(mockContext.output).toHaveBeenCalledWith('userIds', [456, 789]);
    expect(mockContext.output).toHaveBeenCalledWith('groupIds', [101, 102]);
    expect(mockContext.output).toHaveBeenCalledWith('path', 123);
    expect(mockContext.output).toHaveBeenCalledWith('accessLevel', 30);
  });

  it('should remove users and unshare groups simultaneously', async () => {
    mockGitlabClient.GroupMembers.remove.mockResolvedValue(undefined);
    mockGitlabClient.Groups.unshare.mockResolvedValue(undefined);

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        userIds: [456],
        groupIds: [789],
        action: 'remove',
      },
    });

    expect(mockGitlabClient.GroupMembers.remove).toHaveBeenCalledWith(123, 456);
    expect(mockGitlabClient.Groups.unshare).toHaveBeenCalledWith(123, 789, {});

    expect(mockContext.output).toHaveBeenCalledWith('userIds', [456]);
    expect(mockContext.output).toHaveBeenCalledWith('groupIds', [789]);
    expect(mockContext.output).toHaveBeenCalledWith('path', 123);
  });

  // Validation tests
  it('should throw an error when neither userIds nor groupIds provided', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'gitlab.com?repo=repo&owner=owner',
          path: 123,
        },
      }),
    ).rejects.toThrow(
      'At least one of userIds or groupIds must be provided and non-empty',
    );

    expect(mockGitlabClient.GroupMembers.add).not.toHaveBeenCalled();
    expect(mockGitlabClient.Groups.share).not.toHaveBeenCalled();
  });

  it('should throw an error when userIds and groupIds are both empty arrays', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'gitlab.com?repo=repo&owner=owner',
          path: 123,
          userIds: [],
          groupIds: [],
        },
      }),
    ).rejects.toThrow(
      'At least one of userIds or groupIds must be provided and non-empty',
    );

    expect(mockGitlabClient.GroupMembers.add).not.toHaveBeenCalled();
    expect(mockGitlabClient.Groups.share).not.toHaveBeenCalled();
  });

  it('should not output userIds when only groupIds are provided', async () => {
    mockGitlabClient.Groups.share.mockResolvedValue({});

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        groupIds: [456],
        accessLevel: 30,
      },
    });

    expect(mockContext.output).not.toHaveBeenCalledWith(
      'userIds',
      expect.anything(),
    );
    expect(mockContext.output).toHaveBeenCalledWith('groupIds', [456]);
  });

  it('should not output groupIds when only userIds are provided', async () => {
    mockGitlabClient.GroupMembers.add.mockResolvedValue({});

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        path: 123,
        userIds: [456],
        accessLevel: 30,
      },
    });

    expect(mockContext.output).toHaveBeenCalledWith('userIds', [456]);
    expect(mockContext.output).not.toHaveBeenCalledWith(
      'groupIds',
      expect.anything(),
    );
  });
});
