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

import { useMemo } from 'react';
import {
  appHistoryApiRef,
  useApi,
  useRouteResolution,
} from '@backstage/frontend-plugin-api';
import { BUIRouter } from '@backstage/ui';
import {
  isExternalTarget,
  sanitizeHref,
  useAppRouting,
} from '@internal/frontend';

/** Binds each BUI control to the routing scope where it renders. */
export function useBUIRouter(): BUIRouter {
  const { matches } = useRouteResolution();
  const basePaths = useMemo(
    () =>
      matches
        .filter((match, index) => index === 0 || match.contributesPath)
        .map(match => match.basePath),
    [matches],
  );
  const routing = useAppRouting(useApi(appHistoryApiRef), basePaths)!;
  return {
    navigate(to, options) {
      const target = sanitizeHref(to);
      if (isExternalTarget(target)) {
        window.location.assign(target);
      } else {
        routing.navigate(target, options);
      }
    },
    resolveHref: to => routing.createHref(sanitizeHref(to)),
    pathname: new URL(
      routing.createHref(routing.location.pathname),
      'http://backstage.local',
    ).pathname,
  };
}
