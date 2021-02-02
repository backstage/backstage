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

export class BlockBlobClient {
  private readonly blobName;

  constructor(blobName: string) {
    this.blobName = blobName;
  }

  uploadFile(source: string) {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(source)) {
        reject('');
      } else {
        resolve('');
      }
    });
  }

  exists() {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(this.blobName)) {
        resolve(true);
      } else {
        reject({ message: 'The object doest not exist !' });
      }
    });
  }
}

export class ContainerClient {
  private readonly containerName;

  constructor(containerName: string) {
    this.containerName = containerName;
  }

  getProperties() {
    return new Promise(resolve => {
      resolve('');
    });
  }

  getBlockBlobClient(blobName: string) {
    return new BlockBlobClient(blobName);
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
