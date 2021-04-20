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
import { ENTITY_DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { EntityProvider, LocationStore, EntityMessage } from './types';
import ObservableImpl from 'zen-observable';
import {
  locationSpecToLocationEntity,
  locationSpecToMetadataName,
} from './util';

export class DatabaseLocationProvider implements EntityProvider {
  private subscribers = new Set<
    ZenObservable.SubscriptionObserver<EntityMessage>
  >();

  constructor(private readonly store: LocationStore) {
    store.location$().subscribe({
      next: locations => {
        if ('all' in locations) {
          this.notify({
            all: locations.all.map(l => locationSpecToLocationEntity(l)),
          });
        } else {
          this.notify({
            added: locations.added.map(l => locationSpecToLocationEntity(l)),
            removed: locations.removed.map(l => ({
              kind: 'Location',
              namespace: ENTITY_DEFAULT_NAMESPACE,
              name: locationSpecToMetadataName(l),
            })),
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
          all: locations.map(l => locationSpecToLocationEntity(l)),
        });
        this.subscribers.add(subscriber);
      });
      return () => {
        this.subscribers.delete(subscriber);
      };
    });
  }
}
