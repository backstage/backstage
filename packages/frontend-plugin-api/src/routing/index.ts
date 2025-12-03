/*
 * Copyright 2020 The Backstage Authors
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

export type {
  Location,
  Path,
  To,
  NavigateOptions,
  NavigateFunction,
  RouteObject,
  RouteMatch,
  LinkProps,
  NavLinkProps,
  RouteProps,
} from './routerTypes';

export {
  useLocation,
  useParams,
  useNavigate,
  useSearchParams,
  useResolvedPath,
  useHref,
} from './hooks';

// Note: Routes and Route are NOT exported here because react-router's
// Routes component inspects children types and rejects wrappers.
// Access them via: const { Routes, Route } = useApi(routerApiRef);
export { Link, NavLink, Outlet } from './components';

export type { AnyRouteRefParams } from './types';
export { createRouteRef, type RouteRef } from './RouteRef';
export { createSubRouteRef, type SubRouteRef } from './SubRouteRef';
export {
  createExternalRouteRef,
  type ExternalRouteRef,
} from './ExternalRouteRef';
export { useRouteRef } from './useRouteRef';
export { useRouteRefParams } from './useRouteRefParams';
