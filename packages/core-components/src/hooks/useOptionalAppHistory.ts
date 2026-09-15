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

import { useApiHolder } from '@backstage/core-plugin-api';
import {
  appHistoryApiRef,
  type AppHistoryApi,
} from '@backstage/frontend-plugin-api';

/**
 * Returns the framework app history when the new frontend system has
 * registered one, and `undefined` otherwise (old frontend system apps, or
 * isolated tests without an app history).
 *
 * This is the one place chrome asks "is the framework the routing authority
 * here?". The answer is then handed to the `useApp*` hooks in
 * `@internal/frontend`, which cannot resolve it themselves without closing an
 * import cycle back into `@backstage/frontend-plugin-api`.
 *
 * @internal
 */
export function useOptionalAppHistory(): AppHistoryApi | undefined {
  return useApiHolder().get(appHistoryApiRef);
}
