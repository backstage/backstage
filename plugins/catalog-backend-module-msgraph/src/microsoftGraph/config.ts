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

import {
  SchedulerServiceTaskScheduleDefinition,
  readSchedulerServiceTaskScheduleDefinitionFromConfig,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { trimEnd } from 'lodash';

const DEFAULT_PROVIDER_ID = 'default';
const DEFAULT_TARGET = 'https://graph.microsoft.com/v1.0';

/**
 * The configuration parameters for a single Microsoft Graph provider.
 *
 * @public
 */
export type MicrosoftGraphProviderConfig = {
  /**
   * Identifier of the provider which will be used i.e. at the location key for ingested entities.
   */
  id: string;

  /**
   * The prefix of the target that this matches on, e.g.
   * "https://graph.microsoft.com/v1.0", with no trailing slash.
   */
  target: string;
  /**
   * The auth authority used.
   *
   * E.g. "https://login.microsoftonline.com"
   */
  authority?: string;
  /**
   * The tenant whose org data we are interested in.
   */
  tenantId: string;
  /**
   * The OAuth client ID to use for authenticating requests.
   * If specified, ClientSecret must also be specified
   */
  clientId?: string;
  /**
   * The OAuth client secret to use for authenticating requests.
   * If specified, ClientId must also be specified
   */
  clientSecret?: string;
  /**
   * The filter to apply to extract users.
   *
   * E.g. "accountEnabled eq true and userType eq 'member'"
   */
  userFilter?: string;
  /**
   * The fields to be fetched on query.
   *
   * E.g. ["id", "displayName", "description"]
   */
  userSelect?: string[];
  /**
   * The "expand" argument to apply to users.
   *
   * E.g. "manager".
   */
  userExpand?: string;

  /**
   * The path to the users endpoint. Defaults to "/users".
   *
   * E.g. "/users"
   */
  userPath?: string;
  /**
   * The filter to apply to extract users by groups memberships.
   *
   * E.g. "displayName eq 'Backstage Users'"
   */
  userGroupMemberFilter?: string;
  /**
   * The search criteria to apply to extract users by groups memberships.
   *
   * E.g. "\"displayName:-team\"" would only match groups which contain '-team'
   */
  userGroupMemberSearch?: string;

  /**
   * The path to the groups endpoint. Defaults to "/groups".
   *
   * E.g. "/groups"
   */
  userGroupMemberPath?: string;

  /**
   * The "expand" argument to apply to groups.
   *
   * E.g. "member".
   */
  groupExpand?: string;
  /**
   * The filter to apply to extract groups.
   *
   * E.g. "securityEnabled eq false and mailEnabled eq true"
   */
  groupFilter?: string;
  /**
   * The search criteria to apply to extract groups.
   *
   * E.g. "\"displayName:-team\"" would only match groups which contain '-team'
   */
  groupSearch?: string;

  /**
   * The fields to be fetched on query.
   *
   * E.g. ["id", "displayName", "description"]
   */
  groupSelect?: string[];

  /**
   * The path to the groups endpoint. Defaults to "/groups".
   *
   * E.g. "/groups"
   */
  groupPath?: string;

  /**
   * Whether to ingest groups that are members of the found/filtered/searched groups.
   * Default value is `false`.
   */
  groupIncludeSubGroups?: boolean;

  /**
   * By default, the Microsoft Graph API only provides the basic feature set
   * for querying. Certain features are limited to advanced query capabilities
   * (see https://docs.microsoft.com/en-us/graph/aad-advanced-queries)
   * and need to be enabled.
   *
   * Some features like `$expand` are not available for advanced queries, though.
   */
  queryMode?: 'basic' | 'advanced';

  /**
   * Set to false to not load user photos.
   * This can be useful for huge organizations.
   */
  loadUserPhotos?: boolean;

  /**
   * Schedule configuration for refresh tasks.
   */
  schedule?: SchedulerServiceTaskScheduleDefinition;
};

/**
 * Parses configuration.
 *
 * @param config - The root of the msgraph config hierarchy
 *
 * @public
 * @deprecated Replaced by not exported `readProviderConfigs` and kept for backwards compatibility only.
 */
export function readMicrosoftGraphConfig(
  config: Config,
): MicrosoftGraphProviderConfig[] {
  const providers: MicrosoftGraphProviderConfig[] = [];
  const providerConfigs = config.getOptionalConfigArray('providers') ?? [];

  for (const providerConfig of providerConfigs) {
    const target = trimEnd(
      providerConfig.getOptionalString('target') ?? DEFAULT_TARGET,
      '/',
    );
    const authority = providerConfig.getOptionalString('authority');

    const tenantId = providerConfig.getString('tenantId');
    const clientId = providerConfig.getOptionalString('clientId');
    const clientSecret = providerConfig.getOptionalString('clientSecret');

    const userExpand = providerConfig.getOptionalString('userExpand');
    const userFilter = providerConfig.getOptionalString('userFilter');
    const userSelect = providerConfig.getOptionalStringArray('userSelect');
    const userGroupMemberFilter = providerConfig.getOptionalString(
      'userGroupMemberFilter',
    );
    const userGroupMemberSearch = providerConfig.getOptionalString(
      'userGroupMemberSearch',
    );
    const groupExpand = providerConfig.getOptionalString('groupExpand');
    const groupFilter = providerConfig.getOptionalString('groupFilter');
    const groupSearch = providerConfig.getOptionalString('groupSearch');

    if (userFilter && userGroupMemberFilter) {
      throw new Error(
        `userFilter and userGroupMemberFilter are mutually exclusive, only one can be specified.`,
      );
    }
    if (userFilter && userGroupMemberSearch) {
      throw new Error(
        `userGroupMemberSearch cannot be specified when userFilter is defined.`,
      );
    }

    const groupSelect = providerConfig.getOptionalStringArray('groupSelect');
    const queryMode = providerConfig.getOptionalString('queryMode');
    if (
      queryMode !== undefined &&
      queryMode !== 'basic' &&
      queryMode !== 'advanced'
    ) {
      throw new Error(`queryMode must be one of: basic, advanced`);
    }

    if (clientId && !clientSecret) {
      throw new Error(
        `clientSecret must be provided when clientId is defined.`,
      );
    }

    if (clientSecret && !clientId) {
      throw new Error(
        `clientId must be provided when clientSecret is defined.`,
      );
    }

    providers.push({
      id: target,
      target,
      authority,
      tenantId,
      clientId,
      clientSecret,
      userExpand,
      userFilter,
      userSelect,
      userGroupMemberFilter,
      userGroupMemberSearch,
      groupExpand,
      groupFilter,
      groupSearch,
      groupSelect,
      queryMode,
    });
  }

  return providers;
}

/**
 * Parses all configured providers.
 *
 * @param config - The root of the msgraph config hierarchy
 *
 * @public
 */
export function readProviderConfigs(
  config: Config,
): MicrosoftGraphProviderConfig[] {
  const providersConfig = config.getOptionalConfig(
    'catalog.providers.microsoftGraphOrg',
  );
  if (!providersConfig) {
    return [];
  }

  if (providersConfig.has('clientId')) {
    // simple/single config variant
    return [readProviderConfig(DEFAULT_PROVIDER_ID, providersConfig)];
  }

  return providersConfig.keys().map(id => {
    const providerConfig = providersConfig.getConfig(id);

    return readProviderConfig(id, providerConfig);
  });
}

/**
 * Parses a single configured provider by id.
 *
 * @param id - the id of the provider to parse
 * @param config - The root of the msgraph config hierarchy
 *
 * @public
 */
export function readProviderConfig(
  id: string,
  config: Config,
): MicrosoftGraphProviderConfig {
  const target = trimEnd(
    config.getOptionalString('target') ?? DEFAULT_TARGET,
    '/',
  );
  const authority = config.getOptionalString('authority');

  const tenantId = config.getString('tenantId');
  const clientId = config.getOptionalString('clientId');
  const clientSecret = config.getOptionalString('clientSecret');

  const userExpand = config.getOptionalString('user.expand');
  const userFilter = config.getOptionalString('user.filter');
  const userSelect = config.getOptionalStringArray('user.select');
  const userPath = config.getOptionalString('user.path') ?? 'users';
  const loadUserPhotos = config.getOptionalBoolean('user.loadPhotos');

  const groupExpand = config.getOptionalString('group.expand');
  const groupFilter = config.getOptionalString('group.filter');
  const groupSearch = config.getOptionalString('group.search');
  const groupSelect = config.getOptionalStringArray('group.select');
  const groupPath = config.getOptionalString('group.path') ?? 'groups';
  const groupIncludeSubGroups = config.getOptionalBoolean(
    'group.includeSubGroups',
  );

  const queryMode = config.getOptionalString('queryMode');
  if (
    queryMode !== undefined &&
    queryMode !== 'basic' &&
    queryMode !== 'advanced'
  ) {
    throw new Error(`queryMode must be one of: basic, advanced`);
  }

  const userGroupMemberFilter = config.getOptionalString(
    'userGroupMember.filter',
  );
  const userGroupMemberSearch = config.getOptionalString(
    'userGroupMember.search',
  );
  const userGroupMemberPath = config.getOptionalString('userGroupMember.path');

  if (userFilter && userGroupMemberFilter) {
    throw new Error(
      `userFilter and userGroupMemberFilter are mutually exclusive, only one can be specified.`,
    );
  }
  if (userFilter && userGroupMemberSearch) {
    throw new Error(
      `userGroupMemberSearch cannot be specified when userFilter is defined.`,
    );
  }

  if (clientId && !clientSecret) {
    throw new Error(`clientSecret must be provided when clientId is defined.`);
  }

  if (clientSecret && !clientId) {
    throw new Error(`clientId must be provided when clientSecret is defined.`);
  }

  const schedule = config.has('schedule')
    ? readSchedulerServiceTaskScheduleDefinitionFromConfig(
        config.getConfig('schedule'),
      )
    : undefined;

  return {
    id,
    target,
    authority,
    clientId,
    clientSecret,
    tenantId,
    userExpand,
    userFilter,
    userSelect,
    userPath,
    loadUserPhotos,
    groupExpand,
    groupFilter,
    groupSearch,
    groupSelect,
    groupPath,
    groupIncludeSubGroups,
    queryMode,
    userGroupMemberFilter,
    userGroupMemberSearch,
    userGroupMemberPath,
    schedule,
  };
}
