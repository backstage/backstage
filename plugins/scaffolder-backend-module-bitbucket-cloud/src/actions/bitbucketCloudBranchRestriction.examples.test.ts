/*
 * Copyright 2025 The Backstage Authors
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

import { createBitbucketCloudBranchRestrictionAction } from './bitbucketCloudBranchRestriction';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import yaml from 'yaml';
import { examples } from './bitbucketCloudBranchRestriction.examples';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { Bitbucket } from 'bitbucket';

jest.mock('bitbucket', () => ({
  Bitbucket: jest.fn(),
}));

describe('bitbucketCloud:branchRestriction:create', () => {
  const config = new ConfigReader({
    integrations: {
      bitbucketCloud: [
        {
          username: 'u',
          appPassword: 'p',
        },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = createBitbucketCloudBranchRestrictionAction({ integrations });
  const mockContext = createMockActionContext({
    input: {
      repoUrl:
        'bitbucket.org?workspace=workspace&project=project&repo=repo&project=project',
      kind: 'push',
    },
  });

  const mockBranchRestrictionsApi = {
    branchrestrictions: {
      create: jest.fn().mockResolvedValue({ status: 201, data: {} }),
    },
  };
  (Bitbucket as unknown as jest.Mock).mockImplementation(
    () => mockBranchRestrictionsApi,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() =>
    mockBranchRestrictionsApi.branchrestrictions.create.mockClear(),
  );

  it(`should restrict push to the main branch, except for two user ids, and the admins group`, async () => {
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...yaml.parse(examples[0].example).steps[0].input,
      },
    });

    expect(
      mockBranchRestrictionsApi.branchrestrictions.create,
    ).toHaveBeenCalledWith({
      _body: {
        branch_match_kind: 'branching_model',
        branch_type: 'development',
        users: [
          {
            uuid: '{a-b-c-d}',
            type: 'user',
          },
          {
            uuid: '{e-f-g-h}',
            type: 'user',
          },
        ],
        groups: [
          {
            slug: 'admins',
            type: 'group',
          },
        ],
        kind: 'push',
        value: null,
        pattern: undefined,
        type: 'branchrestriction',
      },
      repo_slug: 'repo',
      workspace: 'workspace',
    });
  });

  it('should restrict push to the main branch, except for the admins group', async () => {
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...yaml.parse(examples[1].example).steps[0].input,
      },
    });

    expect(
      mockBranchRestrictionsApi.branchrestrictions.create,
    ).toHaveBeenCalledWith({
      _body: {
        branch_match_kind: 'branching_model',
        branch_type: 'development',
        users: [],
        groups: [
          {
            slug: 'admins',
            type: 'group',
          },
        ],
        kind: 'push',
        value: null,
        pattern: undefined,
        type: 'branchrestriction',
      },
      repo_slug: 'repo',
      workspace: 'workspace',
    });
  });

  //
  it('should require passing builds to merge to branches matching a pattern test-feature/*', async () => {
    const input = yaml.parse(examples[2].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(
      mockBranchRestrictionsApi.branchrestrictions.create,
    ).toHaveBeenCalledWith({
      _body: {
        branch_match_kind: 'glob',
        branch_type: undefined,
        users: [],
        groups: [],
        kind: 'require_passing_builds_to_merge',
        value: 1,
        pattern: 'test-feature/*',
        type: 'branchrestriction',
      },
      repo_slug: 'repo',
      workspace: 'workspace',
    });
  });

  //
  it('should require approvals to merge to branches matching a pattern test-feature/*', async () => {
    const input = yaml.parse(examples[3].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(
      mockBranchRestrictionsApi.branchrestrictions.create,
    ).toHaveBeenCalledWith({
      _body: {
        branch_match_kind: 'glob',
        branch_type: undefined,
        users: [],
        groups: [],
        kind: 'require_approvals_to_merge',
        value: 1,
        pattern: 'test-feature/*',
        type: 'branchrestriction',
      },
      repo_slug: 'repo',
      workspace: 'workspace',
    });
  });
});
