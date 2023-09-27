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

import { IconComponent, RouteRef } from '@backstage/core-plugin-api';
import { createSchemaFromZod } from '../schema/createSchemaFromZod';
import {
  AnyExtensionInputMap,
  ExtensionInputValues,
  coreExtensionData,
  createExtension,
} from '../wiring';
import { Expand } from '../wiring/createExtension';
import { Suspense, lazy } from 'react';
import React from 'react';

/**
 * Helper for creating extensions for a nav item.
 * @public
 */
export function createNavItemExtension<
  TInputs extends AnyExtensionInputMap,
>(options: {
  id: string;
  routeRef: RouteRef;
  title: string;
  icon: IconComponent;
  inputs?: TInputs;
  group?: (options: {
    inputs: Expand<ExtensionInputValues<TInputs>>;
  }) => Promise<JSX.Element>;
}) {
  const { id, routeRef, title, icon, group } = options;
  return createExtension({
    id,
    at: 'core.nav/items',
    configSchema: createSchemaFromZod(z =>
      z.object({
        title: z.string().default(title),
      }),
    ),
    inputs: options.inputs,
    output: {
      navTarget: coreExtensionData.navTarget,
    },
    factory: ({ bind, config, inputs }) => {
      const Group = group
        ? (lazy(() =>
            group({ inputs }).then(element => ({
              default: () => element,
            })),
          ) as unknown as () => JSX.Element)
        : undefined;
      bind({
        navTarget: {
          title: config.title,
          icon,
          routeRef,
          group: Group ? (
            <Suspense fallback="...">
              <Group />
            </Suspense>
          ) : undefined,
        },
      });
    },
  });
}
