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

import { ConflictError, NotFoundError } from '@backstage/backend-common';
import {
  entityHasChanges,
  generateUpdatedEntity,
  getEntityName,
  LOCATION_ANNOTATION,
  serializeEntityRef,
  Entity,
  EntityRelationSpec,
} from '@backstage/catalog-model';
import { chunk, groupBy } from 'lodash';
import limiterFactory from 'p-limit';
import { Logger } from 'winston';
import type { Database, DbEntityResponse, EntityFilters } from '../database';
import { durationText } from '../util/timing';
import type {
  EntitiesCatalog,
  EntityUpsertRequest,
  EntityUpsertResponse,
} from './types';

type BatchContext = {
  kind: string;
  namespace: string;
  locationId?: string;
};

// Some locations return tens or hundreds of thousands of entities. To make
// those payloads more manageable, we break work apart in batches of this
// many entities and write them to storage per batch.
const BATCH_SIZE = 100;

// When writing large batches, there's an increasing chance of contention in
// the form of conflicts where we compete with other writes. Each batch gets
// this many attempts at being written before giving up.
const BATCH_ATTEMPTS = 3;

// The number of batches that may be ongoing at the same time.
const BATCH_CONCURRENCY = 3;

export class DatabaseEntitiesCatalog implements EntitiesCatalog {
  constructor(
    private readonly database: Database,
    private readonly logger: Logger,
  ) {}

  async entities(filters?: EntityFilters[]): Promise<Entity[]> {
    const items = await this.database.transaction(tx =>
      this.database.entities(tx, filters),
    );
    return items.map(i => i.entity);
  }

