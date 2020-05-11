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
import path from 'path';
import Knex from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { AddLocationRequest, Component, Inventory, Location } from './types';

export class DatabaseInventory implements Inventory {
  static async create(database: Knex): Promise<DatabaseInventory> {
    await database.migrate.latest({
      directory: path.resolve(__dirname, '..', 'migrations'),
      loadExtensions: ['.js'],
    });

    return new DatabaseInventory(database);
  }

  constructor(private readonly database: Knex) {}

  async components(): Promise<Component[]> {
    throw new Error('Not supported');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async component(id: string): Promise<Component> {
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
