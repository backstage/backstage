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

import { getVoidLogger } from '@backstage/backend-common';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { PassThrough } from 'stream';
import { createBitbucketPipelinesRunAction } from './bitbucketCloudPipelinesRun';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';

describe('bitbucket:pipelines:run', () => {
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
  const action = createBitbucketPipelinesRunAction({ integrations });
  const mockContext = {
    input: {},
    workspacePath: 'wsp',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the bitbucket api for running a pipeline', async () => {
    expect.assertions(1);
    const workspace = 'test-workspace';
    const repo_slug = 'test-repo-slug';
    worker.use(
      rest.post(
        `https://api.bitbucket.org/2.0/repositories/${workspace}/${repo_slug}/pipelines`,
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Basic dTpw');
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({}),
          );
        },
      ),
    );

    const testContext = Object.assign({}, mockContext, {
      input: { workspace, repo_slug },
    });
    await action.handler(testContext);
  });
});
