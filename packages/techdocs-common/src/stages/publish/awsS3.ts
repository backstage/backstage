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
import { Entity, EntityName } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { storage } from 'pkgcloud';
import express from 'express';
import fs from 'fs-extra';
import JSON5 from 'json5';
import createLimiter from 'p-limit';
import { CredentialsOptions } from 'aws-sdk/lib/credentials';
import path from 'path';
import { Readable } from 'stream';
import { Logger } from 'winston';
import { getFileTreeRecursively, getHeadersForFileExtension } from './helpers';
import { PublisherBase, PublishRequest, TechDocsMetadata } from './types';

const streamToBuffer = (stream: Readable): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const chunks: any[] = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    } catch (e) {
      throw new Error(`Unable to parse the response data ${e.message}`);
    }
  });
};

export class AwsS3Publish implements PublisherBase {
  static fromConfig(config: Config, logger: Logger): PublisherBase {
    let bucketName = '';
    try {
      bucketName = config.getString('techdocs.publisher.awsS3.bucketName');
    } catch (error) {
      throw new Error(
        "Since techdocs.publisher.type is set to 'openStackSwift' in your app config, " +
          'techdocs.publisher.openStackSwift.containerName is required.',
      );
    }

    // Credentials is an optional config. If missing, the default ways of authenticating AWS SDK V2 will be used.
    // 1. AWS environment variables
    // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-environment.html
    // 2. AWS shared credentials file at ~/.aws/credentials
    // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html
    // 3. IAM Roles for EC2
    // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-iam.html
    const credentialsConfig = config.getOptionalConfig(
      'techdocs.publisher.awsS3.credentials',
    );

    const storageClient = storage.createClient({
      provider: 'openstack',
      username: openStackSwiftConfig.getString('credentials.username'),
      password: openStackSwiftConfig.getString('credentials.password'),
      authUrl: openStackSwiftConfig.getString('authUrl'),
      keystoneAuthVersion:
        openStackSwiftConfig.getOptionalString('keystoneAuthVersion') || 'v3',
      domainId: openStackSwiftConfig.getOptionalString('domainId') || 'default',
      domainName:
        openStackSwiftConfig.getOptionalString('domainName') || 'Default',
      region: openStackSwiftConfig.getString('region'),
    });

    // Check if the defined container exists. Being able to connect means the configuration is good
    // and the storage client will work.
    storageClient.getContainer(containerName, (err, container) => {
      if (container) {
        logger.info(
          `Successfully connected to the OpenStack Swift container ${containerName}.`,
        );
      } else {
        logger.error(
          `Could not retrieve metadata about the OpenStack Swift container ${containerName}. ` +
            'Make sure the container exists. Also make sure that authentication is setup either by ' +
            'explicitly defining credentials and region in techdocs.publisher.openStackSwift in app config or ' +
            'by using environment variables. Refer to https://backstage.io/docs/features/techdocs/using-cloud-storage',
        );

        logger.error(`from OpenStack client library: ${err.message}`);
      }
    }

    // AWS Region is an optional config. If missing, default AWS env variable AWS_REGION
    // or AWS shared credentials file at ~/.aws/credentials will be used.
    const region = config.getOptionalString('techdocs.publisher.awsS3.region');

    const storageClient = new aws.S3({
      credentials,
      ...(region && {
        region,
      }),
    });

    // Check if the defined bucket exists. Being able to connect means the configuration is good
    // and the storage client will work.
    storageClient.headBucket(
      {
        Bucket: bucketName,
      },
      err => {
        if (err) {
          logger.error(
            `Could not retrieve metadata about the AWS S3 bucket ${bucketName}. ` +
              'Make sure the bucket exists. Also make sure that authentication is setup either by ' +
              'explicitly defining credentials and region in techdocs.publisher.awsS3 in app config or ' +
              'by using environment variables. Refer to https://backstage.io/docs/features/techdocs/using-cloud-storage',
          );
          logger.error(`from AWS client library: ${err.message}`);
          throw new Error();
        } else {
          logger.info(
            `Successfully connected to the AWS S3 bucket ${bucketName}.`,
          );
        }
      },
    );

    return new AwsS3Publish(storageClient, bucketName, logger);
  }

  constructor(
    private readonly storageClient: storage.Client,
    private readonly containerName: string,
    private readonly logger: Logger,
  ) {
    this.storageClient = storageClient;
    this.bucketName = bucketName;
    this.logger = logger;
  }

  /**
   * Upload all the files from the generated `directory` to the OpenStack Swift container.
   * Directory structure used in the bucket is - entityNamespace/entityKind/entityName/index.html
   */
  async publish({ entity, directory }: PublishRequest): Promise<void> {
    try {
      // Note: OpenStack Swift manages creation of parent directories if they do not exist.
      // So collecting path of only the files is good enough.
      const allFilesToUpload = await getFileTreeRecursively(directory);
      const limiter = createLimiter(10);
      const uploadPromises: Array<Promise<ManagedUpload.SendData>> = [];
      for (const filePath of allFilesToUpload) {
        // Remove the absolute path prefix of the source directory
        // Path of all files to upload, relative to the root of the source directory
        // e.g. ['index.html', 'sub-page/index.html', 'assets/images/favicon.png']
        const relativeFilePath = path.relative(directory, filePath);

        // Convert destination file path to a POSIX path for uploading.
        // S3 expects / as path separator and relativeFilePath will contain \\ on Windows.
        // https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
        const relativeFilePathPosix = relativeFilePath
          .split(path.sep)
          .join(path.posix.sep);

        // The / delimiter is intentional since it represents the cloud storage and not the local file system.
        const entityRootDir = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;
        const destination = `${entityRootDir}/${relativeFilePathPosix}`; // Swift container file relative path

        const params = {
          container: this.containerName,
          remote: destination,
        };

        // Rate limit the concurrent execution of file uploads to batches of 10 (per publish)
        const uploadFile = limiter(
          () =>
            new Promise((res, rej) => {
              const readStream = fs.createReadStream(filePath, 'utf8');

              const writeStream = this.storageClient.upload(params);

              writeStream.on('error', rej);

              writeStream.on('success', res);

              readStream.pipe(writeStream);
            }),
        );
        uploadPromises.push(uploadFile);
      }
      await Promise.all(uploadPromises);
      this.logger.info(
        `Successfully uploaded all the generated files for Entity ${entity.metadata.name}. Total number of files: ${allFilesToUpload.length}`,
      );
      return;
    } catch (e) {
      const errorMessage = `Unable to upload file(s) to AWS S3. ${e}`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  async fetchTechDocsMetadata(
    entityName: EntityName,
  ): Promise<TechDocsMetadata> {
    try {
      return await new Promise<TechDocsMetadata>(async (resolve, reject) => {
        const entityRootDir = `${entityName.namespace}/${entityName.kind}/${entityName.name}`;

        const stream = this.storageClient
          .getObject({
            Bucket: this.bucketName,
            Key: `${entityRootDir}/techdocs_metadata.json`,
          })
          .createReadStream();

        try {
          const techdocsMetadataJson = await streamToBuffer(stream);
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
          this.logger.error(err.message);
          reject(new Error(err.message));
        }
      });
    } catch (e) {
      throw new Error(`TechDocs metadata fetch failed, ${e.message}`);
    }
  }

  /**
   * Express route middleware to serve static files on a route in techdocs-backend.
   */
  docsRouter(): express.Handler {
    return async (req, res) => {
      // Trim the leading forward slash
      // filePath example - /default/Component/documented-component/index.html

      const filePath = req.path.replace(/^\//, '');

      // Files with different extensions (CSS, HTML) need to be served with different headers
      const fileExtension = path.extname(filePath);
      const responseHeaders = getHeadersForFileExtension(fileExtension);

      const stream = this.storageClient
        .getObject({ Bucket: this.bucketName, Key: filePath })
        .createReadStream();
      try {
        // Inject response headers
        for (const [headerKey, headerValue] of Object.entries(
          responseHeaders,
        )) {
          res.setHeader(headerKey, headerValue);
        }

        res.send(await streamToBuffer(stream));
      } catch (err) {
        this.logger.warn(err.message);
        res.status(404).json(err.message);
      }
    };
  }

  /**
   * A helper function which checks if index.html of an Entity's docs site is available. This
   * can be used to verify if there are any pre-generated docs available to serve.
   */
  async hasDocsBeenGenerated(entity: Entity): Promise<boolean> {
    try {
      const entityRootDir = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;

      return new Promise(res => {
        this.storageClient.getFile(
          this.containerName,
          `${entityRootDir}/index.html`,
          (err, file) => {
            if (!err && file) {
              res(true);
            } else {
              res(false);
              this.logger.warn(err.message);
            }
          },
        );
      });
    } catch (e) {
      return Promise.resolve(false);
    }
  }
}
