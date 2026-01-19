/*
 * Copyright 2025 The Backstage Authors
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

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { RouterProvider } from 'react-aria-components';
import { useNavigate, useHref } from 'react-router-dom';
import { isExternalLink } from '../../utils/isExternalLink';

/**
 * Checks if an href is an internal link (not external and not empty).
 *
 * @internal
 */
export function isInternalLink(href: string | undefined): href is string {
  return !!href && !isExternalLink(href);
}

/**
 * Context value type for routing registration.
 * Used by container components to track children that need RouterProvider.
 *
 * @internal
 */
export type RoutingContextValue = {
  register: () => () => void;
};

/**
 * Wraps children in a RouterProvider for client-side navigation.
 * Must be rendered within a React Router context.
 *
 * @internal
 */
export function RoutedContainer({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      {children}
    </RouterProvider>
  );
}

/**
 * Hook for container components that need to conditionally provide routing.
 *
 * Usage:
 * 1. Call this hook in the container component
 * 2. Pass `contextValue` to a RoutingContextValue context provider
 * 3. Children call `register()` via context when they have internal hrefs
 * 4. If `hasRoutedChildren` is true, wrap content in RoutedContainer
 *
 * @internal
 */
export function useRoutingRegistration(): {
  hasRoutedChildren: boolean;
  contextValue: RoutingContextValue;
} {
  const [count, setCount] = useState(0);

  const register = useCallback(() => {
    setCount(c => c + 1);
    return () => setCount(c => c - 1);
  }, []);

  return { hasRoutedChildren: count > 0, contextValue: { register } };
}

/**
 * Creates a routing registration context and provider for container components.
 *
 * Usage:
 * ```tsx
 * // At module level
 * const { RoutingProvider, useRoutingRegistrationEffect } = createRoutingRegistration();
 *
 * // Container component wraps content with provider
 * <RoutingProvider>{content}</RoutingProvider>
 *
 * // Child items register when they have internal hrefs
 * useRoutingRegistrationEffect(href);
 * ```
 *
 * @internal
 */
export function createRoutingRegistration() {
  const RoutingContext = createContext<RoutingContextValue | null>(null);

  function RoutingProvider({ children }: { children: ReactNode }) {
    const { hasRoutedChildren, contextValue } = useRoutingRegistration();

    const content = (
      <RoutingContext.Provider value={contextValue}>
        {children}
      </RoutingContext.Provider>
    );

    if (hasRoutedChildren) {
      return <RoutedContainer>{content}</RoutedContainer>;
    }

    return content;
  }

  function useRoutingRegistrationEffect(href: string | undefined) {
    const routingCtx = useContext(RoutingContext);
    const hasInternalHref = isInternalLink(href);

    useEffect(() => {
      if (hasInternalHref && routingCtx) {
        return routingCtx.register();
      }
      return undefined;
    }, [hasInternalHref, routingCtx]);
  }

  return { RoutingContext, RoutingProvider, useRoutingRegistrationEffect };
}

/**
 * Conditionally wraps children in a RouterProvider for internal link navigation.
 * Only mounts the router hooks when `href` is an internal link, avoiding the
 * requirement for a Router context when rendering components without internal hrefs.
 *
 * @internal
 */
export function InternalLinkProvider({
  href,
  children,
}: {
  href: string | undefined;
  children: ReactNode;
}) {
  if (!isInternalLink(href)) {
    return <>{children}</>;
  }
  return <RoutedContainer>{children}</RoutedContainer>;
}
