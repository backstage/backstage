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
  Extension,
  ExtensionBoundary,
  ExtensionInputValues,
  PortableSchema,
  RouteRef,
  coreExtensionData,
  createExtension,
  createExtensionDataRef,
  createSchemaFromZod,
} from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { Expand } from '../../../packages/frontend-plugin-api/src/types';

export { isOwnerOf } from './utils';
export { useEntityPermission } from './hooks/useEntityPermission';

/** @alpha */
export const entityContentTitleExtensionDataRef =
  createExtensionDataRef<string>('plugin.catalog.entity.content.title');

/** @alpha */
export function createEntityCardExtension<
  TConfig,
  TInputs extends AnyExtensionInputMap,
>(options: {
  id: string;
  attachTo?: { id: string; input: string };
  disabled?: boolean;
  inputs?: TInputs;
  configSchema?: PortableSchema<TConfig>;
  loader: (options: {
    config: TConfig;
    inputs: Expand<ExtensionInputValues<TInputs>>;
  }) => Promise<JSX.Element>;
}): Extension<TConfig> {
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
    },
    inputs: options.inputs,
    configSchema: options.configSchema,
    factory({ bind, config, inputs, source }) {
      const ExtensionComponent = lazy(() =>
        options
          .loader({ config, inputs })
          .then(element => ({ default: () => element })),
      );

      bind({
        element: (
          <ExtensionBoundary id={id} source={source}>
            <ExtensionComponent />
          </ExtensionBoundary>
        ),
      });
    },
  });
}

/** @alpha */
export function createEntityContentExtension<
  TConfig extends { path: string; title: string },
  TInputs extends AnyExtensionInputMap,
>(
  options: (
    | {
        defaultPath: string;
        defaultTitle: string;
      }
    | {
        configSchema: PortableSchema<TConfig>;
      }
  ) & {
    id: string;
    attachTo?: { id: string; input: string };
    disabled?: boolean;
    inputs?: TInputs;
    routeRef?: RouteRef;
    loader: (options: {
      config: TConfig;
      inputs: Expand<ExtensionInputValues<TInputs>>;
    }) => Promise<JSX.Element>;
  },
): Extension<TConfig> {
  const id = `entity.content.${options.id}`;

  const configSchema =
    'configSchema' in options
      ? options.configSchema
      : (createSchemaFromZod(z =>
          z.object({
            path: z.string().default(options.defaultPath),
            title: z.string().default(options.defaultTitle),
          }),
        ) as PortableSchema<TConfig>);

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
    },
    inputs: options.inputs,
    configSchema,
    factory({ bind, config, inputs, source }) {
      const ExtensionComponent = lazy(() =>
        options
          .loader({ config, inputs })
          .then(element => ({ default: () => element })),
      );

      bind({
        path: config.path,
        title: config.title,
        routeRef: options.routeRef,
        element: (
          <ExtensionBoundary id={id} source={source} routable>
            <ExtensionComponent />
          </ExtensionBoundary>
        ),
      });
    },
  });
}
