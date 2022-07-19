/*
 * Copyright 2022 The Backstage Authors
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
import {
  PluginEndpointDiscovery,
  TokenManager,
} from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import { TestPipeline } from '@backstage/plugin-search-backend-node';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Readable } from 'stream';
import { DefaultCatalogCollatorFactory } from './DefaultCatalogCollatorFactory';

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

describe('DefaultCatalogCollatorFactory', () => {
  const config = new ConfigReader({});
  const mockDiscoveryApi: jest.Mocked<PluginEndpointDiscovery> = {
    getBaseUrl: jest.fn().mockResolvedValue('http://localhost:7007'),
    getExternalBaseUrl: jest.fn(),
  };
  const mockTokenManager: jest.Mocked<TokenManager> = {
    getToken: jest.fn().mockResolvedValue({ token: '' }),
    authenticate: jest.fn(),
  };
  const options = {
    discovery: mockDiscoveryApi,
    tokenManager: mockTokenManager,
  };

  beforeAll(() => {
    server.listen();
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

        // Imitate offset/limit pagination.
        const offset = parseInt(req.url.searchParams.get('offset') || '0', 10);
        const limit = parseInt(req.url.searchParams.get('limit') || '500', 10);
        return res(ctx.json(expectedEntities.slice(offset, limit + offset)));
      }),
    );
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => server.resetHandlers());

  it('has expected type', () => {
    const factory = DefaultCatalogCollatorFactory.fromConfig(config, options);
    expect(factory.type).toBe('software-catalog');
  });

  describe('getCollator', () => {
    let factory: DefaultCatalogCollatorFactory;
    let collator: Readable;

    beforeEach(async () => {
      factory = DefaultCatalogCollatorFactory.fromConfig(config, options);
      collator = await factory.getCollator();
    });

    it('returns a readable stream', async () => {
      expect(collator).toBeInstanceOf(Readable);
    });

    it('fetches from the configured catalog service', async () => {
      const pipeline = TestPipeline.withSubject(collator);
      const { documents } = await pipeline.execute();
      expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('catalog');
      expect(documents).toHaveLength(expectedEntities.length);
    });

    it('maps a returned entity to an expected CatalogEntityDocument', async () => {
      const pipeline = TestPipeline.withSubject(collator);
      const { documents } = await pipeline.execute();

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
        title: expectedEntities[1].metadata.title,
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
      factory = DefaultCatalogCollatorFactory.fromConfig(new ConfigReader({}), {
        discovery: mockDiscoveryApi,
        tokenManager: mockTokenManager,
        locationTemplate: '/software/:name',
      });
      collator = await factory.getCollator();

      const pipeline = TestPipeline.withSubject(collator);
      const { documents } = await pipeline.execute();
      expect(documents[0]).toMatchObject({
        location: '/software/test-entity',
      });
    });

    it('allows filtering of the retrieved catalog entities', async () => {
      // Provide a custom filter.
      factory = DefaultCatalogCollatorFactory.fromConfig(new ConfigReader({}), {
        discovery: mockDiscoveryApi,
        tokenManager: mockTokenManager,
        filter: {
          kind: ['Foo', 'Bar'],
        },
      });
      collator = await factory.getCollator();

      const pipeline = TestPipeline.withSubject(collator);
      const { documents } = await pipeline.execute();

      // The simulated 'Foo,Bar' filter should return in an empty list
      expect(documents).toHaveLength(0);
    });

    it('paginates through catalog entities using batchSize', async () => {
      factory = DefaultCatalogCollatorFactory.fromConfig(config, {
        ...options,
        batchSize: 1,
      });
      collator = await factory.getCollator();

      const pipeline = TestPipeline.withSubject(collator);
      const { documents } = await pipeline.execute();

      expect(documents).toHaveLength(expectedEntities.length);
      expect(documents[0].location).toBe(
        '/catalog/default/component/test-entity',
      );
      expect(documents[1].location).toBe(
        '/catalog/default/component/test-entity-2',
      );
    });
  });
});
