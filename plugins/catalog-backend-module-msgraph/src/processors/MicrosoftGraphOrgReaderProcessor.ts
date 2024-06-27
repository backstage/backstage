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
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  processingResult,
} from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  GroupTransformer,
  MicrosoftGraphClient,
  MicrosoftGraphProviderConfig,
  OrganizationTransformer,
  readMicrosoftGraphConfig,
  readMicrosoftGraphOrg,
  UserTransformer,
} from '../microsoftGraph';
import { LoggerService } from '@backstage/backend-plugin-api';

/**
 * Extracts teams and users out of the Microsoft Graph API.
 *
 * @public
 * @deprecated Use the MicrosoftGraphOrgEntityProvider instead.
 */
export class MicrosoftGraphOrgReaderProcessor implements CatalogProcessor {
  private readonly providers: MicrosoftGraphProviderConfig[];
  private readonly logger: LoggerService;
  private readonly userTransformer?: UserTransformer;
  private readonly groupTransformer?: GroupTransformer;
  private readonly organizationTransformer?: OrganizationTransformer;

  static fromConfig(
    config: Config,
    options: {
      logger: LoggerService;
      userTransformer?: UserTransformer;
      groupTransformer?: GroupTransformer;
      organizationTransformer?: OrganizationTransformer;
    },
  ) {
    const c = config.getOptionalConfig('catalog.processors.microsoftGraphOrg');
    return new MicrosoftGraphOrgReaderProcessor({
      ...options,
      providers: c ? readMicrosoftGraphConfig(c) : [],
    });
  }

  constructor(options: {
    providers: MicrosoftGraphProviderConfig[];
    logger: LoggerService;
    userTransformer?: UserTransformer;
    groupTransformer?: GroupTransformer;
    organizationTransformer?: OrganizationTransformer;
  }) {
    options.logger.warn(
      'MicrosoftGraphOrgReaderProcessor is deprecated. Please use MicrosoftGraphOrgEntityProvider instead. More info at https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-msgraph/CHANGELOG.md#040-next1',
    );
    this.providers = options.providers;
    this.logger = options.logger;
    this.userTransformer = options.userTransformer;
    this.groupTransformer = options.groupTransformer;
    this.organizationTransformer = options.organizationTransformer;
  }

  getProcessorName(): string {
    return 'MicrosoftGraphOrgReaderProcessor';
  }

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'microsoft-graph-org') {
      return false;
    }

    const provider = this.providers.find(p =>
      location.target.startsWith(p.target),
    );
    if (!provider) {
      throw new Error(
        `There is no Microsoft Graph Org provider that matches ${location.target}. Please add a configuration entry for it under catalog.processors.microsoftGraphOrg.providers.`,
      );
    }

    // Read out all the raw data
    const startTimestamp = Date.now();
    this.logger.info('Reading Microsoft Graph users and groups');

    // We create a client each time as we need one that matches the specific provider
    const client = MicrosoftGraphClient.create(provider);
    const { users, groups } = await readMicrosoftGraphOrg(
      client,
      provider.tenantId,
      {
        userExpand: provider.userExpand,
        userFilter: provider.userFilter,
        userSelect: provider.userSelect,
        loadUserPhotos: provider.loadUserPhotos,
        userGroupMemberFilter: provider.userGroupMemberFilter,
        userGroupMemberSearch: provider.userGroupMemberSearch,
        groupExpand: provider.groupExpand,
        groupFilter: provider.groupFilter,
        groupSearch: provider.groupSearch,
        groupSelect: provider.groupSelect,
        queryMode: provider.queryMode,
        userTransformer: this.userTransformer,
        groupTransformer: this.groupTransformer,
        organizationTransformer: this.organizationTransformer,
        logger: this.logger,
      },
    );

    const duration = ((Date.now() - startTimestamp) / 1000).toFixed(1);
    this.logger.debug(
      `Read ${users.length} users and ${groups.length} groups from Microsoft Graph in ${duration} seconds`,
    );

    // Done!
    for (const group of groups) {
      emit(processingResult.entity(location, group));
    }
    for (const user of users) {
      emit(processingResult.entity(location, user));
    }

    return true;
  }
}
