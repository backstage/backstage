/*
 * Copyright 2020 The Backstage Authors
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

import {
  StorageApi,
  StorageValueSnapshot,
  ErrorApi,
} from '@backstage/core-plugin-api';
import { JsonValue, Observable } from '@backstage/types';
import ObservableImpl from 'zen-observable';

const buckets = new Map<string, WebStorage>();

/**
 * An implementation of the storage API, that uses the browser's local storage.
 *
 * @public
 */
export class WebStorage implements StorageApi {
  constructor(
    private readonly namespace: string,
    private readonly errorApi: ErrorApi,
  ) {}

  static create(options: {
    errorApi: ErrorApi;
    namespace?: string;
  }): WebStorage {
    return new WebStorage(options.namespace ?? '', options.errorApi);
  }

  get<T>(key: string): T | undefined {
    return this.snapshot(key).value as T | undefined;
  }

  snapshot<T extends JsonValue>(key: string): StorageValueSnapshot<T> {
    let value = undefined;
    let presence: 'present' | 'absent' = 'absent';
    try {
      const item = localStorage.getItem(this.getKeyName(key));
      if (item) {
        value = JSON.parse(item, (_key, val) => {
          if (typeof val === 'object' && val !== null) {
            Object.freeze(val);
          }
          return val;
        });
        presence = 'present';
      }
    } catch (e) {
      this.errorApi.post(
        new Error(`Error when parsing JSON config from storage for: ${key}`),
      );
    }
    return { key, value, presence };
  }

  forBucket(name: string): WebStorage {
    const bucketPath = `${this.namespace}/${name}`;
    if (!buckets.has(bucketPath)) {
      buckets.set(bucketPath, new WebStorage(bucketPath, this.errorApi));
    }
    return buckets.get(bucketPath)!;
  }

  async set<T>(key: string, data: T): Promise<void> {
    localStorage.setItem(this.getKeyName(key), JSON.stringify(data));
    this.notifyChanges(key);
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(this.getKeyName(key));
    this.notifyChanges(key);
  }

  observe$<T>(key: string): Observable<StorageValueSnapshot<T>> {
    return this.observable.filter(({ key: messageKey }) => messageKey === key);
  }

  private getKeyName(key: string) {
    return `${this.namespace}/${encodeURIComponent(key)}`;
  }

  private notifyChanges(key: string) {
    const snapshot = this.snapshot(key);
    for (const subscription of this.subscribers) {
      subscription.next(snapshot);
    }
  }

  private subscribers = new Set<
    ZenObservable.SubscriptionObserver<StorageValueSnapshot<JsonValue>>
  >();

  private readonly observable = new ObservableImpl<
    StorageValueSnapshot<JsonValue>
  >(subscriber => {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  });
}
