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

import { useAppHistoryLocation } from '@internal/frontend';
import { useApiHolder } from '../apis/system';
import { appHistoryApiRef } from './AppHistoryApi';
import type { AppLocation } from './AppLocation';
import { LocationContext, useRouterContext } from './reactRouterContext';

/**
 * Subscribes to the app location without requiring a page router.
 *
 * The pathname is app-absolute and excludes the deployment basename, even
 * inside a scoped page adapter. In the old frontend system, this returns
 * the current React Router location instead. State is the value supplied
 * during navigation; it is not the browser's private history metadata.
 *
 * @public
 */
export function useAppLocation(): AppLocation {
  const history = useApiHolder().get(appHistoryApiRef);
  const location = useAppHistoryLocation(history);
  const legacyLocation = useRouterContext(LocationContext)?.location;
  const result = history ? location : legacyLocation;
  if (!result) {
    throw new Error(
      'useAppLocation requires either an app history or a React Router context',
    );
  }
  return result;
}
