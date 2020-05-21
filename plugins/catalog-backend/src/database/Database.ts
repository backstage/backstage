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
  AddDatabaseEntity,
  AddDatabaseLocation,
  DatabaseEntity,
  DatabaseLocation,
  DatabaseLocationUpdateLogEvent,
  DatabaseLocationUpdateLogStatus,
} from './types';

export class Database {
  constructor(private readonly database: Knex) {}

  async addOrUpdateEntity(entity: AddDatabaseEntity): Promise<void> {
    await this.database.transaction(async tx => {
      // TODO(freben): Currently, several locations can compete for the same entity
      // TODO(freben): If locationId is unset in the input, it won't be overwritten - should we instead replace with null?
      const count = await tx<DatabaseEntity>('entities')
        .where({ name: entity.name })
        .update({ ...entity });
      if (!count) {
        await tx<DatabaseEntity>('entities').insert({
          ...entity,
          id: uuidv4(),
        });
      }
    });
  }

  async entities(): Promise<DatabaseEntity[]> {
    return await this.database<DatabaseEntity>('entities')
      .orderBy('name')
      .select();
  }

  async entity(name: string): Promise<DatabaseEntity> {
    const items = await this.database<DatabaseEntity>('entities')
      .where({ name })
      .select();
    if (!items.length) {
      throw new NotFoundError(`Found no entity with name ${name}`);
    }
    return items[0];
  }

  async addLocation(location: AddDatabaseLocation): Promise<DatabaseLocation> {
    return await this.database.transaction<DatabaseLocation>(async tx => {
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

      return (await tx<DatabaseLocation>('locations')
        .where({ id })
        .select())![0];
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
    return this.database<DatabaseLocation>('locations').select();
  }

  async addLocationUpdateLogEvent(
    locationId: string,
    status: DatabaseLocationUpdateLogStatus,
    entityName?: string,
    message?: string,
  ): Promise<void> {
    return this.database<DatabaseLocationUpdateLogEvent>(
      'location_update_log',
    ).insert({
      id: uuidv4(),
      status: status,
      location_id: locationId,
      entity_name: entityName,
      message,
    });
  }
}
