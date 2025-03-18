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

import { TokenManager } from '@backstage/backend-common';
import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { Entity } from '@backstage/catalog-model';
import { DefaultCatalogCollator } from './DefaultCatalogCollator';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { ConfigReader } from '@backstage/config';

const server = setupServer();

const expectedEntities: Entity[] = [
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'test-entity',
      description: 'The expected description',
    },
    spec: {
      type: 'some-type',
      lifecycle: 'experimental',
      owner: 'someone',
    },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      title: 'Test Entity',
      name: 'test-entity-2',
      description: 'The expected description 2',
    },
    spec: {
      type: 'some-type',
      lifecycle: 'experimental',
      owner: 'someone',
    },
  },
];

describe('DefaultCatalogCollator', () => {
  const mockDiscovery = mockServices.discovery.mock({
    getBaseUrl: async () => 'http://localhost:7007',
  });
  let mockTokenManager: jest.Mocked<TokenManager>;
  let collator: DefaultCatalogCollator;

  registerMswTestHooks(server);
  beforeAll(() => {
    mockTokenManager = {
      getToken: jest.fn().mockResolvedValue({ token: '' }),
      authenticate: jest.fn(),
    };
    collator = new DefaultCatalogCollator({
      discovery: mockDiscovery,
      tokenManager: mockTokenManager,
    });
  });
  beforeEach(() => {
    server.use(
      rest.get('http://localhost:7007/entities', (req, res, ctx) => {
        if (req.url.searchParams.has('filter')) {
          const filter = req.url.searchParams.get('filter');
          if (filter === 'kind=Foo,kind=Bar') {
            // When filtering on the 'Foo,Bar' kinds we simply return no items, to simulate a filter
            return res(ctx.json([]));
          }
          throw new Error('Unexpected filter parameter');
        }
        return res(ctx.json(expectedEntities));
      }),
    );
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('fetches from the configured catalog service', async () => {
    const documents = await collator.execute();
    expect(mockDiscovery.getBaseUrl).toHaveBeenCalledWith('catalog');
    expect(documents).toHaveLength(expectedEntities.length);
  });

  it('maps a returned entity to an expected CatalogEntityDocument', async () => {
    const documents = await collator.execute();
    expect(documents[0]).toMatchObject({
      title: expectedEntities[0].metadata.name,
      location: '/catalog/default/component/test-entity',
      text: expectedEntities[0].metadata.description,
      namespace: 'default',
      componentType: expectedEntities[0]!.spec!.type,
      lifecycle: expectedEntities[0]!.spec!.lifecycle,
      owner: expectedEntities[0]!.spec!.owner,
      authorization: {
        resourceRef: 'component:default/test-entity',
      },
    });
    expect(documents[1]).toMatchObject({
      title: `${expectedEntities[1].metadata.title} (${expectedEntities[1].metadata.name})`,
      location: '/catalog/default/component/test-entity-2',
      text: expectedEntities[1].metadata.description,
      namespace: 'default',
      componentType: expectedEntities[1]!.spec!.type,
      lifecycle: expectedEntities[1]!.spec!.lifecycle,
      owner: expectedEntities[1]!.spec!.owner,
      authorization: {
        resourceRef: 'component:default/test-entity-2',
      },
    });
  });

  it('maps a returned entity with a custom locationTemplate', async () => {
    // Provide an alternate location template.
    collator = new DefaultCatalogCollator({
      discovery: mockDiscovery,
      tokenManager: mockTokenManager,
      locationTemplate: '/software/:name',
    });

    const documents = await collator.execute();
    expect(documents[0]).toMatchObject({
      location: '/software/test-entity',
    });
  });

  it('allows filtering of the retrieved catalog entities', async () => {
    // Provide an alternate location template.
    collator = DefaultCatalogCollator.fromConfig(new ConfigReader({}), {
      discovery: mockDiscovery,
      tokenManager: mockTokenManager,
      filter: {
        kind: ['Foo', 'Bar'],
      },
    });

    const documents = await collator.execute();
    // The simulated 'Foo,Bar' filter should return in an empty list
    expect(documents).toHaveLength(0);
  });
});
