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

import { Entity } from '@backstage/catalog-model';
import { Database } from '../database';
import { EntitiesCatalog, EntityFilters } from './types';

export class DatabaseEntitiesCatalog implements EntitiesCatalog {
  constructor(private readonly database: Database) {}

  async entities(filters?: EntityFilters): Promise<Entity[]> {
    const items = await this.database.transaction(tx =>
      this.database.entities(tx, filters),
    );
    return items.map(i => i.entity);
  }

  async entityByUid(uid: string): Promise<Entity | undefined> {
    const matches = await this.database.transaction(tx =>
      this.database.entities(tx, [{ key: 'uid', values: [uid] }]),
    );

    return matches.length ? matches[0].entity : undefined;
  }

  async entityByName(
    kind: string,
    name: string,
    namespace: string | undefined,
  ): Promise<Entity | undefined> {
    const matches = await this.database.transaction(tx =>
      this.database.entities(tx, [
        { key: 'kind', values: [kind] },
        { key: 'name', values: [name] },
        {
          key: 'namespace',
          values:
            !namespace || namespace === 'default'
              ? [null, 'default']
              : [namespace],
        },
      ]),
    );

    return matches.length ? matches[0].entity : undefined;
  }
}
