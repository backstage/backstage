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
  ExtensionBoundary,
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import { ApiRef } from '@backstage/core-plugin-api';
import { EntityFilter } from '../../types';

/**
 * Describes a facet-based catalog filter rendered by the catalog page controller.
 * The available options are fetched from catalog facets using the given path,
 * and selections map directly to catalog backend filters.
 * @alpha
 */
export interface CatalogFacetFilterDescriptor {
  type: 'facet';
  label: string;
  filterKey: string;
  path: string;
  mode: 'single' | 'multi';
  defaultValue?: string | string[];
}

/**
 * Describes a catalog filter with static options and a custom filter factory.
 * The options are defined upfront, and a toFilter function maps selections
 * to an EntityFilter using injected API dependencies.
 * @alpha
 */
export interface CatalogOptionsFilterDescriptor {
  type: 'options';
  label: string;
  filterKey: string;
  mode: 'single' | 'multi';
  defaultValue?: string | string[];
  options: Array<{ label: string; value: string }>;
  deps: Record<string, ApiRef<unknown>>;
  toFilter(
    selected: string[],
    deps: Record<string, unknown>,
  ): EntityFilter | undefined | Promise<EntityFilter | undefined>;
}

/**
 * Describes a catalog filter that provides its own rendering.
 * @alpha
 */
export interface CatalogCustomFilterDescriptor {
  type: 'custom';
  element: JSX.Element;
}

/**
 * @alpha
 */
export type CatalogFilterDescriptor =
  | CatalogFacetFilterDescriptor
  | CatalogOptionsFilterDescriptor
  | CatalogCustomFilterDescriptor;

const catalogFilterDescriptorDataRef =
  createExtensionDataRef<CatalogFilterDescriptor>().with({
    id: 'catalog.filter-descriptor',
  });

/**
 * Creates catalog filter extensions.
 *
 * Supports three styles:
 * - Facet-based: provide a label, entity path, and selection mode. The catalog
 *   page fetches available values and renders the picker.
 * - Options-based: provide static options with a toFilter function that maps
 *   selections to EntityFilter objects, with API dependencies injected.
 * - Custom component (deprecated): provide a loader that returns JSX.
 *
 * @alpha
 */
export const CatalogFilterBlueprint = createExtensionBlueprint({
  kind: 'catalog-filter',
  attachTo: { id: 'page:catalog', input: 'filters' },
  output: [catalogFilterDescriptorDataRef],
  dataRefs: {
    filterDescriptor: catalogFilterDescriptorDataRef,
  },
  factory(
    params:
      | {
          label: string;
          filterKey?: string;
          path: string;
          mode: 'single' | 'multi';
          defaultValue?: string | string[];
        }
      | {
          label: string;
          filterKey?: string;
          mode: 'single' | 'multi';
          defaultValue?: string | string[];
          options: Array<{ label: string; value: string }>;
          deps?: Record<string, ApiRef<unknown>>;
          toFilter(
            selected: string[],
            deps: Record<string, unknown>,
          ): EntityFilter | undefined | Promise<EntityFilter | undefined>;
        }
      | {
          /** @deprecated Use the model-based params instead. */
          loader: () => Promise<JSX.Element>;
        },
    { node },
  ) {
    if ('loader' in params) {
      return [
        catalogFilterDescriptorDataRef({
          type: 'custom',
          element: ExtensionBoundary.lazy(node, params.loader),
        }),
      ];
    }
    if ('options' in params) {
      return [
        catalogFilterDescriptorDataRef({
          type: 'options',
          label: params.label,
          filterKey: params.filterKey ?? params.label,
          mode: params.mode,
          defaultValue: params.defaultValue,
          options: params.options,
          deps: params.deps ?? {},
          toFilter: params.toFilter,
        }),
      ];
    }
    return [
      catalogFilterDescriptorDataRef({
        type: 'facet',
        label: params.label,
        filterKey: params.filterKey ?? params.path,
        path: params.path,
        mode: params.mode,
        defaultValue: params.defaultValue,
      }),
    ];
  },
});
