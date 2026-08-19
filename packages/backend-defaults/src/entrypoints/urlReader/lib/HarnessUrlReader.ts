/*
 * Copyright 2025 The Backstage Authors
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
  UrlReaderServiceReadTreeResponse,
  UrlReaderServiceReadUrlOptions,
  UrlReaderServiceReadUrlResponse,
  UrlReaderServiceSearchResponse,
  UrlReaderServiceReadTreeOptions,
  UrlReaderServiceSearchOptions,
} from '@backstage/backend-plugin-api';
import {
  getHarnessRequestOptions,
  getHarnessFileContentsUrl,
  HarnessIntegration,
  ScmIntegrations,
  getHarnessLatestCommitUrl,
  getHarnessArchiveUrl,
  parseHarnessUrl,
} from '@backstage/integration';
import { ReadTreeResponseFactory, ReaderFactory } from './types';
import fetch, { Response } from 'node-fetch';
import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';
import {
  toError,
  AuthenticationError,
  NotFoundError,
  NotModifiedError,
} from '@backstage/errors';
import { Readable } from 'node:stream';
import { predicateFromConfig } from './FetchUrlReader';

const REDIRECT_STATUS_CODES = [301, 302, 303, 307, 308];
const MAX_REDIRECTS = 5;

/**
 * Implements a {@link @backstage/backend-plugin-api#UrlReaderService} for the Harness code v1 api.
 *
 *
 * @public
 */
export class HarnessUrlReader implements UrlReaderService {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const allowedRedirectPredicate = predicateFromConfig(config);
    return ScmIntegrations.fromConfig(config)
      .harness.list()
      .map(integration => {
        const reader = new HarnessUrlReader(integration, {
          treeResponseFactory,
        });
        reader.allowedRedirectPredicate = allowedRedirectPredicate;
        const predicate = (url: URL) => {
          return url.host === integration.config.host;
        };
        return { reader, predicate };
      });
  };

  private readonly integration: HarnessIntegration;
  private readonly deps: {
    treeResponseFactory: ReadTreeResponseFactory;
  };
  private allowedRedirectPredicate: (url: URL) => boolean = () => false;

  constructor(
    integration: HarnessIntegration,
    deps: {
      treeResponseFactory: ReadTreeResponseFactory;
    },
  ) {
    this.integration = integration;
    this.deps = deps;
  }
  async read(url: string): Promise<Buffer> {
    const response = await this.readUrl(url);
    return response.buffer();
  }

  async readUrl(
    url: string,
    options?: UrlReaderServiceReadUrlOptions,
  ): Promise<UrlReaderServiceReadUrlResponse> {
    const blobUrl = getHarnessFileContentsUrl(this.integration.config, url);
    const response = await this.fetchUrl(blobUrl, options?.signal);

    if (response.ok) {
      // Harness Code returns the raw content object
      const jsonResponse = { data: response.body };
      if (jsonResponse) {
        return ReadUrlResponseFactory.fromReadable(
          Readable.from(jsonResponse.data),
          {
            etag: response.headers.get('ETag') ?? undefined,
          },
        );
      }

      throw new Error(`Unknown json: ${jsonResponse}`);
    }

    const message = `${url} x ${blobUrl}, ${response.status} ${response.statusText}`;
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

    const archiveUri = getHarnessArchiveUrl(this.integration.config, url);

    const response = await this.fetchUrl(archiveUri, options?.signal);

    const parsedUri = parseHarnessUrl(this.integration.config, url);

    return this.deps.treeResponseFactory.fromZipArchive({
      stream: Readable.from(response.body),
      subpath: parsedUri.path,
      etag: lastCommitHash,
      filter: options?.filter,
    });
  }

  async search(
    url: string,
    options?: UrlReaderServiceSearchOptions,
  ): Promise<UrlReaderServiceSearchResponse> {
    const { path } = parseHarnessUrl(this.integration.config, url);

    if (path.match(/[*?]/)) {
      throw new Error('Unsupported search pattern URL');
    }

    try {
      const data = await this.readUrl(url, options);

      return {
        files: [
          {
            url: url,
            content: data.buffer,
            lastModifiedAt: data.lastModifiedAt,
          },
        ],
        etag: data.etag ?? '',
      };
    } catch (e) {
      const error = toError(e);
      if (error.name === 'NotFoundError') {
        return {
          files: [],
          etag: '',
        };
      }
      throw error;
    }
  }

  toString() {
    const { host } = this.integration.config;
    return `harness{host=${host},authed=${Boolean(
      this.integration.config.token || this.integration.config.apiKey,
    )}}`;
  }

  private async fetchUrl(url: string, signal?: AbortSignal): Promise<Response> {
    const configuredOrigin = new URL(`https://${this.integration.config.host}`)
      .origin;
    let currentUrl = url;

    for (let redirectCount = 0; ; redirectCount += 1) {
      const currentUrlObject = new URL(currentUrl);
      const requestOptions =
        currentUrlObject.origin === configuredOrigin
          ? getHarnessRequestOptions(this.integration.config)
          : {};
      let response: Response;
      try {
        response = await fetch(currentUrl, {
          method: 'GET',
          ...requestOptions,
          redirect: 'manual',
          signal: signal as any,
        });
      } catch (e) {
        throw new Error(`Unable to read ${currentUrl}, ${e}`);
      }

      const location = response.headers.get('location');
      if (!REDIRECT_STATUS_CODES.includes(response.status) || !location) {
        return response;
      }

      response.body.resume();

      let redirectUrl: URL;
      try {
        redirectUrl = new URL(location, currentUrl);
      } catch (e) {
        throw new Error(
          `Unable to read ${currentUrl}, invalid redirect URL ${location}, ${e}`,
        );
      }

      if (
        redirectUrl.origin !== configuredOrigin &&
        !this.allowedRedirectPredicate(redirectUrl)
      ) {
        throw new Error(
          `Refusing to follow cross-origin Harness redirect to ${redirectUrl.origin}`,
        );
      }

      if (redirectCount === MAX_REDIRECTS) {
        throw new Error(
          `Too many redirects (max ${MAX_REDIRECTS}) when reading ${url}`,
        );
      }

      currentUrl = redirectUrl.toString();
    }
  }

  private async getLastCommitHash(url: string): Promise<string> {
    const commitUri = getHarnessLatestCommitUrl(this.integration.config, url);

    const response = await this.fetchUrl(commitUri);
    if (!response.ok) {
      const message = `Failed to retrieve latest commit information from ${commitUri}, ${response.status} ${response.statusText}`;
      if (response.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    return (await response.json()).latest_commit.sha;
  }
}
