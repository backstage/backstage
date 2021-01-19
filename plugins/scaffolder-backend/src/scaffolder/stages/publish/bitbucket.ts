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
import { initRepoAndPush } from './helpers';
import fetch from 'cross-fetch';
import { Config } from '@backstage/config';
import {
  BitbucketIntegrationConfig,
  readBitbucketIntegrationConfigs,
} from '@backstage/integration';
import gitUrlParse from 'git-url-parse';

// TODO(blam): We should probably start to use a bitbucket client here that we can change
// the  baseURL to point at on-prem or public bitbucket versions like we do for
// github and ghe
export class BitbucketPublisher implements PublisherBase {
  private readonly host?: string;
  private readonly username?: string;
  private readonly token?: string;
  private readonly appPassword?: string;
  private readonly integrations: BitbucketIntegrationConfig[];

  static fromConfig(config: Config) {
    return new BitbucketPublisher(config);
  }
  constructor(config: Config) {
    this.integrations = readBitbucketIntegrationConfigs(
      config.getOptionalConfigArray('integrations.bitbucket') ?? [],
    );
    this.token = config.getOptionalString('scaffolder.bitbucket.api.token');
    this.host = config.getOptionalString('scaffolder.bitbucket.api.host');
    this.username = config.getOptionalString(
      'scaffolder.bitbucket.api.username',
    );
    this.appPassword = config.getOptionalString(
      'scaffolder.bitbucket.api.appPassword',
    );
  }

  async publish({
    values,
    directory,
    logger,
  }: PublisherOptions): Promise<PublisherResult> {
    const { resource: hostname, owner: project, name } = gitUrlParse(
      values.storePath,
    );

    const token = this.getToken(hostname);
    const appPassword = this.getAppPassword(hostname);
    const username = this.getUsername(hostname);

    if (!username && !appPassword && !token) {
      throw new Error('Cannot create repository without bitbucket credentials');
    }
    const host = this.getHost(hostname);

    if (!host) {
      throw new Error('No host provided to create the remote repository');
    }

    const description = values.description as string;
    const result = await this.createRemote({
      project,
      name,
      description,
      host,
      username,
      token,
      appPassword,
    });

    await initRepoAndPush({
      dir: directory,
      remoteUrl: result.remoteUrl,
      auth: {
        username: username ? username : 'x-token-auth',
        password: appPassword ? appPassword : token ?? '',
      },
      logger,
    });
    return result;
  }

  private async createRemote(opts: {
    username?: string;
    token?: string;
    appPassword?: string;
    project: string;
    name: string;
    description: string;
    host: string;
  }): Promise<PublisherResult> {
    if (opts.host === 'bitbucket.org') {
      return this.createBitbucketCloudRepository(opts);
    }
    return this.createBitbucketServerRepository(opts);
  }

  private async createBitbucketCloudRepository(opts: {
    project: string;
    name: string;
    description: string;
    username?: string;
    appPassword?: string;
  }): Promise<PublisherResult> {
    const { project, name, description, username, appPassword } = opts;
    if (!appPassword) {
      throw new Error(
        'appPassword is required to create the remote repository',
      );
    }

    if (!username) {
      throw new Error('username is required to create the remote repository');
    }

    let response: Response;
    const buffer = Buffer.from(`${username}:${appPassword}`, 'utf8');

    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        scm: 'git',
        description: description,
      }),
      headers: {
        Authorization: `Basic ${buffer.toString('base64')}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      response = await fetch(
        `https://api.bitbucket.org/2.0/repositories/${project}/${name}`,
        options,
      );
    } catch (e) {
      throw new Error(`Unable to create repository, ${e}`);
    }
    if (response.status === 200) {
      const r = await response.json();
      let remoteUrl = '';
      for (const link of r.links.clone) {
        if (link.name === 'https') {
          remoteUrl = link.href;
        }
      }

      // TODO use the urlReader to get the defautl branch
      const catalogInfoUrl = `${r.links.html.href}/src/master/catalog-info.yaml`;
      return { remoteUrl, catalogInfoUrl };
    }
    throw new Error(`Not a valid response code ${await response.text()}`);
  }

  private async createBitbucketServerRepository(opts: {
    project: string;
    name: string;
    description: string;
    token?: string;
    host: string;
  }): Promise<PublisherResult> {
    const { project, name, description, token, host } = opts;
    if (!token) {
      throw new Error('No token provided to create the remote repository');
    }

    let response: Response;
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        description: description,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      response = await fetch(
        `https://${host}/rest/api/1.0/projects/${project}/repos`,
        options,
      );
    } catch (e) {
      throw new Error(`Unable to create repository, ${e}`);
    }
    if (response.status === 201) {
      const r = await response.json();
      let remoteUrl = '';
      for (const link of r.links.clone) {
        if (link.name === 'http') {
          remoteUrl = link.href;
        }
      }
      const catalogInfoUrl = `${r.links.self[0].href}/catalog-info.yaml`;
      return { remoteUrl, catalogInfoUrl };
    }
    throw new Error(`Not a valid response code ${await response.text()}`);
  }

  private getToken(host: string): string | undefined {
    return this.token || this.integrations.find(c => c.host === host)?.token;
  }

  private getUsername(host: string): string | undefined {
    return (
      this.username || this.integrations.find(c => c.host === host)?.username
    );
  }

  private getAppPassword(host: string): string | undefined {
    return (
      this.appPassword ||
      this.integrations.find(c => c.host === host)?.appPassword
    );
  }

  private getHost(host: string): string | undefined {
    return this.host || this.integrations.find(c => c.host === host)?.host;
  }
}
