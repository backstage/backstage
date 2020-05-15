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
import { ComponentDescriptor } from '../descriptors';
import { readLocation } from '../ingestion';
import { CatalogLogic } from './CatalogLogic';
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
    CatalogLogic.startRefreshLoop(databaseCatalog, readLocation, logger);

    return databaseCatalog;
  }

  constructor(
    private readonly database: Knex,
    private readonly logger: Logger,
  ) {}

  async addOrUpdateComponent(
    locationId: string,
    descriptor: ComponentDescriptor,
  ): Promise<void> {
    const component: Component = {
      name: descriptor.metadata.name,
    };

    await this.database.transaction(async (tx) => {
      // TODO(freben): Currently, several locations can compete for the same component
      const count = await tx('components')
        .where({ name: component.name })
        .update({ ...component, locationId });
      if (!count) {
        await tx('components').insert({
          ...component,
          id: uuidv4(),
          locationId,
        });
      }
    });
  }

  async components(): Promise<Component[]> {
    return await this.database('components').select();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async component(name: string): Promise<Component> {
    const items = await this.database('components').where({ name }).select();
    if (!items.length) {
      throw new NotFoundError(`Found no component with name ${name}`);
    }
    return items[0];
  }

  async addLocation(location: AddLocationRequest): Promise<Location> {
    const id = uuidv4();
    const { type, target } = location;
    await this.database('locations').insert({ id, type, target });
    return await this.location(id);
  }

  async removeLocation(id: string): Promise<void> {
    const result = await this.database('locations').where({ id }).del();

    if (!result) {
      throw new NotFoundError(`Found no location with ID ${id}`);
    }
  }

  async location(id: string): Promise<Location> {
    const items = await this.database('locations').where({ id }).select();
    if (!items.length) {
      throw new NotFoundError(`Found no location with ID ${id}`);
    }
    return items[0];
  }

  async locations(): Promise<Location[]> {
    return await this.database('locations').select();
  }
}
