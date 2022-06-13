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
import { DatabaseStore } from '../database';
import {
  ConcretePgSearchQuery,
  decodePageCursor,
  encodePageCursor,
  PgSearchEngine,
} from './PgSearchEngine';
import { PgSearchEngineIndexer } from './PgSearchEngineIndexer';

jest.mock('./PgSearchEngineIndexer', () => ({
  PgSearchEngineIndexer: jest
    .fn()
    .mockImplementation(async () => 'the-expected-indexer'),
}));

describe('PgSearchEngine', () => {
  const tx: any = {} as any;
  let searchEngine: PgSearchEngine;
  let database: jest.Mocked<DatabaseStore>;

  beforeEach(() => {
    database = {
      transaction: jest.fn(),
      getTransaction: jest.fn(),
      insertDocuments: jest.fn(),
      query: jest.fn(),
      completeInsert: jest.fn(),
      prepareInsert: jest.fn(),
    };
    searchEngine = new PgSearchEngine(database);
  });

  describe('translator', () => {
    it('query translator invoked', async () => {
      database.transaction.mockResolvedValue([]);
      const translatorSpy = jest.fn().mockReturnValue({
        pgSearchTerm: 'testTerm',
      });
      searchEngine.setTranslator(translatorSpy);

      await searchEngine.query({
        term: 'testTerm',
        filters: {},
      });

      expect(translatorSpy).toHaveBeenCalledWith({
        term: 'testTerm',
        filters: {},
      });
    });

    it('should pass page cursor', async () => {
      const actualTranslatedQuery = searchEngine.translator({
        term: 'Hello',
        pageCursor: 'MQ==',
      });

      expect(actualTranslatedQuery).toMatchObject({
        pgQuery: {
          pgTerm: '("Hello" | "Hello":*)',
          offset: 25,
          limit: 26,
        },
        pageSize: 25,
      });
    });

    it('should return translated query term', async () => {
      const actualTranslatedQuery = searchEngine.translator({
        term: 'Hello World',
      });

      expect(actualTranslatedQuery).toMatchObject({
        pgQuery: {
          pgTerm: '("Hello" | "Hello":*)&("World" | "World":*)',
          offset: 0,
          limit: 26,
        },
        pageSize: 25,
      });
    });

    it('should sanitize query term', async () => {
      const actualTranslatedQuery = searchEngine.translator({
        term: 'H&e|l!l*o W\0o(r)l:d',
        pageCursor: '',
      }) as ConcretePgSearchQuery;

      expect(actualTranslatedQuery).toMatchObject({
        pgQuery: {
          pgTerm: '("Hello" | "Hello":*)&("World" | "World":*)',
        },
        pageSize: 25,
      });
    });

    it('should return translated query with filters', async () => {
      const actualTranslatedQuery = searchEngine.translator({
        term: 'testTerm',
        filters: { kind: 'testKind' },
        types: ['my-filter'],
      });

      expect(actualTranslatedQuery).toMatchObject({
        pgQuery: {
          pgTerm: '("testTerm" | "testTerm":*)',
          fields: { kind: 'testKind' },
          types: ['my-filter'],
          offset: 0,
          limit: 26,
        },
        pageSize: 25,
      });
    });
  });

  describe('index', () => {
    it('should instantiate indexer', async () => {
      const indexer = await searchEngine.getIndexer('my-type');

      // Indexer instantiated with expected args.
      expect(PgSearchEngineIndexer).toHaveBeenCalledWith(
        expect.objectContaining({
          batchSize: 1000,
          type: 'my-type',
          databaseStore: database,
        }),
      );

      // Indexer is as expected.
      expect(indexer).toBe('the-expected-indexer');
    });
  });

  describe('query', () => {
    it('should perform query', async () => {
      database.transaction.mockImplementation(fn => fn(tx));
      database.query.mockResolvedValue([
        {
          document: {
            title: 'Hello World',
            text: 'Lorem Ipsum',
            location: 'location-1',
          },
          type: 'my-type',
        },
      ]);

      const results = await searchEngine.query({
        term: 'Hello World',
      });

      expect(results).toEqual({
        results: [
          {
            document: {
              title: 'Hello World',
              text: 'Lorem Ipsum',
              location: 'location-1',
            },
            type: 'my-type',
            rank: 1,
          },
        ],
        nextPageCursor: undefined,
      });
      expect(database.transaction).toHaveBeenCalledTimes(1);
      expect(database.query).toHaveBeenCalledWith(tx, {
        pgTerm: '("Hello" | "Hello":*)&("World" | "World":*)',
        offset: 0,
        limit: 26,
      });
    });

    it('should include next page cursor if results exceed page size', async () => {
      database.transaction.mockImplementation(fn => fn(tx));
      database.query.mockResolvedValue(
        Array(30)
          .fill(0)
          .map((_, i) => ({
            document: {
              title: 'Hello World',
              text: 'Lorem Ipsum',
              location: `location-${i}`,
            },
            type: 'my-type',
          })),
      );

      const results = await searchEngine.query({
        term: 'Hello World',
      });

      expect(results).toEqual({
        results: Array(25)
          .fill(0)
          .map((_, i) => ({
            document: {
              title: 'Hello World',
              text: 'Lorem Ipsum',
              location: `location-${i}`,
            },
            type: 'my-type',
            rank: i + 1,
          })),
        nextPageCursor: 'MQ==',
      });
      expect(database.transaction).toHaveBeenCalledTimes(1);
      expect(database.query).toHaveBeenCalledWith(tx, {
        pgTerm: '("Hello" | "Hello":*)&("World" | "World":*)',
        offset: 0,
        limit: 26,
      });
    });

    it('should include previous page cursor if on another page', async () => {
      database.transaction.mockImplementation(fn => fn(tx));
      database.query.mockResolvedValue(
        Array(30)
          .fill(0)
          .map((_, i) => ({
            document: {
              title: 'Hello World',
              text: 'Lorem Ipsum',
              location: `location-${i}`,
            },
            type: 'my-type',
          }))
          .slice(25),
      );

      const results = await searchEngine.query({
        term: 'Hello World',
        pageCursor: 'MQ==',
      });

      expect(results).toEqual({
        results: Array(30)
          .fill(0)
          .map((_, i) => ({
            document: {
              title: 'Hello World',
              text: 'Lorem Ipsum',
              location: `location-${i}`,
            },
            type: 'my-type',
            rank: i + 1,
          }))
          .slice(25),
        previousPageCursor: 'MA==',
      });
      expect(database.transaction).toHaveBeenCalledTimes(1);
      expect(database.query).toHaveBeenCalledWith(tx, {
        pgTerm: '("Hello" | "Hello":*)&("World" | "World":*)',
        offset: 25,
        limit: 26,
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
