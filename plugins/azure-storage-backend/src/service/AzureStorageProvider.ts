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
import { Config } from '@backstage/config';
import { AzureSorageConfig } from './AzureStorageConfig';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { ClientSecretCredential } from '@azure/identity';

import { formatBytes } from '../utils/formatBytes';
import { NotFoundError } from '@backstage/errors';

export class AzureStorageProvider {
  private azureStorageConfig: AzureSorageConfig;
  constructor(config: AzureSorageConfig) {
    this.azureStorageConfig = config;
  }

  static fromConfig(config: Config): AzureStorageProvider {
    return new AzureStorageProvider(AzureSorageConfig.fromConfig(config));
  }

  listAccounts() {
    const accountList = [];
    console.log(this.azureStorageConfig);
    for (const account of this.azureStorageConfig.blobContainers) {
      accountList.push(account.accountName);
    }
    return accountList;
  }

  protected getblobServiceClient(storageAccount: string) {
    let credentialProvider;
    for (const account of this.azureStorageConfig.blobContainers) {
      console.log(account.accountName);
      console.log(storageAccount);
      if (account.accountName === storageAccount) {
        if (account.authType === 'accessToken') {
          credentialProvider = new StorageSharedKeyCredential(
            storageAccount,
            account.auth.getString('accessToken'),
          );
        } else if (account.authType === 'clientToken') {
          credentialProvider = new ClientSecretCredential(
            account.auth.getString('tenantId'),
            account.auth.getString('clientId'),
            account.auth.getString('clientSecret'),
          );
        } else {
          throw new NotFoundError('No valid auth provider');
        }
      }
    }
    return new BlobServiceClient(
      `https://${storageAccount}.blob.core.windows.net`,
      credentialProvider,
    );
  }

  async listContainers(storageAccount: string) {
    const blobServiceClient = this.getblobServiceClient(storageAccount);
    const contianerList = [];
    for await (const container of blobServiceClient.listContainers()) {
      console.log(`- ${container.name}`);
      contianerList.push(container.name);
    }
    console.log(contianerList);
    return contianerList;
  }

  async listContainerBlobs(
    storageAccount: string,
    containerName: string,
    prefix: any,
  ) {
    const blobServiceClient = this.getblobServiceClient(storageAccount);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    console.log(`prefiox ${prefix}`);
    const items = containerClient.listBlobsByHierarchy('/', {
      prefix: prefix === undefined ? '' : prefix,
    });
    const blobList = [];
    for await (const item of items) {
      if (item.kind === 'prefix') {
        console.log(`Blob: ${item.name.slice(0, -1)}`);
        blobList.push({
          filename: item.name.slice(0, -1).includes('/')
            ? item.name.slice(0, -1).split('/').pop()?.concat('/')
            : item.name,
          lastModified: '',
          createdOn: '',
          contentType: 'Folder',
          contentLength: '',
        });
      } else {
        console.log(`Blob: ${item.name}`);
        const blobClient = containerClient.getBlobClient(item.name);
        const blobProps = await blobClient.getProperties();
        blobList.push({
          filename: item.name.includes('/')
            ? item.name.split('/').pop()
            : item.name,
          lastModified: blobProps.lastModified,
          createdOn: blobProps.createdOn,
          contentType: blobProps.contentType,
          contentLength: formatBytes(blobProps.contentLength),
        });
      }
    }
    console.log(blobList);
    return blobList;
  }

  async downloadBlob(
    storageAccount: string,
    containerName: string,
    blobName: string,
    prefix: any,
  ) {
    const blobServiceClient = this.getblobServiceClient(storageAccount);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(
      prefix ? prefix + blobName : blobName,
    );
    const downloadBlockBlobResponse = await blobClient.download();
    return downloadBlockBlobResponse.readableStreamBody;
  }
}
