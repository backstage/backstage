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

import * as GoogleCloud from '@google-cloud/storage';
import {
  UrlReaderService,
  UrlReaderServiceReadTreeResponse,
  UrlReaderServiceReadUrlOptions,
  UrlReaderServiceReadUrlResponse,
  UrlReaderServiceSearchOptions,
  UrlReaderServiceSearchResponse,
} from '@backstage/backend-plugin-api';
import { ReaderFactory } from './types';
import getRawBody from 'raw-body';
import {
  GoogleGcsIntegrationConfig,
  readGoogleGcsIntegrationConfig,
} from '@backstage/integration';
import { Readable } from 'stream';
import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';
import packageinfo from '../../../../package.json';
import { assertError } from '@backstage/errors';

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
 * Implements a {@link @backstage/backend-plugin-api#UrlReaderService} for files on Google GCS.
 *
 * @public
 */
export class GoogleGcsUrlReader implements UrlReaderService {
  static factory: ReaderFactory = ({ config, logger }) => {
    if (!config.has('integrations.googleGcs')) {
      return [];
    }
    const gcsConfig = readGoogleGcsIntegrationConfig(
      config.getConfig('integrations.googleGcs'),
    );
    let storage: GoogleCloud.Storage;
    if (!gcsConfig.clientEmail || !gcsConfig.privateKey) {
      logger.info(
        'googleGcs credentials not found in config. Using default credentials provider.',
      );
      storage = new GoogleCloud.Storage({
        userAgent: `backstage/backend-defaults.GoogleGcsUrlReader/${packageinfo.version}`,
      });
    } else {
      storage = new GoogleCloud.Storage({
        credentials: {
          client_email: gcsConfig.clientEmail || undefined,
          private_key: gcsConfig.privateKey || undefined,
        },
        userAgent: `backstage/backend-defaults.GoogleGcsUrlReader/${packageinfo.version}`,
      });
    }
    const reader = new GoogleGcsUrlReader(gcsConfig, storage);
    const predicate = (url: URL) => url.host === GOOGLE_GCS_HOST;
    return [{ reader, predicate }];
  };

  constructor(
    private readonly integration: GoogleGcsIntegrationConfig,
    private readonly storage: GoogleCloud.Storage,
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
    _options?: UrlReaderServiceReadUrlOptions,
  ): Promise<UrlReaderServiceReadUrlResponse> {
    // TODO etag is not implemented yet.
    const stream = this.readStreamFromUrl(url);
    return ReadUrlResponseFactory.fromReadable(stream);
  }

  async readTree(): Promise<UrlReaderServiceReadTreeResponse> {
    throw new Error('GcsUrlReader does not implement readTree');
  }

  async search(
    url: string,
    options?: UrlReaderServiceSearchOptions,
  ): Promise<UrlReaderServiceSearchResponse> {
    const { bucket, key: pattern } = parseURL(url);

    // If it's a direct URL we use readUrl instead
    if (!pattern?.match(/[*?]/)) {
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
      } catch (error) {
        assertError(error);
        if (error.name === 'NotFoundError') {
          return {
            files: [],
            etag: '',
          };
        }
        throw error;
      }
    }

    if (!pattern.endsWith('*') || pattern.indexOf('*') !== pattern.length - 1) {
      throw new Error('GcsUrlReader only supports prefix-based searches');
    }

    const [files] = await this.storage.bucket(bucket).getFiles({
      autoPaginate: true,
      prefix: pattern.split('*').join(''),
    });

    return {
      files: files.map(file => {
        const fullUrl = ['https:/', GOOGLE_GCS_HOST, bucket, file.name].join(
          '/',
        );
        return {
          url: fullUrl,
          content: async () => {
            const readResponse = await this.readUrl(fullUrl);
            return readResponse.buffer();
          },
        };
      }),
      // TODO etag is not implemented yet.
      etag: 'NOT/IMPLEMENTED',
    };
  }

  toString() {
    const key = this.integration.privateKey;
    return `googleGcs{host=${GOOGLE_GCS_HOST},authed=${Boolean(key)}}`;
  }
}
