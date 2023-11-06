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

export interface Config {
  /**
   * Configurations for the Bazaar plugin
   */
  bazaar?: {
    /**
     * A list of categorized support item groupings.
     */
    support?: Array<{
      /**
       * The title of the support item grouping.
       * @visibility frontend
       */
      title: string;
      /**
       * An optional icon for the support item grouping.
       * @visibility frontend
       */
      icon?: string;
      /**
       * A list of support links for the Backstage instance inside this grouping.
       */
      links: Array<{
        /** @visibility frontend */
        url: string;
        /** @visibility frontend */
        title?: string;
      }>;
    }>;
  };
}
