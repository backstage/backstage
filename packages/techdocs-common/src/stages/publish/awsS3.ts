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
import path from 'path';
import express from 'express';
import { PutObjectCommandOutput, S3 } from '@aws-sdk/client-s3';
import { Logger } from 'winston';
import { Entity, EntityName } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { getHeadersForFileExtension, getFileTreeRecursively } from './helpers';
import { PublisherBase, PublishRequest } from './types';
import fs from 'fs-extra';
import { Readable } from 'stream';

const streamToString = (stream: Readable): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });

export class AwsS3Publish implements PublisherBase {
  static fromConfig(config: Config, logger: Logger): PublisherBase {
    let region = null;
    let accessKeyId = null;
    let secretAccessKey = null;
    let bucketName = '';
    try {
      accessKeyId = config.getString(
        'techdocs.publisher.awsS3.credentials.accessKeyId',
      );
      secretAccessKey = config.getString(
        'techdocs.publisher.awsS3.credentials.secretAccessKey',
      );
      region = config.getOptionalString('techdocs.publisher.awsS3.region');
      bucketName = config.getString('techdocs.publisher.awsS3.bucketName');
    } catch (error) {
      throw new Error(
        "Since techdocs.publisher.type is set to 'awsS3' in your app config, " +
          'credentials and bucketName are required in techdocs.publisher.awsS3 ' +
          'required to authenticate with AWS S3.',
      );
    }

    const storageClient = new S3({
      credentials: { accessKeyId, secretAccessKey },
      ...(region && { region }),
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
              'Make sure the AWS project and the bucket exists and the access key located at the path ' +
              "techdocs.publisher.awsS3.credentials defined in app config has the role 'Storage Object Creator'. " +
              'Refer to https://backstage.io/docs/features/techdocs/using-cloud-storage',
          );
          throw new Error(`from AWS client library: ${err.message}`);
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
    private readonly storageClient: S3,
    private readonly bucketName: string,
    private readonly logger: Logger,
  ) {
    this.storageClient = storageClient;
    this.bucketName = bucketName;
    this.logger = logger;
  }

  /**
   * Upload all the files from the generated `directory` to the S3 bucket.
   * Directory structure used in the bucket is - entityNamespace/entityKind/entityName/index.html
   */
  async publish({ entity, directory }: PublishRequest): Promise<void> {
    try {
      // Note: S3 manages creation of parent directories if they do not exist.
      // So collecting path of only the files is good enough.
      const allFilesToUpload = await getFileTreeRecursively(directory);

      const uploadPromises: Array<Promise<PutObjectCommandOutput>> = [];

      for (const filePath of allFilesToUpload) {
        // Remove the absolute path prefix of the source directory
        // Path of all files to upload, relative to the root of the source directory
        // e.g. ['index.html', 'sub-page/index.html', 'assets/images/favicon.png']
        const relativeFilePath = filePath.replace(`${directory}/`, '');
        const entityRootDir = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;
        const destination = `${entityRootDir}/${relativeFilePath}`; // S3 Bucket file relative path

        const fileContent = await fs.readFile(filePath, 'utf8');

        const params = {
          Bucket: this.bucketName,
          Key: destination,
          Body: fileContent,
        };

        uploadPromises.push(this.storageClient.putObject(params));
      }
      await Promise.all(uploadPromises);
      this.logger.info(
        `Successfully uploaded all the generated files for Entity ${entity.metadata.name}. Total number of files: ${allFilesToUpload.length}`,
      );
      return;
    } catch (e) {
      const errorMessage = `Unable to upload file(s) to AWS S3. Error ${e.message}`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  async fetchTechDocsMetadata(entityName: EntityName): Promise<string> {
    try {
      return await new Promise<string>((resolve, reject) => {
        const entityRootDir = `${entityName.namespace}/${entityName.kind}/${entityName.name}`;

        this.storageClient
          .getObject({
            Bucket: this.bucketName,
            Key: `${entityRootDir}/techdocs_metadata.json`,
          })
          .then(async file => {
            const techdocsMetadataJson = await streamToString(
              file.Body as Readable,
            );

            if (!techdocsMetadataJson) {
              throw new Error(
                `Unable to parse the techdocs metadata file ${entityRootDir}/techdocs_metadata.json.`,
              );
            }

            resolve(techdocsMetadataJson);
          })
          .catch(err => {
            this.logger.error(err.message);
            reject(new Error(err.message));
          });
      });
    } catch (e) {
      throw new Error(`TechDocs metadata fetch failed, ${e.message}`);
    }
  }

  /**
   * Express route middleware to serve static files on a route in techdocs-backend.
   */
  docsRouter(): express.Handler {
    return (req, res) => {
      // Trim the leading forward slash
      // filePath example - /default/Component/documented-component/index.html
      const filePath = req.path.replace(/^\//, '');

      // Files with different extensions (CSS, HTML) need to be served with different headers
      const fileExtension = path.extname(filePath);
      const responseHeaders = getHeadersForFileExtension(fileExtension);

      this.storageClient
        .getObject({ Bucket: this.bucketName, Key: filePath })
        .then(async object => {
          const fileContent = await streamToString(object.Body as Readable);
          if (!fileContent) {
            throw new Error(`Unable to parse the file ${filePath}.`);
          }

          // Inject response headers
          for (const [headerKey, headerValue] of Object.entries(
            responseHeaders,
          )) {
            res.setHeader(headerKey, headerValue);
          }

          res.send(fileContent);
        })
        .catch(err => {
          this.logger.warn(err.message);
          res.status(404).send(err.message);
        });
    };
  }

  /**
   * A helper function which checks if index.html of an Entity's docs site is available. This
   * can be used to verify if there are any pre-generated docs available to serve.
   */
  async hasDocsBeenGenerated(entity: Entity): Promise<boolean> {
    try {
      const entityRootDir = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;
      await this.storageClient.headObject({
        Bucket: this.bucketName,
        Key: `${entityRootDir}/index.html`,
      });
      return Promise.resolve(true);
    } catch (e) {
      return Promise.resolve(false);
    }
  }
}
