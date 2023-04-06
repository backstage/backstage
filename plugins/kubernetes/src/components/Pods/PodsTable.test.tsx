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
import { render } from '@testing-library/react';
import * as pod from './__fixtures__/pod.json';
import * as crashingPod from './__fixtures__/crashing-pod.json';
import { wrapInTestApp } from '@backstage/test-utils';
import { PodsTable, READY_COLUMNS, RESOURCE_COLUMNS } from './PodsTable';
import { kubernetesProviders } from '../../hooks/test-utils';
import { ClientPodStatus } from '@backstage/plugin-kubernetes-common';

describe('PodsTable', () => {
  it('should render pod', async () => {
    const { getByText } = render(
      wrapInTestApp(<PodsTable pods={[pod as any]} />),
    );

    // titles
    expect(getByText('name')).toBeInTheDocument();
    expect(getByText('phase')).toBeInTheDocument();
    expect(getByText('status')).toBeInTheDocument();

    // values
    expect(getByText('dice-roller-6c8646bfd-2m5hv')).toBeInTheDocument();
    expect(getByText('Running')).toBeInTheDocument();
    expect(getByText('OK')).toBeInTheDocument();
  });

  it('should render pod with extra columns', async () => {
    const { getByText } = render(
      wrapInTestApp(
        <PodsTable pods={[pod as any]} extraColumns={[READY_COLUMNS]} />,
      ),
    );

    // titles
    expect(getByText('name')).toBeInTheDocument();
    expect(getByText('phase')).toBeInTheDocument();
    expect(getByText('containers ready')).toBeInTheDocument();
    expect(getByText('total restarts')).toBeInTheDocument();
    expect(getByText('status')).toBeInTheDocument();

    // values
    expect(getByText('dice-roller-6c8646bfd-2m5hv')).toBeInTheDocument();
    expect(getByText('Running')).toBeInTheDocument();
    expect(getByText('1/1')).toBeInTheDocument();
    expect(getByText('0')).toBeInTheDocument();
    expect(getByText('OK')).toBeInTheDocument();
  });
  it('should render pod, with metrics context', async () => {
    const podNameToClientPodStatus = new Map<string, ClientPodStatus>();

    podNameToClientPodStatus.set('dice-roller-6c8646bfd-2m5hv', {
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
    } as any);

    const wrapper = kubernetesProviders(
      undefined,
      undefined,
      podNameToClientPodStatus,
    );
    const { getByText } = render(
      wrapper(
        wrapInTestApp(
          <PodsTable
            pods={[pod as any]}
            extraColumns={[READY_COLUMNS, RESOURCE_COLUMNS]}
          />,
        ),
      ),
    );

    // titles
    expect(getByText('name')).toBeInTheDocument();
    expect(getByText('phase')).toBeInTheDocument();
    expect(getByText('containers ready')).toBeInTheDocument();
    expect(getByText('total restarts')).toBeInTheDocument();
    expect(getByText('status')).toBeInTheDocument();
    expect(getByText('CPU usage %')).toBeInTheDocument();
    expect(getByText('Memory usage %')).toBeInTheDocument();

    // values
    expect(getByText('dice-roller-6c8646bfd-2m5hv')).toBeInTheDocument();
    expect(getByText('Running')).toBeInTheDocument();
    expect(getByText('1/1')).toBeInTheDocument();
    expect(getByText('0')).toBeInTheDocument();
    expect(getByText('OK')).toBeInTheDocument();
    expect(getByText('requests: 99% of 50m')).toBeInTheDocument();
    expect(getByText('limits: 99% of 50m')).toBeInTheDocument();
    expect(getByText('requests: 1% of 64MiB')).toBeInTheDocument();
    expect(getByText('limits: 0% of 128MiB')).toBeInTheDocument();
  });
  it('should render placehoplder when empty metrics context', async () => {
    const podNameToClientPodStatus = new Map<string, ClientPodStatus>();

    const wrapper = kubernetesProviders(
      undefined,
      undefined,
      podNameToClientPodStatus,
    );
    const { getByText, getAllByText } = render(
      wrapper(
        wrapInTestApp(
          <PodsTable
            pods={[pod as any]}
            extraColumns={[READY_COLUMNS, RESOURCE_COLUMNS]}
          />,
        ),
      ),
    );

    // titles
    expect(getByText('name')).toBeInTheDocument();
    expect(getByText('phase')).toBeInTheDocument();
    expect(getByText('containers ready')).toBeInTheDocument();
    expect(getByText('total restarts')).toBeInTheDocument();
    expect(getByText('status')).toBeInTheDocument();
    expect(getByText('CPU usage %')).toBeInTheDocument();
    expect(getByText('Memory usage %')).toBeInTheDocument();

    // values
    expect(getByText('dice-roller-6c8646bfd-2m5hv')).toBeInTheDocument();
    expect(getByText('Running')).toBeInTheDocument();
    expect(getByText('1/1')).toBeInTheDocument();
    expect(getByText('0')).toBeInTheDocument();
    expect(getByText('OK')).toBeInTheDocument();
    expect(getAllByText('unknown')).toHaveLength(2);
  });
  it('should render crashing pod with extra columns', async () => {
    const { getByText, getAllByText } = render(
      wrapInTestApp(
        <PodsTable
          pods={[crashingPod as any]}
          extraColumns={[READY_COLUMNS]}
        />,
      ),
    );

    // titles
    expect(getByText('name')).toBeInTheDocument();
    expect(getByText('phase')).toBeInTheDocument();
    expect(getByText('containers ready')).toBeInTheDocument();
    expect(getByText('total restarts')).toBeInTheDocument();
    expect(getByText('status')).toBeInTheDocument();

    // values
    expect(
      getByText('dice-roller-canary-7d64cd756c-55rfq'),
    ).toBeInTheDocument();
    expect(getByText('Running')).toBeInTheDocument();
    expect(getByText('1/3')).toBeInTheDocument();
    expect(getByText('76')).toBeInTheDocument();
    expect(getByText('Container: side-car')).toBeInTheDocument();
    expect(getByText('Container: other-side-car')).toBeInTheDocument();
    expect(getAllByText('CrashLoopBackOff')).toHaveLength(2);
  });
});
