/*
 * Copyright 2022 The Backstage Authors
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
  resolvePackagePath,
  DatabaseService,
} from '@backstage/backend-plugin-api';
import { NotFoundError } from '@backstage/errors';
import { JsonValue } from '@backstage/types';
import { Knex } from 'knex';
import pLimit from 'p-limit';
import { UserSettingsStore, type UserSetting } from './UserSettingsStore';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-user-settings-backend',
  'migrations',
);

const dbLimit = pLimit(10);

/**
 * @public
 */
export type RawDbUserSettingsRow = {
  user_entity_ref: string;
  bucket: string;
  key: string;
  value: string;
};

/**
 * Store to manage the user settings.
 *
 * @public
 */
export class DatabaseUserSettingsStore implements UserSettingsStore {
  static async create(options: {
    database: DatabaseService;
  }): Promise<DatabaseUserSettingsStore> {
    const { database } = options;
    const client = await database.getClient();

    if (!database.migrations?.skip) {
      await client.migrate.latest({
        directory: migrationsDir,
      });
    }

    return new DatabaseUserSettingsStore(client);
  }

  private readonly db: Knex;

  private constructor(db: Knex) {
    this.db = db;
  }

  async get(options: {
    userEntityRef: string;
    bucket: string;
    key: string;
  }): Promise<UserSetting> {
    const rows = await this.db<RawDbUserSettingsRow>('user_settings')
      .where({
        user_entity_ref: options.userEntityRef,
        bucket: options.bucket,
        key: options.key,
      })
      .select(['bucket', 'key', 'value']);

    if (!rows.length) {
      throw new NotFoundError(
        `Unable to find '${options.key}' in bucket '${options.bucket}'`,
      );
    }

    return {
      bucket: rows[0].bucket,
      key: rows[0].key,
      value: JSON.parse(rows[0].value),
    };
  }

  async multiget(options: {
    userEntityRef: string;
    items: Array<{ bucket: string; key: string }>;
  }): Promise<({ value: JsonValue } | null)[]> {
    if (options.items.length === 0) {
      return [];
    }

    // Split the items into a map of bucket -> keys
    const bucketMap = new Map<string, Set<string>>();
    for (const item of options.items) {
      let keys = bucketMap.get(item.bucket);
      if (!keys) {
        keys = new Set();
        bucketMap.set(item.bucket, keys);
      }
      keys.add(item.key);
    }

    // Chunks the keys per bucket to avoid hitting SQL parameter limits
    const chunkKeys = (keys: Array<string>, size: number): string[][] => {
      const chunks = [];
      for (let i = 0; i < keys.length; i += size) {
        chunks.push(keys.slice(i, i + size));
      }
      return chunks;
    };

    // Store the database content into a map of bucket -> {key -> value}
    const resultsMap = new Map<string, Map<string, JsonValue>>();

    await Promise.all(
      Array.from(bucketMap.entries()).map(([bucket, keySet]) =>
        dbLimit(async (): Promise<void> => {
          const keyMap = new Map<string, JsonValue>();
          resultsMap.set(bucket, keyMap);

          const keyChunks = chunkKeys(Array.from(keySet), 100);

          for (const keys of keyChunks) {
            const rows = await this.db<RawDbUserSettingsRow>('user_settings')
              .where({
                user_entity_ref: options.userEntityRef,
                bucket,
              })
              .whereIn('key', keys)
              .select(['bucket', 'key', 'value']);

            for (const row of rows) {
              keyMap.set(row.key, JSON.parse(row.value));
            }
          }
        }),
      ),
    );

    // For each exact bucket/key requested, return either the value or null if
    // not found
    return options.items.map(({ bucket, key }) => {
      const value = resultsMap.get(bucket)?.get(key);

      if (typeof value === 'undefined') {
        return null;
      }

      return { value };
    });
  }

  async set(options: {
    userEntityRef: string;
    bucket: string;
    key: string;
    value: JsonValue;
  }): Promise<void> {
    await this.db<RawDbUserSettingsRow>('user_settings')
      .insert({
        user_entity_ref: options.userEntityRef,
        bucket: options.bucket,
        key: options.key,
        value: JSON.stringify(options.value),
      })
      .onConflict(['user_entity_ref', 'bucket', 'key'])
      .merge(['value']);
  }

  async delete(options: {
    userEntityRef: string;
    bucket: string;
    key: string;
  }): Promise<void> {
    await this.db<RawDbUserSettingsRow>('user_settings')
      .where({
        user_entity_ref: options.userEntityRef,
        bucket: options.bucket,
        key: options.key,
      })
      .delete();
  }
}
