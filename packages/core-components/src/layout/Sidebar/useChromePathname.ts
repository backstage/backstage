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

import { useInRouterContext, useLocation } from 'react-router-dom';
import { useOptionalNavigationController } from '../../hooks/useOptionalNavigationController';
import { useOptionalNavigationControllerLocation } from '../../hooks/useOptionalNavigationControllerLocation';

/**
 * App chrome pathname that prefers the framework navigation controller when
 * present (NFS), and falls back to React Router's `useLocation` (OFS).
 *
 * When a navigation controller is registered, React Router hooks are not
 * called — chrome pathname resolution does not require a root RR projection.
 * (Sidebar `Link` / BUI path-matching may still need RR until those are
 * migrated.)
 *
 * @internal
 */
export function useChromePathname(): string {
  const navigationController = useOptionalNavigationController();
  const frameworkLocation =
    useOptionalNavigationControllerLocation(navigationController);
  const inRouter = useInRouterContext();

  // Gate on controller presence (not snapshot truthiness) so NFS never calls
  // useLocation. Router / API presence are stable for a component's lifetime
  // (same pattern as BUI's useResolvedHref / Link's useResolvedPath), keeping
  // hook call count stable.
  if (navigationController) {
    return frameworkLocation?.pathname ?? '/';
  }
  if (!inRouter) {
    return '/';
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useLocation().pathname;
}
