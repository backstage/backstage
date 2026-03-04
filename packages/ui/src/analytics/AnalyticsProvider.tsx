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
import { AnalyticsHookContext } from './useAnalytics';
import type { UseAnalyticsFn } from './types';

/** @public */
export type AnalyticsProviderProps = {
  useAnalytics: UseAnalyticsFn;
  children: ReactNode;
};

/**
 * Provides an analytics hook to all descendant BUI components.
 *
 * @example
 * ```tsx
 * import { AnalyticsProvider } from '@backstage/ui';
 * import { useAnalytics as useBackstageAnalytics } from '@backstage/core-plugin-api';
 *
 * function App() {
 *   return (
 *     <AnalyticsProvider useAnalytics={useBackstageAnalytics}>
 *       <AppContent />
 *     </AnalyticsProvider>
 *   );
 * }
 * ```
 *
 * @public
 */
export function AnalyticsProvider(props: AnalyticsProviderProps) {
  const { useAnalytics, children } = props;
  const value = useMemo(
    () => createVersionedValueMap({ 1: useAnalytics }),
    [useAnalytics],
  );
  return (
    <AnalyticsHookContext.Provider value={value}>
      {children}
    </AnalyticsHookContext.Provider>
  );
}
