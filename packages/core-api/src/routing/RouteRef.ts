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

import { ConcreteRoute, ref, resolveRoute, RouteRefConfig } from './types';
import { generatePath } from 'react-router-dom';

type SubRouteConfig = {
  path: string;
};

export class SubRouteRef<T extends { [name in string]: string }> {
  constructor(
    private readonly parent: ConcreteRoute,
    private readonly config: SubRouteConfig,
  ) {}

  [ref]() {
    return this;
  }

  link(params: T): ConcreteRoute {
    const selfRef = this as unknown;

    return {
      [ref]: () => selfRef,
      [resolveRoute]: (path: string) => {
        const ownPart = generatePath(this.config.path, params);
        const parentPart = this.parent[resolveRoute](path);
        return parentPart + ownPart;
      },
    };
  }
}

export class AbsoluteRouteRef implements ConcreteRoute {
  constructor(private readonly config: RouteRefConfig) {}

  get icon() {
    return this.config.icon;
  }

  // TODO(Rugvip): Remove this, routes are looked up via the registry instead
  get path() {
    return this.config.path;
  }

  get title() {
    return this.config.title;
  }

  createSubRoute<T extends { [name in string]: string }>(
    config: SubRouteConfig,
  ) {
    return new SubRouteRef<T>(this, config);
  }

  [ref]() {
    return this;
  }

  [resolveRoute](path: string) {
    return path;
  }
}

export function createRouteRef(config: RouteRefConfig): AbsoluteRouteRef {
  return new AbsoluteRouteRef(config);
}
