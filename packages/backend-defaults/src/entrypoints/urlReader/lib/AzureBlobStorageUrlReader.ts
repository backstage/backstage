/*
 * Copyright 2024 The Backstage Authors
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
  BlobDownloadOptions,
  BlobServiceClient,
  ContainerClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { ReaderFactory, ReadTreeResponseFactory } from './types';
import { ForwardedError, NotModifiedError } from '@backstage/errors';
import { Readable } from 'stream';
import { relative } from 'path/posix';
import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';
import {
  AzureBlobStorageIntergation,
  AzureCredentialsManager,
  DefaultAzureCredentialsManager,
  ScmIntegrations,
} from '@backstage/integration';
import {
  UrlReaderService,
  UrlReaderServiceReadTreeOptions,
  UrlReaderServiceReadTreeResponse,
  UrlReaderServiceReadUrlOptions,
  UrlReaderServiceReadUrlResponse,
  UrlReaderServiceSearchResponse,
} from '@backstage/backend-plugin-api';

export function parseUrl(url: string): { path: string; container: string } {
  const parsedUrl = new URL(url);
  const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);

  if (pathSegments.length < 1) {
    throw new Error(`Invalid Azure Blob Storage URL format: ${url}`);
  }

  // First segment is the container name, rest is the blob path
  const container = pathSegments[0];
  const path = pathSegments.slice(1).join('/');

  return { path, container };
}

/**
 * Implements a {@link @backstage/backend-plugin-api#UrlReaderService} for Azure storage accounts urls.
 *
 * @public
 */
export class AzureBlobStorageUrlReader implements UrlReaderService {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const integrations = ScmIntegrations.fromConfig(config);

    const credsManager =
      DefaultAzureCredentialsManager.fromIntegrations(integrations);

    return integrations.azureBlobStorage.list().map(integrationConfig => {
      const reader = new AzureBlobStorageUrlReader(
        credsManager,
        integrationConfig,
        {
          treeResponseFactory,
        },
      );

      const predicate = (url: URL) =>
        url.host.endsWith(
          `${integrationConfig.config.accountName}.${integrationConfig.config.host}`,
        );
      return { reader, predicate };
    });
  };

  // private readonly blobServiceClient: BlobServiceClient;

  constructor(
    private readonly credsManager: AzureCredentialsManager,
    private readonly integration: AzureBlobStorageIntergation,
    private readonly deps: {
      treeResponseFactory: ReadTreeResponseFactory;
    },
  ) {}

  private async createContainerClient(
    containerName: string,
  ): Promise<ContainerClient> {
    const accountName = this.integration.config.accountName; // Use the account name from the integration config
    const accountKey = this.integration.config.accountKey; // Get the account key if it exists

    if (accountKey && accountName) {
      const creds = new StorageSharedKeyCredential(accountName, accountKey);
      const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.${this.integration.config.host}`,
        creds,
      );
      return blobServiceClient.getContainerClient(containerName);
    }
    // Use the credentials manager to get the correct credentials
    const credential = await this.credsManager.getCredentials(
      accountName as string,
    );

    let blobServiceClientUrl: string;

    if (this.integration.config.endpoint) {
      if (this.integration.config.sasToken) {
        blobServiceClientUrl = `${this.integration.config.endpoint}?${this.integration.config.sasToken}`;
      } else {
        blobServiceClientUrl = `${this.integration.config.endpoint}`;
      }
    } else {
      blobServiceClientUrl = `https://${this.integration.config.accountName}.${this.integration.config.host}`;
    }

    const blobServiceClient = new BlobServiceClient(
      blobServiceClientUrl,
      credential,
    );
    return blobServiceClient.getContainerClient(containerName);
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
      const { path, container } = parseUrl(url);

      const containerClient = await this.createContainerClient(container);
      const blobClient = containerClient.getBlobClient(path);

      const getBlobOptions: BlobDownloadOptions = {
        abortSignal: options?.signal,
        conditions: {
          ...(etag && { ifNoneMatch: etag }),
          ...(lastModifiedAfter && { ifModifiedSince: lastModifiedAfter }),
        },
      };

      const downloadBlockBlobResponse = await blobClient.download(
        0,
        undefined,
        getBlobOptions,
      );

      return ReadUrlResponseFactory.fromReadable(
        downloadBlockBlobResponse.readableStreamBody as Readable,
        {
          etag: downloadBlockBlobResponse.etag,
          lastModifiedAt: downloadBlockBlobResponse.lastModified,
        },
      );
    } catch (e) {
      if (e.statusCode === 304) {
        throw new NotModifiedError();
      }

      throw new ForwardedError(
        'Could not retrieve file from Azure Blob Storage',
        e,
      );
    }
  }

  async readTree(
    url: string,
    options?: UrlReaderServiceReadTreeOptions,
  ): Promise<UrlReaderServiceReadTreeResponse> {
    try {
      const { path, container } = parseUrl(url);

      const containerClient = await this.createContainerClient(container);

      const blobs = containerClient.listBlobsFlat({ prefix: path });

      const responses = [];

      for await (const blob of blobs) {
        const blobClient = containerClient.getBlobClient(blob.name);
        const downloadBlockBlobResponse = await blobClient.download(
          undefined,
          undefined,
          { abortSignal: options?.signal },
        );

        responses.push({
          data: Readable.from(
            downloadBlockBlobResponse.readableStreamBody as Readable,
          ),
          path: relative(path, blob.name),
          lastModifiedAt: blob.properties.lastModified,
        });
      }

      return this.deps.treeResponseFactory.fromReadableArray(responses);
    } catch (e) {
      throw new ForwardedError(
        'Could not retrieve file tree from Azure Blob Storage',
        e,
      );
    }
  }

  async search(): Promise<UrlReaderServiceSearchResponse> {
    throw new Error('AzureBlobStorageUrlReader does not implement search');
  }

  toString() {
    const accountName = this.integration.config.accountName;
    const accountKey = this.integration.config.accountKey;
    return `azureBlobStorage{accountName=${accountName},authed=${Boolean(
      accountKey,
    )}}`;
  }
}
