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

import { IconComponent } from '@backstage/core-plugin-api';
import { createSchemaFromZod } from '../schema/createSchemaFromZod';
import { createExtension, createExtensionDataRef } from '../wiring';
import { RouteRef } from '../routing';

/**
 * Helper for creating extensions for a nav item.
 * @public
 */
export function createNavItemExtension(options: {
  namespace?: string;
  name?: string;
  routeRef: RouteRef<undefined>;
  title: string;
  icon: IconComponent;
}) {
  const { routeRef, title, icon, namespace, name } = options;
  return createExtension({
    namespace,
    name,
    kind: 'nav-item',
    attachTo: { id: 'app/nav', input: 'items' },
    configSchema: createSchemaFromZod(z =>
      z.object({
        title: z.string().default(title),
      }),
    ),
    output: {
      navTarget: createNavItemExtension.targetDataRef,
    },
    factory: ({ config }) => ({
      navTarget: {
        title: config.title,
        icon,
        routeRef,
      },
    }),
  });
}

/** @public */
export namespace createNavItemExtension {
  // TODO(Rugvip): Should this be broken apart into separate refs? title/icon/routeRef
  export const targetDataRef = createExtensionDataRef<{
    title: string;
    icon: IconComponent;
    routeRef: RouteRef<undefined>;
  }>('core.nav-item.target');
}
