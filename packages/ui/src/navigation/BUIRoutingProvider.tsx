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

import { createContext, useCallback, useContext, type ReactNode } from 'react';
import { RouterProvider } from 'react-aria-components';
import {
  useBUIRouter,
  type BUIRouter,
  type BUIRouterOptions,
} from '../provider/BUIRouter';
import { isBrowserOwnedHref } from '../utils/linkUtils';

const BUIRoutingContext = createContext<BUIRouter | undefined>(undefined);

/**
 * Returns the router captured by the control's React Aria routing provider.
 *
 * @internal
 */
export function useBUIRouting() {
  return useContext(BUIRoutingContext);
}

/**
 * Binds the control's React Aria module copy to the host at this route scope.
 * Mount above the control's React Aria hooks, including collection roots.
 *
 * @internal
 */
export function BUIRoutingProvider({ children }: { children: ReactNode }) {
  const useRouter = useBUIRouter();
  return useRouter ? (
    <HostRoutingProvider useRouter={useRouter}>{children}</HostRoutingProvider>
  ) : (
    children
  );
}

function HostRoutingProvider({
  children,
  useRouter,
}: {
  children: ReactNode;
  useRouter: () => BUIRouter;
}) {
  const router = useRouter();
  const navigate = useCallback(
    (href: string, options?: BUIRouterOptions) => {
      // React Aria delegates same-origin absolute URLs too. Keep authored
      // absolute URLs browser-owned instead of passing them to an app router.
      if (isBrowserOwnedHref(href)) {
        window.location.assign(href);
      } else {
        router.navigate(href, options);
      }
    },
    [router],
  );

  return (
    <BUIRoutingContext.Provider value={router}>
      <RouterProvider navigate={navigate} useHref={router.resolveHref}>
        {children}
      </RouterProvider>
    </BUIRoutingContext.Provider>
  );
}
