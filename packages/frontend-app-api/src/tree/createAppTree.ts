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

import { Extension, FrontendFeature } from '@backstage/frontend-plugin-api';
import { readAppExtensionsConfig } from './readAppExtensionsConfig';
import { resolveAppTree } from './resolveAppTree';
import { resolveAppNodeSpecs } from './resolveAppNodeSpecs';
import { AppTree } from '@backstage/frontend-plugin-api';
import { Config } from '@backstage/config';
import { instantiateAppNodeTree } from './instantiateAppNodeTree';

/** @internal */
export interface CreateAppTreeOptions {
  features: FrontendFeature[];
  builtinExtensions: Extension<unknown>[];
  config: Config;
}

/** @internal */
export function createAppTree(options: CreateAppTreeOptions): AppTree {
  const tree = resolveAppTree(
    'app',
    resolveAppNodeSpecs({
      features: options.features,
      builtinExtensions: options.builtinExtensions,
      parameters: readAppExtensionsConfig(options.config),
      forbidden: new Set(['app']),
    }),
  );
  instantiateAppNodeTree(tree.root);
  return tree;
}
