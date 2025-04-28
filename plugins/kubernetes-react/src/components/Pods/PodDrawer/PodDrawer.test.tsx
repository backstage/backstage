/*
 * Copyright 2020 The Backstage Authors
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

import { screen } from '@testing-library/react';
import {
  TestApiProvider,
  mockApis,
  renderInTestApp,
} from '@backstage/test-utils';
import '@testing-library/jest-dom';

import { PodDrawer } from './PodDrawer';
import { discoveryApiRef } from '@backstage/core-plugin-api';

jest.mock('../../../hooks/useIsPodExecTerminalSupported');

describe('PodDrawer', () => {
  it('Should show title and container names', async () => {
    const mockDiscoveryApi = mockApis.discovery();

    await renderInTestApp(
      <TestApiProvider apis={[[discoveryApiRef, mockDiscoveryApi]]}>
        <PodDrawer
          {...({
            open: true,
            podAndErrors: {
              cluster: { name: 'some-cluster-1' },
              pod: {
                metadata: {
                  name: 'some-pod',
                },
                spec: {
                  containers: [
                    {
                      name: 'some-container',
                    },
                  ],
                },
                status: {
                  podIP: '127.0.0.1',
                  containerStatuses: [
                    {
                      name: 'some-container',
                    },
                  ],
                },
              },
              errors: [
                {
                  type: 'some-error',
                  severity: 10,
                  message: 'some error message',
                  occurrenceCount: 1,
                  sourceRef: {
                    name: 'some-pod',
                    namespace: 'some-namespace',
                    kind: 'Pod',
                    apiGroup: 'v1',
                  },
                  proposedFix: [
                    {
                      type: 'logs',
                      container: 'some-container',
                      errorType: 'some error type',
                      rootCauseExplanation: 'some root cause',
                      actions: ['fix1', 'fix2'],
                    },
                  ],
                },
              ],
            },
          } as any)}
        />
      </TestApiProvider>,
    );

    expect(screen.getAllByText('some-pod')).toHaveLength(3);
    expect(screen.getByText('Pod (127.0.0.1)')).toBeInTheDocument();
    expect(screen.getByText('YAML')).toBeInTheDocument();
    expect(screen.getByText('Containers')).toBeInTheDocument();
    expect(screen.getByText('some-container')).toBeInTheDocument();
    expect(screen.getByText('some error message')).toBeInTheDocument();
  });
});
