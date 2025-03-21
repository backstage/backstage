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

import {
  TestDatabaseId,
  TestDatabases,
  mockServices,
} from '@backstage/backend-test-utils';
import { IndexableDocument } from '@backstage/plugin-search-common';
import { PgSearchHighlightOptions } from '../PgSearchEngine';
import { DatabaseDocumentStore } from './DatabaseDocumentStore';

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

describe('DatabaseDocumentStore', () => {
  describe('unsupported', () => {
    const databases = TestDatabases.create({
      ids: ['MYSQL_8', 'POSTGRES_9', 'SQLITE_3'],
    });

    it.each(databases.eachSupportedId())(
      'should return support state, %p',
      async databaseId => {
        const knex = await databases.init(databaseId);
        const supported = await DatabaseDocumentStore.supported(knex);

        expect(supported).toBe(false);
      },
    );

    it.each(databases.eachSupportedId())(
      'should fail to create, %p',
      async databaseId => {
        const knex = await databases.init(databaseId);
        const databaseManager = mockServices.database({ knex });
        await expect(
          async () => await DatabaseDocumentStore.create(databaseManager),
        ).rejects.toThrow();
      },
    );
  });

  describe('supported', () => {
    const databases = TestDatabases.create({
      ids: ['POSTGRES_13'],
    });

    async function createStore(databaseId: TestDatabaseId) {
      const knex = await databases.init(databaseId);
      const databaseManager = mockServices.database({ knex });
      const store = await DatabaseDocumentStore.create(databaseManager);

      return { store, knex };
    }

    if (databases.eachSupportedId().length < 1) {
      // Only execute tests if at least on database engine is available, e.g. if
      // not in CI=1. it.each doesn't support an empty array.
      return;
    }

    it.each(databases.eachSupportedId())(
      'should return support state, %p',
      async databaseId => {
        const knex = await databases.init(databaseId);
        const supported = await DatabaseDocumentStore.supported(knex);

        expect(supported).toBe(true);
      },
    );

    it.each(databases.eachSupportedId())(
      'should insert documents, %p',
      async databaseId => {
        const { store, knex } = await createStore(databaseId);

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
      },
    );

    it.each(databases.eachSupportedId())(
      'should insert documents in batches, %p',
      async databaseId => {
        const { store, knex } = await createStore(databaseId);

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
      },
    );

    it.each(databases.eachSupportedId())(
      'should clear index for type, %p',
      async databaseId => {
        const { store, knex } = await createStore(databaseId);

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
      },
    );

    it.each(databases.eachSupportedId())(
      'should return requested range, %p',
      async databaseId => {
        const { store } = await createStore(databaseId);

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
            document: {
              location: 'LOCATION-1',
              text: 'Hello World',
              title: 'Lorem Ipsum',
            },
            rank: expect.any(Number),
            type: 'test',
          },
        ]);
      },
    );

    it.each(databases.eachSupportedId())(
      'query by term, %p',
      async databaseId => {
        const { store } = await createStore(databaseId);

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
            document: {
              location: 'LOCATION-1',
              text: 'Around the world',
              title: 'Hello World',
            },
            rank: expect.any(Number),
            type: 'test',
          },
          {
            document: {
              location: 'LOCATION-1',
              text: 'Hello World',
              title: 'Lorem Ipsum',
            },
            rank: expect.any(Number),
            type: 'test',
          },
        ]);
      },
    );

    it.each(databases.eachSupportedId())(
      'query by term for specific type, %p',
      async databaseId => {
        const { store } = await createStore(databaseId);

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
            document: {
              location: 'LOCATION-1',
              text: 'Hello World',
              title: 'Lorem Ipsum',
            },
            rank: expect.any(Number),
            type: 'my-type',
          },
        ]);
      },
    );

    it.each(databases.eachSupportedId())(
      'query by term and filter by field, %p',
      async databaseId => {
        const { store } = await createStore(databaseId);

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
      },
    );

    it.each(databases.eachSupportedId())(
      'query by term and filter by field (any of), %p',
      async databaseId => {
        const { store } = await createStore(databaseId);

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
      },
    );

    it.each(databases.eachSupportedId())(
      'query by term and filter by fields, %p',
      async databaseId => {
        const { store } = await createStore(databaseId);

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
      },
    );

    it.each(databases.eachSupportedId())(
      'query without term and filter by field, %p',
      async databaseId => {
        const { store } = await createStore(databaseId);

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
      },
    );

    it.each(databases.eachSupportedId())(
      'should remove deleted documents and add new ones, %p',
      async databaseId => {
        const { store, knex } = await createStore(databaseId);

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
      },
    );
  });
});
