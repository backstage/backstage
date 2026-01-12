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

  constructor(private readonly knex: Knex, private readonly pluginId: string) {
    this.storageTableName = `backstage_migration_sources_${pluginId}`;
  }

  async ensureStorageTable(): Promise<void> {
    const hasTable = await this.knex.schema.hasTable(this.storageTableName);
    if (hasTable) {
      return;
    }

    await this.knex.schema.createTable(this.storageTableName, table => {
      table.increments('id').primary();
      table.string('table_name', 255).notNullable();
      table.string('migration_name', 255).notNullable();
      table.text('source_content').notNullable();
      table.string('checksum', 64).notNullable();
      table.timestamp('stored_at').notNullable().defaultTo(this.knex.fn.now());
      table.unique(['table_name', 'migration_name']);
    });
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

    if (!existing) {
      await this.knex(this.storageTableName).insert({
        table_name: tableName,
        migration_name: migrationName,
        source_content: sourceContent,
        checksum,
        stored_at: this.knex.fn.now(),
      });
    } else if (existing.checksum !== checksum) {
      throw new Error(
        `Migration ${migrationName} has changed since it was stored. ` +
          `This could cause inconsistent rollbacks. Aborting.`,
      );
    }
    // else: already stored with matching checksum, nothing to do
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
