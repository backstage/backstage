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
import { InputError, NotFoundError } from '../errors';
import { ReadTreeResponseFactory } from './tree';
import {
  ReaderFactory,
  ReadTreeOptions,
  ReadTreeResponse,
  UrlReader,
} from './types';
import parseGitUri from 'git-url-parse';
import { Readable } from 'stream';

export class GitlabUrlReader implements UrlReader {
  private readonly treeResponseFactory: ReadTreeResponseFactory;

  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const configs = readGitLabIntegrationConfigs(
      config.getOptionalConfigArray('integrations.gitlab') ?? [],
    );
    return configs.map(options => {
      const reader = new GitlabUrlReader(options, { treeResponseFactory });
      const predicate = (url: URL) => url.host === options.host;
      return { reader, predicate };
    });
  };

  constructor(
    private readonly options: GitLabIntegrationConfig,
    deps: { treeResponseFactory: ReadTreeResponseFactory },
  ) {
    this.treeResponseFactory = deps.treeResponseFactory;
  }

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

  async readTree(
    url: string,
    options?: ReadTreeOptions,
  ): Promise<ReadTreeResponse> {
    const {
      name: repoName,
      ref,
      protocol,
      resource,
      full_name,
      filepath,
    } = parseGitUri(url);

    if (!ref) {
      throw new InputError(
        'GitLab URL must contain a branch to be able to fetch its tree',
      );
    }

    const archive = `${protocol}://${resource}/${full_name}/-/archive/${ref}/${repoName}-${ref}.zip`;
    const response = await fetch(
      archive,
      getGitLabRequestOptions(this.options),
    );
    if (!response.ok) {
      const msg = `Failed to read tree from ${url}, ${response.status} ${response.statusText}`;
      if (response.status === 404) {
        throw new NotFoundError(msg);
      }
      throw new Error(msg);
    }

    const path = filepath ? `${repoName}-${ref}/${filepath}/` : '';

    return this.treeResponseFactory.fromZipArchive({
      stream: (response.body as unknown) as Readable,
      path,
      filter: options?.filter,
    });
  }

  toString() {
    const { host, token } = this.options;
    return `gitlab{host=${host},authed=${Boolean(token)}}`;
  }
}
