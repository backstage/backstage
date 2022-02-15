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
import { trimEnd } from 'lodash';
import {
  GitLabIntegrationConfig,
  GitLabIntegration,
} from '@backstage/integration';
import { Config } from '@backstage/config';

/**
 * Configuration for a single GitLab Org. provider target.
 *
 * @public
 */
export type GitLabOrgProviderConfig = {
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
  users: {
    /**
     * Enable or disable user ingestion.
     */
    ingest: boolean;
    /**
     * A list of user IDs to exclude during ingestion from the target.
     *
     * The default value for this option is an empty array ([]).
     * E.g. ['1001', '1002']
     */
    exclude: string[];
    /**
     * Prefix the user's name.
     *
     * The default value is the empty string ('').
     * E.g. 'external-'
     */
    prefix: string;
  };
  /**
   * Group ingestion configuration.
   *
   * Setting this option to false will disable group ingestion for the target.
   * The default group ingestion configuration can be overriden by providing an
   * object with your config.
   */
  groups: {
    /**
     * Enable or disable group ingestion.
     */
    ingest: boolean;
    /**
     * A list of group IDs to exclude during ingestion from the target.
     *
     * The default value for this option is the empty array ([]).
     * E.g. ['1001', '1002']
     */
    exclude: string[];
    /**
     * Prefix the group's name.
     *
     * The default value is the empty string.
     * E.g. 'external-'
     */
    prefix: string;
    /**
     * Name delimiter for nested subgroups.
     *
     * The hierarchy of nested subgroups is represented in the name using the
     * delimiter. The default value is a period ('.').
     *
     * For example, the name for the `subgroup` entity under `group` becomes
     * `group.subgroup` using `.` as the delimiter.
     */
    delimiter: string;
  };
};

const DEFAULT_PREFIX = '';
const DEFAULT_DELIMITER = '.';

export function readGitLabOrgProviderConfig(
  config: Config,
): GitLabOrgProviderConfig[] {
  const pluginConfig = config.getOptionalConfig('gitlabOrg');
  if (pluginConfig === undefined) {
    return [];
  }
  return pluginConfig.getConfigArray('providers').map(providerConfig => ({
    target: trimEnd(providerConfig.getString('target'), '/'),
    users: {
      ingest:
        providerConfig.getOptionalBoolean('users.ingest') ??
        pluginConfig.getOptionalBoolean('defaults.users.ingest') ??
        true,
      exclude:
        providerConfig.getOptionalStringArray('users.exclude') ??
        pluginConfig.getOptionalStringArray('defaults.users.exclude') ??
        [],
      prefix:
        providerConfig.getOptionalString('users.prefix') ??
        pluginConfig.getOptionalString('defaults.users.prefix') ??
        DEFAULT_PREFIX,
    },
    groups: {
      ingest:
        providerConfig.getOptionalBoolean('groups.ingest') ??
        pluginConfig.getOptionalBoolean('defaults.groups.ingest') ??
        true,
      exclude:
        providerConfig.getOptionalStringArray('groups.exclude') ??
        pluginConfig.getOptionalStringArray('defaults.groups.exclude') ??
        [],
      prefix:
        providerConfig.getOptionalString('groups.prefix') ??
        pluginConfig.getOptionalString('defaults.groups.prefix') ??
        DEFAULT_PREFIX,
      delimiter:
        providerConfig.getOptionalString('groups.delimiter') ??
        pluginConfig.getOptionalString('defaults.groups.delimiter') ??
        DEFAULT_DELIMITER,
    },
  }));
}

type FindIntegrationByURL = (
  url: string | URL,
) => GitLabIntegration | undefined;

export function groupByIntegrationConfig(
  byUrl: FindIntegrationByURL,
  providerConfigs: GitLabOrgProviderConfig[],
): Map<GitLabIntegrationConfig, GitLabOrgProviderConfig[]> {
  const mapping = new Map<GitLabIntegrationConfig, GitLabOrgProviderConfig[]>();

  for (const config of providerConfigs) {
    const integrationConfig = getIntegrationConfig(byUrl, config.target);
    const providers = mapping.get(integrationConfig);
    if (providers) {
      providers.push(config);
    } else {
      mapping.set(integrationConfig, [config]);
    }
  }
  return mapping;
}

function getIntegrationConfig(
  byUrl: FindIntegrationByURL,
  target: string,
): GitLabIntegrationConfig {
  const config = byUrl(target)?.config;
  if (!config) {
    throw new Error(
      `There is no GitLab integration for ${target}. Please add a configuration for an integration.`,
    );
  }
  return config;
}
