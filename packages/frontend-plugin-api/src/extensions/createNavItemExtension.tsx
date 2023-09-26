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
import { coreExtensionData, createExtension } from '../wiring';

/**
 * Helper for creating extensions for a nav item.
 * @public
 */
export function createNavItemExtension(options: {
  id: string;
  routeRef: RouteRef;
  title: string;
  icon: IconComponent;
}) {
  const { id, routeRef, title, icon } = options;
  return createExtension({
    id,
    at: 'core.nav/items',
    configSchema: createSchemaFromZod(z =>
      z.object({
        title: z.string().default(title),
      }),
    ),
    output: {
      navTarget: coreExtensionData.navTarget,
    },
    factory: ({ bind, config }) => {
      bind({
        navTarget: {
          title: config.title,
          icon,
          routeRef,
        },
      });
    },
  });
}
