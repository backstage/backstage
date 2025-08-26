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
   * Get a user setting given a user token, bucket and key.
   *
   * NOTE; To refer to buckets used in the frontend, the bucket name need to be
   * prefixed with `'{namespace}.'`, where `namespace` need to be the same as in
   * the frontend, which is 'default' by default. Example: `'default.my-bucket'`
   *
   * Will throw NotFoundError or ResponseError upon failures.
   */
  get(userToken: string, bucket: string, key: string): Promise<UserSetting>;

  /**
   * Set a user setting given a user token, bucket, key and the value.
   *
   * NOTE; To refer to buckets used in the frontend, the bucket name need to be
   * prefixed with `'{namespace}.'`, where `namespace` need to be the same as in
   * the frontend, which is 'default' by default. Example: `'default.my-bucket'`
   *
   * Will throw NotFoundError or ResponseError upon failures.
   */
  set(
    userToken: string,
    bucket: string,
    key: string,
    value: JsonValue,
  ): Promise<UserSetting>;

  /**
   * Delete a user setting given a user token, bucket and key.
   *
   * NOTE; To refer to buckets used in the frontend, the bucket name need to be
   * prefixed with `'{namespace}.'`, where `namespace` need to be the same as in
   * the frontend, which is 'default' by default. Example: `'default.my-bucket'`
   *
   * Will throw NotFoundError or ResponseError upon failures.
   */
  delete(userToken: string, bucket: string, key: string): Promise<void>;
}

class DefaultUserSettingsService implements UserSettingsService {
  readonly #discoveryApi: DiscoveryService;

  constructor({ discoveryApi }: { discoveryApi: DiscoveryService }) {
    this.#discoveryApi = discoveryApi;
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

  private makePath(bucket: string, key: string) {
    return `/buckets/${encodeURIComponent(bucket)}/keys/${encodeURIComponent(
      key,
    )}`;
  }

  async get(
    userToken: string,
    bucket: string,
    key: string,
  ): Promise<UserSetting> {
    return this.api<UserSetting>(userToken, 'GET', this.makePath(bucket, key));
  }

  async set(
    userToken: string,
    bucket: string,
    key: string,
    value: JsonValue,
  ): Promise<UserSetting> {
    return this.api<UserSetting>(userToken, 'PUT', this.makePath(bucket, key), {
      value,
    });
  }

  async delete(userToken: string, bucket: string, key: string): Promise<void> {
    await this.api(userToken, 'DELETE', this.makePath(bucket, key));
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
      deps: { discoveryApi: coreServices.discovery },
      async factory({ discoveryApi }) {
        return new DefaultUserSettingsService({ discoveryApi });
      },
    }),
});
