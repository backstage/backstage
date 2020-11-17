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

import {
  ConflictError,
  NotFoundError,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import { UserEntity } from '@backstage/catalog-model';
import fetch from 'cross-fetch';

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
  async findUser(query: UserQuery): Promise<UserEntity> {
    const conditions = ['kind=user'];
    for (const [key, value] of Object.entries(query.annotations)) {
      const uk = encodeURIComponent(key);
      const uv = encodeURIComponent(value);
      conditions.push(`metadata.annotations.${uk}=${uv}`);
    }

    const baseUrl = await this.discovery.getBaseUrl('catalog');
    const response = await fetch(
      `${baseUrl}/entities?filter=${conditions.join(',')}`,
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Request failed with ${response.status} ${response.statusText}, ${text}`,
      );
    }

    const users: UserEntity[] = await response.json();

    if (users.length !== 1) {
      if (users.length > 1) {
        throw new ConflictError('User lookup resulted in multiple matches');
      } else {
        throw new NotFoundError('User not found');
      }
    }

    return users[0];
  }
}
