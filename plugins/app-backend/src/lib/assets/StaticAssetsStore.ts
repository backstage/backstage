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

import { resolvePackagePath } from '@backstage/backend-common';
import { Knex } from 'knex';
import { Logger } from 'winston';
import { DateTime } from 'luxon';
import partition from 'lodash/partition';
import { StaticAsset, StaticAssetInput, StaticAssetProvider } from './types';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-app-backend',
  'migrations',
);

interface StaticAssetRow {
  path: string;
  content: Buffer;
  last_modified_at: Date;
}

/** @internal */
export interface StaticAssetsStoreOptions {
  database: Knex;
  logger: Logger;
}

/**
 * A storage for static assets that are assumed to be immutable.
 *
 * @internal
 */
export class StaticAssetsStore implements StaticAssetProvider {
  #db: Knex;
  #logger: Logger;

  static async create(options: StaticAssetsStoreOptions) {
    await options.database.migrate.latest({
      directory: migrationsDir,
    });
    return new StaticAssetsStore(options);
  }

  private constructor(options: StaticAssetsStoreOptions) {
    this.#db = options.database;
    this.#logger = options.logger;
  }

  /**
   * Store the provided assets.
   *
   * If an asset for a given path already exists the modification time will be
   * updated, but the contents will not.
   */
  async storeAssets(assets: StaticAssetInput[]) {
    const existingRows = await this.#db<StaticAssetRow>(
      'static_assets_cache',
    ).whereIn(
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
        })
        .onConflict('path')
        .ignore();
    }
  }

  /**
   * Retrieve an asset from the store with the given path.
   */
  async getAsset(path: string): Promise<StaticAsset | undefined> {
    const [row] = await this.#db<StaticAssetRow>('static_assets_cache').where({
      path,
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
    await this.#db<StaticAssetRow>('static_assets_cache')
      .where(
        'last_modified_at',
        '<=',
        this.#db.client.config.client.includes('sqlite3')
          ? this.#db.raw(`datetime('now', ?)`, [`-${maxAgeSeconds} seconds`])
          : this.#db.raw(`now() + interval '${-maxAgeSeconds} seconds'`),
      )
      .delete();
  }
}
