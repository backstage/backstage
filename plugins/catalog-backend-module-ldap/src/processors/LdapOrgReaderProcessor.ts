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
import { Logger } from 'winston';
import {
  GroupTransformer,
  LdapClient,
  LdapProviderConfig,
  readLdapConfig,
  readLdapOrg,
  UserTransformer,
} from '../ldap';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  LocationSpec,
  processingResult,
} from '@backstage/plugin-catalog-backend';

/**
 * Extracts teams and users out of an LDAP server.
 *
 * @public
 */
export class LdapOrgReaderProcessor implements CatalogProcessor {
  private readonly providers: LdapProviderConfig[];
  private readonly logger: Logger;
  private readonly groupTransformer?: GroupTransformer;
  private readonly userTransformer?: UserTransformer;

  static fromConfig(
    configRoot: Config,
    options: {
      logger: Logger;
      groupTransformer?: GroupTransformer;
      userTransformer?: UserTransformer;
    },
  ) {
    // TODO(freben): Deprecate the old catalog.processors.ldapOrg config
    const config =
      configRoot.getOptionalConfig('ldap') ||
      configRoot.getOptionalConfig('catalog.processors.ldapOrg');
    return new LdapOrgReaderProcessor({
      ...options,
      providers: config ? readLdapConfig(config) : [],
    });
  }

  constructor(options: {
    providers: LdapProviderConfig[];
    logger: Logger;
    groupTransformer?: GroupTransformer;
    userTransformer?: UserTransformer;
  }) {
    this.providers = options.providers;
    this.logger = options.logger;
    this.groupTransformer = options.groupTransformer;
    this.userTransformer = options.userTransformer;
  }

  getProcessorName(): string {
    return 'LdapOrgReaderProcessor';
  }

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'ldap-org') {
      return false;
    }

    const provider = this.providers.find(p => location.target === p.target);
    if (!provider) {
      throw new Error(
        `There is no LDAP configuration that matches "${location.target}". Please add a configuration entry for it under "ldap.providers".`,
      );
    }

    // Read out all of the raw data
    const startTimestamp = Date.now();
    this.logger.info('Reading LDAP users and groups');

    // Be lazy and create the client each time; even though it's pretty
    // inefficient, we usually only do this once per entire refresh loop and
    // don't have to worry about timeouts and reconnects etc.
    const client = await LdapClient.create(
      this.logger,
      provider.target,
      provider.bind,
      provider.tls,
    );
    const { users, groups } = await readLdapOrg(
      client,
      provider.users,
      provider.groups,
      {
        groupTransformer: this.groupTransformer,
        userTransformer: this.userTransformer,
        logger: this.logger,
      },
    );

    const duration = ((Date.now() - startTimestamp) / 1000).toFixed(1);
    this.logger.debug(
      `Read ${users.length} LDAP users and ${groups.length} LDAP groups in ${duration} seconds`,
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
