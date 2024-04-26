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
import { ConfigReader, UrlPatternDiscovery } from '@backstage/core-app-api';
import { MockFetchApi, setupRequestMockHandlers } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { StackstormClient } from './StackstormClient';
import { Action, Execution, Pack } from './types';

const server = setupServer();

const executions: Execution[] = [
  {
    id: '63dcac3e18ba00e09e7bb3b6',
    action: {
      name: 'post_message',
      ref: 'chatops.post_message',
      description: 'Post a message to stream for chatops',
      pack: 'chatops',
      runner_type: 'announcement',
      id: '62fe101b11935b6aaff4ff92',
    },
    status: 'succeeded',
    start_timestamp: new Date().toISOString(),
    end_timestamp: new Date().toISOString(),
    result: {},
    parameters: {},
    elapsed_seconds: 2.2,
    log: [],
  },
  {
    id: '63dcac3e18ba00e09e7bb3b6',
    action: {
      name: 'post_result',
      ref: 'chatops.post_result',
      description: 'Post an execution result to stream for chatops',
      pack: 'chatops',
      runner_type: 'orquesta',
      id: '62fe101b11935b6aaff4ff93',
    },
    status: 'succeeded',
    start_timestamp: new Date().toISOString(),
    end_timestamp: new Date().toISOString(),
    result: {},
    parameters: {},
    elapsed_seconds: 18.5,
    log: [],
  },
  {
    id: '63dcac3c9e0b4fe98f46becc',
    action: {
      name: 'run',
      ref: 'shell.run',
      description: 'Run shell script',
      pack: 'shell',
      runner_type: 'shell',
      id: '63736caac3d8557c4d61883a',
    },
    status: 'failed',
    start_timestamp: new Date().toISOString(),
    end_timestamp: new Date().toISOString(),
    result: {},
    parameters: {},
    elapsed_seconds: 5.0,
    log: [],
  },
];

const executionWithDetails: Execution = {
  id: '63dcac3e18ba00e09e7bb3b6',
  action: {
    name: 'post_message',
    ref: 'chatops.post_message',
    description: 'Post a message to stream for chatops',
    pack: 'chatops',
    runner_type: 'announcement',
    id: '62fe101b11935b6aaff4ff92',
  },
  status: 'succeeded',
  start_timestamp: new Date().toISOString(),
  end_timestamp: new Date().toISOString(),
  result: {
    output: {
      result: 'hello',
    },
  },
  parameters: {
    var: 'val',
  },
  elapsed_seconds: 2.2,
  log: [
    { status: 'requested', timestamp: new Date().toISOString() },
    { status: 'succeeded', timestamp: new Date().toISOString() },
  ],
};

const packs: Pack[] = [
  {
    ref: 'chatops',
    description: 'ChatOps integration pack',
    version: '3.7.0',
  },
  {
    ref: 'core',
    description: 'Basic core actions.',
    version: '3.7.0',
  },
];

const actions: Action[] = [
  {
    id: '62fe101b11935b6aaff4ff96',
    name: 'announcement',
    ref: 'core.announcement',
    pack: 'core',
    description:
      'Action that broadcasts the announcement to all stream consumers.',
    runner_type: 'announcement',
  },
  {
    id: '62fe101b11935b6aaff4ff97',
    name: 'echo',
    ref: 'core.echo',
    pack: 'core',
    description:
      'Action that executes the Linux echo command on the localhost.',
    runner_type: 'local-shell-cmd',
  },
];

describe('StackstormClient', () => {
  setupRequestMockHandlers(server);

  const mockBaseUrl = 'http://backstage:9191/api/proxy';
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);
  let client: StackstormClient;

  const setupHandlers = () => {
    server.use(
      rest.get(`${mockBaseUrl}/stackstorm/executions`, (req, res, ctx) => {
        const limit = req.url.searchParams.get('limit')
          ? Number(req.url.searchParams.get('limit'))
          : executions.length;
        const offset = req.url.searchParams.get('offset')
          ? Number(req.url.searchParams.get('offset'))
          : 0;
        return res(ctx.json(executions.slice(offset, offset + limit)));
      }),
      rest.get(
        `${mockBaseUrl}/stackstorm/executions/63dcac3e18ba00e09e7bb3b6`,
        (_req, res, ctx) => {
          return res(ctx.json(executionWithDetails));
        },
      ),
      rest.get(`${mockBaseUrl}/stackstorm/packs`, (_req, res, ctx) => {
        return res(ctx.json(packs));
      }),
      rest.get(`${mockBaseUrl}/stackstorm/actions`, (req, res, ctx) => {
        const name = req.url.searchParams.get('pack');
        return res(ctx.json(name === 'core' ? actions : []));
      }),
    );
  };

  beforeEach(() => {
    setupHandlers();
    client = StackstormClient.fromConfig(
      new ConfigReader({
        stackstorm: {
          webUrl: 'http://stackstorm.example.com:8080',
        },
      }),
      {
        discoveryApi: discoveryApi,
        fetchApi: new MockFetchApi(),
      },
    );
  });

  it('getExecutions should return executions with emulated pagination', async () => {
    const got = await client.getExecutions(2, 1);
    expect(got.length).toEqual(2);
    expect(got).toMatchObject(executions.slice(1, 3));
  });

  it('getExecution should return one execution', async () => {
    const got = await client.getExecution('63dcac3e18ba00e09e7bb3b6');
    expect(got).toMatchObject(executionWithDetails);
  });

  it('getPacks should return list of all packs', async () => {
    const got = await client.getPacks();
    expect(got.length).toEqual(packs.length);
    expect(got).toMatchObject(packs);
  });

  it('getActions should return list of actions', async () => {
    const got = await client.getActions('core');
    expect(got).toMatchObject(actions);
  });

  it('getExecutionHistoryUrl should return webUrl for executions', async () => {
    const got = client.getExecutionHistoryUrl('123abc');
    expect(got).toEqual('http://stackstorm.example.com:8080/?#/history/123abc');
  });

  it('getActionUrl should return webUrl for action', async () => {
    const got = client.getActionUrl('core.shell');
    expect(got).toEqual(
      'http://stackstorm.example.com:8080/?#/actions/core.shell',
    );
  });
});
