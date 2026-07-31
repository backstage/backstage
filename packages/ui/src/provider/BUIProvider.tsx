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
import { useInRouterContext, useNavigate } from 'react-router-dom';
import { createVersionedValueMap } from '@backstage/version-bridge';
import { BUIContext } from '../analytics/useAnalytics';
import { useResolvedHref } from '../hooks/useResolvedHref';
import type { UseAnalyticsFn } from '../analytics/types';

/** @public */
export type BUIProviderProps = {
  useAnalytics?: UseAnalyticsFn;
  /**
   * Navigate function backed by the host application's own router or history,
   * for example a Backstage app history. When provided, this is used for all
   * client-side navigation triggered by descendant BUI components (`Link`,
   * `Tabs`, `Menu`, ...) instead of React Router's `useNavigate`, and a React
   * Router context is not required.
   */
  navigate?: (path: string, options?: { replace?: boolean }) => void;
  /**
   * Resolves an href for the react-aria router context, paired with
   * {@link BUIProviderProps.navigate}. Defaults to returning `href`
   * unchanged. Ignored when `navigate` is not set.
   */
  useHref?: (href: string) => string;
  children: ReactNode;
};

function identityHref(href: string): string {
  return href;
}

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
  const { useAnalytics, navigate, useHref, children } = props;
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

  if (navigate) {
    return (
      <RouterProvider navigate={navigate} useHref={useHref ?? identityHref}>
        {content}
      </RouterProvider>
    );
  }

  return <MaybeReactRouterContent>{content}</MaybeReactRouterContent>;
}

function MaybeReactRouterContent({ children }: { children: ReactNode }) {
  if (!useInRouterContext()) {
    return <>{children}</>;
  }
  return <ReactRouterContent>{children}</ReactRouterContent>;
}

function ReactRouterContent({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <RouterProvider navigate={navigate} useHref={useResolvedHref}>
      {children}
    </RouterProvider>
  );
}
