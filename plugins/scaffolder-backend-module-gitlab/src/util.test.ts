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

import * as util from './util';
import { Gitlab, GroupSchema, RepositoryTreeSchema } from '@gitbeaker/rest';
import { InputError } from '@backstage/errors';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { mockServices } from '@backstage/backend-test-utils';
import { SerializedFile } from '@backstage/plugin-scaffolder-node';
import { createHash } from 'node:crypto';

// Mock the Gitlab client and its methods
const mockGitlabClient = {
  Groups: {
    show: jest.fn(),
  },
  Projects: {
    show: jest.fn(),
  },
  Epics: {
    all: jest.fn(),
  },
};

jest.mock('@gitbeaker/rest', () => ({
  Gitlab: class {
    constructor() {
      return mockGitlabClient;
    }
  },
}));

const mockConfig = {
  gitlab: [
    {
      host: 'gitlab.com',
      token: 'withToken',
      apiBaseUrl: 'gitlab.com/api/v4',
    },
    {
      host: 'gitlab.com',
      apiBaseUrl: 'gitlab.com/api/v4',
    },
  ],
};

describe('getToken', () => {
  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        gitlab: [{ host: 'gitlab.com', token: 'integration-token' }],
      },
    }),
  );
  const integrationsWithoutCredentials = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: { gitlab: [{ host: 'gitlab.com' }] },
    }),
  );

  it('requires an explicit user token when configured', () => {
    expect(() =>
      util.getToken(
        { repoUrl: 'gitlab.com?owner=backstage&repo=backstage' },
        integrations,
        true,
      ),
    ).toThrow(
      'No user credentials provided for host gitlab.com, but scaffolder.requireScmUserCredentials is enabled',
    );

    expect(
      util.getToken(
        {
          repoUrl: 'gitlab.com?owner=backstage&repo=backstage',
          token: 'user-token',
        },
        integrationsWithoutCredentials,
        true,
      ).token,
    ).toBe('user-token');
  });
});

describe('getTopLevelParentGroup', () => {
  afterEach(() => jest.resetAllMocks());

  // Mocked nested groups
  const mockGroups: GroupSchema[] = [
    {
      id: 789,
      parent_id: 0,
      path: '',
      description: '',
      visibility: 'public',
      share_with_group_lock: false,
      require_two_factor_authentication: false,
      two_factor_grace_period: 0,
      project_creation_level: '',
      subgroup_creation_level: '',
      lfs_enabled: false,
      default_branch_protection: 0,
      request_access_enabled: false,
      created_at: '',
      avatar_url: '',
      full_name: '',
      full_path: '',
      web_url: '',
      name: '',
    },
    {
      id: 456,
      parent_id: 789,
      path: '',
      description: '',
      visibility: 'public',
      share_with_group_lock: false,
      require_two_factor_authentication: false,
      two_factor_grace_period: 0,
      project_creation_level: '',
      subgroup_creation_level: '',
      lfs_enabled: false,
      default_branch_protection: 0,
      request_access_enabled: false,
      created_at: '',
      avatar_url: '',
      full_name: '',
      full_path: '',
      web_url: '',
      name: '',
    },
    {
      id: 123,
      parent_id: 456,
      path: '',
      description: '',
      visibility: 'public',
      share_with_group_lock: false,
      require_two_factor_authentication: false,
      two_factor_grace_period: 0,
      project_creation_level: '',
      subgroup_creation_level: '',
      lfs_enabled: false,
      default_branch_protection: 0,
      request_access_enabled: false,
      created_at: '',
      avatar_url: '',
      full_name: '',
      full_path: '',
      web_url: '',
      name: '',
    },
  ];

  // Top level group
  const mockTopParentGroup: GroupSchema = {
    id: 789,
    parent_id: 0,
    path: '',
    description: '',
    visibility: 'public',
    share_with_group_lock: false,
    require_two_factor_authentication: false,
    two_factor_grace_period: 0,
    project_creation_level: '',
    subgroup_creation_level: '',
    lfs_enabled: false,
    default_branch_protection: 0,
    request_access_enabled: false,
    created_at: '',
    avatar_url: '',
    full_name: '',
    full_path: '',
    web_url: '',
    name: '',
  };

  it('should return the top-level parent group if the input group has a parent in the hierarchy', async () => {
    // Instance with token
    const apiClient = new Gitlab({
      host: mockConfig.gitlab[0].host,
      token: mockConfig.gitlab[0].token!,
    });

    const showSpy = jest.spyOn(mockGitlabClient.Groups, 'show');

    // Mock implementation of Groups.show
    showSpy.mockImplementation(
      async (groupId: string | number): Promise<any> => {
        const id =
          typeof groupId === 'number' ? groupId : parseInt(groupId, 10);
        const mockGroup = mockGroups.find(group => group.id === id) || null;
        return mockGroup as GroupSchema;
      },
    );

    const action = util.getTopLevelParentGroup(apiClient, 123);

    const result = await action;
    expect(result).toEqual(mockTopParentGroup);
  });

  it('should return the input group if it has no parents in the hierarchy', async () => {
    // Instance with token
    const apiClient = new Gitlab({
      host: mockConfig.gitlab[0].host,
      token: mockConfig.gitlab[0].token!,
    });

    const showSpy = jest.spyOn(mockGitlabClient.Groups, 'show');

    // Mock implementation of Groups.show
    showSpy.mockImplementation(
      async (groupId: string | number): Promise<any> => {
        const id =
          typeof groupId === 'number' ? groupId : parseInt(groupId, 10);
        const mockGroup = mockGroups.find(group => group.id === id) || null;
        return mockGroup as GroupSchema;
      },
    );

    const action = util.getTopLevelParentGroup(apiClient, 789);

    const result = await action;
    expect(result).toEqual(mockTopParentGroup);
  });
});

