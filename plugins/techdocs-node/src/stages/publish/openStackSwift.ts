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
import express from 'express';
import fs from 'fs-extra';
import JSON5 from 'json5';
import createLimiter from 'p-limit';
import path from 'path';
import { SwiftClient } from '@trendyol-js/openstack-swift-sdk';
import { NotFound } from '@trendyol-js/openstack-swift-sdk/lib/types';
import { Stream, Readable } from 'stream';

import {
  getFileTreeRecursively,
  getHeadersForFileExtension,
  lowerCaseEntityTripletInStoragePath,
} from './helpers';
import {
  PublisherBase,
  PublishRequest,
  PublishResponse,
  ReadinessResponse,
  TechDocsMetadata,
} from './types';
import { assertError, ForwardedError } from '@backstage/errors';
import { LoggerService } from '@backstage/backend-plugin-api';

const streamToBuffer = (stream: Stream | Readable): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const chunks: any[] = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    } catch (e) {
      throw new ForwardedError('Unable to parse the response data', e);
    }
  });
};

const bufferToStream = (buffer: Buffer): Readable => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

export class OpenStackSwiftPublish implements PublisherBase {
  private readonly storageClient: SwiftClient;
  private readonly containerName: string;
  private readonly logger: LoggerService;

  constructor(options: {
    storageClient: SwiftClient;
    containerName: string;
    logger: LoggerService;
  }) {
    this.storageClient = options.storageClient;
    this.containerName = options.containerName;
    this.logger = options.logger;
  }

  static fromConfig(config: Config, logger: LoggerService): PublisherBase {
    let containerName = '';
    try {
      containerName = config.getString(
        'techdocs.publisher.openStackSwift.containerName',
      );
    } catch (error) {
      throw new Error(
        "Since techdocs.publisher.type is set to 'openStackSwift' in your app config, " +
          'techdocs.publisher.openStackSwift.containerName is required.',
      );
    }

    const openStackSwiftConfig = config.getConfig(
      'techdocs.publisher.openStackSwift',
    );

    const storageClient = new SwiftClient({
      authEndpoint: openStackSwiftConfig.getString('authUrl'),
      swiftEndpoint: openStackSwiftConfig.getString('swiftUrl'),
      credentialId: openStackSwiftConfig.getString('credentials.id'),
      secret: openStackSwiftConfig.getString('credentials.secret'),
    });

    return new OpenStackSwiftPublish({ storageClient, containerName, logger });
  }

  /*
   * Check if the defined container exists. Being able to connect means the configuration is good
   * and the storage client will work.
   */
  async getReadiness(): Promise<ReadinessResponse> {
    try {
      const container = await this.storageClient.getContainerMetadata(
        this.containerName,
      );

      if (!(container instanceof NotFound)) {
        this.logger.info(
          `Successfully connected to the OpenStack Swift container ${this.containerName}.`,
        );
        return {
          isAvailable: true,
        };
      }
      this.logger.error(
        `Could not retrieve metadata about the OpenStack Swift container ${this.containerName}. ` +
          'Make sure the container exists. Also make sure that authentication is setup either by ' +
          'explicitly defining credentials and region in techdocs.publisher.openStackSwift in app config or ' +
          'by using environment variables. Refer to https://backstage.io/docs/features/techdocs/using-cloud-storage',
      );
      return {
        isAvailable: false,
      };
    } catch (err) {
      assertError(err);
      this.logger.error(`from OpenStack client library: ${err.message}`);
      return {
        isAvailable: false,
      };
    }
  }

