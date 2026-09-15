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

import { useMemo, type ReactNode } from 'react';
import { createVersionedValueMap } from '@backstage/version-bridge';
import { BUIContext } from './BUIContext';
import {
  BUIRoutingProvider,
  buiRoutingIntegration,
} from '../navigation/BUIRoutingProvider';
import type { UseAnalyticsFn } from '../analytics/types';
import { useBUIRouter, type BUIRouter } from './BUIRouter';

/** @public */
export type BUIProviderProps = {
  useAnalytics?: UseAnalyticsFn;
  /**
   * Hook called at each consuming component to bind navigation, href
   * resolution and the active pathname to that component's route scope.
   * When omitted, inherits an enclosing host hook, uses ambient React Router
   * v6, or leaves links to browser navigation.
   */
  useRouter?: () => BUIRouter;
  children: ReactNode;
};

/**
 * Provides integration capabilities to all descendant BUI components.
 *
 * An explicit host hook supplies navigation, href resolution, and active-state
 * detection, including for independently loaded BUI components. Otherwise,
 * internal links use the ambient React Router, resolving relative destinations
 * at the component's route and applying the basename once.
 *
 * External links, downloads, and links with non-self targets use native browser
 * navigation. Components outside a routing context also use native links.
 *
 * @example
 * ```tsx
 * import { BUIProvider } from '@backstage/ui';
 * import { useAnalytics as useBackstageAnalytics } from '@backstage/core-plugin-api';
 *
 * function App() {
 *   return (
 *     <BUIProvider useAnalytics={useBackstageAnalytics}>
 *       <AppContent />
 *     </BUIProvider>
 *   );
 * }
 * ```
 *
 * @public
 */
export function BUIProvider(props: BUIProviderProps) {
  const { useAnalytics, useRouter: providedUseRouter, children } = props;
  const parentUseRouter = useBUIRouter();
  const useRouter = providedUseRouter ?? parentUseRouter;
  const value = useMemo(
    () =>
      createVersionedValueMap({
        1: { useAnalytics },
        2: { useAnalytics, routing: buiRoutingIntegration },
        3: { useAnalytics, routing: buiRoutingIntegration, useRouter },
      }),
    [useAnalytics, useRouter],
  );

  return (
    <BUIContext.Provider value={value}>
      <BUIRoutingProvider>{children}</BUIRoutingProvider>
    </BUIContext.Provider>
  );
}
