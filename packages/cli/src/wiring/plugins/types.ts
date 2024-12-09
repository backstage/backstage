/*
 * Copyright 2024 The Backstage Authors
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

import { CliFeature } from '../features/types';
import { ServiceRef } from '../services/types';

/** @ignore */
type DepsToInstances<
  TDeps extends {
    [key in string]: ServiceRef<unknown>;
  },
> = {
  [key in keyof TDeps]: TDeps[key] extends ServiceRef<unknown>
    ? TDeps[key]['T']
    : never;
};

/**
 * The callbacks passed to the `register` method of a backend plugin.
 *
 * @public
 */
export interface CliPluginRegistrationPoints {
  registerInit<
    TDeps extends {
      [name in string]: ServiceRef<unknown>;
    },
  >(options: {
    deps: TDeps;
    init(deps: DepsToInstances<TDeps>): Promise<void>;
  }): void;
}

export interface CliPlugin {
  id: string;
  register: (registry: CliPluginRegistrationPoints) => Promise<void>;
  $$type: '@backstage/CliFeature';
}

/**
 * @public
 */
export interface InternalPlugin extends CliFeature {
  version: 'v1';
  featureType: 'plugin';
  description: string;
  id: string;
  register: (env: CliPluginRegistrationPoints) => Promise<void>;
}
