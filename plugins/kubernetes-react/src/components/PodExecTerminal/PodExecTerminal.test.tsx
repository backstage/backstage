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

import { discoveryApiRef } from '@backstage/core-plugin-api';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
  textContentMatcher,
} from '@backstage/test-utils';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import WS from 'jest-websocket-mock';
import './matchMedia.mock';
import { PodExecTerminal } from './PodExecTerminal';

global.TextEncoder = require('util').TextEncoder;

const textEncoder = new TextEncoder();

describe('PodExecTerminal', () => {
  const cluster = { name: 'cluster1' };
  const containerName = 'container2';
  const podName = 'pod1';
  const podNamespace = 'podNamespace';

  const mockDiscoveryApi = mockApis.discovery();

  it('Should render an XTerm web terminal', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[discoveryApiRef, mockDiscoveryApi]]}>
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
        textContentMatcher('Starting terminal, please wait...'),
      ),
    ).resolves.toBeInTheDocument();
  });

  it('Should connect to WebSocket server & render response', async () => {
    const server = new WS(
      'ws://example.com/api/kubernetes/proxy/api/v1/namespaces/podNamespace/pods/pod1/exec?container=container2&stdin=true&stdout=true&stderr=true&tty=true&command=%2Fbin%2Fsh',
    );

    await renderInTestApp(
      <TestApiProvider apis={[[discoveryApiRef, mockDiscoveryApi]]}>
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
