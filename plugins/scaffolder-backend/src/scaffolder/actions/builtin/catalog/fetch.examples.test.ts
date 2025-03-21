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
import { examples } from './fetch.examples';
import yaml from 'yaml';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';

describe('catalog:fetch examples', () => {
  const entity = {
    kind: 'Component',
    metadata: {
      name: 'name',
      namespace: 'default',
    },
  } as Entity;

  const catalogClient = catalogServiceMock({ entities: [entity] });

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
    jest.spyOn(catalogClient, 'getEntityByRef');
  });

  describe('fetch single entity', () => {
    it('should return entity from catalog', async () => {
      await action.handler({
        ...mockContext,
        input: yaml.parse(examples[0].example).steps[0].input,
      });

      expect(catalogClient.getEntityByRef).toHaveBeenCalledWith(
        'component:default/name',
        { token },
      );
      expect(mockContext.output).toHaveBeenCalledWith('entity', entity);
    });
  });
});
