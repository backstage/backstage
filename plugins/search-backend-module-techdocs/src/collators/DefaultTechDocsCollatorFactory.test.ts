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

import { Entity } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import { TestPipeline } from '@backstage/plugin-search-backend-node';
import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Readable } from 'node:stream';
import { DefaultTechDocsCollatorFactory } from './DefaultTechDocsCollatorFactory';
import { TechDocsCollatorEntityTransformer } from './TechDocsCollatorEntityTransformer';
import {
  MkSearchIndexDoc,
  TechDocsCollatorDocumentTransformer,
} from './TechDocsCollatorDocumentTransformer';

const logger = mockServices.logger.mock();

const mockSearchDocIndex = {
  config: {
    lang: ['en'],
    min_search_length: 3,
    prebuild_index: false,
    separator: '[\\s\\-]+',
  },
  docs: [
    {
      location: '',
      text: 'docs docs docs',
      title: 'Home',
    },
    {
      location: 'local-development/',
      text: 'Docs for first subtitle',
      title: 'Local development',
    },
    {
      location: 'local-development/#development',
      text: 'Docs for sub-subtitle',
      title: 'Development',
    },
  ],
};

const expectedEntities: Entity[] = [
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      title: 'Test Entity with Docs!',
      name: 'test-entity-with-docs',
      description: 'Documented description',
      annotations: {
        'backstage.io/techdocs-ref': './',
      },
      tags: ['tag1', 'tag2'],
    },
    spec: {
      type: 'dog',
      lifecycle: 'experimental',
      owner: 'someone',
    },
  },
];

