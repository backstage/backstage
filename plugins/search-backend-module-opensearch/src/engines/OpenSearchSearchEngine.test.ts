/*
 * Copyright 2026 The Backstage Authors
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

import { mockServices } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import {
  decodePageCursor,
  encodePageCursor,
  OpenSearchSearchEngine,
} from './OpenSearchSearchEngine';

jest.mock('./OpenSearchClientWrapper', () => {
  const wrapper = {
    search: jest.fn(),
    bulk: jest.fn(),
    listIndices: jest.fn(),
    createIndex: jest.fn(),
    deleteIndex: jest.fn(),
    putIndexTemplate: jest.fn(),
    updateAliases: jest.fn(),
    indexExists: jest.fn(),
  };
  return {
    OpenSearchClientWrapper: {
      fromClientOptions: jest.fn(() => wrapper),
    },
    __wrapper: wrapper,
  };
});

jest.mock('./OpenSearchSearchEngineIndexer', () => {
  const indexer = {
    on: jest.fn(),
    indexName: 'expected-index-name',
  };
  return {
    OpenSearchSearchEngineIndexer: jest.fn(() => indexer),
    __indexer: indexer,
  };
});

jest.mock('node:crypto', () => ({
  ...jest.requireActual('node:crypto'),
  randomUUID: () => 'highlight-tag',
}));

const wrapperModule = jest.requireMock('./OpenSearchClientWrapper') as any;
const indexerModule = jest.requireMock(
  './OpenSearchSearchEngineIndexer',
) as any;
const mockWrapper = wrapperModule.__wrapper;
const mockIndexer = indexerModule.__indexer;
const logger = mockServices.logger.mock();

class InspectableEngine extends OpenSearchSearchEngine {
  translate(query: any, options?: any) {
    return this.translator(query, options);
  }
}

function newEngine(options: Record<string, unknown> = {}) {
  return new InspectableEngine({
    clientOptions: { node: 'http://localhost:9200' },
    logger,
    ...options,
  });
}

describe('OpenSearchSearchEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWrapper.search.mockResolvedValue({
      body: { hits: { total: { value: 0 }, hits: [] } },
    });
    mockWrapper.listIndices.mockResolvedValue({ body: {} });
  });

  describe('fromConfig', () => {
    it('creates a client from the search.opensearch configuration', async () => {
      const config = new ConfigReader({
        search: {
          opensearch: {
            node: 'http://localhost:9200',
            auth: { username: 'opensearch', password: 'changeme' },
            batchSize: 50,
            batchKeyField: 'id',
            indexPrefix: 'prefix-',
            queryOptions: { fuzziness: 1, prefixLength: 2 },
          },
        },
      });

      const engine = await OpenSearchSearchEngine.fromConfig({
        config,
        logger,
      });

      expect(engine).toBeInstanceOf(OpenSearchSearchEngine);
      expect(
        wrapperModule.OpenSearchClientWrapper.fromClientOptions,
      ).toHaveBeenCalledWith({
        node: 'http://localhost:9200',
        auth: { username: 'opensearch', password: 'changeme' },
      });
      expect(
        indexerModule.OpenSearchSearchEngineIndexer,
      ).not.toHaveBeenCalled();
    });

    it('reads the index prefix from configuration', async () => {
      const config = new ConfigReader({
        search: {
          opensearch: {
            node: 'http://localhost:9200',
            indexPrefix: 'custom-',
          },
        },
      });

      const engine = await OpenSearchSearchEngine.fromConfig({
        config,
        logger,
      });
      await engine.getIndexer('docs');

      expect(indexerModule.OpenSearchSearchEngineIndexer).toHaveBeenCalledWith(
        expect.objectContaining({ indexPrefix: 'custom-' }),
      );
    });

    it('accepts the legacy opensearch provider id as an alias for default', async () => {
      const config = new ConfigReader({
        search: {
          opensearch: {
            provider: 'opensearch',
            node: 'http://localhost:9200',
            auth: { apiKey: 'key' },
          },
        },
      });

      await OpenSearchSearchEngine.fromConfig({ config, logger });

      expect(
        wrapperModule.OpenSearchClientWrapper.fromClientOptions,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: { Authorization: 'ApiKey key' },
        }),
      );
    });

    it('uses a custom provider selected by config', async () => {
      const createClientOptions = jest
        .fn()
        .mockResolvedValue({ node: 'http://custom:9200' });
      const provider = { id: 'managed', createClientOptions };
      const config = new ConfigReader({
        search: {
          opensearch: { provider: 'managed', node: 'http://unused:9200' },
        },
      });

      await OpenSearchSearchEngine.fromConfig({
        config,
        logger,
        providers: { managed: provider },
      });

      expect(createClientOptions).toHaveBeenCalledWith(
        expect.objectContaining({ logger, config: expect.any(ConfigReader) }),
      );
      expect(
        wrapperModule.OpenSearchClientWrapper.fromClientOptions,
      ).toHaveBeenCalledWith({ node: 'http://custom:9200' });
    });

    it('rejects unknown providers with the available provider ids', async () => {
      const config = new ConfigReader({
        search: {
          opensearch: { provider: 'missing', node: 'http://localhost:9200' },
        },
      });

      await expect(
        OpenSearchSearchEngine.fromConfig({ config, logger }),
      ).rejects.toThrow(/Unsupported OpenSearch provider 'missing'/);
    });

    it('installs configured index templates and reports failures without aborting startup', async () => {
      const config = new ConfigReader({
        search: {
          opensearch: {
            node: 'http://localhost:9200',
            indexTemplates: [
              {
                name: 'template-a',
                body: {
                  index_patterns: ['docs-*'],
                  composed_of: ['component-a'],
                  template: { settings: { number_of_shards: 1 } },
                },
              },
            ],
          },
        },
      });

      await OpenSearchSearchEngine.fromConfig({ config, logger });
      expect(mockWrapper.putIndexTemplate).toHaveBeenCalledWith({
        name: 'template-a',
        body: {
          index_patterns: ['docs-*'],
          composed_of: ['component-a'],
          template: { settings: { number_of_shards: 1 } },
        },
      });

      mockWrapper.putIndexTemplate.mockRejectedValueOnce(new Error('denied'));
      await expect(
        OpenSearchSearchEngine.fromConfig({ config, logger }),
      ).resolves.toBeDefined();
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Unable to set custom index template'),
      );
    });

    it('uses a supplied query translator', async () => {
      const config = new ConfigReader({
        search: { opensearch: { node: 'http://localhost:9200' } },
      });
      const openSearchQuery = { query: { match_all: {} } };
      const translator = jest.fn().mockReturnValue({
        openSearchQuery,
        pageSize: 5,
      });

      const engine = await OpenSearchSearchEngine.fromConfig({
        config,
        logger,
        translator,
      });
      await engine.query({ term: 'anything' });

      expect(translator).toHaveBeenCalledWith(
        { term: 'anything' },
        expect.objectContaining({ highlightOptions: expect.any(Object) }),
      );
      expect(mockWrapper.search).toHaveBeenCalledWith(
        expect.objectContaining({ body: openSearchQuery }),
      );
    });
  });

  describe('query translation', () => {
    it('builds a match_all query for an empty term', () => {
      const result = newEngine().translate({ term: '' });

      expect(result.openSearchQuery).toEqual({
        query: {
          bool: {
            filter: [],
            should: [{ match_all: {} }],
          },
        },
        from: 0,
        size: 25,
      });
      expect(result.pageSize).toBe(25);
    });

    it('translates string, number, boolean and array filters', () => {
      const result = newEngine().translate({
        term: 'search term',
        filters: {
          kind: 'component',
          enabled: true,
          count: 3,
          tags: ['a', 'b'],
          ignored: undefined,
        },
      });

      expect((result.openSearchQuery as any).query.bool.filter).toEqual([
        { match: { 'kind.keyword': 'component' } },
        { match: { enabled: 'true' } },
        { match: { count: '3' } },
        {
          bool: {
            should: [{ match: { tags: 'a' } }, { match: { tags: 'b' } }],
          },
        },
      ]);
    });

    it('uses phrase queries for quoted terms and applies fuzziness settings', () => {
      const result = newEngine().translate(
        { term: '"exact phrase" other' },
        { queryOptions: { fuzziness: 2, prefixLength: 3 } },
      );

      expect((result.openSearchQuery as any).query.bool.should).toEqual([
        {
          multi_match: {
            fields: ['*'],
            query: 'exact phrase',
            type: 'phrase',
          },
        },
        {
          multi_match: {
            fields: ['*'],
            query: 'other',
            fuzziness: 2,
            prefix_length: 3,
          },
        },
      ]);
    });

    it('adds highlight configuration when provided', () => {
      const result = newEngine().translate(
        { term: 'hello' },
        {
          highlightOptions: {
            preTag: '<highlight-tag>',
            postTag: '</highlight-tag>',
            fragmentSize: 120,
            numFragments: 2,
            fragmentDelimiter: ' | ',
          },
        },
      );

      expect((result.openSearchQuery as any).highlight).toEqual({
        fields: {
          '*': {
            number_of_fragments: 2,
            fragment_size: 120,
            pre_tags: ['<highlight-tag>'],
            post_tags: ['</highlight-tag>'],
          },
        },
      });
    });

    it('throws for unsupported filter shapes', () => {
      expect(() =>
        newEngine().translate({
          term: 'hello',
          filters: { nested: { key: 'value' } },
        }),
      ).toThrow('Unrecognized filter type');
    });
  });

  describe('query', () => {
    it('returns results with rank, type and highlights', async () => {
      mockWrapper.search.mockResolvedValue({
        body: {
          hits: {
            total: { value: 1 },
            hits: [
              {
                _index: 'docs-index__1',
                _source: { title: 'Hello' },
                highlight: { title: ['<highlight-tag>Hello</highlight-tag>'] },
              },
            ],
          },
        },
      });

      const result = await newEngine().query({ term: 'hello' });

      expect(result).toEqual({
        results: [
          {
            type: 'docs',
            document: { title: 'Hello' },
            rank: 1,
            highlight: {
              preTag: '<highlight-tag>',
              postTag: '</highlight-tag>',
              fields: { title: '<highlight-tag>Hello</highlight-tag>' },
            },
          },
        ],
        nextPageCursor: undefined,
        previousPageCursor: undefined,
        numberOfResults: 1,
      });
    });

    it('paginates using encoded cursors', async () => {
      mockWrapper.search.mockResolvedValue({
        body: {
          hits: {
            total: { value: 11 },
            hits: [
              {
                _index: 'docs-index__1',
                _source: { title: 'Second page' },
              },
            ],
          },
        },
      });

      const result = await newEngine().query({
        term: 'hello',
        pageLimit: 5,
        pageCursor: encodePageCursor({ page: 1 }),
      });

      expect(result.nextPageCursor).toBe(encodePageCursor({ page: 2 }));
      expect(result.previousPageCursor).toBe(encodePageCursor({ page: 0 }));
      expect(result.results[0].rank).toBe(6);
      expect((mockWrapper.search.mock.calls[0][0] as any).body.from).toBe(5);
    });

    it('does not query the cluster when no document types are requested', async () => {
      const result = await newEngine().query({ term: 'hello', types: [] });

      expect(result.results).toEqual([]);
      expect(mockWrapper.search).not.toHaveBeenCalled();
    });

    it('throws MissingIndexError when the index does not exist', async () => {
      mockWrapper.search.mockRejectedValue({
        meta: { body: { error: { type: 'index_not_found_exception' } } },
      });

      await expect(newEngine().query({ term: 'hello' })).rejects.toThrow(
        /Missing index/,
      );
    });

    it('reports other query failures with a descriptive error', async () => {
      mockWrapper.search.mockRejectedValue(new Error('connection refused'));

      await expect(newEngine().query({ term: 'hello' })).rejects.toThrow(
        'Failed to query documents for indices *__search: connection refused',
      );
    });
  });

  describe('getIndexer', () => {
    it('creates an indexer with the configured alias and batch settings', async () => {
      const engine = newEngine({
        aliasPostfix: 'alias',
        indexPrefix: 'prefix-',
        batchSize: 25,
        batchKeyField: 'id',
        skipRefresh: true,
      });

      await engine.getIndexer('docs');

      expect(indexerModule.OpenSearchSearchEngineIndexer).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'docs',
          alias: 'prefix-docs__alias',
          indexPrefix: 'prefix-',
          batchSize: 25,
          batchKeyField: 'id',
          skipRefresh: true,
        }),
      );
      expect(mockIndexer.on).toHaveBeenCalledWith(
        'error',
        expect.any(Function),
      );
    });

    it('cleans up a partial index on failure', async () => {
      await newEngine().getIndexer('docs');
      const onError = mockIndexer.on.mock.calls[0][1];
      mockWrapper.deleteIndex.mockResolvedValue({});

      await onError(new Error('indexing failed'));

      expect(mockWrapper.deleteIndex).toHaveBeenCalledWith({
        index: 'expected-index-name',
      });
    });
  });
});

describe('page cursors', () => {
  it('round-trips a page number', () => {
    expect(decodePageCursor(encodePageCursor({ page: 3 }))).toEqual({
      page: 3,
    });
  });

  it('defaults to the first page', () => {
    expect(decodePageCursor()).toEqual({ page: 0 });
  });
});
