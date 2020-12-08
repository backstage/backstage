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
import { Gitlab } from '@gitbeaker/core';
import { pushToRemoteUserPass } from './helpers';
import { JsonValue } from '@backstage/config';
import { RequiredTemplateValues } from '../templater';
import { Logger } from 'winston';

export class GitlabPublisher implements PublisherBase {
  private readonly client: Gitlab;
  private readonly token: string;

  constructor(client: Gitlab, token: string, logger: Logger) {
    this.client = client;
    this.token = token;
    this.logger = logger;
  }

  async publish({
    values,
    directory,
  }: PublisherOptions): Promise<PublisherResult> {
    this.logger.warn(`sdgsdg1`);
    const remoteUrl = await this.createRemote(values);
    this.logger.warn(`sdgsdg2`);
    await pushToRemoteUserPass(directory, remoteUrl, 'oauth2', this.token);
    this.logger.warn(`sdgsdg3 ${remoteUrl}`);

    const catalogInfoUrl = remoteUrl.replace(
      /\.git$/,
      '/-/blob/master/catalog-info.yaml',
    );
    return { remoteUrl, catalogInfoUrl };
  }

  private async createRemote(
    values: RequiredTemplateValues & Record<string, JsonValue>,
  ) {
    this.logger.warn(`sdgsdg ${values.storePath}`);

    const pathElements = values.storePath.split('/');
    this.logger.warn(`sdgsdg1`);
    const name = pathElements[pathElements.length - 1];
    this.logger.warn(`sdgsdg2`);
    pathElements.pop();
    this.logger.warn(`sdgsdg3`);
    const owner = pathElements.join('/');
    this.logger.warn(`sdgsdg4`);

    this.logger.warn(`owner: ${owner}, name ${name}`);

    this.logger.warn(`sdgsdg4`);
    let targetNamespace = ((await this.client.Namespaces.show(owner)) as {
      id: number;
    }).id;
    this.logger.warn(`targetNamespace ${targetNamespace}`);
    if (!targetNamespace) {
      targetNamespace = ((await this.client.Users.current()) as { id: number })
        .id;
    }
    this.logger.warn(`2targetNamespace ${targetNamespace}`);
    const project = (await this.client.Projects.create({
      namespace_id: targetNamespace,
      name: name,
    })) as { http_url_to_repo: string };
    this.logger.warn(`end ${project?.http_url_to_repo}`);
    return project?.http_url_to_repo;
  }
}
