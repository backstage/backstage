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

import { TaskScheduleDefinition } from '@backstage/backend-tasks';

/**
 * Represents the configuration for the Backstage.
 */
export interface Config {
  /**
   * Configuration for the catalog.
   */
  catalog?: {
    /**
     * Configuration for the providers.
     */
    providers?: {
      /**
       * Puppet entity provider configuration. Uses "default" as default ID for the single config variant.
       */
      puppet?: ProviderConfig | Record<string, ProviderConfig>;
    };
  };
}

/**
 * Configuration of {@link PuppetDbEntityProvider}.
 */
interface ProviderConfig {
  /**
   * (Required) The host of PuppetDB API instance.
   */
  host: string;
  /**
   * (Optional) PQL query to filter PuppetDB nodes.
   */
  query?: string;
  /**
   * (Optional) Task schedule definition for the refresh.
   */
  schedule?: TaskScheduleDefinition;
}
