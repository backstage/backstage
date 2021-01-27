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

import { ConflictError, NotFoundError } from '@backstage/backend-common';
import { CatalogClient } from '@backstage/catalog-client';
import { UserEntity } from '@backstage/catalog-model';
import { CatalogIdentityRequestOptions } from './types';

type UserQuery = {
  annotations: Record<string, string>;
};

/**
 * A catalog client tailored for reading out identity data from the catalog.
 */
export class CatalogIdentityClient {
  private readonly catalogClient: CatalogClient;

  constructor(options: { catalogClient: CatalogClient }) {
    this.catalogClient = options.catalogClient;
  }

  /**
   * Looks up a single user using a query.
   *
   * Throws a NotFoundError or ConflictError if 0 or multiple users are found.
   */
  async findUser(
    query: UserQuery,
    options?: CatalogIdentityRequestOptions,
  ): Promise<UserEntity> {
    const token = options?.token;
    const filter: Record<string, string> = {
      kind: 'user',
    };
    for (const [key, value] of Object.entries(query.annotations)) {
      filter[`metadata.annotations.${key}`] = value;
    }

    const { items } = await this.catalogClient.getEntities(
      { filter },
      { token },
    );

    if (items.length !== 1) {
      if (items.length > 1) {
        throw new ConflictError('User lookup resulted in multiple matches');
      } else {
        throw new NotFoundError('User not found');
      }
    }

    return items[0] as UserEntity;
  }
}
