/*
 * Copyright 2020 The Backstage Authors
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

import { Storage } from '@google-cloud/storage';
import {
  ReaderFactory,
  ReadTreeResponse,
  ReadUrlOptions,
  ReadUrlResponse,
  SearchResponse,
  UrlReader,
} from './types';
import getRawBody from 'raw-body';
import {
  GoogleGcsIntegrationConfig,
  readGoogleGcsIntegrationConfig,
} from '@backstage/integration';
import { Readable } from 'stream';
import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';

const GOOGLE_GCS_HOST = 'storage.cloud.google.com';

const parseURL = (
  url: string,
): { host: string; bucket: string; key: string } => {
  const { host, pathname } = new URL(url);

  if (host !== GOOGLE_GCS_HOST) {
    throw new Error(`not a valid GCS URL: ${url}`);
  }

  const [, bucket, ...key] = pathname.split('/');
  return {
    host: host,
    bucket,
    key: key.join('/'),
  };
};

/**
 * Implements a {@link UrlReader} for files on Google GCS.
 *
 * @public
 */
export class GoogleGcsUrlReader implements UrlReader {
  static factory: ReaderFactory = ({ config, logger }) => {
    if (!config.has('integrations.googleGcs')) {
      return [];
    }
    const gcsConfig = readGoogleGcsIntegrationConfig(
      config.getConfig('integrations.googleGcs'),
    );
    let storage: Storage;
    if (!gcsConfig.clientEmail || !gcsConfig.privateKey) {
      logger.info(
        'googleGcs credentials not found in config. Using default credentials provider.',
      );
      storage = new Storage();
    } else {
      storage = new Storage({
        credentials: {
          client_email: gcsConfig.clientEmail || undefined,
          private_key: gcsConfig.privateKey || undefined,
        },
      });
    }
    const reader = new GoogleGcsUrlReader(gcsConfig, storage);
    const predicate = (url: URL) => url.host === GOOGLE_GCS_HOST;
    return [{ reader, predicate }];
  };

  constructor(
    private readonly integration: GoogleGcsIntegrationConfig,
    private readonly storage: Storage,
  ) {}

  private readStreamFromUrl(url: string): Readable {
    const { bucket, key } = parseURL(url);
    return this.storage.bucket(bucket).file(key).createReadStream();
  }

  async read(url: string): Promise<Buffer> {
    try {
      return await getRawBody(this.readStreamFromUrl(url));
    } catch (error) {
      throw new Error(`unable to read gcs file from ${url}, ${error}`);
    }
  }

  async readUrl(
    url: string,
    _options?: ReadUrlOptions,
  ): Promise<ReadUrlResponse> {
    // TODO etag is not implemented yet.
    const stream = this.readStreamFromUrl(url);
    return ReadUrlResponseFactory.fromReadable(stream);
  }

  async readTree(): Promise<ReadTreeResponse> {
    throw new Error('GcsUrlReader does not implement readTree');
  }

  async search(): Promise<SearchResponse> {
    throw new Error('GcsUrlReader does not implement search');
  }

  toString() {
    const key = this.integration.privateKey;
    return `googleGcs{host=${GOOGLE_GCS_HOST},authed=${Boolean(key)}}`;
  }
}
