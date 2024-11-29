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

import { SchedulerServiceTaskScheduleDefinition } from '@backstage/backend-plugin-api';

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
       * PuppetDB Entity Provider configuration. Uses "default" as default ID for the single config variant.
       */
      puppetdb?:
        | {
            /**
             * (Required) The base URL of PuppetDB API instance.
             */
            baseUrl: string;
            /**
             * (Optional) PQL query to filter PuppetDB nodes.
             */
            query?: string;
            /**
             * (Optional) Task schedule definition for the refresh.
             */
            schedule?: SchedulerServiceTaskScheduleDefinition;
          }
        | {
            [name: string]: {
              /**
               * (Required) The base URL of PuppetDB API instance.
               */
              baseUrl: string;
              /**
               * (Optional) PQL query to filter PuppetDB nodes.
               */
              query?: string;
              /**
               * (Optional) Task schedule definition for the refresh.
               */
              schedule?: SchedulerServiceTaskScheduleDefinition;
            };
          };
    };
  };
}
