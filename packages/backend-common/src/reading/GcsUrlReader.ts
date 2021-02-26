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

import { Storage } from '@google-cloud/storage';
import {
  ReaderFactory,
  ReadTreeResponse,
  SearchResponse,
  UrlReader,
} from './types';
import getRawBody from 'raw-body';
import { Logger } from 'winston';

const parseURL = (
  url: string,
): { host: string; bucket: string; key: string } => {
  const { host, pathname } = new URL(url);

  if (host !== 'storage.cloud.google.com') {
    throw new Error(`not a valid GCS URL: ${url}`);
  }

  const [, bucket, ...key] = pathname.split('/');
  return {
    host: host,
    bucket,
    key: key.join('/'),
  };
};

export class GcsUrlReader implements UrlReader {
  static factory: ReaderFactory = ({ config, logger }) => {
    if (!config.has('integrations.gcs')) {
      return [];
    }
    return config
      .getConfigArray('integrations.gcs')
      .filter(integration => {
        if (!integration.has('clientEmail') || !integration.has('privateKey')) {
          logger.warn(
            "Skipping gcs integration, Missing required config value at 'integration.gcs.clientEmail' or 'integration.gcs.privateKey'",
          );
          return false;
        }
        return true;
      })
      .map(integration => {
        const privKey = integration
          .getOptionalString('privateKey')
          ?.split('\\n')
          .join('\n');

        const storage = new Storage({
          credentials: {
            client_email: integration.getOptionalString('clientEmail'),
            private_key: privKey,
          },
        });
        const reader = new GcsUrlReader(storage, logger);
        const host =
          integration.getOptionalString('host') || 'storage.cloud.google.com';

        logger.info('Configuring integration, gcs');
        const predicate = (url: URL) => url.host === host;
        return { reader, predicate };
      });
  };

  constructor(
    private readonly storage: Storage,
    private readonly logger: Logger,
  ) {}

  async read(url: string): Promise<Buffer> {
    try {
      const { bucket, key } = parseURL(url);

      this.logger.info('Reading GCS Location');
      return await getRawBody(
        this.storage.bucket(bucket).file(key).createReadStream(),
      );
    } catch (error) {
      this.logger.warn(error.stack);
      throw new Error(`unable to read gcs file from ${url}`);
    }
  }

  async readTree(): Promise<ReadTreeResponse> {
    throw new Error('GcsUrlReader does not implement readTree');
  }

  async search(): Promise<SearchResponse> {
    throw new Error('GcsUrlReader does not implement readTree');
  }

  toString() {
    return `gcs{host=storage.cloud.google.com,authed=true}}`;
  }
}
