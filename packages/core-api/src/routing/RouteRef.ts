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
  OptionalParams,
} from './types';
import { IconComponent } from '../icons';

// TODO(Rugvip): Remove this once we get rid of the deprecated fields, it's not exported
export type RouteRefConfig<Params extends AnyParams> = {
  params?: ParamKeys<Params>;
  path?: string;
  icon?: IconComponent;
  title: string;
};

export class RouteRefImpl<Params extends AnyParams>
  implements RouteRef<Params> {
  readonly [routeRefType] = 'absolute';

  constructor(private readonly config: RouteRefConfig<Params>) {}

  get params(): ParamKeys<Params> {
    return this.config.params as any;
  }

  get icon() {
    return this.config.icon;
  }

  // TODO(Rugvip): Remove this, routes are looked up via the registry instead
  get path() {
    return this.config.path ?? '';
  }

  get title() {
    return this.config.title;
  }

  toString() {
    return `routeRef{type=absolute,id=${this.config.title}}`;
  }
}

export function createRouteRef<
  // Params is the type that we care about and the one to be embedded in the route ref.
  // For example, given the params ['name', 'kind'], Params will be {name: string, kind: string}
  Params extends { [param in ParamKey]: string },
  // ParamKey is here to make sure the Params type properly has its keys narrowed down
  // to only the elements of params. Defaulting to never makes sure we end up with
  // Param = {} if the params array is empty.
  ParamKey extends string = never
>(config: {
  params?: ParamKey[];
  /** @deprecated Route refs no longer decide their own path */
  path?: string;
  /** @deprecated Route refs no longer decide their own icon */
  icon?: IconComponent;
  /** @deprecated Route refs no longer decide their own title */
  title: string;
}): RouteRef<OptionalParams<Params>> {
  return new RouteRefImpl({
    ...config,
    params: (config.params ?? []) as ParamKeys<OptionalParams<Params>>,
  });
}

export function isRouteRef<Params extends AnyParams>(
  routeRef:
    | RouteRef<Params>
    | SubRouteRef<Params>
    | ExternalRouteRef<Params, any>,
): routeRef is RouteRef<Params> {
  return routeRef[routeRefType] === 'absolute';
}
