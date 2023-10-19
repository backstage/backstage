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

import React, { lazy, useEffect } from 'react';
import { useAnalytics } from '@backstage/core-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { routableExtensionRenderedEvent } from '../../../core-plugin-api/src/analytics/Tracker';
import { ExtensionBoundary, ExtensionSuspense } from '../components';
import { createSchemaFromZod, PortableSchema } from '../schema';
import {
  coreExtensionData,
  createExtension,
  Extension,
  ExtensionInputValues,
  AnyExtensionInputMap,
} from '../wiring';
import { RouteRef } from '../routing';
import { Expand } from '../types';

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
  const { id, routeRef } = options;

  const attachTo = options.attachTo ?? { id: 'core.routes', input: 'routes' };

  const configSchema =
    'configSchema' in options
      ? options.configSchema
      : (createSchemaFromZod(z =>
          z.object({ path: z.string().default(options.defaultPath) }),
        ) as PortableSchema<TConfig>);

  return createExtension({
    id,
    attachTo,
    configSchema,
    inputs: options.inputs,
    disabled: options.disabled,
    output: {
      element: coreExtensionData.reactElement,
      path: coreExtensionData.routePath,
      routeRef: coreExtensionData.routeRef.optional(),
    },
    factory({ bind, config, inputs, source }) {
      const { path } = config;

      const PageComponent = lazy(() =>
        options
          .loader({ config, inputs })
          .then(element => ({ default: () => element })),
      );

      const ExtensionComponent = () => {
        const analytics = useAnalytics();

        // This event, never exposed to end-users of the analytics API,
        // helps inform which extension metadata gets associated with a
        // navigation event when the route navigated to is a gathered
        // mountpoint.
        useEffect(() => {
          analytics.captureEvent(routableExtensionRenderedEvent, '');
        }, [analytics]);

        return <PageComponent />;
      };

      bind({
        path,
        routeRef,
        element: (
          <ExtensionBoundary id={id} source={source} routeRef={routeRef}>
            <ExtensionSuspense>
              <ExtensionComponent />
            </ExtensionSuspense>
          </ExtensionBoundary>
        ),
      });
    },
  });
}
