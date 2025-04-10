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
import { ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { PodMetricsContext, usePodMetrics } from './usePodMetrics';
import { ClientPodStatus } from '@backstage/plugin-kubernetes-common';

describe('usePodMetrics', () => {
  const clientPodStatus = {
    pod: {
      metadata: {
        name: 'some-pod',
        namespace: 'some-namespace',
      },
    },
    cpu: {},
    memory: {},
    containers: [],
  } as any;
  const otherClientPodStatus = {
    pod: {
      metadata: {
        name: 'some-other-pod',
        namespace: 'some-namespace',
      },
    },
    cpu: {},
    memory: {},
    containers: [],
  } as any;
  it('should filter non-matching ClientPodStatus', () => {
    const metrics = new Map<string, ClientPodStatus[]>();
    metrics.set('cluster', [clientPodStatus]);
    metrics.set('other-cluster', [otherClientPodStatus]);
    const wrapper = ({ children }: { children: ReactNode }) => (
      <PodMetricsContext.Provider value={metrics}>
        {children}
      </PodMetricsContext.Provider>
    );

    const { result } = renderHook(
      () =>
        usePodMetrics('cluster', {
          metadata: {
            name: 'some-pod',
            namespace: 'some-namespace',
          },
        }),
      { wrapper },
    );
    expect(result.current).toStrictEqual(clientPodStatus);
  });
});
