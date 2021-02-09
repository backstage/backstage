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
  AzureIntegrationConfig,
  readAzureIntegrationConfigs,
  getAzureFileFetchUrl,
  getAzureDownloadUrl,
  getAzureRequestOptions,
  getAzureCommitsUrl,
} from '@backstage/integration';
import fetch from 'cross-fetch';
import { Readable } from 'stream';
import { NotFoundError, NotModifiedError } from '../errors';
import {
  ReaderFactory,
  ReadTreeOptions,
  ReadTreeResponse,
  SearchResponse,
  UrlReader,
} from './types';
import { ReadTreeResponseFactory } from './tree';

export class AzureUrlReader implements UrlReader {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const configs = readAzureIntegrationConfigs(
      config.getOptionalConfigArray('integrations.azure') ?? [],
    );
    return configs.map(options => {
      const reader = new AzureUrlReader(options, { treeResponseFactory });
      const predicate = (url: URL) => url.host === options.host;
      return { reader, predicate };
    });
  };

  constructor(
    private readonly options: AzureIntegrationConfig,
    private readonly deps: { treeResponseFactory: ReadTreeResponseFactory },
  ) {}

  async read(url: string): Promise<Buffer> {
    const builtUrl = getAzureFileFetchUrl(url);

    let response: Response;
    try {
      response = await fetch(builtUrl, getAzureRequestOptions(this.options));
    } catch (e) {
      throw new Error(`Unable to read ${url}, ${e}`);
    }

    // for private repos when PAT is not valid, Azure API returns a http status code 203 with sign in page html
    if (response.ok && response.status !== 203) {
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
    // TODO: Support filepath based reading tree feature like other providers

    // Get latest commit SHA

    const commitsAzureResponse = await fetch(
      getAzureCommitsUrl(url),
      getAzureRequestOptions(this.options),
    );
    if (!commitsAzureResponse.ok) {
      const message = `Failed to read tree from ${url}, ${commitsAzureResponse.status} ${commitsAzureResponse.statusText}`;
      if (commitsAzureResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    const commitSha = (await commitsAzureResponse.json()).value[0].commitId;
    if (options?.etag && options.etag === commitSha) {
      throw new NotModifiedError();
    }

    const archiveAzureResponse = await fetch(
      getAzureDownloadUrl(url),
      getAzureRequestOptions(this.options, { Accept: 'application/zip' }),
    );
    if (!archiveAzureResponse.ok) {
      const message = `Failed to read tree from ${url}, ${archiveAzureResponse.status} ${archiveAzureResponse.statusText}`;
      if (archiveAzureResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    return await this.deps.treeResponseFactory.fromZipArchive({
      stream: (archiveAzureResponse.body as unknown) as Readable,
      etag: commitSha,
      filter: options?.filter,
    });
  }

  async search(): Promise<SearchResponse> {
    throw new Error('AzureUrlReader does not implement search');
  }

  toString() {
    const { host, token } = this.options;
    return `azure{host=${host},authed=${Boolean(token)}}`;
  }
}
