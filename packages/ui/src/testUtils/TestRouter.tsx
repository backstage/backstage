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

import { useContext, type ComponentProps } from 'react';
import {
  MemoryRouter,
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { resolveTo } from '@remix-run/router';
import { BUIProvider } from '../provider/BUIProvider';
import type { BUIRouter } from '../provider/BUIRouter';
import { isBrowserOwnedHref } from '../utils/linkUtils';

/** Explicit React Router adapter for component tests and stories. */
export function useTestRouter(): BUIRouter {
  const navigate = useNavigate();
  const location = useLocation();
  const { basename, navigator, future } = useContext(UNSAFE_NavigationContext);
  const { matches } = useContext(UNSAFE_RouteContext);
  const contributing = matches.filter(
    (match, index) => index === 0 || match.route.path,
  );
  const bases = contributing.map((match, index) =>
    future.v7_relativeSplatPath && index === contributing.length - 1
      ? match.pathname
      : match.pathnameBase,
  );
  const withBasename = (pathname: string) =>
    pathname === '/' ? basename : `${basename.replace(/\/$/, '')}${pathname}`;
  return {
    navigate,
    pathname: withBasename(location.pathname),
    resolveHref(href) {
      if (isBrowserOwnedHref(href)) return href;
      const path = resolveTo(href, bases, location.pathname);
      return navigator.createHref({
        ...path,
        pathname: withBasename(path.pathname),
      });
    },
  };
}

/** A React Aria href hook for tests that configure their own provider. */
export function useTestHref(href: string): string {
  return useTestRouter().resolveHref(href);
}

/** A memory router with explicitly configured BUI navigation. */
export function TestRouter({
  children,
  ...props
}: ComponentProps<typeof MemoryRouter>) {
  return (
    <MemoryRouter {...props}>
      <BUIProvider useRouter={useTestRouter}>{children}</BUIProvider>
    </MemoryRouter>
  );
}
