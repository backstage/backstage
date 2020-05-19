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
import { DescriptorParser, LocationReader } from '../ingestion';
import { Database } from './Database';
import { AddDatabaseComponent } from './types';

export class DatabaseManager {
  public static async createDatabase(database: Knex): Promise<Database> {
    await database.migrate.latest({
      directory: path.resolve(__dirname, 'migrations'),
      loadExtensions: ['.js'],
    });
    return new Database(database);
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

          const parserOutput = await parser.parse(readerItem.data);
          if (parserOutput.kind === 'Component') {
            const component = parserOutput.component;
            const dbc: AddDatabaseComponent = {
              locationId: location.id,
              name: component.metadata.name,
            };
            await database.addOrUpdateComponent(dbc);
          }
        }
      } catch (e) {
        // TODO(freben): Store trace log of these events, or at least the
        // latest status, per location
        logger.debug(`Failed to refresh location ${location.id}, ${e}`);
      }
    }
  }
}
