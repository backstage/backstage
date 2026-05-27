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

import { TestDatabases, mockServices } from '@backstage/backend-test-utils';
import { IndexableDocument } from '@backstage/plugin-search-common';
import { PgSearchHighlightOptions } from '../PgSearchEngine';
import { DatabaseDocumentStore } from './DatabaseDocumentStore';
import { randomUUID as uuidv4 } from 'node:crypto';

const highlightOptions: PgSearchHighlightOptions = {
  preTag: '<tag>',
  postTag: '</tag>',
  useHighlight: false,
  maxWords: 35,
  minWords: 15,
  shortWord: 3,
  highlightAll: false,
  maxFragments: 0,
  fragmentDelimiter: ' ... ',
};

jest.setTimeout(60_000);

const unsupportedDatabases = TestDatabases.create({
  ids: ['MYSQL_8', 'POSTGRES_9', 'SQLITE_3'],
});

describe.each(unsupportedDatabases.eachSupportedId())(
  'DatabaseDocumentStore unsupported, %p',
  databaseId => {
    it('should return support state', async () => {
      const knex = await unsupportedDatabases.init(databaseId);
      const supported = await DatabaseDocumentStore.supported(knex);

      expect(supported).toBe(false);
    });

    it('should fail to create', async () => {
      const knex = await unsupportedDatabases.init(databaseId);
      const databaseManager = mockServices.database({ knex });
      await expect(
        async () => await DatabaseDocumentStore.create(databaseManager),
      ).rejects.toThrow();
    });
  },
);

const supportedDatabases = TestDatabases.create({
  ids: ['POSTGRES_14'],
});

