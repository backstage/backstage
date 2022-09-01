/*
 * Copyright 2022 The Backstage Authors
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
  DiscoveryApi,
  ErrorApi,
  FetchApi,
  StorageApi,
  StorageValueSnapshot,
} from '@backstage/core-plugin-api';
import { NotFoundError } from '@backstage/errors';
import { JsonValue, Observable } from '@backstage/types';
import ObservableImpl from 'zen-observable';

const buckets = new Map<string, PersistentStorage>();

/**
 * An implementation of the storage API, that uses the user-settings backend to
 * persist the data in the DB.
 *
 * @public
 */
export class PersistentStorage implements StorageApi {
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

  constructor(
    private readonly namespace: string,
    private readonly fetchApi: FetchApi,
    private readonly discoveryApi: DiscoveryApi,
    private readonly errorApi: ErrorApi,
  ) {}

  static create(options: {
    fetchApi: FetchApi;
    discoveryApi: DiscoveryApi;
    errorApi: ErrorApi;
    namespace?: string;
  }): PersistentStorage {
    return new PersistentStorage(
      options.namespace ?? 'default',
      options.fetchApi,
      options.discoveryApi,
      options.errorApi,
    );
  }

  forBucket(name: string): StorageApi {
    // use dot instead of slash separator to have nicer URLs
    const bucketPath = `${this.namespace}.${name}`;

    if (!buckets.has(bucketPath)) {
      buckets.set(
        bucketPath,
        new PersistentStorage(
          bucketPath,
          this.fetchApi,
          this.discoveryApi,
          this.errorApi,
        ),
      );
    }

    return buckets.get(bucketPath)!;
  }

  async remove(key: string): Promise<void> {
    const fetchUrl = await this.getFetchUrl(key);

    await this.fetchApi.fetch(fetchUrl, {
      method: 'DELETE',
    });

    this.notifyChanges({
      key,
      presence: 'absent',
    });
  }

  async set<T extends JsonValue>(key: string, data: T): Promise<void> {
    const fetchUrl = await this.getFetchUrl(key);
    const body = JSON.stringify({ value: JSON.stringify(data) });

    const response = await this.fetchApi.fetch(fetchUrl, {
      method: 'PUT',
      body,
    });

    const { value } = await response.json();

    this.notifyChanges({
      key,
      value: JSON.parse(value),
      presence: 'present',
    });
  }

  observe$<T extends JsonValue>(
    key: string,
  ): Observable<StorageValueSnapshot<T>> {
    return this.observable.filter(({ key: messageKey }) => messageKey === key);
  }

  snapshot<T extends JsonValue>(key: string): StorageValueSnapshot<T> {
    // trigger a reload
    this.get(key).then(snapshot => this.notifyChanges(snapshot));

    return {
      key,
      presence: 'unknown',
    };
  }

  private async get<T extends JsonValue>(
    key: string,
  ): Promise<StorageValueSnapshot<T>> {
    try {
      const fetchUrl = await this.getFetchUrl(key);
      const response = await this.fetchApi.fetch(fetchUrl);

      if (response.status === 404) {
        throw new NotFoundError(
          `Setting '${key}' is not set in bucket '${this.namespace}'`,
        );
      } else if (!response.ok) {
        throw new Error(
          `Unable to fetch '${key}' from bucket '${this.namespace}'`,
        );
      }

      const { value: rawValue } = await response.json();
      const value = JSON.parse(rawValue, (_key, val) => {
        if (typeof val === 'object' && val !== null) {
          Object.freeze(val);
        }
        return val;
      });

      return {
        key,
        presence: 'present',
        value,
      };
    } catch (error) {
      // NotFoundError shouldn't be recorded
      if (error && !(error instanceof NotFoundError)) {
        this.errorApi.post(error);
      }

      return {
        key,
        presence: 'absent',
        value: undefined,
      };
    }
  }

  private async getFetchUrl(key: string) {
    const baseUrl = await this.discoveryApi.getBaseUrl('user-settings');
    const encodedNamespace = encodeURIComponent(this.namespace);
    const encodedKey = encodeURIComponent(key);
    return `${baseUrl}/buckets/${encodedNamespace}/${encodedKey}`;
  }

  private async notifyChanges<T>(snapshot: StorageValueSnapshot<T>) {
    for (const subscription of this.subscribers) {
      subscription.next(snapshot);
    }
  }
}
