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
import { RouterProvider } from 'react-aria-components';
import { useInRouterContext, useNavigate, useHref } from 'react-router-dom';
import { createVersionedValueMap } from '@backstage/version-bridge';
import { BUIContext } from '../analytics/useAnalytics';
import type { UseAnalyticsFn } from '../analytics/types';

/** @public */
export type BUIProviderProps = {
  useAnalytics?: UseAnalyticsFn;
  children: ReactNode;
};

/**
 * Provides integration capabilities to all descendant BUI components.
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
  const { useAnalytics, children } = props;
  const value = useMemo(
    () =>
      createVersionedValueMap({
        1: { useAnalytics },
      }),
    [useAnalytics],
  );

  const content = (
    <BUIContext.Provider value={value}>{children}</BUIContext.Provider>
  );

  if (useInRouterContext()) {
    return <RoutedContent>{content}</RoutedContent>;
  }

  return content;
}

function RoutedContent({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      {children}
    </RouterProvider>
  );
}
