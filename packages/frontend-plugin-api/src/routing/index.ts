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
export {
  createRouteDescriptor,
  resolveRouteDescriptorLoader,
  type CreateRouteDescriptorOptions,
  type RouteDescriptor,
  type RouteDescriptorLoader,
} from './RouteDescriptor';
export {
  splitRouteDescriptorPath,
  isRouteDescriptorSplatSegment,
  isRouteDescriptorParamSegment,
  getRouteDescriptorParamName,
  isSplatRouteDescriptorPath,
  collectRouteDescriptorParams,
  joinRouteDescriptorPaths,
} from './routeDescriptorPath';
export { useRouteRef } from './useRouteRef';
export { useRouteRefParams } from './useRouteRefParams';
export type {
  RoutingLocation,
  RoutingContract,
  RoutingNavigateOptions,
  RoutingBlocker,
  RoutingBlockerAction,
  RoutingBlockerTransition,
} from './RoutingContract';
export type {
  CreateContractOptions,
  NavigationControllerApi,
} from './NavigationControllerApi';
export { navigationControllerApiRef } from './NavigationControllerApi';
export {
  RoutingContractContext,
  useRoutingContract,
} from './RoutingContractContext';
export {
  LazyDescriptorElement,
  type LazyDescriptorElementProps,
} from './LazyDescriptorElement';
export {
  useFrameworkLocation,
  useFrameworkNavigate,
  useOptionalFrameworkNavigate,
  useCompatNavigate,
} from './useFrameworkNavigation';
export {
  useNavigateRouteRef,
  type NavigateRouteRefFunc,
} from './useNavigateRouteRef';
export { RouteLink, type RouteLinkProps } from './RouteLink';
export {
  AppRouteSwitch,
  type AppRouteSwitchProps,
  type AppRouteRedirect,
} from './AppRouteSwitch';
export { RouteTable, type RouteTableMatch } from './RouteTable';
