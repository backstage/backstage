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
import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { assertError, ForwardedError } from '@backstage/errors';
import {
  AwsCredentialsManager,
  DefaultAwsCredentialsManager,
} from '@backstage/integration-aws-node';
import {
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutObjectCommandInput,
  ListObjectsV2CommandOutput,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';
import { fromTemporaryCredentials } from '@aws-sdk/credential-providers';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import { Upload } from '@aws-sdk/lib-storage';
import { AwsCredentialIdentityProvider } from '@aws-sdk/types';
import { HttpsProxyAgent } from 'hpagent';
import express from 'express';
import fs from 'fs-extra';
import JSON5 from 'json5';
import createLimiter from 'p-limit';
import path from 'path';
import { Readable } from 'stream';
import {
  bulkStorageOperation,
  getCloudPathForLocalPath,
  getFileTreeRecursively,
  getHeadersForFileExtension,
  getStaleFiles,
  isValidContentPath,
  lowerCaseEntityTriplet,
  lowerCaseEntityTripletInStoragePath,
  normalizeExternalStorageRootPath,
} from './helpers';
import {
  PublisherBase,
  PublishRequest,
  PublishResponse,
  ReadinessResponse,
  TechDocsMetadata,
} from './types';
import { LoggerService } from '@backstage/backend-plugin-api';

const streamToBuffer = (stream: Readable): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const chunks: any[] = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('error', (e: Error) =>
        reject(new ForwardedError('Unable to read stream', e)),
      );
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    } catch (e) {
      throw new ForwardedError('Unable to parse the response data', e);
    }
  });
};

export class AwsS3Publish implements PublisherBase {
  private readonly storageClient: S3Client;
  private readonly bucketName: string;
  private readonly legacyPathCasing: boolean;
  private readonly logger: LoggerService;
  private readonly bucketRootPath: string;
  private readonly sse?: 'aws:kms' | 'AES256';

  constructor(options: {
    storageClient: S3Client;
    bucketName: string;
    legacyPathCasing: boolean;
    logger: LoggerService;
    bucketRootPath: string;
    sse?: 'aws:kms' | 'AES256';
  }) {
    this.storageClient = options.storageClient;
    this.bucketName = options.bucketName;
    this.legacyPathCasing = options.legacyPathCasing;
    this.logger = options.logger;
    this.bucketRootPath = options.bucketRootPath;
    this.sse = options.sse;
  }

  static async fromConfig(
    config: Config,
    logger: LoggerService,
  ): Promise<PublisherBase> {
    let bucketName = '';
    try {
      bucketName = config.getString('techdocs.publisher.awsS3.bucketName');
    } catch (error) {
      throw new Error(
        "Since techdocs.publisher.type is set to 'awsS3' in your app config, " +
          'techdocs.publisher.awsS3.bucketName is required.',
      );
    }

    const bucketRootPath = normalizeExternalStorageRootPath(
      config.getOptionalString('techdocs.publisher.awsS3.bucketRootPath') || '',
    );

    const sse = config.getOptionalString('techdocs.publisher.awsS3.sse') as
      | 'aws:kms'
      | 'AES256'
      | undefined;

    // AWS Region is an optional config. If missing, default AWS env variable AWS_REGION
    // or AWS shared credentials file at ~/.aws/credentials will be used.
    const region = config.getOptionalString('techdocs.publisher.awsS3.region');

    // Credentials can optionally be configured by specifying the AWS account ID, which will retrieve credentials
    // for the account from the 'aws' section of the app config.
    // Credentials can also optionally be directly configured in the techdocs awsS3 config, but this method is
    // deprecated.
    // If no credentials are configured, the AWS SDK V3's default credential chain will be used.
    const accountId = config.getOptionalString(
      'techdocs.publisher.awsS3.accountId',
    );
    const credentialsConfig = config.getOptionalConfig(
      'techdocs.publisher.awsS3.credentials',
    );
    const credsManager = DefaultAwsCredentialsManager.fromConfig(config);
    const sdkCredentialProvider = await AwsS3Publish.buildCredentials(
      credsManager,
      accountId,
      credentialsConfig,
      region,
    );

    // AWS endpoint is an optional config. If missing, the default endpoint is built from
    // the configured region.
    const endpoint = config.getOptionalString(
      'techdocs.publisher.awsS3.endpoint',
    );

    // AWS HTTPS proxy is an optional config. If missing, no proxy is used
    const httpsProxy = config.getOptionalString(
      'techdocs.publisher.awsS3.httpsProxy',
    );

    // AWS forcePathStyle is an optional config. If missing, it defaults to false. Needs to be enabled for cases
    // where endpoint url points to locally hosted S3 compatible storage like Localstack
    const forcePathStyle = config.getOptionalBoolean(
      'techdocs.publisher.awsS3.s3ForcePathStyle',
    );

    // AWS MAX ATTEMPTS is an optional config. If missing, default value of 3 is used
    const maxAttempts = config.getOptionalNumber(
      'techdocs.publisher.awsS3.maxAttempts',
    );

    const storageClient = new S3Client({
      customUserAgent: 'backstage-aws-techdocs-s3-publisher',
      credentialDefaultProvider: () => sdkCredentialProvider,
      ...(region && { region }),
      ...(endpoint && { endpoint }),
      ...(forcePathStyle && { forcePathStyle }),
      ...(maxAttempts && { maxAttempts }),
      ...(httpsProxy && {
        requestHandler: new NodeHttpHandler({
          httpsAgent: new HttpsProxyAgent({ proxy: httpsProxy }),
        }),
      }),
    });

    const legacyPathCasing =
      config.getOptionalBoolean(
        'techdocs.legacyUseCaseSensitiveTripletPaths',
      ) || false;

    return new AwsS3Publish({
      storageClient,
      bucketName,
      bucketRootPath,
      legacyPathCasing,
      logger,
      sse,
    });
  }

