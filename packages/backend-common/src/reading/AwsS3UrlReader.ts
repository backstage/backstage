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
import { CredentialsOptions } from 'aws-sdk/lib/credentials';
import {
  ReaderFactory,
  ReadTreeResponse,
  ReadTreeResponseFactory,
  ReadUrlOptions,
  ReadUrlResponse,
  SearchResponse,
  UrlReader,
} from './types';
import getRawBody from 'raw-body';
import { AwsS3Integration, ScmIntegrations } from '@backstage/integration';
import { ForwardedError, NotModifiedError } from '@backstage/errors';
import { ListObjectsV2Output, ObjectList } from 'aws-sdk/clients/s3';

const parseURL = (
  url: string,
): { path: string; bucket: string; region: string } => {
  let { host, pathname } = new URL(url);

  /**
   * Removes the leading '/' from the pathname to be processed
   * as a parameter by AWS S3 SDK getObject method.
   */
  pathname = pathname.substr(1);

  /**
   * Checks that the given URL is a valid S3 object url.
   * Format of a Valid S3 URL: https://bucket-name.s3.Region.amazonaws.com/keyname
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
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const integrations = ScmIntegrations.fromConfig(config);

    return integrations.awsS3.list().map(integration => {
      const creds = AwsS3UrlReader.buildCredentials(integration);
      const s3 = new S3({
        apiVersion: '2006-03-01',
        credentials: creds,
      });
      const reader = new AwsS3UrlReader(integration, {
        s3,
        treeResponseFactory,
      });
      const predicate = (url: URL) =>
        url.host.endsWith(integration.config.host);
      return { reader, predicate };
    });
  };

  constructor(
    private readonly integration: AwsS3Integration,
    private readonly deps: {
      s3: S3;
      treeResponseFactory: ReadTreeResponseFactory;
    },
  ) {}

  /**
   * If accesKeyId and secretAccessKey are missing, the standard credentials provider chain will be used:
   * https://docs.aws.amazon.com/AWSJavaSDK/latest/javadoc/com/amazonaws/auth/DefaultAWSCredentialsProviderChain.html
   */
  private static buildCredentials(
    integration?: AwsS3Integration,
  ): Credentials | CredentialsOptions | undefined {
    if (!integration) {
      return undefined;
    }

    const accessKeyId = integration.config.accessKeyId;
    const secretAccessKey = integration.config.secretAccessKey;
    let explicitCredentials: Credentials | undefined;

    if (accessKeyId && secretAccessKey) {
      explicitCredentials = new Credentials({
        accessKeyId,
        secretAccessKey,
      });
    }

    const roleArn = integration.config.roleArn;
    if (roleArn) {
      return new aws.ChainableTemporaryCredentials({
        masterCredentials: explicitCredentials,
        params: {
          RoleSessionName: 'backstage-aws-s3-url-reader',
          RoleArn: roleArn,
        },
      });
    }

    return explicitCredentials;
  }

  async read(url: string): Promise<Buffer> {
    const response = await this.readUrl(url);
    return response.buffer();
  }

  async readUrl(
    url: string,
    options?: ReadUrlOptions,
  ): Promise<ReadUrlResponse> {
    try {
      const { path, bucket, region } = parseURL(url);
      aws.config.update({ region: region });

      let params;
      if (options?.etag) {
        params = {
          Bucket: bucket,
          Key: path,
          IfNoneMatch: options.etag,
        };
      } else {
        params = {
          Bucket: bucket,
          Key: path,
        };
      }

      const response = this.deps.s3.getObject(params);
      const buffer = await getRawBody(response.createReadStream());
      const etag = (await response.promise()).ETag;

      return {
        buffer: async () => buffer,
        etag: etag,
      };
    } catch (e) {
      if (e.statusCode === 304) {
        throw new NotModifiedError();
      }

      throw new ForwardedError('Could not retrieve file from S3', e);
    }
  }

  async readTree(url: string): Promise<ReadTreeResponse> {
    try {
      const { path, bucket, region } = parseURL(url);
      const allObjects: ObjectList = [];
      const responses = [];
      let continuationToken: string | undefined;
      let output: ListObjectsV2Output;
      do {
        aws.config.update({ region: region });
        output = await this.deps.s3
          .listObjectsV2({
            Bucket: bucket,
            ContinuationToken: continuationToken,
            Prefix: path,
          })
          .promise();
        if (output.Contents) {
          output.Contents.forEach(contents => {
            allObjects.push(contents);
          });
        }
        continuationToken = output.NextContinuationToken;
      } while (continuationToken);

      for (let i = 0; i < allObjects.length; i++) {
        const object = this.deps.s3.getObject({
          Bucket: bucket,
          Key: String(allObjects[i].Key),
        });
        responses.push({
          data: object.createReadStream(),
          path: String(allObjects[i].Key),
        });
      }

      return await this.deps.treeResponseFactory.fromReadableArray(responses);
    } catch (e) {
      throw new ForwardedError('Could not retrieve file tree from S3', e);
    }
  }

  async search(): Promise<SearchResponse> {
    throw new Error('AwsS3Reader does not implement search');
  }

  toString() {
    const secretAccessKey = this.integration.config.secretAccessKey;
    return `awsS3{host=${this.integration.config.host},authed=${Boolean(
      secretAccessKey,
    )}}`;
  }
}
