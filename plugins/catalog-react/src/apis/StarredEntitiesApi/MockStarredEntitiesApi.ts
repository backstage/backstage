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

import { Observable } from '@backstage/types';
import ObservableImpl from 'zen-observable';
import { StarredEntitiesApi } from './StarredEntitiesApi';

/**
 * An in-memory mock implementation of the StarredEntitiesApi.
 *
 * @public
 */
export class MockStarredEntitiesApi implements StarredEntitiesApi {
  private readonly starredEntities = new Set<string>();
  private readonly subscribers = new Set<
    ZenObservable.SubscriptionObserver<Set<string>>
  >();

  private readonly observable = new ObservableImpl<Set<string>>(subscriber => {
    subscriber.next(new Set(this.starredEntities));

    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  });

  async toggleStarred(entityRef: string): Promise<void> {
    if (!this.starredEntities.delete(entityRef)) {
      this.starredEntities.add(entityRef);
    }

    for (const subscription of this.subscribers) {
      subscription.next(new Set(this.starredEntities));
    }
  }

  starredEntitie$(): Observable<Set<string>> {
    return this.observable;
  }
}
