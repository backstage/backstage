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
import { GitApi } from 'azure-devops-node-api/GitApi';
import { GitRepositoryCreateOptions } from 'azure-devops-node-api/interfaces/GitInterfaces';
import { JsonValue } from '@backstage/config';
import { RequiredTemplateValues } from '../templater';
import { initRepoAndPush } from './helpers';

export class AzurePublisher implements PublisherBase {
  private readonly client: GitApi;
  private readonly token: string;

  constructor(client: GitApi, token: string) {
    this.client = client;
    this.token = token;
  }

  async publish({
    values,
    directory,
    logger,
  }: PublisherOptions): Promise<PublisherResult> {
    const remoteUrl = await this.createRemote(values);
    const catalogInfoUrl = `${remoteUrl}?path=%2Fcatalog-info.yaml`;

    await initRepoAndPush({
      dir: directory,
      remoteUrl,
      auth: {
        username: 'notempty',
        password: this.token,
      },
      logger,
    });

    return { remoteUrl, catalogInfoUrl };
  }

  private async createRemote(
    values: RequiredTemplateValues & Record<string, JsonValue>,
  ) {
    const [project, name] = values.storePath.split('/');

    const createOptions: GitRepositoryCreateOptions = { name };
    const repo = await this.client.createRepository(createOptions, project);

    return repo.remoteUrl || '';
  }
}