describe.each(supportedDatabases.eachSupportedId())(
  'DatabaseDocumentStore supported, %p',
  databaseId => {
    async function createStore() {
      const knex = await supportedDatabases.init(databaseId);
      const databaseManager = mockServices.database({ knex });
      const store = await DatabaseDocumentStore.create(databaseManager);

      return { store, knex };
    }

    it('should return support state', async () => {
      const knex = await supportedDatabases.init(databaseId);
      const supported = await DatabaseDocumentStore.supported(knex);

      expect(supported).toBe(true);
    });

    it('should insert documents', async () => {
      const { store, knex } = await createStore();

      await store.transaction(async tx => {
        await store.prepareInsert(tx);
        await store.insertDocuments(tx, 'my-type', [
          {
            title: 'TITLE 1',
            text: 'TEXT 1',
            location: 'LOCATION-1',
          },
          {
            title: 'TITLE 2',
            text: 'TEXT 2',
            location: 'LOCATION-2',
          },
        ]);
        await store.completeInsert(tx, 'my-type');
      });

      expect(
        await knex.count('*').where('type', 'my-type').from('documents'),
      ).toEqual([{ count: '2' }]);
    });

    it('should insert truncated documents', async () => {
      const { store, knex } = await createStore();

      await store.transaction(async tx => {
        await store.prepareInsert(tx);

        await store.insertDocuments(tx, 'my-type', [
          {
            title: 'TITLE 1',
            text: Array.from({ length: 100000 })
              .map(() => uuidv4()) // text tokens should be unique to overflow the tsvector indexing and trigger truncation
              .join(' '),
            location: 'LOCATION-1',
          },
        ]);
        await store.completeInsert(tx, 'my-type', true);
      });

      expect(
        await knex.count('*').where('type', 'my-type').from('documents'),
      ).toEqual([{ count: '1' }]);
    });

    it('should insert documents in batches', async () => {
      const { store, knex } = await createStore();

      await store.transaction(async tx => {
        await store.prepareInsert(tx);
        await store.insertDocuments(tx, 'my-type', [
          {
            title: 'TITLE 1',
            text: 'TEXT 1',
            location: 'LOCATION-1',
          },
          {
            title: 'TITLE 2',
            text: 'TEXT 2',
            location: 'LOCATION-2',
          },
        ]);
        await store.insertDocuments(tx, 'my-type', [
          {
            title: 'TITLE 3',
            text: 'TEXT 3',
            location: 'LOCATION-3',
          },
          {
            title: 'TITLE 4',
            text: 'TEXT 4',
            location: 'LOCATION-4',
          },
        ]);
        await store.completeInsert(tx, 'my-type');
      });

      expect(
        await knex.count('*').where('type', 'my-type').from('documents'),
      ).toEqual([{ count: '4' }]);
    });

    it('should clear index for type', async () => {
      const { store, knex } = await createStore();

      await store.transaction(async tx => {
        await store.prepareInsert(tx);
        await store.insertDocuments(tx, 'test', [
          {
            title: 'TITLE 1',
            text: 'TEXT 1',
            location: 'LOCATION-1',
          },
        ]);
        await store.completeInsert(tx, 'test');
      });
      await store.transaction(async tx => {
        await store.prepareInsert(tx);
        await store.insertDocuments(tx, 'my-type', [
          {
            title: 'TITLE 1',
            text: 'TEXT 1',
            location: 'LOCATION-1',
          },
          {
            title: 'TITLE 2',
            text: 'TEXT 2',
            location: 'LOCATION-2',
          },
        ]);
        await store.completeInsert(tx, 'my-type');
      });
      await store.transaction(async tx => {
        await store.prepareInsert(tx);
        await store.completeInsert(tx, 'my-type');
      });

      expect(
        await knex.count('*').where('type', 'test').from('documents'),
      ).toEqual([{ count: '1' }]);
      expect(
        await knex.count('*').where('type', 'my-type').from('documents'),
      ).toEqual([{ count: '0' }]);
    });

    it('should return requested range', async () => {
      const { store } = await createStore();

      await store.transaction(async tx => {
        await store.prepareInsert(tx);
        await store.insertDocuments(tx, 'test', [
          {
            title: 'Lorem Ipsum',
            text: 'Hello World',
            location: 'LOCATION-1',
          },
          {
            title: 'Hello World',
            text: 'Around the world',
            location: 'LOCATION-1',
          },
          {
            title: 'Another one',
            text: 'From the next page',
            location: 'LOCATION-1',
          },
        ]);
        await store.completeInsert(tx, 'test');
      });

      const rows = await store.transaction(tx =>
        store.query(tx, {
          pgTerm: 'Hello & World',
          offset: 1,
          limit: 1,
          normalization: 0,
          options: highlightOptions,
        }),
      );

      expect(rows).toEqual([
        {
          total_count: '2',
          document: {
            location: 'LOCATION-1',
            text: 'Hello World',
            title: 'Lorem Ipsum',
          },
          rank: expect.any(Number),
          type: 'test',
        },
      ]);
    });

    it('query by term', async () => {
      const { store } = await createStore();

      await store.transaction(async tx => {
        await store.prepareInsert(tx);
        await store.insertDocuments(tx, 'test', [
          {
            title: 'Lorem Ipsum',
            text: 'Hello World',
            location: 'LOCATION-1',
          },
          {
            title: 'Hello World',
            text: 'Around the world',
            location: 'LOCATION-1',
          },
        ]);
        await store.completeInsert(tx, 'test');
      });

      const rows = await store.transaction(tx =>
        store.query(tx, {
          pgTerm: 'Hello & World',
          offset: 0,
          limit: 25,
          normalization: 0,
          options: highlightOptions,
        }),
      );

      expect(rows).toEqual([
        {
          total_count: '2',
          document: {
            location: 'LOCATION-1',
            text: 'Around the world',
            title: 'Hello World',
          },
          rank: expect.any(Number),
          type: 'test',
        },
        {
          total_count: '2',
          document: {
            location: 'LOCATION-1',
            text: 'Hello World',
            title: 'Lorem Ipsum',
          },
          rank: expect.any(Number),
          type: 'test',
        },
      ]);
    });

    it('query by term for specific type', async () => {
      const { store } = await createStore();

      await store.transaction(async tx => {
        await store.prepareInsert(tx);
        await store.insertDocuments(tx, 'my-type', [
          {
            title: 'Lorem Ipsum',
            text: 'Hello World',
            location: 'LOCATION-1',
          },
        ]);
        await store.completeInsert(tx, 'my-type');
      });
      await store.transaction(async tx => {
        await store.prepareInsert(tx);
        await store.insertDocuments(tx, 'test', [
          {
            title: 'Hello World',
            text: 'Around the world',
            location: 'LOCATION-1',
          },
        ]);
        await store.completeInsert(tx, 'test');
      });

      const rows = await store.transaction(tx =>
        store.query(tx, {
          pgTerm: 'Hello & World',
          types: ['my-type'],
          offset: 0,
          limit: 25,
          normalization: 0,
          options: highlightOptions,
        }),
      );

      expect(rows).toEqual([
        {
          total_count: '1',
          document: {
            location: 'LOCATION-1',
            text: 'Hello World',
            title: 'Lorem Ipsum',
          },
          rank: expect.any(Number),
          type: 'my-type',
        },
      ]);
    });

    it('query by term and filter by field', async () => {
      const { store } = await createStore();

      await store.transaction(async tx => {
        await store.prepareInsert(tx);
        await store.insertDocuments(tx, 'my-type', [
          {
            title: 'Lorem Ipsum',
            text: 'Hello World',
            myField: 'this',
            location: 'LOCATION-1',
          } as unknown as IndexableDocument,
          {
            title: 'Dolor sit amet',
            text: 'Hello World',
            myField: 'that',
            location: 'LOCATION-1',
          } as unknown as IndexableDocument,
          {
            title: 'Hello World',
            text: 'Around the world',
            location: 'LOCATION-1',
          },
        ]);
        await store.completeInsert(tx, 'my-type');
      });

      const rows = await store.transaction(tx =>
        store.query(tx, {
          pgTerm: 'Hello & World',
          fields: { myField: 'this' },
          offset: 0,
          limit: 25,
          normalization: 0,
          options: highlightOptions,
        }),
      );

      expect(rows).toEqual([
        {
          total_count: '1',
          document: {
            location: 'LOCATION-1',
            text: 'Hello World',
            title: 'Lorem Ipsum',
            myField: 'this',
          },
          rank: expect.any(Number),
          type: 'my-type',
        },
      ]);
    });

    it('query by term and filter by field (any of)', async () => {
      const { store } = await createStore();

      await store.transaction(async tx => {
        await store.prepareInsert(tx);
        await store.insertDocuments(tx, 'my-type', [
          {
            title: 'Lorem Ipsum',
            text: 'Hello World',
            myField: 'this',
            location: 'LOCATION-1',
          } as unknown as IndexableDocument,
          {
            title: 'Dolor sit amet',
            text: 'Hello World',
            myField: 'that',
            location: 'LOCATION-1',
          } as unknown as IndexableDocument,
          {
            title: 'Hello World',
            text: 'Around the world',
            location: 'LOCATION-1',
          },
          {
            title: 'Sed ut perspiciatis',
            text: 'Hello World',
            myField: ['that', 'not'],
            location: 'LOCATION-1',
          } as unknown as IndexableDocument,
          {
            title: 'Consectetur adipiscing',
            text: 'Hello World',
            myField: ['that', 'not', 'where'],
            location: 'LOCATION-1',
          } as unknown as IndexableDocument,
        ]);
        await store.completeInsert(tx, 'my-type');
      });

      const rows = await store.transaction(tx =>
        store.query(tx, {
          pgTerm: 'Hello & World',
          fields: { myField: ['this', 'that'] },
          offset: 0,
          limit: 25,
          normalization: 0,
          options: highlightOptions,
        }),
      );

      expect(rows).toEqual([
        {
          total_count: '4',
          document: {
            location: 'LOCATION-1',
            text: 'Hello World',
            title: 'Lorem Ipsum',
            myField: 'this',
          },
          rank: expect.any(Number),
          type: 'my-type',
        },
        {
          total_count: '4',
          document: {
            location: 'LOCATION-1',
            text: 'Hello World',
            title: 'Dolor sit amet',
            myField: 'that',
          },
          rank: expect.any(Number),
          type: 'my-type',
        },
        {
          total_count: '4',
          document: {
            location: 'LOCATION-1',
            text: 'Hello World',
            title: 'Sed ut perspiciatis',
            myField: ['that', 'not'],
          },
          rank: expect.any(Number),
          type: 'my-type',
        },
        {
          total_count: '4',
          document: {
            location: 'LOCATION-1',
            text: 'Hello World',
            title: 'Consectetur adipiscing',
            myField: ['that', 'not', 'where'],
          },
          rank: expect.any(Number),
          type: 'my-type',
        },
      ]);
    });

    it('query by term and filter by fields', async () => {
      const { store } = await createStore();

      await store.transaction(async tx => {
        await store.prepareInsert(tx);
        await store.insertDocuments(tx, 'my-type', [
          {
            title: 'Lorem Ipsum',
            text: 'Hello World',
            myField: 'this',
            otherField: 'another',
            location: 'LOCATION-1',
          } as unknown as IndexableDocument,
          {
            title: 'Dolor sit amet',
            text: 'Hello World',
            myField: 'this',
            otherField: 'unknown',
            location: 'LOCATION-1',
          } as unknown as IndexableDocument,
        ]);
        await store.completeInsert(tx, 'my-type');
      });

      const rows = await store.transaction(tx =>
        store.query(tx, {
          pgTerm: 'Hello & World',
          fields: { myField: 'this', otherField: 'another' },
          offset: 0,
          limit: 25,
          normalization: 0,
          options: highlightOptions,
        }),
      );

      expect(rows).toEqual([
        {
          total_count: '1',
          document: {
            location: 'LOCATION-1',
            text: 'Hello World',
            title: 'Lorem Ipsum',
            myField: 'this',
            otherField: 'another',
          },
          rank: expect.any(Number),
          type: 'my-type',
        },
      ]);
    });

    it('query without term and filter by field', async () => {
      const { store } = await createStore();

      await store.transaction(async tx => {
        await store.prepareInsert(tx);
        await store.insertDocuments(tx, 'my-type', [
          {
            title: 'Lorem Ipsum',
            text: 'Hello World',
            myField: 'this',
            location: 'LOCATION-1',
          } as unknown as IndexableDocument,
          {
            title: 'Dolor sit amet',
            text: 'Hello World',
            myField: 'this',
            location: 'LOCATION-1',
          } as unknown as IndexableDocument,
        ]);
        await store.completeInsert(tx, 'my-type');
      });

      const rows = await store.transaction(tx =>
        store.query(tx, {
          fields: { myField: 'this' },
          offset: 0,
          limit: 25,
          normalization: 0,
          options: highlightOptions,
        }),
      );

      expect(rows).toEqual([
        {
          total_count: '2',
          document: {
            title: 'Lorem Ipsum',
            text: 'Hello World',
            myField: 'this',
            location: 'LOCATION-1',
          } as unknown as IndexableDocument,
          rank: expect.any(Number),
          type: 'my-type',
        },
        {
          total_count: '2',
          document: {
            title: 'Dolor sit amet',
            text: 'Hello World',
            myField: 'this',
            location: 'LOCATION-1',
          } as unknown as IndexableDocument,
          rank: expect.any(Number),
          type: 'my-type',
        },
      ]);
    });

    it('should remove deleted documents and add new ones', async () => {
      const { store, knex } = await createStore();

      await store.transaction(async tx => {
        await store.prepareInsert(tx);
        await store.insertDocuments(tx, 'my-type', [
          {
            title: 'TITLE 1',
            text: 'TEXT 1',
            location: 'LOCATION-1',
          },
          {
            title: 'TITLE 2',
            text: 'TEXT 2',
            location: 'LOCATION-2',
          },
        ]);
        await store.completeInsert(tx, 'my-type');
      });

      await expect(
        knex.count('*').where('type', 'my-type').from('documents'),
      ).resolves.toEqual([{ count: '2' }]);
      const results_pre = await knex
        .select('*')
        .where('type', 'my-type')
        .from('documents');
      expect(results_pre).toHaveLength(2);
      expect(results_pre[0].document.title).toBe('TITLE 1');
      expect(results_pre[0].document.text).toBe('TEXT 1');
      expect(results_pre[1].document.title).toBe('TITLE 2');

      await store.transaction(async tx => {
        await store.prepareInsert(tx);
        await store.insertDocuments(tx, 'my-type', [
          {
            title: 'TITLE 1',
            text: 'TEXT 1 updated',
            location: 'LOCATION-1',
          },
          {
            title: 'TITLE 3',
            text: 'TEXT 3',
            location: 'LOCATION-3',
          },
        ]);
        await store.completeInsert(tx, 'my-type');
      });

      await expect(
        knex.count('*').where('type', 'my-type').from('documents'),
      ).resolves.toEqual([{ count: '2' }]);
      const results_post = await knex
        .select('*')
        .where('type', 'my-type')
        .from('documents');
      expect(results_post).toHaveLength(2);
      expect(results_post[0].document.title).toBe('TITLE 1');
      expect(results_post[0].document.text).toBe('TEXT 1 updated');
      expect(results_post[1].document.title).toBe('TITLE 3');
    });
  },
);
