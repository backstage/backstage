/*
 * Copyright 2021 The Backstage Authors
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

import { Location } from '@backstage/catalog-client';
import { ConflictError, NotFoundError } from '@backstage/errors';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-backend';
import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';
import { getEntityLocationRef } from '../../processing/util';
import { LocationInput, LocationStore } from '../../service/types';
import { locationSpecToLocationEntity } from '../../util/conversion';
import { LocationsRegistryStore } from './LocationsRegistryStore';
import { DbLocationsRow } from './types';

/**
 * Allows users to register and unregister locations, that turn into Location kind entities.
 *
 * @public
 */
export class LocationsRegistryEntityProvider
  implements LocationStore, EntityProvider
{
  private readonly store: LocationsRegistryStore;
  private connection: EntityProviderConnection | undefined;

  constructor(store: LocationsRegistryStore) {
    this.store = store;
    this.connection = undefined;
  }

  getProviderName(): string {
    // This ID is a remnant from what the original entity provider in the
    // catalog core had as its ID. We retain this ID to save users from having
    // to perform an additional cleanup step of old already-registered
    // locations.
    return 'DefaultLocationStore';
  }

  async createLocation(input: LocationInput): Promise<Location> {
    const location = await this.db.transaction(async tx => {
      // Attempt to find a previous location matching the input
      const previousLocations = await this.locations(tx);
      // TODO: when location id's are a compilation of input target we can remove this full
      // lookup of locations first and just grab the by that instead.
      const previousLocation = previousLocations.some(
        l => input.type === l.type && input.target === l.target,
      );
      if (previousLocation) {
        throw new ConflictError(
          `Location ${input.type}:${input.target} already exists`,
        );
      }

      const inner: DbLocationsRow = {
        id: uuid(),
        type: input.type,
        target: input.target,
      };

      await tx<DbLocationsRow>('locations').insert(inner);

      return inner;
    });
    const entity = locationSpecToLocationEntity({ location });
    await this.connection.applyMutation({
      type: 'delta',
      added: [{ entity, locationKey: getEntityLocationRef(entity) }],
      removed: [],
    });

    return location;
  }

  async listLocations(): Promise<Location[]> {
    return await this.locations();
  }

  async getLocation(id: string): Promise<Location> {
    const items = await this.db<DbLocationsRow>('locations')
      .where({ id })
      .select();

    if (!items.length) {
      throw new NotFoundError(`Found no location with ID ${id}`);
    }
    return items[0];
  }

  async deleteLocation(id: string): Promise<void> {
    if (!this.connection) {
      throw new Error('location store is not initialized');
    }

    const deleted = await this.db.transaction(async tx => {
      const [location] = await tx<DbLocationsRow>('locations')
        .where({ id })
        .select();

      if (!location) {
        throw new NotFoundError(`Found no location with ID ${id}`);
      }

      await tx<DbLocationsRow>('locations').where({ id }).del();
      return location;
    });
    const entity = locationSpecToLocationEntity({ location: deleted });
    await this.connection.applyMutation({
      type: 'delta',
      added: [],
      removed: [{ entity, locationKey: getEntityLocationRef(entity) }],
    });
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;

    const locations = await this.locations();

    const entities = locations.map(location => {
      const entity = locationSpecToLocationEntity({ location });
      return { entity, locationKey: getEntityLocationRef(entity) };
    });

    await this.connection.applyMutation({
      type: 'full',
      entities,
    });
  }

  private async locations(dbOrTx: Knex.Transaction | Knex = this.db) {
    const locations = await dbOrTx<DbLocationsRow>('locations').select();
    return (
      locations
        // TODO(blam): We should create a mutation to remove this location for everyone
        // eventually when it's all done and dusted
        .filter(({ type }) => type !== 'bootstrap')
        .map(item => ({
          id: item.id,
          target: item.target,
          type: item.type,
        }))
    );
  }
}