describe('DefaultTechDocsCollatorFactory', () => {
  const config = mockServices.rootConfig.mock();
  const mockDiscoveryApi = mockServices.discovery.mock({
    getBaseUrl: async () => 'http://test-backend',
  });
  const mockCatalog = catalogServiceMock({ entities: expectedEntities });
  const options = {
    logger,
    discovery: mockDiscoveryApi,
    auth: mockServices.auth(),
    catalog: mockCatalog,
  };

  it('has expected type', () => {
    const factory = DefaultTechDocsCollatorFactory.fromConfig(config, options);
    expect(factory.type).toBe('techdocs');
  });

  describe('getCollator', () => {
    let factory: DefaultTechDocsCollatorFactory;
    let collator: Readable;

    const worker = setupServer();
    registerMswTestHooks(worker);

    beforeEach(async () => {
      factory = DefaultTechDocsCollatorFactory.fromConfig(config, options);
      collator = await factory.getCollator();

      worker.use(
        rest.get(
          'http://test-backend/static/docs/default/Component/test-entity-with-docs/search/search_index.json',
          (_, res, ctx) => res(ctx.status(200), ctx.json(mockSearchDocIndex)),
        ),
      );
    });

    it('returns a readable stream', async () => {
      expect(collator).toBeInstanceOf(Readable);
    });

    it('fetches from the configured catalog and tech docs services', async () => {
      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();
      expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('techdocs');
      expect(documents).toHaveLength(mockSearchDocIndex.docs.length);
    });

    it('should create documents for each tech docs search index', async () => {
      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();
      const entity = expectedEntities[0];
      documents.forEach((document, idx) => {
        expect(document).toMatchObject({
          title: mockSearchDocIndex.docs[idx].title,
          location: `/docs/default/component/${entity.metadata.name}/${mockSearchDocIndex.docs[idx].location}`,
          text: mockSearchDocIndex.docs[idx].text,
          namespace: 'default',
          entityTitle: entity!.metadata.title,
          componentType: entity!.spec!.type,
          lifecycle: entity!.spec!.lifecycle,
          owner: '',
          kind: entity.kind.toLocaleLowerCase('en-US'),
          name: entity.metadata.name,
        });
      });
    });

    it('maps a returned entity with a custom locationTemplate', async () => {
      // Provide an alternate location template.
      const _config = new ConfigReader({
        ...config.get(),
        search: {
          collators: { techdocs: { locationTemplate: '/software/:name' } },
        },
      });
      factory = DefaultTechDocsCollatorFactory.fromConfig(_config, {
        discovery: mockDiscoveryApi,
        logger,
        auth: mockServices.auth(),
        catalog: mockCatalog,
      });
      collator = await factory.getCollator();

      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();

      expect(documents[0]).toMatchObject({
        location: '/software/test-entity-with-docs',
      });
    });

    it('should filter catalog entities when a custom filter is set', async () => {
      factory = DefaultTechDocsCollatorFactory.fromConfig(config, {
        ...options,
        entityFilterFunction: entities =>
          entities.filter(entity => entity.kind !== 'Component'),
      });
      collator = await factory.getCollator();
      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();
      expect(documents).toHaveLength(0);
    });

    it('paginates through catalog entities using batchSize', async () => {
      // parallelismLimit of 1 → batchSize of 50 per request.
      // First page returns exactly 50 (no techdocs annotation) triggering a
      // second request; second page returns the real entity with annotation.
      const _config = new ConfigReader({
        ...config.get(),
        search: {
          collators: {
            techdocs: {
              parallelismLimit: 1,
            },
          },
        },
      });
      const paginationCatalog = catalogServiceMock({ entities: [] });
      jest
        .spyOn(paginationCatalog, 'getEntities')
        .mockResolvedValueOnce({ items: Array(50).fill({}) })
        .mockResolvedValueOnce({ items: expectedEntities });
      factory = DefaultTechDocsCollatorFactory.fromConfig(_config, {
        ...options,
        catalog: paginationCatalog,
      });
      collator = await factory.getCollator();

      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();

      expect(paginationCatalog.getEntities).toHaveBeenCalledTimes(2);
      // First page: 50 entities with no techdocs annotation → 0 docs
      // Second page: 1 entity × 3 search index docs → 3 docs
      expect(documents).toHaveLength(3);
    });

    describe('with legacyPathCasing configuration', () => {
      beforeEach(async () => {
        const legacyConfig = new ConfigReader({
          techdocs: {
            legacyUseCaseSensitiveTripletPaths: true,
          },
        });
        factory = DefaultTechDocsCollatorFactory.fromConfig(
          legacyConfig,
          options,
        );
        collator = await factory.getCollator();
      });

      it('should create documents for each tech docs search index', async () => {
        const pipeline = TestPipeline.fromCollator(collator);
        const { documents } = await pipeline.execute();
        const entity = expectedEntities[0];
        documents.forEach((document, idx) => {
          expect(document).toMatchObject({
            title: mockSearchDocIndex.docs[idx].title,
            location: `/docs/default/Component/${entity.metadata.name}/${mockSearchDocIndex.docs[idx].location}`,
            text: mockSearchDocIndex.docs[idx].text,
            namespace: 'default',
            entityTitle: entity!.metadata.title,
            componentType: entity!.spec!.type,
            lifecycle: entity!.spec!.lifecycle,
            owner: '',
            kind: entity.kind,
            name: entity.metadata.name,
          });
        });
      });
    });

    it('should transform the entity using the entityTransformer function', async () => {
      // @ts-ignore
      const entityTransformer: TechDocsCollatorEntityTransformer = (
        entity: Entity,
      ) => {
        return {
          tags: entity.metadata.tags,
        };
      };

      factory = DefaultTechDocsCollatorFactory.fromConfig(config, {
        ...options,
        entityTransformer,
      });

      collator = await factory.getCollator();

      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();
      const entity = expectedEntities[0];
      documents.forEach((document, idx) => {
        expect(document).toMatchObject({
          title: mockSearchDocIndex.docs[idx].title,
          location: `/docs/default/component/${entity.metadata.name}/${mockSearchDocIndex.docs[idx].location}`,
          text: mockSearchDocIndex.docs[idx].text,
          namespace: 'default',
          entityTitle: entity!.metadata.title,
          componentType: entity!.spec!.type,
          lifecycle: entity!.spec!.lifecycle,
          owner: '',
          kind: entity.kind.toLocaleLowerCase('en-US'),
          name: entity.metadata.name,
          tags: entity.metadata.tags,
        });
      });
    });

    it('should transform the doc using the documentTransformer function', async () => {
      // @ts-ignore
      const documentTransformer: TechDocsCollatorDocumentTransformer = (
        _: MkSearchIndexDoc,
      ) => {
        return {
          tags: ['static-tag'],
        };
      };

      factory = DefaultTechDocsCollatorFactory.fromConfig(config, {
        ...options,
        documentTransformer,
      });

      collator = await factory.getCollator();

      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();
      const entity = expectedEntities[0];
      documents.forEach((document, idx) => {
        expect(document).toMatchObject({
          title: mockSearchDocIndex.docs[idx].title,
          location: `/docs/default/component/${entity.metadata.name}/${mockSearchDocIndex.docs[idx].location}`,
          text: mockSearchDocIndex.docs[idx].text,
          namespace: 'default',
          entityTitle: entity!.metadata.title,
          componentType: entity!.spec!.type,
          lifecycle: entity!.spec!.lifecycle,
          owner: '',
          kind: entity.kind.toLocaleLowerCase('en-US'),
          name: entity.metadata.name,
          tags: ['static-tag'],
        });
      });
    });
  });
});
