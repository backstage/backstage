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
import { ExtensionBoundary } from '../components';
import { createSchemaFromZod, PortableSchema } from '../schema';
import {
  coreExtensionData,
  createExtension,
  ResolvedExtensionInputs,
  AnyExtensionInputMap,
  createExtensionBlueprint,
} from '../wiring';
import { RouteRef } from '../routing';
import { Expand } from '../types';
import { ExtensionDefinition } from '../wiring/createExtension';

/**
 * Helper for creating extensions for a routable React page component.
 *
 * @public
 */
export function createPageExtension<
  TConfig extends { path: string },
  TInputs extends AnyExtensionInputMap,
>(
  options: (
    | {
        defaultPath: string;
      }
    | {
        configSchema: PortableSchema<TConfig>;
      }
  ) & {
    namespace?: string;
    name?: string;
    attachTo?: { id: string; input: string };
    disabled?: boolean;
    inputs?: TInputs;
    routeRef?: RouteRef;
    loader: (options: {
      config: TConfig;
      inputs: Expand<ResolvedExtensionInputs<TInputs>>;
    }) => Promise<JSX.Element>;
  },
): ExtensionDefinition<TConfig> {
  const configSchema =
    'configSchema' in options
      ? options.configSchema
      : (createSchemaFromZod(z =>
          z.object({ path: z.string().default(options.defaultPath) }),
        ) as PortableSchema<TConfig>);

  return createExtension({
    kind: 'page',
    namespace: options.namespace,
    name: options.name,
    attachTo: options.attachTo ?? { id: 'app/routes', input: 'routes' },
    configSchema,
    inputs: options.inputs,
    disabled: options.disabled,
    output: {
      element: coreExtensionData.reactElement,
      path: coreExtensionData.routePath,
      routeRef: coreExtensionData.routeRef.optional(),
    },
    factory({ config, inputs, node }) {
      const ExtensionComponent = lazy(() =>
        options
          .loader({ config, inputs })
          .then(element => ({ default: () => element })),
      );

      return {
        path: config.path,
        routeRef: options.routeRef,
        element: (
          <ExtensionBoundary node={node}>
            <ExtensionComponent />
          </ExtensionBoundary>
        ),
      };
    },
  });
}

/**
 * A blueprint for creating extensions for routable React page components.
 * @public
 */
export const PageExtensionBlueprint = createExtensionBlueprint({
  kind: 'page',
  attachTo: { id: 'app/routes', input: 'routes' },
  output: [
    coreExtensionData.routePath,
    coreExtensionData.reactElement,
    coreExtensionData.routeRef.optional(),
  ],
  config: {
    schema: {
      path: z => z.string().optional(),
    },
  },
  factory(
    {
      defaultPath,
      loader,
      routeRef,
    }: {
      defaultPath?: string;
      // TODO(blam) This type is impossible to type properly here as we don't have access
      // to the input type generic. Maybe not a deal breaker though.
      // It means we have to override the factory function in the `.make` method instead.
      loader: (opts: unknown) => Promise<JSX.Element>;
      routeRef?: RouteRef;
    },
    { config, inputs, node },
  ) {
    const ExtensionComponent = lazy(() =>
      loader({ config, inputs }).then(element => ({ default: () => element })),
    );

    // TODO(blam): this is a little awkward for optional returns.
    // I wonder if we should be using generators or yield instead
    // for a better API here.
    const outputs = [
      coreExtensionData.routePath(config.path ?? defaultPath!),
      coreExtensionData.reactElement(
        <ExtensionBoundary node={node}>
          <ExtensionComponent />
        </ExtensionBoundary>,
      ),
    ];

    if (routeRef) {
      return [...outputs, coreExtensionData.routeRef(routeRef)];
    }

    return outputs;
  },
});
