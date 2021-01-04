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
import { RequiredTemplateValues } from '../templater';
import { JsonValue } from '../../../../../../packages/config/src';
import fetch from 'cross-fetch';

export class BitbucketPublisher implements PublisherBase {
  private readonly host: string;
  private readonly username: string;
  private readonly token: string;

  constructor(host: string, username: string, token: string) {
    this.host = host;
    this.username = username;
    this.token = token;
  }

  async publish({
    values,
    directory,
    logger,
  }: PublisherOptions): Promise<PublisherResult> {
    const result = await this.createRemote(values);

    await initRepoAndPush({
      dir: directory,
      remoteUrl: result.remoteUrl,
      auth: {
        username: this.username,
        password: this.token,
      },
      logger,
    });
    return result;
  }

  private async createRemote(
    values: RequiredTemplateValues & Record<string, JsonValue>,
  ): Promise<PublisherResult> {
    if (this.host === 'https://bitbucket.org') {
      return this.createBitbucketCloudRepository(values);
    }
    return this.createBitbucketServerRepository(values);
  }

  private async createBitbucketCloudRepository(
    values: RequiredTemplateValues & Record<string, JsonValue>,
  ): Promise<PublisherResult> {
    const [project, name] = values.storePath.split('/');

    let response: Response;
    const buffer = Buffer.from(`${this.username}:${this.token}`, 'utf8');

    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        scm: 'git',
        description: values.description,
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

  private async createBitbucketServerRepository(
    values: RequiredTemplateValues & Record<string, JsonValue>,
  ): Promise<PublisherResult> {
    const [project, name] = values.storePath.split('/');

    let response: Response;
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        description: values.description,
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
}
