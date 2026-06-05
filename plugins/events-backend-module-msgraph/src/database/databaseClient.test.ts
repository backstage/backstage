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

import { TestDatabases } from '@backstage/backend-test-utils';
import type { Knex } from 'knex';
import { DateTime } from 'luxon';
import {
  MicrosoftGraphSubscriptionsDatabaseClient,
  type MicrosoftGraphSubscriptionsDatabaseOperations,
  DB_SUBSCRIPTIONS_TABLE,
  type DbSubscriptionsRow,
} from './databaseClient';
import { applyDatabaseMigrations } from './migrations';

const exampleRow1: DbSubscriptionsRow = {
  id: 'id1',
  resource: 'resource1',
  created_at: DateTime.now().toUTC().toJSDate(),
  expires_at: DateTime.now().plus({ hour: 1 }).toUTC().toJSDate(),
  token_hash: 'somehash',
  token_salt: 'somesalt',
};
const exampleRow2: DbSubscriptionsRow = {
  id: 'id2',
  resource: 'resource2',
  created_at: DateTime.now().toUTC().toJSDate(),
  expires_at: DateTime.now().plus({ hour: 2 }).toUTC().toJSDate(),
  token_hash: 'somehash',
  token_salt: 'somesalt',
};

describe('MicrosoftGraphSubscriptionsDatabaseClient', () => {
  const databases = TestDatabases.create({
    ids: [
      'SQLITE_3',
      // 'MYSQL_8', 'POSTGRES_13', 'POSTGRES_17'
    ],
  });

  describe.each(databases.eachSupportedId())('For DB %p', databaseId => {
    let knex: Knex<DbSubscriptionsRow>;
    let target: MicrosoftGraphSubscriptionsDatabaseClient;

    beforeEach(async () => {
      knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);
      target = MicrosoftGraphSubscriptionsDatabaseClient.create(knex);
    });

    describe('insert', () => {
      it('should insert a row', async () => {
        await target.insert(exampleRow1);

        const records = await knex(DB_SUBSCRIPTIONS_TABLE).select();
        expect(records.length).toEqual(1);
        expect(records[0].id).toEqual(exampleRow1.id);
      });
    });

    describe('read operations', () => {
      beforeEach(async () => {
        await target.insert(exampleRow1);
        await target.insert(exampleRow2);
      });

      describe('getAll', () => {
        it('should return all rows', async () => {
          const result = await target.getAll();
          expect(result[0].id).toEqual(exampleRow1.id);
          expect(result[1].id).toEqual(exampleRow2.id);
        });
      });

      describe('getById', () => {
        it('should return specific rows', async () => {
          const result1 = await target.getById('id1');
          expect(result1?.id).toEqual(exampleRow1.id);

          const result2 = await target.getById('id2');
          expect(result2?.id).toEqual(exampleRow2.id);
        });
      });

      describe('findByResource', () => {
        it('should return rows by resource', async () => {
          const result1 = await target.findByResource('resource1');
          expect(result1!.id).toEqual(exampleRow1.id);

          const result2 = await target.findByResource('resource2');
          expect(result2!.id).toEqual(exampleRow2.id);

          const result3 = await target.findByResource('resource3');
          expect(result3).toBeUndefined();
        });
      });

      describe('deleteById', () => {
        it('should delete specific rows', async () => {
          await target.deleteById('id1');
          const records = await knex(DB_SUBSCRIPTIONS_TABLE).select();
          expect(records.length).toEqual(1);
          expect(records[0].id).toEqual(exampleRow2.id);
        });
      });
    });

    describe('transaction', () => {
      it('should wrap everything in transactions', async () => {
        let trxCounter = 0;

        const createTrxCallback = (
          shouldCommit: boolean,
        ): ((
          trx: MicrosoftGraphSubscriptionsDatabaseOperations,
        ) => Promise<void>) => {
          return async trx => {
            let records = await trx.getAll();
            expect(records.length).toEqual(1);
            await trx.insert(exampleRow2);

            records = await trx.getAll();
            expect(records.length).toEqual(2);
            await trx.deleteById('id1');

            const r1 = await trx.findByResource('resource1');
            expect(r1).toBeUndefined();

            const r2 = await trx.findByResource('resource2');
            expect(r2!.id).toEqual('id2');

            trxCounter++;
            if (!shouldCommit) {
              throw new Error('Rolling back transaction on purpose');
            }
          };
        };

        await target.insert(exampleRow1);

        await expect(async () =>
          target.transaction(createTrxCallback(false)),
        ).rejects.toThrow();

        // verify that the transaction was rolled back
        let records = await knex(DB_SUBSCRIPTIONS_TABLE).select();
        expect(records.length).toEqual(1);
        expect(records[0].id).toEqual('id1');
        expect(trxCounter).toEqual(1);

        await target.transaction(createTrxCallback(true));

        // verify that the transaction was not rolled back
        records = await knex(DB_SUBSCRIPTIONS_TABLE).select();
        expect(records.length).toEqual(1);
        expect(records[0].id).toEqual('id2');
        expect(trxCounter).toEqual(2);
      });
    });
  });
});
