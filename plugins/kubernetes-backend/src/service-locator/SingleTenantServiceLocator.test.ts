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

import '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { ServiceLocatorRequestContext } from '../types/types';
import { SingleTenantServiceLocator } from './SingleTenantServiceLocator';

describe('SingleTenantConfigClusterLocator', () => {
  it('empty clusters returns empty cluster details', async () => {
    const sut = new SingleTenantServiceLocator({
      getClusters: async () => [],
    });

    const result = await sut.getClustersByEntity(
      {} as Entity,
      {} as ServiceLocatorRequestContext,
    );

    expect(result).toStrictEqual({ clusters: [] });
  });

  it('one cluster return from two clusters', async () => {
    const sut = new SingleTenantServiceLocator({
      getClusters: async () => {
        return [
          {
            name: 'cluster1',
            url: 'http://localhost:8080',
            authMetadata: {},
          },
          {
            name: 'cluster2',
            url: 'http://localhost:8081',
            authMetadata: {},
          },
        ];
      },
    });

    const testEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        namespace: 'default',
        name: 'testEntity',
        annotations: {
          'backstage.io/kubernetes-cluster': 'cluster1',
        },
      },
    };

    const result = await sut.getClustersByEntity(
      testEntity as Entity,
      {} as ServiceLocatorRequestContext,
    );

    expect(result).toStrictEqual({
      clusters: [
        {
          name: 'cluster1',
          url: 'http://localhost:8080',
          authMetadata: {},
        },
      ],
    });
  });

  it('no annotation return all cluster', async () => {
    const definedClusters = [
      {
        name: 'cluster1',
        url: 'http://localhost:8080',
        authMetadata: {},
      },
      {
        name: 'cluster2',
        url: 'http://localhost:8081',
        authMetadata: {},
      },
    ];

    const sut = new SingleTenantServiceLocator({
      getClusters: async () => {
        return definedClusters;
      },
    });

    const result = await sut.getClustersByEntity(
      {} as Entity,
      {} as ServiceLocatorRequestContext,
    );

    expect(result).toStrictEqual({
      clusters: definedClusters,
    });
  });

  it('wrong annotation returns empty cluster', async () => {
    const sut = new SingleTenantServiceLocator({
      getClusters: async () => {
        return [
          {
            name: 'cluster1',
            url: 'http://localhost:8080',
            authMetadata: {},
          },
          {
            name: 'cluster2',
            url: 'http://localhost:8081',
            authMetadata: {},
          },
        ];
      },
    });

    const testEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        namespace: 'default',
        name: 'testEntity',
        annotations: {
          'backstage.io/kubernetes-cluster': 'cluster3',
        },
      },
    };

    const result = await sut.getClustersByEntity(
      testEntity as Entity,
      {} as ServiceLocatorRequestContext,
    );

    expect(result).toStrictEqual({
      clusters: [],
    });
  });
});
