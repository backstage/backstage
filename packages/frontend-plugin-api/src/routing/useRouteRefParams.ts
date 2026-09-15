/*
 * Copyright 2021 The Backstage Authors
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
import { useParams } from 'react-router-dom';
import {
  APP_ROOT_PATH,
  OpaqueRouteRef,
  OpaqueSubRouteRef,
  joinRoutePath,
  matchPath,
  useAppHistoryLocation,
  usePageMountChain,
  type PageMount,
} from '@internal/frontend';
import { AnyRouteRefParams } from './types';
import { RouteRef } from './RouteRef';
import { SubRouteRef } from './SubRouteRef';
import { useApiHolder } from '../apis/system';
import { appHistoryApiRef } from './AppHistoryApi';

/**
 * The param names a route ref declares, which is what the caller asked for and
 * what its `Params` type promises.
 *
 * A ref of neither kind (or one from a future version this build does not
 * know) declares nothing rather than throwing: this hook runs during render,
 * where an error takes out the whole page.
 */
function declaredParamNames(
  routeRef: RouteRef<any> | SubRouteRef<any>,
): string[] {
  if (OpaqueSubRouteRef.isType(routeRef)) {
    return OpaqueSubRouteRef.toInternal(routeRef).getParams();
  }
  if (OpaqueRouteRef.isType(routeRef)) {
    return OpaqueRouteRef.toInternal(routeRef).getParams();
  }
  return [];
}

/**
 * The params a single route pattern binds at the current location.
 *
 * Matched against the location rather than against the mount's own base path,
 * because a base path stops where the match's pattern stops spelling segments
 * out: a page mounted at `/docs/*` has `/docs` as its base, and only the
 * location carries the splat tail. The base path is the fallback for the one
 * render where the two disagree — the app has navigated away and the page has
 * not unmounted yet — where the mount is the more honest of the two answers.
 */
function patternParams(
  routePattern: string,
  basePath: string,
  pathname: string,
): Record<string, string> | undefined {
  const match =
    matchPath(routePattern, pathname, false) ??
    matchPath(routePattern, basePath, false);
  return match?.params;
}

/**
 * Every param the mounts this content is rendered inside bind, outermost mount
 * first so that a deeper mount wins a name its page also binds — the same
 * precedence React Router's own `useParams` applies across its match stack.
 *
 * A sub-route ref additionally contributes the pattern it describes: its
 * parent's, with its own path appended. That is what answers for a page that
 * routes below itself rather than through framework sub-pages, where the only
 * mount published is the page's own and the sub-route's params appear nowhere
 * else. It is tried last because it is the most specific pattern of the set.
 */
function resolveParams(
  routeRef: RouteRef<any> | SubRouteRef<any>,
  mountChain: readonly PageMount[],
  pathname: string,
): Record<string, string> {
  const params: Record<string, string> = {};

  for (const mount of mountChain) {
    Object.assign(
      params,
      mount.params ??
        patternParams(mount.routePattern, mount.basePath, pathname),
    );
  }

  if (OpaqueSubRouteRef.isType(routeRef)) {
    const { path: subPath } = OpaqueSubRouteRef.toInternal(routeRef);
    for (const mount of mountChain) {
      const routePattern = joinRoutePath(mount.routePattern, subPath);
      Object.assign(params, matchPath(routePattern, pathname, false)?.params);
    }
  }

  return params;
}

/**
 * React hook for retrieving dynamic params from the current URL.
 *
 * @remarks
 *
 * With AppHistory, reads params from the matched extension ancestry, including
 * ordinary nested route-bearing extensions. No router adapter is required.
 * Without AppHistory, reads the old frontend's React Router params.
 *
 * The route ref says which params the caller wants: the returned object has
 * exactly the keys the ref declares, so its shape matches the ref's `Params`
 * type rather than carrying whatever else the surrounding patterns happened to
 * bind. A declared param the current location does not bind is present with the
 * value `undefined` — the way React Router's own `useParams` reports an
 * optional segment the location left out, and the value the previous
 * `useParams`-backed implementation of this hook returned for one. The splat
 * `*` is never among the keys, because no route ref declares it.
 *
 * @param routeRef - Ref of the route whose params are wanted.
 * @public
 */
export function useRouteRefParams<Params extends AnyRouteRefParams>(
  routeRef: RouteRef<Params> | SubRouteRef<Params>,
): Params {
  const appHistory = useApiHolder().get(appHistoryApiRef);
  // Subscribes to the app history: the params are read out of the location, so
  // they have to be recomputed when the app navigates.
  const location = useAppHistoryLocation(appHistory);
  const mountChain = usePageMountChain();
  const legacyParams = useParams();
  const pathname = location?.pathname ?? APP_ROOT_PATH.pathname;

  return useMemo(() => {
    const resolved = appHistory
      ? resolveParams(routeRef, mountChain, pathname)
      : legacyParams;
    // Written by walking the declared names rather than by copying across
    // whatever resolved, so a name the location did not bind still lands as a
    // key — holding `undefined`, which is what React Router reports for one.
    const params: Record<string, string | undefined> = {};
    for (const name of declaredParamNames(routeRef)) {
      params[name] = resolved[name];
    }
    return params as Params;
  }, [appHistory, routeRef, mountChain, pathname, legacyParams]);
}
