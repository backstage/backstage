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
import { JsonValue } from '@backstage/config';
import { initRepoAndPush } from './helpers';
import { RequiredTemplateValues } from '../templater';

export class GitlabPublisher implements PublisherBase {
  private readonly client: Gitlab;
  private readonly token: string;

  constructor(client: Gitlab, token: string) {
    this.client = client;
    this.token = token;
  }

  async publish({
    values,
    directory,
    logger,
  }: PublisherOptions): Promise<PublisherResult> {
    const remoteUrl = await this.createRemote(values);

    await initRepoAndPush({
      dir: directory,
      remoteUrl,
      auth: {
        username: 'oauth2',
        password: this.token,
      },
      logger,
    });

    return { remoteUrl };
  }

  private async createRemote(
    values: RequiredTemplateValues & Record<string, JsonValue>,
  ) {
    const pathElements = values.storePath.split('/');
    const name = pathElements[pathElements.length - 1];
    pathElements.pop();
    const owner = pathElements.join('/');

    let targetNamespace = ((await this.client.Namespaces.show(owner)) as {
      id: number;
    }).id;
    if (!targetNamespace) {
      targetNamespace = ((await this.client.Users.current()) as { id: number })
        .id;
    }

    const project = (await this.client.Projects.create({
      namespace_id: targetNamespace,
      name: name,
    })) as { http_url_to_repo: string };

    return project?.http_url_to_repo;
  }
}
