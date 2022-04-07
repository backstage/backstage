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

import { Config } from '@backstage/config';
import { trimEnd } from 'lodash';

/**
 * The configuration parameters for a single Microsoft Graph provider.
 *
 * @public
 */
export type MicrosoftGraphProviderConfig = {
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
   */
  clientId: string;
  /**
   * The OAuth client secret to use for authenticating requests.
   */
  clientSecret: string;
  /**
   * The filter to apply to extract users.
   *
   * E.g. "accountEnabled eq true and userType eq 'member'"
   */
  userFilter?: string;
  /**
   * The "expand" argument to apply to users.
   *
   * E.g. "manager"
   */
  userExpand?: string;
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
   * The "expand" argument to apply to groups.
   *
   * E.g. "member"
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
   * By default, the Microsoft Graph API only provides the basic feature set
   * for querying. Certain features are limited to advanced query capabilities
   * (see https://docs.microsoft.com/en-us/graph/aad-advanced-queries)
   * and need to be enabled.
   *
   * Some features like `$expand` are not available for advanced queries, though.
   */
  queryMode?: 'basic' | 'advanced';
};

/**
 * Parses configuration.
 *
 * @param config - The root of the msgraph config hierarchy
 *
 * @public
 */
export function readMicrosoftGraphConfig(
  config: Config,
): MicrosoftGraphProviderConfig[] {
  const providers: MicrosoftGraphProviderConfig[] = [];
  const providerConfigs = config.getOptionalConfigArray('providers') ?? [];

  for (const providerConfig of providerConfigs) {
    const target = trimEnd(providerConfig.getString('target'), '/');

    const authority = providerConfig.getOptionalString('authority')
      ? trimEnd(providerConfig.getOptionalString('authority'), '/')
      : 'https://login.microsoftonline.com';
    const tenantId = providerConfig.getString('tenantId');
    const clientId = providerConfig.getString('clientId');
    const clientSecret = providerConfig.getString('clientSecret');

    const userExpand = providerConfig.getOptionalString('userExpand');
    const userFilter = providerConfig.getOptionalString('userFilter');
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

    providers.push({
      target,
      authority,
      tenantId,
      clientId,
      clientSecret,
      userExpand,
      userFilter,
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
