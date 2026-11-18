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

import { type AppNavigate } from '@backstage/frontend-plugin-api';
import type { mockApis } from './mockApis';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { createAppHistory } from '../../../frontend-app-api/src/routing/AppHistory';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { createMemoryHistoryBackend } from '../../../frontend-app-api/src/routing/HistoryBackend';

/** Creates the memory-backed implementation used by mockApis.appHistory. @internal */
export function createMockAppHistory(
  options: NonNullable<Parameters<typeof mockApis.appHistory>[0]> = {},
) {
  const {
    initialLocation = '/',
    navigate: navigateImpl,
    basename = '',
  } = options;

  const instance = createAppHistory({
    history: createMemoryHistoryBackend({ initialEntries: [initialLocation] }),
    basename,
  });
  const navigateCalls: Array<{
    to: string | number;
    options?: Parameters<AppNavigate>[1];
  }> = [];
  const navigate = instance.navigate.bind(instance);

  return Object.assign(instance, {
    navigateCalls,
    navigate(to: string | number, navOptions?: Parameters<AppNavigate>[1]) {
      if (typeof to === 'number') {
        navigateCalls.push({ to });
        navigate(to);
        (navigateImpl as ((delta: number) => void) | undefined)?.(to);
      } else {
        navigateCalls.push({ to, options: navOptions });
        navigate(to, navOptions);
        // Preserve call arity for assertions on optional arguments.
        if (arguments.length < 2) {
          navigateImpl?.(to);
        } else {
          navigateImpl?.(to, navOptions);
        }
      }
    },
  });
}
