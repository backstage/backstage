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

import { useCallback, type ReactNode } from 'react';
import { RouterProvider } from 'react-aria-components';
import {
  Link,
  useHref,
  useInRouterContext,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';
import { useResolvedHref } from '../hooks/useResolvedHref';
import type { BUIRoutingIntegration } from './types';

// BUIProvider mounts this provider centrally so older BUI components from the
// same React Aria module instance keep delegated client-side navigation.
// Collection roots also mount it locally so their synthetic link items and the
// provider always use the same React Aria module instance. Preserving each
// item's href and original activation event lets React Aria choose between
// client navigation and temporary-anchor activation for native link behavior.
//
// The exact options object identifies a component-scoped action. Unregistered
// objects, including those from older BUI components or direct React Aria
// usage, use the provider's router context instead. A separate React Aria
// module instance cannot reach this provider and is handled by the rendered
// host Link in useNavigation.
const delegatedNavigations = new WeakMap<object, () => void>();

/** @internal */
export const buiRoutingIntegration: BUIRoutingIntegration = {
  Link,
  useHref,
  useInRouterContext,
  useLocation,
  useNavigate,
  useResolvedPath,
  createRouterOptions(action, options) {
    const routerOptions = { ...options };
    delegatedNavigations.set(routerOptions, action);
    return routerOptions;
  },
};

/** @internal */
export function BUIRoutingProvider({ children }: { children: ReactNode }) {
  if (!useInRouterContext()) {
    return children;
  }
  return <ReactAriaRoutingProvider>{children}</ReactAriaRoutingProvider>;
}

function ReactAriaRoutingProvider({ children }: { children: ReactNode }) {
  const providerNavigate = useNavigate();
  const navigate = useCallback(
    (href: string, options: object | undefined) => {
      const delegatedNavigation = options
        ? delegatedNavigations.get(options)
        : undefined;
      if (delegatedNavigation) {
        delegatedNavigation();
        return;
      }
      providerNavigate(href, options);
    },
    [providerNavigate],
  );

  return (
    <RouterProvider navigate={navigate} useHref={useResolvedHref}>
      {children}
    </RouterProvider>
  );
}
