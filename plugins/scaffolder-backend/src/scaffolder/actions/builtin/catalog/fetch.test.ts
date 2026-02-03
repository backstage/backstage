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
import { mockCredentials } from '@backstage/backend-test-utils';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';

describe('catalog:fetch', () => {
  const component = {
    kind: 'Component',
    metadata: {
      name: 'test',
      namespace: 'default',
    },
  } as Entity;

  const credentials = mockCredentials.user();

  const mockContext = createMockActionContext();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('fetch single entity', () => {
    it('should return entity from catalog', async () => {
      const catalogMock = catalogServiceMock({ entities: [component] });
      jest.spyOn(catalogMock, 'getEntityByRef');

      const action = createFetchCatalogEntityAction({
        catalog: catalogMock,
      });

      await action.handler({
        ...mockContext,
        input: {
          entityRef: 'component:default/test',
        },
      });

      expect(catalogMock.getEntityByRef).toHaveBeenCalledWith(
        'component:default/test',
        { credentials },
      );
      expect(mockContext.output).toHaveBeenCalledWith('entity', component);
    });

    it('should throw error if entity fetch fails from catalog and optional is false', async () => {
      const catalogMock = catalogServiceMock.mock({
        getEntityByRef: () => Promise.reject(new Error('Not found')),
      });

      const action = createFetchCatalogEntityAction({
        catalog: catalogMock,
      });

      await expect(
        action.handler({
          ...mockContext,
          input: {
            entityRef: 'component:default/test',
          },
        }),
      ).rejects.toThrow('Not found');

      expect(catalogMock.getEntityByRef).toHaveBeenCalledWith(
        'component:default/test',
        { credentials },
      );
      expect(mockContext.output).not.toHaveBeenCalled();
    });

    it('should throw error if entity not in catalog and optional is false', async () => {
      const catalogMock = catalogServiceMock({ entities: [] });
      jest.spyOn(catalogMock, 'getEntityByRef');

      const action = createFetchCatalogEntityAction({
        catalog: catalogMock,
      });

      await expect(
        action.handler({
          ...mockContext,
          input: {
            entityRef: 'component:default/test',
          },
        }),
      ).rejects.toThrow('Entity component:default/test not found');

      expect(catalogMock.getEntityByRef).toHaveBeenCalledWith(
        'component:default/test',
        { credentials },
      );
      expect(mockContext.output).not.toHaveBeenCalled();
    });

    it('should use defaultKind and defaultNamespace if provided', async () => {
      const entity = {
        kind: 'Group',
        metadata: {
          name: 'test',
          namespace: 'ns',
        },
      } as Entity;

      const catalogMock = catalogServiceMock({ entities: [entity] });
      jest.spyOn(catalogMock, 'getEntityByRef');

      const action = createFetchCatalogEntityAction({
        catalog: catalogMock,
      });

      await action.handler({
        ...mockContext,
        input: {
          entityRef: 'test',
          defaultKind: 'Group',
          defaultNamespace: 'ns',
        },
      });

      expect(catalogMock.getEntityByRef).toHaveBeenCalledWith('group:ns/test', {
        credentials,
      });

      expect(mockContext.output).toHaveBeenCalledWith('entity', entity);
    });
  });

  describe('fetch multiple entities', () => {
    it('should return entities from catalog', async () => {
      const catalogMock = catalogServiceMock({ entities: [component] });
      jest.spyOn(catalogMock, 'getEntitiesByRefs');

      const action = createFetchCatalogEntityAction({
        catalog: catalogMock,
      });

      await action.handler({
        ...mockContext,
        input: {
          entityRefs: ['component:default/test'],
        },
      });

      expect(catalogMock.getEntitiesByRefs).toHaveBeenCalledWith(
        { entityRefs: ['component:default/test'] },
        { credentials },
      );
      expect(mockContext.output).toHaveBeenCalledWith('entities', [component]);
    });

    it('should throw error if undefined is returned for some entity', async () => {
      const catalogMock = catalogServiceMock({ entities: [component] });
      jest.spyOn(catalogMock, 'getEntitiesByRefs');
      const action = createFetchCatalogEntityAction({
        catalog: catalogMock,
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

      expect(catalogMock.getEntitiesByRefs).toHaveBeenCalledWith(
        {
          entityRefs: ['component:default/test', 'component:default/test2'],
        },
        { credentials },
      );
      expect(mockContext.output).not.toHaveBeenCalled();
    });

    it('should return null in case some of the entities not found and optional is true', async () => {
      const catalogMock = catalogServiceMock({ entities: [component] });
      jest.spyOn(catalogMock, 'getEntitiesByRefs');

      const action = createFetchCatalogEntityAction({
        catalog: catalogMock,
      });

      await action.handler({
        ...mockContext,
        input: {
          entityRefs: ['component:default/test', 'component:default/test2'],
          optional: true,
        },
      });

      expect(catalogMock.getEntitiesByRefs).toHaveBeenCalledWith(
        { entityRefs: ['component:default/test', 'component:default/test2'] },
        { credentials },
      );
      expect(mockContext.output).toHaveBeenCalledWith('entities', [
        component,
        null,
      ]);
    });

    it('should use defaultKind and defaultNamespace if provided', async () => {
      const entity1 = {
        metadata: {
          namespace: 'ns',
          name: 'test',
        },
        kind: 'Group',
      } as Entity;
      const entity2 = {
        metadata: {
          namespace: 'default',
          name: 'test',
        },
        kind: 'User',
      } as Entity;

      const catalogMock = catalogServiceMock({
        entities: [entity1, entity2],
      });
      jest.spyOn(catalogMock, 'getEntitiesByRefs');

      const action = createFetchCatalogEntityAction({
        catalog: catalogMock,
      });

      await action.handler({
        ...mockContext,
        input: {
          entityRefs: ['test', 'user:default/test'],
          defaultKind: 'Group',
          defaultNamespace: 'ns',
        },
      });

      expect(catalogMock.getEntitiesByRefs).toHaveBeenCalledWith(
        { entityRefs: ['group:ns/test', 'user:default/test'] },
        { credentials },
      );

      expect(mockContext.output).toHaveBeenCalledWith('entities', [
        entity1,
        entity2,
      ]);
    });
  });
});
