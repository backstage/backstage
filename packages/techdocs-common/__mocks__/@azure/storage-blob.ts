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
import type {
  BlobUploadCommonResponse,
  ContainerGetPropertiesResponse,
} from '@azure/storage-blob';
import { EventEmitter } from 'events';

const storage = new (global as any).StorageFilesMock();

export class BlockBlobClient {
  private readonly blobName;

  constructor(blobName: string) {
    this.blobName = blobName;
  }

  uploadFile(source: string): Promise<BlobUploadCommonResponse> {
    storage.writeFile(this.blobName, source);
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
    return storage.fileExists(this.blobName);
  }

  download() {
    const emitter = new EventEmitter();
    setTimeout(() => {
      if (storage.fileExists(this.blobName)) {
        emitter.emit('data', storage.readFile(this.blobName));
        emitter.emit('end');
      } else {
        emitter.emit(
          'error',
          new Error(`The file ${this.blobName} does not exist!`),
        );
      }
    }, 0);
    return Promise.resolve({
      readableStreamBody: emitter,
    });
  }
}

class BlockBlobClientFailUpload extends BlockBlobClient {
  uploadFile(): Promise<BlobUploadCommonResponse> {
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
    storage.emptyFiles();
    this.url = url;
    this.credential = credential;
  }

  getContainerClient(containerName: string) {
    if (containerName === 'bad_container') {
      return new ContainerClientFailGetProperties();
    }
    if (this.credential.accountName === 'bad_account_credentials') {
      return new ContainerClientFailUpload();
    }
    return new ContainerClient();
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
