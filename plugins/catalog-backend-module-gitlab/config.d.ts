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
           * If true, the provider will only ingest users that are part of the configured group.
           */
          restrictUsersToGroup?: boolean;
          /**
           * (Optional) Default branch to read the catalog-info.yaml file.
           * If not set, 'master' will be used.
           */
          branch?: string;
          /**
           * If no `branch` is configured and there is no default branch defined at the project as well, this fallback is used
           * to discover catalog files.
           * Defaults to: `master`
           */
          fallbackBranch?: string;
          /**
           * Defaults to `catalog-info.yaml`
           */
          catalogFile?: string;
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
          groupPattern?: string | string[];
          /**
           * Specifies the types of group membership relations that should be included when ingesting data.
           *
           * The following values are valid:
           * - 'DIRECT': Direct members of the group. This is the default relation and is always included.
           * - 'INHERITED': Members inherited from parent (ascendant) groups.
           * - 'DESCENDANTS': Members from child (descendant) groups.
           * - 'SHARED_FROM_GROUPS': Members shared from other groups.
           *
           * See: https://docs.gitlab.com/ee/api/graphql/reference/#groupmemberrelation
           *
           * If the `relations` array is provided in the app-config.yaml, it should contain any combination of the above values.
           * The 'DIRECT' relation is automatically included and cannot be excluded, even if not specified.
           */
          relations?: string[];
          /**
           * Enable org ingestion
           * Defaults to `false`
           */
          orgEnabled?: boolean;
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
           * If true, users without a seat will be included in the catalog.
           * Group/Application Access Tokens are still filtered out but you might find service accounts or other users without a seat.
           * Defaults to `false`
           */
          includeUsersWithoutSeat?: boolean;
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
