/*
 * Copyright 2022 The Backstage Authors
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

export interface Config {
  catalog?: {
    /**
     * List of provider-specific options and attributes
     */
    providers?: {
      /**
       * GerritEntityProvider configuration
       *
       * Maps provider id with configuration.
       */
      gerrit?: {
        [name: string]: {
          /**
           * (Required) The host of the Gerrit integration to use.
           */
          host: string;
          /**
           * (Required) The query to use for the "List Projects" API call. Used to limit the
           * scope of the projects that the provider tries to ingest.
           */
          query: string;
          /**
           * (Optional) Branch.
           * The branch where the provider will try to find entities. Uses the default branch where HEAD points to.
           */
          branch?: string;
          /**
           * (Optional) Path where the catalog YAML manifest file is expected in the repository.
           * Can contain glob patterns supported by minimatch.
           * Defaults to "catalog-info.yaml".
           */
          catalogPath?: string;
          /**
           * (Optional) TaskScheduleDefinition for the discovery.
           */
          schedule?: SchedulerServiceTaskScheduleDefinition;
        };
      };
    };
  };
}
