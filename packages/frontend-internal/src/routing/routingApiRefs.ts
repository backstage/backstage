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

import type {
  ApiRef,
  AppHistoryApi,
  RouteResolutionApi,
} from '@backstage/frontend-plugin-api';
import { OpaqueApiRef } from '../apis/OpaqueApiRef';

/**
 * The `ApiRef` of {@link AppHistoryApi}.
 *
 * @internal
 */
export const appHistoryApiRef: ApiRef<AppHistoryApi, 'core.app-history'> & {
  readonly $$type: '@backstage/ApiRef';
} = OpaqueApiRef.createInstance('v1', {
  id: 'core.app-history',
  pluginId: 'app',
  T: undefined as unknown as AppHistoryApi,
  toString() {
    return 'apiRef{core.app-history}';
  },
}) as ApiRef<AppHistoryApi, 'core.app-history'> & {
  readonly $$type: '@backstage/ApiRef';
};

/**
 * The `ApiRef` of {@link RouteResolutionApi}.
 *
 * @internal
 */
export const routeResolutionApiRef: ApiRef<
  RouteResolutionApi,
  'core.route-resolution'
> & {
  readonly $$type: '@backstage/ApiRef';
} = OpaqueApiRef.createInstance('v1', {
  id: 'core.route-resolution',
  pluginId: 'app',
  T: undefined as unknown as RouteResolutionApi,
  toString() {
    return 'apiRef{core.route-resolution}';
  },
}) as ApiRef<RouteResolutionApi, 'core.route-resolution'> & {
  readonly $$type: '@backstage/ApiRef';
};
