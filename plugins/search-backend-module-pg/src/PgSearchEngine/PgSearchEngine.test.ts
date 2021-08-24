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
import { range } from 'lodash';
import { DatabaseStore, PgSearchQuery } from '../database';
import { PgSearchEngine } from './PgSearchEngine';

describe('PgSearchEngine', () => {
  const tx: any = {} as any;
  let searchEngine: PgSearchEngine;
  let database: jest.Mocked<DatabaseStore>;

  beforeEach(() => {
    database = {
      transaction: jest.fn(),
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
        pageCursor: '',
      });

      expect(translatorSpy).toHaveBeenCalledWith({
        term: 'testTerm',
        filters: {},
        pageCursor: '',
      });
    });

    it('should return translated query term', async () => {
      const actualTranslatedQuery = searchEngine.translator({
        term: 'Hello World',
        pageCursor: '',
      }) as PgSearchQuery;

      expect(actualTranslatedQuery).toMatchObject({
        pgTerm: '("Hello" | "Hello":*)&("World" | "World":*)',
      });
    });

    it('should sanitize query term', async () => {
      const actualTranslatedQuery = searchEngine.translator({
        term: 'H&e|l!l*o W\0o(r)l:d',
        pageCursor: '',
      }) as PgSearchQuery;

      expect(actualTranslatedQuery).toMatchObject({
        pgTerm: '("Hello" | "Hello":*)&("World" | "World":*)',
      });
    });

    it('should return translated query with filters', async () => {
      const actualTranslatedQuery = searchEngine.translator({
        term: 'testTerm',
        filters: { kind: 'testKind' },
        types: ['my-filter'],
        pageCursor: '',
      }) as PgSearchQuery;

      expect(actualTranslatedQuery).toMatchObject({
        pgTerm: '("testTerm" | "testTerm":*)',
        fields: { kind: 'testKind' },
        types: ['my-filter'],
      });
    });
  });

  describe('insert', () => {
    it('should insert documents', async () => {
      database.transaction.mockImplementation(fn => fn(tx));

      const documents = [
        { title: 'Hello World', text: 'Lorem Ipsum', location: 'location-1' },
        {
          location: 'location-2',
          text: 'Hello World',
          title: 'Dolor sit amet',
        },
      ];

      await searchEngine.index('my-type', documents);

      expect(database.transaction).toHaveBeenCalledTimes(1);
      expect(database.prepareInsert).toHaveBeenCalledTimes(1);
      expect(database.insertDocuments).toHaveBeenCalledWith(
        tx,
        'my-type',
        documents,
      );
      expect(database.completeInsert).toHaveBeenCalledWith(tx, 'my-type');
    });

    it('should batch insert documents', async () => {
      database.transaction.mockImplementation(fn => fn(tx));

      const documents = range(350).map(i => ({
        title: `Hello World ${i}`,
        text: 'Lorem Ipsum',
        location: `location-${i}`,
      }));

      await searchEngine.index('my-type', documents);

      expect(database.transaction).toHaveBeenCalledTimes(1);
      expect(database.prepareInsert).toHaveBeenCalledTimes(1);
      expect(database.insertDocuments).toBeCalledTimes(4);
      expect(database.completeInsert).toHaveBeenCalledWith(tx, 'my-type');
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
        pageCursor: '',
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
          },
        ],
      });
      expect(database.transaction).toHaveBeenCalledTimes(1);
      expect(database.query).toHaveBeenCalledWith(tx, {
        pgTerm: '("Hello" | "Hello":*)&("World" | "World":*)',
      });
    });
  });
});
