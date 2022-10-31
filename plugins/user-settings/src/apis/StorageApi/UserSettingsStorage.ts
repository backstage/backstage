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

import { WebStorage } from '@backstage/core-app-api';
import {
  DiscoveryApi,
  ErrorApi,
  FetchApi,
  IdentityApi,
  StorageApi,
  StorageValueSnapshot,
} from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { JsonValue, Observable } from '@backstage/types';
import ObservableImpl from 'zen-observable';

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  Accept: 'application/json',
};

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

  private readonly observables = new Map<
    string,
    Observable<StorageValueSnapshot<JsonValue>>
  >();

  private constructor(
    private readonly namespace: string,
    private readonly fetchApi: FetchApi,
    private readonly discoveryApi: DiscoveryApi,
    private readonly errorApi: ErrorApi,
    private readonly identityApi: IdentityApi,
    private readonly fallback: WebStorage,
  ) {}

  static create(options: {
    fetchApi: FetchApi;
    discoveryApi: DiscoveryApi;
    errorApi: ErrorApi;
    identityApi: IdentityApi;
    namespace?: string;
  }): UserSettingsStorage {
    return new UserSettingsStorage(
      options.namespace ?? 'default',
      options.fetchApi,
      options.discoveryApi,
      options.errorApi,
      options.identityApi,
      WebStorage.create({
        namespace: options.namespace,
        errorApi: options.errorApi,
      }),
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
          this.identityApi,
          this.fallback,
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
      throw await ResponseError.fromResponse(response);
    }

    this.notifyChanges({ key, presence: 'absent' });
  }

  async set<T extends JsonValue>(key: string, data: T): Promise<void> {
    if (!(await this.isSignedIn())) {
      await this.fallback.set(key, data);
      this.notifyChanges({ key, presence: 'present', value: data });
      return;
    }

    const fetchUrl = await this.getFetchUrl(key);

    const response = await this.fetchApi.fetch(fetchUrl, {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify({ value: data }),
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    const { value } = await response.json();

    this.notifyChanges({ key, value, presence: 'present' });
  }

  observe$<T extends JsonValue>(
    key: string,
  ): Observable<StorageValueSnapshot<T>> {
    if (!this.observables.has(key)) {
      this.observables.set(
        key,
        new ObservableImpl<StorageValueSnapshot<JsonValue>>(subscriber => {
          this.subscribers.add(subscriber);

          // TODO(freben): Introduce server polling or similar, to ensure that different devices update when values change
          Promise.resolve()
            .then(() => this.get(key))
            .then(snapshot => subscriber.next(snapshot))
            .catch(error => this.errorApi.post(error));

          return () => {
            this.subscribers.delete(subscriber);
          };
        }).filter(({ key: messageKey }) => messageKey === key),
      );
    }

    return this.observables.get(key) as Observable<StorageValueSnapshot<T>>;
  }

  snapshot<T extends JsonValue>(key: string): StorageValueSnapshot<T> {
    return { key, presence: 'unknown' };
  }

  private async get<T extends JsonValue>(
    key: string,
  ): Promise<StorageValueSnapshot<T>> {
    if (!(await this.isSignedIn())) {
      // This explicitly uses WebStorage, which we know is synchronous and doesn't return presence: unknown
      return this.fallback.snapshot(key);
    }

    const fetchUrl = await this.getFetchUrl(key);
    const response = await this.fetchApi.fetch(fetchUrl);

    if (response.status === 404) {
      return { key, presence: 'absent' };
    }

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    try {
      const { value: rawValue } = await response.json();
      const value = JSON.parse(JSON.stringify(rawValue), (_key, val) => {
        if (typeof val === 'object' && val !== null) {
          Object.freeze(val);
        }
        return val;
      });

      return { key, presence: 'present', value };
    } catch {
      // If the value is not valid JSON, we return an unknown presence. This should never happen
      return { key, presence: 'absent' };
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

  private async isSignedIn(): Promise<boolean> {
    try {
      const credentials = await this.identityApi.getCredentials();
      return credentials?.token ? true : false;
    } catch {
      return false;
    }
  }
}
