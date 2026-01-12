/*
 * Copyright 2026 The Backstage Authors
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
import path from 'path';
import fs from 'fs-extra';
import { MigrationStorage } from './MigrationStorage';

export class StoredMigrationSource implements Knex.MigrationSource<string> {
  constructor(
    private readonly knex: Knex,
    private readonly storage: MigrationStorage,
    private readonly tableName: string,
    private readonly directory: string,
  ) {}

  async getMigrations(): Promise<string[]> {
    const filesystemMigrations = await this.readFilesystemMigrations();
    const storedMigrations = await this.storage.getAllMigrations(
      this.tableName,
    );

    // Also include applied migrations from the database to satisfy knex validation
    const appliedMigrations = await this.getAppliedMigrationNames();

    console.log('DEBUG getMigrations:', {
      tableName: this.tableName,
      directory: this.directory,
      filesystemMigrations,
      storedMigrations: storedMigrations.map(m => m.migration_name),
      appliedMigrations,
    });

    const allNames = new Set([
      ...filesystemMigrations,
      ...storedMigrations.map(m => m.migration_name),
      ...appliedMigrations,
    ]);

    return Array.from(allNames).sort();
  }

  private async getAppliedMigrationNames(): Promise<string[]> {
    const hasTable = await this.knex.schema.hasTable(this.tableName);
    if (!hasTable) {
      return [];
    }

    const applied = await this.knex(this.tableName).select('name');
    return applied.map((row: { name: string }) =>
      row.name.replace(/\.js$/, ''),
    );
  }

  getMigrationName(migration: string): string {
    return migration;
  }

  async getMigration(name: string): Promise<Knex.Migration> {
    // Try filesystem first
    const fsPath = path.join(this.directory, `${name}.js`);
    const fsExists = await fs.pathExists(fsPath);
    console.log('DEBUG getMigration:', {
      name,
      fsPath,
      fsExists,
      directory: this.directory,
    });
    if (fsExists) {
      // Clear require cache to ensure fresh load
      delete require.cache[require.resolve(fsPath)];
      return require(fsPath);
    }

    // Fall back to stored content
    const stored = await this.storage.getMigration(this.tableName, name);
    if (stored) {
      return this.evalMigration(stored.source_content);
    }

    // Check if this is a legacy applied migration without source
    const appliedNames = await this.getAppliedMigrationNames();
    if (appliedNames.includes(name)) {
      // This is a legacy migration that was applied before migration storage existed.
      // We can't rollback this migration, but we need to return something to satisfy knex.
      // Return a no-op migration that throws if down() is called.
      return {
        up: async () => {
          // No-op: already applied
        },
        down: async () => {
          throw new Error(
            `Cannot rollback migration ${name}: this is a legacy migration ` +
              `that was applied before migration storage was enabled. ` +
              `The source code is not available for rollback.`,
          );
        },
      };
    }

    throw new Error(
      `Migration ${name} not found in filesystem (${this.directory}) or storage`,
    );
  }

  async getFilesystemMigrationNames(): Promise<string[]> {
    return this.readFilesystemMigrations();
  }

  private async readFilesystemMigrations(): Promise<string[]> {
    if (!(await fs.pathExists(this.directory))) {
      return [];
    }

    const files = await fs.readdir(this.directory);
    return files
      .filter(f => f.endsWith('.js'))
      .map(f => path.basename(f, '.js'))
      .sort();
  }

  private evalMigration(sourceContent: string): Knex.Migration {
    const module = { exports: {} as Knex.Migration };
    // eslint-disable-next-line no-new-func
    const fn = new Function('exports', 'module', 'require', sourceContent);
    fn(module.exports, module, require);
    return module.exports;
  }
}
