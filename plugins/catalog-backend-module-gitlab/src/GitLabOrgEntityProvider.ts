/*
 * Copyright 2021 The Backstage Authors
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
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-backend';

import {
  GitLabClient,
  getGroups,
  readUsers,
  groupByIntegrationConfig,
  readGitLabOrgProviderConfig,
  GitLabOrgProviderConfig,
} from './lib';

/**
 * Extracts teams and users out of GitLab group or GitLab EE instance.
 *
 * @alpha
 */
export class GitLabOrgEntityProvider implements EntityProvider {
  private connection?: EntityProviderConnection;

  static fromConfig(
    configRoot: Config,
    options: {
      id: string;
      logger: Logger;
    },
  ) {
    const integrations = ScmIntegrations.fromConfig(configRoot);

    const providerConfigs = readGitLabOrgProviderConfig(configRoot);
    if (providerConfigs.length === 0) {
      throw new Error(
        'There are no providers configured for gitlab-org, nothing will be ingested. ' +
          'Please add configuration under the gitlabOrg key.',
      );
    }

    return new GitLabOrgEntityProvider({
      id: options.id,
      logger: options.logger,
      integrations,
      providerConfigs,
    });
  }

  constructor(
    private options: {
      id: string;
      logger: Logger;
      integrations: ScmIntegrations;
      providerConfigs: GitLabOrgProviderConfig[];
    },
  ) {}

  getProviderName(): string {
    return `gitlab-org:${this.options.id}`;
  }

  async connect(connection: EntityProviderConnection) {
    this.connection = connection;
  }

  async read() {
    if (!this.connection) {
      throw new Error(
        `The ${this.getProviderName()} provider is not initialized, EntityProviderConnection missing.`,
      );
    }
    const providers = groupByIntegrationConfig(
      this.options.integrations.gitlab.byUrl,
      this.options.providerConfigs,
    );
    for (const [clientConfig, providerConfigs] of providers) {
      for (const config of providerConfigs) {
        const client = new GitLabClient({
          logger: this.options.logger,
          config: clientConfig,
        });

        if (config.users.ingest) {
          this.options.logger.debug(`Ingesting users from ${config.target}`);
          await readUsers(client, config.target, {});
        }

        if (config.groups.ingest) {
          this.options.logger.debug(`Ingesting groups from ${config.target}`);
          await getGroups(client, '', config.groups.delimiter);
        }
      }
    }
  }
}
