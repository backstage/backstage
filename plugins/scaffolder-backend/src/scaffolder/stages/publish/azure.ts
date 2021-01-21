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
import { initRepoAndPush } from './helpers';
import { AzureIntegrationConfig } from '@backstage/integration';
import parseGitUrl from 'git-url-parse';
import { getPersonalAccessTokenHandler, WebApi } from 'azure-devops-node-api';

export class AzurePublisher implements PublisherBase {
  static async fromConfig(config: AzureIntegrationConfig) {
    if (!config.token) {
      return undefined;
    }
    const authHandler = getPersonalAccessTokenHandler(config.token);
    const webApi = new WebApi(config.host, authHandler);
    const azureClient = await webApi.getGitApi();
    return new AzurePublisher({ token: config.token, client: azureClient });
  }

  constructor(private readonly config: { token: string; client: IGitApi }) {}

  async publish({
    values,
    directory,
    logger,
  }: PublisherOptions): Promise<PublisherResult> {
    const { owner, name } = parseGitUrl(values.storePath);

    const remoteUrl = await this.createRemote({
      project: owner,
      name,
    });

    const catalogInfoUrl = `${remoteUrl}?path=%2Fcatalog-info.yaml`;

    await initRepoAndPush({
      dir: directory,
      remoteUrl,
      auth: {
        username: 'notempty',
        password: this.config.token,
      },
      logger,
    });

    return { remoteUrl, catalogInfoUrl };
  }

  private async createRemote(opts: { name: string; project: string }) {
    const { name, project } = opts;
    const createOptions: GitRepositoryCreateOptions = { name };
    const repo = await this.config.client.createRepository(
      createOptions,
      project,
    );

    return repo.remoteUrl || '';
  }
}
