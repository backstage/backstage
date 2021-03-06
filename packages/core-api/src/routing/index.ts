/*
 * Copyright 2020 Spotify AB
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
  RouteRef,
  AbsoluteRouteRef,
  ConcreteRoute,
  MutableRouteRef,
  ExternalRouteRef,
} from './types';
export { FlatRoutes } from './FlatRoutes';
export { createRouteRef } from './RouteRef';
export { createSubRouteRef } from './SubRouteRef';
export { createExternalRouteRef } from './ExternalRouteRef';
export type { RouteRefConfig } from './RouteRef';
export { useRouteRef } from './hooks';