describe('checkEpicScope', () => {
  afterEach(() => jest.resetAllMocks());

  it('should return true if the project is inside the epic scope', async () => {
    const apiClient = new Gitlab({
      host: mockConfig.gitlab[0].host,
      token: mockConfig.gitlab[0].token!,
    });

    const projectId = 123;
    const epicId = 456;

    // Mock project, top-level parent group, and epic
    const mockProject = {
      id: 123,
      name: 'You learn',
      namespace: { id: 789 },
      path_with_namespace: 'at-once/you-learn',
    };
    const mockTopParentGroup = {
      id: 789,
      name: 'LivingTwice',
      full_path: 'at-once/you-learn',
    };
    const mockEpic = { id: epicId, group_id: 789 };

    mockGitlabClient.Projects.show.mockResolvedValue(mockProject);
    mockGitlabClient.Groups.show.mockResolvedValue(mockTopParentGroup);
    mockGitlabClient.Epics.all.mockResolvedValue([mockEpic]);

    const result = await util.checkEpicScope(apiClient, projectId, epicId);

    expect(result).toBe(true);
    expect(mockGitlabClient.Projects.show).toHaveBeenCalledWith(projectId);
    expect(mockGitlabClient.Groups.show).toHaveBeenCalledWith(
      mockProject.namespace.id,
    );
    expect(mockGitlabClient.Epics.all).toHaveBeenCalledWith(
      mockTopParentGroup.id,
    );
  });

  it('should return false if the project is not inside the epic scope', async () => {
    const apiClient = new Gitlab({
      host: mockConfig.gitlab[0].host,
      token: mockConfig.gitlab[0].token!,
    });

    const projectId = 123;
    const epicId = 45;

    // Mock project, top-level parent group, and epic
    const mockProject = {
      id: 123,
      name: 'You learn',
      namespace: { id: 32 },
      path_with_namespace: 'at-once/you-learn',
    };
    const mockTopParentGroup = {
      id: 32,
      name: 'TheWalls',
      full_path: 'you-built/within',
    };

    const mockEpic = { id: epicId, group_id: 32 };

    mockGitlabClient.Projects.show.mockResolvedValue(mockProject);
    mockGitlabClient.Groups.show.mockResolvedValue(mockTopParentGroup);
    mockGitlabClient.Epics.all.mockResolvedValue([mockEpic]);

    const result = await util.checkEpicScope(apiClient, projectId, epicId);

    expect(result).toBe(false);
    expect(mockGitlabClient.Projects.show).toHaveBeenCalledWith(projectId);
    expect(mockGitlabClient.Groups.show).toHaveBeenCalledWith(
      mockProject.namespace.id,
    );
    expect(mockGitlabClient.Epics.all).toHaveBeenCalledWith(
      mockTopParentGroup.id,
    );
  });

  it('should throw an InputError if the project is not found', async () => {
    const apiClient = new Gitlab({
      host: mockConfig.gitlab[0].host,
      token: mockConfig.gitlab[0].token!,
    });

    const projectId = 123;
    const epicId = 456;

    mockGitlabClient.Projects.show.mockResolvedValue(null);

    await expect(
      util.checkEpicScope(apiClient, projectId, epicId),
    ).rejects.toThrow(InputError);
    expect(mockGitlabClient.Projects.show).toHaveBeenCalledWith(projectId);
  });

  it('should throw an InputError if the top-level parent group is not found', async () => {
    const apiClient = new Gitlab({
      host: mockConfig.gitlab[0].host,
      token: mockConfig.gitlab[0].token!,
    });

    const projectId = 123;
    const epicId = 456;

    mockGitlabClient.Projects.show.mockResolvedValue({
      id: 123,
      name: 'You learn',
      namespace: { id: 789 },
      path_with_namespace: 'at-once/you-learn',
    });
    mockGitlabClient.Groups.show.mockResolvedValue(null);

    await expect(
      util.checkEpicScope(apiClient, projectId, epicId),
    ).rejects.toThrow(InputError);
    expect(mockGitlabClient.Projects.show).toHaveBeenCalledWith(projectId);
    expect(mockGitlabClient.Groups.show).toHaveBeenCalledWith(789);
  });

  it('should throw an InputError if the epic is not found', async () => {
    const apiClient = new Gitlab({
      host: mockConfig.gitlab[0].host,
      token: mockConfig.gitlab[0].token!,
    });

    const projectId = 123;
    const epicId = 456;

    mockGitlabClient.Projects.show.mockResolvedValue({
      id: 123,
      name: 'You learn',
      namespace: { id: 789 },
      path_with_namespace: 'at-once/you-learn',
    });
    mockGitlabClient.Groups.show.mockResolvedValue({
      id: 789,
      name: 'LivingTwice',
      full_path: 'at-once/you-learn',
    });
    mockGitlabClient.Epics.all.mockResolvedValue([]);

    await expect(
      util.checkEpicScope(apiClient, projectId, epicId),
    ).rejects.toThrow(InputError);
    expect(mockGitlabClient.Projects.show).toHaveBeenCalledWith(projectId);
    expect(mockGitlabClient.Groups.show).toHaveBeenCalledWith(789);
    expect(mockGitlabClient.Epics.all).toHaveBeenCalledWith(789);
  });
});

