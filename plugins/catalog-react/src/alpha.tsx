/*
 * Copyright 2023 The Backstage Authors
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
  AnyExtensionInputMap,
  ExtensionBoundary,
  ExtensionInputValues,
  RouteRef,
  coreExtensionData,
  createExtension,
  createExtensionDataRef,
  createSchemaFromZod,
} from '@backstage/frontend-plugin-api';
import React, { lazy } from 'react';
import { Entity } from '@backstage/catalog-model';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { Expand } from '../../../packages/frontend-plugin-api/src/types';

export { useEntityPermission } from './hooks/useEntityPermission';
export { isOwnerOf } from './utils';

/** @alpha */
export const entityContentTitleExtensionDataRef =
  createExtensionDataRef<string>('plugin.catalog.entity.content.title');

/** @alpha */
export const entityFilterFunctionExtensionDataRef = createExtensionDataRef<
  (entity: Entity) => boolean
>('plugin.catalog.entity.filter.fn');

/** @alpha */
export const entityFilterExpressionExtensionDataRef =
  createExtensionDataRef<string>('plugin.catalog.entity.filter.expression');

// TODO: Figure out how to merge with provided config schema
/** @alpha */
export function createEntityCardExtension<
  TInputs extends AnyExtensionInputMap,
>(options: {
  id: string;
  attachTo?: { id: string; input: string };
  disabled?: boolean;
  inputs?: TInputs;
  filter?:
    | typeof entityFilterFunctionExtensionDataRef.T
    | typeof entityFilterExpressionExtensionDataRef.T;
  loader: (options: {
    inputs: Expand<ExtensionInputValues<TInputs>>;
  }) => Promise<JSX.Element>;
}) {
  const id = `entity.cards.${options.id}`;

  return createExtension({
    id,
    attachTo: options.attachTo ?? {
      id: 'entity.content.overview',
      input: 'cards',
    },
    disabled: options.disabled ?? true,
    output: {
      element: coreExtensionData.reactElement,
      filterFunction: entityFilterFunctionExtensionDataRef.optional(),
      filterExpression: entityFilterExpressionExtensionDataRef.optional(),
    },
    inputs: options.inputs,
    configSchema: createSchemaFromZod(z =>
      z.object({
        filter: z.string().optional(),
      }),
    ),
    factory({ config, inputs, node }) {
      const ExtensionComponent = lazy(() =>
        options
          .loader({ inputs })
          .then(element => ({ default: () => element })),
      );

      return {
        element: (
          <ExtensionBoundary node={node}>
            <ExtensionComponent />
          </ExtensionBoundary>
        ),
        ...mergeFilters({ config, options }),
      };
    },
  });
}

/** @alpha */
export function createEntityContentExtension<
  TInputs extends AnyExtensionInputMap,
>(options: {
  id: string;
  attachTo?: { id: string; input: string };
  disabled?: boolean;
  inputs?: TInputs;
  routeRef?: RouteRef;
  defaultPath: string;
  defaultTitle: string;
  filter?:
    | typeof entityFilterFunctionExtensionDataRef.T
    | typeof entityFilterExpressionExtensionDataRef.T;
  loader: (options: {
    inputs: Expand<ExtensionInputValues<TInputs>>;
  }) => Promise<JSX.Element>;
}) {
  const id = `entity.content.${options.id}`;

  return createExtension({
    id,
    attachTo: options.attachTo ?? {
      id: 'plugin.catalog.page.entity',
      input: 'contents',
    },
    disabled: options.disabled ?? true,
    output: {
      element: coreExtensionData.reactElement,
      path: coreExtensionData.routePath,
      routeRef: coreExtensionData.routeRef.optional(),
      title: entityContentTitleExtensionDataRef,
      filterFunction: entityFilterFunctionExtensionDataRef.optional(),
      filterExpression: entityFilterExpressionExtensionDataRef.optional(),
    },
    inputs: options.inputs,
    configSchema: createSchemaFromZod(z =>
      z.object({
        path: z.string().default(options.defaultPath),
        title: z.string().default(options.defaultTitle),
        filter: z.string().optional(),
      }),
    ),
    factory({ config, inputs, node }) {
      const ExtensionComponent = lazy(() =>
        options
          .loader({ inputs })
          .then(element => ({ default: () => element })),
      );

      return {
        path: config.path,
        title: config.title,
        routeRef: options.routeRef,
        element: (
          <ExtensionBoundary node={node} routable>
            <ExtensionComponent />
          </ExtensionBoundary>
        ),
        ...mergeFilters({ config, options }),
      };
    },
  });
}

/**
 * Decides what filter outputs to produce, given some options and config
 */
function mergeFilters(inputs: {
  options: {
    filter?:
      | typeof entityFilterFunctionExtensionDataRef.T
      | typeof entityFilterExpressionExtensionDataRef.T;
  };
  config: {
    filter?: string;
  };
}): {
  filterFunction?: typeof entityFilterFunctionExtensionDataRef.T;
  filterExpression?: typeof entityFilterExpressionExtensionDataRef.T;
} {
  const { options, config } = inputs;
  if (config.filter) {
    return { filterExpression: config.filter };
  } else if (typeof options.filter === 'string') {
    return { filterExpression: options.filter };
  } else if (typeof options.filter === 'function') {
    return { filterFunction: options.filter };
  }
  return {};
}
