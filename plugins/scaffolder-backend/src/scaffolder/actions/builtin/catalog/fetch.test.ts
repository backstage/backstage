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

import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { Entity } from '@backstage/catalog-model';
import { createFetchCatalogEntityAction } from './fetch';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';

describe('catalog:fetch', () => {
  const catalogClient = catalogServiceMock.mock();

  const action = createFetchCatalogEntityAction({
    catalogClient,
    auth: mockServices.auth(),
  });

  const credentials = mockCredentials.user();

  const token = mockCredentials.service.token({
    onBehalfOf: credentials,
    targetPluginId: 'catalog',
  });

  const mockContext = createMockActionContext({
    secrets: { backstageToken: token },
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('fetch single entity', () => {
    it('should return entity from catalog', async () => {
      catalogClient.getEntityByRef.mockResolvedValueOnce({
        metadata: {
          namespace: 'default',
          name: 'test',
        },
        kind: 'Component',
      } as Entity);

      await action.handler({
        ...mockContext,
        input: {
          entityRef: 'component:default/test',
        },
      });

      expect(catalogClient.getEntityByRef).toHaveBeenCalledWith(
        'component:default/test',
        {
          token,
        },
      );
      expect(mockContext.output).toHaveBeenCalledWith('entity', {
        metadata: {
          namespace: 'default',
          name: 'test',
        },
        kind: 'Component',
      });
    });

    it('should throw error if entity fetch fails from catalog and optional is false', async () => {
      catalogClient.getEntityByRef.mockImplementationOnce(() => {
        throw new Error('Not found');
      });

      await expect(
        action.handler({
          ...mockContext,
          input: {
            entityRef: 'component:default/test',
          },
        }),
      ).rejects.toThrow('Not found');

      expect(catalogClient.getEntityByRef).toHaveBeenCalledWith(
        'component:default/test',
        {
          token,
        },
      );
      expect(mockContext.output).not.toHaveBeenCalled();
    });

    it('should throw error if entity not in catalog and optional is false', async () => {
      catalogClient.getEntityByRef.mockResolvedValueOnce(null as any);

      await expect(
        action.handler({
          ...mockContext,
          input: {
            entityRef: 'component:default/test',
          },
        }),
      ).rejects.toThrow('Entity component:default/test not found');

      expect(catalogClient.getEntityByRef).toHaveBeenCalledWith(
        'component:default/test',
        {
          token,
        },
      );
      expect(mockContext.output).not.toHaveBeenCalled();
    });

    it('should use defaultKind and defaultNamespace if provided', async () => {
      const entity: Entity = {
        metadata: {
          namespace: 'ns',
          name: 'test',
        },
        kind: 'Group',
      } as Entity;
      catalogClient.getEntityByRef.mockResolvedValueOnce(entity);

      await action.handler({
        ...mockContext,
        input: {
          entityRef: 'test',
          defaultKind: 'Group',
          defaultNamespace: 'ns',
        },
      });

      expect(catalogClient.getEntityByRef).toHaveBeenCalledWith(
        'group:ns/test',
        {
          token,
        },
      );
      expect(mockContext.output).toHaveBeenCalledWith('entity', entity);
    });
  });

  describe('fetch multiple entities', () => {
    it('should return entities from catalog', async () => {
      catalogClient.getEntitiesByRefs.mockResolvedValueOnce({
        items: [
          {
            metadata: {
              namespace: 'default',
              name: 'test',
            },
            kind: 'Component',
          } as Entity,
        ],
      });

      await action.handler({
        ...mockContext,
        input: {
          entityRefs: ['component:default/test'],
        },
      });

      expect(catalogClient.getEntitiesByRefs).toHaveBeenCalledWith(
        { entityRefs: ['component:default/test'] },
        {
          token,
        },
      );
      expect(mockContext.output).toHaveBeenCalledWith('entities', [
        {
          metadata: {
            namespace: 'default',
            name: 'test',
          },
          kind: 'Component',
        },
      ]);
    });

    it('should throw error if undefined is returned for some entity', async () => {
      catalogClient.getEntitiesByRefs.mockResolvedValueOnce({
        items: [
          {
            metadata: {
              namespace: 'default',
              name: 'test',
            },
            kind: 'Component',
          } as Entity,
          undefined,
        ],
      });

      await expect(
        action.handler({
          ...mockContext,
          input: {
            entityRefs: ['component:default/test', 'component:default/test2'],
            optional: false,
          },
        }),
      ).rejects.toThrow('Entity component:default/test2 not found');

      expect(catalogClient.getEntitiesByRefs).toHaveBeenCalledWith(
        { entityRefs: ['component:default/test', 'component:default/test2'] },
        {
          token,
        },
      );
      expect(mockContext.output).not.toHaveBeenCalled();
    });

    it('should return null in case some of the entities not found and optional is true', async () => {
      catalogClient.getEntitiesByRefs.mockResolvedValueOnce({
        items: [
          {
            metadata: {
              namespace: 'default',
              name: 'test',
            },
            kind: 'Component',
          } as Entity,
          undefined,
        ],
      });

      await action.handler({
        ...mockContext,
        input: {
          entityRefs: ['component:default/test', 'component:default/test2'],
          optional: true,
        },
      });

      expect(catalogClient.getEntitiesByRefs).toHaveBeenCalledWith(
        { entityRefs: ['component:default/test', 'component:default/test2'] },
        {
          token,
        },
      );
      expect(mockContext.output).toHaveBeenCalledWith('entities', [
        {
          metadata: {
            namespace: 'default',
            name: 'test',
          },
          kind: 'Component',
        },
        null,
      ]);
    });

    it('should use defaultKind and defaultNamespace if provided', async () => {
      const entity1: Entity = {
        metadata: {
          namespace: 'ns',
          name: 'test',
        },
        kind: 'Group',
      } as Entity;
      const entity2: Entity = {
        metadata: {
          namespace: 'default',
          name: 'test',
        },
        kind: 'User',
      } as Entity;
      catalogClient.getEntitiesByRefs.mockResolvedValueOnce({
        items: [entity1, entity2],
      });

      await action.handler({
        ...mockContext,
        input: {
          entityRefs: ['test', 'user:default/test'],
          defaultKind: 'Group',
          defaultNamespace: 'ns',
        },
      });

      expect(catalogClient.getEntitiesByRefs).toHaveBeenCalledWith(
        { entityRefs: ['group:ns/test', 'user:default/test'] },
        {
          token,
        },
      );

      expect(mockContext.output).toHaveBeenCalledWith('entities', [
        entity1,
        entity2,
      ]);
    });
  });
});
