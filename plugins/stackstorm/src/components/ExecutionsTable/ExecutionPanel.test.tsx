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
import { ExecutionPanel } from './ExecutionPanel';

const execution: Execution = {
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
      result: 'hello world!',
    },
  },
  parameters: {
    var: 'my funky partameter',
  },
  elapsed_seconds: 2.2,
  log: [
    { status: 'requested', timestamp: new Date().toISOString() },
    { status: 'succeeded', timestamp: new Date().toISOString() },
  ],
};

describe('ExecutionPanel', () => {
  const mockApi: jest.Mocked<StackstormApi> = {
    getExecution: jest.fn().mockResolvedValue(execution),
    getExecutionHistoryUrl: jest
      .fn()
      .mockResolvedValue(
        'http://stackstorm.example.com:8080/?#/history/63dcac3e18ba00e09e7bb3b6',
      ),
  } as any;

  it('should render execution details', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[stackstormApiRef, mockApi]]}>
        <ExecutionPanel id="63dcac3e18ba00e09e7bb3b6" />
      </TestApiProvider>,
    );

    expect(getByText(execution.id)).toBeInTheDocument();
    expect(getByText(execution.status)).toBeInTheDocument();
    expect(getByText('"hello world!"')).toBeInTheDocument();
    expect(getByText('"my funky partameter"')).toBeInTheDocument();
  });
});