  private static buildStaticCredentials(
    accessKeyId: string,
    secretAccessKey: string,
  ): AwsCredentialIdentityProvider {
    return async () => {
      return Promise.resolve({
        accessKeyId,
        secretAccessKey,
      });
    };
  }

  private static async buildCredentials(
    credsManager: AwsCredentialsManager,
    accountId?: string,
    config?: Config,
    region?: string,
  ): Promise<AwsCredentialIdentityProvider> {
    // Pull credentials for the specified account ID from the 'aws' config section
    if (accountId) {
      return (await credsManager.getCredentialProvider({ accountId }))
        .sdkCredentialProvider;
    }

    // Fall back to the default credential chain if neither account ID
    // nor explicit credentials are provided
    if (!config) {
      return (await credsManager.getCredentialProvider()).sdkCredentialProvider;
    }

    // Pull credentials from the techdocs config section (deprecated)
    const accessKeyId = config.getOptionalString('accessKeyId');
    const secretAccessKey = config.getOptionalString('secretAccessKey');
    const explicitCredentials: AwsCredentialIdentityProvider =
      accessKeyId && secretAccessKey
        ? AwsS3Publish.buildStaticCredentials(accessKeyId, secretAccessKey)
        : (await credsManager.getCredentialProvider()).sdkCredentialProvider;

    const roleArn = config.getOptionalString('roleArn');
    if (roleArn) {
      return fromTemporaryCredentials({
        masterCredentials: explicitCredentials,
        params: {
          RoleSessionName: 'backstage-aws-techdocs-s3-publisher',
          RoleArn: roleArn,
        },
        clientConfig: { region },
      });
    }

    return explicitCredentials;
  }

  /**
   * Check if the defined bucket exists. Being able to connect means the configuration is good
   * and the storage client will work.
   */
  async getReadiness(): Promise<ReadinessResponse> {
    try {
      await this.storageClient.send(
        new HeadBucketCommand({ Bucket: this.bucketName }),
      );

      this.logger.info(
        `Successfully connected to the AWS S3 bucket ${this.bucketName}.`,
      );

      return { isAvailable: true };
    } catch (error) {
      this.logger.error(
        `Could not retrieve metadata about the AWS S3 bucket ${this.bucketName}. ` +
          'Make sure the bucket exists. Also make sure that authentication is setup either by ' +
          'explicitly defining credentials and region in techdocs.publisher.awsS3 in app config or ' +
          'by using environment variables. Refer to https://backstage.io/docs/features/techdocs/using-cloud-storage',
      );
      this.logger.error(`from AWS client library`, error);
      return {
        isAvailable: false,
      };
    }
  }

