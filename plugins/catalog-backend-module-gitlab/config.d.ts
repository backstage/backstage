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
export interface Config {
  /**
   * GitLabOrgReaderProcessor configuration
   */
  gitlabOrg?: {
    /**
     * Default provider configuration used as the base for each target.
     *
     * Values set in this block can be overriden through the provider config.
     */
    defaults?: {
      /**
       * Default user ingestion configuration.
       *
       * Setting this option to false will disable user ingestion by
       * default. Extended user ingestion configuration can be set by
       * providing an object with your config.
       */
      users?: {
        /**
         * Enable or disable user ingestion.
         */
        ingest?: boolean;
        /**
         * A list of user IDs to exclude during ingestion from all targets.
         *
         * The default value for this option is an empty array ([]).
         * E.g. ['1001', '1002']
         */
        exclude?: string[];
        /**
         * Default user prefix.
         *
         * The default value is the empty string ('').
         * E.g. 'dev-'
         */
        prefix?: string;
      };
      /**
       * Default group ingestion configuration.
       *
       * Setting this option to false will disable group ingestion by
       * default. The default group ingestion configuration can be overriden
       * by providing an object with your config.
       */
      groups?: {
        /**
         * Enable or disable group ingestion.
         */
        ingest?: boolean;
        /**
         * A list of group IDs to exclude during ingestion from the target.
         *
         * The default value for this option is the empty array ([]).
         * E.g. ['1001', '1002']
         */
        exclude?: string[];
        /**
         * Default group prefix.
         *
         * The default value is the empty string.
         * E.g. 'dev-'
         */
        prefix?: string;
        /**
         * Name delimiter for nested subgroups.
         *
         * The hierarchy of nested subgroups is represented in the name using the
         * delimiter. The default value is a period ('.').
         *
         * For example, the name for the `subgroup` entity under `group`
         * becomes `group.subgroup` using `.` as the delimiter.
         */
        delimiter?: string;
      };
    };
    /**
     * Provider configuration for each target to ingest from.
     */
    providers: Array<{
      /**
       * The URL to a GitLab group or subgroup namespace.
       *
       * Please see the GitLab documentation for more information on namespaces:
       * https://docs.gitlab.com/ee/user/group/#namespaces
       *
       * Examples:
       * - https://gitlab.com/gitlab-org/delivery
       * - https://self-hosted.example.com/group/subgroup
       */
      target: string;
      /**
       * User ingestion configuration.
       *
       * Setting this option to false will disable user ingestion for the target.
       * The default user ingestion configuration can be overriden by providing an
       * object with your config.
       */
      users?: {
        /**
         * Enable or disable user ingestion.
         */
        ingest?: boolean;
        /**
         * A list of user IDs to exclude during ingestion from the target.
         *
         * The default value for this option is an empty array ([]).
         * E.g. ['1001', '1002']
         */
        exclude?: string[];
        /**
         * Prefix the user's name.
         *
         * The default value is the empty string ('').
         * E.g. 'external-'
         */
        prefix?: string;
      };
      /**
       * Group ingestion configuration.
       *
       * Setting this option to false will disable group ingestion for the target.
       * The default group ingestion configuration can be overriden by providing an
       * object with your config.
       */
      groups?: {
        /**
         * Enable or disable group ingestion.
         */
        ingest?: boolean;
        /**
         * A list of group IDs to exclude during ingestion from the target.
         *
         * The default value for this option is the empty array ([]).
         * E.g. ['1001', '1002']
         */
        exclude?: string[];
        /**
         * Prefix the group's name.
         *
         * The default value is the empty string.
         * E.g. 'external-'
         */
        prefix?: string;
        /**
         * Name delimiter for nested subgroups.
         *
         * The hierarchy of nested subgroups is represented in the name using the
         * delimiter. The default value is a period ('.').
         *
         * For example, the name for the `subgroup` entity under `group` becomes
         * `group.subgroup` using `.` as the delimiter.
         */
        delimiter?: string;
      };
    }>;
  };
}
