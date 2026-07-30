/*
 * Copyright 2026 The Backstage Authors
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

import { Fragment, type ReactNode } from 'react';
import {
  ApiBlueprint,
  createApiFactory,
  createExtension,
  createFrontendModule,
  createFrontendPlugin,
  createRouteRef,
  coreExtensionData,
  appHistoryApiRef,
  type ApiRef,
  type ExtensionDefinition,
  type ExternalRouteRef,
  type FrontendFeature,
  type RouteRef,
} from '@backstage/frontend-plugin-api';
import { RouterBlueprint } from '@backstage/plugin-app-react';
import { OpaqueExternalRouteRef } from '@internal/frontend';
import { getMockApiFactory } from '../apis/MockWithApiFactory';
import { TestAppRouter, type TestNavigation } from './createTestNavigation';

/**
 * Shared mounted-route + navigation-controller wiring for test app renderers.
 *
 * @internal
 */
export function prepareTestAppFeatures(options: {
  extensions: ExtensionDefinition[];
  navigation: Pick<TestNavigation, 'controller' | 'basename'>;
  appPluginOverride: FrontendFeature;
  mountedRoutes?: {
    [path: string]: RouteRef | ExternalRouteRef;
  };
  features?: FrontendFeature[];
  apis?: readonly any[];
  /** Where synthetic mounted-route extensions attach. */
  mountedRouteAttachTo: { id: string; input: string };
}): {
  features: FrontendFeature[];
  apiFactoryOverrides: ReturnType<typeof createApiFactory>[];
  externalBindings: Map<ExternalRouteRef, RouteRef>;
} {
  const { controller } = options.navigation;
  const extensions = [...options.extensions];
  const externalBindings = new Map<ExternalRouteRef, RouteRef>();

  if (options.mountedRoutes) {
    for (const [path, optionRef] of Object.entries(options.mountedRoutes)) {
      let routeRef: RouteRef;

      if (OpaqueExternalRouteRef.isType(optionRef)) {
        routeRef = createRouteRef();
        externalBindings.set(optionRef, routeRef);
      } else {
        routeRef = optionRef;
      }

      extensions.push(
        createExtension({
          kind: 'test-route',
          name: path,
          attachTo: options.mountedRouteAttachTo,
          output: [
            coreExtensionData.reactElement,
            coreExtensionData.routePath,
            coreExtensionData.routeRef,
          ],
          factory: () => [
            coreExtensionData.reactElement(<Fragment />),
            coreExtensionData.routePath(path),
            coreExtensionData.routeRef(routeRef),
          ],
        }),
      );
    }
  }

  function TestRouter({ children }: { children: ReactNode }) {
    return <TestAppRouter controller={controller}>{children}</TestAppRouter>;
  }

  const features: FrontendFeature[] = [
    createFrontendModule({
      pluginId: 'app',
      extensions: [
        ApiBlueprint.make({
          name: 'app-history',
          params: defineParams =>
            defineParams({
              api: appHistoryApiRef,
              deps: {},
              factory: () => controller,
            }),
        }),
        RouterBlueprint.make({
          params: {
            component: TestRouter,
          },
        }),
      ],
    }),
    createFrontendPlugin({
      pluginId: 'test',
      extensions,
    }),
    options.appPluginOverride,
  ];

  if (options.features) {
    features.push(...options.features);
  }

  const apiFactoryOverrides = [
    // Prefer the memory-history controller over any production default
    // registered in phase APIs (first registration wins).
    createApiFactory(appHistoryApiRef, controller),
    ...(options.apis ?? []).map(entry => {
      const mockFactory = getMockApiFactory(entry);
      if (mockFactory) {
        return mockFactory;
      }
      const [apiRef, implementation] = entry as readonly [ApiRef<any>, any];
      return createApiFactory(apiRef, implementation);
    }),
  ];

  return { features, apiFactoryOverrides, externalBindings };
}
