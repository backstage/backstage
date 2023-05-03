/*
 * Copyright 2023 The Backstage Authors
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
  ReaderFactory,
  ReadTreeResponse,
  ReadUrlOptions,
  ReadUrlResponse,
  SearchResponse,
  UrlReader,
} from './types';
import {
  AzureBlobStorageIntegration,
  ScmIntegrations,
} from '@backstage/integration';
import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';
import { NotFoundError, NotModifiedError } from '@backstage/errors';
import { parseLastModified } from './util';
import fetch, { Response } from 'node-fetch';

/**
 * Implements a {@link @backstage/backend-plugin-api#UrlReaderService} for Azure BlobStorage Container.
 *
 * @public
 */
export class AzureBlobStorageUrlReader implements UrlReader {
  static factory: ReaderFactory = ({ config }) => {
    const integrations = ScmIntegrations.fromConfig(config);
    return integrations.azureBlobStorage.list().map(integration => {
      const reader = new AzureBlobStorageUrlReader(integration);
      const predicate = (url: URL) => url.host === integration.config.host;
      return { reader, predicate };
    });
  };

  constructor(private readonly integration: AzureBlobStorageIntegration) {}

  async readUrl(
    url: string,
    options?: ReadUrlOptions,
  ): Promise<ReadUrlResponse> {
    const { etag, lastModifiedAfter } = options ?? {};
    let response: Response;
    try {
      response = await fetch(
        `${url}${this.integration.config.secretAccessKey}`,
        {
          headers: {
            ...(etag && { 'If-None-Match': etag }),
            ...(lastModifiedAfter && {
              'If-Modified-Since': lastModifiedAfter.toUTCString(),
            }),
          },
        },
      );
    } catch (e) {
      throw new Error(`Unable to read ${url}, ${e}`);
    }

    if (response.status === 304) {
      throw new NotModifiedError();
    }

    if (response.ok) {
      return ReadUrlResponseFactory.fromNodeJSReadable(response.body, {
        etag: response.headers.get('ETag') ?? undefined,
        lastModifiedAt: parseLastModified(
          response.headers.get('Last-Modified'),
        ),
      });
    }
    const message = `${url} could not be read as ${url}, ${response.status} ${response.statusText}`;
    if (response.status === 404) {
      throw new NotFoundError(message);
    }
    throw new Error(message);
  }

  async readTree(): Promise<ReadTreeResponse> {
    throw new Error('Azure BlobStorage does not implement readTree');
  }

  search(): Promise<SearchResponse> {
    throw new Error('Azure BlobStorage does not implement search');
  }

  toString() {
    const { accountName, secretAccessKey } = this.integration.config;
    return `azureBlobStorage{host=${accountName},authed=${Boolean(
      secretAccessKey,
    )}}`;
  }
}
