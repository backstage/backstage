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

import { Knex } from 'knex';
import { createHash } from 'crypto';

export interface StoredMigration {
  table_name: string;
  migration_name: string;
  source_content: string;
  checksum: string;
}

export class MigrationStorage {
  private readonly storageTableName: string;

  constructor(private readonly knex: Knex, pluginId: string) {
    this.storageTableName = `backstage_migration_sources_${pluginId}`;
  }

  async ensureStorageTable(): Promise<void> {
    const hasTable = await this.knex.schema.hasTable(this.storageTableName);
    if (hasTable) {
      return;
    }

    try {
      await this.knex.schema.createTable(this.storageTableName, table => {
        table.increments('id').primary();
        table.string('table_name', 255).notNullable();
        table.string('migration_name', 255).notNullable();
        table.text('source_content').notNullable();
        table.string('checksum', 64).notNullable();
        table
          .timestamp('stored_at')
          .notNullable()
          .defaultTo(this.knex.fn.now());
        table.unique(['table_name', 'migration_name']);
      });
    } catch (error) {
      // Check if table was created by another process
      const tableNowExists = await this.knex.schema.hasTable(
        this.storageTableName,
      );
      if (!tableNowExists) {
        throw error;
      }
      // Table exists now, so another process created it - that's fine
    }
  }

  async storeMigration(
    tableName: string,
    migrationName: string,
    sourceContent: string,
  ): Promise<void> {
    const checksum = createHash('sha256').update(sourceContent).digest('hex');

    const existing = await this.knex(this.storageTableName)
      .where({ table_name: tableName, migration_name: migrationName })
      .first();

    if (existing) {
      if (existing.checksum !== checksum) {
        throw new Error(
          `Migration ${migrationName} has changed since it was stored. ` +
            `This could cause inconsistent rollbacks. Aborting.`,
        );
      }
      return; // Already stored with same checksum
    }

    try {
      await this.knex(this.storageTableName).insert({
        table_name: tableName,
        migration_name: migrationName,
        source_content: sourceContent,
        checksum,
        stored_at: this.knex.fn.now(),
      });
    } catch (error) {
      // Handle unique constraint violation - re-check
      const nowExisting = await this.knex(this.storageTableName)
        .where({ table_name: tableName, migration_name: migrationName })
        .first();
      if (nowExisting) {
        if (nowExisting.checksum !== checksum) {
          throw new Error(
            `Migration ${migrationName} has changed since it was stored. ` +
              `This could cause inconsistent rollbacks. Aborting.`,
          );
        }
        return; // Another process stored it with same checksum
      }
      throw error; // Some other error
    }
  }

  async getMigration(
    tableName: string,
    migrationName: string,
  ): Promise<StoredMigration | undefined> {
    return this.knex(this.storageTableName)
      .where({ table_name: tableName, migration_name: migrationName })
      .first();
  }

  async getAllMigrations(tableName: string): Promise<StoredMigration[]> {
    return this.knex(this.storageTableName)
      .where({ table_name: tableName })
      .orderBy('migration_name', 'asc');
  }
}
