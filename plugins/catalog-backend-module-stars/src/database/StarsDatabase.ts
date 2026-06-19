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
import { resolvePackagePath } from '@backstage/backend-plugin-api';
import { Knex } from 'knex';

const MIGRATIONS_DIR = resolvePackagePath(
  '@backstage/plugin-catalog-backend-module-stars',
  'migrations',
);

/**
 * Abstraction for database operations related to starred entities.
 */
export class StarsDatabase {
  private constructor(private readonly db: Knex) {}

  static async create(database: Knex): Promise<StarsDatabase> {
    await database.migrate.latest({
      directory: MIGRATIONS_DIR,
      tableName: 'catalog_module_stars__knex_migrations',
    });
    return new StarsDatabase(database);
  }

  async getStars(userRef: string): Promise<string[]> {
    const records = await this.db('starred_entities')
      .where({ user_ref: userRef })
      .select('entity_ref');
    return records.map(r => r.entity_ref);
  }

  async star(userRef: string, entityRef: string): Promise<void> {
    await this.db('starred_entities')
      .insert({ user_ref: userRef, entity_ref: entityRef })
      .onConflict(['user_ref', 'entity_ref'])
      .ignore();
  }

  async unstar(userRef: string, entityRef: string): Promise<void> {
    await this.db('starred_entities')
      .where({ user_ref: userRef, entity_ref: entityRef })
      .delete();
  }

  async getStarCount(entityRef: string): Promise<number> {
    const result = await this.db('starred_entities')
      .where({ entity_ref: entityRef })
      .count('user_ref as count')
      .first();

    if (!result) {
      return 0;
    }
    return Number(result.count);
  }
}
