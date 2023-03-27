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

import { render } from '@testing-library/react';

import '@testing-library/jest-dom';
import { wrapInTestApp } from '@backstage/test-utils';
import { ContainerCard } from './ContainerCard';

describe('ContainerCard', () => {
  it('show healthy when all checks pass', async () => {
    const { getByText, queryByText, getAllByText } = render(
      wrapInTestApp(
        <ContainerCard
          {...({
            logContext: {
              name: 'some-name',
              namespace: 'some-namespace',
              clusterName: 'some-cluster',
            },
            containerSpec: {
              readinessProbe: {},
            },
            containerStatus: {
              name: 'some-name',
              image: 'gcr.io/some-proj/some-image',
              started: true,
              ready: true,
              restartCount: 0,
            },
          } as any)}
        />,
      ),
    );
    expect(getByText('some-name')).toBeInTheDocument();
    expect(getByText('gcr.io/some-proj/some-image')).toBeInTheDocument();
    expect(getAllByText('✅')).toHaveLength(5);
    expect(queryByText('❌')).toBeNull();
  });
  it('show unhealthy when all checks fail', async () => {
    const { getByText, queryByText, getAllByText } = render(
      wrapInTestApp(
        <ContainerCard
          {...({
            logContext: {
              podName: 'some-name',
              podNamespace: 'some-namespace',
              clusterName: 'some-cluster',
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
      ),
    );
    expect(getByText('some-name')).toBeInTheDocument();
    expect(getByText('gcr.io/some-proj/some-image')).toBeInTheDocument();
    expect(getAllByText('❌')).toHaveLength(5);
    expect(queryByText('✅')).toBeNull();
  });
});
