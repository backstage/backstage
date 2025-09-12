/*
 * Copyright 2025 The Backstage Authors
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
  coreServices,
  createServiceFactory,
  createServiceRef,
  DiscoveryService,
} from '@backstage/backend-plugin-api';
import { NotFoundError, ResponseError } from '@backstage/errors';
import { JsonValue } from '@backstage/types';

import { UserSetting } from './types';

/**
 * The UserSettingsService can be used by backend plugins to query and manage
 * user settings for a specific user.
 *
 * @public
 */
export interface UserSettingsService {
  /**
   * Create a sub instance of UserSettingsService with a certain bucket.
   */
  forBucket(bucketName: string): UserSettingsService;

  /**
   * Get a user setting given a user token and key.
   *
   * Will throw NotFoundError or ResponseError upon failures.
   */
  get(userToken: string, key: string): Promise<UserSetting>;

  /**
   * Set a user setting given a user token, key and the value.
   *
   * Will throw NotFoundError or ResponseError upon failures.
   */
  set(userToken: string, key: string, value: JsonValue): Promise<UserSetting>;

  /**
   * Removes a user setting given a user token and key.
   *
   * Will throw NotFoundError or ResponseError upon failures.
   */
  remove(userToken: string, key: string): Promise<void>;
}

class DefaultUserSettingsService implements UserSettingsService {
  readonly #discoveryApi: DiscoveryService;
  readonly #namespace: string;

  constructor({
    namespace,
    discoveryApi,
  }: {
    namespace: string;
    discoveryApi: DiscoveryService;
  }) {
    this.#namespace = namespace;
    this.#discoveryApi = discoveryApi;
  }

  forBucket(bucketName: string): UserSettingsService {
    const bucketPath = `${this.#namespace}.${bucketName}`;
    return new DefaultUserSettingsService({
      namespace: bucketPath,
      discoveryApi: this.#discoveryApi,
    });
  }

  private async api<T = void>(
    userToken: string,
    method: string,
    path: string,
    payload?: JsonValue,
  ): Promise<T> {
    const baseUrl = await this.#discoveryApi.getBaseUrl('user-settings');

    const resp = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      ...(payload ? { body: JSON.stringify(payload) } : {}),
    });

    if (!resp.ok) {
      const responseError = await ResponseError.fromResponse(resp);

      if (resp.status === 404) {
        throw new NotFoundError(
          responseError.body.error.message,
          responseError,
        );
      }

      throw responseError;
    }

    return resp.json();
  }

  private makePath(key: string) {
    const bucketComponent = encodeURIComponent(this.#namespace);
    const keyComponent = encodeURIComponent(key);

    return `/buckets/${bucketComponent}/keys/${keyComponent}`;
  }

  async get(userToken: string, key: string): Promise<UserSetting> {
    return this.api<UserSetting>(userToken, 'GET', this.makePath(key));
  }

  async set(
    userToken: string,
    key: string,
    value: JsonValue,
  ): Promise<UserSetting> {
    return this.api<UserSetting>(userToken, 'PUT', this.makePath(key), {
      value,
    });
  }

  async remove(userToken: string, key: string): Promise<void> {
    await this.api(userToken, 'DELETE', this.makePath(key));
  }
}

/**
 * The userSettingsService provides the user settings API.
 *
 * @public
 */
export const userSettingsServiceRef = createServiceRef<UserSettingsService>({
  id: 'user-settings',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {
        config: coreServices.rootConfig,
        discoveryApi: coreServices.discovery,
      },
      async factory({ config, discoveryApi }) {
        const namespace =
          config.getOptionalString('userSettings.namespace') ?? 'default';
        return new DefaultUserSettingsService({ namespace, discoveryApi });
      },
    }),
});
