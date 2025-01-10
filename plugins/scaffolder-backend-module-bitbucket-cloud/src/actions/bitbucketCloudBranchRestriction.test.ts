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

import { createBitbucketCloudBranchRestrictionAction } from './bitbucketCloudBranchRestriction';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';

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
      repoUrl: 'bitbucket.org?workspace=workspace&project=project&repo=repo',
      kind: 'push',
    },
  });
  const server = setupServer();
  registerMswTestHooks(server);

  it('should work if the token is provided through ctx.input', async () => {
    expect.assertions(2);
    const token = 'user-token';
    server.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo/branch-restrictions',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(`Bearer ${token}`);
          req.json().then(data => {
            expect(data).toEqual({
              branch_match_kind: 'branching_model',
              branch_type: 'development',
              users: [],
              groups: [],
              kind: 'push',
            });
          });
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({}),
          );
        },
      ),
    );
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        token: token,
      },
    });
  });

  it('should return correct outputs', async () => {
    server.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo/branch-restrictions',
        (_, res, ctx) =>
          res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({}),
          ),
      ),
    );

    await action.handler(mockContext);

    expect(mockContext.output).toHaveBeenCalledWith('statusCode', 201);
    expect(mockContext.output).toHaveBeenCalledWith('json', '{}');
  });
});
