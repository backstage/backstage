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

import { TaskScheduleDefinitionConfig } from '@backstage/backend-tasks';

export interface Config {
  catalog?: {
    providers?: {
      /**
       * GitlabDiscoveryEntityProvider configuration
       */
      gitlab?: Record<
        string,
        {
          /**
           * (Required) Gitlab's host name.
           */
          host: string;
          /**
           * (Optional) Gitlab's group[/subgroup] where the discovery is done.
           * If not defined the whole project will be scanned.
           */
          group?: string;
          /**
           * (Optional) Default branch to read the catalog-info.yaml file.
           * If not set, 'master' will be used.
           */
          branch?: string;
          /**
           * (Optional) The name used for the catalog file.
           * If not set, 'catalog-info.yaml' will be used.
           */
          entityFilename?: string;
          /**
           * (Optional) TaskScheduleDefinition for the refresh.
           */
          schedule?: TaskScheduleDefinitionConfig;
        }
      >;
    };
  };
}
