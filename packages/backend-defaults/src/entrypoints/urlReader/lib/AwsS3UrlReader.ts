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

import {
  UrlReaderService,
  UrlReaderServiceReadTreeOptions,
  UrlReaderServiceReadTreeResponse,
  UrlReaderServiceReadUrlOptions,
  UrlReaderServiceReadUrlResponse,
  UrlReaderServiceSearchOptions,
  UrlReaderServiceSearchResponse,
} from '@backstage/backend-plugin-api';
import { ReaderFactory, ReadTreeResponseFactory } from './types';
import {
  AwsCredentialsManager,
  DefaultAwsCredentialsManager,
} from '@backstage/integration-aws-node';
import {
  AwsS3Integration,
  ScmIntegrations,
  AwsS3IntegrationConfig,
} from '@backstage/integration';
import {
  assertError,
  ForwardedError,
  NotModifiedError,
} from '@backstage/errors';
import { fromTemporaryCredentials } from '@aws-sdk/credential-providers';
import { AwsCredentialIdentityProvider } from '@aws-sdk/types';
import {
  S3Client,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  GetObjectCommand,
  GetObjectCommandInput,
} from '@aws-sdk/client-s3';
import { AbortController } from '@aws-sdk/abort-controller';
import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';
import { Readable } from 'stream';
import { relative } from 'path/posix';

export const DEFAULT_REGION = 'us-east-1';

/**
 * Path style URLs: https://s3.(region).amazonaws.com/(bucket)/(key)
 * The region can also be on the old form: https://s3-(region).amazonaws.com/(bucket)/(key)
 * Virtual hosted style URLs: https://(bucket).s3.(region).amazonaws.com/(key)
 * See https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#path-style-access
 */
export function parseUrl(
  url: string,
  config: AwsS3IntegrationConfig,
): { path: string; bucket: string; region: string } {
  const parsedUrl = new URL(url);

  /**
   * Removes the leading '/' from the pathname to be processed
   * as a parameter by AWS S3 SDK getObject method.
   */
  const pathname = parsedUrl.pathname.substring(1);
  const host = parsedUrl.host;

  // Treat Amazon hosted separately because it has special region logic
  if (config.host === 'amazonaws.com' || config.host === 'amazonaws.com.cn') {
    const match = host.match(
      /^(?:([a-z0-9.-]+)\.)?s3(?:[.-]([a-z0-9-]+))?\.amazonaws\.com(\.cn)?$/,
    );
    if (!match) {
      throw new Error(`Invalid AWS S3 URL ${url}`);
    }

    const [, hostBucket, hostRegion] = match;

    if (config.s3ForcePathStyle || !hostBucket) {
      const slashIndex = pathname.indexOf('/');
      if (slashIndex < 0) {
        throw new Error(
          `Invalid path-style AWS S3 URL ${url}, does not contain bucket in the path`,
        );
      }

      return {
        path: pathname.substring(slashIndex + 1),
        bucket: pathname.substring(0, slashIndex),
        region: hostRegion ?? DEFAULT_REGION,
      };
    }

    return {
      path: pathname,
      bucket: hostBucket,
      region: hostRegion ?? DEFAULT_REGION,
    };
  }

  const usePathStyle =
    config.s3ForcePathStyle || host.length === config.host.length;

  if (usePathStyle) {
    const slashIndex = pathname.indexOf('/');
    if (slashIndex < 0) {
      throw new Error(
        `Invalid path-style AWS S3 URL ${url}, does not contain bucket in the path`,
      );
    }

    return {
      path: pathname.substring(slashIndex + 1),
      bucket: pathname.substring(0, slashIndex),
      region: DEFAULT_REGION,
    };
  }

  return {
    path: pathname,
    bucket: host.substring(0, host.length - config.host.length - 1),
    region: DEFAULT_REGION,
  };
}

/**
 * Implements a {@link @backstage/backend-plugin-api#UrlReaderService} for AWS S3 buckets.
 *
 * @public
 */
export class AwsS3UrlReader implements UrlReaderService {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const integrations = ScmIntegrations.fromConfig(config);
    const credsManager = DefaultAwsCredentialsManager.fromConfig(config);

