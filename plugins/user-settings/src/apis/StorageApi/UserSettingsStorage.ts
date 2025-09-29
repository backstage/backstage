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
import { SignalApi, SignalSubscriber } from '@backstage/plugin-signals-react';
import ObservableImpl from 'zen-observable';
import {
  MultiGetResponse,
  UserSettingsSignal,
} from '@backstage/plugin-user-settings-common';
import DataLoader from 'dataloader';
import { CacheMap } from './CacheMap';

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  Accept: 'application/json',
};

const buckets = new Map<string, UserSettingsStorage>();

const DATALOADER_CACHE_TTL_MS = 2 * 1000; // 2 seconds cache
const DATALOADER_WINDOW_MS = 10; // 10 ms

type DataLoaderType = DataLoader<
  { bucket: string; key: string },
  StorageValueSnapshot<JsonValue>,
  string
>;

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

  private readonly namespace: string;
  private readonly fetchApi: FetchApi;
  private readonly discoveryApi: DiscoveryApi;
  private readonly errorApi: ErrorApi;
  private readonly identityApi: IdentityApi;
  private readonly fallback: WebStorage;
  private readonly signalApi?: SignalApi;
  private readonly userSettingsLoader: DataLoaderType;

  private constructor(
    namespace: string,
    fetchApi: FetchApi,
    discoveryApi: DiscoveryApi,
    errorApi: ErrorApi,
    identityApi: IdentityApi,
    fallback: WebStorage,
    signalApi?: SignalApi,
    userSettingsLoader?: DataLoaderType,
  ) {
    this.namespace = namespace;
    this.fetchApi = fetchApi;
    this.discoveryApi = discoveryApi;
    this.errorApi = errorApi;
    this.identityApi = identityApi;
    this.fallback = fallback;
    this.signalApi = signalApi;

    this.userSettingsLoader =
      userSettingsLoader ??
      new DataLoader(
        async bucketAndKeyList => this.getMulti(bucketAndKeyList),
        {
          name: 'UserSettingsStorage.userSettingsLoader',
          cacheMap: new CacheMap<
            string,
            Promise<StorageValueSnapshot<JsonValue>>
          >(DATALOADER_CACHE_TTL_MS),
          cacheKeyFn: bucketAndKey => this.stringifyDataLoaderKey(bucketAndKey),
          maxBatchSize: 100,
          batchScheduleFn: cb => setTimeout(cb, DATALOADER_WINDOW_MS),
        },
      );
  }

  private stringifyDataLoaderKey({
    bucket,
    key,
  }: {
    bucket: string;
    key: string;
  }) {
    return `${encodeURIComponent(bucket)}/${encodeURIComponent(key)}`;
  }
  private clearCacheKey(key: string) {
    this.userSettingsLoader.clear({ bucket: this.namespace, key });
  }

  static create(options: {
    fetchApi: FetchApi;
    discoveryApi: DiscoveryApi;
    errorApi: ErrorApi;
    identityApi: IdentityApi;
    signalApi?: SignalApi;
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
      options.signalApi,
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
          this.signalApi,
          this.userSettingsLoader,
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

    this.clearCacheKey(key);

    this.notifyChanges({ key, presence: 'absent' });
  }

  async set<T extends JsonValue>(key: string, data: T): Promise<void> {
    if (!(await this.isSignedIn())) {
      await this.fallback.set(key, data);
      this.notifyChanges({ key, presence: 'present', value: data });
      this.clearCacheKey(key);
      return;
    }

    this.clearCacheKey(key);

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

    this.userSettingsLoader.prime(
      { bucket: this.namespace, key },
      {
        key,
        presence: 'present',
        value,
      },
    );

    this.notifyChanges({ key, value, presence: 'present' });
  }

  observe$<T extends JsonValue>(
    key: string,
  ): Observable<StorageValueSnapshot<T>> {
    if (!this.observables.has(key)) {
      this.observables.set(
        key,
        new ObservableImpl<StorageValueSnapshot<JsonValue>>(subscriber => {
          let signalSubscription: SignalSubscriber | undefined;
          this.subscribers.add(subscriber);

          const updateSnapshot = () => {
            Promise.resolve()
              .then(() =>
                this.userSettingsLoader.load({ bucket: this.namespace, key }),
              )
              .then(snapshot => subscriber.next(snapshot))
              .catch(error => this.errorApi.post(error));
          };

          if (this.signalApi) {
            signalSubscription = this.signalApi.subscribe(
              `user-settings`,
              (msg: UserSettingsSignal) => {
                if (msg.key === key) {
                  updateSnapshot();
                }
              },
            );
          }

          updateSnapshot();

          return () => {
            if (signalSubscription) {
              signalSubscription.unsubscribe();
            }
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

  private async getMulti(
    bucketAndKeyList: readonly { bucket: string; key: string }[],
  ): Promise<StorageValueSnapshot<JsonValue>[]> {
    if (bucketAndKeyList.length === 0) return [];

    if (!(await this.isSignedIn())) {
      // This explicitly uses WebStorage, which we know is synchronous and doesn't return presence: unknown
      return bucketAndKeyList.map(bucketAndKey =>
        this.fallback.snapshot(bucketAndKey.key),
      );
    }

    try {
      const baseUrl = await this.discoveryApi.getBaseUrl('user-settings');
      const response = await this.fetchApi.fetch(`${baseUrl}/multiget`, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ items: bucketAndKeyList }),
      });

      if (response.status === 404) {
        return bucketAndKeyList.map(bucketAndKey => ({
          key: bucketAndKey.key,
          presence: 'absent',
        }));
      }

      if (!response.ok) {
        throw await ResponseError.fromResponse(response);
      }

      const { items: values } = (await response.json()) as MultiGetResponse;

      return bucketAndKeyList.map(
        ({ key }, i): StorageValueSnapshot<JsonValue> => {
          if (!values[i]) {
            return { key, presence: 'absent' };
          }
          return {
            key,
            presence: 'present',
            value: JSON.parse(JSON.stringify(values[i].value), (_key, val) => {
              if (typeof val === 'object' && val !== null) {
                Object.freeze(val);
              }
              return val;
            }),
          };
        },
      );
    } catch (e) {
      this.errorApi.post(new Error(`Failed to fetch user settings, ${e}`));
      return bucketAndKeyList.map(bucketAndKey => ({
        key: bucketAndKey.key,
        presence: 'absent',
      }));
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
