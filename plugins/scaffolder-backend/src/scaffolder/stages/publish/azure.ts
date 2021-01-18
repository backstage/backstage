/*
 * Copyright 2020 Spotify AB
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

import { PublisherBase, PublisherOptions, PublisherResult } from './types';
import { IGitApi } from 'azure-devops-node-api/GitApi';
import { GitRepositoryCreateOptions } from 'azure-devops-node-api/interfaces/GitInterfaces';
import { Config } from '@backstage/config';
import { initRepoAndPush } from './helpers';
import { Logger } from 'winston';
import {
  AzureIntegrationConfig,
  readAzureIntegrationConfigs,
} from '@backstage/integration';
import gitUrlParse from 'git-url-parse';
import { getPersonalAccessTokenHandler, WebApi } from 'azure-devops-node-api';

export class AzurePublisher implements PublisherBase {
  private readonly integrations: AzureIntegrationConfig[];
  private readonly apiBaseUrl?: string;
  private readonly token?: string;

  constructor(config: Config, { logger }: { logger: Logger }) {
    this.integrations = readAzureIntegrationConfigs(
      config.getOptionalConfigArray('integrations.azure') ?? [],
    );

    if (!this.integrations.length) {
      logger.warn(
        'Integrations for Azure in Scaffolder are not set. This will cause errors in a future release. Please migrate to using integrations config and specifying tokens under hostnames',
      );
    }

    this.token = config.getOptionalString('scaffolder.azure.api.token');
    if (this.token) {
      logger.warn(
        "DEPRECATION: Using the token format under 'scaffolder.github.api.token' will not be respected in future releases. Please consider using integrations config instead",
      );
    }

    this.apiBaseUrl = config.getOptionalString('scaffolder.azure.api.baseUrl');

    if (this.apiBaseUrl) {
      logger.warn(
        "DEPRECATION: Using the apiBaseUrl format under 'scaffolder.azure.api.baseUrl' will not be respected in future releases. Please consider using integrations config instead",
      );
    }
  }

  async publish({
    values,
    directory,
    logger,
  }: PublisherOptions): Promise<PublisherResult> {
    const { resource: host, owner, name } = gitUrlParse(values.storePath);

    const token = this.getToken(host);
    if (!token) {
      throw new Error('No token provided to create the remote repository');
    }
    const baseUrl = this.getBaseUrl(host);
    if (!baseUrl) {
      throw new Error('No baseUrl provided to create the remote repository');
    }

    const authHandler = getPersonalAccessTokenHandler(token);
    const webApi = new WebApi(baseUrl, authHandler);
    const azureClient = await webApi.getGitApi();

    const remoteUrl = await this.createRemote(azureClient, {
      project: owner,
      name,
    });
    const catalogInfoUrl = `${remoteUrl}?path=%2Fcatalog-info.yaml`;

    await initRepoAndPush({
      dir: directory,
      remoteUrl,
      auth: {
        username: 'notempty',
        password: token,
      },
      logger,
    });

    return { remoteUrl, catalogInfoUrl };
  }

  private async createRemote(
    client: IGitApi,
    opts: { name: string; project: string },
  ) {
    const { name, project } = opts;
    const createOptions: GitRepositoryCreateOptions = { name };
    const repo = await client.createRepository(createOptions, project);

    return repo.remoteUrl || '';
  }

  private getToken(host: string): string | undefined {
    return this.token || this.integrations.find(c => c.host === host)?.token;
  }

  private getBaseUrl(host: string): string | undefined {
    return (
      this.apiBaseUrl || this.integrations.find(c => c.host === host)?.host
    );
  }
}
