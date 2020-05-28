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

import Knex from 'knex';
import lodash from 'lodash';
import path from 'path';
import { Logger } from 'winston';
import {
  DescriptorParser,
  Entity,
  LocationReader,
  ParserError,
} from '../ingestion';
import { Database } from './Database';
import { DatabaseLocationUpdateLogStatus, DbEntityRequest } from './types';

export class DatabaseManager {
  public static async createDatabase(
    database: Knex,
    logger: Logger,
  ): Promise<Database> {
    await database.migrate.latest({
      directory: path.resolve(__dirname, 'migrations'),
      loadExtensions: ['.js'],
    });
    return new Database(database, logger);
  }

  private static async logUpdateSuccess(
    database: Database,
    locationId: string,
    entityName?: string,
  ) {
    return database.addLocationUpdateLogEvent(
      locationId,
      DatabaseLocationUpdateLogStatus.SUCCESS,
      entityName,
    );
  }

  private static async logUpdateFailure(
    database: Database,
    locationId: string,
    error?: Error,
    entityName?: string,
  ) {
    return database.addLocationUpdateLogEvent(
      locationId,
      DatabaseLocationUpdateLogStatus.FAIL,
      entityName,
      error?.message,
    );
  }

  public static async refreshLocations(
    database: Database,
    reader: LocationReader,
    parser: DescriptorParser,
    logger: Logger,
  ): Promise<void> {
    const locations = await database.locations();
    for (const location of locations) {
      try {
        logger.debug(
          `Refreshing location id="${location.id}" type="${location.type}" target="${location.target}"`,
        );

        const readerOutput = await reader.read(location.type, location.target);

        for (const readerItem of readerOutput) {
          if (readerItem.type === 'error') {
            logger.info(readerItem.error);
            continue;
          }

          try {
            const entity = await parser.parse(readerItem.data);
            await DatabaseManager.refreshSingleEntity(
              database,
              location.id,
              entity,
              logger,
            );
            await DatabaseManager.logUpdateSuccess(
              database,
              location.id,
              entity.metadata!.name,
            );
          } catch (error) {
            let entityName;
            if (error instanceof ParserError) {
              entityName = error.entityName;
            }
            await DatabaseManager.logUpdateFailure(
              database,
              location.id,
              error,
              entityName,
            );
          }
        }
        await DatabaseManager.logUpdateSuccess(
          database,
          location.id,
          undefined,
        );
      } catch (error) {
        logger.debug(
          `Failed to refresh location id="${location.id}", ${error}`,
        );
        await DatabaseManager.logUpdateFailure(database, location.id, error);
      }
    }
  }

  private static async refreshSingleEntity(
    database: Database,
    locationId: string,
    entity: Entity,
    logger: Logger,
  ): Promise<void> {
    const { kind } = entity;
    const { name, namespace } = entity.metadata || {};
    if (!name) {
      throw new Error('Entities without names are not yet supported');
    }

    const request: DbEntityRequest = {
      locationId: locationId,
      entity: entity,
    };

    logger.debug(
      `Read entity kind="${kind}" name="${name}" namespace="${namespace}"`,
    );

    await database.transaction(async tx => {
      const previous = await database.entity(tx, kind, name, namespace);
      if (!previous) {
        logger.debug(`No such entity found, adding`);
        await database.addEntity(tx, request);
      } else if (
        !DatabaseManager.entitiesAreEqual(previous.entity, request.entity)
      ) {
        logger.debug(`Different from existing entity, updating`);
        await database.updateEntity(tx, request);
      } else {
        logger.debug(`Equal to existing entity, skipping update`);
      }
    });
  }

  private static entitiesAreEqual(first: Entity, second: Entity) {
    const firstClone = lodash.cloneDeep(first);
    const secondClone = lodash.cloneDeep(second);

    // Remove generated fields
    if (firstClone.metadata) {
      delete firstClone.metadata.uid;
      delete firstClone.metadata.etag;
      delete firstClone.metadata.generation;
    }
    if (secondClone.metadata) {
      delete secondClone.metadata.uid;
      delete secondClone.metadata.etag;
      delete secondClone.metadata.generation;
    }

    return lodash.isEqual(firstClone, secondClone);
  }
}
