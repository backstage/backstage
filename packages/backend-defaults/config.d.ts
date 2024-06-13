/*
 * Copyright 2020 The Backstage Authors
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
   * Options used by the default discovery service.
   */
  discovery?: {
    /**
     * A list of target baseUrls and the associated plugins.
     */
    endpoints: Array<{
      /**
       * The target base URL to use for the plugin.
       *
       * Can be either a string or an object with internal and external keys.
       * Targets with `{{pluginId}}` or `{{ pluginId }} in the URL will be replaced with the plugin ID.
       */
      target: string | { internal: string; external: string };
      /**
       * Array of plugins which use the target base URL.
       */
      plugins: string[];
    }>;
  };
}
