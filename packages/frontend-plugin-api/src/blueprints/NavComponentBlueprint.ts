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

import { AnyRouteRefParams, RouteRef } from '../routing';
import { createExtensionBlueprint, createExtensionDataRef } from '../wiring';
import { ComponentType } from 'react';

const targetDataRef = createExtensionDataRef<{
  Component: ComponentType<any>;
  routeRef: RouteRef<AnyRouteRefParams>;
  args?: Record<string, any>;
}>().with({ id: 'core.nav-component.target' });

/**
 * Creates extensions that make up the custom items of the nav bar.
 *
 * @public
 */
export const NavComponentBlueprint = createExtensionBlueprint({
  kind: 'nav-component',
  attachTo: { id: 'app/nav', input: 'components' },
  output: [targetDataRef],
  dataRefs: {
    target: targetDataRef,
  },
  factory: (
    {
      Component,
      routeRef,
      args,
    }: {
      Component: ComponentType<any>;
      routeRef: RouteRef<AnyRouteRefParams>;
      args?: Record<string, any>;
    },
    { config },
  ) => [
    targetDataRef({
      Component,
      routeRef,
      args: config.args ?? args,
    }),
  ],
  config: {
    schema: {
      args: z => z.record(z.any()).optional(),
    },
  },
});
