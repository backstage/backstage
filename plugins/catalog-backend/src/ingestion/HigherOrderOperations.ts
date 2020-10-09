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

import { ConflictError, InputError } from '@backstage/backend-common';
import {
  Entity,
  entityHasChanges,
  getEntityName,
  Location,
  LocationSpec,
  serializeEntityRef,
} from '@backstage/catalog-model';
import { chunk, groupBy } from 'lodash';
import limiterFactory from 'p-limit';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';
import { EntitiesCatalog, LocationsCatalog } from '../catalog';
import { durationText } from '../util/timing';
import {
  AddLocationResult,
  HigherOrderOperation,
  LocationReader,
} from './types';

type BatchContext = {
  kind: string;
  namespace: string;
  location: Location;
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

/**
 * Placeholder for operations that span several catalogs and/or stretches out
 * in time.
 *
 * TODO(freben): Find a better home for these, possibly refactoring to use the
 * database more directly.
 */
export class HigherOrderOperations implements HigherOrderOperation {
  private readonly entitiesCatalog: EntitiesCatalog;
  private readonly locationsCatalog: LocationsCatalog;
  private readonly locationReader: LocationReader;
  private readonly logger: Logger;

  constructor(
    entitiesCatalog: EntitiesCatalog,
    locationsCatalog: LocationsCatalog,
    locationReader: LocationReader,
    logger: Logger,
  ) {
    this.entitiesCatalog = entitiesCatalog;
    this.locationsCatalog = locationsCatalog;
    this.locationReader = locationReader;
    this.logger = logger;
  }

  /**
   * Adds a single location to the catalog.
   *
   * The location is inspected and fetched, and all of the resulting data is
   * validated. If everything goes well, the location and entities are stored
   * in the catalog.
   *
   * If the location already existed, the old location is returned instead and
   * the catalog is left unchanged.
   *
   * @param spec The location to add
   */
  async addLocation(spec: LocationSpec): Promise<AddLocationResult> {
    // Attempt to find a previous location matching the spec
    const previousLocations = await this.locationsCatalog.locations();
    const previousLocation = previousLocations.find(
      l => spec.type === l.data.type && spec.target === l.data.target,
    );
    const location: Location = previousLocation
      ? previousLocation.data
      : {
          id: uuidv4(),
          type: spec.type,
          target: spec.target,
        };

    // Read the location fully, bailing on any errors
    const readerOutput = await this.locationReader.read(spec);
    if (readerOutput.errors.length) {
      const item = readerOutput.errors[0];
      throw new InputError(
        `Failed to read location ${item.location.type}:${item.location.target}, ${item.error}`,
      );
    }

    // TODO(freben): At this point, we could detect orphaned entities, by way
    // of having a location annotation pointing to the location but not being
    // in the entities list. But we aren't sure what to do about those yet.

    // Write
    if (!previousLocation) {
      await this.locationsCatalog.addLocation(location);
    }
    const outputEntities: Entity[] = [];
    for (const entity of readerOutput.entities) {
      const out = await this.entitiesCatalog.addOrUpdateEntity(
        entity.entity,
        location.id,
      );
      outputEntities.push(out);
    }

    return { location, entities: outputEntities };
  }

  /**
   * Goes through all registered locations, and performs a refresh of each one.
   *
   * Entities are read from their respective sources, are parsed and validated
   * according to the entity policy, and get inserted or updated in the catalog.
   * Entities that have disappeared from their location are left orphaned,
   * without changes.
   */
  async refreshAllLocations(): Promise<void> {
    const startTimestamp = process.hrtime();
    this.logger.info('Beginning locations refresh');

    const locations = await this.locationsCatalog.locations();
    this.logger.info(`Visiting ${locations.length} locations`);

    for (const { data: location } of locations) {
      this.logger.info(
        `Refreshing location ${location.type}:${location.target}`,
      );
      try {
        await this.refreshSingleLocation(location);
        await this.locationsCatalog.logUpdateSuccess(location.id, undefined);
      } catch (e) {
        this.logger.warn(
          `Failed to refresh location ${location.type}:${location.target}, ${e}`,
        );
        await this.locationsCatalog.logUpdateFailure(location.id, e);
      }
    }

    this.logger.info(
      `Completed locations refresh in ${durationText(startTimestamp)}`,
    );
  }

  // Performs a full refresh of a single location
  private async refreshSingleLocation(location: Location) {
    let startTimestamp = process.hrtime();

    const readerOutput = await this.locationReader.read({
      type: location.type,
      target: location.target,
    });

    for (const item of readerOutput.errors) {
      this.logger.warn(
        `Failed item in location ${item.location.type}:${item.location.target}, ${item.error}`,
      );
    }

    this.logger.info(
      `Read ${readerOutput.entities.length} entities from location ${
        location.type
      }:${location.target} in ${durationText(startTimestamp)}`,
    );

    startTimestamp = process.hrtime();

    await this.batchAddOrUpdateEntities(
      readerOutput.entities.map(e => e.entity),
      location,
    );

    this.logger.info(
      `Wrote ${readerOutput.entities.length} entities from location ${
        location.type
      }:${location.target} in ${durationText(startTimestamp)}`,
    );
  }

  /**
   * Writes a number of entities efficiently to storage.
   *
   * @param entities Some entities
   * @param location The location that they all belong to
   */
  async batchAddOrUpdateEntities(entities: Entity[], location: Location) {
    // Group the entities by unique kind+namespace combinations
    const entitiesByKindAndNamespace = groupBy(entities, entity => {
      const name = getEntityName(entity);
      return `${name.kind}:${name.namespace}`.toLowerCase();
    });

    const limiter = limiterFactory(BATCH_CONCURRENCY);
    const tasks: Promise<void>[] = [];

    for (const groupEntities of Object.values(entitiesByKindAndNamespace)) {
      const { kind, namespace } = getEntityName(groupEntities[0]);

      // Go through the new entities in reasonable chunk sizes (sometimes,
      // sources produce tens of thousands of entities, and those are too large
      // batch sizes to reasonably send to the database)
      for (const batch of chunk(groupEntities, BATCH_SIZE)) {
        tasks.push(
          limiter(async () => {
            const first = serializeEntityRef(batch[0]);
            const last = serializeEntityRef(batch[batch.length - 1]);
            this.logger.debug(
              `Considering batch ${first}-${last} (${batch.length} entries)`,
            );

            // Retry the batch write a few times to deal with contention
            const context = { kind, namespace, location };
            for (let attempt = 1; attempt <= BATCH_ATTEMPTS; ++attempt) {
              try {
                const { toAdd, toUpdate } = await this.analyzeBatch(
                  batch,
                  context,
                );
                if (toAdd.length) await this.batchAdd(toAdd, context);
                if (toUpdate.length) await this.batchUpdate(toUpdate, context);
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
          }),
        );
      }
    }

    await Promise.all(tasks);
  }

  // Given a batch of entities that were just read from a location, take them
  // into consideration by comparing against the existing catalog entities and
  // produce the list of entities to be added, and the list of entities to be
  // updated
  private async analyzeBatch(
    newEntities: Entity[],
    { kind, namespace }: BatchContext,
  ): Promise<{
    toAdd: Entity[];
    toUpdate: Entity[];
  }> {
    const markTimestamp = process.hrtime();

    const names = newEntities.map(e => e.metadata.name);
    const oldEntities = await this.entitiesCatalog.entities([
      { key: 'kind', values: [kind] },
      { key: 'metadata.namespace', values: [namespace] },
      { key: 'metadata.name', values: names },
    ]);

    const oldEntitiesByName = new Map(
      oldEntities.map(e => [e.metadata.name, e]),
    );

    const toAdd: Entity[] = [];
    const toUpdate: Entity[] = [];

    for (const newEntity of newEntities) {
      const oldEntity = oldEntitiesByName.get(newEntity.metadata.name);
      if (!oldEntity) {
        toAdd.push(newEntity);
      } else if (entityHasChanges(oldEntity, newEntity)) {
        toUpdate.push(newEntity);
      }
    }

    this.logger.debug(
      `Found ${toAdd.length} entities to add, ${
        toUpdate.length
      } entities to update in ${durationText(markTimestamp)}`,
    );

    return { toAdd, toUpdate };
  }

  // Efficiently adds the given entities to storage, under the assumption that
  // they do not conflict with any existing entities
  private async batchAdd(entities: Entity[], { location }: BatchContext) {
    const markTimestamp = process.hrtime();

    await this.entitiesCatalog.addEntities(entities, location.id);

    // TODO(freben): Still not batched
    for (const entity of entities) {
      await this.locationsCatalog.logUpdateSuccess(
        location.id,
        entity.metadata.name,
      );
    }

    this.logger.debug(
      `Added ${entities.length} entities in ${durationText(markTimestamp)}`,
    );
  }

  // Efficiently updates the given entities into storage, under the assumption
  // that there already exist entities with the same names
  private async batchUpdate(entities: Entity[], { location }: BatchContext) {
    const markTimestamp = process.hrtime();

    // TODO(freben): Still not batched
    for (const entity of entities) {
      await this.entitiesCatalog.addOrUpdateEntity(entity);

      await this.locationsCatalog.logUpdateSuccess(
        location.id,
        entity.metadata.name,
      );
    }

    this.logger.debug(
      `Updated ${entities.length} entities in ${durationText(markTimestamp)}`,
    );
  }
}
