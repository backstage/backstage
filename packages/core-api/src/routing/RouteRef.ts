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

import { RouteRef, ExternalRouteRef, routeRefType } from './types';
import { IconComponent } from '../icons';

// TODO(Rugvip): Remove this once we get rid of the deprecated fields, it's not exported
export type RouteRefConfig<Params extends { [param in string]: string }> = {
  params?: Array<keyof Params>;
  path?: string;
  icon?: IconComponent;
  title: string;
};

class RouteRefBaseBase {
  constructor(type: string, id: string) {
    this.toString = () => `routeRef{type=${type},id=${id}}`;
  }
}

export class RouteRefImpl<
  Params extends { [param in string]: string }
> extends RouteRefBaseBase {
  readonly [routeRefType] = 'absolute';

  constructor(private readonly config: RouteRefConfig<Params>) {
    super('absolute', config.title);
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
}

type OptionalParams<
  Params extends { [param in string]: string }
> = Params[keyof Params] extends never ? undefined : Params;

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
}): RouteRef<Params> {
  return new RouteRefImpl<Params>(config);
}

export class ExternalRouteRefImpl<
  Optional extends boolean
> extends RouteRefBaseBase {
  readonly [routeRefType] = 'external';

  constructor(id: string, readonly optional: Optional) {
    super('external', id);
  }
}

export function createExternalRouteRef<
  Optional extends boolean = false
>(options: {
  /**
   * An identifier for this route, used to identify it in error messages
   */
  id: string;

  /**
   * The parameters that will be provided to the external route reference.
   */
  params?: ParamKey[];

  /**
   * Whether or not this route is optional, defaults to false.
   *
   * Optional external routes are not required to be bound in the app, and
   * if they aren't, `useRouteRef` will return `undefined`.
   */
  optional?: Optional;
}): ExternalRouteRef<Optional> {
  return new ExternalRouteRefImpl<Optional>(
    options.id,
    Boolean(options.optional) as Optional,
  );
}
