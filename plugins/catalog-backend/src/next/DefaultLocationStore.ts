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
import { Database } from '../database';
import {
  LocationStore,
  EntityProvider,
  EntityProviderConnection,
} from './types';
import { v4 as uuidv4 } from 'uuid';
import { locationSpecToLocationEntity } from './util';
import { ConflictError } from '@backstage/errors';

export class DefaultLocationStore implements LocationStore, EntityProvider {
  private _connection: EntityProviderConnection | undefined;

  constructor(private readonly db: Database) {}

  getProviderName(): string {
    return 'DefaultLocationStore';
  }

  createLocation(spec: LocationSpec): Promise<Location> {
    return this.db.transaction(async tx => {
      // TODO: id should really be type and target combined and not a uuid.

      // Attempt to find a previous location matching the spec
      const previousLocations = await this.listLocations();
      const previousLocation = previousLocations.some(
        l => spec.type === l.type && spec.target === l.target,
      );

      if (previousLocation) {
        throw new ConflictError(
          `Location ${spec.type}:${spec.target} already exists`,
        );
      }

      const location = await this.db.addLocation(tx, {
        id: uuidv4(),
        type: spec.type,
        target: spec.target,
      });

      await this.connection.applyMutation({
        type: 'delta',
        added: [locationSpecToLocationEntity(location)],
        removed: [],
      });

      return location;
    });
  }

  async listLocations(): Promise<Location[]> {
    const dbLocations = await this.db.locations();
    return dbLocations.map(item => ({
      id: item.id,
      target: item.target,
      type: item.type,
    }));
  }

  getLocation(id: string): Promise<Location> {
    return this.db.location(id);
  }

  deleteLocation(id: string): Promise<void> {
    if (!this.connection) {
      throw new Error('location store is not initialized');
    }

    return this.db.transaction(async tx => {
      const location = await this.db.location(id);
      if (!location) {
        throw new ConflictError(`No location found with id: ${id}`);
      }
      await this.db.removeLocation(tx, id);
      await this.connection.applyMutation({
        type: 'delta',
        added: [],
        removed: [locationSpecToLocationEntity(location)],
      });
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
    const locations = await this.db.locations();
    const entities = locations.map(location => {
      return locationSpecToLocationEntity(location);
    });
    await this.connection.applyMutation({
      type: 'full',
      entities,
    });
  }
}