    return integrations.awsS3.list().map(integration => {
      const reader = new AwsS3UrlReader(credsManager, integration, {
        treeResponseFactory,
      });
      const predicate = (url: URL) =>
        url.host.endsWith(integration.config.host);
      return { reader, predicate };
    });
  };

  constructor(
    private readonly credsManager: AwsCredentialsManager,
    private readonly integration: AwsS3Integration,
    private readonly deps: {
      treeResponseFactory: ReadTreeResponseFactory;
    },
  ) {}

  /**
   * If accessKeyId and secretAccessKey are missing, the standard credentials provider chain will be used:
   * https://docs.aws.amazon.com/AWSJavaSDK/latest/javadoc/com/amazonaws/auth/DefaultAWSCredentialsProviderChain.html
   */
  private static buildStaticCredentials(
    accessKeyId: string,
    secretAccessKey: string,
  ): AwsCredentialIdentityProvider {
    return async () => {
      return {
        accessKeyId,
        secretAccessKey,
      };
    };
  }

  private static async buildCredentials(
    credsManager: AwsCredentialsManager,
    region: string,
    integration?: AwsS3Integration,
  ): Promise<AwsCredentialIdentityProvider> {
    // Fall back to the default credential chain if neither account ID
    // nor explicit credentials are provided
    if (!integration) {
      return (await credsManager.getCredentialProvider()).sdkCredentialProvider;
    }

    const accessKeyId = integration.config.accessKeyId;
    const secretAccessKey = integration.config.secretAccessKey;
    let explicitCredentials: AwsCredentialIdentityProvider;
    if (accessKeyId && secretAccessKey) {
      explicitCredentials = AwsS3UrlReader.buildStaticCredentials(
        accessKeyId,
        secretAccessKey,
      );
    } else {
      explicitCredentials = (await credsManager.getCredentialProvider())
        .sdkCredentialProvider;
    }

    const roleArn = integration.config.roleArn;
    if (roleArn) {
      return fromTemporaryCredentials({
        masterCredentials: explicitCredentials,
        params: {
          RoleSessionName: 'backstage-aws-s3-url-reader',
          RoleArn: roleArn,
          ExternalId: integration.config.externalId,
        },
        clientConfig: { region },
      });
    }

    return explicitCredentials;
  }

  private async buildS3Client(
    credsManager: AwsCredentialsManager,
    region: string,
    integration: AwsS3Integration,
  ): Promise<S3Client> {
    const credentials = await AwsS3UrlReader.buildCredentials(
      credsManager,
      region,
      integration,
    );

    const s3 = new S3Client({
      customUserAgent: 'backstage-aws-s3-url-reader',
      region: region,
      credentials: credentials,
      endpoint: integration.config.endpoint,
      forcePathStyle: integration.config.s3ForcePathStyle,
    });
    return s3;
  }

  private async retrieveS3ObjectData(stream: Readable): Promise<Readable> {
    return new Promise((resolve, reject) => {
      try {
        const chunks: any[] = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('error', (e: Error) =>
          reject(new ForwardedError('Unable to read stream', e)),
        );
        stream.on('end', () => resolve(Readable.from(Buffer.concat(chunks))));
      } catch (e) {
        throw new ForwardedError('Unable to parse the response data', e);
      }
    });
  }

  async read(url: string): Promise<Buffer> {
    const response = await this.readUrl(url);
    return response.buffer();
  }

  async readUrl(
    url: string,
    options?: UrlReaderServiceReadUrlOptions,
  ): Promise<UrlReaderServiceReadUrlResponse> {
    const { etag, lastModifiedAfter } = options ?? {};

    try {
      const { path, bucket, region } = parseUrl(url, this.integration.config);
      const s3Client = await this.buildS3Client(
        this.credsManager,
        region,
        this.integration,
      );
      const abortController = new AbortController();

      const params: GetObjectCommandInput = {
        Bucket: bucket,
        Key: path,
        ...(etag && { IfNoneMatch: etag }),
        ...(lastModifiedAfter && {
          IfModifiedSince: lastModifiedAfter,
        }),
      };

      options?.signal?.addEventListener('abort', () => abortController.abort());
      const getObjectCommand = new GetObjectCommand(params);
      const response = await s3Client.send(getObjectCommand, {
        abortSignal: abortController.signal,
      });

      const s3ObjectData = await this.retrieveS3ObjectData(
        response.Body as Readable,
      );

      return ReadUrlResponseFactory.fromReadable(s3ObjectData, {
        etag: response.ETag,
        lastModifiedAt: response.LastModified,
      });
    } catch (e) {
      if (e.$metadata && e.$metadata.httpStatusCode === 304) {
        throw new NotModifiedError();
      }

      throw new ForwardedError('Could not retrieve file from S3', e);
    }
  }

  async readTree(
    url: string,
    options?: UrlReaderServiceReadTreeOptions,
  ): Promise<UrlReaderServiceReadTreeResponse> {
    try {
      const { path, bucket, region } = parseUrl(url, this.integration.config);
      const s3Client = await this.buildS3Client(
        this.credsManager,
        region,
        this.integration,
      );
      const abortController = new AbortController();
      const allObjects: String[] = [];
      const responses = [];
      let continuationToken: string | undefined;
      let output: ListObjectsV2CommandOutput;
      do {
        const listObjectsV2Command = new ListObjectsV2Command({
          Bucket: bucket,
          ContinuationToken: continuationToken,
          Prefix: path,
        });
        options?.signal?.addEventListener('abort', () =>
          abortController.abort(),
        );
        output = await s3Client.send(listObjectsV2Command, {
          abortSignal: abortController.signal,
        });
        if (output.Contents) {
          output.Contents.forEach(contents => {
            allObjects.push(contents.Key!);
          });
        }
        continuationToken = output.NextContinuationToken;
      } while (continuationToken);

      for (let i = 0; i < allObjects.length; i++) {
        const getObjectCommand = new GetObjectCommand({
          Bucket: bucket,
          Key: String(allObjects[i]),
        });
        const response = await s3Client.send(getObjectCommand);
        const s3ObjectData = await this.retrieveS3ObjectData(
          response.Body as Readable,
        );

        responses.push({
          data: s3ObjectData,
          path: relative(path, String(allObjects[i])),
          lastModifiedAt: response?.LastModified ?? undefined,
        });
      }

      return await this.deps.treeResponseFactory.fromReadableArray(responses);
    } catch (e) {
      throw new ForwardedError('Could not retrieve file tree from S3', e);
    }
  }

  async search(
    url: string,
    options?: UrlReaderServiceSearchOptions,
  ): Promise<UrlReaderServiceSearchResponse> {
    const { path } = parseUrl(url, this.integration.config);

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

  toString() {
    const secretAccessKey = this.integration.config.secretAccessKey;
    return `awsS3{host=${this.integration.config.host},authed=${Boolean(
      secretAccessKey,
    )}}`;
  }
}
