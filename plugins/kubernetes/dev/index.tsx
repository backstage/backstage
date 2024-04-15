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
import { Entity } from '@backstage/catalog-model';
import { createDevApp } from '@backstage/dev-utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import {
  EntityKubernetesContent,
  kubernetesPlugin,
  kubernetesApiRef,
  KubernetesApi,
} from '../src';
import {
  CustomObjectsByEntityRequest,
  FetchResponse,
  ObjectsByEntityResponse,
  WorkloadsByEntityRequest,
} from '@backstage/plugin-kubernetes-common';
import fixture1 from '../src/__fixtures__/1-deployments.json';
import fixture2 from '../src/__fixtures__/2-deployments.json';
import fixture3 from '../src/__fixtures__/1-cronjobs.json';
import fixture4 from '../src/__fixtures__/2-cronjobs.json';
import { TestApiProvider } from '@backstage/test-utils';

const mockEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'backstage',
    description: 'backstage.io',
    annotations: {
      'backstage.io/kubernetes-id': 'dice-roller',
    },
  },
  spec: {
    lifecycle: 'production',
    type: 'service',
    owner: 'user:guest',
  },
};

class MockKubernetesClient implements KubernetesApi {
  readonly resources: FetchResponse[];

  constructor(fixtureData: { [resourceType: string]: any[] }) {
    this.resources = Object.entries(fixtureData).flatMap(
      ([type, resources]) =>
        ({ type: type.toLocaleLowerCase('en-US'), resources }) as FetchResponse,
    );
  }
  async getPodLogs(_request: {
    podName: string;
    namespace: string;
    clusterName: string;
    containerName: string;
    token: string;
  }): Promise<string> {
    return await 'some logs';
  }
  async getWorkloadsByEntity(
    _request: WorkloadsByEntityRequest,
  ): Promise<ObjectsByEntityResponse> {
    return {
      items: [
        {
          cluster: { name: 'mock-cluster' },
          resources: this.resources,
          podMetrics: [],
          errors: [],
        },
      ],
    };
  }
  async getCustomObjectsByEntity(
    _request: CustomObjectsByEntityRequest,
  ): Promise<ObjectsByEntityResponse> {
    return {
      items: [
        {
          cluster: { name: 'mock-cluster' },
          resources: this.resources,
          podMetrics: [],
          errors: [],
        },
      ],
    };
  }

  async getObjectsByEntity(): Promise<ObjectsByEntityResponse> {
    return {
      items: [
        {
          cluster: { name: 'mock-cluster' },
          resources: this.resources,
          podMetrics: [],
          errors: [],
        },
      ],
    };
  }

  async getClusters(): Promise<{ name: string; authProvider: string }[]> {
    return [{ name: 'mock-cluster', authProvider: 'serviceAccount' }];
  }

  async getCluster(
    _clusterName: string,
  ): Promise<{ name: string; authProvider: string }> {
    return { name: 'mock-cluster', authProvider: 'serviceAccount' };
  }

  async proxy(_options: { clusterName: String; path: String }): Promise<any> {
    return {
      kind: 'Namespace',
      apiVersion: 'v1',
      metadata: {
        name: 'mock-ns',
      },
    };
  }
}

createDevApp()
  .addPage({
    path: '/fixture-1',
    title: 'Fixture 1',
    element: (
      <TestApiProvider
        apis={[[kubernetesApiRef, new MockKubernetesClient(fixture1)]]}
      >
        <EntityProvider entity={mockEntity}>
          <EntityKubernetesContent />
        </EntityProvider>
      </TestApiProvider>
    ),
  })
  .addPage({
    path: '/fixture-2',
    title: 'Fixture 2',
    element: (
      <TestApiProvider
        apis={[[kubernetesApiRef, new MockKubernetesClient(fixture2)]]}
      >
        <EntityProvider entity={mockEntity}>
          <EntityKubernetesContent />
        </EntityProvider>
      </TestApiProvider>
    ),
  })
  .addPage({
    path: '/fixture-3',
    title: 'Fixture 3',
    element: (
      <TestApiProvider
        apis={[[kubernetesApiRef, new MockKubernetesClient(fixture3)]]}
      >
        <EntityProvider entity={mockEntity}>
          <EntityKubernetesContent />
        </EntityProvider>
      </TestApiProvider>
    ),
  })
  .addPage({
    path: '/fixture-4',
    title: 'Fixture 4',
    element: (
      <TestApiProvider
        apis={[[kubernetesApiRef, new MockKubernetesClient(fixture4)]]}
      >
        <EntityProvider entity={mockEntity}>
          <EntityKubernetesContent />
        </EntityProvider>
      </TestApiProvider>
    ),
  })
  .registerPlugin(kubernetesPlugin)
  .render();
