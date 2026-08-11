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
import {
  useHref,
  useInRouterContext,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { createVersionedValueMap } from '@backstage/version-bridge';
import { BUIContext } from '../analytics/useAnalytics';
import { isExternalLink, sanitizeHref } from '../utils/linkUtils';
import type { UseAnalyticsFn } from '../analytics/types';
import {
  BUIRouterContext,
  BUIRouterHandlesRawHrefContext,
  type BUIRouter,
} from './BUIRouter';

/** @public */
export type BUIProviderProps = {
  useAnalytics?: UseAnalyticsFn;
  /**
   * Routing capability backed by the host application's router or history.
   * When omitted, BUI adapts an ambient React Router v6 context when present,
   * and otherwise leaves links to native browser navigation.
   */
  router?: BUIRouter;
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
  const { useAnalytics, router, children } = props;
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

  if (router) {
    return (
      <BUIRouterHandlesRawHrefContext.Provider value>
        <BUIRouterContext.Provider value={router}>
          <RouterProvider navigate={router.navigate} useHref={router.useHref}>
            {content}
          </RouterProvider>
        </BUIRouterContext.Provider>
      </BUIRouterHandlesRawHrefContext.Provider>
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
  const router = useMemo<BUIRouter>(
    () => ({
      navigate,
      useHref: useReactRouterHref,
      useLocation,
    }),
    [navigate],
  );

  return (
    <BUIRouterContext.Provider value={router}>
      <RouterProvider navigate={navigate} useHref={useReactRouterHref}>
        {children}
      </RouterProvider>
    </BUIRouterContext.Provider>
  );
}

function useReactRouterHref(href: string): string {
  const safeHref = sanitizeHref(href) ?? '';
  const resolved = useHref(safeHref);
  return isExternalLink(safeHref) ? safeHref : resolved;
}
