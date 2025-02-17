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

import { stringifyEntityRef } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import {
  CATALOG_FILTER_EXISTS,
  catalogApiRef,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import useAsync from 'react-use/esm/useAsync';

export function useTechdocsEntities() {
  const catalogApi = useApi(catalogApiRef);
  const presentationApi = useApi(entityPresentationApiRef);

  const { value } = useAsync(async () => {
    // Return a list of entities which are documented.
    const { items } = await catalogApi.getEntities({
      fields: ['metadata.name', 'metadata.namespace', 'kind'],
      filter: {
        'metadata.annotations.backstage.io/techdocs-ref': CATALOG_FILTER_EXISTS,
      },
    });

    const presentationEntities = await Promise.all(
      items.map(
        entity => presentationApi.forEntity(stringifyEntityRef(entity)).promise,
      ),
    );
    const entityNameByRef = new Map(
      presentationEntities.map(presentationEntity => [
        presentationEntity.entityRef,
        presentationEntity.primaryTitle,
      ]),
    );

    const names = items.map(entity => ({
      value: entity.metadata.name,
      label:
        entityNameByRef.get(stringifyEntityRef(entity)) ?? entity.metadata.name,
    }));
    names.sort((a, b) => a.label.localeCompare(b.label));
    return names;
  });

  return value ?? [];
}
