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
import lunr from 'lunr';
import {
  IndexableDocument,
  SearchEngine,
} from '@backstage/plugin-search-common';
import {
  ConcreteLunrQuery,
  LunrSearchEngine,
  decodePageCursor,
  encodePageCursor,
  parseHighlightFields,
} from './LunrSearchEngine';
import { LunrSearchEngineIndexer } from './LunrSearchEngineIndexer';
import { TestPipeline } from '../test-utils';

/**
 * Just used to test the default translator shipped with LunrSearchEngine.
 */
class LunrSearchEngineForTests extends LunrSearchEngine {
  getHighlightTags() {
    return {
      pre: this.highlightPreTag,
      post: this.highlightPostTag,
    };
  }
  getDocStore() {
    return this.docStore;
  }
  setDocStore(docStore: Record<string, IndexableDocument>) {
    this.docStore = docStore;
  }
  getLunrIndices() {
    return this.lunrIndices;
  }
  getTranslator() {
    return this.translator;
  }
}

const indexerMock = {
  on: jest.fn(),
  buildIndex: jest.fn(),
  getDocumentStore: jest.fn(),
};
jest.mock('./LunrSearchEngineIndexer', () => ({
  LunrSearchEngineIndexer: jest.fn().mockImplementation(() => indexerMock),
}));

const getActualIndexer = (engine: SearchEngine, index: string) => {
  (LunrSearchEngineIndexer as unknown as jest.Mock).mockImplementationOnce(
    () => {
      const ActualIndexer = jest.requireActual(
        './LunrSearchEngineIndexer',
      ).LunrSearchEngineIndexer;
      return new ActualIndexer();
    },
  );
  return engine.getIndexer(index);
};

