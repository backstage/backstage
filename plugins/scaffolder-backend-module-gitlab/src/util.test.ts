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
// import { InputError } from '@backstage/errors';
import {
  // parseRepoHost,
  // getToken,
  // convertDate,
  getTopLevelParentGroup,
} from './util';
import { Gitlab, GroupSchema } from '@gitbeaker/rest';
// import { ScmIntegrations } from '@backstage/integration';
// import { ConfigReader } from '@backstage/config';

// Mock the Gitlab client and its methods
jest.mock('@gitbeaker/rest', () => {
  const mockShow = jest.fn();
  return {
    Gitlab: jest.fn().mockImplementation(() => ({
      Groups: {
        show: mockShow,
      },
    })),
  };
});

describe('getTopLevelParentGroup', () => {
  const config = {
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

  it('should return top-level parent group when parent_id is present', async () => {
    const mockGroupId = 123;
    const mockParentGroupId = 456;

    const mockTopParentGroup: GroupSchema = {
      id: mockGroupId,
      parent_id: mockParentGroupId,
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

    // Instance with token
    const mockGitlabClient = new Gitlab({
      host: config.gitlab[0].host,
      token: config.gitlab[0].token!,
    });

    const action = getTopLevelParentGroup(mockGitlabClient, mockGroupId);

    const result = await action; // Await the result

    expect(result).toEqual(mockTopParentGroup);
  });
});