describe('convertDate', () => {
  it('should convert a valid input date with milliseconds to an ISO string', () => {
    const inputDate = '1970-01-01T12:00:00.000Z';
    const defaultDate = '1978-10-09T12:00:00Z';

    const result = util.convertDate(inputDate, defaultDate);

    expect(result).toEqual('1970-01-01T12:00:00.000Z');
  });

  it('should convert a valid input date to an ISO string', () => {
    const inputDate = '1970-01-01T12:00:00Z';
    const defaultDate = '1978-10-09T12:00:00Z';

    const result = util.convertDate(inputDate, defaultDate);

    expect(result).toEqual('1970-01-01T12:00:00.000Z');
  });

  it('should use default date if input date is undefined', () => {
    const inputDate = undefined;
    const defaultDate = '1970-01-01T12:00:00Z';

    const result = util.convertDate(inputDate, defaultDate);

    expect(result).toEqual('1970-01-01T12:00:00.000Z');
  });

  it('should throw an InputError if  input date is invalid', () => {
    const inputDate = 'invalidDate';
    const defaultDate = '2023-02-01T12:00:00Z';

    // Expecting an InputError to be thrown
    expect(() => util.convertDate(inputDate, defaultDate)).toThrow(InputError);
  });
});

describe('getFileAction', () => {
  // Object ids below are real `git hash-object` output for the contents they sit next to.
  const BLOB_FOO_BAR_BAZ = '6463ca9e2f99a4e9b97e1e9e24e752b52228ccef';
  const BLOB_CHANGED_CONTENT = '8a4c7293b2b39d7581915204c5f5f6e3b7023203';
  const BLOB_EMPTY = 'e69de29bb2d1d6434b8b29ae775ad8c2e48c5391';
  const BLOB_LINK_TARGET = '567dcc0008aa3e8791fb5bb9781d252fc461075a';

  const logger = mockServices.logger.mock();
  const show = jest.fn();
  const api = {
    RepositoryFiles: { show },
  } as unknown as InstanceType<typeof Gitlab>;
  const target = { repoID: 'owner/repo', branch: 'main' };

  const file = (path: string, content: string): SerializedFile => ({
    path,
    content: Buffer.from(content),
    executable: false,
    symlink: false,
  });

  const treeEntry = (path: string, id?: string) =>
    ({ path, id } as RepositoryTreeSchema);

  const getFileAction = (
    f: SerializedFile,
    remoteFiles: RepositoryTreeSchema[],
    opts: {
      targetPath?: string;
      commitAction?: 'create' | 'delete' | 'update' | 'skip' | 'auto';
    } = {},
  ) =>
    util.getFileAction(
      { file: f, targetPath: opts.targetPath },
      target,
      api,
      logger,
      remoteFiles,
      opts.commitAction,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should skip an unchanged file without requesting its contents', async () => {
    const f = file('a.txt', 'foo-bar-baz');

    await expect(
      getFileAction(f, [treeEntry('a.txt', BLOB_FOO_BAR_BAZ)]),
    ).resolves.toEqual('skip');
    expect(show).not.toHaveBeenCalled();
  });

  it('should update a changed file without requesting its contents', async () => {
    const f = file('a.txt', 'changed content');

    await expect(
      getFileAction(f, [treeEntry('a.txt', BLOB_FOO_BAR_BAZ)]),
    ).resolves.toEqual('update');
    expect(show).not.toHaveBeenCalled();
  });

  it('should create a file that is absent from the tree', async () => {
    await expect(
      getFileAction(file('new.txt', 'x'), [
        treeEntry('a.txt', BLOB_FOO_BAR_BAZ),
      ]),
    ).resolves.toEqual('create');
    expect(show).not.toHaveBeenCalled();
  });

  it('should join targetPath before matching against the tree', async () => {
    const f = file('a.txt', 'changed content');

    await expect(
      getFileAction(f, [treeEntry('sub/a.txt', BLOB_CHANGED_CONTENT)], {
        targetPath: 'sub',
      }),
    ).resolves.toEqual('skip');
  });

  it('should hash an empty file correctly', async () => {
    await expect(
      getFileAction(file('empty', ''), [treeEntry('empty', BLOB_EMPTY)]),
    ).resolves.toEqual('skip');
  });

  it('should hash binary content containing NUL bytes correctly', async () => {
    const f: SerializedFile = {
      path: 'b.bin',
      content: Buffer.from([0, 1, 2, 0, 255, 0]),
      executable: false,
      symlink: false,
    };
    const id = createHash('sha1')
      .update(`blob ${f.content.length}\0`)
      .update(f.content)
      .digest('hex');

    await expect(getFileAction(f, [treeEntry('b.bin', id)])).resolves.toEqual(
      'skip',
    );
  });

  it('should compare a symlink against the blob of its target path', async () => {
    // serializeDirectoryContents stores readlink() output as the content, as git does.
    const f: SerializedFile = {
      path: 'link',
      content: Buffer.from('../target/file'),
      executable: false,
      symlink: true,
    };

    await expect(
      getFileAction(f, [treeEntry('link', BLOB_LINK_TARGET)]),
    ).resolves.toEqual('skip');
  });

  it('should compare with sha256 in a repository using the sha256 object format', async () => {
    const f = file('a.txt', 'foo-bar-baz');
    const id =
      '6ae59be0528e3485c1ceabf48c2dfb18a4dae525e55b828a3a2325119c7fe86e';

    await expect(getFileAction(f, [treeEntry('a.txt', id)])).resolves.toEqual(
      'skip',
    );
    expect(show).not.toHaveBeenCalled();
  });

  it('should fall back to comparing contents when the tree id is unusable', async () => {
    show.mockResolvedValue({
      content_sha256:
        '269dce1a5bb90188b2d9cf542a7c30e410c7d8251e34a97bfea56062df51ae23',
    });

    await expect(
      getFileAction(file('a.txt', 'foo-bar-baz'), [
        treeEntry('a.txt', 'not-a-valid-object-id'),
      ]),
    ).resolves.toEqual('skip');
    expect(show).toHaveBeenCalledWith('owner/repo', 'a.txt', 'main');
  });

  it('should fall back to comparing contents when the tree id is missing', async () => {
    show.mockResolvedValue({ content_sha256: 'something-else' });

    await expect(
      getFileAction(file('a.txt', 'foo-bar-baz'), [treeEntry('a.txt')]),
    ).resolves.toEqual('update');
    expect(show).toHaveBeenCalledTimes(1);
  });

  it('should return an explicit commitAction without inspecting the tree', async () => {
    await expect(
      getFileAction(
        file('a.txt', 'foo-bar-baz'),
        [treeEntry('a.txt', BLOB_FOO_BAR_BAZ)],
        { commitAction: 'create' },
      ),
    ).resolves.toEqual('create');
    expect(show).not.toHaveBeenCalled();
  });
});
