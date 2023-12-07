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
import { createMockDirectory } from '@backstage/backend-test-utils';
import { Writable } from 'stream';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { createBitbucketPipelinesRunAction } from './bitbucketCloudPipelinesRun';
import fetch from 'node-fetch';

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');

const createdResponse = {
  type: '<string>',
  uuid: '<string>',
  build_number: 33,
  creator: {
    type: '<string>',
  },
  repository: {
    type: '<string>',
  },
  target: {
    type: '<string>',
  },
  trigger: {
    type: '<string>',
  },
  state: {
    type: '<string>',
  },
  created_on: '<string>',
  completed_on: '<string>',
  build_seconds_used: 50,
};

describe('bitbucket:pipelines:run', () => {
  const logStream = {
    write: jest.fn(),
  } as jest.Mocked<Partial<Writable>> as jest.Mocked<Writable>;
  const mockDir = createMockDirectory();
  const workspacePath = mockDir.resolve('workspace');
  let action: TemplateAction<any>;

  const mockContext = {
    input: {},
    baseUrl: 'somebase',
    workspacePath,
    logger: getVoidLogger(),
    logStream,
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    action = createBitbucketPipelinesRunAction();
  });

  it('should call the bitbucket api for running a pipeline', async () => {
    const workspace = 'test-workspace';
    const repo_slug = 'test-repo-slug';
    const ctx = Object.assign({}, mockContext, {
      input: { workspace, repo_slug },
    });
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
      new Response(JSON.stringify(createdResponse), {
        url: 'url',
        status: 201,
        statusText: 'Created',
      }),
    );
    await action.handler(ctx);
    expect(fetch).toHaveBeenCalledWith(
      'https://api.bitbucket.org/2.0/repositories/test-workspace/test-repo-slug/pipelines',
      {
        body: {},
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer testToken',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    );
    expect(logStream.write).toHaveBeenCalledTimes(2);
    expect(logStream.write).toHaveBeenNthCalledWith(1, 'Response: 201 Created');
    expect(logStream.write).toHaveBeenNthCalledWith(2, createdResponse);
  });
});
