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

import {
  Location,
  LocationSpec,
  stringifyLocationReference,
} from '@backstage/catalog-model';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';
import { EntitiesCatalog, LocationsCatalog } from '../catalog';
import { Database } from '../database';
import { DbRefreshStateRequest } from '../database/types';
import { durationText } from '../util';
import { CatalogProcessingEngine } from './CatalogProcessingEngine';
import {
  AddLocationResult,
  HigherOrderOperation,
  LocationReader,
  RootLocationsProvider,
} from './types';

/**
 * Placeholder for operations that span several catalogs and/or stretches out
 * in time.
 *
 * TODO(freben): Find a better home for these, possibly refactoring to use the
 * database more directly.
 */
export class HigherOrderOperations implements HigherOrderOperation {
  constructor(
    private readonly entitiesCatalog: EntitiesCatalog,
    private readonly locationsCatalog: LocationsCatalog,
    private readonly locationReader: LocationReader,
    private readonly catalogProcessingEngine: CatalogProcessingEngine,
    private readonly rootLocationsProvider: RootLocationsProvider,
    private readonly database: Database,
    private readonly logger: Logger,
  ) {}

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
  async addLocation(
    spec: LocationSpec,
    options?: { dryRun?: boolean },
  ): Promise<AddLocationResult> {
    const dryRun = options?.dryRun || false;

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
    if (!(spec.presence === 'optional') && readerOutput.errors.length) {
      const item = readerOutput.errors[0];
      throw item.error;
    }

    // TODO(freben): At this point, we could detect orphaned entities, by way
    // of having a location annotation pointing to the location but not being
    // in the entities list. But we aren't sure what to do about those yet.

    // Write
    if (!previousLocation && !dryRun) {
      // TODO: We do not include location operations in the dryRun. We might perform
      // this operation as a separate dry run.
      await this.locationsCatalog.addLocation(location);
    }
    if (readerOutput.entities.length === 0) {
      return { location, entities: [] };
    }

    const writtenEntities = await this.entitiesCatalog.batchAddOrUpdateEntities(
      readerOutput.entities,
      {
        locationId: dryRun ? undefined : location.id,
        dryRun,
        outputEntities: true,
      },
    );

    const entities = writtenEntities.map(e => e.entity!);

    return { location, entities };
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
    const logger = this.logger.child({
      component: 'catalog-all-locations-refresh',
    });

    logger.info('Locations Refresh: Beginning locations refresh');

    const locations = await this.locationsCatalog.locations();
    logger.info(`Locations Refresh: Visiting ${locations.length} locations`);

    for (const { data: location } of locations) {
      logger.info(
        `Locations Refresh: Refreshing location ${stringifyLocationReference(
          location,
        )}`,
      );
      try {
        await this.refreshSingleLocation(location, logger);
        await this.locationsCatalog.logUpdateSuccess(location.id, undefined);
      } catch (e) {
        logger.warn(
          `Locations Refresh: Failed to refresh location ${stringifyLocationReference(
            location,
          )}, ${e.stack}`,
        );
        await this.locationsCatalog.logUpdateFailure(location.id, e);
      }
    }

    logger.info(
      `Locations Refresh: Completed locations refresh in ${durationText(
        startTimestamp,
      )}`,
    );
  }

  async processAllLocations(): Promise<void> {
    const startTimestamp = process.hrtime();
    const logger = this.logger.child({
      component: 'catalog-process-locations',
    });

    logger.info('Locations Processing: Starting');

    const locations = await this.rootLocationsProvider.getLocations();
    logger.info(
      `Locations Processing: Considering ${locations.length} root locations`,
    );

    for (const location of locations) {
      const label = `${location.type}:${location.target}`;
      logger.info(`Locations Processing: Considering location ${label}`);
      try {
        await this.processSingleLocation(
          location,
          logger.child({ location: label }),
        );
        // await this.locationsCatalog.logUpdateSuccess(label, undefined);
      } catch (e) {
        logger.warn(
          `Locations Processing: Failed to refresh location ${label}, ${e.stack}`,
        );
        // await this.locationsCatalog.logUpdateFailure(location.target, e);
      }
    }

    logger.info(
      `Locations Processing: Completed in ${durationText(startTimestamp)}`,
    );
  }

  // TODO
  // - [] Rewrite location reader to be catalogprocessor or entity processor
  // - [] Write locations to refresh_staten with nextTimestamp as now
  // - [] Implement refresh loop with refresh_state table

  // Performs a full refresh of a single location
  private async processSingleLocation(
    location: LocationSpec,
    optionalLogger?: Logger,
  ) {
    const logger = optionalLogger || this.logger;

    const { locations } = await this.catalogProcessingEngine.read({
      type: location.type,
      target: location.target,
    });

    logger.info(`Detected ${locations.length} locations`);
    // TODO - Store Location Entities in the catalog later

    // Add next refresh state
    const refreshStates: DbRefreshStateRequest[] = locations.map(
      ({ location: { type, target } }) => ({
        nextRefresh: 'now',
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Location',
          metadata: {
            name: `${type}:${target}`,
            namespace: 'default',
          },
          spec: {
            location: { type, target },
          },
        },
      }),
    );

    this.database.transaction(async tx => {
      await this.database.addEntityRefreshState(tx, refreshStates);
    });

    // Log any errors
    // Store any entities that have been found in the reader response
  }

  private async processRefreshState() {
    this.database.transaction(async tx => {
      await this.database.getProcessableEntities(tx, { processBatchSize: 5 });
      // Fetch X items with next_update older than Y
      // Process and update next_update
      // Update state with etags, etc.
    });
  }

  // Performs a full refresh of a single location
  private async refreshSingleLocation(
    location: Location,
    optionalLogger?: Logger,
  ) {
    let startTimestamp = process.hrtime();
    const logger = optionalLogger || this.logger;

    const readerOutput = await this.locationReader.read({
      type: location.type,
      target: location.target,
    });

    for (const item of readerOutput.errors) {
      logger.warn(
        `Failed item in location ${stringifyLocationReference(
          item.location,
        )}, ${item.error.stack}`,
      );
    }

    logger.info(
      `Read ${
        readerOutput.entities.length
      } entities from location ${stringifyLocationReference(
        location,
      )} in ${durationText(startTimestamp)}`,
    );

    startTimestamp = process.hrtime();

    try {
      await this.entitiesCatalog.batchAddOrUpdateEntities(
        readerOutput.entities,
        { locationId: location.id },
      );
    } catch (e) {
      for (const entity of readerOutput.entities) {
        await this.locationsCatalog.logUpdateFailure(
          location.id,
          e,
          entity.entity.metadata.name,
        );
      }
      throw e;
    }

    logger.debug(`Posting update success markers`);

    await this.locationsCatalog.logUpdateSuccess(
      location.id,
      readerOutput.entities.map(e => e.entity.metadata.name),
    );

    logger.info(
      `Wrote ${
        readerOutput.entities.length
      } entities from location ${stringifyLocationReference(
        location,
      )} in ${durationText(startTimestamp)}`,
    );
  }
}
