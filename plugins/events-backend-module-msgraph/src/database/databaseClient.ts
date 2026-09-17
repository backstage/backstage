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

import type { Knex } from 'knex';

export const DB_SUBSCRIPTIONS_TABLE = 'module_msgraph__subscriptions';

export type DbSubscriptionsRow = {
  id: string;
  resource: string;
  created_at?: Date;
  expires_at: Date;
  token_hash: string;
  token_salt: string;
};

/**
 * @internal
 */
export interface MicrosoftGraphSubscriptionsDatabaseOperations {
  getAll: () => Promise<DbSubscriptionsRow[]>;
  findByResource: (resource: string) => Promise<DbSubscriptionsRow | undefined>;
  deleteById: (id: string) => Promise<void>;
  insert: (row: DbSubscriptionsRow) => Promise<void>;
}

/**
 * Abstracts Microsoft Graph subscription DB operations with or without a transaction.
 * @internal
 */
abstract class MicrosoftGraphSubscriptionsDatabaseClientBase
  implements MicrosoftGraphSubscriptionsDatabaseOperations
{
  protected abstract getQuery(): Knex.QueryBuilder<DbSubscriptionsRow>;

  async getAll(): Promise<DbSubscriptionsRow[]> {
    return this.getQuery().select();
  }

  async getById(id: string): Promise<DbSubscriptionsRow | undefined> {
    return this.getQuery().where({ id }).first();
  }

  async findByResource(
    resource: string,
  ): Promise<DbSubscriptionsRow | undefined> {
    return this.getQuery().where({ resource }).first();
  }

  async deleteById(id: string): Promise<void> {
    await this.getQuery().where({ id }).del();
  }

  async insert(row: DbSubscriptionsRow): Promise<void> {
    await this.getQuery().insert(row);
  }
}

/**
 * Transactional variant of the DB client.
 *
 * @internal
 */
class MicrosoftGraphSubscriptionsDatabaseClientTrx extends MicrosoftGraphSubscriptionsDatabaseClientBase {
  constructor(private readonly trx: Knex.Transaction<DbSubscriptionsRow>) {
    super();
  }

  protected getQuery() {
    return this.trx(DB_SUBSCRIPTIONS_TABLE);
  }
}

/**
 * A wrapper around Knex to perform operations on the DB_SUBSCRIPTIONS_TABLE table.
 *
 * @internal
 */
export class MicrosoftGraphSubscriptionsDatabaseClient extends MicrosoftGraphSubscriptionsDatabaseClientBase {
  static create(knex: Knex<DbSubscriptionsRow>) {
    return new MicrosoftGraphSubscriptionsDatabaseClient(knex);
  }

  private constructor(private readonly knex: Knex<DbSubscriptionsRow>) {
    super();
  }

  protected getQuery() {
    return this.knex(DB_SUBSCRIPTIONS_TABLE);
  }

  async transaction(
    transactionScope: (
      trx: MicrosoftGraphSubscriptionsDatabaseOperations,
    ) => Promise<void>,
    config?: Knex.TransactionConfig,
  ) {
    await this.knex.transaction(async trx => {
      const db = new MicrosoftGraphSubscriptionsDatabaseClientTrx(trx);
      return transactionScope(db);
    }, config);
  }
}
