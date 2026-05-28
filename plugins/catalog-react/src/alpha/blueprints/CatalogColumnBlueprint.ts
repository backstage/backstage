/*
 * Copyright 2026 The Backstage Authors
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
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import { TableColumn } from '@backstage/core-components';
import { Entity } from '@backstage/catalog-model';
import {
  createZodV4FilterPredicateSchema,
  filterPredicateToFilterFunction,
  type FilterPredicate,
} from '@backstage/filter-predicates';

/**
 * Context passed to catalog column filter functions to determine visibility.
 * @alpha
 */
export interface CatalogColumnFilterContext {
  kind?: string;
  type?: string | string[];
  entities: Entity[];
}

/**
 * A function that determines whether a column should be visible
 * given the current catalog table context.
 * @alpha
 */
export type CatalogColumnFilterFn = (
  context: CatalogColumnFilterContext,
) => boolean;

/** @alpha */
export const catalogColumnDataRef = createExtensionDataRef<
  TableColumn<{}>
>().with({ id: 'catalog.table-column' });

/** @alpha */
export const catalogColumnFilterDataRef =
  createExtensionDataRef<CatalogColumnFilterFn>().with({
    id: 'catalog.table-column-filter',
  });

function resolveConfigFilter(config: {
  filter?: FilterPredicate;
}): CatalogColumnFilterFn | undefined {
  if (config.filter) {
    return filterPredicateToFilterFunction<CatalogColumnFilterContext>(
      config.filter,
    );
  }
  return undefined;
}

/**
 * Creates Catalog Column Extensions for the catalog table.
 * @alpha
 */
export const CatalogColumnBlueprint = createExtensionBlueprint({
  kind: 'catalog-column',
  attachTo: { id: 'page:catalog', input: 'columns' },
  output: [catalogColumnDataRef, catalogColumnFilterDataRef.optional()],
  dataRefs: {
    column: catalogColumnDataRef,
    filter: catalogColumnFilterDataRef,
  },
  configSchema: {
    filter: createZodV4FilterPredicateSchema().optional(),
  },
  *factory(
    params: {
      column: TableColumn<{}>;
      filter?: CatalogColumnFilterFn;
    },
    { config },
  ) {
    yield catalogColumnDataRef(params.column);

    const configFilter = resolveConfigFilter(config);
    const combinedFilter = configFilter
      ? (ctx: CatalogColumnFilterContext) =>
          configFilter(ctx) && (params.filter ? params.filter(ctx) : true)
      : params.filter;

    if (combinedFilter) {
      yield catalogColumnFilterDataRef(combinedFilter);
    }
  },
});
