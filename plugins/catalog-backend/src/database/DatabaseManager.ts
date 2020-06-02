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
import Knex from 'knex';
import lodash from 'lodash';
import path from 'path';
import { Logger } from 'winston';
import type { IngestionModel } from '../ingestion/types';
import { CommonDatabase } from './CommonDatabase';
import { DatabaseLocationUpdateLogStatus } from './types';
import type { Database, DbEntityRequest } from './types';

export class DatabaseManager {
  public static async createDatabase(
    knex: Knex,
    logger: Logger,
  ): Promise<Database> {
    await knex.migrate.latest({
      directory: path.resolve(__dirname, 'migrations'),
      loadExtensions: ['.js'],
    });
    return new CommonDatabase(knex, logger);
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
    ingestionModel: IngestionModel,
    entityPolicy: EntityPolicy,
    logger: Logger,
  ): Promise<void> {
    const locations = await database.locations();
    for (const location of locations) {
      try {
        logger.debug(
          `Refreshing location id="${location.id}" type="${location.type}" target="${location.target}"`,
        );

        const readerOutput = await ingestionModel.readLocation(
          location.type,
          location.target,
        );

        for (const readerItem of readerOutput) {
          if (readerItem.type === 'error') {
            logger.info(readerItem.error);
            continue;
          }

          try {
            const entity = await entityPolicy.enforce(readerItem.data);
            await DatabaseManager.refreshSingleEntity(
              database,
              location.id,
              entity,
              logger,
            );
            await DatabaseManager.logUpdateSuccess(
              database,
              location.id,
              entity.metadata.name,
            );
          } catch (error) {
            await DatabaseManager.logUpdateFailure(
              database,
              location.id,
              error,
              readerItem.data.metadata.name,
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

  private static entitiesAreEqual(previous: Entity, next: Entity) {
    if (
      previous.apiVersion !== next.apiVersion ||
      previous.kind !== next.kind ||
      !lodash.isEqual(previous.spec, next.spec) // Accept that {} !== undefined
    ) {
      return false;
    }

    // Since the next annotations get merged into the previous, extract only
    // the overlapping keys and check if their values match.
    if (next.metadata.annotations) {
      if (!previous.metadata.annotations) {
        return false;
      }
      if (
        !lodash.isEqual(
          next.metadata.annotations,
          lodash.pick(
            previous.metadata.annotations,
            Object.keys(next.metadata.annotations),
          ),
        )
      ) {
        return false;
      }
    }

    const e1 = lodash.cloneDeep(previous);
    const e2 = lodash.cloneDeep(next);

    if (!e1.metadata.labels) {
      e1.metadata.labels = {};
    }
    if (!e2.metadata.labels) {
      e2.metadata.labels = {};
    }

    // Remove generated fields
    delete e1.metadata.uid;
    delete e1.metadata.etag;
    delete e1.metadata.generation;
    delete e2.metadata.uid;
    delete e2.metadata.etag;
    delete e2.metadata.generation;

    // Remove already compared things
    delete e1.metadata.annotations;
    delete e1.spec;
    delete e2.metadata.annotations;
    delete e2.spec;

    return lodash.isEqual(e1, e2);
  }
}
