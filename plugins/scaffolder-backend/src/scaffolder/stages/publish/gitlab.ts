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
import { Config, JsonValue } from '@backstage/config';
import { Logger } from 'winston';
import { initRepoAndPush } from './helpers';
import { RequiredTemplateValues } from '../templater';
import {
  GitLabIntegrationConfig,
  readGitLabIntegrationConfigs,
} from '@backstage/integration';

export class GitlabPublisher implements PublisherBase {
  private readonly integrations: GitLabIntegrationConfig[];
  private readonly scaffolderToken: string | undefined;
  private readonly logger: Logger;

  constructor(config: Config, { logger }: { logger: Logger }) {
    this.logger = logger;
    this.integrations = readGitLabIntegrationConfigs(
      config.getOptionalConfigArray('integrations.gitlab') ?? [],
    );

    if (!this.integrations.length) {
      this.logger.warn(
        'Integrations for GitLab in Scaffolder are not set. This will cause errors in a future release. Please migrate to using integrations config and specifying tokens under hostnames',
      );
    }

    this.scaffolderToken = config.getOptionalString(
      'scaffolder.gitlab.api.token',
    );

    if (this.scaffolderToken) {
      this.logger.warn(
        "DEPRECATION: Using the token format under 'scaffolder.gitlab.api.token' will not be respected in future releases. Please consider using integrations config instead",
      );
    }
  }

  async publish({
    values,
    directory,
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
