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
    processors?: {
      /**
       * GithubMultiOrgReaderProcessor configuration
       */
      githubMultiOrg?: {
        /**
         * The configuration parameters for each GitHub org to process.
         */
        orgs: Array<{
          /**
           * The name of the GitHub org to process.
           */
          name: string;
          /**
           * The namespace of the group created for this org.
           *
           * Defaults to org name if omitted.
           */
          groupNamespace?: string;

          /**
           * The namespace of the users created from this org.
           *
           * Defaults to empty string if omitted.
           */
          userNamespace?: string;
        }>;
      };
    };

    providers?: {
      /**
       * GithubEntityProvider configuration
       *
       * Uses "default" as default id for the single config variant.
       */
      github?:
        | {
            /**
             * (Optional) The hostname of your GitHub Enterprise instance.
             * Default: `github.com`.
             */
            host?: string;
            /**
             * (Required) Name of your organization account/workspace.
             */
            organization: string;
            /**
             * (Optional) Path where to look for `catalog-info.yaml` files.
             * You can use wildcards - `*` or `**` - to search the path and/or the filename
             * Default: `/catalog-info.yaml`.
             */
            catalogPath?: string;
            /**
             * (Optional) Filter configuration.
             */
            filters?: {
              /**
               * (Optional) String used to filter results based on the branch name.
               */
              branch?: string;
              /**
               * (Optional) Regular expression used to filter results based on the repository name.
               */
              repository?: string;
              /**
               * (Optional) GitHub topic-based filters.
               */
              topic?: {
                /**
                 * (Optional) An array of strings used to filter in results based on their associated GitHub topics.
                 * If configured, only repositories with one (or more) topic(s) present in the inclusion
                 * filter will be ingested.
                 *
                 * If `include` and `exclude` are used, `exclude` has higher priority.
                 */
                include?: string[];
                /**
                 * (Optional) An array of strings used to filter out results based on their associated GitHub topics.
                 * If configured, all repositories _except_ those with one (or more) topics(s) present in
                 * the exclusion filter will be ingested.
                 *
                 * If `include` and `exclude` are used, `exclude` has higher priority.
                 */
                exclude?: string[];
              };
            };
            /**
             * (Optional) TaskScheduleDefinition for the refresh.
             */
            schedule?: TaskScheduleDefinitionConfig;
          }
        | Record<
            string,
            {
              /**
               * (Optional) The hostname of your GitHub Enterprise instance.
               * Default: `github.com`.
               */
              host?: string;
              /**
               * (Required) Name of your organization account/workspace.
               */
              organization: string;
              /**
               * (Optional) Path where to look for `catalog-info.yaml` files.
               * You can use wildcards - `*` or `**` - to search the path and/or the filename
               * Default: `/catalog-info.yaml`.
               */
              catalogPath?: string;
              /**
               * (Optional) Filter configuration.
               */
              filters?: {
                /**
                 * (Optional) String used to filter results based on the branch name.
                 */
                branch?: string;
                /**
                 * (Optional) Regular expression used to filter results based on the repository name.
                 */
                repository?: string;
                /**
                 * (Optional) GitHub topic-based filters.
                 */
                topic?: {
                  /**
                   * (Optional) An array of strings used to filter in results based on their associated GitHub topics.
                   * If configured, only repositories with one (or more) topic(s) present in the inclusion
                   * filter will be ingested.
                   *
                   * If `include` and `exclude` are used, `exclude` has higher priority.
                   */
                  include?: string[];
                  /**
                   * (Optional) An array of strings used to filter out results based on their associated GitHub topics.
                   * If configured, all repositories _except_ those with one (or more) topics(s) present in
                   * the exclusion filter will be ingested.
                   *
                   * If `include` and `exclude` are used, `exclude` has higher priority.
                   */
                  exclude?: string[];
                };
              };
              /**
               * (Optional) TaskScheduleDefinition for the refresh.
               */
              schedule?: TaskScheduleDefinitionConfig;
            }
          >;
    };
  };
}
