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
import { CatalogApi } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { createFetchCatalogEntityAction } from './fetch';
import { examples } from './fetch.examples';
import yaml from 'yaml';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';

describe('catalog:fetch examples', () => {
  const getEntityByRef = jest.fn();
  const getEntitiesByRefs = jest.fn();

  const catalogClient = {
    getEntityByRef: getEntityByRef,
    getEntitiesByRefs: getEntitiesByRefs,
  };

  const action = createFetchCatalogEntityAction({
    catalogClient: catalogClient as unknown as CatalogApi,
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
      getEntityByRef.mockReturnValueOnce({
        metadata: {
          namespace: 'default',
          name: 'name',
        },
        kind: 'Component',
      } as Entity);

      await action.handler({
        ...mockContext,
        input: yaml.parse(examples[0].example).steps[0].input,
      });

      expect(getEntityByRef).toHaveBeenCalledWith('component:default/name', {
        token,
      });
      expect(mockContext.output).toHaveBeenCalledWith('entity', {
        metadata: {
          namespace: 'default',
          name: 'name',
        },
        kind: 'Component',
      });
    });
  });
});