  /**
   * Upload all the files from the generated `directory` to the S3 bucket.
   * Directory structure used in the bucket is - entityNamespace/entityKind/entityName/index.html
   */
  async publish({
    entity,
    directory,
  }: PublishRequest): Promise<PublishResponse> {
    const objects: string[] = [];
    const useLegacyPathCasing = this.legacyPathCasing;
    const bucketRootPath = this.bucketRootPath;
    const sse = this.sse;

    // First, try to retrieve a list of all individual files currently existing
    let existingFiles: string[] = [];
    try {
      const remoteFolder = getCloudPathForLocalPath(
        entity,
        undefined,
        useLegacyPathCasing,
        bucketRootPath,
      );
      existingFiles = await this.getAllObjectsFromBucket({
        prefix: remoteFolder,
      });
    } catch (e) {
      assertError(e);
      this.logger.error(
        `Unable to list files for Entity ${entity.metadata.name}: ${e.message}`,
      );
    }

    // Then, merge new files into the same folder
    let absoluteFilesToUpload;
    try {
      // Remove the absolute path prefix of the source directory
      // Path of all files to upload, relative to the root of the source directory
      // e.g. ['index.html', 'sub-page/index.html', 'assets/images/favicon.png']
      absoluteFilesToUpload = await getFileTreeRecursively(directory);

      await bulkStorageOperation(
        async absoluteFilePath => {
          const relativeFilePath = path.relative(directory, absoluteFilePath);
          const fileStream = fs.createReadStream(absoluteFilePath);

          const params: PutObjectCommandInput = {
            Bucket: this.bucketName,
            Key: getCloudPathForLocalPath(
              entity,
              relativeFilePath,
              useLegacyPathCasing,
              bucketRootPath,
            ),
            Body: fileStream,
            ...(sse && { ServerSideEncryption: sse }),
          };

          objects.push(params.Key!);

          const upload = new Upload({
            client: this.storageClient,
            params,
          });
          return upload.done();
        },
        absoluteFilesToUpload,
        { concurrencyLimit: 10 },
      );

      this.logger.info(
        `Successfully uploaded all the generated files for Entity ${entity.metadata.name}. Total number of files: ${absoluteFilesToUpload.length}`,
      );
    } catch (e) {
      const errorMessage = `Unable to upload file(s) to AWS S3. ${e}`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    // Last, try to remove the files that were *only* present previously
    try {
      const relativeFilesToUpload = absoluteFilesToUpload.map(
        absoluteFilePath =>
          getCloudPathForLocalPath(
            entity,
            path.relative(directory, absoluteFilePath),
            useLegacyPathCasing,
            bucketRootPath,
          ),
      );
      const staleFiles = getStaleFiles(relativeFilesToUpload, existingFiles);

      await bulkStorageOperation(
        async relativeFilePath => {
          return await this.storageClient.send(
            new DeleteObjectCommand({
              Bucket: this.bucketName,
              Key: relativeFilePath,
            }),
          );
        },
        staleFiles,
        { concurrencyLimit: 10 },
      );

      this.logger.info(
        `Successfully deleted stale files for Entity ${entity.metadata.name}. Total number of files: ${staleFiles.length}`,
      );
    } catch (error) {
      const errorMessage = `Unable to delete file(s) from AWS S3. ${error}`;
      this.logger.error(errorMessage);
    }
    return { objects };
  }

  async fetchTechDocsMetadata(
    entityName: CompoundEntityRef,
  ): Promise<TechDocsMetadata> {
    try {
      return await new Promise<TechDocsMetadata>(async (resolve, reject) => {
        const entityTriplet = `${entityName.namespace}/${entityName.kind}/${entityName.name}`;
        const entityDir = this.legacyPathCasing
          ? entityTriplet
          : lowerCaseEntityTriplet(entityTriplet);

        const entityRootDir = path.posix.join(this.bucketRootPath, entityDir);
        if (!isValidContentPath(this.bucketRootPath, entityRootDir)) {
          this.logger.error(
            `Invalid content path found while fetching TechDocs metadata: ${entityRootDir}`,
          );
          throw new Error(`Metadata Not Found`);
        }

        try {
          const resp = await this.storageClient.send(
            new GetObjectCommand({
              Bucket: this.bucketName,
              Key: `${entityRootDir}/techdocs_metadata.json`,
            }),
          );

          const techdocsMetadataJson = await streamToBuffer(
            resp.Body as Readable,
          );
          if (!techdocsMetadataJson) {
            throw new Error(
              `Unable to parse the techdocs metadata file ${entityRootDir}/techdocs_metadata.json.`,
            );
          }

          const techdocsMetadata = JSON5.parse(
            techdocsMetadataJson.toString('utf-8'),
          );

          resolve(techdocsMetadata);
        } catch (err) {
          assertError(err);
          this.logger.error(err.message);
          reject(new Error(err.message));
        }
      });
    } catch (e) {
      throw new ForwardedError('TechDocs metadata fetch failed', e);
    }
  }

  /**
   * Express route middleware to serve static files on a route in techdocs-backend.
   */
  docsRouter(): express.Handler {
    return async (req, res) => {
      const decodedUri = decodeURI(req.path.replace(/^\//, ''));

      // filePath example - /default/component/documented-component/index.html
      const filePathNoRoot = this.legacyPathCasing
        ? decodedUri
        : lowerCaseEntityTripletInStoragePath(decodedUri);

      // Prepend the root path to the relative file path
      const filePath = path.posix.join(this.bucketRootPath, filePathNoRoot);
      if (!isValidContentPath(this.bucketRootPath, filePath)) {
        this.logger.error(
          `Attempted to fetch TechDocs content for a file outside of the bucket root: ${filePathNoRoot}`,
        );
        res.status(404).send('File Not Found');
        return;
      }

      // Files with different extensions (CSS, HTML) need to be served with different headers
      const fileExtension = path.extname(filePath);
      const responseHeaders = getHeadersForFileExtension(fileExtension);

      try {
        const resp = await this.storageClient.send(
          new GetObjectCommand({ Bucket: this.bucketName, Key: filePath }),
        );

        // Inject response headers
        for (const [headerKey, headerValue] of Object.entries(
          responseHeaders,
        )) {
          res.setHeader(headerKey, headerValue);
        }

        res.send(await streamToBuffer(resp.Body as Readable));
      } catch (err) {
        assertError(err);
        this.logger.warn(
          `TechDocs S3 router failed to serve static files from bucket ${this.bucketName} at key ${filePath}: ${err.message}`,
        );
        res.status(404).send('File Not Found');
      }
    };
  }

  /**
   * A helper function which checks if index.html of an Entity's docs site is available. This
   * can be used to verify if there are any pre-generated docs available to serve.
   */
  async hasDocsBeenGenerated(entity: Entity): Promise<boolean> {
    try {
      const entityTriplet = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;
      const entityDir = this.legacyPathCasing
        ? entityTriplet
        : lowerCaseEntityTriplet(entityTriplet);

      const entityRootDir = path.posix.join(this.bucketRootPath, entityDir);
      if (!isValidContentPath(this.bucketRootPath, entityRootDir)) {
        this.logger.error(
          `Invalid content path found while checking if docs have been generated: ${entityRootDir}`,
        );
        return Promise.resolve(false);
      }

      await this.storageClient.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: `${entityRootDir}/index.html`,
        }),
      );
      return Promise.resolve(true);
    } catch (e) {
      return Promise.resolve(false);
    }
  }

