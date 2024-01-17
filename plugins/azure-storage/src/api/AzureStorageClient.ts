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
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { AzureStorageApi } from './AzureStorageApi';

export class AzureStorageClient implements AzureStorageApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;

  public constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }

  public async listStorageAccounts(): Promise<any> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('azurestorage')}`;
    const listContainersUrl = `${baseUrl}/list/accounts`;
    const { token: idToken } = await this.identityApi.getCredentials();
    const response = await fetch(listContainersUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
      },
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json();
  }

  public async listContainers(storageAccount: string): Promise<any> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('azurestorage')}`;
    const listContainersUrl = `${baseUrl}/${storageAccount}/containers`;
    const { token: idToken } = await this.identityApi.getCredentials();
    const response = await fetch(listContainersUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
      },
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json();
  }

  public async listContainerBlobs(
    storageAccount: string,
    containerName: string,
    prefix?: string,
  ): Promise<any> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('azurestorage')}`;
    const listContainerBlobsUrl = prefix
      ? `${baseUrl}/${storageAccount}/containers/${containerName}?prefix=${prefix}`
      : `${baseUrl}/${storageAccount}/containers/${containerName}`;
    const { token: idToken } = await this.identityApi.getCredentials();
    const response = await fetch(listContainerBlobsUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
      },
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json();
  }

  public async downloadBlob(
    storageAccount: string,
    containerName: string,
    blobName: string,
    contentType: string,
    prefix?: string,
  ): Promise<any> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('azurestorage')}`;
    const listContainerBlobsUrl = prefix
      ? `${baseUrl}/${storageAccount}/containers/${containerName}/${blobName}/download?prefix=${prefix}`
      : `${baseUrl}/${storageAccount}/containers/${containerName}/${blobName}/download`;
    const { token: idToken } = await this.identityApi.getCredentials();
    await fetch(listContainerBlobsUrl, {
      headers: {
        'Content-Type': `${contentType}`,
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
      },
    })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        // link.setAttribute('download', blobName);
        link.download = blobName;
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      });
  }
}
