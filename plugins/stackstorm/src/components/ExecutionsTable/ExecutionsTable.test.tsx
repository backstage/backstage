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
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import React from 'react';
import { Execution, StackstormApi, stackstormApiRef } from '../../api';
import { ExecutionsTable } from './ExecutionsTable';

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
    status: 'processing',
    start_timestamp: new Date().toISOString(),
    end_timestamp: new Date().toISOString(),
    result: {},
    parameters: {},
    elapsed_seconds: 2.2,
    log: [],
  },
  {
    id: '62fe101b11935b6aaff4ff93',
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

describe('ExecutionsTable', () => {
  const mockApi: jest.Mocked<StackstormApi> = {
    getExecutions: jest.fn().mockResolvedValue(executions),
    getExecutionHistoryUrl: jest
      .fn()
      .mockResolvedValue(
        'http://stackstorm.example.com:8080/?#/history/123abc',
      ),
  } as any;

  it('should render all executions', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[stackstormApiRef, mockApi]]}>
        <ExecutionsTable />
      </TestApiProvider>,
    );

    executions.forEach(e => {
      expect(getByText(e.id)).toBeInTheDocument();
      expect(getByText(e.action.ref)).toBeInTheDocument();
      expect(getByText(e.status)).toBeInTheDocument();
    });
  });
});
