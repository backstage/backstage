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

import React from 'react';
import { screen } from '@testing-library/react';
import * as pod from './__fixtures__/pod.json';
import * as crashingPod from './__fixtures__/crashing-pod.json';
import { renderInTestApp } from '@backstage/test-utils';
import { PodsTable, READY_COLUMNS, RESOURCE_COLUMNS } from './PodsTable';
import { kubernetesProviders } from '../../hooks/test-utils';
import { ClientPodStatus } from '@backstage/plugin-kubernetes-common';

describe('PodsTable', () => {
  it('should render pod', async () => {
    await renderInTestApp(<PodsTable pods={[pod as any]} />);

    // titles
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('phase')).toBeInTheDocument();
    expect(screen.getByText('status')).toBeInTheDocument();

    // values
    expect(screen.getByText('dice-roller-6c8646bfd-2m5hv')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('should render pod with extra columns', async () => {
    await renderInTestApp(
      <PodsTable pods={[pod as any]} extraColumns={[READY_COLUMNS]} />,
    );

    // titles
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('phase')).toBeInTheDocument();
    expect(screen.getByText('containers ready')).toBeInTheDocument();
    expect(screen.getByText('total restarts')).toBeInTheDocument();
    expect(screen.getByText('status')).toBeInTheDocument();

    // values
    expect(screen.getByText('dice-roller-6c8646bfd-2m5hv')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText('1/1')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('should render pod, with metrics context', async () => {
    const clusterToClientPodStatus = new Map<string, ClientPodStatus[]>();

    clusterToClientPodStatus.set('some-cluster', [
      {
        pod: {
          metadata: {
            name: 'dice-roller-6c8646bfd-2m5hv',
            namespace: 'default',
          },
        },
        memory: {
          currentUsage: '1069056',
          requestTotal: '67108864',
          limitTotal: '134217728',
        },
        cpu: {
          currentUsage: 0.4966115,
          requestTotal: 0.05,
          limitTotal: 0.05,
        },
      },
    ] as any);

    const wrapper = kubernetesProviders(
      undefined,
      undefined,
      clusterToClientPodStatus,
      {
        name: 'some-cluster',
      },
    );
    await renderInTestApp(
      wrapper(
        <PodsTable
          pods={[pod as any]}
          extraColumns={[READY_COLUMNS, RESOURCE_COLUMNS]}
        />,
      ),
    );

    // titles
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('phase')).toBeInTheDocument();
    expect(screen.getByText('containers ready')).toBeInTheDocument();
    expect(screen.getByText('total restarts')).toBeInTheDocument();
    expect(screen.getByText('status')).toBeInTheDocument();
    expect(screen.getByText('CPU usage %')).toBeInTheDocument();
    expect(screen.getByText('Memory usage %')).toBeInTheDocument();

    // values
    expect(screen.getByText('dice-roller-6c8646bfd-2m5hv')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText('1/1')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
    expect(screen.getByText('requests: 99% of 50m')).toBeInTheDocument();
    expect(screen.getByText('limits: 99% of 50m')).toBeInTheDocument();
    expect(screen.getByText('requests: 1% of 64MiB')).toBeInTheDocument();
    expect(screen.getByText('limits: 0% of 128MiB')).toBeInTheDocument();
  });

  it('should render placeholder when empty metrics context', async () => {
    const podNameToClientPodStatus = new Map<string, ClientPodStatus[]>();

    const wrapper = kubernetesProviders(
      undefined,
      undefined,
      podNameToClientPodStatus,
    );
    await renderInTestApp(
      wrapper(
        <PodsTable
          pods={[pod as any]}
          extraColumns={[READY_COLUMNS, RESOURCE_COLUMNS]}
        />,
      ),
    );

    // titles
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('phase')).toBeInTheDocument();
    expect(screen.getByText('containers ready')).toBeInTheDocument();
    expect(screen.getByText('total restarts')).toBeInTheDocument();
    expect(screen.getByText('status')).toBeInTheDocument();
    expect(screen.getByText('CPU usage %')).toBeInTheDocument();
    expect(screen.getByText('Memory usage %')).toBeInTheDocument();

    // values
    expect(screen.getByText('dice-roller-6c8646bfd-2m5hv')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText('1/1')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
    expect(screen.getAllByText('unknown')).toHaveLength(2);
  });

  it('should render crashing pod with extra columns', async () => {
    await renderInTestApp(
      <PodsTable pods={[crashingPod as any]} extraColumns={[READY_COLUMNS]} />,
    );

    // titles
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('phase')).toBeInTheDocument();
    expect(screen.getByText('containers ready')).toBeInTheDocument();
    expect(screen.getByText('total restarts')).toBeInTheDocument();
    expect(screen.getByText('status')).toBeInTheDocument();

    // values
    expect(
      screen.getByText('dice-roller-canary-7d64cd756c-55rfq'),
    ).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText('1/3')).toBeInTheDocument();
    expect(screen.getByText('76')).toBeInTheDocument();
    expect(screen.getByText('Container: side-car')).toBeInTheDocument();
    expect(screen.getByText('Container: other-side-car')).toBeInTheDocument();
    expect(screen.getAllByText('CrashLoopBackOff')).toHaveLength(2);
  });
});
