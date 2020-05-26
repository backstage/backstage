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

import { NotFoundError } from '@backstage/backend-common';
import { Database } from '../database';
import { DescriptorEnvelope } from '../ingestion/types';
import { EntitiesCatalog } from './types';

export class DatabaseEntitiesCatalog implements EntitiesCatalog {
  constructor(private readonly database: Database) {}

  async entities(): Promise<DescriptorEnvelope[]> {
    const items = await this.database.transaction(tx =>
      this.database.entities(tx),
    );
    return items.map(i => i.entity);
  }

  async entity(
    kind: string,
    name: string,
    namespace: string | undefined,
  ): Promise<DescriptorEnvelope | undefined> {
    const item = await this.database.transaction(tx =>
      this.database.entity(tx, kind, name, namespace),
    );
    if (!item) {
      throw new NotFoundError('Entity cannot be found');
    }
    return item.entity;
  }
}
