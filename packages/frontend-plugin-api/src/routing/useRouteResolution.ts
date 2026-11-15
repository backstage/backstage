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

import { useApiHolder } from '../apis/system';
import { useAppNode } from '../components/AppNodeProvider';
import {
  routeResolutionApiRef,
  type RouteResolutionMatch,
} from '../apis/definitions/RouteResolutionApi';
import { appHistoryApiRef } from './AppHistoryApi';
import { useAppHistoryLocation } from '@internal/frontend';

const EMPTY_RESULT: { matches: readonly RouteResolutionMatch[] } = {
  matches: [],
};

/**
 * Resolves the current app node's routing ancestry against the app location.
 *
 * Matches are ordered from outermost to innermost. Extensions without a path
 * inherit their ancestors' scope. Returns no matches outside an extension
 * boundary or when no route resolution API is available. Without app history,
 * resolves against the app root.
 * For a different pathname or the complete matched branch, use
 * {@link RouteResolutionApi.resolvePath} directly.
 *
 * @public
 */
export function useRouteResolution(): {
  matches: readonly RouteResolutionMatch[];
} {
  const node = useAppNode();
  const apis = useApiHolder();
  const location = useAppHistoryLocation(apis.get(appHistoryApiRef));
  const routes = apis.get(routeResolutionApiRef);
  return node && routes
    ? routes.resolvePath({ pathname: location?.pathname ?? '/', node })
    : EMPTY_RESULT;
}
