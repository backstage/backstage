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
import { screen } from '@testing-library/react';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { KubernetesContent } from './KubernetesContent';
import { useKubernetesObjects } from '@backstage/plugin-kubernetes-react';
import * as oneDeployment from './__fixtures__/1-deployments.json';
import * as twoDeployments from './__fixtures__/2-deployments.json';
import { permissionApiRef } from '@backstage/plugin-permission-react';

jest.mock('@backstage/plugin-kubernetes-react', () => ({
  ...jest.requireActual('@backstage/plugin-kubernetes-react'),
  useKubernetesObjects: jest.fn(),
}));

describe('KubernetesContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('render empty response', async () => {
    (useKubernetesObjects as any).mockReturnValue({
      kubernetesObjects: {
        items: [],
      },
      error: undefined,
    });
    await renderInTestApp(
      <TestApiProvider apis={[[permissionApiRef, mockApis.permission()]]}>
        <KubernetesContent
          entity={
            {
              metadata: {
                name: 'some-entity',
              },
            } as any
          }
        />
      </TestApiProvider>,
    );
    expect(screen.getByText('Your Clusters')).toBeInTheDocument();
    // TODO add a prompt for the user to configure their clusters
  });

  it('render 1 cluster happy path', async () => {
    (useKubernetesObjects as any).mockReturnValue({
      kubernetesObjects: {
        items: [
          {
            cluster: { name: 'cluster-1' },
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
            podMetrics: [],
            errors: [],
          },
        ],
      },
      error: undefined,
    });
    await renderInTestApp(
      <TestApiProvider apis={[[permissionApiRef, mockApis.permission()]]}>
        <KubernetesContent
          entity={
            {
              metadata: {
                name: 'some-entity',
              },
            } as any
          }
        />
      </TestApiProvider>,
    );

    expect(screen.getByText('cluster-1')).toBeInTheDocument();
    expect(screen.getByText('Cluster')).toBeInTheDocument();
    expect(screen.getByText('10 pods')).toBeInTheDocument();
    expect(screen.getByText('No pods with errors')).toBeInTheDocument();
  });

  it('render 2 clusters happy path, one with errors', async () => {
    (useKubernetesObjects as any).mockReturnValue({
      kubernetesObjects: {
        items: [
          {
            cluster: { name: 'cluster-1' },
            resources: [
              {
                type: 'deployments',
                resources: [twoDeployments.deployments[1]],
              },
              {
                type: 'replicasets',
                resources: twoDeployments.replicaSets,
              },
              {
                type: 'pods',
                resources: twoDeployments.pods,
              },
            ],
            podMetrics: [],
            errors: [],
          },
          {
            cluster: { name: 'cluster-a' },
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
            podMetrics: [],
            errors: [],
          },
        ],
      },
      error: undefined,
    });
    await renderInTestApp(
      <TestApiProvider apis={[[permissionApiRef, mockApis.permission()]]}>
        <KubernetesContent
          entity={
            {
              metadata: {
                name: 'some-entity',
              },
            } as any
          }
        />
      </TestApiProvider>,
    );
    expect(screen.getAllByText('Cluster')).toHaveLength(2);
    expect(screen.getByText('cluster-a')).toBeInTheDocument();
    expect(screen.getByText('10 pods')).toBeInTheDocument();
    expect(screen.getByText('No pods with errors')).toBeInTheDocument();

    expect(screen.getAllByText('cluster-1')).toHaveLength(6);
    expect(screen.getByText('12 pods')).toBeInTheDocument();
    expect(screen.getByText('2 pods with errors')).toBeInTheDocument();
  });
});