  private async addOrUpdateEntity(
    entity: Entity,
    locationId?: string,
  ): Promise<Entity> {
    return await this.database.transaction(async tx => {
      // Find a matching (by uid, or by compound name, depending on the given
      // entity) existing entity, to know whether to update or add
      const existing = entity.metadata.uid
        ? await this.database.entityByUid(tx, entity.metadata.uid)
        : await this.database.entityByName(tx, getEntityName(entity));

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
        const added = await this.database.addEntities(tx, [
          { locationId, entity },
        ]);
        response = added[0];
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
            { [`metadata.annotations.${LOCATION_ANNOTATION}`]: location },
          ])
        : [entityResponse];
      for (const dbResponse of colocatedEntities) {
        await this.database.removeEntityByUid(
          tx,
          dbResponse?.entity.metadata.uid!,
        );
      }

      if (entityResponse.locationId) {
        await this.database.removeLocation(tx, entityResponse?.locationId!);
      }
      return undefined;
    });
  }

  /**
   * Writes a number of entities efficiently to storage.
   *
   * @param entities Some entities
   * @param locationId The location that they all belong to
   */
  async batchAddOrUpdateEntities(
    requests: EntityUpsertRequest[],
    locationId?: string,
  ): Promise<EntityUpsertResponse[]> {
    // Group the entities by unique kind+namespace combinations
    const entitiesByKindAndNamespace = groupBy(requests, ({ entity }) => {
      const name = getEntityName(entity);
      return `${name.kind}:${name.namespace}`.toLowerCase();
    });

    const limiter = limiterFactory(BATCH_CONCURRENCY);
    const tasks: Promise<EntityUpsertResponse[]>[] = [];

    for (const groupRequests of Object.values(entitiesByKindAndNamespace)) {
      const { kind, namespace } = getEntityName(groupRequests[0].entity);

      // Go through the new entities in reasonable chunk sizes (sometimes,
      // sources produce tens of thousands of entities, and those are too large
      // batch sizes to reasonably send to the database)
      for (const batch of chunk(groupRequests, BATCH_SIZE)) {
        tasks.push(
          limiter(async () => {
            const first = serializeEntityRef(batch[0].entity);
            const last = serializeEntityRef(batch[batch.length - 1].entity);
            const modifiedEntityIds: EntityUpsertResponse[] = [];
            this.logger.debug(
              `Considering batch ${first}-${last} (${batch.length} entries)`,
            );

            // Retry the batch write a few times to deal with contention
            const context = { kind, namespace, locationId };
            for (let attempt = 1; attempt <= BATCH_ATTEMPTS; ++attempt) {
              try {
                const { toAdd, toUpdate, toIgnore } = await this.analyzeBatch(
                  batch,
                  context,
                );
                if (toAdd.length) {
                  modifiedEntityIds.push(
                    ...(await this.batchAdd(toAdd, context)),
                  );
                }
                if (toUpdate.length) {
                  modifiedEntityIds.push(
                    ...(await this.batchUpdate(toUpdate, context)),
                  );
                }
                // TODO(Rugvip): We currently always update relations, but we
                // likely want to figure out a way to avoid that
                for (const { entity, relations } of toIgnore) {
                  const entityId = entity.metadata.uid!;
                  await this.setRelations(entityId, relations);
                  modifiedEntityIds.push({ entityId });
                }

                break;
              } catch (e) {
                if (e instanceof ConflictError && attempt < BATCH_ATTEMPTS) {
                  this.logger.warn(
                    `Failed to write batch at attempt ${attempt}/${BATCH_ATTEMPTS}, ${e}`,
                  );
                } else {
                  throw e;
                }
              }
            }

            return modifiedEntityIds;
          }),
        );
      }
    }

    return (await Promise.all(tasks)).flat();
  }

  // Set the relations originating from an entity using the DB layer
  private async setRelations(
    originatingEntityId: string,
    relations: EntityRelationSpec[],
  ): Promise<void> {
    return await this.database.transaction(tx =>
      this.database.setRelations(tx, originatingEntityId, relations),
    );
  }

  // Given a batch of entities that were just read from a location, take them
  // into consideration by comparing against the existing catalog entities and
  // produce the list of entities to be added, and the list of entities to be
  // updated
  private async analyzeBatch(
    requests: EntityUpsertRequest[],
    { kind, namespace }: BatchContext,
  ): Promise<{
    toAdd: EntityUpsertRequest[];
    toUpdate: EntityUpsertRequest[];
    toIgnore: EntityUpsertRequest[];
  }> {
    const markTimestamp = process.hrtime();

    const names = requests.map(({ entity }) => entity.metadata.name);
    const oldEntities = await this.entities([
      {
        kind: kind,
        'metadata.namespace': namespace,
        'metadata.name': names,
      },
    ]);

    const oldEntitiesByName = new Map(
      oldEntities.map(e => [e.metadata.name, e]),
    );

    const toAdd: EntityUpsertRequest[] = [];
    const toUpdate: EntityUpsertRequest[] = [];
    const toIgnore: EntityUpsertRequest[] = [];

    for (const request of requests) {
      const newEntity = request.entity;
      const oldEntity = oldEntitiesByName.get(newEntity.metadata.name);
      if (!oldEntity) {
        toAdd.push(request);
      } else if (entityHasChanges(oldEntity, newEntity)) {
        // TODO(freben): This currently uses addOrUpdateEntity under the hood,
        // but should probably calculate the end result entity right here
        // instead and call a dedicated batch update database method instead
        toUpdate.push(request);
      } else {
        toIgnore.push(request);
      }
    }

    this.logger.debug(
      `Found ${toAdd.length} entities to add, ${
        toUpdate.length
      } entities to update in ${durationText(markTimestamp)}`,
    );

    return { toAdd, toUpdate, toIgnore };
  }

  // Efficiently adds the given entities to storage, under the assumption that
  // they do not conflict with any existing entities
  private async batchAdd(
    requests: EntityUpsertRequest[],
    { locationId }: BatchContext,
  ): Promise<EntityUpsertResponse[]> {
    const markTimestamp = process.hrtime();

    const res = await this.database.transaction(
      async tx =>
        await this.database.addEntities(
          tx,
          requests.map(({ entity }) => ({ locationId, entity })),
        ),
    );

    const entityIds = res.map(({ entity }) => ({
      entityId: entity.metadata.uid!,
    }));

    for (const [index, { entityId }] of entityIds.entries()) {
      await this.setRelations(entityId, requests[index].relations);
    }

    this.logger.debug(
      `Added ${requests.length} entities in ${durationText(markTimestamp)}`,
    );

    return entityIds;
  }

  // Efficiently updates the given entities into storage, under the assumption
  // that there already exist entities with the same names
  private async batchUpdate(
    requests: EntityUpsertRequest[],
    { locationId }: BatchContext,
  ): Promise<EntityUpsertResponse[]> {
    const markTimestamp = process.hrtime();
    const responseIds: EntityUpsertResponse[] = [];
    // TODO(freben): Still not batched
    for (const entity of requests) {
      const res = await this.addOrUpdateEntity(entity.entity, locationId);
      const entityId = res.metadata.uid!;
      responseIds.push({ entityId });
      await this.setRelations(entityId, entity.relations);
    }

    this.logger.debug(
      `Updated ${requests.length} entities in ${durationText(markTimestamp)}`,
    );

    return responseIds;
  }
}
