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
import { toError, ForwardedError, NotModifiedError } from '@backstage/errors';
import { Readable } from 'node:stream';
import { relative } from 'node:path/posix';
import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';
import { hasDotPathSegments, isUrlPathWithoutDotSegments } from './util';
import {
  AzureBlobStorageIntegration,
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
  UrlReaderServiceSearchOptions,
  UrlReaderServiceSearchResponse,
} from '@backstage/backend-plugin-api';

export function parseUrl(
  url: string,
  options?: { pathStyle?: boolean },
): { path: string; container: string } {
  if (!isUrlPathWithoutDotSegments(url)) {
    throw new Error(`Invalid Azure Blob Storage URL format: ${url}`);
  }

  const parsedUrl = new URL(url);
  const pathSegments = parsedUrl.pathname
    .split('/')
    .filter(Boolean)
    .map(decodeURIComponent);

  // Path-style URLs, e.g. from the Azurite emulator, start with the account name
  if (options?.pathStyle) {
    pathSegments.shift();
  }

  if (pathSegments.length < 1) {
    throw new Error(`Invalid Azure Blob Storage URL format: ${url}`);
  }

  // First segment is the container name, rest is the blob path
  const container = pathSegments[0];
  const path = pathSegments.slice(1).join('/');

  return { path, container };
}

/**
 * Returns the endpoint if the integration uses a path-style endpoint, where the
 * account name is the first path segment rather than part of the host, as with
 * the Azurite emulator (`http://127.0.0.1:10000/devstoreaccount1`).
 */
function getPathStyleEndpoint(
  integration: AzureBlobStorageIntegration,
): string | undefined {
  const { endpoint } = integration.config;
  if (endpoint && new URL(endpoint).pathname !== '/') {
    return endpoint;
  }
  return undefined;
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

      const { accountName, host } = integrationConfig.config;
      const predicate = getPathStyleEndpoint(integrationConfig)
        ? (url: URL) =>
            url.host === host && url.pathname.startsWith(`/${accountName}/`)
        : (url: URL) => url.host.endsWith(`${accountName}.${host}`);
      return { reader, predicate };
    });
  };

  private readonly integration: AzureBlobStorageIntegration;
  private readonly deps: {
    treeResponseFactory: ReadTreeResponseFactory;
    createContainerClient: (containerName: string) => Promise<ContainerClient>;
  };

  constructor(
    credsManager: AzureCredentialsManager,
    integration: AzureBlobStorageIntegration,
    deps: {
      treeResponseFactory: ReadTreeResponseFactory;
      createContainerClient?: (
        containerName: string,
      ) => Promise<ContainerClient>;
    },
  ) {
    this.integration = integration;
    this.deps = {
      ...deps,
      createContainerClient:
        deps.createContainerClient ??
        this.#defaultCreateContainerClient.bind(this, credsManager),
    };
  }

  async #defaultCreateContainerClient(
    credsManager: AzureCredentialsManager,
    containerName: string,
  ): Promise<ContainerClient> {
    const accountName = this.integration.config.accountName;
    const accountKey = this.integration.config.accountKey;

    if (accountKey && accountName) {
      const creds = new StorageSharedKeyCredential(accountName, accountKey);
      const blobServiceClient = new BlobServiceClient(
        getPathStyleEndpoint(this.integration) ??
          `https://${accountName}.${this.integration.config.host}`,
        creds,
      );
      return blobServiceClient.getContainerClient(containerName);
    }

    const credential = await credsManager.getCredentials(accountName as string);

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

  #parseUrl(url: string) {
    return parseUrl(url, {
      pathStyle: Boolean(getPathStyleEndpoint(this.integration)),
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
      const { path, container } = this.#parseUrl(url);

      const containerClient = await this.deps.createContainerClient(container);
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
      const { path, container } = this.#parseUrl(url);

      const containerClient = await this.deps.createContainerClient(container);
      const blobs = containerClient.listBlobsFlat({ prefix: path });

      const responses = [];

      for await (const blob of blobs) {
        if (hasDotPathSegments(blob.name)) {
          continue;
        }
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

  async search(
    url: string,
    options?: UrlReaderServiceSearchOptions,
  ): Promise<UrlReaderServiceSearchResponse> {
    const { path } = this.#parseUrl(url);

    if (path.match(/[*?]/)) {
      throw new Error(
        'Glob search pattern not implemented for AzureBlobStorageUrlReader',
      );
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
    } catch (e) {
      throw toError(e);
    }
  }

  toString() {
    const accountName = this.integration.config.accountName;
    const accountKey = this.integration.config.accountKey;
    return `azureBlobStorage{accountName=${accountName},authed=${Boolean(
      accountKey,
    )}}`;
  }
}
