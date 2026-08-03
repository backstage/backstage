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
import {
  InjectedHrefResolverContext,
  useResolvedHref,
} from '../hooks/useResolvedHref';
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
   *
   * When set, it is the only thing that resolves a link target: descendant
   * components hand their target over as it was written, rather than resolving
   * it against the surrounding React Router context first. That is what lets a
   * target written inside a page — `#tab`, `?tab=x`, `widgets` — still be
   * resolved against that page, wherever the components rendering it happen to
   * sit in the React Router tree.
   *
   * Being the only resolver carries an obligation. The external-link guard BUI
   * applies for itself is skipped below an injected resolver, so leaving
   * external targets alone is this function's job. It is called for absolute
   * (`https://example.com/x`), protocol-relative (`//example.com/x`) and
   * opaque-scheme (`mailto:`, `tel:`) targets as well as app-relative ones, and
   * has to return those first three exactly as they were written — a resolver
   * that applies a basename unconditionally renders an href such as
   * `/portalhttps://example.com/x`, which goes nowhere. The resolver
   * `@backstage/plugin-app` installs already guards them.
   *
   * Targets a browser would execute rather than navigate to are made inert
   * before this is called, and stay inert whatever it returns.
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
      // Announced only here, where the injected resolver is actually installed
      // as the react-aria router's `useHref`. With `navigate` alone there is
      // nothing to defer to, and react-router stays the authority it is today.
      <InjectedHrefResolverContext.Provider value={Boolean(useHref)}>
        <RouterProvider navigate={navigate} useHref={useHref ?? identityHref}>
          {content}
        </RouterProvider>
      </InjectedHrefResolverContext.Provider>
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
