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

import { Suspense, type ComponentType, type ReactNode } from 'react';
import { z } from 'zod/v4';
import {
  createExtension,
  coreExtensionData,
  createExtensionInput,
  NotFoundErrorPage,
  navigationControllerApiRef,
  useApi,
} from '@backstage/frontend-plugin-api';
import { AppRouteSwitch, RouteTable } from '@backstage/frontend-app-api';

function normalizeRoutePath(path: string): string {
  if (path === '/') {
    return '/';
  }
  return path.replace(/\/$/, '') || '/';
}

function PageSuspense(props: { children: ReactNode }) {
  return <Suspense fallback={null}>{props.children}</Suspense>;
}

export const AppRoutes = createExtension({
  name: 'routes',
  attachTo: { id: 'app/layout', input: 'content' },
  inputs: {
    routes: createExtensionInput([
      coreExtensionData.routePath,
      coreExtensionData.routeRef.optional(),
      coreExtensionData.reactElement,
    ]),
  },
  configSchema: {
    redirects: z
      .array(
        z.object({
          from: z.string(),
          to: z.string(),
        }),
      )
      .optional(),
  },
  output: [coreExtensionData.reactElement],
  factory({ inputs, config }) {
    const redirects = config.redirects ?? [];

    const routePaths = inputs.routes.map(route =>
      normalizeRoutePath(route.get(coreExtensionData.routePath)),
    );
    const routeTable = new RouteTable(routePaths);

    const pages = new Map<string, ComponentType>();
    for (const route of inputs.routes) {
      const path = normalizeRoutePath(route.get(coreExtensionData.routePath));
      if (pages.has(path)) {
        continue;
      }
      const element = route.get(coreExtensionData.reactElement);
      pages.set(path, () => <PageSuspense>{element}</PageSuspense>);
    }

    const RoutesElement = () => {
      const controller = useApi(navigationControllerApiRef);

      return (
        <AppRouteSwitch
          controller={controller}
          routeTable={routeTable}
          pages={pages}
          redirects={redirects}
          fallback={<NotFoundErrorPage />}
        />
      );
    };

    return [coreExtensionData.reactElement(<RoutesElement />)];
  },
});
