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

import { NotFoundError } from '@backstage/backend-common';
import {
  generateUpdatedEntity,
  LOCATION_ANNOTATION,
} from '@backstage/catalog-model';
import type { Entity } from '@backstage/catalog-model';
import type { Database, DbEntityResponse, EntityFilters } from '../database';
import type { EntitiesCatalog } from './types';

export class DatabaseEntitiesCatalog implements EntitiesCatalog {
  constructor(private readonly database: Database) {}

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
    namespace: string | undefined,
    name: string,
  ): Promise<Entity | undefined> {
    const response = await this.database.transaction(tx =>
      this.entityByNameInternal(tx, kind, name, namespace),
    );
    return response?.entity;
  }

  async addOrUpdateEntity(
    entity: Entity,
    locationId?: string,
  ): Promise<Entity> {
    return await this.database.transaction(async tx => {
      // Find a matching (by uid, or by compound name, depending on the given
      // entity) existing entity, to know whether to update or add
      const existing = entity.metadata.uid
        ? await this.database.entityByUid(tx, entity.metadata.uid)
        : await this.entityByNameInternal(
            tx,
            entity.kind,
            entity.metadata.name,
            entity.metadata.namespace,
          );

      // If it's an update, run the algorithm for annotation merging, updating
      // etag/generation, etc.
      let response: DbEntityResponse;
      if (existing) {
        const updated = generateUpdatedEntity(existing.entity, entity);
        response = await this.database.updateEntity(
          tx,
          { locationId, entity: updated },
          existing.entity.metadata.etag,
          existing.entity.metadata.generation,
        );
      } else {
        response = await this.database.addEntity(tx, { locationId, entity });
      }

      return response.entity;
    });
  }

  async removeEntityByUid(uid: string): Promise<void> {
    return await this.database.transaction(async tx => {
      const entityResponse = await this.database.entityByUid(tx, uid);
      if (!entityResponse) {
        throw new NotFoundError(`Entity with ID ${uid} was not found`);
      }
      const location =
        entityResponse.entity.metadata.annotations?.[LOCATION_ANNOTATION];
      const colocatedEntities = location
        ? await this.database.entities(tx, [
            {
              key: LOCATION_ANNOTATION,
              values: [location],
            },
          ])
        : [entityResponse];
      for (const dbResponse of colocatedEntities) {
        await this.database.removeEntity(tx, dbResponse?.entity.metadata.uid!);
      }

      if (entityResponse.locationId) {
        await this.database.removeLocation(tx, entityResponse?.locationId!);
      }
      return undefined;
    });
  }

  private async entityByNameInternal(
    tx: unknown,
    kind: string,
    name: string,
    namespace: string | undefined,
  ): Promise<DbEntityResponse | undefined> {
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

    return matches.length ? matches[0] : undefined;
  }
}
