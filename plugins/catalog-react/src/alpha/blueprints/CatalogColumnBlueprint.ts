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

import {
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import { TableColumn } from '@backstage/core-components';
import { Entity } from '@backstage/catalog-model';
import {
  FilterPredicate,
  createZodV4FilterPredicateSchema,
  filterPredicateToFilterFunction,
} from '@backstage/filter-predicates';
import { z } from 'zod/v4';

/**
 * Context passed to catalog column filter functions to determine visibility.
 * @alpha
 */
export interface CatalogColumnFilterContext {
  kind?: string;
  type?: string;
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
  TableColumn<any>
>().with({ id: 'catalog.table-column' });

/** @alpha */
export const catalogColumnFilterDataRef =
  createExtensionDataRef<CatalogColumnFilterFn>().with({
    id: 'catalog.table-column-filter',
  });

function resolveConfigFilter(config: {
  filter?: FilterPredicate | string;
}): CatalogColumnFilterFn | undefined {
  if (typeof config.filter === 'string') {
    // eslint-disable-next-line no-console
    console.warn(
      `DEPRECATION WARNING: Using a string-based filter in the catalog column configuration is deprecated. Use a filter predicate object instead.`,
    );
    return undefined;
  }
  if (config.filter) {
    const predicateFn =
      filterPredicateToFilterFunction<CatalogColumnFilterContext>(
        config.filter,
      );
    return predicateFn;
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
    filter: z
      .union([z.string(), createZodV4FilterPredicateSchema()])
      .optional(),
  },
  *factory(
    params: {
      column: TableColumn<any>;
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
