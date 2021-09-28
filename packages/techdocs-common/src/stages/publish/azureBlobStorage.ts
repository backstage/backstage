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
import { DefaultAzureCredential } from '@azure/identity';
import {
  BlobServiceClient,
  ContainerClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { Entity, EntityName } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import express from 'express';
import JSON5 from 'json5';
import limiterFactory from 'p-limit';
import { default as path, default as platformPath } from 'path';
import { Logger } from 'winston';
import {
  bulkStorageOperation,
  getCloudPathForLocalPath,
  getFileTreeRecursively,
  getHeadersForFileExtension,
  lowerCaseEntityTriplet,
  getStaleFiles,
  lowerCaseEntityTripletInStoragePath,
} from './helpers';
import {
  PublisherBase,
  PublishRequest,
  ReadinessResponse,
  TechDocsMetadata,
} from './types';

// The number of batches that may be ongoing at the same time.
const BATCH_CONCURRENCY = 3;

export class AzureBlobStoragePublish implements PublisherBase {
  static fromConfig(config: Config, logger: Logger): PublisherBase {
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

    const legacyPathCasing =
      config.getOptionalBoolean(
        'techdocs.legacyUseCaseSensitiveTripletPaths',
      ) || false;

    return new AzureBlobStoragePublish(
      storageClient,
      containerName,
      legacyPathCasing,
      logger,
    );
  }

  constructor(
    private readonly storageClient: BlobServiceClient,
    private readonly containerName: string,
    private readonly legacyPathCasing: boolean,
    private readonly logger: Logger,
  ) {
    this.storageClient = storageClient;
    this.containerName = containerName;
    this.legacyPathCasing = legacyPathCasing;
    this.logger = logger;
  }

  async getReadiness(): Promise<ReadinessResponse> {
    try {
      const response = await this.storageClient
        .getContainerClient(this.containerName)
        .getProperties();

      if (response._response.status === 200) {
        return {
          isAvailable: true,
        };
      }

      if (response._response.status >= 400) {
        this.logger.error(
          `Failed to retrieve metadata from ${response._response.request.url} with status code ${response._response.status}.`,
        );
      }
    } catch (e) {
      this.logger.error(`from Azure Blob Storage client library: ${e.message}`);
    }

    this.logger.error(
      `Could not retrieve metadata about the Azure Blob Storage container ${this.containerName}. ` +
        'Make sure that the Azure project and container exist and the access key is setup correctly ' +
        'techdocs.publisher.azureBlobStorage.credentials defined in app config has correct permissions. ' +
        'Refer to https://backstage.io/docs/features/techdocs/using-cloud-storage',
    );

    return { isAvailable: false };
  }

  /**
   * Upload all the files from the generated `directory` to the Azure Blob Storage container.
   * Directory structure used in the container is - entityNamespace/entityKind/entityName/index.html
   */
  async publish({ entity, directory }: PublishRequest): Promise<void> {
    const useLegacyPathCasing = this.legacyPathCasing;

    // First, try to retrieve a list of all individual files currently existing
    const remoteFolder = getCloudPathForLocalPath(
      entity,
      undefined,
      useLegacyPathCasing,
    );
    let existingFiles: string[] = [];
    try {
      existingFiles = await this.getAllBlobsFromContainer({
        prefix: remoteFolder,
        maxPageSize: BATCH_CONCURRENCY,
      });
    } catch (e) {
      this.logger.error(
        `Unable to list files for Entity ${entity.metadata.name}: ${e.message}`,
      );
    }

    // Then, merge new files into the same folder
    let absoluteFilesToUpload;
    let container: ContainerClient;
    try {
      // Remove the absolute path prefix of the source directory
      // Path of all files to upload, relative to the root of the source directory
      // e.g. ['index.html', 'sub-page/index.html', 'assets/images/favicon.png']
      absoluteFilesToUpload = await getFileTreeRecursively(directory);

      container = this.storageClient.getContainerClient(this.containerName);
      const failedOperations: Error[] = [];
      await bulkStorageOperation(
        async absoluteFilePath => {
          const relativeFilePath = path.normalize(
            path.relative(directory, absoluteFilePath),
          );
          const response = await container
            .getBlockBlobClient(
              getCloudPathForLocalPath(
                entity,
                relativeFilePath,
                useLegacyPathCasing,
              ),
            )
            .uploadFile(absoluteFilePath);

          if (response._response.status >= 400) {
            failedOperations.push(
              new Error(
                `Upload failed for ${absoluteFilePath} with status code ${response._response.status}`,
              ),
            );
          }

          return response;
        },
        absoluteFilesToUpload,
        { concurrencyLimit: BATCH_CONCURRENCY },
      );

      if (failedOperations.length > 0) {
        throw new Error(
          failedOperations
            .map(r => r.message)
            .filter(Boolean)
            .join(' '),
        );
      }

      this.logger.info(
        `Successfully uploaded all the generated files for Entity ${entity.metadata.name}. Total number of files: ${absoluteFilesToUpload.length}`,
      );
    } catch (e) {
      const errorMessage = `Unable to upload file(s) to Azure. ${e}`;
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
          ),
      );

      const staleFiles = getStaleFiles(relativeFilesToUpload, existingFiles);

      await bulkStorageOperation(
        async relativeFilePath => {
          return await container.deleteBlob(relativeFilePath);
        },
        staleFiles,
        { concurrencyLimit: BATCH_CONCURRENCY },
      );

      this.logger.info(
        `Successfully deleted stale files for Entity ${entity.metadata.name}. Total number of files: ${staleFiles.length}`,
      );
    } catch (error) {
      const errorMessage = `Unable to delete file(s) from Azure. ${error}`;
      this.logger.error(errorMessage);
    }
  }

  private download(containerName: string, blobPath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const fileStreamChunks: Array<any> = [];
      this.storageClient
        .getContainerClient(containerName)
        .getBlockBlobClient(blobPath)
        .download()
        .then(res => {
          const body = res.readableStreamBody;
          if (!body) {
            reject(new Error(`Unable to parse the response data`));
            return;
          }
          body
            .on('error', reject)
            .on('data', chunk => {
              fileStreamChunks.push(chunk);
            })
            .on('end', () => {
              resolve(Buffer.concat(fileStreamChunks));
            });
        })
        .catch(reject);
    });
  }

  async fetchTechDocsMetadata(
    entityName: EntityName,
  ): Promise<TechDocsMetadata> {
    const entityTriplet = `${entityName.namespace}/${entityName.kind}/${entityName.name}`;
    const entityRootDir = this.legacyPathCasing
      ? entityTriplet
      : lowerCaseEntityTriplet(entityTriplet);

    try {
      const techdocsMetadataJson = await this.download(
        this.containerName,
        `${entityRootDir}/techdocs_metadata.json`,
      );
      if (!techdocsMetadataJson) {
        throw new Error(
          `Unable to parse the techdocs metadata file ${entityRootDir}/techdocs_metadata.json.`,
        );
      }
      const techdocsMetadata = JSON5.parse(
        techdocsMetadataJson.toString('utf-8'),
      );
      return techdocsMetadata;
    } catch (e) {
      throw new Error(`TechDocs metadata fetch failed, ${e.message}`);
    }
  }

  /**
   * Express route middleware to serve static files on a route in techdocs-backend.
   */
  docsRouter(): express.Handler {
    return (req, res) => {
      // Decode and trim the leading forward slash
      const decodedUri = decodeURI(req.path.replace(/^\//, ''));

      // filePath example - /default/Component/documented-component/index.html
      const filePath = this.legacyPathCasing
        ? decodedUri
        : lowerCaseEntityTripletInStoragePath(decodedUri);

      // Files with different extensions (CSS, HTML) need to be served with different headers
      const fileExtension = platformPath.extname(filePath);
      const responseHeaders = getHeadersForFileExtension(fileExtension);

      this.download(this.containerName, filePath)
        .then(fileContent => {
          // Inject response headers
          for (const [headerKey, headerValue] of Object.entries(
            responseHeaders,
          )) {
            res.setHeader(headerKey, headerValue);
          }
          res.send(fileContent);
        })
        .catch(e => {
          this.logger.error(
            `TechDocs Azure router failed to serve content from container ${this.containerName} at path ${filePath}: ${e.message}`,
          );
          res.status(404).send('File Not Found');
        });
    };
  }

  /**
   * A helper function which checks if index.html of an Entity's docs site is available. This
   * can be used to verify if there are any pre-generated docs available to serve.
   */
  hasDocsBeenGenerated(entity: Entity): Promise<boolean> {
    const entityTriplet = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;
    const entityRootDir = this.legacyPathCasing
      ? entityTriplet
      : lowerCaseEntityTriplet(entityTriplet);

    return this.storageClient
      .getContainerClient(this.containerName)
      .getBlockBlobClient(`${entityRootDir}/index.html`)
      .exists();
  }

  protected async renameBlob(
    originalName: string,
    newName: string,
    removeOriginal = false,
  ): Promise<void> {
    const container = this.storageClient.getContainerClient(this.containerName);
    const blob = container.getBlobClient(newName);
    const { url } = container.getBlobClient(originalName);
    const response = await blob.beginCopyFromURL(url);
    await response.pollUntilDone();
    if (removeOriginal) {
      await container.deleteBlob(originalName);
    }
  }

  protected async renameBlobToLowerCase(
    originalPath: string,
    removeOriginal: boolean,
  ) {
    let newPath;
    try {
      newPath = lowerCaseEntityTripletInStoragePath(originalPath);
    } catch (e) {
      this.logger.warn(e.message);
      return;
    }

    if (originalPath === newPath) return;
    try {
      this.logger.verbose(`Migrating ${originalPath}`);
      await this.renameBlob(originalPath, newPath, removeOriginal);
    } catch (e) {
      this.logger.warn(`Unable to migrate ${originalPath}: ${e.message}`);
    }
  }

  async migrateDocsCase({
    removeOriginal = false,
    concurrency = 25,
  }): Promise<void> {
    const promises = [];
    const limiter = limiterFactory(concurrency);
    const container = this.storageClient.getContainerClient(this.containerName);

    for await (const blob of container.listBlobsFlat()) {
      promises.push(
        limiter(
          this.renameBlobToLowerCase.bind(this),
          blob.name,
          removeOriginal,
        ),
      );
    }

    await Promise.all(promises);
  }

  protected async getAllBlobsFromContainer({
    prefix,
    maxPageSize,
  }: {
    prefix: string;
    maxPageSize: number;
  }): Promise<string[]> {
    const blobs: string[] = [];
    const container = this.storageClient.getContainerClient(this.containerName);

    let iterator = container.listBlobsFlat({ prefix }).byPage({ maxPageSize });
    let response = (await iterator.next()).value;

    do {
      for (const blob of response?.segment?.blobItems ?? []) {
        blobs.push(blob.name);
      }
      iterator = container
        .listBlobsFlat({ prefix })
        .byPage({ continuationToken: response.continuationToken, maxPageSize });
      response = (await iterator.next()).value;
    } while (response && response.continuationToken);

    return blobs;
  }
}
