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
import { ResponseError } from '@backstage/errors';
import { JsonValue, Observable } from '@backstage/types';
import ObservableImpl from 'zen-observable';

const buckets = new Map<string, UserSettingsStorage>();

/**
 * An implementation of the storage API, that uses the user-settings backend to
 * persist the data in the DB.
 *
 * @public
 */
export class UserSettingsStorage implements StorageApi {
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

  private constructor(
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
  }): UserSettingsStorage {
    return new UserSettingsStorage(
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
        new UserSettingsStorage(
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

    const response = await this.fetchApi.fetch(fetchUrl, {
      method: 'DELETE',
    });

    if (!response.ok && response.status !== 404) {
      throw ResponseError.fromResponse(response);
    }

    this.notifyChanges({
      key,
      presence: 'absent',
    });
  }

  async set<T extends JsonValue>(key: string, data: T): Promise<void> {
    const fetchUrl = await this.getFetchUrl(key);
    const body = JSON.stringify({ value: data });

    const response = await this.fetchApi.fetch(fetchUrl, {
      method: 'PUT',
      body,
    });

    if (!response.ok) {
      throw ResponseError.fromResponse(response);
    }

    const { value } = await response.json();

    this.notifyChanges({
      key,
      value,
      presence: 'present',
    });
  }

  observe$<T extends JsonValue>(
    key: string,
  ): Observable<StorageValueSnapshot<T>> {
    // TODO(freben): Introduce server polling or similar, to ensure that different devices update when values change
    return this.observable.filter(({ key: messageKey }) => messageKey === key);
  }

  snapshot<T extends JsonValue>(key: string): StorageValueSnapshot<T> {
    // trigger a reload, ensure it happens on the next tick (after returning)
    Promise.resolve()
      .then(() => this.get(key))
      .then(snapshot => this.notifyChanges(snapshot))
      .catch(error => this.errorApi.post(error));

    return {
      key,
      presence: 'unknown',
    };
  }

  private async get<T extends JsonValue>(
    key: string,
  ): Promise<StorageValueSnapshot<T>> {
    const fetchUrl = await this.getFetchUrl(key);
    const response = await this.fetchApi.fetch(fetchUrl);

    if (response.status === 404) {
      return {
        key,
        presence: 'absent',
      };
    }

    if (!response.ok) {
      throw ResponseError.fromResponse(response);
    }

    try {
      const { value: rawValue } = await response.json();
      const value = JSON.parse(JSON.stringify(rawValue), (_key, val) => {
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
    } catch {
      // If the value is not valid JSON, we return an unknown presence. This should never happen
      return {
        key,
        presence: 'absent',
      };
    }
  }

  private async getFetchUrl(key: string) {
    const baseUrl = await this.discoveryApi.getBaseUrl('user-settings');
    const encodedNamespace = encodeURIComponent(this.namespace);
    const encodedKey = encodeURIComponent(key);
    return `${baseUrl}/buckets/${encodedNamespace}/keys/${encodedKey}`;
  }

  private async notifyChanges<T extends JsonValue>(
    snapshot: StorageValueSnapshot<T>,
  ) {
    for (const subscription of this.subscribers) {
      try {
        subscription.next(snapshot);
      } catch {
        // ignore
      }
    }
  }
}
