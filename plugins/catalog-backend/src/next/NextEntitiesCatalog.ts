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

import { Knex } from 'knex';
import { DbFinalEntitiesRow } from './Stitcher';
import { EntitiesCatalog } from '../catalog';
import { EntitiesRequest, EntitiesResponse } from '../catalog/types';

export class NextEntitiesCatalog implements EntitiesCatalog {
  constructor(private readonly database: Knex) {}

  async entities(request?: EntitiesRequest): Promise<EntitiesResponse> {
    if (request?.fields) {
      throw new Error('Fields extraction is not implemented');
    }
    if (request?.pagination) {
      throw new Error('Pagination is not implemented');
    }
    if (request?.filter) {
      throw new Error('Filters are not implemented');
    }

    const dbResponse = await this.database<DbFinalEntitiesRow>(
      'final_entities',
    ).select();

    const entities = dbResponse.map(e => JSON.parse(e.final_entity));

    return {
      entities,
      pageInfo: {
        hasNextPage: false,
      },
    };
  }

  async removeEntityByUid(_uid: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async batchAddOrUpdateEntities(): Promise<never> {
    throw new Error('Not implemented');
  }
}
