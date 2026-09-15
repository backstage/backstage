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

import {
  isExternalTarget,
  sanitizeHref,
  useAppRouting as useInternalAppRouting,
} from '@internal/frontend';
import { useApi } from '../apis/system';
import { appHistoryApiRef } from './AppHistoryApi';
import type { AppLocation, AppNavigateOptions } from './AppLocation';

/**
 * Binds href resolution and navigation to the current page or sub-page.
 *
 * Both functions capture the same route ancestry. Relative targets resolve
 * from that scope, while query-only and hash-only targets use the current
 * location. Hrefs include the deployment basename; navigation targets do not.
 * Requires the new frontend system's {@link appHistoryApiRef}.
 *
 * Pass `navigate` and `createHref` to a React Aria `RouterProvider` as its
 * `navigate` and `useHref` props. Import that provider from the same React Aria
 * installation as its controls, and mount it within the desired page scope.
 * Both operations retain that scope even if descendants establish another one.
 *
 * Absolute URLs use browser navigation. Executable URL schemes are replaced
 * with `about:blank`, matching {@link useHref}.
 *
 * @public
 */
export function useAppRouting(): {
  createHref: (to: string) => string;
  navigate: (to: string, options?: AppNavigateOptions) => void;
  location: AppLocation;
} {
  const routing = useInternalAppRouting(useApi(appHistoryApiRef))!;
  return {
    location: routing.location,
    createHref: to => routing.createHref(sanitizeHref(to)),
    navigate(to, options) {
      const target = sanitizeHref(to);
      if (isExternalTarget(target)) {
        window.location.assign(target);
      } else {
        routing.navigate(target, options);
      }
    },
  };
}
