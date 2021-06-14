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

import {
  RouteRef,
  SubRouteRef,
  ExternalRouteRef,
  routeRefType,
  AnyParams,
  ParamKeys,
} from './types';
import { IconComponent } from '../icons/types';

export { createRouteRef } from '@backstage/core-plugin-api';

// TODO(Rugvip): Remove this in the next breaking release, it's exported but unused
export type RouteRefConfig<Params extends AnyParams> = {
  params?: ParamKeys<Params>;
  path?: string;
  icon?: IconComponent;
  title: string;
};

export function isRouteRef<Params extends AnyParams>(
  routeRef:
    | RouteRef<Params>
    | SubRouteRef<Params>
    | ExternalRouteRef<Params, any>,
): routeRef is RouteRef<Params> {
  return routeRef[routeRefType] === 'absolute';
}
