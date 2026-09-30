/*
 * Copyright 2025 The Backstage Authors
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
import { createGetKubernetesResourcesForEntityAction } from './createGetKubernetesResourcesForEntityAction';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { KubernetesObjectsProvider } from '@backstage/plugin-kubernetes-node';
import { Entity } from '@backstage/catalog-model';
import { ObjectsByEntityResponse } from '@backstage/plugin-kubernetes-common';

const entityWithAnnotation: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'my-service',
    namespace: 'default',
    annotations: {
      'backstage.io/kubernetes-id': 'my-service',
    },
  },
  spec: { type: 'service', lifecycle: 'production', owner: 'team-a' },
};

const mockK8sResponse: ObjectsByEntityResponse = {
  items: [
    {
      cluster: { name: 'production' },
      resources: [
        {
          type: 'deployments',
          resources: [
            {
              apiVersion: 'apps/v1',
              kind: 'Deployment',
              metadata: { name: 'my-service', namespace: 'default' },
            },
          ],
        } as any,
      ],
      podMetrics: [],
      errors: [],
    },
  ],
};

function createMockObjectsProvider(
  response: ObjectsByEntityResponse = { items: [] },
): KubernetesObjectsProvider {
  return {
    getKubernetesObjectsByEntity: jest.fn().mockResolvedValue(response),
    getCustomResourcesByEntity: jest.fn(),
  };
}

describe('createGetKubernetesResourcesForEntityAction', () => {
  it('returns resources for an entity with a kubernetes-id annotation', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({
      entities: [entityWithAnnotation],
    });
    const objectsProvider = createMockObjectsProvider(mockK8sResponse);

    createGetKubernetesResourcesForEntityAction({
      objectsProvider,
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:get-kubernetes-resources-for-entity',
      input: { name: 'my-service' },
    });
    const output = result.output as { items: Array<Record<string, unknown>> };

    expect(output.items).toHaveLength(1);
    expect(output.items[0]).toMatchObject({
      cluster: { name: 'production' },
    });
    expect(objectsProvider.getKubernetesObjectsByEntity).toHaveBeenCalledWith(
      expect.objectContaining({ entity: entityWithAnnotation, auth: {} }),
      expect.any(Object),
    );
  });

  it('defaults kind to Component and namespace to default when omitted', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock.mock();
    mockCatalog.getEntityByRef.mockResolvedValue(entityWithAnnotation);
    const objectsProvider = createMockObjectsProvider();

    createGetKubernetesResourcesForEntityAction({
      objectsProvider,
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    await mockActionsRegistry.invoke({
      id: 'test:get-kubernetes-resources-for-entity',
      input: { name: 'my-service' },
    });

    expect(mockCatalog.getEntityByRef).toHaveBeenCalledWith(
      { kind: 'Component', namespace: 'default', name: 'my-service' },
      expect.any(Object),
    );
  });

  it('uses provided kind and namespace', async () => {
    const serviceEntity: Entity = {
      ...entityWithAnnotation,
      kind: 'Service',
      metadata: {
        ...entityWithAnnotation.metadata,
        name: 'my-worker',
        namespace: 'production',
      },
    };
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock.mock();
    mockCatalog.getEntityByRef.mockResolvedValue(serviceEntity);
    const objectsProvider = createMockObjectsProvider();

    createGetKubernetesResourcesForEntityAction({
      objectsProvider,
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    await mockActionsRegistry.invoke({
      id: 'test:get-kubernetes-resources-for-entity',
      input: { name: 'my-worker', kind: 'Service', namespace: 'production' },
    });

    expect(mockCatalog.getEntityByRef).toHaveBeenCalledWith(
      { kind: 'Service', namespace: 'production', name: 'my-worker' },
      expect.any(Object),
    );
  });

  it('throws NotFoundError when the entity does not exist in the catalog', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock();
    const objectsProvider = createMockObjectsProvider();

    createGetKubernetesResourcesForEntityAction({
      objectsProvider,
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:get-kubernetes-resources-for-entity',
        input: { name: 'does-not-exist' },
      }),
    ).rejects.toThrow(
      'Entity "component:default/does-not-exist" not found in the catalog',
    );
  });

  it('accepts entities with a kubernetes-label-selector annotation instead of kubernetes-id', async () => {
    const entityWithLabelSelector: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'selector-service',
        namespace: 'default',
        annotations: {
          'backstage.io/kubernetes-label-selector': 'app=selector-service',
        },
      },
      spec: { type: 'service', lifecycle: 'production', owner: 'team-a' },
    };
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({
      entities: [entityWithLabelSelector],
    });
    const objectsProvider = createMockObjectsProvider(mockK8sResponse);

    createGetKubernetesResourcesForEntityAction({
      objectsProvider,
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:get-kubernetes-resources-for-entity',
      input: { name: 'selector-service' },
    });
    const output = result.output as { items: Array<Record<string, unknown>> };

    expect(output.items).toHaveLength(1);
  });
});
