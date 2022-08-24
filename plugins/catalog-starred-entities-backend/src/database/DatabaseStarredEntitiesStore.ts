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
import { resolvePackagePath } from '@backstage/backend-common';
import {
  CompoundEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { Knex } from 'knex';

import { StarredEntitiesStore } from './StarredEntitiesStore';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-catalog-starred-entities-backend',
  'migrations',
);

export type RawDbStarredEntitiesRow = {
  user_id: string;
  entity_ref: string;
};

/**
 * Store to manage the starred entities in the database.
 *
 * @public
 */
export class DatabaseStarredEntitiesStore
  implements StarredEntitiesStore<Knex.Transaction>
{
  static async create(knex: Knex): Promise<DatabaseStarredEntitiesStore> {
    await knex.migrate.latest({
      directory: migrationsDir,
    });
    return new DatabaseStarredEntitiesStore(knex);
  }

  private constructor(private readonly db: Knex) {}

  async transaction<T>(fn: (tx: Knex.Transaction) => Promise<T>) {
    return await this.db.transaction(fn);
  }

  async getStarredEntities(
    tx: Knex.Transaction,
    opts: { userId: string },
  ): Promise<string[]> {
    const starredEntities = await tx<RawDbStarredEntitiesRow>(
      'starred_entities',
    )
      .where({ user_id: opts.userId })
      .orderBy('entity_ref')
      .select('entity_ref');

    return starredEntities.map(e => e.entity_ref);
  }

  async starEntity(
    tx: Knex.Transaction,
    opts: { userId: string; entity: CompoundEntityRef },
  ) {
    await tx<RawDbStarredEntitiesRow>('starred_entities')
      .insert({
        user_id: opts.userId,
        entity_ref: stringifyEntityRef(opts.entity),
      })
      .onConflict()
      .ignore();
  }

  async toggleEntity(
    tx: Knex.Transaction,
    opts: { userId: string; entity: CompoundEntityRef },
  ) {
    const data: RawDbStarredEntitiesRow = {
      user_id: opts.userId,
      entity_ref: stringifyEntityRef(opts.entity),
    };

    const deletedRows = await tx<RawDbStarredEntitiesRow>('starred_entities')
      .where(data)
      .delete();

    if (deletedRows === 0) {
      await tx<RawDbStarredEntitiesRow>('starred_entities').insert(data);
    }
  }
}
