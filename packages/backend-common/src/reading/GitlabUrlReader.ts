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

import {
  getGitLabFileFetchUrl,
  getGitLabRequestOptions,
  GitLabIntegrationConfig,
  readGitLabIntegrationConfigs,
} from '@backstage/integration';
import fetch from 'cross-fetch';
import { NotFoundError } from '../errors';
import { ReaderFactory, ReadTreeResponse, UrlReader } from './types';

export class GitlabUrlReader implements UrlReader {
  static factory: ReaderFactory = ({ config }) => {
    const configs = readGitLabIntegrationConfigs(
      config.getOptionalConfigArray('integrations.gitlab') ?? [],
    );
    return configs.map(options => {
      const reader = new GitlabUrlReader(options);
      const predicate = (url: URL) => url.host === options.host;
      return { reader, predicate };
    });
  };

  constructor(private readonly options: GitLabIntegrationConfig) {}

  async read(url: string): Promise<Buffer> {
    const builtUrl = await getGitLabFileFetchUrl(url, this.options);

    let response: Response;
    try {
      response = await fetch(builtUrl, getGitLabRequestOptions(this.options));
    } catch (e) {
      throw new Error(`Unable to read ${url}, ${e}`);
    }

    if (response.ok) {
      return Buffer.from(await response.text());
    }

    const message = `${url} could not be read as ${builtUrl}, ${response.status} ${response.statusText}`;
    if (response.status === 404) {
      throw new NotFoundError(message);
    }
    throw new Error(message);
  }

  readTree(): Promise<ReadTreeResponse> {
    throw new Error('GitlabUrlReader does not implement readTree');
  }

  toString() {
    const { host, token } = this.options;
    return `gitlab{host=${host},authed=${Boolean(token)}}`;
  }
}
