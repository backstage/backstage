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

import { discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import {
  mockApis,
  MockFetchApi,
  renderInTestApp,
  TestApiProvider,
  textContentMatcher,
} from '@backstage/test-utils';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import WS from 'jest-websocket-mock';
import './matchMedia.mock';
import { PodExecTerminal } from './PodExecTerminal';

global.TextEncoder = require('node:util').TextEncoder;

const textEncoder = new TextEncoder();

describe('PodExecTerminal', () => {
  const cluster = { name: 'cluster1' };
  const containerName = 'container2';
  const podName = 'pod1';
  const podNamespace = 'podNamespace';

  const mockDiscoveryApi = mockApis.discovery();
  const execPath =
    '/proxy/api/v1/namespaces/podNamespace/pods/pod1/exec?container=container2&stdin=true&stdout=true&stderr=true&tty=true&command=%2Fbin%2Fsh';

  it('shows a permission denied message when the proxy rejects exec access', async () => {
    const mockFetchApi = new MockFetchApi({
      baseImplementation: jest.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: { name: 'NotAllowedError' } }), {
          status: 403,
        }),
      ),
    });

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [discoveryApiRef, mockDiscoveryApi],
          [fetchApiRef, mockFetchApi],
        ]}
      >
        <PodExecTerminal
          cluster={cluster}
          containerName={containerName}
          podName={podName}
          podNamespace={podNamespace}
        />
      </TestApiProvider>,
    );

    await expect(
      screen.findByText(
        textContentMatcher(
          'You are not allowed to open a terminal for this pod. Contact your portal administrator if you need access.',
        ),
      ),
    ).resolves.toBeInTheDocument();

    expect(mockFetchApi.fetch).toHaveBeenCalledWith(
      `http://example.com/api/kubernetes${execPath}`,
      expect.objectContaining({
        headers: expect.objectContaining({
          'Backstage-Kubernetes-Cluster': 'cluster1',
        }),
      }),
    );
  });

  it('Should connect to WebSocket server & render response', async () => {
    const mockFetchApi = new MockFetchApi({
      baseImplementation: jest
        .fn()
        .mockResolvedValue(
          new Response('Upgrade request required', { status: 400 }),
        ),
    });

    const server = new WS(`ws://example.com/api/kubernetes${execPath}`);

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [discoveryApiRef, mockDiscoveryApi],
          [fetchApiRef, mockFetchApi],
        ]}
      >
        <PodExecTerminal
          cluster={cluster}
          containerName={containerName}
          podName={podName}
          podNamespace={podNamespace}
        />
      </TestApiProvider>,
    );

    // xterm uses a "W" character as a "measure element" -- if it exists, the terminal rendered correctly
    await expect(
      screen.findByText(textContentMatcher('W')),
    ).resolves.toBeInTheDocument();

    await server.connected;

    const { buffer } = Uint8Array.from([
      1,
      ...textEncoder.encode('hello world'),
    ]);

    server.send(buffer);

    await expect(
      screen.findByText(textContentMatcher('hello world')),
    ).resolves.toBeInTheDocument();
  });
});
