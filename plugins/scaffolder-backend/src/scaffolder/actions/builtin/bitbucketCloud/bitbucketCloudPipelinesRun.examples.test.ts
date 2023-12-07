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
import yaml from 'yaml';
import { examples } from './bitbucketCloudPipelinesRun.examples';

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

  it('should trigger a pipeline for a branch', async () => {
    const ctx = Object.assign({}, mockContext, {
      input: yaml.parse(examples[0].example).steps[0].input,
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
        body: JSON.stringify({
          target: {
            ref_type: 'branch',
            type: 'pipeline_ref_target',
            ref_name: 'master',
          },
        }),
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

  it('should trigger a pipeline for a commit on a branch', async () => {
    const ctx = Object.assign({}, mockContext, {
      input: yaml.parse(examples[1].example).steps[0].input,
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
        body: JSON.stringify({
          target: {
            commit: {
              type: 'commit',
              hash: 'ce5b7431602f7cbba007062eeb55225c6e18e956',
            },
            ref_type: 'branch',
            type: 'pipeline_ref_target',
            ref_name: 'master',
          },
        }),
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

  it('should trigger a specific pipeline definition for a commit', async () => {
    const ctx = Object.assign({}, mockContext, {
      input: yaml.parse(examples[2].example).steps[0].input,
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
        body: JSON.stringify({
          target: {
            commit: {
              type: 'commit',
              hash: 'a3c4e02c9a3755eccdc3764e6ea13facdf30f923',
            },
            selector: {
              type: 'custom',
              pattern: 'Deploy to production',
            },
            type: 'pipeline_commit_target',
          },
        }),
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

  it('should trigger a specific pipeline definition for a commit on a branch or tag', async () => {
    const ctx = Object.assign({}, mockContext, {
      input: yaml.parse(examples[3].example).steps[0].input,
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
        body: JSON.stringify({
          target: {
            commit: {
              type: 'commit',
              hash: 'a3c4e02c9a3755eccdc3764e6ea13facdf30f923',
            },
            selector: {
              type: 'custom',
              pattern: 'Deploy to production',
            },
            type: 'pipeline_ref_target',
            ref_name: 'master',
            ref_type: 'branch',
          },
        }),
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

  it('should trigger a custom pipeline with variables', async () => {
    const ctx = Object.assign({}, mockContext, {
      input: yaml.parse(examples[4].example).steps[0].input,
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
        body: JSON.stringify({
          target: {
            type: 'pipeline_ref_target',
            ref_name: 'master',
            ref_type: 'branch',
            selector: {
              type: 'custom',
              pattern: 'Deploy to production',
            },
          },
          variables: [
            { key: 'var1key', value: 'var1value', secured: true },
            {
              key: 'var2key',
              value: 'var2value',
            },
          ],
        }),
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

  it('should trigger a pull request pipeline', async () => {
    const ctx = Object.assign({}, mockContext, {
      input: yaml.parse(examples[5].example).steps[0].input,
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
        body: JSON.stringify({
          target: {
            type: 'pipeline_pullrequest_target',
            source: 'pull-request-branch',
            destination: 'master',
            destination_commit: {
              hash: '9f848b7',
            },
            commit: {
              hash: '1a372fc',
            },
            pull_request: {
              id: '3',
            },
            selector: {
              type: 'pull-requests',
              pattern: '**',
            },
          },
        }),
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
