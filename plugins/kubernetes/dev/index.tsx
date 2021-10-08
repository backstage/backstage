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
  FetchResponse,
  ObjectsByEntityResponse,
} from '@backstage/plugin-kubernetes-common';
import fixture1 from '../src/__fixtures__/1-deployments.json';
import fixture2 from '../src/__fixtures__/2-deployments.json';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

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
        ({ type: type.toLocaleLowerCase('en-US'), resources } as FetchResponse),
    );
  }

  async getObjectsByEntity(): Promise<ObjectsByEntityResponse> {
    return {
      items: [
        {
          cluster: { name: 'mock-cluster' },
          resources: this.resources,
          errors: [],
        },
      ],
    };
  }

  async getClusters(): Promise<{ name: string; authProvider: string }[]> {
    return [{ name: 'mock-cluster', authProvider: 'serviceAccount' }];
  }
}

createDevApp()
  .addPage({
    path: '/fixture-1',
    title: 'Fixture 1',
    element: (
      <ApiProvider
        apis={ApiRegistry.with(
          kubernetesApiRef,
          new MockKubernetesClient(fixture1),
        )}
      >
        <EntityProvider entity={mockEntity}>
          <EntityKubernetesContent />
        </EntityProvider>
      </ApiProvider>
    ),
  })
  .addPage({
    path: '/fixture-2',
    title: 'Fixture 2',
    element: (
      <ApiProvider
        apis={ApiRegistry.with(
          kubernetesApiRef,
          new MockKubernetesClient(fixture2),
        )}
      >
        <EntityProvider entity={mockEntity}>
          <EntityKubernetesContent />
        </EntityProvider>
      </ApiProvider>
    ),
  })
  .registerPlugin(kubernetesPlugin)
  .render();
