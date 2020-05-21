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
import path from 'path';
import { Logger } from 'winston';
import { DescriptorParser, LocationReader, ParserError } from '../ingestion';
import { Database } from './Database';
import { DatabaseLocationUpdateLogStatus, DbEntityRequest } from './types';

export class DatabaseManager {
  public static async createDatabase(database: Knex): Promise<Database> {
    await database.migrate.latest({
      directory: path.resolve(__dirname, 'migrations'),
      loadExtensions: ['.js'],
    });
    return new Database(database);
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
          `Refreshing location ${location.id} type "${location.type}" target "${location.target}"`,
        );

        const readerOutput = await reader.read(location.type, location.target);

        for (const readerItem of readerOutput) {
          if (readerItem.type === 'error') {
            logger.debug(readerItem.error);
            continue;
          }
          try {
            const entity = await parser.parse(readerItem.data);
            const dbc: DbEntityRequest = { locationId: location.id, entity };
            await database.addOrUpdateEntity(dbc);
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
        await DatabaseManager.logUpdateSuccess(database, location.id);
      } catch (error) {
        logger.debug(`Failed to refresh location ${location.id}, ${error}`);
        await DatabaseManager.logUpdateFailure(database, location.id, error);
      }
    }
  }
}
