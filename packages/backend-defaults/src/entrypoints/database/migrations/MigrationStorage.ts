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

import { LoggerService } from '@backstage/backend-plugin-api';
import { Knex } from 'knex';
import { createHash } from 'crypto';

export interface StoredMigration {
  table_name: string;
  migration_name: string;
  source_content: string;
  checksum: string;
}

export interface MigrationStorageOptions {
  knex: Knex;
  pluginId: string;
  logger: LoggerService;
}

export class MigrationStorage {
  private readonly storageTableName: string;
  private readonly knex: Knex;
  private readonly logger: LoggerService;

  constructor(options: MigrationStorageOptions) {
    this.knex = options.knex;
    this.logger = options.logger;
    this.storageTableName = `backstage_migration_sources_${options.pluginId}`;
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
        this.logger.warn(
          `Migration ${migrationName} has changed since it was stored. ` +
            `This could cause inconsistent rollbacks if a rollback is triggered.`,
        );
      }
      return; // Already stored, don't update
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
          this.logger.warn(
            `Migration ${migrationName} has changed since it was stored. ` +
              `This could cause inconsistent rollbacks if a rollback is triggered.`,
          );
        }
        return; // Another process stored it
      }
      throw error; // Some other error
    }
  }

  async getMigration(
    tableName: string,
    migrationName: string,
  ): Promise<StoredMigration | undefined> {
    const hasTable = await this.knex.schema.hasTable(this.storageTableName);
    if (!hasTable) {
      return undefined;
    }
    return this.knex(this.storageTableName)
      .where({ table_name: tableName, migration_name: migrationName })
      .first();
  }

  async getAllMigrations(tableName: string): Promise<StoredMigration[]> {
    const hasTable = await this.knex.schema.hasTable(this.storageTableName);
    if (!hasTable) {
      return [];
    }
    return this.knex(this.storageTableName)
      .where({ table_name: tableName })
      .orderBy('migration_name', 'asc');
  }
}
