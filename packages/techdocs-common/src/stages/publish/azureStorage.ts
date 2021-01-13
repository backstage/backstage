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
import {
  BlobServiceClient,
  BlobUploadCommonResponse,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { Logger } from 'winston';
import { Entity, EntityName } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { getHeadersForFileExtension, getFileTreeRecursively } from './helpers';
import { PublisherBase, PublishRequest } from './types';

export class AzureStoragePublish implements PublisherBase {
  static async fromConfig(
    config: Config,
    logger: Logger,
  ): Promise<PublisherBase> {
    let account = '';
    let accountKey = '';
    let containerName = '';
    try {
      account = config.getString(
        'techdocs.publisher.azureStorage.credentials.account',
      );
      accountKey = config.getString(
        'techdocs.publisher.azureStorage.credentials.accountKey',
      );
      containerName = config.getString(
        'techdocs.publisher.azureStorage.containerName',
      );
    } catch (error) {
      throw new Error(
        "Since techdocs.publisher.type is set to 'azureStorage' in your app config, " +
          'credentials and containerName are required in techdocs.publisher.azureStorage ' +
          'required to authenticate with Azure Storage.',
      );
    }

    const credential = new StorageSharedKeyCredential(account, accountKey);
    const storageClient = new BlobServiceClient(
      `https://${account}.blob.core.windows.net`,
      credential,
    );

    await storageClient
      .getContainerClient(containerName)
      .getProperties()
      .then(() => {
        logger.info(
          `Successfully connected to the Azure Storage container ${containerName}.`,
        );
      })
      .catch(reason => {
        logger.error(
          `Could not retrieve metadata about the Azure Storage container ${containerName}. ` +
            'Make sure the Azure project and the container exists and the access key located at the path ' +
            "techdocs.publisher.azureStorage.credentials defined in app config has the role 'Storage Object Creator'. " +
            'Refer to https://backstage.io/docs/features/techdocs/using-cloud-storage',
        );
        throw new Error(`from Azure Storage client library: ${reason.message}`);
      });

    return new AzureStoragePublish(storageClient, containerName, logger);
  }

  constructor(
    private readonly storageClient: BlobServiceClient,
    private readonly containerName: string,
    private readonly logger: Logger,
  ) {
    this.storageClient = storageClient;
    this.containerName = containerName;
    this.logger = logger;
  }

  /**
   * Upload all the files from the generated `directory` to the Azure Storage container.
   * Directory structure used in the container is - entityNamespace/entityKind/entityName/index.html
   */
  async publish({ entity, directory }: PublishRequest): Promise<void> {
    try {
      // Note: Azure Storage manages creation of parent directories if they do not exist.
      // So collecting path of only the files is good enough.
      const allFilesToUpload = await getFileTreeRecursively(directory);

      const uploadPromises: Array<Promise<BlobUploadCommonResponse>> = [];
      allFilesToUpload.forEach(filePath => {
        // Remove the absolute path prefix of the source directory
        // Path of all files to upload, relative to the root of the source directory
        // e.g. ['index.html', 'sub-page/index.html', 'assets/images/favicon.png']
        const relativeFilePath = filePath.replace(`${directory}/`, '');
        const entityRootDir = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;
        const destination = path.normalize(
          `${entityRootDir}/${relativeFilePath}`,
        ); // Azure Storage Container file relative path
        // TODO: Upload in chunks of ~10 files instead of all files at once.
        uploadPromises.push(
          this.storageClient
            .getContainerClient(this.containerName)
            .getBlockBlobClient(destination)
            .uploadFile(filePath),
        );
      });

      await Promise.all(uploadPromises).then(() => {
        this.logger.info(
          `Successfully uploaded all the generated files for Entity ${entity.metadata.name}. Total number of files: ${allFilesToUpload.length}`,
        );
      });
      return;
    } catch (e) {
      const errorMessage = `Unable to upload file(s) to Azure Storage. Error ${e.message}`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  download(containerName: string, path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileStreamChunks: Array<any> = [];
      this.storageClient
        .getContainerClient(containerName)
        .getBlockBlobClient(path)
        .download()
        .then(res => {
          const body = res.readableStreamBody;
          if (!body) {
            reject(new Error(`Unable to parse the response data`));
            return;
          }
          body
            .on('error', e => {
              this.logger.error(e.message);
              reject(e.message);
            })
            .on('data', chunk => {
              fileStreamChunks.push(chunk);
            })
            .on('end', () => {
              resolve(Buffer.concat(fileStreamChunks).toString());
            });
        });
    });
  }

  async fetchTechDocsMetadata(entityName: EntityName): Promise<string> {
    const entityRootDir = `${entityName.namespace}/${entityName.kind}/${entityName.name}`;
    try {
      return this.download(
        this.containerName,
        `${entityRootDir}/techdocs_metadata.json`,
      );
    } catch (e) {
      this.logger.error(e.message);
      throw e;
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

      try {
        this.download(this.containerName, filePath).then(fileContent => {
          // Inject response headers
          for (const [headerKey, headerValue] of Object.entries(
            responseHeaders,
          )) {
            res.setHeader(headerKey, headerValue);
          }
          res.send(fileContent);
        });
      } catch (e) {
        this.logger.error(e.message);
        res.status(404).send(e.message);
      }
    };
  }

  /**
   * A helper function which checks if index.html of an Entity's docs site is available. This
   * can be used to verify if there are any pre-generated docs available to serve.
   */
  async hasDocsBeenGenerated(entity: Entity): Promise<boolean> {
    return new Promise(resolve => {
      const entityRootDir = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;
      this.storageClient
        .getContainerClient(this.containerName)
        .getBlockBlobClient(`${entityRootDir}/index.html`)
        .exists()
        .then((response: boolean) => {
          resolve(response);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }
}
