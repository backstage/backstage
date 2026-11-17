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

import { type ReactNode, useMemo } from 'react';
import {
  createVersionedContext,
  createVersionedValueMap,
  useVersionedContext,
} from '@backstage/version-bridge';
import { useAppCreateHref } from './useAppHref';
import { useOptionalAppNavigate } from './useAppNavigate';
import type { AppNavigate } from '@backstage/frontend-plugin-api';

/**
 * Navigation contract for routing and component-library integrations, bound to
 * the consuming component's routing scope.
 *
 * This is stable public API with the same compatibility guarantees as the
 * main entry point. Most plugins should use the main entry point's navigation
 * hooks and UI components instead.
 * @public
 */
export interface RoutingIntegration {
  /** Converts an authored target to a browser-ready href, including the deployment basename. */
  createHref(to: string): string;
  /** Navigates to an authored target, never a generated browser href. */
  navigate(to: string, options?: Parameters<AppNavigate>[1]): void;
  /** Current browser pathname, including the deployment basename, without query or hash. */
  pathname: string;
}

type NavigationContextVersions = {
  1: { useNavigation: () => RoutingIntegration };
};
const NavigationContext =
  createVersionedContext<NavigationContextVersions>('app-navigation');

/** @public */
export interface RoutingProviderProps {
  /**
   * Hook invoked at each consumer, not at the provider. It may read nested
   * routing-library contexts at that consumer's position. Keep its identity
   * stable and its hook order consistent for the lifetime of the provider.
   */
  useRoutingIntegration: () => RoutingIntegration;
  children: ReactNode;
}

/**
 * Overrides contextual navigation for a subtree without changing app history
 * or the strict framework hooks. Routing adapters supply this provider.
 * @public
 */
export function RoutingProvider({
  useRoutingIntegration: useProvidedNavigation,
  children,
}: RoutingProviderProps) {
  const value = useMemo(
    () =>
      createVersionedValueMap({ 1: { useNavigation: useProvidedNavigation } }),
    [useProvidedNavigation],
  );
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

function useFrameworkNavigation(): RoutingIntegration {
  const createHref = useAppCreateHref();
  const navigate = useOptionalAppNavigate();
  return {
    createHref,
    navigate: (target, options) => {
      if (navigate) {
        navigate(target, options);
      } else if (options?.replace) {
        window.location.replace(createHref(target));
      } else {
        window.location.assign(createHref(target));
      }
    },
    pathname: createHref(''),
  };
}

/**
 * Acquires navigation at the calling component's route scope. The default
 * accepts app-absolute paths, external URLs, and empty/query/hash targets.
 * Adapters additionally provide their library's relative-target semantics.
 *
 * Pass authored targets to both methods. Generated hrefs include the deployment
 * basename and must only be used as browser hrefs, not passed back to navigate.
 * Links and collections must call this hook at their own routing scope; a
 * callback captured by a root provider cannot observe deeper route contexts.
 * The useAppHref and useAppNavigate hooks remain strict inside adapters.
 * @public
 */
export function useRoutingIntegration(): RoutingIntegration {
  const useScopedNavigation =
    useVersionedContext<NavigationContextVersions>('app-navigation')?.atVersion(
      1,
    )?.useNavigation ?? useFrameworkNavigation;
  return useScopedNavigation();
}

/** @internal */
export function useHasNavigationProvider(): boolean {
  return Boolean(
    useVersionedContext<NavigationContextVersions>('app-navigation')?.atVersion(
      1,
    ),
  );
}
