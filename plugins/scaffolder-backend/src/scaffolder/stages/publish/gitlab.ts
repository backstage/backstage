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
import { Gitlab } from '@gitbeaker/node';
import { Config } from '@backstage/config';
import { initRepoAndPush } from './helpers';
import gitUrlParse from 'git-url-parse';

import {
  GitLabIntegrationConfig,
  readGitLabIntegrationConfigs,
} from '@backstage/integration';

export class GitlabPublisher implements PublisherBase {
  private readonly integrations: GitLabIntegrationConfig[];
  private readonly scaffolderToken: string | undefined;
  private readonly apiBaseUrl: string | undefined;

  constructor(config: Config) {
    this.integrations = readGitLabIntegrationConfigs(
      config.getOptionalConfigArray('integrations.gitlab') ?? [],
    );
    this.scaffolderToken = config.getOptionalString(
      'scaffolder.gitlab.api.token',
    );

    this.apiBaseUrl = config.getOptionalString('scaffolder.gitlab.api.baseUrl');
  }

  static fromConfig(config: Config) {
    return new GitlabPublisher(config);
  }

  async publish({
    values,
    directory,
    logger,
  }: PublisherOptions): Promise<PublisherResult> {
    const { resource: host, owner, name } = gitUrlParse(values.storePath);

    const token = this.getToken(host);
    if (!token) {
      throw new Error(
        'No authentication set for Gitlab publisher. Creating the remote repository is not possible without a token',
      );
    }

    const baseUrl = this.getBaseUrl(host);
    if (!baseUrl) {
      throw new Error(
        'No host set for Gitlab publisher. Creating the remote repository is not possible without a host',
      );
    }

    const remoteUrl = await this.createRemote({
      host: baseUrl,
      owner,
      name,
      token,
    });

    await initRepoAndPush({
      dir: directory,
      remoteUrl,
      auth: {
        username: 'oauth2',
        password: token,
      },
      logger,
    });

    const catalogInfoUrl = remoteUrl.replace(
      /\.git$/,
      '/-/blob/master/catalog-info.yaml',
    );
    return { remoteUrl, catalogInfoUrl };
  }

  private getToken(host: string): string | undefined {
    return (
      this.scaffolderToken ||
      this.integrations.find(c => c.host === host)?.token
    );
  }

  private getBaseUrl(host: string): string | undefined {
    return (
      this.apiBaseUrl ||
      this.integrations.find(c => c.host === host)?.apiBaseUrl
    );
  }

  private async createRemote(opts: {
    host: string;
    name: string;
    owner: string;
    token: string;
  }) {
    const { owner, name, host, token } = opts;

    const client = new Gitlab({ host: host, token: token });
    let targetNamespace = ((await client.Namespaces.show(owner)) as {
      id: number;
    }).id;
    if (!targetNamespace) {
      targetNamespace = ((await client.Users.current()) as { id: number }).id;
    }

    const project = (await client.Projects.create({
      namespace_id: targetNamespace,
      name: name,
    })) as { http_url_to_repo: string };

    return project?.http_url_to_repo;
  }
}
