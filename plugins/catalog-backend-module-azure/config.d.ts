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

import { SchedulerServiceTaskScheduleDefinitionConfig } from '@backstage/backend-plugin-api';

export interface Config {
  catalog?: {
    /**
     * List of provider-specific options and attributes
     */
    providers?: {
      /**
       * AzureDevopsEntityProvider configuration
       */
      azureDevOps?: {
        [name: string]: {
          /**
           * (Optional) The DevOps host; leave empty for `dev.azure.com`, otherwise set to your self-hosted instance host.
           */
          host: string;
          /**
           * (Required) Your organization slug.
           */
          organization: string;
          /**
           * (Required) Your project slug.
           */
          project: string;
          /**
           * (Optional) The repository name. Wildcards are supported as show on the examples above.
           * If not set, all repositories will be searched.
           */
          repository?: string;
          /**
           * (Optional) Where to find catalog-info.yaml files. Wildcards are supported.
           * If not set, defaults to /catalog-info.yaml.
           */
          path?: string;
          /**
           * (Optional) TaskScheduleDefinition for the refresh.
           */
          schedule?: SchedulerServiceTaskScheduleDefinitionConfig;
        };
      };
    };
  };
}
