/*
 * Copyright 2022 The Backstage Authors
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
  UrlReaderService,
  UrlReaderServiceReadTreeOptions,
  UrlReaderServiceReadTreeResponse,
  UrlReaderServiceReadUrlOptions,
  UrlReaderServiceReadUrlResponse,
  UrlReaderServiceSearchResponse,
} from '@backstage/backend-plugin-api';
import {
  getGiteaFileContentsUrl,
  getGiteaArchiveUrl,
  getGiteaLatestCommitUrl,
  parseGiteaUrl,
  getGiteaRequestOptions,
  GiteaIntegration,
  ScmIntegrations,
} from '@backstage/integration';
import { ReaderFactory, ReadTreeResponseFactory } from './types';
import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';
import {
  AuthenticationError,
  NotFoundError,
  NotModifiedError,
} from '@backstage/errors';
import { Readable } from 'stream';
import { parseLastModified } from './util';

/**
 * Implements a {@link @backstage/backend-plugin-api#UrlReaderService} for the Gitea v1 api.
 *
 * @public
 */
export class GiteaUrlReader implements UrlReaderService {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    return ScmIntegrations.fromConfig(config)
      .gitea.list()
      .map(integration => {
        const reader = new GiteaUrlReader(integration, { treeResponseFactory });
        const predicate = (url: URL) => {
          return url.host === integration.config.host;
        };
        return { reader, predicate };
      });
  };

  constructor(
    private readonly integration: GiteaIntegration,
    private readonly deps: {
      treeResponseFactory: ReadTreeResponseFactory;
    },
  ) {}

  async read(url: string): Promise<Buffer> {
    const response = await this.readUrl(url);
    return response.buffer();
  }

  async readUrl(
    url: string,
    options?: UrlReaderServiceReadUrlOptions,
  ): Promise<UrlReaderServiceReadUrlResponse> {
    let response: Response;
    const blobUrl = getGiteaFileContentsUrl(this.integration.config, url);

    try {
      response = await fetch(blobUrl, {
        method: 'GET',
        ...getGiteaRequestOptions(this.integration.config),
        signal: options?.signal as any,
      });
    } catch (e) {
      throw new Error(`Unable to read ${blobUrl}, ${e}`);
    }

    if (response.ok) {
      // Gitea returns an object with the file contents encoded, not the file itself
      const { encoding, content } = await response.json();

      if (encoding === 'base64') {
        return ReadUrlResponseFactory.fromReadable(
          Readable.from(Buffer.from(content, 'base64')),
          {
            etag: response.headers.get('ETag') ?? undefined,
            lastModifiedAt: parseLastModified(
              response.headers.get('Last-Modified'),
            ),
          },
        );
      }

      throw new Error(`Unknown encoding: ${encoding}`);
    }

    const message = `${url} could not be read as ${blobUrl}, ${response.status} ${response.statusText}`;
    if (response.status === 404) {
      throw new NotFoundError(message);
    }

    if (response.status === 304) {
      throw new NotModifiedError();
    }

    if (response.status === 403) {
      throw new AuthenticationError();
    }

    throw new Error(message);
  }

  async readTree(
    url: string,
    options?: UrlReaderServiceReadTreeOptions,
  ): Promise<UrlReaderServiceReadTreeResponse> {
    const lastCommitHash = await this.getLastCommitHash(url);
    if (options?.etag && options.etag === lastCommitHash) {
      throw new NotModifiedError();
    }

    const archiveUri = getGiteaArchiveUrl(this.integration.config, url);

    let response: Response;
    try {
      response = await fetch(archiveUri, {
        method: 'GET',
        ...getGiteaRequestOptions(this.integration.config),
        signal: options?.signal as any,
      });
    } catch (e) {
      throw new Error(`Unable to read ${archiveUri}, ${e}`);
    }

    const parsedUri = parseGiteaUrl(this.integration.config, url);

    return this.deps.treeResponseFactory.fromTarArchive({
      response: response,
      subpath: parsedUri.path,
      etag: lastCommitHash,
      filter: options?.filter,
    });
  }

  search(): Promise<UrlReaderServiceSearchResponse> {
    throw new Error('GiteaUrlReader search not implemented.');
  }

  toString() {
    const { host } = this.integration.config;
    return `gitea{host=${host},authed=${Boolean(
      this.integration.config.password,
    )}}`;
  }

  private async getLastCommitHash(url: string): Promise<string> {
    const commitUri = getGiteaLatestCommitUrl(this.integration.config, url);

    const response = await fetch(
      commitUri,
      getGiteaRequestOptions(this.integration.config),
    );
    if (!response.ok) {
      const message = `Failed to retrieve latest commit information from ${commitUri}, ${response.status} ${response.statusText}`;
      if (response.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    return (await response.json()).sha;
  }
}