  async migrateDocsCase({
    removeOriginal = false,
    concurrency = 25,
  }): Promise<void> {
    // Iterate through every file in the root of the publisher.
    const allObjects = await this.getAllObjectsFromBucket();
    const limiter = createLimiter(concurrency);
    await Promise.all(
      allObjects.map(f =>
        limiter(async file => {
          let newPath;
          try {
            newPath = lowerCaseEntityTripletInStoragePath(file);
          } catch (e) {
            assertError(e);
            this.logger.warn(e.message);
            return;
          }

          // If all parts are already lowercase, ignore.
          if (file === newPath) {
            return;
          }

          try {
            this.logger.debug(`Migrating ${file}`);
            await this.storageClient.send(
              new CopyObjectCommand({
                Bucket: this.bucketName,
                CopySource: [this.bucketName, file].join('/'),
                Key: newPath,
              }),
            );

            if (removeOriginal) {
              await this.storageClient.send(
                new DeleteObjectCommand({
                  Bucket: this.bucketName,
                  Key: file,
                }),
              );
            }
          } catch (e) {
            assertError(e);
            this.logger.warn(`Unable to migrate ${file}: ${e.message}`);
          }
        }, f),
      ),
    );
  }

  /**
   * Returns a list of all object keys from the configured bucket.
   */
  protected async getAllObjectsFromBucket(
    { prefix } = { prefix: '' },
  ): Promise<string[]> {
    const objects: string[] = [];
    let nextContinuation: string | undefined;
    let allObjects: ListObjectsV2CommandOutput;
    // Iterate through every file in the root of the publisher.
    do {
      allObjects = await this.storageClient.send(
        new ListObjectsV2Command({
          Bucket: this.bucketName,
          ContinuationToken: nextContinuation,
          ...(prefix ? { Prefix: prefix } : {}),
        }),
      );
      objects.push(
        ...(allObjects.Contents || []).map(f => f.Key || '').filter(f => !!f),
      );
      nextContinuation = allObjects.NextContinuationToken;
    } while (nextContinuation);

    return objects;
  }
}
