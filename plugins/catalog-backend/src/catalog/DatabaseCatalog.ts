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
import Knex from 'knex';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';
import { readLocation } from '../ingestion';
import { AddLocationRequest, Catalog, Component, Location } from './types';

export class DatabaseCatalog implements Catalog {
  static async create(
    database: Knex,
    logger: Logger,
  ): Promise<DatabaseCatalog> {
    await database.migrate.latest({
      directory: path.resolve(__dirname, '..', 'migrations'),
      loadExtensions: ['.js'],
    });

    const databaseCatalog = new DatabaseCatalog(database, logger);

    const startRefresh = async () => {
      for (;;) {
        await databaseCatalog.refreshLocations();
        await new Promise(r => setTimeout(r, 10000));
      }
    };
    startRefresh();

    return databaseCatalog;
  }

  constructor(
    private readonly database: Knex,
    private readonly logger: Logger,
  ) {}

  async components(): Promise<Component[]> {
    throw new Error('Not supported');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async component(name: string): Promise<Component> {
    throw new Error('Not supported');
  }

  async addLocation(location: AddLocationRequest): Promise<Location> {
    const id = uuidv4();
    const { type, target } = location;
    await this.database('locations').insert({ id, type, target });
    return await this.location(id);
  }

  async removeLocation(id: string): Promise<void> {
    const result = await this.database('locations')
      .where({ id })
      .del();

    if (!result) {
      throw new NotFoundError(`Found no location with ID ${id}`);
    }
  }

  async refreshLocations(): Promise<void> {
    const locations = await this.locations();
    for (const location of locations) {
      try {
        this.logger.debug(`Attempting refresh of location: ${location.id}`);
        const components = await readLocation(location);
        for (const component of components) {
          await this.database.transaction(async tx => {
            await tx('components')
              .insert(component)
              .catch(() =>
                tx('components')
                  .where({ name: component.name })
                  .update(component),
              );
          });
        }
      } catch (e) {
        this.logger.debug(`Failed to update location "${location.id}", ${e}`);
      }
    }
  }

  async location(id: string): Promise<Location> {
    const items = await this.database('locations')
      .where({ id })
      .select();
    if (!items.length) {
      throw new NotFoundError(`Found no location with ID ${id}`);
    }
    return items[0];
  }

  async locations(): Promise<Location[]> {
    return await this.database('locations').select();
  }
}
