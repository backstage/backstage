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

import { Extension } from './createExtension';

/** @public */
export interface PluginOptions {
  id: string;
  extensions?: Extension<unknown>[];
}

/** @public */
export interface BackstagePlugin {
  $$type: '@backstage/BackstagePlugin';
  id: string;
  extensions: Extension<unknown>[];
}

/** @public */
export function createPlugin(options: PluginOptions): BackstagePlugin {
  return {
    ...options,
    $$type: '@backstage/BackstagePlugin',
    extensions: options.extensions ?? [],
  };
}
