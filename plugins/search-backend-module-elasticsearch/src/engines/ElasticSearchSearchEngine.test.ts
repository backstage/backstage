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

import { ConfigReader } from '@backstage/config';
import { errors } from '@elastic/elasticsearch';
import Mock from '@elastic/elasticsearch-mock';
import { ElasticSearchClientWrapper } from './ElasticSearchClientWrapper';
import {
  ElasticSearchConcreteQuery,
  decodePageCursor,
  ElasticSearchSearchEngine,
  encodePageCursor,
} from './ElasticSearchSearchEngine';
import { ElasticSearchSearchEngineIndexer } from './ElasticSearchSearchEngineIndexer';
import { mockServices } from '@backstage/backend-test-utils';

jest.mock('uuid', () => ({ v4: () => 'tag' }));

class ElasticSearchSearchEngineForTranslatorTests extends ElasticSearchSearchEngine {
  getTranslator() {
    return this.translator;
  }
}

const mock = new Mock();
const options = {
  node: 'http://localhost:9200',
  Connection: mock.getConnection(),
};

const indexerMock = {
  on: jest.fn(),
  indexName: 'expected-index-name',
};
jest.mock('./ElasticSearchSearchEngineIndexer', () => ({
  ElasticSearchSearchEngineIndexer: jest
    .fn()
    .mockImplementation(() => indexerMock),
}));

const customIndexTemplate = {
  name: 'custom-index-template',
  body: {
    index_patterns: ['*'],
    template: {
      settings: {
        number_of_shards: 1,
      },
      mappings: {
        _source: {
          enabled: false,
        },
      },
    },
  },
};

const advanceTimersByNTimes = async (n = 1, time = 1000) => {
  for (let i = 0; i < n; i++) {
    await Promise.resolve();
    jest.advanceTimersByTime(time);
    await Promise.resolve();
  }
};

