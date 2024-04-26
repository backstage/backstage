/*
 * Copyright 2024 The Backstage Authors
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
import DataLoader from 'dataloader';
import { CatalogApi, EntityFieldsQuery } from '../types';
import { CatalogCollector } from './CatalogCollector';
import { CatalogTraversal } from './CatalogTraversal';
import {
  TraverseCatalogFollow,
  TraverseCatalogInitialSet,
  TraverseCatalogResult,
} from './types';

/**
 * Makes a traversal through the catalog, starting from an initial set and
 * following along relation edges to other entities.
 *
 * @public
 */
export function traverseCatalog(options: {
  catalogApi: CatalogApi;
  fields?: EntityFieldsQuery;
  initial: TraverseCatalogInitialSet;
  follow: TraverseCatalogFollow;
}): TraverseCatalogResult {
  const { catalogApi, initial, follow } = options;

  // Default is to get full entities, but if a fields restriction was passed in,
  // we want to ensure that the absolute bare minimum is included to be able to
  // form entity refs out of them and to follow relations
  const fields = options.fields?.length
    ? Array.from(
        new Set([
          ...options.fields,
          'kind',
          'relations',
          'metadata.name',
          'metadata.namespace',
        ]),
      )
    : undefined;

  // Creates a DataLoader for batch loading of catalog entities.
  const loader = new DataLoader<string, Entity | undefined>(
    async (entityRefs: readonly string[]) => {
      const { items } = await catalogApi.getEntitiesByRefs({
        entityRefs: entityRefs as string[],
        fields,
      });
      return items;
    },
    {
      name: 'traverseCatalog',
      maxBatchSize: 100,
      batchScheduleFn: cb => setTimeout(cb, 5),
    },
  );

  const traversal = new CatalogTraversal({
    catalogApi,
    loader,
    fields,
    initial,
    follow,
  });

  return new CatalogCollector({
    loader,
    traversal,
  });
}
