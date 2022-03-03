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

import { StorageApi, StorageValueSnapshot } from '@backstage/core-plugin-api';
import { JsonValue, Observable } from '@backstage/types';
import ObservableImpl from 'zen-observable';

/**
 * Type for map holding data in {@link MockStorageApi}
 * @public
 */
export type MockStorageBucket = { [key: string]: any };

/**
 * Mock implementation of the {@link core-plugin-api#StorageApi} to be used in tests
 * @public
 */
export class MockStorageApi implements StorageApi {
  private readonly namespace: string;
  private readonly data: MockStorageBucket;
  private readonly bucketStorageApis: Map<string, MockStorageApi>;

  private constructor(
    namespace: string,
    bucketStorageApis: Map<string, MockStorageApi>,
    data?: MockStorageBucket,
  ) {
    this.namespace = namespace;
    this.bucketStorageApis = bucketStorageApis;
    this.data = { ...data };
  }

  static create(data?: MockStorageBucket) {
    return new MockStorageApi('', new Map(), data);
  }

  forBucket(name: string): StorageApi {
    if (!this.bucketStorageApis.has(name)) {
      this.bucketStorageApis.set(
        name,
        new MockStorageApi(
          `${this.namespace}/${name}`,
          this.bucketStorageApis,
          this.data,
        ),
      );
    }
    return this.bucketStorageApis.get(name)!;
  }

  snapshot<T extends JsonValue>(key: string): StorageValueSnapshot<T> {
    if (this.data.hasOwnProperty(this.getKeyName(key))) {
      const data = this.data[this.getKeyName(key)];
      return {
        key,
        presence: 'present',
        value: data,
      };
    }
    return {
      key,
      presence: 'absent',
      value: undefined,
    };
  }

  async set<T>(key: string, data: T): Promise<void> {
    const serialized = JSON.parse(JSON.stringify(data), (_key, value) => {
      if (typeof value === 'object' && value !== null) {
        Object.freeze(value);
      }
      return value;
    });
    this.data[this.getKeyName(key)] = serialized;
    this.notifyChanges({
      key,
      presence: 'present',
      value: serialized,
    });
  }

  async remove(key: string): Promise<void> {
    delete this.data[this.getKeyName(key)];
    this.notifyChanges({
      key,
      presence: 'absent',
      value: undefined,
    });
  }

  observe$<T>(key: string): Observable<StorageValueSnapshot<T>> {
    return this.observable.filter(({ key: messageKey }) => messageKey === key);
  }

  private getKeyName(key: string) {
    return `${this.namespace}/${encodeURIComponent(key)}`;
  }

  private notifyChanges<T>(message: StorageValueSnapshot<T>) {
    for (const subscription of this.subscribers) {
      subscription.next(message);
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
