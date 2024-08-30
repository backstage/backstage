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
import { UserSettingsStore, type UserSetting } from './UserSettingsStore';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-user-settings-backend',
  'migrations',
);

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

  private constructor(private readonly db: Knex) {}

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
