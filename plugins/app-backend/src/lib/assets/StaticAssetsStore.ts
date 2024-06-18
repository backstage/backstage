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

import { Knex } from 'knex';
import { DateTime } from 'luxon';
import partition from 'lodash/partition';
import { StaticAsset, StaticAssetInput, StaticAssetProvider } from './types';
import {
  DatabaseService,
  LoggerService,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-app-backend',
  'migrations',
);

interface StaticAssetRow {
  path: string;
  content: Buffer;
  namespace: string | null;
  last_modified_at: Date;
}

/** @internal */
export interface StaticAssetsStoreOptions {
  database: DatabaseService;
  logger: LoggerService;
}

/**
 * A storage for static assets that are assumed to be immutable.
 *
 * @internal
 */
export class StaticAssetsStore implements StaticAssetProvider {
  #db: Knex;
  #logger: LoggerService;
  #namespace: string;

  static async create(options: StaticAssetsStoreOptions) {
    const { database } = options;
    const client = await database.getClient();

    if (!database.migrations?.skip) {
      await client.migrate.latest({
        directory: migrationsDir,
      });
    }

    return new StaticAssetsStore(client, options.logger);
  }

  private constructor(client: Knex, logger: LoggerService, namespace?: string) {
    this.#db = client;
    this.#logger = logger;
    this.#namespace = namespace ?? 'default';
  }

  /**
   * Creates a new store with the provided namespace, using the same underlying storage.
   */
  withNamespace(namespace: string): StaticAssetsStore {
    return new StaticAssetsStore(this.#db, this.#logger, namespace);
  }

  /**
   * Store the provided assets.
   *
   * If an asset for a given path already exists the modification time will be
   * updated, but the contents will not.
   */
  async storeAssets(assets: StaticAssetInput[]) {
    const existingRows = await this.#db<StaticAssetRow>('static_assets_cache')
      .where('namespace', this.#namespace)
      .whereIn(
        'path',
        assets.map(a => a.path),
      );
    const existingAssetPaths = new Set(existingRows.map(r => r.path));

    const [modified, added] = partition(assets, asset =>
      existingAssetPaths.has(asset.path),
    );

    this.#logger.info(
      `Storing ${modified.length} updated assets and ${added.length} new assets`,
    );

    await this.#db('static_assets_cache')
      .update({
        last_modified_at: this.#db.fn.now(),
      })
      .where('namespace', this.#namespace)
      .whereIn(
        'path',
        modified.map(a => a.path),
      );

    for (const asset of added) {
      // We ignore conflicts with other nodes, it doesn't matter if someone else
      // added the same asset just before us.
      await this.#db('static_assets_cache')
        .insert({
          path: asset.path,
          content: await asset.content(),
          namespace: this.#namespace,
        })
        .onConflict(['namespace', 'path'])
        .ignore();
    }
  }

  /**
   * Retrieve an asset from the store with the given path.
   */
  async getAsset(path: string): Promise<StaticAsset | undefined> {
    const [row] = await this.#db<StaticAssetRow>('static_assets_cache').where({
      path,
      namespace: this.#namespace,
    });
    if (!row) {
      return undefined;
    }
    return {
      path: row.path,
      content: row.content,
      lastModifiedAt:
        typeof row.last_modified_at === 'string'
          ? DateTime.fromSQL(row.last_modified_at, { zone: 'UTC' }).toJSDate()
          : row.last_modified_at,
    };
  }

  /**
   * Delete any assets from the store whose modification time is older than the max age.
   */
  async trimAssets(options: { maxAgeSeconds: number }) {
    const { maxAgeSeconds } = options;
    let lastModifiedInterval = this.#db.raw(
      `now() + interval '${-maxAgeSeconds} seconds'`,
    );
    if (this.#db.client.config.client.includes('mysql')) {
      lastModifiedInterval = this.#db.raw(
        `date_sub(now(), interval ${maxAgeSeconds} second)`,
      );
    } else if (this.#db.client.config.client.includes('sqlite3')) {
      lastModifiedInterval = this.#db.raw(`datetime('now', ?)`, [
        `-${maxAgeSeconds} seconds`,
      ]);
    }
    await this.#db<StaticAssetRow>('static_assets_cache')
      .where('namespace', this.#namespace)
      .where('last_modified_at', '<=', lastModifiedInterval)
      .delete();
  }
}
