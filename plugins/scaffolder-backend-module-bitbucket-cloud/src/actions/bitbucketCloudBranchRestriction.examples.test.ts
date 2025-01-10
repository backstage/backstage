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

import { createBitbucketCloudBranchRestrictionAction } from './bitbucketCloudBranchRestriction';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import yaml from 'yaml';
import { examples } from './bitbucketCloudBranchRestriction.examples';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';

describe('bitbucketCloud:branchRestriction:create', () => {
  const config = new ConfigReader({
    integrations: {
      bitbucketCloud: [
        {
          username: 'x-token-auth',
          appPassword: 'your-default-auth-token',
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
    },
  });

  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 201,
        json: () =>
          Promise.resolve({
            status: 201,
          }),
      }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should restrict push to the main branch, except for the defined uuids, and the admins group', async () => {
    const input = yaml.parse(examples[0].example).steps[0].input;
    const ctx = Object.assign({}, mockContext, { input });
    await action.handler(ctx);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.bitbucket.org/2.0/repositories/workspace/repo/branch-restrictions',
      expect.objectContaining({
        body: JSON.stringify({
          branch_match_kind: 'branching_model',
          users: [{ uuid: '{a-b-c-d}' }, { uuid: '{e-f-g-h}' }],
          groups: [{ slug: 'admins' }],
          kind: 'push',
          branch_type: 'development',
        }),
        method: 'POST',
      }),
    );
  });

  it('should restrict push to the main branch, except for the admins group', async () => {
    const input = yaml.parse(examples[1].example).steps[0].input;
    const ctx = Object.assign({}, mockContext, { input });
    await action.handler(ctx);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.bitbucket.org/2.0/repositories/workspace/repo/branch-restrictions',
      expect.objectContaining({
        body: JSON.stringify({
          branch_match_kind: 'branching_model',
          users: [],
          groups: [{ slug: 'admins' }],
          kind: 'push',
          branch_type: 'development',
        }),
        method: 'POST',
      }),
    );
  });

  it('should require passing builds to merge to branches matching a pattern test-feature/*', async () => {
    const input = yaml.parse(examples[2].example).steps[0].input;
    const ctx = Object.assign({}, mockContext, { input });
    await action.handler(ctx);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.bitbucket.org/2.0/repositories/workspace/repo/branch-restrictions',
      expect.objectContaining({
        body: JSON.stringify({
          branch_match_kind: 'glob',
          kind: 'require_passing_builds_to_merge',
          value: 1,
          pattern: 'test-feature/*',
        }),
        method: 'POST',
      }),
    );
  });

  it('should require approvals to merge to branches matching a pattern test-feature/*', async () => {
    const input = yaml.parse(examples[3].example).steps[0].input;
    const ctx = Object.assign({}, mockContext, { input });
    await action.handler(ctx);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.bitbucket.org/2.0/repositories/workspace/repo/branch-restrictions',
      expect.objectContaining({
        body: JSON.stringify({
          branch_match_kind: 'glob',
          kind: 'require_approvals_to_merge',
          value: 1,
          pattern: 'test-feature/*',
        }),
        method: 'POST',
      }),
    );
  });
});
