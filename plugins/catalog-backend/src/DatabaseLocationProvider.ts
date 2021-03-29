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

import { Observable } from '@backstage/core';
import { EntityProvider, LocationStore, EntityMessage } from './newthing';
import ObservableImpl from 'zen-observable';
import {
  locationToEntity,
  locationToEntityName,
} from './ingestion/LocationToEntity';

export class DatabaseLocationProvider implements EntityProvider {
  private subscribers = new Set<
    ZenObservable.SubscriptionObserver<EntityMessage>
  >();

  constructor(private readonly store: LocationStore) {
    store.location$().subscribe({
      next: locations => {
        if ('all' in locations) {
          this.notify({
            all: locations.all.map(l => locationToEntity(l.type, l.target)),
          });
        } else {
          this.notify({
            added: locations.added.map(l => locationToEntity(l.type, l.target)),
            removed: locations.removed.map(l =>
              locationToEntityName(l.type, l.target),
            ),
          });
        }
      },
    });
  }

  private notify(message: EntityMessage) {
    for (const subscriber of this.subscribers) {
      subscriber.next(message);
    }
  }

  entityChange$(): Observable<EntityMessage> {
    return new ObservableImpl(subscriber => {
      this.store.listLocations().then(locations => {
        subscriber.next({
          all: locations.map(l => locationToEntity(l.type, l.target)),
        });
        this.subscribers.add(subscriber);
      });
      return () => {
        this.subscribers.delete(subscriber);
      };
    });
  }
}
