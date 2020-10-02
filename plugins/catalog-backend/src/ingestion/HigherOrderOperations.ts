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

import { InputError } from '@backstage/backend-common';
import {
  Entity,
  entityHasChanges,
  getEntityName,
  Location,
  LocationSpec,
  serializeEntityRef,
} from '@backstage/catalog-model';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';
import { EntitiesCatalog, LocationsCatalog } from '../catalog';
import {
  AddLocationResult,
  HigherOrderOperation,
  LocationReader,
} from './types';

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
        `Failed to read location ${item.location.type} ${item.location.target}, ${item.error}`,
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
    const startTimestamp = new Date().valueOf();
    this.logger.info('Beginning locations refresh');

    const locations = await this.locationsCatalog.locations();
    this.logger.info(`Visiting ${locations.length} locations`);

    for (const { data: location } of locations) {
      this.logger.debug(
        `Refreshing location id="${location.id}" type="${location.type}" target="${location.target}"`,
      );
      try {
        await this.refreshSingleLocation(location);
        await this.locationsCatalog.logUpdateSuccess(location.id, undefined);
      } catch (e) {
        this.logger.debug(
          `Failed to refresh location id="${location.id}" type="${location.type}" target="${location.target}", ${e}`,
        );
        await this.locationsCatalog.logUpdateFailure(location.id, e);
      }
    }

    const endTimestamp = new Date().valueOf();
    const duration = ((endTimestamp - startTimestamp) / 1000).toFixed(1);
    this.logger.debug(`Completed locations refresh in ${duration} seconds`);
  }

  // Performs a full refresh of a single location
  private async refreshSingleLocation(location: Location) {
    const readerOutput = await this.locationReader.read({
      type: location.type,
      target: location.target,
    });

    for (const item of readerOutput.errors) {
      this.logger.debug(
        `Failed item in location type="${item.location.type}" target="${item.location.target}", ${item.error}`,
      );
    }

    this.logger.info(
      `Read ${readerOutput.entities.length} entities from location ${location.type} ${location.target}`,
    );

    const startTimestamp = Date.now();
    for (const item of readerOutput.entities) {
      const { entity } = item;

      try {
        const previous = await this.entitiesCatalog.entityByName(
          getEntityName(entity),
        );

        if (!previous) {
          await this.entitiesCatalog.addOrUpdateEntity(entity, location.id);
        } else if (entityHasChanges(previous, entity)) {
          await this.entitiesCatalog.addOrUpdateEntity(entity, location.id);
        }

        await this.locationsCatalog.logUpdateSuccess(
          location.id,
          entity.metadata.name,
        );
      } catch (error) {
        this.logger.info(
          `Failed refresh of entity ${serializeEntityRef(entity)}, ${error}`,
        );

        await this.locationsCatalog.logUpdateFailure(
          location.id,
          error,
          entity.metadata.name,
        );
      }
    }

    const duration = ((Date.now() - startTimestamp) / 1000).toFixed(1);
    this.logger.info(
      `Wrote ${readerOutput.entities.length} entities from location ${location.type} ${location.target} in ${duration} seconds`,
    );
  }
}
