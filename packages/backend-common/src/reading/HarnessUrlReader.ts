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
  getHarnessRequestOptions,
  getHarnessFileContentsUrl,
  HarnessIntegration,
  ScmIntegrations,
} from '@backstage/integration';
import { ReadUrlOptions, ReadUrlResponse } from './types';
import {
  ReaderFactory,
  ReadTreeResponse,
  SearchResponse,
  UrlReader,
} from './types';
import fetch, { Response } from 'node-fetch';
import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';
import {
  AuthenticationError,
  NotFoundError,
  NotModifiedError,
} from '@backstage/errors';
import { Readable } from 'stream';

/**
 * Implements a {@link @backstage/backend-plugin-api#UrlReaderService} for the Harness code v1 api.
 *
 *
 * @public
 */
export class HarnessUrlReader implements UrlReader {
  static factory: ReaderFactory = ({ config }) => {
    return ScmIntegrations.fromConfig(config)
      .harness.list()
      .map(integration => {
        const reader = new HarnessUrlReader(integration);
        const predicate = (url: URL) => {
          return url.host === integration.config.host;
        };
        return { reader, predicate };
      });
  };

  constructor(private readonly integration: HarnessIntegration) {}

  async read(url: string): Promise<Buffer> {
    const response = await this.readUrl(url);
    return response.buffer();
  }

  async readUrl(
    url: string,
    options?: ReadUrlOptions,
  ): Promise<ReadUrlResponse> {
    let response: Response;
    const blobUrl = getHarnessFileContentsUrl(this.integration.config, url);

    try {
      response = await fetch(blobUrl, {
        method: 'GET',
        ...getHarnessRequestOptions(this.integration.config),
        signal: options?.signal as any,
      });
    } catch (e) {
      throw new Error(`Unable to read ${blobUrl}, ${e}`);
    }

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

  readTree(): Promise<ReadTreeResponse> {
    throw new Error('HarnessUrlReader readTree not implemented.');
  }
  search(): Promise<SearchResponse> {
    throw new Error('HarnessUrlReader search not implemented.');
  }

  toString() {
    const { host } = this.integration.config;
    return `harness{host=${host},authed=${Boolean(
      this.integration.config.token || this.integration.config.apiKey,
    )}}`;
  }
}