describe('ElasticSearchSearchEngine', () => {
  let testSearchEngine: ElasticSearchSearchEngine;
  let inspectableSearchEngine: ElasticSearchSearchEngineForTranslatorTests;
  let clientWrapper: ElasticSearchClientWrapper;

  beforeEach(() => {
    testSearchEngine = new ElasticSearchSearchEngine(
      options,
      'search',
      '',
      mockServices.logger.mock(),
      1000,
    );
    inspectableSearchEngine = new ElasticSearchSearchEngineForTranslatorTests(
      options,
      'search',
      '',
      mockServices.logger.mock(),
      1000,
    );
    // eslint-disable-next-line dot-notation
    clientWrapper = testSearchEngine['elasticSearchClientWrapper'];
  });

  describe('custom index template', () => {
    it('should set custom index template', async () => {
      const indexTemplateSpy = jest.fn().mockReturnValue(customIndexTemplate);
      mock.add(
        { method: 'PUT', path: '/_index_template/custom-index-template' },
        indexTemplateSpy,
      );
      await inspectableSearchEngine.setIndexTemplate(customIndexTemplate);

      expect(indexTemplateSpy).toHaveBeenCalled();
      expect(indexTemplateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('queryTranslator', () => {
    beforeAll(() => {
      mock.clearAll();
      mock.add(
        {
          method: 'POST',
          path: '/*__search/_search',
        },
        () => ({
          hits: {
            total: { value: 0, relation: 'eq' },
            hits: [],
          },
        }),
      );
    });
    it('should invoke the query translator', async () => {
      const translatorSpy = jest.fn().mockReturnValue({
        elasticSearchQuery: () => ({
          toJSON: () =>
            JSON.stringify({
              query: {
                match_all: {},
              },
            }),
        }),
        documentTypes: [],
      });
      testSearchEngine.setTranslator(translatorSpy);

      await testSearchEngine.query({
        term: 'testTerm',
        filters: {},
      });

      expect(translatorSpy).toHaveBeenCalledWith(
        {
          term: 'testTerm',
          filters: {},
        },
        {
          highlightOptions: {
            preTag: `<tag>`,
            postTag: `</tag>`,
            fragmentSize: 1000,
            numFragments: 1,
            fragmentDelimiter: ' ... ',
          },
        },
      );
    });

    it('should return translated query with 1 filter', async () => {
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        types: ['indexName'],
        term: 'testTerm',
        filters: { kind: 'testKind' },
      }) as ElasticSearchConcreteQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: ['indexName'],
        elasticSearchQuery: expect.any(Object),
      });

      const queryBody = actualTranslatedQuery.elasticSearchQuery;

      expect(queryBody).toEqual({
        query: {
          bool: {
            should: {
              multi_match: {
                query: 'testTerm',
                fields: ['*'],
                fuzziness: 'auto',
                prefix_length: 0,
              },
            },
            filter: {
              match: {
                'kind.keyword': 'testKind',
              },
            },
          },
        },
        from: 0,
        size: 25,
      });
    });

    it('should return translated query with phrase terms', async () => {
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        types: ['indexName'],
        term: '"test phrase" anotherTerm "another phrase"',
        filters: {},
      }) as ElasticSearchConcreteQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: ['indexName'],
        elasticSearchQuery: expect.any(Object),
      });

      const queryBody = actualTranslatedQuery.elasticSearchQuery;

      expect(queryBody).toEqual({
        query: {
          bool: {
            should: [
              {
                multi_match: {
                  query: 'test phrase',
                  fields: ['*'],
                  type: 'phrase',
                },
              },
              {
                multi_match: {
                  query: 'another phrase',
                  fields: ['*'],
                  type: 'phrase',
                },
              },
              {
                multi_match: {
                  query: 'anotherTerm',
                  fields: ['*'],
                  fuzziness: 'auto',
                  prefix_length: 0,
                },
              },
            ],
            filter: [],
          },
        },
        from: 0,
        size: 25,
      });
    });

    it('should pass page cursor', async () => {
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        types: ['indexName'],
        term: 'testTerm',
        pageCursor: 'MQ==',
      }) as ElasticSearchConcreteQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: ['indexName'],
        elasticSearchQuery: expect.any(Object),
      });

      const queryBody = actualTranslatedQuery.elasticSearchQuery;

      expect(queryBody).toEqual({
        query: {
          bool: {
            filter: [],
            should: {
              multi_match: {
                query: 'testTerm',
                fields: ['*'],
                fuzziness: 'auto',
                prefix_length: 0,
              },
            },
          },
        },
        from: 25,
        size: 25,
      });
    });

    it('should return translated query with multiple filters', async () => {
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        types: ['indexName'],
        term: 'testTerm',
        filters: {
          kind: 'testKind',
          namespace: 'testNameSpace',
          foo: 123,
          bar: true,
        },
      }) as ElasticSearchConcreteQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: ['indexName'],
        elasticSearchQuery: expect.any(Object),
      });

      const queryBody = actualTranslatedQuery.elasticSearchQuery;

      expect(queryBody).toEqual({
        query: {
          bool: {
            should: {
              multi_match: {
                query: 'testTerm',
                fields: ['*'],
                fuzziness: 'auto',
                prefix_length: 0,
              },
            },
            filter: [
              {
                match: {
                  'kind.keyword': 'testKind',
                },
              },
              {
                match: {
                  'namespace.keyword': 'testNameSpace',
                },
              },
              {
                match: {
                  foo: '123',
                },
              },
              {
                match: {
                  bar: 'true',
                },
              },
            ],
          },
        },
        from: 0,
        size: 25,
      });
    });

    it('should return translated query with filter with multiple values', async () => {
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        types: ['indexName'],
        term: 'testTerm',
        filters: { kind: ['testKind', 'kastTeint'] },
      }) as ElasticSearchConcreteQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: ['indexName'],
        elasticSearchQuery: expect.any(Object),
      });

      const queryBody = actualTranslatedQuery.elasticSearchQuery;

      expect(queryBody).toEqual({
        query: {
          bool: {
            should: {
              multi_match: {
                query: 'testTerm',
                fields: ['*'],
                fuzziness: 'auto',
                prefix_length: 0,
              },
            },
            filter: {
              bool: {
                should: [
                  {
                    match: {
                      kind: 'testKind',
                    },
                  },
                  {
                    match: {
                      kind: 'kastTeint',
                    },
                  },
                ],
              },
            },
          },
        },
        from: 0,
        size: 25,
      });
    });

    it('should accept custom highlight options', async () => {
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest(
        {
          types: ['indexName'],
          term: 'testTerm',
          pageCursor: 'MQ==',
        },
        {
          highlightOptions: {
            preTag: `<custom-tag>`,
            postTag: `</custom-tag>`,
            fragmentSize: 100,
            numFragments: 3,
            fragmentDelimiter: ' ... ',
          },
        },
      ) as ElasticSearchConcreteQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: ['indexName'],
        elasticSearchQuery: expect.any(Object),
      });

      const queryBody = actualTranslatedQuery.elasticSearchQuery;

      expect(queryBody).toEqual({
        query: {
          bool: {
            filter: [],
            should: {
              multi_match: {
                query: 'testTerm',
                fields: ['*'],
                fuzziness: 'auto',
                prefix_length: 0,
              },
            },
          },
        },
        highlight: {
          fields: { '*': {} },
          fragment_size: 100,
          number_of_fragments: 3,
          pre_tags: ['<custom-tag>'],
          post_tags: ['</custom-tag>'],
        },
        from: 25,
        size: 25,
      });
    });

    it('should throw if unsupported filter shapes passed in', async () => {
      const translatorUnderTest = inspectableSearchEngine.getTranslator();
      const actualTranslatedQuery = () =>
        translatorUnderTest({
          types: ['indexName'],
          term: 'testTerm',
          filters: { kind: { a: 'b' } },
        }) as ElasticSearchConcreteQuery;
      expect(actualTranslatedQuery).toThrow();
    });
  });

  describe('query functionality', () => {
    beforeEach(() => {
      mock.clearAll();
      mock.add(
        {
          method: 'GET',
          path: '/_cat/aliases/test-index__search',
        },
        () => [
          {
            alias: 'test-index__search',
            index: 'test-index-index__1626850643538',
            filter: '-',
            'routing.index': '-',
            'routing.search': '-',
            is_write_index: '-',
          },
        ],
      );
      mock.add(
        {
          method: 'POST',
          path: ['/_bulk'],
        },
        () => ({
          took: 30,
          errors: false,
          items: [
            {
              index: {
                _index: 'test',
                _type: '_doc',
                _id: '1',
                _version: 1,
                result: 'created',
                _shards: {
                  total: 2,
                  successful: 1,
                  failed: 0,
                },
                status: 201,
                _seq_no: 0,
                _primary_term: 1,
              },
            },
          ],
        }),
      );

      mock.add(
        {
          method: 'POST',
          path: '/*__search/_search',
        },
        () => ({
          hits: {
            total: { value: 0, relation: 'eq' },
            hits: [],
          },
        }),
      );
    });

    // Mostly useless test since we are more or less testing the mock, runs through the whole flow though
    // We might want to spin up ES test container to run against the real engine.
    // That container eats GBs of memory so opting out of that for now...
    it('should perform search query and return 0 results on empty index', async () => {
      const mockedSearchResult = await testSearchEngine.query({
        term: 'testTerm',
        filters: {},
      });

      // Should return 0 results as nothing is indexed here
      expect(mockedSearchResult).toMatchObject({
        results: [],
        nextPageCursor: undefined,
      });
    });

    it('should perform search query with less results than one page', async () => {
      mock.clear({
        method: 'POST',
        path: '/*__search/_search',
      });
      mock.add(
        {
          method: 'POST',
          path: '/*__search/_search',
        },
        () => {
          return {
            hits: {
              total: { value: 20, relation: 'eq' },
              hits: Array(20)
                .fill(null)
                .map((_, i) => ({
                  _index: 'mytype-index__',
                  _source: {
                    value: `${i}`,
                  },
                })),
            },
          };
        },
      );

      const mockedSearchResult = await testSearchEngine.query({
        term: 'testTerm',
        filters: {},
      });

      expect(mockedSearchResult).toMatchObject({
        results: expect.arrayContaining(
          Array(20)
            .fill(null)
            .map((_, i) => ({
              type: 'mytype',
              document: { value: `${i}` },
              rank: i + 1,
            })),
        ),
      });
    });

    it('should perform search query with more results than one page', async () => {
      mock.clear({
        method: 'POST',
        path: '/*__search/_search',
      });
      mock.add(
        {
          method: 'POST',
          path: '/*__search/_search',
        },
        () => {
          return {
            hits: {
              total: { value: 30, relation: 'eq' },
              hits: Array(25)
                .fill(null)
                .map((_, i) => ({
                  _index: 'mytype-index__',
                  _source: {
                    value: `${i}`,
                  },
                })),
            },
          };
        },
      );

      const mockedSearchResult = await testSearchEngine.query({
        term: 'testTerm',
        filters: {},
      });

      expect(mockedSearchResult).toMatchObject({
        results: expect.arrayContaining(
          Array(25)
            .fill(null)
            .map((_, i) => ({
              type: 'mytype',
              document: { value: `${i}` },
              rank: i + 1,
            })),
        ),
        nextPageCursor: 'MQ==',
      });
    });

    it('should perform search query for second page', async () => {
      mock.clear({
        method: 'POST',
        path: '/*__search/_search',
      });
      mock.add(
        {
          method: 'POST',
          path: '/*__search/_search',
        },
        () => {
          return {
            hits: {
              total: { value: 30, relation: 'eq' },
              hits: Array(30)
                .fill(null)
                .map((_, i) => ({
                  _index: 'mytype-index__',
                  _source: {
                    value: `${i}`,
                  },
                }))
                .slice(25),
            },
          };
        },
      );

      const mockedSearchResult = await testSearchEngine.query({
        term: 'testTerm',
        filters: {},
        pageCursor: 'MQ==',
      });

      expect(mockedSearchResult).toMatchObject({
        results: expect.arrayContaining(
          Array(30)
            .fill(null)
            .map((_, i) => ({
              type: 'mytype',
              document: { value: `${i}` },
              rank: i + 1,
            }))
            .slice(25),
        ),
        previousPageCursor: 'MA==',
      });
    });

    it('should handle parsing highlights in search query results', async () => {
      mock.clear({
        method: 'POST',
        path: '/*__search/_search',
      });
      mock.add(
        {
          method: 'POST',
          path: '/*__search/_search',
        },
        () => {
          return {
            hits: {
              total: { value: 30, relation: 'eq' },
              hits: Array(25)
                .fill(null)
                .map((_, i) => ({
                  _index: 'mytype-index__',
                  _source: {
                    value: `${i}`,
                  },
                  highlight: {
                    foo: [
                      'highlighted <tag>test</tag> result',
                      'another <tag>fragment</tag> result',
                    ],
                    bar: ['more <tag>test</tag> results'],
                  },
                })),
            },
          };
        },
      );

      const mockedSearchResult = await testSearchEngine.query({
        term: 'testTerm',
        filters: {},
      });

      expect(mockedSearchResult).toMatchObject({
        results: expect.arrayContaining(
          Array(25)
            .fill(null)
            .map((_, i) => ({
              type: 'mytype',
              document: { value: `${i}` },
              rank: i + 1,
              highlight: {
                preTag: '<tag>',
                postTag: '</tag>',
                fields: {
                  foo: 'highlighted <tag>test</tag> result ... another <tag>fragment</tag> result',
                  bar: 'more <tag>test</tag> results',
                },
              },
            })),
        ),
        nextPageCursor: 'MQ==',
      });
    });

    it('should handle index/search type filtering correctly', async () => {
      const elasticSearchQuerySpy = jest.spyOn(clientWrapper, 'search');
      await testSearchEngine.query({
        term: 'testTerm',
        filters: {},
      });

      expect(elasticSearchQuerySpy).toHaveBeenCalled();
      expect(elasticSearchQuerySpy).toHaveBeenCalledWith({
        body: {
          query: {
            bool: {
              should: {
                multi_match: {
                  query: 'testTerm',
                  fields: ['*'],
                  fuzziness: 'auto',
                  prefix_length: 0,
                },
              },
              filter: [],
            },
          },
          highlight: {
            fields: { '*': {} },
            fragment_size: 1000,
            number_of_fragments: 1,
            pre_tags: ['<tag>'],
            post_tags: ['</tag>'],
          },
          from: 0,
          size: 25,
        },
        index: '*__search',
      });

      elasticSearchQuerySpy.mockClear();
    });

    it('should create matchAll query if no term defined', async () => {
      const elasticSearchQuerySpy = jest.spyOn(clientWrapper, 'search');
      await testSearchEngine.query({
        term: '',
        filters: {},
      });

      expect(elasticSearchQuerySpy).toHaveBeenCalled();
      expect(elasticSearchQuerySpy).toHaveBeenCalledWith({
        body: {
          query: {
            bool: {
              should: {
                match_all: {},
              },
              filter: [],
            },
          },
          highlight: {
            fields: { '*': {} },
            fragment_size: 1000,
            number_of_fragments: 1,
            pre_tags: ['<tag>'],
            post_tags: ['</tag>'],
          },
          from: 0,
          size: 25,
        },
        index: '*__search',
      });

      elasticSearchQuerySpy.mockClear();
    });

    it('should query only specified indices if defined', async () => {
      const elasticSearchQuerySpy = jest.spyOn(clientWrapper, 'search');
      await testSearchEngine.query({
        term: '',
        filters: {},
        types: ['test-type'],
      });

      expect(elasticSearchQuerySpy).toHaveBeenCalled();
      expect(elasticSearchQuerySpy).toHaveBeenCalledWith({
        body: {
          query: {
            bool: {
              should: {
                match_all: {},
              },
              filter: [],
            },
          },
          highlight: {
            fields: { '*': {} },
            fragment_size: 1000,
            number_of_fragments: 1,
            pre_tags: ['<tag>'],
            post_tags: ['</tag>'],
          },
          from: 0,
          size: 25,
        },
        index: ['test-type__search'],
      });

      elasticSearchQuerySpy.mockClear();
    });

    it('should throws missing index error', async () => {
      jest.spyOn(clientWrapper, 'search').mockRejectedValue({
        meta: {
          body: {
            error: {
              type: 'index_not_found_exception',
            },
          },
        },
      });

      await expect(
        async () =>
          await testSearchEngine.query({
            term: 'testTerm',
            types: ['unknown'],
            filters: {},
          }),
      ).rejects.toThrow(
        'Missing index for unknown__search. This means there are no documents to search through.',
      );
    });
  });

  describe('indexer', () => {
    beforeEach(async () => {
      await testSearchEngine.setIndexTemplate(customIndexTemplate);
    });

    it('should get indexer', async () => {
      const indexer = await testSearchEngine.getIndexer('test-index');

      expect(indexer).toStrictEqual(indexerMock);
      expect(ElasticSearchSearchEngineIndexer).toHaveBeenCalledWith(
        expect.objectContaining({
          alias: 'test-index__search',
          type: 'test-index',
          indexPrefix: '',
          indexSeparator: '-index__',
          elasticSearchClientWrapper: clientWrapper,
        }),
      );
      expect(indexerMock.on).toHaveBeenCalledWith(
        'error',
        expect.any(Function),
      );
    });

    describe('onError', () => {
      let errorHandler: Function;
      const error = new Error('some error');

      beforeEach(async () => {
        mock.clearAll();
        await testSearchEngine.getIndexer('test-index');
        errorHandler = indexerMock.on.mock.calls[0][1];
      });

      it('should check for and delete expected index', async () => {
        const deleteSpy = jest.fn().mockReturnValue({});
        mock.add({ method: 'DELETE', path: '/expected-index-name' }, deleteSpy);

        await errorHandler(error);

        // Check and delete HTTP requests were made.
        expect(deleteSpy).toHaveBeenCalled();
      });

      it('should retry delete index up to 5 times', async () => {
        // Delete call returns 404
        const deleteSpy = jest.fn().mockReturnValue(
          new errors.ResponseError({
            statusCode: 404,
            body: { status: 404 },
          } as unknown as any),
        );
        mock.add({ method: 'DELETE', path: '/expected-index-name' }, deleteSpy);

        // Call the error handler and advance timers
        jest.useFakeTimers();
        errorHandler(error);
        await advanceTimersByNTimes(10);
        jest.useRealTimers();

        // Check request was made 5 times
        expect(deleteSpy).toHaveBeenCalledTimes(5);
      });
    });
  });

  describe('ElasticSearchSearchEngine.fromConfig', () => {
    it('accesses the clientOptions and highlightOptions config', async () => {
      const esOptions = {
        clientOptions: {
          ssl: {
            rejectUnauthorized: true,
          },
        },
        node: 'http://test-node',
        auth: {
          apiKey: 'key',
        },
      };

      const config = new ConfigReader({});
      const esConfig = new ConfigReader(esOptions);
      jest.spyOn(config, 'getConfig').mockImplementation(() => esConfig);
      const getOptionalConfig = jest.spyOn(esConfig, 'getOptionalConfig');
      const getOptional = jest.spyOn(config, 'getOptional');

      await ElasticSearchSearchEngine.fromConfig({
        logger: mockServices.logger.mock(),
        config,
      });

      expect(getOptionalConfig.mock.calls[0][0]).toEqual('clientOptions');
      expect(getOptional.mock.calls[0][0]).toEqual(
        'search.elasticsearch.highlightOptions',
      );
    });

    it('does not require the clientOptions or highlightOptions config', async () => {
      const config = new ConfigReader({
        search: {
          elasticsearch: {
            node: 'http://test-node',
            auth: {
              apiKey: 'test-key',
            },
          },
        },
      });

      expect(
        async () =>
          await ElasticSearchSearchEngine.fromConfig({
            logger: mockServices.logger.mock(),
            config,
          }),
      ).not.toThrow();
    });
  });
});

describe('decodePageCursor', () => {
  test('should decode page', () => {
    expect(decodePageCursor('MQ==')).toEqual({ page: 1 });
  });

  test('should fallback to first page if empty', () => {
    expect(decodePageCursor()).toEqual({ page: 0 });
  });
});

describe('encodePageCursor', () => {
  test('should encode page', () => {
    expect(encodePageCursor({ page: 1 })).toEqual('MQ==');
  });
});
