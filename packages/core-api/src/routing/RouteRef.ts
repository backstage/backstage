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

import { RouteRefConfig } from './types';

export class AbsoluteRouteRef {
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
}

export function createRouteRef(config: RouteRefConfig): AbsoluteRouteRef {
  return new AbsoluteRouteRef(config);
}

// TODO(Rugvip): Added for backwards compatibility, remove once old usage is gone
// We may want to avoid exporting the AbsoluteRouteRef itself though, and consider
// a different model for how to create sub routes, just avoid this
export type MutableRouteRef = AbsoluteRouteRef;
