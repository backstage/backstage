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
import { Logger } from 'winston';
import gitUrlParse from 'git-url-parse';

export class BitbucketPublisher implements PublisherBase {
  private readonly host?: string;
  private readonly username?: string;
  private readonly token?: string;
  private readonly integrations: BitbucketIntegrationConfig[];

  constructor(config: Config, { logger }: { logger: Logger }) {
    this.integrations = readBitbucketIntegrationConfigs(
      config.getOptionalConfigArray('integrations.bitbucket') ?? [],
    );

    if (!this.integrations.length) {
      logger.warn(
        'Integrations for Bitbucket in Scaffolder are not set. This will cause errors in a future release. Please migrate to using integrations config and specifying tokens under hostnames',
      );
    }

    this.token = config.getOptionalString('scaffolder.bitbucket.api.token');
    if (this.token) {
      logger.warn(
        "DEPRECATION: Using the token format under 'scaffolder.bitbucket.api.token' will not be respected in future releases. Please consider using integrations config instead",
      );
    }

    this.host = config.getOptionalString('scaffolder.bitbucket.api.host');
    if (this.host) {
      logger.warn(
        "DEPRECATION: Using the apiBaseUrl format under 'scaffolder.bitbucket.api.host' will not be respected in future releases. Please consider using integrations config instead",
      );
    }

    this.username = config.getOptionalString(
      'scaffolder.bitbucket.api.username',
    );
    if (this.username) {
      logger.warn(
        "DEPRECATION: Using the apiBaseUrl format under 'scaffolder.bitbucket.api.username' will not be respected in future releases. Please consider using integrations config instead",
      );
    }
  }

  async publish({
    values,
    directory,
    logger,
  }: PublisherOptions): Promise<PublisherResult> {
    const { resource: host, owner: project, name } = gitUrlParse(
      values.storePath,
    );

    const token = this.getToken(host);
    if (!token) {
      throw new Error('No token provided to create the remote repository');
    }
    const username = this.getUsername(host);
    if (!username) {
      throw new Error('No username provided to create the remote repository');
    }
    const apiUrl = this.getHost(host);
    if (!apiUrl) {
      throw new Error('No host provided to create the remote repository');
    }

    const description = values.description as string;
    const result = await this.createRemote({
      project,
      name,
      description,
      host,
    });

    await initRepoAndPush({
      dir: directory,
      remoteUrl: result.remoteUrl,
      auth: {
        username: username,
        password: token,
      },
      logger,
    });
    return result;
  }

  private async createRemote(opts: {
    project: string;
    name: string;
    description: string;
    host: string;
  }): Promise<PublisherResult> {
    if (opts.host === 'https://bitbucket.org') {
      return this.createBitbucketCloudRepository(opts);
    }
    return this.createBitbucketServerRepository(opts);
  }

  private async createBitbucketCloudRepository(opts: {
    project: string;
    name: string;
    description: string;
  }): Promise<PublisherResult> {
    const { project, name, description } = opts;

    let response: Response;
    const buffer = Buffer.from(`${this.username}:${this.token}`, 'utf8');

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
  }): Promise<PublisherResult> {
    const { project, name, description } = opts;

    let response: Response;
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        description: description,
      }),
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      response = await fetch(
        `${this.host}/rest/api/1.0/projects/${project}/repos`,
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

  private getHost(host: string): string | undefined {
    return this.host || this.integrations.find(c => c.host === host)?.host;
  }
}
