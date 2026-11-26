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
import {
  createVersionedContext,
  createVersionedValueMap,
} from '@backstage/version-bridge';
import { RouterProvider } from 'react-aria-components';
import {
  Link,
  type NavigateOptions,
  useHref,
  useInRouterContext,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';

// Preserve the V2 contract for independently bundled older BUI consumers.
const delegatedNavigations = new WeakMap<object, () => void>();

/** @internal */
const buiRoutingIntegration = {
  Link,
  useHref,
  useInRouterContext,
  useLocation,
  useNavigate,
  useResolvedPath,
  createRouterOptions(action: () => void, options?: NavigateOptions) {
    const routerOptions = { ...options };
    delegatedNavigations.set(routerOptions, action);
    return routerOptions;
  },
};

const LegacyContext = createVersionedContext<{
  1: {};
  2: { routing: typeof buiRoutingIntegration };
}>('bui');
const legacyValue = createVersionedValueMap({
  1: {},
  2: { routing: buiRoutingIntegration },
});

// Matches how browsers read an href: tabs and newlines are removed, and
// leading control characters and spaces are ignored.
function normalizeHref(href: string): string {
  // eslint-disable-next-line no-control-regex
  return href.replace(/[\t\n\r]/g, '').replace(/^[\x00-\x20]+/, '');
}

function isBrowserOwnedHref(href: string): boolean {
  return /^(?:[a-z][a-z0-9+.-]*:|[/\\]{2})/i.test(normalizeHref(href));
}

function useLegacyHref(href: string): string {
  const resolved = useHref(href);
  return !href || isBrowserOwnedHref(href) ? href : resolved;
}

/** App-owned compatibility for the frozen BUI V2 React Router contract. */
export function LegacyBUIProvider({ children }: { children: ReactNode }) {
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
      // React Aria client-navigates same-origin absolute URLs too, but React
      // Router only navigates app paths and would nest the URL under the
      // current path. Leave absolute URLs to the browser, like BUI does.
      if (isBrowserOwnedHref(href)) {
        if (!/^(?:javascript|data|vbscript):/i.test(normalizeHref(href))) {
          window.location.assign(href);
        }
        return;
      }
      providerNavigate(href, options);
    },
    [providerNavigate],
  );

  return (
    <RouterProvider navigate={navigate} useHref={useLegacyHref}>
      <LegacyContext.Provider value={legacyValue}>
        {children}
      </LegacyContext.Provider>
    </RouterProvider>
  );
}
