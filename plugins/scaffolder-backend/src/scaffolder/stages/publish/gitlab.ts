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
import { Gitlab as GitlabClient } from '@gitbeaker/core';
import { initRepoAndPush } from './helpers';
import parseGitUrl from 'git-url-parse';

import { GitLabIntegrationConfig } from '@backstage/integration';

export class GitlabPublisher implements PublisherBase {
  static async fromConfig(config: GitLabIntegrationConfig) {
    if (!config.token) {
      return undefined;
    }

    const client = new Gitlab({ host: config.baseUrl, token: config.token });
    return new GitlabPublisher({ token: config.token, client });
  }

  constructor(
    private readonly config: { token: string; client: GitlabClient },
  ) {}

  async publish({
    values,
    directory,
    logger,
  }: PublisherOptions): Promise<PublisherResult> {
    const { owner, name } = parseGitUrl(values.storePath);

    const remoteUrl = await this.createRemote({
      owner,
      name,
    });

    await initRepoAndPush({
      dir: directory,
      remoteUrl,
      auth: {
        username: 'oauth2',
        password: this.config.token,
      },
      logger,
    });

    const catalogInfoUrl = remoteUrl.replace(
      /\.git$/,
      '/-/blob/master/catalog-info.yaml',
    );
    return { remoteUrl, catalogInfoUrl };
  }

  private async createRemote(opts: { name: string; owner: string }) {
    const { owner, name } = opts;

    // TODO(blam): this needs cleaning up to be nicer. The amount of brackets is too damn high!
    // Shouldn't have to cast things now
    let targetNamespace = ((await this.config.client.Namespaces.show(
      owner,
    )) as {
      id: number;
    }).id;

    if (!targetNamespace) {
      targetNamespace = ((await this.config.client.Users.current()) as {
        id: number;
      }).id;
    }

    const project = (await this.config.client.Projects.create({
      namespace_id: targetNamespace,
      name: name,
    })) as { http_url_to_repo: string };

    return project?.http_url_to_repo;
  }
}
