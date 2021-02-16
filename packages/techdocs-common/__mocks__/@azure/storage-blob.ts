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
import fs from 'fs';
import type {
  BlobUploadCommonResponse,
  ContainerGetPropertiesResponse,
} from '@azure/storage-blob';

export class BlockBlobClient {
  private readonly blobName;

  constructor(blobName: string) {
    this.blobName = blobName;
  }

  uploadFile(source: string): Promise<BlobUploadCommonResponse> {
    return Promise.resolve({
      _response: {
        request: {
          url: `https://example.blob.core.windows.net`,
        } as any,
        status: 200,
        headers: {} as any,
      },
    });
  }

  exists() {
    return Promise.resolve(fs.existsSync(this.blobName));
  }
}

class BlockBlobClientFailUpload extends BlockBlobClient {
  uploadFile(source: string): Promise<BlobUploadCommonResponse> {
    return Promise.resolve({
      _response: {
        request: {
          url: `https://example.blob.core.windows.net`,
        } as any,
        status: 500,
        headers: {} as any,
      },
    });
  }
}

export class ContainerClient {
  private readonly containerName;

  constructor(containerName: string) {
    this.containerName = containerName;
  }

  getProperties(): Promise<ContainerGetPropertiesResponse> {
    return Promise.resolve({
      _response: {
        request: {
          url: `https://example.blob.core.windows.net`,
        } as any,
        status: 200,
        headers: {} as any,
        parsedHeaders: {},
      },
    });
  }

  getBlockBlobClient(blobName: string) {
    return new BlockBlobClient(blobName);
  }
}

class ContainerClientFailGetProperties extends ContainerClient {
  getProperties(): Promise<ContainerGetPropertiesResponse> {
    return Promise.resolve({
      _response: {
        request: {
          url: `https://example.blob.core.windows.net`,
        } as any,
        status: 404,
        headers: {} as any,
        parsedHeaders: {},
      },
    });
  }
}

class ContainerClientFailUpload extends ContainerClient {
  getBlockBlobClient(blobName: string) {
    return new BlockBlobClientFailUpload(blobName);
  }
}

export class BlobServiceClient {
  private readonly url;
  private readonly credential;

  constructor(url: string, credential?: StorageSharedKeyCredential) {
    this.url = url;
    this.credential = credential;
  }

  getContainerClient(containerName: string) {
    if (containerName === 'bad_container') {
      return new ContainerClientFailGetProperties(containerName);
    }
    if (this.credential.accountName === 'failupload') {
      return new ContainerClientFailUpload(containerName);
    }
    return new ContainerClient(containerName);
  }
}

export class StorageSharedKeyCredential {
  private readonly accountName;
  private readonly accountKey;

  constructor(accountName: string, accountKey: string) {
    this.accountName = accountName;
    this.accountKey = accountKey;
  }
}
