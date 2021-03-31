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
import { CommonDatabase } from '../database';
import { LocationStore } from './types';
import { v4 as uuidv4 } from 'uuid';
import { ConflictError } from '@backstage/errors';
import { Observable } from '@backstage/core';
import ObservableImpl from 'zen-observable';

export type LocationMessage =
  | { all: Location[] }
  | { added: Location[]; removed: Location[] };

export class LocationStoreImpl implements LocationStore {
  private subscribers = new Set<
    ZenObservable.SubscriptionObserver<LocationMessage>
  >();

  constructor(private readonly db: CommonDatabase) {}

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

      this.notifyAddition(location);

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
    return this.db.transaction(async tx => {
      const location = await this.db.location(id);
      if (!location) {
        throw new ConflictError(`No location found with with id: ${id}`);
      }
      await this.db.removeLocation(tx, id);
      this.notifyDeletion(location);
    });
  }

  private notifyAddition(location: Location) {
    for (const subscriber of this.subscribers) {
      subscriber.next({
        added: [location],
        removed: [],
      });
    }
  }

  private notifyDeletion(location: Location) {
    for (const subscriber of this.subscribers) {
      subscriber.next({
        added: [],
        removed: [location],
      });
    }
  }

  location$(): Observable<LocationMessage> {
    return new ObservableImpl<LocationMessage>(subscriber => {
      this.subscribers.add(subscriber);
      return () => {
        this.subscribers.delete(subscriber);
      };
    });
  }
}
