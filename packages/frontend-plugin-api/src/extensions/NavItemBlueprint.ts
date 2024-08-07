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
import { createExtensionBlueprint } from '../wiring';
import { createNavItemExtension } from './createNavItemExtension';

export const NavItemBlueprint = createExtensionBlueprint({
  kind: 'nav-item',
  attachTo: { id: 'app/nav', input: 'items' },
  output: [createNavItemExtension.targetDataRef],
  dataRefs: {
    target: createNavItemExtension.targetDataRef,
  },
  factory: (
    {
      icon,
      routeRef,
    }: {
      title: string;
      icon: IconComponent;
      routeRef: RouteRef<undefined>;
    },
    { config },
  ) => [
    createNavItemExtension.targetDataRef({
      title: config.title,
      icon,
      routeRef,
    }),
  ],
  config: {
    schema: ({ title }) => ({
      title: z => z.string().default(title),
    }),
  },
});
