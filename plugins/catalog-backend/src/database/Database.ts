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
import { v4 as uuidv4 } from 'uuid';
import {
  AddDatabaseComponent,
  AddDatabaseLocation,
  DatabaseComponent,
  DatabaseLocation,
} from './types';

export class Database {
  constructor(private readonly database: Knex) {}

  async addOrUpdateComponent(component: AddDatabaseComponent): Promise<void> {
    await this.database.transaction(async (tx) => {
      // TODO(freben): Currently, several locations can compete for the same component
      // TODO(freben): If locationId is unset in the input, it won't be overwritten - should we instead replace with null?
      const count = await tx<DatabaseComponent>('components')
        .where({ name: component.name })
        .update({ ...component });
      if (!count) {
        await tx<DatabaseComponent>('components').insert({
          ...component,
          id: uuidv4(),
        });
      }
    });
  }

  async components(): Promise<DatabaseComponent[]> {
    return await this.database<DatabaseComponent>('components')
      .orderBy('name')
      .select();
  }

  async component(name: string): Promise<DatabaseComponent> {
    const items = await this.database<DatabaseComponent>('components')
      .where({ name })
      .select();
    if (!items.length) {
      throw new NotFoundError(`Found no component with name ${name}`);
    }
    return items[0];
  }

  async addLocation(location: AddDatabaseLocation): Promise<DatabaseLocation> {
    return await this.database.transaction<DatabaseLocation>(async (tx) => {
      const existingLocation = await tx<DatabaseLocation>('locations')
        .where({
          target: location.target,
        })
        .select();

      if (existingLocation?.[0]) {
        return existingLocation[0];
      }

      const id = uuidv4();
      const { type, target } = location;
      await tx<DatabaseLocation>('locations').insert({
        id,
        type,
        target,
      });

      return (
        await tx<DatabaseLocation>('locations').where({ id }).select()
      )![0];
    });
  }

  async removeLocation(id: string): Promise<void> {
    const result = await this.database<DatabaseLocation>('locations')
      .where({ id })
      .del();

    if (!result) {
      throw new NotFoundError(`Found no location with ID ${id}`);
    }
  }

  async location(id: string): Promise<DatabaseLocation> {
    const items = await this.database<DatabaseLocation>('locations')
      .where({ id })
      .select();
    if (!items.length) {
      throw new NotFoundError(`Found no location with ID ${id}`);
    }
    return items[0];
  }

  async locations(): Promise<DatabaseLocation[]> {
    return await this.database<DatabaseLocation>('locations').select();
  }
}