  /**
   * Upload all the files from the generated `directory` to the OpenStack Swift container.
   * Directory structure used in the bucket is - entityNamespace/entityKind/entityName/index.html
   */
  async publish({
    entity,
    directory,
  }: PublishRequest): Promise<PublishResponse> {
    try {
      const objects: string[] = [];

      // Note: OpenStack Swift manages creation of parent directories if they do not exist.
      // So collecting path of only the files is good enough.
      const allFilesToUpload = await getFileTreeRecursively(directory);
      const limiter = createLimiter(10);
      const uploadPromises: Array<Promise<unknown>> = [];
      for (const filePath of allFilesToUpload) {
        // Remove the absolute path prefix of the source directory
        // Path of all files to upload, relative to the root of the source directory
        // e.g. ['index.html', 'sub-page/index.html', 'assets/images/favicon.png']
        const relativeFilePath = path.relative(directory, filePath);
        // Convert destination file path to a POSIX path for uploading.
        // Swift expects / as path separator and relativeFilePath will contain \\ on Windows.
        // https://docs.openstack.org/python-openstackclient/pike/cli/man/openstack.html
        const relativeFilePathPosix = relativeFilePath
          .split(path.sep)
          .join(path.posix.sep);

        // The / delimiter is intentional since it represents the cloud storage and not the local file system.
        const entityRootDir = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;
        const destination = `${entityRootDir}/${relativeFilePathPosix}`; // Swift container file relative path
        objects.push(destination);

        // Rate limit the concurrent execution of file uploads to batches of 10 (per publish)
        const uploadFile = limiter(async () => {
          const fileBuffer = await fs.readFile(filePath);
          const stream = bufferToStream(fileBuffer);
          return this.storageClient.upload(
            this.containerName,
            destination,
            stream,
          );
        });
        uploadPromises.push(uploadFile);
      }
      await Promise.all(uploadPromises);
      this.logger.info(
        `Successfully uploaded all the generated files for Entity ${entity.metadata.name}. Total number of files: ${allFilesToUpload.length}`,
      );
      return { objects };
    } catch (e) {
      const errorMessage = `Unable to upload file(s) to OpenStack Swift. ${e}`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  async fetchTechDocsMetadata(
    entityName: CompoundEntityRef,
  ): Promise<TechDocsMetadata> {
    return await new Promise<TechDocsMetadata>(async (resolve, reject) => {
      const entityRootDir = `${entityName.namespace}/${entityName.kind}/${entityName.name}`;

      const downloadResponse = await this.storageClient.download(
        this.containerName,
        `${entityRootDir}/techdocs_metadata.json`,
      );

      if (!(downloadResponse instanceof NotFound)) {
        const stream = downloadResponse.data;
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
          assertError(err);
          this.logger.error(err.message);
          reject(new Error(err.message));
        }
      } else {
        reject({
          message: `TechDocs metadata fetch failed, The file /rootDir/${entityRootDir}/techdocs_metadata.json does not exist !`,
        });
      }
    });
  }

  /**
   * Express route middleware to serve static files on a route in techdocs-backend.
   */
  docsRouter(): express.Handler {
    return async (req, res) => {
      // Decode and trim the leading forward slash
      // filePath example - /default/Component/documented-component/index.html
      const filePath = decodeURI(req.path.replace(/^\//, ''));

      // Files with different extensions (CSS, HTML) need to be served with different headers
      const fileExtension = path.extname(filePath);
      const responseHeaders = getHeadersForFileExtension(fileExtension);

      const downloadResponse = await this.storageClient.download(
        this.containerName,
        filePath,
      );

      if (!(downloadResponse instanceof NotFound)) {
        const stream = downloadResponse.data;

        try {
          // Inject response headers
          for (const [headerKey, headerValue] of Object.entries(
            responseHeaders,
          )) {
            res.setHeader(headerKey, headerValue);
          }

          res.send(await streamToBuffer(stream));
        } catch (err) {
          assertError(err);
          this.logger.warn(
            `TechDocs OpenStack swift router failed to serve content from container ${this.containerName} at path ${filePath}: ${err.message}`,
          );
          res.status(404).send('File Not Found');
        }
      } else {
        this.logger.warn(
          `TechDocs OpenStack swift router failed to serve content from container ${this.containerName} at path ${filePath}: Not found`,
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
    const entityRootDir = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;
    try {
      const fileResponse = await this.storageClient.getMetadata(
        this.containerName,
        `${entityRootDir}/index.html`,
      );

      if (!(fileResponse instanceof NotFound)) {
        return true;
      }
      return false;
    } catch (err) {
      assertError(err);
      this.logger.warn(err.message);
      return false;
    }
  }

  async migrateDocsCase({
    removeOriginal = false,
    concurrency = 25,
  }): Promise<void> {
    // Iterate through every file in the root of the publisher.
    const allObjects = await this.getAllObjectsFromContainer();
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
            this.logger.debug(`Migrating ${file} to ${newPath}`);
            await this.storageClient.copy(
              this.containerName,
              file,
              this.containerName,
              newPath,
            );
            if (removeOriginal) {
              await this.storageClient.delete(this.containerName, file);
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
   * Returns a list of all object keys from the configured container.
   */
  protected async getAllObjectsFromContainer(
    { prefix } = { prefix: '' },
  ): Promise<string[]> {
    let objects: string[] = [];
    const OSS_MAX_LIMIT = Math.pow(2, 31) - 1;

    const allObjects = await this.storageClient.list(
      this.containerName,
      prefix,
      OSS_MAX_LIMIT,
    );
    objects = allObjects.map((object: any) => object.name);

    return objects;
  }
}
