/*
 * Copyright 2021 Spotify AB
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

import { LocationSpec, Location } from '@backstage/catalog-model';
import {
  LocationStore,
  EntityProvider,
  EntityProviderConnection,
} from './types';
import { v4 as uuid } from 'uuid';
import { locationSpecToLocationEntity } from './util';
import { ConflictError, NotFoundError } from '@backstage/errors';
import { BackgroundContext, Context, TransactionValue } from './Context';
import { Knex } from 'knex';

type DbLocationsRow = {
  id: string;
  type: string;
  target: string;
};

export class DefaultLocationStore implements LocationStore, EntityProvider {
  private _connection: EntityProviderConnection | undefined;

  constructor(private readonly db: Knex) {}

  getProviderName(): string {
    return 'DefaultLocationStore';
  }

  async createLocation(ctx: Context, spec: LocationSpec): Promise<Location> {
    const tx = TransactionValue.from(ctx);

    // Attempt to find a previous location matching the spec
    const previousLocations = await this.listLocations(ctx);
    const previousLocation = previousLocations.some(
      l => spec.type === l.type && spec.target === l.target,
    );

    if (previousLocation) {
      throw new ConflictError(
        `Location ${spec.type}:${spec.target} already exists`,
      );
    }

    const location: DbLocationsRow = {
      id: uuid(),
      type: spec.type,
      target: spec.target,
    };
    await tx<DbLocationsRow>('locations').insert(location);

    await this.connection.applyMutation({
      type: 'delta',
      added: [locationSpecToLocationEntity(location)],
      removed: [],
    });

    return location;
  }

  async listLocations(ctx: Context): Promise<Location[]> {
    const tx = TransactionValue.from(ctx);
    const locations = await tx<DbLocationsRow>('locations').select();
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

  async getLocation(ctx: Context, id: string): Promise<Location> {
    const tx = TransactionValue.from(ctx);
    const items = await tx<DbLocationsRow>('locations').where({ id }).select();

    if (!items.length) {
      throw new NotFoundError(`Found no location with ID ${id}`);
    }
    return items[0];
  }

  async deleteLocation(ctx: Context, id: string): Promise<void> {
    if (!this.connection) {
      throw new Error('location store is not initialized');
    }

    const tx = TransactionValue.from(ctx);
    const location = await this.getLocation(ctx, id);

    const locations = await tx<DbLocationsRow>('locations')
      .where({ id })
      .select();

    if (!locations.length) {
      throw new NotFoundError(`Found no location with ID ${id}`);
    }

    await tx<DbLocationsRow>('locations').where({ id }).del();

    await this.connection.applyMutation({
      type: 'delta',
      added: [],
      removed: [locationSpecToLocationEntity(location)],
    });
  }

  private get connection(): EntityProviderConnection {
    if (!this._connection) {
      throw new Error('location store is not initialized');
    }

    return this._connection;
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this._connection = connection;

    // TODO: this feels a little weird creating the ctx in multiple places
    // Let's work out a better way, maybe.
    const locations = await this.db.transaction(tx => {
      const ctx = TransactionValue.in(new BackgroundContext(), tx);
      return this.listLocations(ctx);
    });

    const entities = locations.map(location => {
      return locationSpecToLocationEntity(location);
    });

    await this.connection.applyMutation({
      type: 'full',
      entities,
    });
  }
}
