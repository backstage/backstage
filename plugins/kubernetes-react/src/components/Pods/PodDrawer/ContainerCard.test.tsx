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
import React from 'react';

import { screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { renderInTestApp } from '@backstage/test-utils';
import { ContainerCard } from './ContainerCard';
import { DateTime } from 'luxon';

jest.mock('../../../hooks/useIsPodExecTerminalSupported');

const now = DateTime.now();
const oneHourAgo = now.minus({ hours: 1 }).toISO();
const twoHoursAgo = now.minus({ hours: 2 }).toISO();

describe('ContainerCard', () => {
  it('show healthy when all checks pass', async () => {
    await renderInTestApp(
      <ContainerCard
        {...({
          podScope: {
            name: 'some-name',
            namespace: 'some-namespace',
            cluster: { name: 'some-cluster' },
          },
          containerSpec: {
            readinessProbe: {},
            livenessProbe: {},
          },
          containerStatus: {
            name: 'some-name',
            image: 'gcr.io/some-proj/some-image',
            started: true,
            ready: true,
            restartCount: 0,
            state: {
              running: {
                startedAt: oneHourAgo,
              },
            },
          },
        } as any)}
      />,
    );
    expect(screen.getByText('Started: 1 hour ago')).toBeInTheDocument();
    expect(screen.getByText('Status: Running')).toBeInTheDocument();
    expect(screen.getByText('some-name')).toBeInTheDocument();
    expect(screen.getByText('gcr.io/some-proj/some-image')).toBeInTheDocument();
    expect(screen.getAllByText('✅')).toHaveLength(5);
    expect(screen.queryByText('❌')).toBeNull();
  });

  it('show unhealthy when all checks fail', async () => {
    await renderInTestApp(
      <ContainerCard
        {...({
          podScope: {
            podName: 'some-name',
            podNamespace: 'some-namespace',
            cluster: { name: 'some-cluster' },
          },
          containerSpec: {},
          containerStatus: {
            name: 'some-name',
            image: 'gcr.io/some-proj/some-image',
            started: false,
            ready: false,
            restartCount: 12,
            state: {
              waiting: {},
            },
          },
        } as any)}
      />,
    );
    expect(screen.getByText('some-name')).toBeInTheDocument();
    expect(screen.getByText('gcr.io/some-proj/some-image')).toBeInTheDocument();
    expect(screen.getAllByText('❌')).toHaveLength(5);
    expect(screen.queryByText('✅')).toBeNull();
  });

  it('show correct checks for completed container', async () => {
    await renderInTestApp(
      <ContainerCard
        {...({
          podScope: {
            podName: 'some-name',
            podNamespace: 'some-namespace',
            cluster: { name: 'some-cluster' },
          },
          containerSpec: {},
          containerStatus: {
            name: 'some-name',
            image: 'gcr.io/some-proj/some-image',
            started: false,
            ready: false,
            restartCount: 0,
            state: {
              terminated: {
                exitCode: 0,
                reason: 'Completed',
                startedAt: twoHoursAgo,
                finishedAt: oneHourAgo,
              },
            },
          },
        } as any)}
      />,
    );
    expect(screen.getByText('some-name')).toBeInTheDocument();
    expect(screen.getByText('gcr.io/some-proj/some-image')).toBeInTheDocument();
    expect(screen.getByText('Started: 2 hours ago')).toBeInTheDocument();
    expect(screen.getByText('Completed: 1 hour ago')).toBeInTheDocument();
    expect(
      screen.getByText('Execution time: 1 hour, 0 minutes, 0 seconds'),
    ).toBeInTheDocument();
    expect(screen.getByText('Status: Completed')).toBeInTheDocument();
    expect(screen.getAllByText('✅')).toHaveLength(2);
    expect(screen.queryByText('❌')).toBeNull();
  });
});
