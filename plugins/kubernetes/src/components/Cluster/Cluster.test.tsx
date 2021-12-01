/*
 * Copyright 2021 The Backstage Authors
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
import { wrapInTestApp } from '@backstage/test-utils';
import { Cluster } from './Cluster';

jest.mock('../../hooks');
import * as oneDeployment from '../../__fixtures__/1-deployments.json';

describe('Cluster', () => {
  it('render 1 cluster', async () => {
    const { getByText } = render(
      wrapInTestApp(
        <Cluster
          {...({
            clusterObjects: {
              cluster: {
                name: 'cluster-1',
              },
              resources: [
                {
                  type: 'deployments',
                  resources: oneDeployment.deployments,
                },
                {
                  type: 'replicasets',
                  resources: oneDeployment.replicaSets,
                },
                {
                  type: 'pods',
                  resources: oneDeployment.pods,
                },
              ],
              errors: [],
            },
            podsWithErrors: new Set<string>(),
          } as any)}
        />,
      ),
    );

    expect(getByText('cluster-1')).toBeInTheDocument();
    expect(getByText('10 pods')).toBeInTheDocument();
  });
});
