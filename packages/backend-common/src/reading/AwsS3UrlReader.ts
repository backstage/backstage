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

// note: We do the import like this so that we don't get issues destructuring
// and it not being mocked by the aws-sdk-mock package which is unfortunate.
import aws from 'aws-sdk';
import { CredentialsOptions } from 'aws-sdk/lib/credentials';
import {
  ReaderFactory,
  ReadTreeOptions,
  ReadTreeResponse,
  ReadTreeResponseFactory,
  ReadUrlOptions,
  ReadUrlResponse,
  SearchResponse,
  UrlReader,
} from './types';
import {
  AwsS3Integration,
  parseAwsS3Url,
  ScmIntegrations,
} from '@backstage/integration';
import { ForwardedError, NotModifiedError } from '@backstage/errors';
import { ListObjectsV2Output, ObjectList } from 'aws-sdk/clients/s3';
import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';

/**
 *
 * Use parseAwsS3Url directly from @backstage/integration package instead
 *
 * @public
 * @deprecated
 */
export const parseUrl = parseAwsS3Url;

/**
 * Implements a {@link UrlReader} for AWS S3 buckets.
 *
 * @public
 */
export class AwsS3UrlReader implements UrlReader {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const integrations = ScmIntegrations.fromConfig(config);

    return integrations.awsS3.list().map(integration => {
      const credentials = AwsS3UrlReader.buildCredentials(integration);

      const s3 = new aws.S3({
        apiVersion: '2006-03-01',
        credentials,
        endpoint: integration.config.endpoint,
        s3ForcePathStyle: integration.config.s3ForcePathStyle,
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
      s3: aws.S3;
      treeResponseFactory: ReadTreeResponseFactory;
    },
  ) {}

  /**
   * If accessKeyId and secretAccessKey are missing, the standard credentials provider chain will be used:
   * https://docs.aws.amazon.com/AWSJavaSDK/latest/javadoc/com/amazonaws/auth/DefaultAWSCredentialsProviderChain.html
   */
  private static buildCredentials(
    integration?: AwsS3Integration,
  ): aws.Credentials | CredentialsOptions | undefined {
    if (!integration) {
      return undefined;
    }

    const accessKeyId = integration.config.accessKeyId;
    const secretAccessKey = integration.config.secretAccessKey;
    let explicitCredentials: aws.Credentials | undefined;

    if (accessKeyId && secretAccessKey) {
      explicitCredentials = new aws.Credentials({
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
          ExternalId: integration.config.externalId,
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
      const { path, bucket, region } = parseAwsS3Url(
        url,
        this.integration.config,
      );
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

      const request = this.deps.s3.getObject(params);
      options?.signal?.addEventListener('abort', () => request.abort());

      // Since we're consuming the read stream we need to consume headers and errors via events.
      const etagPromise = new Promise<string | undefined>((resolve, reject) => {
        request.on('httpHeaders', (status, headers) => {
          if (status < 400) {
            if (status === 200) {
              resolve(headers.etag);
            } else if (status !== 304 /* not modified */) {
              reject(
                new Error(
                  `S3 readUrl request received unexpected status '${status}' in response`,
                ),
              );
            }
          }
        });
        request.on('error', error => reject(error));
        request.on('complete', () =>
          reject(
            new Error('S3 readUrl request completed without receiving headers'),
          ),
        );
      });

      const stream = request.createReadStream();
      stream.on('error', () => {
        // The AWS SDK forwards request errors to the stream, so we need to
        // ignore those errors here or the process will crash.
      });

      return ReadUrlResponseFactory.fromReadable(stream, {
        etag: await etagPromise,
      });
    } catch (e) {
      if (e.statusCode === 304) {
        throw new NotModifiedError();
      }

      throw new ForwardedError('Could not retrieve file from S3', e);
    }
  }

  async readTree(
    url: string,
    options?: ReadTreeOptions,
  ): Promise<ReadTreeResponse> {
    try {
      const { path, bucket, region } = parseAwsS3Url(
        url,
        this.integration.config,
      );
      const allObjects: ObjectList = [];
      const responses = [];
      let continuationToken: string | undefined;
      let output: ListObjectsV2Output;
      do {
        aws.config.update({ region: region });
        const request = this.deps.s3.listObjectsV2({
          Bucket: bucket,
          ContinuationToken: continuationToken,
          Prefix: path,
        });
        options?.signal?.addEventListener('abort', () => request.abort());
        output = await request.promise();
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
