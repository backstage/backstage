/*
 * Copyright 2025 The Backstage Authors
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
  KeyValueStoreNamespace,
  KeyValueStoreNamespaceEntry,
} from '@backstage/backend-plugin-api';
import { z } from 'zod/v4';
import { Knex } from 'knex';
import {
  DB_KEY_VALUE_STORE_TABLE,
  DbKeyValueStoreRow,
} from './database/tables';

/** @internal */
export class DefaultKeyValueStoreNamespace<TInput, TOutput>
  implements KeyValueStoreNamespace<TInput, TOutput>
{
  private readonly prefix: string;

  constructor(
    private readonly getClient: () => Promise<Knex>,
    namespace: string,
    private readonly schema: z.ZodType,
  ) {
    this.prefix = `${namespace}/`;
  }

  async get(key: string): Promise<TOutput | undefined> {
    const knex = await this.getClient();
    const row = await knex<DbKeyValueStoreRow>(DB_KEY_VALUE_STORE_TABLE)
      .where({ key: `${this.prefix}${key}` })
      .first();
    if (!row) {
      return undefined;
    }
    return this.schema.parse(JSON.parse(row.value)) as TOutput;
  }

  async set(key: string, value: TInput): Promise<void> {
    const knex = await this.getClient();
    const parsed = this.schema.parse(value);
    const serialized = JSON.stringify(parsed);
    const now = new Date().toISOString();

    await knex<DbKeyValueStoreRow>(DB_KEY_VALUE_STORE_TABLE)
      .insert({
        key: `${this.prefix}${key}`,
        value: serialized,
        updated_at: now,
      })
      .onConflict('key')
      .merge({ value: serialized, updated_at: now });
  }

  async delete(key: string): Promise<void> {
    const knex = await this.getClient();
    await knex<DbKeyValueStoreRow>(DB_KEY_VALUE_STORE_TABLE)
      .where({ key: `${this.prefix}${key}` })
      .delete();
  }

  async listKeys(): Promise<string[]> {
    const knex = await this.getClient();
    const rows = await knex<DbKeyValueStoreRow>(DB_KEY_VALUE_STORE_TABLE)
      .select('key')
      .where('key', 'like', `${this.prefix}%`);
    return rows.map(row => row.key.slice(this.prefix.length));
  }

  async list(): Promise<KeyValueStoreNamespaceEntry<TOutput>[]> {
    const knex = await this.getClient();
    const rows = await knex<DbKeyValueStoreRow>(DB_KEY_VALUE_STORE_TABLE)
      .select('key', 'value')
      .where('key', 'like', `${this.prefix}%`);
    return rows.map(row => ({
      key: row.key.slice(this.prefix.length),
      value: this.schema.parse(JSON.parse(row.value)) as TOutput,
    }));
  }
}
