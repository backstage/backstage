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
import platformPath from 'path';
import express from 'express';
import {
  BlobServiceClient,
  BlobUploadCommonResponse,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';
import { Logger } from 'winston';
import { Entity, EntityName } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { getHeadersForFileExtension, getFileTreeRecursively } from './helpers';
import { PublisherBase, PublishRequest, TechDocsMetadata } from './types';
import limiterFactory from 'p-limit';
import JSON5 from 'json5';

// The number of batches that may be ongoing at the same time.
const BATCH_CONCURRENCY = 3;

export class AzureBlobStoragePublish implements PublisherBase {
  static async fromConfig(
    config: Config,
    logger: Logger,
  ): Promise<PublisherBase> {
    let containerName = '';
    try {
      containerName = config.getString(
        'techdocs.publisher.azureBlobStorage.containerName',
      );
    } catch (error) {
      throw new Error(
        "Since techdocs.publisher.type is set to 'azureBlobStorage' in your app config, " +
          'techdocs.publisher.azureBlobStorage.containerName is required.',
      );
    }

    let accountName = '';
    try {
      accountName = config.getString(
        'techdocs.publisher.azureBlobStorage.credentials.accountName',
      );
    } catch (error) {
      throw new Error(
        "Since techdocs.publisher.type is set to 'azureBlobStorage' in your app config, " +
          'techdocs.publisher.azureBlobStorage.credentials.accountName is required.',
      );
    }

    // Credentials is an optional config. If missing, default Azure Blob Storage environment variables will be used.
    // https://docs.microsoft.com/en-us/azure/storage/common/storage-auth-aad-app
    const accountKey = config.getOptionalString(
      'techdocs.publisher.azureBlobStorage.credentials.accountKey',
    );

    let credential;
    if (accountKey) {
      credential = new StorageSharedKeyCredential(accountName, accountKey);
    } else {
      credential = new DefaultAzureCredential();
    }

    const storageClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      credential,
    );

    await storageClient
      .getContainerClient(containerName)
      .getProperties()
      .then(() => {
        logger.info(
          `Successfully connected to the Azure Blob Storage container ${containerName}.`,
        );
      })
      .catch(reason => {
        logger.error(
          `Could not retrieve metadata about the Azure Blob Storage container ${containerName}. ` +
            'Make sure that the Azure project and container exist and the access key is setup correctly ' +
            'techdocs.publisher.azureBlobStorage.credentials defined in app config has correct permissions. ' +
            'Refer to https://backstage.io/docs/features/techdocs/using-cloud-storage',
        );
        throw new Error(
          `from Azure Blob Storage client library: ${reason.message}`,
        );
      });

    return new AzureBlobStoragePublish(storageClient, containerName, logger);
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
   * Upload all the files from the generated `directory` to the Azure Blob Storage container.
   * Directory structure used in the container is - entityNamespace/entityKind/entityName/index.html
   */
  async publish({ entity, directory }: PublishRequest): Promise<void> {
    try {
      // Note: Azure Blob Storage manages creation of parent directories if they do not exist.
      // So collecting path of only the files is good enough.
      const allFilesToUpload = await getFileTreeRecursively(directory);

      const uploadPromises: Array<Promise<BlobUploadCommonResponse>> = [];

      // Bound the number of concurrent batches. We want a bit of concurrency for
      // performance reasons, but not so much that we starve the connection pool
      // or start thrashing.
      const limiter = limiterFactory(BATCH_CONCURRENCY);

      const promises = allFilesToUpload.map(filePath => {
        // Remove the absolute path prefix of the source directory
        // Path of all files to upload, relative to the root of the source directory
        // e.g. ['index.html', 'sub-page/index.html', 'assets/images/favicon.png']
        const relativeFilePath = filePath.replace(`${directory}/`, '');
        const entityRootDir = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;
        const destination = platformPath.normalize(
          `${entityRootDir}/${relativeFilePath}`,
        ); // Azure Blob Storage Container file relative path

        return limiter(async () => {
          await uploadPromises.push(
            this.storageClient
              .getContainerClient(this.containerName)
              .getBlockBlobClient(destination)
              .uploadFile(filePath),
          );
        });
      });

      await Promise.all(promises).then(() => {
        this.logger.info(
          `Successfully uploaded all the generated files for Entity ${entity.metadata.name}. Total number of files: ${allFilesToUpload.length}`,
        );
      });
      return;
    } catch (e) {
      const errorMessage = `Unable to upload file(s) to Azure Blob Storage. Error ${e.message}`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  private download(containerName: string, path: string): Promise<Buffer> {
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
              resolve(Buffer.concat(fileStreamChunks));
            });
        });
    });
  }

  async fetchTechDocsMetadata(
    entityName: EntityName,
  ): Promise<TechDocsMetadata> {
    const entityRootDir = `${entityName.namespace}/${entityName.kind}/${entityName.name}`;
    try {
      return await new Promise<TechDocsMetadata>(resolve => {
        const download = this.download(
          this.containerName,
          `${entityRootDir}/techdocs_metadata.json`,
        );
        resolve(JSON5.parse(download.toString()));
      });
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
      const fileExtension = platformPath.extname(filePath);
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
