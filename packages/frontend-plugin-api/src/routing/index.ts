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

export type { AnyRouteRefParams } from './types';
export { createRouteRef, type RouteRef } from './RouteRef';
export { createSubRouteRef, type SubRouteRef } from './SubRouteRef';
export {
  createExternalRouteRef,
  type ExternalRouteRef,
} from './ExternalRouteRef';
export { useRouteRef } from './useRouteRef';
export { useRouteRefParams } from './useRouteRefParams';
// FrameworkLocation / FrameworkNavigateOptions are the adopter-facing types.
export type {
  FrameworkLocation,
  FrameworkNavigateOptions,
} from './FrameworkLocation';
export type { AppHistoryApi } from './AppHistoryApi';
export { appHistoryApiRef } from './AppHistoryApi';
// useAppNavigate is the public react-aria-style navigate hook. Location
// subscription for adopters goes through AppHistoryApi.location$, and
// first-party chrome subscribes with useAppHistoryLocation from
// @internal/frontend — neither is exported from here.
export { useAppNavigate } from './useFrameworkNavigation';
export { useHref } from './useHref';
export {
  useNavigateRouteRef,
  type NavigateRouteRefFunc,
} from './useNavigateRouteRef';
export { RouteLink, type RouteLinkProps } from './RouteLink';
