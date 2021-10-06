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

import { stringifyEntityRef } from '@backstage/catalog-model';
import { ResponseError } from '@backstage/errors';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { GetProfileOptions, GetProfileResult, GithubProfileApi } from './types';

/**
 * Options for creating a todo client.
 *
 * @public
 */
export interface GithubProfileClientOptions {
  discoveryApi: DiscoveryApi;
  identityApi: IdentityApi;
}

/**
 * An implementation of the TodoApi that talks to the todo plugin backend.
 *
 * @public
 */
export class GithubProfileClient implements GithubProfileApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;

  constructor(options: GithubProfileClientOptions) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }

  async getProfile({ entity }: GetProfileOptions): Promise<GetProfileResult> {
    // construct backend endpoint URL
    const baseUrl = await this.discoveryApi.getBaseUrl('user-profiles-github');
    const token = await this.identityApi.getIdToken();

    const query = new URLSearchParams();
    if (entity) {
      query.set('entity', stringifyEntityRef(entity));
    }

    // query API and return response
    const res = await fetch(`${baseUrl}/v1/user-profile?${query}`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });

    if (!res.ok) {
      throw await ResponseError.fromResponse(res);
    }

    const data: GetProfileResult = await res.json();
    return data;
  }
}
