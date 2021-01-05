/*
 * Copyright 2020 Spotify AB
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

import fetch from 'cross-fetch';
import {
  ConflictError,
  NotFoundError,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import { UserEntity } from '@backstage/catalog-model';
type UserQuery = {
  annotations: Record<string, string>;
};

/**
 * A catalog client tailored for reading out identity data from the catalog.
 */
export class CatalogIdentityClient {
  private readonly discovery: PluginEndpointDiscovery;

  constructor(options: { discovery: PluginEndpointDiscovery }) {
    this.discovery = options.discovery;
  }

  /**
   * Looks up a single user using a query.
   *
   * Throws a NotFoundError or ConflictError if 0 or multiple users are found.
   */
  async findUser(
    query: UserQuery,
    options?: { headers?: Record<string, string> },
  ): Promise<UserEntity> {
    const filter: Record<string, string> = {
      kind: 'user',
    };
    for (const [key, value] of Object.entries(query.annotations)) {
      filter[`metadata.annotations.${key}`] = value;
    }
    const params: string[] = [];

    const filterParts: string[] = [];
    for (const [key, value] of Object.entries(filter)) {
      for (const v of [value].flat()) {
        filterParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
      }
    }
    if (filterParts.length) {
      params.push(`filter=${filterParts.join(',')}`);
    }
    const queryPart = params.length ? `?${params.join('&')}` : '';

    const url = `${await this.discovery.getBaseUrl(
      'catalog',
    )}/entities${queryPart}`;
    const response = await fetch(url, {
      headers: {
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const payload = await response.text();
      const message = `Request failed with ${response.status} ${response.statusText}, ${payload}`;
      throw new Error(message);
    }

    const entities: UserEntity[] = await response.json();

    if (entities.length !== 1) {
      if (entities.length > 1) {
        throw new ConflictError('User lookup resulted in multiple matches');
      } else {
        throw new NotFoundError('User not found');
      }
    }

    return entities[0] as UserEntity;
  }
}
