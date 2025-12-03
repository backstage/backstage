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

import { ComponentType, ReactNode } from 'react';
import { RoutingContextType } from '@backstage/frontend-plugin-api';

/**
 * Preset identifiers for built-in router implementations.
 *
 * @public
 */
export type RouterPreset = 'react-router-6';

/**
 * An adapter interface for plugging in different router implementations.
 *
 * This allows users to provide custom router implementations (e.g., React Router 7,
 * TanStack Router) while maintaining compatibility with the Backstage routing system.
 *
 * @public
 */
export interface RouterAdapter {
  /**
   * Provider component that sets up the routing context.
   * This should wrap children with the appropriate routing context provider.
   */
  Provider: ComponentType<{ children: ReactNode }>;

  /**
   * Router component that wraps Provider with the actual router (e.g., BrowserRouter).
   * This component should handle the base path configuration.
   */
  Router: ComponentType<{ children: ReactNode; basePath: string }>;

  /**
   * Function to match routes against a location pathname.
   * Used internally by createSpecializedApp for route resolution.
   */
  matchRoutes: RoutingContextType['matchRoutes'];

  /**
   * Function to generate a path from a route pattern and params.
   * Used internally by createSpecializedApp for route resolution.
   */
  generatePath: RoutingContextType['generatePath'];
}

/**
 * Type guard to check if a router option is a RouterAdapter object.
 *
 * @param router - The router option to check
 * @returns True if the router is a RouterAdapter object
 * @internal
 */
export function isRouterAdapter(
  router: RouterPreset | RouterAdapter,
): router is RouterAdapter {
  return typeof router === 'object' && 'Provider' in router;
}
