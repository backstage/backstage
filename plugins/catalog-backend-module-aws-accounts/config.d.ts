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

import { SchedulerServiceTaskScheduleDefinitionConfig } from '@backstage/backend-plugin-api';

export interface Config {
  catalog?: {
    /**
     * List of provider-specific options and attributes
     */
    providers?: {
      /**
       * AWSOrganizationCatalogModuleConfig configuration
       */
      'aws-org'?: {
        /**
         * Config for AWS organizations
         */
        [name: string]: {
          /**
           * AccountIds typically of your AWS organization. Used to source credentials to list accounts.
           */
          accountId: string[];
          /**
           * TaskScheduleDefinition for the refresh.
           */
          schedule: SchedulerServiceTaskScheduleDefinitionConfig;
        };
      };
    };
  };
}
