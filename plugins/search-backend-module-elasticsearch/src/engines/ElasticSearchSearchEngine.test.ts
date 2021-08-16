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

import { getVoidLogger } from '@backstage/backend-common';
import { SearchEngine } from '@backstage/search-common';
import {
  ConcreteElasticSearchQuery,
  ElasticSearchSearchEngine,
} from './ElasticSearchSearchEngine';
import { Client } from '@elastic/elasticsearch';
import Mock from '@elastic/elasticsearch-mock';

class ElasticSearchSearchEngineForTranslatorTests extends ElasticSearchSearchEngine {
  getTranslator() {
    return this.translator;
  }
}

const mock = new Mock();
const client = new Client({
  node: 'http://localhost:9200',
  Connection: mock.getConnection(),
});

describe('ElasticSearchSearchEngine', () => {
  let testSearchEngine: SearchEngine;
  let inspectableSearchEngine: ElasticSearchSearchEngineForTranslatorTests;

  beforeEach(() => {
    testSearchEngine = new ElasticSearchSearchEngine(
      client,
      'search',
      '',
      getVoidLogger(),
    );
    inspectableSearchEngine = new ElasticSearchSearchEngineForTranslatorTests(
      client,
      'search',
      '',
      getVoidLogger(),
    );
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

      expect(translatorSpy).toHaveBeenCalledWith({
        term: 'testTerm',
        filters: {},
      });
    });

    it('should return translated query with 1 filter', async () => {
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        types: ['indexName'],
        term: 'testTerm',
        filters: { kind: 'testKind' },
      }) as ConcreteElasticSearchQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: ['indexName'],
        elasticSearchQuery: expect.any(Object),
      });

      const queryBody = actualTranslatedQuery.elasticSearchQuery;

      expect(queryBody).toEqual({
        query: {
          bool: {
            must: {
              multi_match: {
                query: 'testTerm',
                fields: ['*'],
                fuzziness: 'auto',
                minimum_should_match: 1,
              },
            },
            filter: {
              match: {
                kind: 'testKind',
              },
            },
          },
        },
        from: 0,
        size: 25,
      });
    });

    it('should pass offset and limit', async () => {
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        types: ['indexName'],
        term: 'testTerm',
        offset: 25,
        limit: 50,
      }) as ConcreteElasticSearchQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: ['indexName'],
        elasticSearchQuery: expect.any(Object),
      });

      const queryBody = actualTranslatedQuery.elasticSearchQuery;

      expect(queryBody).toEqual({
        query: {
          bool: {
            filter: [],
            must: {
              multi_match: {
                query: 'testTerm',
                fields: ['*'],
                fuzziness: 'auto',
                minimum_should_match: 1,
              },
            },
          },
        },
        from: 25,
        size: 50,
      });
    });

    it('should have maximum limit of 100', async () => {
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        types: ['indexName'],
        term: 'testTerm',
        offset: 25,
        limit: 500,
      }) as ConcreteElasticSearchQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: ['indexName'],
        elasticSearchQuery: expect.any(Object),
      });

      const queryBody = actualTranslatedQuery.elasticSearchQuery;

      expect(queryBody).toEqual({
        query: {
          bool: {
            filter: [],
            must: {
              multi_match: {
                query: 'testTerm',
                fields: ['*'],
                fuzziness: 'auto',
                minimum_should_match: 1,
              },
            },
          },
        },
        from: 25,
        size: 100,
      });
    });

    it('should return translated query with multiple filters', async () => {
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        types: ['indexName'],
        term: 'testTerm',
        filters: { kind: 'testKind', namespace: 'testNameSpace' },
      }) as ConcreteElasticSearchQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: ['indexName'],
        elasticSearchQuery: expect.any(Object),
      });

      const queryBody = actualTranslatedQuery.elasticSearchQuery;

      expect(queryBody).toEqual({
        query: {
          bool: {
            must: {
              multi_match: {
                query: 'testTerm',
                fields: ['*'],
                fuzziness: 'auto',
                minimum_should_match: 1,
              },
            },
            filter: [
              {
                match: {
                  kind: 'testKind',
                },
              },
              {
                match: {
                  namespace: 'testNameSpace',
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
      }) as ConcreteElasticSearchQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: ['indexName'],
        elasticSearchQuery: expect.any(Object),
      });

      const queryBody = actualTranslatedQuery.elasticSearchQuery;

      expect(queryBody).toEqual({
        query: {
          bool: {
            must: {
              multi_match: {
                query: 'testTerm',
                fields: ['*'],
                fuzziness: 'auto',
                minimum_should_match: 1,
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

    it('should throw if unsupported filter shapes passed in', async () => {
      const translatorUnderTest = inspectableSearchEngine.getTranslator();
      const actualTranslatedQuery = () =>
        translatorUnderTest({
          types: ['indexName'],
          term: 'testTerm',
          filters: { kind: { a: 'b' } },
        }) as ConcreteElasticSearchQuery;
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
      expect(mockedSearchResult).toMatchObject({ results: [], totalCount: 0 });
    });

    it('should handle index/search type filtering correctly', async () => {
      const elasticSearchQuerySpy = jest.spyOn(client, 'search');
      await testSearchEngine.query({
        term: 'testTerm',
        filters: {},
      });

      expect(elasticSearchQuerySpy).toHaveBeenCalled();
      expect(elasticSearchQuerySpy).toHaveBeenCalledWith({
        body: {
          query: {
            bool: {
              must: {
                multi_match: {
                  query: 'testTerm',
                  fields: ['*'],
                  fuzziness: 'auto',
                  minimum_should_match: 1,
                },
              },
              filter: [],
            },
          },
          from: 0,
          size: 25,
        },
        index: '*__search',
      });

      elasticSearchQuerySpy.mockClear();
    });

    it('should create matchAll query if no term defined', async () => {
      const elasticSearchQuerySpy = jest.spyOn(client, 'search');
      await testSearchEngine.query({
        term: '',
        filters: {},
      });

      expect(elasticSearchQuerySpy).toHaveBeenCalled();
      expect(elasticSearchQuerySpy).toHaveBeenCalledWith({
        body: {
          query: {
            bool: {
              must: {
                match_all: {},
              },
              filter: [],
            },
          },
          from: 0,
          size: 25,
        },
        index: '*__search',
      });

      elasticSearchQuerySpy.mockClear();
    });

    it('should query only specified indices if defined', async () => {
      const elasticSearchQuerySpy = jest.spyOn(client, 'search');
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
              must: {
                match_all: {},
              },
              filter: [],
            },
          },
          from: 0,
          size: 25,
        },
        index: ['test-type__search'],
      });

      elasticSearchQuerySpy.mockClear();
    });
  });

  describe('index', () => {
    it('should index document', async () => {
      const indexSpy = jest.spyOn(testSearchEngine, 'index');
      const mockDocuments = [
        {
          title: 'testTerm',
          text: 'testText',
          location: 'test/location',
        },
      ];

      // call index func and ensure the index func was invoked.
      await testSearchEngine.index('test-index', mockDocuments);
      expect(indexSpy).toHaveBeenCalled();
      expect(indexSpy).toHaveBeenCalledWith('test-index', [
        { title: 'testTerm', text: 'testText', location: 'test/location' },
      ]);
    });
  });
});
