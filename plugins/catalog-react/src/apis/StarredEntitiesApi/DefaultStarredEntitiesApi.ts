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

import { Entity } from '@backstage/catalog-model';
import { Observable, StorageApi } from '@backstage/core-plugin-api';
import ObservableImpl from 'zen-observable';
import {
  StarredEntitiesApi,
  StarredEntitiesApiObservable,
} from './StarredEntitiesApi';

const buildEntityKey = (component: Entity) =>
  `entity:${component.kind}:${component.metadata.namespace ?? 'default'}:${
    component.metadata.name
  }`;

export class DefaultStarredEntitiesApi implements StarredEntitiesApi {
  private readonly settingsStore: StorageApi;
  private starredEntities: Set<string>;

  constructor(opts: { storageApi: StorageApi }) {
    this.settingsStore = opts.storageApi.forBucket('settings');

    this.starredEntities = new Set(
      this.settingsStore.get<string[]>('starredEntities') ?? [],
    );

    this.settingsStore.observe$<string[]>('starredEntities').subscribe({
      next: next => {
        this.starredEntities = new Set(next.newValue ?? []);
        this.notifyChanges();
      },
    });
  }

  async toggleStarred(entity: Entity): Promise<void> {
    const entityKey = buildEntityKey(entity);

    if (this.starredEntities.has(entityKey)) {
      await this.unstar(entity);
    } else {
      await this.star(entity);
    }
  }

  async star(entity: Entity): Promise<void> {
    const entityKey = buildEntityKey(entity);

    this.starredEntities.add(entityKey);

    await this.settingsStore.set(
      'starredEntities',
      Array.from(this.starredEntities),
    );
  }

  async unstar(entity: Entity): Promise<void> {
    const entityKey = buildEntityKey(entity);

    this.starredEntities.delete(entityKey);

    await this.settingsStore.set(
      'starredEntities',
      Array.from(this.starredEntities),
    );
  }

  starredEntities$(): Observable<StarredEntitiesApiObservable> {
    return this.observable;
  }

  isStarred(entity: Entity): boolean {
    const entityKey = buildEntityKey(entity);
    return this.starredEntities.has(entityKey);
  }

  private readonly subscribers = new Set<
    ZenObservable.SubscriptionObserver<StarredEntitiesApiObservable>
  >();

  private readonly observable =
    new ObservableImpl<StarredEntitiesApiObservable>(subscriber => {
      // forward the the latest value
      subscriber.next({
        starredEntities: this.starredEntities,
        isStarred: e => this.isStarred(e),
      });

      this.subscribers.add(subscriber);
      return () => {
        this.subscribers.delete(subscriber);
      };
    });

  private notifyChanges() {
    for (const subscription of this.subscribers) {
      subscription.next({
        starredEntities: this.starredEntities,
        isStarred: e => this.isStarred(e),
      });
    }
  }
}
