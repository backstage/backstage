/*
 * Copyright 2021 Spotify AB
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

import { IndexableDocument, DocumentCollator } from '@backstage/search-common';
import { EntitiesCatalog } from '../catalog';

export interface CatalogEntityDocument extends IndexableDocument {
  componentType: string;
}

export class DefaultCatalogCollator implements DocumentCollator {
  protected entitiesCatalog: EntitiesCatalog;

  constructor(entitiesCatalog: EntitiesCatalog) {
    this.entitiesCatalog = entitiesCatalog;
  }

  async execute() {
    const entities = await this.entitiesCatalog.entities();
    return entities.map(
      (entity): CatalogEntityDocument => {
        return {
          title: entity.metadata.name,
          location: `/catalog/${
            entity.metadata.namespace || 'default'
          }/component/${entity.metadata.name}`,
          text: entity.metadata.description || '',
          componentType: entity.spec?.type?.toString() || 'other',
          ...(entity.spec?.owner && { owner: entity.spec.owner.toString() }),
          ...(entity.metadata.lifecycle && {
            lifecycle: entity.metadata.lifecycle.toString(),
          }),
        };
      },
    );
  }
}
