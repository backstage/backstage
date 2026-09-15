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
import { BUIContext, type BUIContextVersions } from './BUIContext';
import type { UseAnalyticsFn } from '../analytics/types';
import { useBUIRouter, type BUIRouter } from './BUIRouter';

/** @public */
export type BUIProviderProps = {
  useAnalytics?: UseAnalyticsFn;
  /**
   * Hook called at each consuming component to bind navigation, href
   * resolution and the active pathname to that component's route scope.
   * When omitted, inherits an enclosing host hook. Without a host hook,
   * components use an explicitly supplied React Aria router or browser navigation.
   */
  useRouter?: () => BUIRouter;
  children: ReactNode;
};

/**
 * Provides integration capabilities to all descendant BUI components.
 *
 * An explicit host hook supplies navigation, href resolution, and active-state
 * detection, including for independently loaded BUI components. BUI components
 * bind this hook to React Aria at their own route scope. Without a host hook,
 * components use an explicitly supplied React Aria router or browser navigation.
 *
 * React Aria components used directly need their own scoped `RouterProvider`.
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
      createVersionedValueMap<BUIContextVersions>({
        1: { useAnalytics },
        3: { useAnalytics, useRouter },
      }),
    [useAnalytics, useRouter],
  );

  return <BUIContext.Provider value={value}>{children}</BUIContext.Provider>;
}
