/*
 * Copyright 2020 Spotify AB
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

import type { Entity, EntityPolicy } from '@backstage/catalog-model';
import type { Database, DbEntityResponse, EntityFilters } from '../database';
import type { EntitiesCatalog } from './types';

export class DatabaseEntitiesCatalog implements EntitiesCatalog {
  constructor(
    private readonly database: Database,
    private readonly policy: EntityPolicy,
  ) {}

  async entities(filters?: EntityFilters): Promise<Entity[]> {
    const items = await this.database.transaction(tx =>
      this.database.entities(tx, filters),
    );
    return items.map(i => i.entity);
  }

  async entityByUid(uid: string): Promise<Entity | undefined> {
    const matches = await this.database.transaction(tx =>
      this.database.entities(tx, [{ key: 'uid', values: [uid] }]),
    );

    return matches.length ? matches[0].entity : undefined;
  }

  async entityByName(
    kind: string,
    name: string,
    namespace: string | undefined,
  ): Promise<Entity | undefined> {
    return await this.database.transaction(tx =>
      this.entityByNameInternal(tx, kind, name, namespace),
    );
  }

  async addOrUpdateEntity(
    entity: Entity,
    locationId?: string,
  ): Promise<Entity> {
    await this.policy.enforce(entity);
    return await this.database.transaction(async tx => {
      let response: DbEntityResponse;

      if (entity.metadata.uid) {
        response = await this.database.updateEntity(tx, { locationId, entity });
      } else {
        const existing = await this.entityByNameInternal(
          tx,
          entity.kind,
          entity.metadata.name,
          entity.metadata.namespace,
        );
        if (existing) {
          response = await this.database.updateEntity(tx, {
            locationId,
            entity,
          });
        } else {
          response = await this.database.addEntity(tx, { locationId, entity });
        }
      }

      return response.entity;
    });
  }

  async removeEntityByUid(uid: string): Promise<void> {
    return await this.database.transaction(async tx => {
      await this.database.removeEntity(tx, uid);
    });
  }

  private async entityByNameInternal(
    tx: unknown,
    kind: string,
    name: string,
    namespace: string | undefined,
  ): Promise<Entity | undefined> {
    const matches = await this.database.entities(tx, [
      { key: 'kind', values: [kind] },
      { key: 'name', values: [name] },
      {
        key: 'namespace',
        values:
          !namespace || namespace === 'default'
            ? [null, 'default']
            : [namespace],
      },
    ]);

    return matches.length ? matches[0].entity : undefined;
  }
}
