/*
 * Copyright 2025 The Backstage Authors
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

import * as AzureStorage from '@azure/storage-blob';
import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { DefaultReadTreeResponseFactory } from './tree';
import {
  AzureBlobStorageUrlReader,
  parseUrl,
} from './AzureBlobStorageUrlReader';
import { ScmIntegrations } from '@backstage/integration';
import { DefaultAzureCredentialsManager } from '@backstage/integration/backend';
import { UrlReaderPredicateTuple } from './types';
import { mockServices } from '@backstage/backend-test-utils';
import { Readable } from 'node:stream';

// Mock Azure Blob Storage SDK
const mockBlobDownload = jest.fn();
const mockGetBlobClient = jest.fn(() => ({
  download: mockBlobDownload,
}));
const mockListBlobsFlat = jest.fn();

class MockContainerClient {
  getBlobClient = mockGetBlobClient;
  listBlobsFlat = mockListBlobsFlat;
}

class MockBlobServiceClient {
  getContainerClient = jest.fn(() => new MockContainerClient());
}

jest
  .spyOn(AzureStorage, 'BlobServiceClient')
  .mockReturnValue(new MockBlobServiceClient() as any);
jest
  .spyOn(AzureStorage, 'StorageSharedKeyCredential')
  .mockReturnValue({} as any);

const treeResponseFactory = DefaultReadTreeResponseFactory.create({
  config: new ConfigReader({}),
});

describe('parseUrl', () => {
  it('parses Azure Blob Storage URLs correctly', () => {
    expect(
      parseUrl(
        'https://test-account.blob.core.windows.net/mycontainer/path/to/file.yaml',
      ),
    ).toEqual({
      path: 'path/to/file.yaml',
      container: 'mycontainer',
    });

    expect(
      parseUrl(
        'https://test-account.blob.core.windows.net/mycontainer/file.yaml',
      ),
    ).toEqual({
      path: 'file.yaml',
      container: 'mycontainer',
    });
  });

  it('handles URLs with no path correctly', () => {
    expect(
      parseUrl('https://test-account.blob.core.windows.net/mycontainer/'),
    ).toEqual({
      path: '',
      container: 'mycontainer',
    });
  });

  it('throws error for invalid URLs', () => {
    expect(() =>
      parseUrl('https://test-account.blob.core.windows.net/'),
    ).toThrow('Invalid Azure Blob Storage URL format');
  });
});

describe('AzureBlobStorageUrlReader', () => {
  const createReader = (config: JsonObject): UrlReaderPredicateTuple[] => {
    return AzureBlobStorageUrlReader.factory({
      config: new ConfigReader(config),
      logger: mockServices.logger.mock(),
      treeResponseFactory,
    });
  };

  it('creates a reader with minimal config', () => {
    const entries = createReader({
      integrations: {
        azureBlobStorage: [
          {
            accountName: 'test-account',
          },
        ],
      },
    });

    expect(entries).toHaveLength(1);
  });

  describe('predicates', () => {
    const readers = createReader({
      integrations: {
        azureBlobStorage: [
          {
            accountName: 'test-account',
          },
        ],
      },
    });
    const predicate = readers[0].predicate;

    it('returns true for the correct azure blob storage host', () => {
      expect(
        predicate(new URL('https://test-account.blob.core.windows.net')),
      ).toBe(true);
    });

    it('returns false for an incorrect host', () => {
      expect(
        predicate(new URL('https://wrongaccount.blob.core.windows.net')),
      ).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns a string representation with account name and auth status', () => {
      const config = new ConfigReader({
        integrations: {
          azureBlobStorage: [
            {
              accountName: 'test-account',
              accountKey: 'test-key',
            },
          ],
        },
      });

      const integrations = ScmIntegrations.fromConfig(config);
      const credsManager =
        DefaultAzureCredentialsManager.fromIntegrations(integrations);
      const reader = new AzureBlobStorageUrlReader(
        credsManager,
        integrations.azureBlobStorage.list()[0],
        { treeResponseFactory },
      );

      expect(reader.toString()).toBe(
        'azureBlobStorage{accountName=test-account,authed=true}',
      );
    });

    it('shows authed=false when no account key provided', () => {
      const config = new ConfigReader({
        integrations: {
          azureBlobStorage: [
            {
              accountName: 'test-account',
            },
          ],
        },
      });

      const integrations = ScmIntegrations.fromConfig(config);
      const credsManager =
        DefaultAzureCredentialsManager.fromIntegrations(integrations);
      const reader = new AzureBlobStorageUrlReader(
        credsManager,
        integrations.azureBlobStorage.list()[0],
        { treeResponseFactory },
      );

      expect(reader.toString()).toBe(
        'azureBlobStorage{accountName=test-account,authed=false}',
      );
    });
  });

  describe('readUrl', () => {
    const [{ reader }] = createReader({
      integrations: {
        azureBlobStorage: [
          {
            accountName: 'test-account',
            accountKey: 'test-key',
          },
        ],
      },
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns contents of a blob via buffer', async () => {
      mockBlobDownload.mockResolvedValue({
        readableStreamBody: Readable.from(
          Buffer.from('site_name: Test Azure Blob'),
        ),
        etag: '"etag"',
        lastModified: new Date('2025-01-01T00:00:00Z'),
      });

      const { buffer, etag, lastModifiedAt } = await reader.readUrl(
        'https://test-account.blob.core.windows.net/test-container/test-file.yaml',
      );

      expect(etag).toBe('"etag"');
      expect(lastModifiedAt).toEqual(new Date('2025-01-01T00:00:00Z'));
      const response = await buffer();
      expect(response.toString()).toBe('site_name: Test Azure Blob');
    });

    it('handles Azure SDK errors', async () => {
      mockBlobDownload.mockRejectedValue(new Error('Blob not found'));

      await expect(
        reader.readUrl(
          'https://test-account.blob.core.windows.net/test-container/nonexistent.yaml',
        ),
      ).rejects.toThrow('Could not retrieve file from Azure Blob Storage');
    });
  });

  describe('readTree', () => {
    const [{ reader }] = createReader({
      integrations: {
        azureBlobStorage: [
          {
            accountName: 'test-account',
            accountKey: 'test-key',
          },
        ],
      },
    });

    beforeEach(() => {
      jest.clearAllMocks();
      const mockBlobs = [
        {
          name: 'prefix/file1.yaml',
          properties: {
            lastModified: new Date('2025-01-01T00:00:00Z'),
          },
        },
        {
          name: 'prefix/subdir/file2.yaml',
          properties: {
            lastModified: new Date('2024-01-01T00:00:00Z'),
          },
        },
      ];

      mockBlobDownload.mockResolvedValue({
        readableStreamBody: Readable.from(
          Buffer.from('site_name: Test Azure Blob'),
        ),
      });

      mockListBlobsFlat.mockReturnValue({
        [Symbol.asyncIterator]: async function* generateBlobs() {
          for (const blob of mockBlobs) {
            yield blob;
          }
        },
      });
    });

    it('returns contents of blobs in a container', async () => {
      const response = await reader.readTree(
        'https://test-account.blob.core.windows.net/test-container/prefix',
      );
      const files = await response.files();

      expect(files).toHaveLength(2);
      const file1Content = await files[0].content();
      expect(file1Content.toString()).toBe('site_name: Test Azure Blob');
    });
  });

  describe('search', () => {
    const [{ reader }] = createReader({
      integrations: {
        azureBlobStorage: [
          {
            accountName: 'test-account',
            accountKey: 'test-key',
          },
        ],
      },
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a file when given an exact valid url', async () => {
      mockBlobDownload.mockResolvedValue({
        readableStreamBody: Readable.from(
          Buffer.from('site_name: Test Azure Blob'),
        ),
        etag: '"etag"',
        lastModified: new Date('2025-01-01T00:00:00Z'),
      });

      const data = await reader.search(
        'https://test-account.blob.core.windows.net/test-container/test-file.yaml',
      );

      expect(data.etag).toBe('"etag"');
      expect(data.files.length).toBe(1);
      expect(data.files[0].url).toBe(
        'https://test-account.blob.core.windows.net/test-container/test-file.yaml',
      );
      expect((await data.files[0].content()).toString()).toEqual(
        'site_name: Test Azure Blob',
      );
    });

    it('should handle Azure SDK errors from readUrl', async () => {
      mockBlobDownload.mockRejectedValue(new Error('Blob not found'));

      await expect(
        reader.search(
          'https://test-account.blob.core.windows.net/test-container/missing.yaml',
        ),
      ).rejects.toThrow('Could not retrieve file from Azure Blob Storage');
    });

    it('throws if given URL with wildcard', async () => {
      await expect(
        reader.search(
          'https://test-account.blob.core.windows.net/test-container/test-*.yaml',
        ),
      ).rejects.toThrow(
        'Glob search pattern not implemented for AzureBlobStorageUrlReader',
      );
    });
  });
});
