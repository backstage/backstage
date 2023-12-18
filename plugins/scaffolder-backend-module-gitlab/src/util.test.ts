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
import { Gitlab, GroupSchema } from '@gitbeaker/rest';
import { InputError } from '@backstage/errors';

// Mock the Gitlab client and its methods
const setupGitlabMock = () => {
  jest.mock('@gitbeaker/rest', () => {
    return {
      Gitlab: jest.fn().mockImplementation(() => ({
        Groups: {
          show: jest.fn(),
        },
        Projects: {
          show: jest.fn(),
        },
        Epics: {
          all: jest.fn(),
        },
      })),
    };
  });
};

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
describe('getTopLevelParentGroup', () => {
  beforeEach(() => {
    setupGitlabMock();
  });

  afterEach(() => jest.resetAllMocks());

  // Mocked nested groups
  const mockGroups: GroupSchema[] = [
    {
      id: 789,
      parent_id: 0,
      path: '',
      description: '',
      visibility: '',
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
      visibility: '',
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
      visibility: '',
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
    visibility: '',
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
    const mockGitlabClient = new Gitlab({
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

    const action = util.getTopLevelParentGroup(mockGitlabClient, 123);

    const result = await action;
    expect(result).toEqual(mockTopParentGroup);
  });

  it('should return the input group if it has no parents in the hierarchy', async () => {
    // Instance with token
    const mockGitlabClient = new Gitlab({
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

    const action = util.getTopLevelParentGroup(mockGitlabClient, 789);

    const result = await action;
    expect(result).toEqual(mockTopParentGroup);
  });
});

describe('checkEpicScope', () => {
  afterEach(() => jest.resetAllMocks());

  it('should return true if the project and epic are found', async () => {
    const mockGitlabClient = new Gitlab({
      host: mockConfig.gitlab[0].host,
      token: mockConfig.gitlab[0].token!,
    });

    const projectId = 123;
    const epicId = 456;

    // Mock project and top-level parent group
    const mockProject = { namespace: { id: 789 } };
    const mockTopParentGroup = { id: 789, name: 'MockGroup' };

    mockGitlabClient.Projects.show.mockResolvedValue(mockProject);
    mockGitlabClient.Groups.show.mockResolvedValue(mockTopParentGroup);
    mockGitlabClient.Epics.all.mockResolvedValue([
      { id: epicId, group_id: 789 },
    ]);

    const result = await checkEpicScope(mockGitlabClient, projectId, epicId);

    expect(result).toBe(true);
    expect(mockGitlabClient.Projects.show).toHaveBeenCalledWith(projectId);
    expect(mockGitlabClient.Groups.show).toHaveBeenCalledWith(
      mockProject.namespace.id,
    );
    expect(mockGitlabClient.Epics.all).toHaveBeenCalledWith(
      mockTopParentGroup.id,
    );
  });

  it('should throw InputError if the project is not found', async () => {
    const mockClient = new Gitlab();
    const projectId = 123;
    const epicId = 456;

    // Mocking the absence of the project
    mockClient.Projects.show.mockResolvedValue(null);

    await expect(checkEpicScope(mockClient, projectId, epicId)).rejects.toThrow(
      new InputError(
        `Project with id ${projectId} not found. Check your GitLab instance.`,
      ),
    );

    expect(mockClient.Projects.show).toHaveBeenCalledWith(projectId);
    expect(mockClient.Groups.show).not.toHaveBeenCalled();
    expect(mockClient.Epics.all).not.toHaveBeenCalled();
  });

  // Add more test cases as needed for different scenarios
});

describe('convertDate', () => {
  it('should convert a valid input date with miliseconds to an ISO string', () => {
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
