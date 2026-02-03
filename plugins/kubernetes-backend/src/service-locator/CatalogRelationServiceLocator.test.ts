/*
 * Copyright 2024 The Backstage Authors
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
import { Entity } from '@backstage/catalog-model';
import { ServiceLocatorRequestContext } from '@backstage/plugin-kubernetes-node';
import { CatalogRelationServiceLocator } from './CatalogRelationServiceLocator';

describe('CatalogRelationServiceLocator', () => {
  let serviceLocator: CatalogRelationServiceLocator;

  beforeEach(() => {
    // Mock the KubernetesClustersSupplier dependency
    const clusterSupplier = {
      getClusters: jest.fn().mockResolvedValue([
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
      ]),
    };

    serviceLocator = new CatalogRelationServiceLocator(clusterSupplier);
  });

  it('empty entity returns empty cluster details', async () => {
    const result = await serviceLocator.getClustersByEntity(
      {} as Entity,
      {} as ServiceLocatorRequestContext,
    );

    expect(result).toStrictEqual({ clusters: [] });
  });

  it('empty clusters returns empty cluster details', async () => {
    const crsl = new CatalogRelationServiceLocator({
      getClusters: async () => [],
    });

    const testEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      relations: [
        { type: 'dependsOn', targetRef: 'resource:default/cluster1' },
        { type: 'dependsOn', targetRef: 'resource:default/cluster2' },
        { type: 'ownedBy', targetRef: 'group:default/group1' },
      ],
      metadata: {
        namespace: 'default',
        name: 'testEntity',
      },
    };

    const result = await crsl.getClustersByEntity(
      testEntity,
      {} as ServiceLocatorRequestContext,
    );

    expect(result).toStrictEqual({ clusters: [] });
  });

  it('should return all referenced clusters when entity depends on multiple clusters', async () => {
    const testEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      relations: [
        { type: 'dependsOn', targetRef: 'resource:default/cluster1' },
        { type: 'dependsOn', targetRef: 'resource:default/cluster2' },
        { type: 'ownedBy', targetRef: 'group:default/group1' },
      ],
      metadata: {
        namespace: 'default',
        name: 'testEntity',
      },
    };

    const result = await serviceLocator.getClustersByEntity(
      testEntity,
      {} as ServiceLocatorRequestContext,
    );

    expect(result).toEqual({
      clusters: [
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
      ],
    });
  });

  it('should return one cluster when entity has one dependant cluster', async () => {
    const testEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      relations: [
        { type: 'dependsOn', targetRef: 'resource:default/cluster1' },
        { type: 'ownedBy', targetRef: 'group:default/group1' },
      ],
      metadata: {
        namespace: 'default',
        name: 'testEntity',
      },
    };

    const result = await serviceLocator.getClustersByEntity(
      testEntity,
      {} as ServiceLocatorRequestContext,
    );

    expect(result).toEqual({
      clusters: [
        {
          name: 'cluster1',
          url: 'http://localhost:8080',
          authMetadata: {},
        },
      ],
    });
  });

  it('should return an empty array when entity does not have dependsOn relation with resource target', async () => {
    const testEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      relations: [
        { type: 'dependsOn', targetRef: 'resource:default/database1' },
        { type: 'dependsOn', targetRef: 'resource:default/database2' },
        { type: 'ownedBy', targetRef: 'group:default/group1' },
      ],
      metadata: {
        namespace: 'default',
        name: 'testEntity',
      },
    };

    const result = await serviceLocator.getClustersByEntity(
      testEntity,
      {} as ServiceLocatorRequestContext,
    );

    expect(result).toEqual({
      clusters: [],
    });
  });
});
