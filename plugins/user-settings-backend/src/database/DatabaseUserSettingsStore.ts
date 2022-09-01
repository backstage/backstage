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
  PluginDatabaseManager,
  resolvePackagePath,
} from '@backstage/backend-common';
import { NotFoundError } from '@backstage/errors';
import { Knex } from 'knex';

import { type UserSetting, UserSettingsStore } from './UserSettingsStore';

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
export class DatabaseUserSettingsStore
  implements UserSettingsStore<Knex.Transaction>
{
  static async create(options: {
    database: PluginDatabaseManager;
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

  async getAll(tx: Knex.Transaction, opts: { userEntityRef: string }) {
    const settings = await tx<RawDbUserSettingsRow>('user_settings')
      .where({ user_entity_ref: opts.userEntityRef })
      .select('bucket', 'key', 'value');

    return settings;
  }

  async deleteAll(
    tx: Knex.Transaction<any, any[]>,
    opts: { userEntityRef: string },
  ): Promise<void> {
    await tx('user_settings')
      .where({ user_entity_ref: opts.userEntityRef })
      .delete();
  }

  async getBucket(
    tx: Knex.Transaction<any, any[]>,
    opts: { userEntityRef: string; bucket: string },
  ): Promise<UserSetting[]> {
    const settings = await tx<RawDbUserSettingsRow>('user_settings')
      .where({ user_entity_ref: opts.userEntityRef, bucket: opts.bucket })
      .select(['bucket', 'key', 'value']);

    return settings;
  }

  async deleteBucket(
    tx: Knex.Transaction<any, any[]>,
    opts: { userEntityRef: string; bucket: string },
  ): Promise<void> {
    await tx('user_settings')
      .where({ user_entity_ref: opts.userEntityRef, bucket: opts.bucket })
      .delete();
  }

  async get(
    tx: Knex.Transaction<any, any[]>,
    opts: { userEntityRef: string; bucket: string; key: string },
  ): Promise<UserSetting> {
    const setting = await tx<RawDbUserSettingsRow>('user_settings')
      .where({
        user_entity_ref: opts.userEntityRef,
        bucket: opts.bucket,
        key: opts.key,
      })
      .select(['bucket', 'key', 'value']);

    if (!setting.length) {
      throw new NotFoundError(
        `Unable to find '${opts.key}' in bucket '${opts.bucket}'`,
      );
    }

    return setting[0];
  }

  async set(
    tx: Knex.Transaction<any, any[]>,
    opts: { userEntityRef: string; bucket: string; key: string; value: string },
  ): Promise<void> {
    await tx<RawDbUserSettingsRow>('user_settings')
      .insert({
        user_entity_ref: opts.userEntityRef,
        bucket: opts.bucket,
        key: opts.key,
        value: opts.value,
      })
      .onConflict(['user_entity_ref', 'bucket', 'key'])
      .merge({ value: opts.value });
  }

  async delete(
    tx: Knex.Transaction<any, any[]>,
    opts: { userEntityRef: string; bucket: string; key: string },
  ): Promise<void> {
    await tx<RawDbUserSettingsRow>('user_settings')
      .where({
        user_entity_ref: opts.userEntityRef,
        bucket: opts.bucket,
        key: opts.key,
      })
      .delete();
  }

  async transaction<T>(fn: (tx: Knex.Transaction) => Promise<T>) {
    return await this.db.transaction(fn);
  }
}
