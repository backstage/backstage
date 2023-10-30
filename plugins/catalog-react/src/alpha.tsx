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

import React, { lazy } from 'react';
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
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { Expand } from '../../../packages/frontend-plugin-api/src/types';
import { Entity } from '@backstage/catalog-model';

export { isOwnerOf } from './utils';
export { useEntityPermission } from './hooks/useEntityPermission';

/** @alpha */
export const entityContentTitleExtensionDataRef =
  createExtensionDataRef<string>('plugin.catalog.entity.content.title');

/** @alpha */
export const entityFilterExtensionDataRef = createExtensionDataRef<
  (ctx: { entity: Entity }) => boolean
>('plugin.catalog.entity.filter');

function applyFilter(a?: string, b?: string): boolean {
  if (!a) {
    return true;
  }
  return a.toLocaleLowerCase('en-US') === b?.toLocaleLowerCase('en-US');
}

// TODO: Only two hardcoded isKind and isType filters are available for now
//       This is just an initial config filter implementation and needs to be revisited
function buildFilter(
  config: { filter?: { isKind?: string; isType?: string }[] },
  filterFunc?: (ctx: { entity: Entity }) => boolean,
) {
  return (ctx: { entity: Entity }) => {
    const configuredFilterMatch = config.filter?.some(filter => {
      const kindMatch = applyFilter(filter.isKind, ctx.entity.kind);
      const typeMatch = applyFilter(
        filter.isType,
        ctx.entity.spec?.type?.toString(),
      );
      return kindMatch && typeMatch;
    });
    if (configuredFilterMatch) {
      return true;
    }
    if (filterFunc) {
      return filterFunc(ctx);
    }
    return true;
  };
}

// TODO: Figure out how to merge with provided config schema
/** @alpha */
export function createEntityCardExtension<
  TInputs extends AnyExtensionInputMap,
>(options: {
  id: string;
  attachTo?: { id: string; input: string };
  disabled?: boolean;
  inputs?: TInputs;
  filter?: (ctx: { entity: Entity }) => boolean;
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
      filter: entityFilterExtensionDataRef,
    },
    inputs: options.inputs,
    configSchema: createSchemaFromZod(z =>
      z.object({
        filter: z
          .array(
            z.object({
              isKind: z.string().optional(),
              isType: z.string().optional(),
            }),
          )
          .optional(),
      }),
    ),
    factory({ config, inputs, source }) {
      const ExtensionComponent = lazy(() =>
        options
          .loader({ inputs })
          .then(element => ({ default: () => element })),
      );

      return {
        element: (
          <ExtensionBoundary id={id} source={source}>
            <ExtensionComponent />
          </ExtensionBoundary>
        ),
        filter: buildFilter(config, options.filter),
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
  filter?: (ctx: { entity: Entity }) => boolean;
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
      filter: entityFilterExtensionDataRef,
    },
    inputs: options.inputs,
    configSchema: createSchemaFromZod(z =>
      z.object({
        path: z.string().default(options.defaultPath),
        title: z.string().default(options.defaultTitle),
        filter: z
          .array(
            z.object({
              isKind: z.string().optional(),
              isType: z.string().optional(),
            }),
          )
          .optional(),
      }),
    ),
    factory({ config, inputs, source }) {
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
          <ExtensionBoundary id={id} source={source} routable>
            <ExtensionComponent />
          </ExtensionBoundary>
        ),
        filter: buildFilter(config, options.filter),
      };
    },
  });
}
