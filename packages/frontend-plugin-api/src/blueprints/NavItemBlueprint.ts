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

import { IconComponent } from '@backstage/core-plugin-api';
import { RouteRef } from '../routing';
import { createExtensionBlueprint, createExtensionDataRef } from '../wiring';

// TODO(Rugvip): Should this be broken apart into separate refs? title/icon/routeRef
const targetDataRef = createExtensionDataRef<{
  title: string;
  icon: IconComponent;
  routeRef: RouteRef<undefined>;
}>().with({ id: 'core.nav-item.target' });

/**
 * Creates extensions that make up the items of the nav bar.
 *
 * @public
 */
export const NavItemBlueprint = createExtensionBlueprint({
  kind: 'nav-item',
  attachTo: { id: 'app/nav', input: 'items' },
  output: [targetDataRef],
  dataRefs: {
    target: targetDataRef,
  },
  factory: (
    {
      icon,
      routeRef,
      title,
    }: {
      title: string;
      icon: IconComponent;
      routeRef: RouteRef<undefined>;
    },
    { config },
  ) => [
    targetDataRef({
      title: config.title ?? title,
      icon,
      routeRef,
    }),
  ],
  config: {
    schema: {
      title: z => z.string().optional(),
    },
  },
});
