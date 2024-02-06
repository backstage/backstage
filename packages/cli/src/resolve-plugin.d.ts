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

/**
 * @see https://github.com/webpack/webpack/blob/bca4ee1cc24dfa227ae222a78324237fa4d219d7/declarations/WebpackOptions.d.ts#L1632-L1641
 */
export interface ResolvePluginInstance {
  /**
   * The run point of the plugin, required method.
   */
  apply: (resolver: import('enhanced-resolve').Resolver) => void;
}
