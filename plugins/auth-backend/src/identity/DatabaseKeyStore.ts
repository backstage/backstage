/*
 * Copyright 2020 The Backstage Authors
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

import { Knex } from 'knex';
import { DateTime } from 'luxon';
import { AnyJWK, KeyStore, StoredKey } from './types';

const TABLE = 'signing_keys';

type Row = {
  created_at: Date; // row.created_at is a string after being returned from the database
  kid: string;
  key: string;
};

const parseDate = (date: string | Date) => {
  const parsedDate =
    typeof date === 'string'
      ? DateTime.fromSQL(date, { zone: 'UTC' })
      : DateTime.fromJSDate(date);

  if (!parsedDate.isValid) {
    throw new Error(
      `Failed to parse date, reason: ${parsedDate.invalidReason}, explanation: ${parsedDate.invalidExplanation}`,
    );
  }

  return parsedDate.toJSDate();
};

export class DatabaseKeyStore implements KeyStore {
  constructor(private readonly client: Knex) {}

  async addKey(key: AnyJWK): Promise<void> {
    await this.client<Row>(TABLE).insert({
      kid: key.kid,
      key: JSON.stringify(key),
    });
  }

  async listKeys(): Promise<{ items: StoredKey[] }> {
    const rows = await this.client<Row>(TABLE).select();

    return {
      items: rows.map(row => ({
        key: JSON.parse(row.key),
        createdAt: parseDate(row.created_at),
      })),
    };
  }

  async removeKeys(kids: string[]): Promise<void> {
    await this.client(TABLE).delete().whereIn('kid', kids);
  }
}
