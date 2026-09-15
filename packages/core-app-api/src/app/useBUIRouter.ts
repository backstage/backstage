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

import { useContext } from 'react';
import {
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import type { BUIRouter } from '@backstage/ui';
import { resolveTo } from '@remix-run/router';

/** Adapts the legacy app's React Router at each consuming BUI control. */
export function useBUIRouter(): BUIRouter {
  const navigate = useNavigate();
  const location = useLocation();
  const { basename, navigator, future } = useContext(UNSAFE_NavigationContext);
  const { matches } = useContext(UNSAFE_RouteContext);
  const contributing = matches.filter(
    (match, index) => index === 0 || !!match.route.path,
  );
  // Match useResolvedPath's route ancestry, including its optional splat behavior.
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
      // Match browser-owned URLs without importing the new frontend system.
      const normalized = href
        .replace(/[\t\n\r]/g, '')
        // eslint-disable-next-line no-control-regex
        .replace(/^[\x00-\x20]+/, '');
      if (/^(?:[a-z][a-z\d+.-]*:|[/\\]{2})/i.test(normalized)) {
        return href;
      }
      const path = resolveTo(href, bases, location.pathname);
      return navigator.createHref({
        ...path,
        pathname: withBasename(path.pathname),
      });
    },
  };
}
