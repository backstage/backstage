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

export interface Config {
  /**
   * @visibility frontend
   */
  dynamicPlugins?: {};

  app?: {
    /**
     * @visibility frontend
     */
    experimental?: {
      /**
       * Enables deferred loading of the plugins of dynamic frontend plugin
       * remotes. A deferrable plugin is loaded the first time one of its
       * pages or elements is rendered, rather than before the app starts.
       *
       * Whether a plugin can be deferred is decided when the remote is built,
       * by static analysis of its source code. Remotes without such a
       * manifest are loaded before the app starts.
       *
       * Set `exclude` to a list of package names to always load the plugins
       * of those packages before the app starts.
       *
       * @visibility frontend
       */
      deferredRemotes?:
        | boolean
        | {
            /**
             * @visibility frontend
             */
            exclude?: string[];
          };
    };
  };
}
