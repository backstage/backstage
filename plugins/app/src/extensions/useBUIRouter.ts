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
  appHistoryApiRef,
  routeResolutionApiRef,
  useApi,
  useAppNode,
  useAppLocation,
} from '@backstage/frontend-plugin-api';
import { BUIRouter } from '@backstage/ui';

/** Binds each BUI control to the routing scope where it renders. */
export function useBUIRouter(): BUIRouter {
  const history = useApi(appHistoryApiRef);
  const routes = useApi(routeResolutionApiRef);
  const node = useAppNode();
  const location = useAppLocation();
  return {
    navigate(to, options) {
      const target = routes.resolveTarget({
        to,
        pathname: history.location.pathname,
        node,
      });
      history.navigate(target, options);
    },
    resolveHref: to =>
      history.createHref(
        routes.resolveTarget({ to, pathname: location.pathname, node }),
      ),
    pathname: new URL(
      history.createHref(location.pathname),
      'http://backstage.local',
    ).pathname,
  };
}
