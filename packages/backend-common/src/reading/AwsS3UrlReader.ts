/*
 * Copyright 2021 The Backstage Authors
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

import aws, { Credentials, S3 } from 'aws-sdk';
import {
  ReaderFactory,
  ReadTreeResponse,
  SearchResponse,
  UrlReader,
} from './types';
import getRawBody from 'raw-body';
import {
  AwsS3IntegrationConfig,
  readAwsS3IntegrationConfig,
} from '@backstage/integration';

const AMAZON_AWS_HOST = '.amazonaws.com';

const parseURL = (
  url: string,
): { path: string; bucket: string; region: string } => {
  let { host, pathname } = new URL(url);

  /**
   * Removes the trailing '/' from the pathname to be processed
   * by AWS S3 SDK methods.
   */
  pathname = pathname.substr(1);
  /** *
   * This checks that the given URL is a valid S3 object url.
   * Format of a Valid URL: https://bucket-name.s3.Region.amazonaws.com/keyname
   */
  const validHost = new RegExp(
    /^[a-z\d][a-z\d\.-]{1,61}[a-z\d]\.s3\.[a-z\d-]+\.amazonaws.com$/,
  );
  if (!validHost.test(host)) {
    throw new Error(`not a valid AWS S3 URL: ${url}`);
  }

  const [bucket] = host.split(/\.s3\.[a-z\d-]+\.amazonaws.com/);
  host = host.substring(bucket.length);
  const [, , region, ,] = host.split('.');

  return {
    path: pathname,
    bucket: bucket,
    region: region,
  };
};

export class AwsS3UrlReader implements UrlReader {
  static factory: ReaderFactory = ({ config, logger }) => {
    if (!config.has('integrations.awsS3')) {
      return [];
    }
    const awsS3Config = readAwsS3IntegrationConfig(
      config.getConfig('integrations.awsS3'),
    );
    let s3: S3;
    if (!awsS3Config.accessKeyId || !awsS3Config.secretAccessKey) {
      logger.debug(
        'integrations.awsS3 not found in app config. AWS S3 integration will use default AWS credentials if set in environment.',
      );
      s3 = new S3({});
    } else {
      const creds = new Credentials({
        accessKeyId: awsS3Config.accessKeyId,
        secretAccessKey: awsS3Config.secretAccessKey,
      });
      s3 = new S3({
        apiVersion: '2006-03-01',
        credentials: creds,
      });
    }
    const reader = new AwsS3UrlReader(awsS3Config, s3);
    const predicate = (url: URL) => url.host.endsWith(AMAZON_AWS_HOST);
    return [{ reader, predicate }];
  };

  constructor(
    private readonly integration: AwsS3IntegrationConfig,
    private readonly s3: S3,
  ) {}

  async read(url: string): Promise<Buffer> {
    try {
      const { path, bucket, region } = parseURL(url);
      aws.config.update({ region: region });

      const params = {
        Bucket: bucket,
        Key: path,
      };
      return await getRawBody(this.s3.getObject(params).createReadStream());
    } catch (e) {
      throw new Error(`Could not retrieve file from S3: ${e.message}`);
    }
  }

  async readTree(): Promise<ReadTreeResponse> {
    throw new Error('AwsS3Reader does not implement readTree');
  }

  async search(): Promise<SearchResponse> {
    throw new Error('AwsS3Reader does not implement search');
  }

  toString() {
    const secretAccessKey = this.integration.secretAccessKey;
    return `awsS3{host=${AMAZON_AWS_HOST},authed=${Boolean(secretAccessKey)}}`;
  }
}
