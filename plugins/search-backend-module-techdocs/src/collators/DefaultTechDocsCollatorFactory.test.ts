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
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Readable } from 'stream';
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
  const options = {
    logger,
    discovery: mockDiscoveryApi,
    auth: mockServices.auth(),
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
        rest.get('http://test-backend/entities', (req, res, ctx) => {
          // Imitate offset/limit pagination.
          const offset = parseInt(
            req.url.searchParams.get('offset') || '0',
            10,
          );
          const limit = parseInt(
            req.url.searchParams.get('limit') || '500',
            10,
          );

          // Limit 50 corresponds to a case testing pagination.
          if (limit === 50) {
            // Return 50 copies of invalid entities on the first request.
            if (offset === 0) {
              return res(ctx.status(200), ctx.json(Array(50).fill({})));
            }
            // Then just the regular 2 on the second.
            return res(ctx.status(200), ctx.json(expectedEntities));
          }
          return res(
            ctx.status(200),
            ctx.json(expectedEntities.slice(offset, limit + offset)),
          );
        }),
      );
    });

    it('returns a readable stream', async () => {
      expect(collator).toBeInstanceOf(Readable);
    });

    it('fetches from the configured catalog and tech docs services', async () => {
      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();
      expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('catalog');
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
      // A parallelismLimit of 1 is a catalog limit of 50 per request. Code
      // above in the /entities handler ensures valid entities are only
      // returned on the second page.
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
      factory = DefaultTechDocsCollatorFactory.fromConfig(_config, options);
      collator = await factory.getCollator();

      const pipeline = TestPipeline.fromCollator(collator);
      const { documents } = await pipeline.execute();

      // Only 1 entity with TechDocs configured multiplied by 3 pages.
      expect(documents).toHaveLength(3);
      expect(_config.get('search.collators.techdocs.parallelismLimit')).toEqual(
        1,
      );
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