describe('LunrSearchEngine', () => {
  let testLunrSearchEngine: SearchEngine;

  beforeEach(() => {
    testLunrSearchEngine = new LunrSearchEngine({ logger: getVoidLogger() });
    jest.clearAllMocks();
  });

  describe('translator', () => {
    it('query translator invoked', async () => {
      // Given: Set a translator spy on the search engine.
      const translatorSpy = jest.fn().mockReturnValue({
        lunrQueryString: '',
        documentTypes: [],
      });
      testLunrSearchEngine.setTranslator(translatorSpy);

      // When: querying the search engine
      await testLunrSearchEngine.query({
        term: 'testTerm',
        filters: {},
        pageCursor: 'MQ==',
      });

      // Then: the translator is invoked with expected args.
      expect(translatorSpy).toHaveBeenCalledWith({
        term: 'testTerm',
        filters: {},
        pageCursor: 'MQ==',
      });
    });

    it('should return translated query', async () => {
      const inspectableSearchEngine = new LunrSearchEngineForTests({
        logger: getVoidLogger(),
      });
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        term: 'testTerm',
        filters: {},
      }) as ConcreteLunrQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: undefined,
        lunrQueryBuilder: expect.any(Function),
        pageSize: 25,
      });

      const query: jest.Mocked<lunr.Query> = {
        allFields: [],
        clauses: [],
        term: jest.fn(),
        clause: jest.fn(),
      };

      actualTranslatedQuery.lunrQueryBuilder.bind(query)(query);

      expect(query.term).toBeCalledWith(lunr.tokenizer('testTerm'), {
        boost: 100,
        usePipeline: true,
      });
      expect(query.term).toBeCalledWith(lunr.tokenizer('testTerm'), {
        boost: 10,
        usePipeline: false,
        wildcard: lunr.Query.wildcard.TRAILING,
      });
      expect(query.term).toBeCalledWith(lunr.tokenizer('testTerm'), {
        boost: 1,
        usePipeline: false,
        editDistance: 2,
      });
    });

    it('should have default offset and limit', async () => {
      const inspectableSearchEngine = new LunrSearchEngineForTests({
        logger: getVoidLogger(),
      });
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        term: 'testTerm',
      }) as ConcreteLunrQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: undefined,
        lunrQueryBuilder: expect.any(Function),
        pageSize: 25,
      });

      const query: jest.Mocked<lunr.Query> = {
        allFields: [],
        clauses: [],
        term: jest.fn(),
        clause: jest.fn(),
      };

      actualTranslatedQuery.lunrQueryBuilder.bind(query)(query);

      expect(query.term).toBeCalledWith(lunr.tokenizer('testTerm'), {
        boost: 100,
        usePipeline: true,
      });
      expect(query.term).toBeCalledWith(lunr.tokenizer('testTerm'), {
        boost: 10,
        usePipeline: false,
        wildcard: lunr.Query.wildcard.TRAILING,
      });
      expect(query.term).toBeCalledWith(lunr.tokenizer('testTerm'), {
        boost: 1,
        usePipeline: false,
        editDistance: 2,
      });
    });

    it('should return translated query with 1 filter', async () => {
      const inspectableSearchEngine = new LunrSearchEngineForTests({
        logger: getVoidLogger(),
      });
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        term: 'testTerm',
        filters: { kind: 'testKind' },
      }) as ConcreteLunrQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: undefined,
        lunrQueryBuilder: expect.any(Function),
      });

      const query: jest.Mocked<lunr.Query> = {
        allFields: ['kind'],
        clauses: [],
        term: jest.fn(),
        clause: jest.fn(),
      };

      actualTranslatedQuery.lunrQueryBuilder.bind(query)(query);

      expect(query.term).toBeCalledWith(lunr.tokenizer('testTerm'), {
        boost: 100,
        usePipeline: true,
      });
      expect(query.term).toBeCalledWith(lunr.tokenizer('testTerm'), {
        boost: 10,
        usePipeline: false,
        wildcard: lunr.Query.wildcard.TRAILING,
      });
      expect(query.term).toBeCalledWith(lunr.tokenizer('testTerm'), {
        boost: 1,
        usePipeline: false,
        editDistance: 2,
      });
      expect(query.term).toBeCalledWith(lunr.tokenizer('testKind'), {
        fields: ['kind'],
        presence: lunr.Query.presence.REQUIRED,
      });
    });

    it('should handle single-item array filter as scalar value', async () => {
      const inspectableSearchEngine = new LunrSearchEngineForTests({
        logger: getVoidLogger(),
      });
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        term: 'testTerm',
        filters: { kind: ['testKind'] },
      }) as ConcreteLunrQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: undefined,
        lunrQueryBuilder: expect.any(Function),
      });

      const query: jest.Mocked<lunr.Query> = {
        allFields: ['kind'],
        clauses: [],
        term: jest.fn(),
        clause: jest.fn(),
      };

      actualTranslatedQuery.lunrQueryBuilder.bind(query)(query);

      expect(query.term).toBeCalledWith(lunr.tokenizer('testKind'), {
        fields: ['kind'],
        presence: lunr.Query.presence.REQUIRED,
      });
    });

    it('should return translated query with multiple filters', async () => {
      const inspectableSearchEngine = new LunrSearchEngineForTests({
        logger: getVoidLogger(),
      });
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        term: 'testTerm',
        filters: { kind: 'testKind', namespace: 'testNameSpace' },
      }) as ConcreteLunrQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: undefined,
        lunrQueryBuilder: expect.any(Function),
      });

      const query: jest.Mocked<lunr.Query> = {
        allFields: ['kind', 'namespace'],
        clauses: [],
        term: jest.fn(),
        clause: jest.fn(),
      };

      actualTranslatedQuery.lunrQueryBuilder.bind(query)(query);

      expect(query.term).toBeCalledWith(lunr.tokenizer('testTerm'), {
        boost: 100,
        usePipeline: true,
      });
      expect(query.term).toBeCalledWith(lunr.tokenizer('testTerm'), {
        boost: 10,
        usePipeline: false,
        wildcard: lunr.Query.wildcard.TRAILING,
      });
      expect(query.term).toBeCalledWith(lunr.tokenizer('testTerm'), {
        boost: 1,
        usePipeline: false,
        editDistance: 2,
      });
      expect(query.term).toBeCalledWith(lunr.tokenizer('testKind'), {
        fields: ['kind'],
        presence: lunr.Query.presence.REQUIRED,
      });
      expect(query.term).toBeCalledWith(lunr.tokenizer('testNameSpace'), {
        fields: ['namespace'],
        presence: lunr.Query.presence.REQUIRED,
      });
    });

    it('should throw if translated query references missing field', async () => {
      const inspectableSearchEngine = new LunrSearchEngineForTests({
        logger: getVoidLogger(),
      });
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        term: 'testTerm',
        filters: { kind: 'testKind' },
      }) as ConcreteLunrQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: undefined,
        lunrQueryBuilder: expect.any(Function),
      });

      const query: jest.Mocked<lunr.Query> = {
        allFields: [],
        clauses: [],
        term: jest.fn(),
        clause: jest.fn(),
      };

      expect(() =>
        actualTranslatedQuery.lunrQueryBuilder.bind(query)(query),
      ).toThrow();
    });
  });

  describe('query', () => {
    it('should perform search query and return 0 results on empty index', async () => {
      const querySpy = jest.spyOn(testLunrSearchEngine, 'query');

      // Perform search query and ensure the query func was invoked.
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'testTerm',
        filters: {},
      });

      expect(querySpy).toHaveBeenCalled();
      expect(querySpy).toHaveBeenCalledWith({
        term: 'testTerm',
        filters: {},
      });

      // Should return 0 results as nothing is indexed here
      expect(mockedSearchResult).toMatchObject({
        results: [],
        nextPageCursor: undefined,
      });
    });

    it('should perform search query and return 0 results on no match', async () => {
      const mockDocuments = [
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location',
        },
      ];

      // Mock indexing of 1 document
      const indexer = await getActualIndexer(
        testLunrSearchEngine,
        'test-index',
      );
      await TestPipeline.withSubject(indexer)
        .withDocuments(mockDocuments)
        .execute();

      // Perform search query
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'unknown',
        filters: {},
      });

      // Should return 0 results as we are mocking the indexing of 1 document but with no match on the fields
      expect(mockedSearchResult).toMatchObject({
        results: [],
        nextPageCursor: undefined,
      });
    });

    it('should perform search query and return all results on empty term', async () => {
      const mockDocuments = [
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location',
        },
      ];

      // Mock indexing of 1 document
      const indexer = await getActualIndexer(
        testLunrSearchEngine,
        'test-index',
      );
      await TestPipeline.withSubject(indexer)
        .withDocuments(mockDocuments)
        .execute();

      // Perform search query
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: '',
        filters: {},
      });

      expect(mockedSearchResult).toMatchObject({
        results: [
          {
            document: {
              title: 'testTitle',
              text: 'testText',
              location: 'test/location',
            },
            type: 'test-index',
            rank: 1,
          },
        ],
        nextPageCursor: undefined,
      });
    });

    it('should perform search query and return search results on match', async () => {
      const mockDocuments = [
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location',
        },
      ];

      // Mock indexing of 1 document
      const indexer = await getActualIndexer(
        testLunrSearchEngine,
        'test-index',
      );
      await TestPipeline.withSubject(indexer)
        .withDocuments(mockDocuments)
        .execute();

      // Perform search query
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'testTitle',
        filters: {},
      });

      expect(mockedSearchResult).toMatchObject({
        results: [
          {
            document: {
              title: 'testTitle',
              text: 'testText',
              location: 'test/location',
            },
            rank: 1,
          },
        ],
        nextPageCursor: undefined,
      });
    });

    it('should perform search query and return highlight metadata on match', async () => {
      const inspectableSearchEngine = new LunrSearchEngineForTests({
        logger: getVoidLogger(),
      });

      const mockDocuments = [
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location',
        },
      ];

      // Mock indexing of 1 document
      const indexer = await getActualIndexer(
        inspectableSearchEngine,
        'test-index',
      );
      await TestPipeline.withSubject(indexer)
        .withDocuments(mockDocuments)
        .execute();

      // Perform search query
      const mockedSearchResult = await inspectableSearchEngine.query({
        term: 'test',
        filters: {},
      });

      const highlightTags = inspectableSearchEngine.getHighlightTags();
      expect(mockedSearchResult).toMatchObject({
        results: [
          {
            document: {
              title: 'testTitle',
              text: 'testText',
              location: 'test/location',
            },
            highlight: {
              preTag: highlightTags.pre,
              postTag: highlightTags.post,
              fields: {
                title: `${highlightTags.pre}testTitle${highlightTags.post}`,
                text: `${highlightTags.pre}testText${highlightTags.post}`,
                location: `${highlightTags.pre}test/location${highlightTags.post}`,
              },
            },
            rank: 1,
          },
        ],
        nextPageCursor: undefined,
      });
    });

    it('should perform search query and return search results on partial match', async () => {
      const mockDocuments = [
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location',
        },
      ];

      // Mock indexing of 1 document
      const indexer = await getActualIndexer(
        testLunrSearchEngine,
        'test-index',
      );
      await TestPipeline.withSubject(indexer)
        .withDocuments(mockDocuments)
        .execute();

      // Perform search query
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'testTitle',
        filters: {},
      });

      expect(mockedSearchResult).toMatchObject({
        results: [
          {
            document: {
              title: 'testTitle',
              text: 'testText',
              location: 'test/location',
            },
            rank: 1,
          },
        ],
        nextPageCursor: undefined,
      });
    });

    it('should perform search query and return search results on fuzzy match', async () => {
      const mockDocuments = [
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location',
        },
      ];

      // Mock indexing of 1 document
      const indexer = await getActualIndexer(
        testLunrSearchEngine,
        'test-index',
      );
      await TestPipeline.withSubject(indexer)
        .withDocuments(mockDocuments)
        .execute();

      // Perform search query
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'testTitel', // Intentional typo
        filters: {},
      });

      // Should return 1 result as we are mocking the indexing of 1 document with match on the title field
      expect(mockedSearchResult).toMatchObject({
        results: [
          {
            document: {
              title: 'testTitle',
              text: 'testText',
              location: 'test/location',
            },
            rank: 1,
          },
        ],
        nextPageCursor: undefined,
      });
    });

    it('should perform search query with trailing punctuation and return search results on match (trimming)', async () => {
      const mockDocuments = [
        {
          title: 'testTitle',
          text: 'Hello World.',
          location: 'test/location',
        },
      ];

      // Mock indexing of 1 document
      const indexer = await getActualIndexer(
        testLunrSearchEngine,
        'test-index',
      );
      await TestPipeline.withSubject(indexer)
        .withDocuments(mockDocuments)
        .execute();

      // Perform search query
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'World',
        filters: {},
      });

      // Should return 1 result as we are mocking the indexing of 1 document with match on the title field
      expect(mockedSearchResult).toMatchObject({
        results: [
          {
            document: {
              title: 'testTitle',
              text: 'Hello World.',
              location: 'test/location',
            },
            rank: 1,
          },
        ],
        nextPageCursor: undefined,
      });
    });

    it('should perform search query by similar words and return search results on match (stemming)', async () => {
      const mockDocuments = [
        {
          title: 'testTitle',
          text: 'Searching',
          location: 'test/location',
        },
      ];

      // Mock indexing of 1 document
      const indexer = await getActualIndexer(
        testLunrSearchEngine,
        'test-index',
      );
      await TestPipeline.withSubject(indexer)
        .withDocuments(mockDocuments)
        .execute();

      // Perform search query
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'Search',
        filters: {},
      });

      // Should return 1 result as we are mocking the indexing of 1 document with match on the title field
      expect(mockedSearchResult).toMatchObject({
        results: [
          {
            document: {
              title: 'testTitle',
              text: 'Searching',
              location: 'test/location',
            },
            rank: 1,
          },
        ],
        nextPageCursor: undefined,
      });
    });

    it('should perform search query and return search results on match with filters', async () => {
      const mockDocuments = [
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location',
        },
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location2',
        },
      ];

      // Mock indexing of 2 documents
      const indexer = await getActualIndexer(
        testLunrSearchEngine,
        'test-index',
      );
      await TestPipeline.withSubject(indexer)
        .withDocuments(mockDocuments)
        .execute();

      // Perform search query
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'testTitle',
        filters: { location: 'test/location2' },
      });

      // Should return 1 of 2 results as we are
      // 1. Mocking the indexing of 2 documents
      // 2. Matching on the location field with the filter { location: 'test/location2' }
      expect(mockedSearchResult).toMatchObject({
        results: [
          {
            document: {
              title: 'testTitle',
              text: 'testText',
              location: 'test/location2',
            },
            rank: 1,
          },
        ],
        nextPageCursor: undefined,
      });
    });

    it('should perform search query and return search results on match with filter and not fail on missing field', async () => {
      const mockDocuments = [
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location',
        },
      ];

      const mockDocuments2 = [
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location2',
          extraField: 'testExtraField',
        },
      ];

      // Mock 2 indices with 1 document each
      const indexer1 = await getActualIndexer(
        testLunrSearchEngine,
        'test-index',
      );
      const indexer2 = await getActualIndexer(
        testLunrSearchEngine,
        'test-index-2',
      );
      await TestPipeline.withSubject(indexer1)
        .withDocuments(mockDocuments)
        .execute();
      await TestPipeline.withSubject(indexer2)
        .withDocuments(mockDocuments2)
        .execute();

      // Perform search query scoped to "test-index-2" with a filter on the field "extraField"
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'testTitle',
        filters: { extraField: 'testExtraField' },
      });

      expect(mockedSearchResult).toMatchObject({
        results: [
          {
            document: {
              title: 'testTitle',
              text: 'testText',
              location: 'test/location2',
              extraField: 'testExtraField',
            },
            rank: 1,
          },
        ],
        nextPageCursor: undefined,
      });
    });

    it('should perform search query and return search results on match with filters that include a : character', async () => {
      const mockDocuments = [
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test:location',
        },
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test:location2',
        },
      ];

      // Mock indexing of 2 documents
      const indexer = await getActualIndexer(
        testLunrSearchEngine,
        'test-index',
      );
      await TestPipeline.withSubject(indexer)
        .withDocuments(mockDocuments)
        .execute();

      // Perform search query
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'testTitle',
        filters: { location: 'test:location2' },
      });

      // Should return 1 of 2 results as we are
      // 1. Mocking the indexing of 2 documents
      // 2. Matching on the location field with the filter { location: 'test:location2' }
      expect(mockedSearchResult).toMatchObject({
        results: [
          {
            document: {
              title: 'testTitle',
              text: 'testText',
              location: 'test:location2',
            },
            rank: 1,
          },
        ],
        nextPageCursor: undefined,
      });
    });

    it('should perform search query and return search results on match, scoped to specific index', async () => {
      const mockDocuments = [
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location',
        },
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location2',
        },
      ];

      const mockDocuments2 = [
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location3',
        },
        {
          title: 'testTitle',
          text: 'testText',
          location: 'test/location4',
        },
      ];

      // Mock 2 indices with 2 documents each
      const indexer = await getActualIndexer(
        testLunrSearchEngine,
        'test-index',
      );
      await TestPipeline.withSubject(indexer)
        .withDocuments(mockDocuments)
        .execute();
      const indexer2 = await getActualIndexer(
        testLunrSearchEngine,
        'test-index-2',
      );
      await TestPipeline.withSubject(indexer2)
        .withDocuments(mockDocuments2)
        .execute();

      // Perform search query scoped to "test-index-2"
      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'testTitle',
        types: ['test-index-2'],
      });

      expect(mockedSearchResult).toMatchObject({
        results: [
          {
            document: {
              location: 'test/location3',
              text: 'testText',
              title: 'testTitle',
            },
            rank: 1,
          },
          {
            document: {
              location: 'test/location4',
              text: 'testText',
              title: 'testTitle',
            },
            rank: 2,
          },
        ],
        nextPageCursor: undefined,
      });
    });

    it('should return next page cursor if results exceed page size', async () => {
      const mockDocuments = Array(30)
        .fill(0)
        .map((_, i) => ({
          title: 'testTitle',
          text: 'testText',
          location: `test/location/${i}`,
        }));

      const indexer = await getActualIndexer(
        testLunrSearchEngine,
        'test-index',
      );
      await TestPipeline.withSubject(indexer)
        .withDocuments(mockDocuments)
        .execute();

      const mockedSearchResult = await testLunrSearchEngine.query({
        term: 'testTitle',
        types: ['test-index'],
      });

      expect(mockedSearchResult).toMatchObject({
        results: Array(25)
          .fill(0)
          .map((_, i) => ({
            document: {
              title: 'testTitle',
              text: 'testText',
              location: `test/location/${i}`,
            },
            type: 'test-index',
            rank: i + 1,
          })),
        nextPageCursor: 'MQ==',
        previousPageCursor: undefined,
      });
    });
  });

  it('should return previous page cursor if on another page', async () => {
    const mockDocuments = Array(30)
      .fill(0)
      .map((_, i) => ({
        title: 'testTitle',
        text: 'testText',
        location: `test/location/${i}`,
      }));

    const indexer = await getActualIndexer(testLunrSearchEngine, 'test-index');
    await TestPipeline.withSubject(indexer)
      .withDocuments(mockDocuments)
      .execute();

    const mockedSearchResult = await testLunrSearchEngine.query({
      term: 'testTitle',
      types: ['test-index'],
      pageCursor: 'MQ==',
    });

    expect(mockedSearchResult).toMatchObject({
      results: Array(30)
        .fill(0)
        .map((_, i) => ({
          document: {
            title: 'testTitle',
            text: 'testText',
            location: `test/location/${i}`,
          },
          type: 'test-index',
          rank: i + 1,
        }))
        .slice(25),
      nextPageCursor: undefined,
      previousPageCursor: 'MA==',
    });
  });

  describe('index', () => {
    it('should get indexer', async () => {
      const indexer = await testLunrSearchEngine.getIndexer('test-index');
      expect(LunrSearchEngineIndexer).toHaveBeenCalled();
      expect(indexer.on).toHaveBeenCalledWith('close', expect.any(Function));
    });

    it('should manage indices and docs on close', async () => {
      const doc = { title: 'A doc', text: 'test', location: 'some-location' };

      // Set up an inspectable search engine to pre-set some data.
      const inspectableSearchEngine = new LunrSearchEngineForTests({
        logger: getVoidLogger(),
      });
      inspectableSearchEngine.setDocStore({ 'existing-location': doc });

      // Mock methods called by close handler.
      indexerMock.buildIndex.mockReturnValueOnce('expected-index');
      indexerMock.getDocumentStore.mockReturnValueOnce({
        'new-location': doc,
      });

      // Get the indexer and invoke its close handler.
      await inspectableSearchEngine.getIndexer('test-index');
      const onClose = indexerMock.on.mock.calls[0][1] as Function;
      onClose();

      // Ensure mocked methods were called.
      expect(indexerMock.buildIndex).toHaveBeenCalled();
      expect(indexerMock.getDocumentStore).toHaveBeenCalled();

      // Ensure the lunr index was written to the search engine.
      expect(inspectableSearchEngine.getLunrIndices()).toStrictEqual({
        'test-index': 'expected-index',
      });

      // Ensure documents are merged into the existing store.
      expect(inspectableSearchEngine.getDocStore()).toStrictEqual({
        'existing-location': doc,
        'new-location': doc,
      });
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

describe('parseHighlightFields', () => {
  it('should parse highlight metadata', () => {
    expect(
      parseHighlightFields({
        preTag: '<>',
        postTag: '</>',
        doc: { foo: 'abc def', bar: 'ghi jkl' },
        positionMetadata: {
          test: {
            foo: {
              position: [[0, 3]],
            },
          },
          anotherTest: {
            foo: {
              position: [[4, 3]],
            },
            bar: {
              position: [[4, 3]],
            },
          },
        },
      }),
    ).toEqual({
      foo: '<>abc</> <>def</>',
      bar: 'ghi <>jkl</>',
    });
  });
});
