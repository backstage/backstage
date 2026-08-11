/*
 * Copyright 2025 The Backstage Authors
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

export { OpaqueRouteRef } from './OpaqueRouteRef';
export { OpaqueSubRouteRef } from './OpaqueSubRouteRef';
export { OpaqueExternalRouteRef } from './OpaqueExternalRouteRef';
export {
  PageMountProvider,
  usePageMount,
  type PageMount,
} from './PageMountContext';
export {
  APP_ROOT_PATH,
  climbPageBase,
  createPath,
  normalizeBasePath,
  pageBasePaths,
  parsePath,
  resolveAppPath,
  resolvePath,
  useAppBasePath,
  type AppPath,
  type AppTo,
} from './AppRouting';
export { useAppHistoryLocation } from './useAppHistoryLocation';
export {
  appHistoryMetadataSymbol,
  readAppHistoryMetadata,
  type AppHistoryAction,
  type AppHistoryMetadata,
  type AppHistoryWithMetadata,
} from './AppHistoryMetadata';
export {
  createAppHistoryRouter,
  type AdapterLocation,
  type AdapterPathMatch,
  type AdapterTo,
  type AppHistoryRouterResult,
  type CreateAppHistoryRouterOptions,
  type NavigationContextExtras,
  type ReactRouterAdapterBindings,
} from './createAppHistoryRouter';
export { isExternalTarget } from './isExternalTarget';
export { sanitizeHref } from './sanitizeHref';
export {
  compilePath,
  expandOptionalSegments,
  matchPath,
  routePriority,
  generatePath,
  type CompiledPath,
  type PathMatch,
} from './routePattern';
export {
  RouteTable,
  type RouteTableEntry,
  type RouteTableMatch,
  type RouteTableSubPageMatch,
} from './RouteTable';
export {
  AppRouteSwitch,
  SubPageSelectionProvider,
  useSubPageSelection,
  type AppRouteSwitchProps,
  type AppRouteRedirect,
  type SubPageSelection,
} from './AppRouteSwitch';
