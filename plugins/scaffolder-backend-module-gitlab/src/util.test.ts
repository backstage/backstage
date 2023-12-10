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

// Mock the Gitlab client and its methods
const setupGitlabMock = () => {
  jest.mock('@gitbeaker/rest', () => {
    return {
      Gitlab: jest.fn().mockImplementation(() => ({
        Groups: {
          show: jest.fn(),
        },
      })),
    };
  });
};

describe('getTopLevelParentGroup', () => {
  beforeEach(() => {
    setupGitlabMock();
  });

  afterEach(() => jest.resetAllMocks());

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

  it('should return the top-level parent group', async () => {
    // Instance with token
    const mockGitlabClient = new Gitlab({
      host: mockConfig.gitlab[0].host,
      token: mockConfig.gitlab[0].token!,
    });

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
});
