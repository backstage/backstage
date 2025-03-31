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
    providers?: {
      /**
       * GitlabDiscoveryEntityProvider configuration
       */
      gitlab?: {
        [name: string]: {
          /**
           * (Required) Gitlab's host name.
           */
          host: string;
          /**
           * (Optional) Gitlab's group[/subgroup] where the discovery is done.
           * If not defined the whole instance will be scanned.
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
          schedule?: SchedulerServiceTaskScheduleDefinitionConfig;
          /**
           * (Optional) RegExp for the Project Name Pattern
           */
          projectPattern?: string;
          /**
           * (Optional) RegExp for the User Name Pattern
           */
          userPattern?: string;
          /**
           * (Optional) RegExp for the Group Name Pattern
           */
          groupPattern?: string;
          /**
           * (Optional) Skip forked repository
           */
          skipForkedRepos?: boolean;
          /**
           * (Optional) Include archived repository
           */
          includeArchivedRepos?: boolean;
          /**
           * (Optional) A list of strings containing the paths of the repositories to skip
           * Should be in the format group/subgroup/repo, with no leading or trailing slashes.
           */
          excludeRepos?: string[];

          /**
           * (Optional) If true, limit by repositories that the current user is a member of.
           * See: https://docs.gitlab.com/api/projects/#list-projects
           */
          membership?: boolean;

          /**
           * (Optional) List of topic names. Limit results to repositories that match all of given topics.
           * See: https://docs.gitlab.com/api/projects/#list-projects
           */
          topics?: string;
        };
      };
    };
  };
}
