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
  PluginDatabaseManager,
  resolvePackagePath,
} from '@backstage/backend-common';
import { Knex } from 'knex';
import crypto from 'crypto';
import { GetEntitiesResponse } from '@backstage/catalog-client';

/**
 * internal
 * @public
 */
export interface BadgesStore {
  createAllBadges(
    entities: GetEntitiesResponse,
    salt: string | undefined,
  ): Promise<void>;

  getBadgeFromHash(
    hash: string,
  ): Promise<{ name: string; namespace: string; kind: string } | undefined>;

  getHashFromEntityMetadata(
    name: string,
    namespace: string,
    kind: string,
  ): Promise<{ hash: string } | undefined>;

  deleteObsoleteHashes(
    entities: GetEntitiesResponse,
    salt: string | undefined,
  ): Promise<void>;

  countAllBadges(): Promise<number>;

  getAllBadges(): Promise<
    { name: string; namespace: string; kind: string; hash: string }[]
  >;
}

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-badges-backend', // Package name
  'migrations', // Migrations directory
);

/**
 * DatabaseBadgesStore
 * @internal
 */
export class DatabaseBadgesStore implements BadgesStore {
  private constructor(private readonly db: Knex) {}

  static async create({
    database,
    skipMigrations,
  }: {
    database: PluginDatabaseManager;
    skipMigrations?: boolean;
  }): Promise<DatabaseBadgesStore> {
    const client = await database.getClient();

    if (!database.migrations?.skip && !skipMigrations) {
      await client.migrate.latest({
        directory: migrationsDir,
      });
    }

    return new DatabaseBadgesStore(client);
  }

  async createAllBadges(
    entities: GetEntitiesResponse,
    salt: string,
  ): Promise<void> {
    for (const entity of entities.items) {
      const name = entity.metadata.name.toLocaleLowerCase();
      const namespace =
        entity.metadata.namespace?.toLocaleLowerCase() ?? 'default';
      const kind = entity.kind.toLocaleLowerCase();
      const entityHash = crypto
        .createHash('sha256')
        .update(`${kind}:${namespace}:${name}:${salt}`)
        .digest('hex');

      await this.db('badges')
        .insert({
          hash: entityHash,
          namespace: namespace,
          name: name,
          kind: kind,
        })
        .onConflict()
        .ignore();
    }
  }

  async getAllBadges(): Promise<
    { name: string; namespace: string; kind: string; hash: string }[]
  > {
    const result = await this.db('badges').select('*').orderBy('name', 'asc');
    return result;
  }

  async getBadgeFromHash(
    hash: string,
  ): Promise<{ name: string; namespace: string; kind: string } | undefined> {
    const result = await this.db('badges')
      .select('namespace', 'name', 'kind')
      .where({ hash: hash })
      .first();

    return result;
  }

  async getHashFromEntityMetadata(
    name: string,
    namespace: string,
    kind: string,
  ): Promise<{ hash: string } | undefined> {
    const result = await this.db('badges')
      .select('hash')
      .where({ name: name, namespace: namespace, kind: kind })
      .first();

    return result;
  }

  async deleteObsoleteHashes(
    entities: GetEntitiesResponse,
    salt: string,
  ): Promise<void> {
    const entityInCatalog: string[] = [];
    const entityInBadgeDatabase: string[] = [];
    let entityToDelete: string[] = [];

    for (const entity of entities.items) {
      const name = entity.metadata.name.toLowerCase();
      const namespace = entity.metadata.namespace?.toLowerCase() ?? 'default';
      const kind = entity.kind.toLowerCase();
      const entityHash = crypto
        .createHash('sha256')
        .update(`${kind}:${namespace}:${name}:${salt}`)
        .digest('hex');

      entityInCatalog.push(entityHash);
    }

    for (const entity of await this.getAllBadges()) {
      entityInBadgeDatabase.push(entity.hash);
    }

    entityToDelete = entityInBadgeDatabase.filter(
      entity => !entityInCatalog.includes(entity),
    );

    for (const entity of entityToDelete) {
      await this.db('badges').where({ hash: entity }).del();
    }
  }

  async countAllBadges(): Promise<number> {
    const result = await this.db('badges').countDistinct('hash as count');
    const count: number = +result[0].count;
    return count;
  }
}
