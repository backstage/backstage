/*
 * Copyright 2023 The Backstage Authors
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
  BackstagePlugin,
  Extension,
  ExtensionOverrides,
} from '@backstage/frontend-plugin-api';
import { readAppExtensionsConfig } from './readAppExtensionsConfig';
import { resolveAppGraph } from './resolveAppGraph';
import { resolveAppNodeSpecs } from './resolveAppNodeSpecs';
import { AppGraph } from './types';
import { Config } from '@backstage/config';
import { instantiateAppNodeTree } from './instantiateAppNodeTree';

/** @internal */
export interface CreateAppGraphOptions {
  features: (BackstagePlugin | ExtensionOverrides)[];
  builtinExtensions: Extension<unknown>[];
  config: Config;
}

/** @internal */
export function createAppGraph(options: CreateAppGraphOptions): AppGraph {
  const appGraph = resolveAppGraph(
    'core',
    resolveAppNodeSpecs({
      features: options.features,
      builtinExtensions: options.builtinExtensions,
      parameters: readAppExtensionsConfig(options.config),
      forbidden: new Set(['core']),
    }),
  );
  instantiateAppNodeTree(appGraph.root);
  return appGraph;
}
