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
import { Config, ConfigReader } from '@backstage/config';
import {
  AzureBlobStorageIntegrationConfig,
  readAzureBlobStorageIntegrationConfig,
  readAzureBlobStorageIntegrationConfigs,
} from './config';

describe('readAzureBlobStorageIntegrationConfig', () => {
  function buildConfig(
    data: Partial<AzureBlobStorageIntegrationConfig>,
  ): Config {
    return new ConfigReader(data);
  }

  it('reads valid configuration with accountKey', () => {
    const output = readAzureBlobStorageIntegrationConfig(
      buildConfig({
        accountName: 'mystorageaccount',
        accountKey: 'someAccountKey',
      }),
    );
    expect(output).toEqual({
      host: 'blob.core.windows.net',
      endpoint: undefined,
      accountName: 'mystorageaccount',
      accountKey: 'someAccountKey',
      sasToken: undefined,
      connectionString: undefined,
      endpointSuffix: undefined,
      aadCredential: undefined,
    });
  });

  it('reads valid configuration with sasToken', () => {
    const output = readAzureBlobStorageIntegrationConfig(
      buildConfig({
        endpoint: 'https://blob.core.windows.net',
        accountName: 'mystorageaccount',
        sasToken: 'someSASToken',
      }),
    );
    expect(output).toEqual({
      host: 'blob.core.windows.net',
      endpoint: 'https://blob.core.windows.net',
      accountName: 'mystorageaccount',
      accountKey: undefined,
      sasToken: 'someSASToken',
      connectionString: undefined,
      endpointSuffix: undefined,
      aadCredential: undefined,
    });
  });

  it('reads valid configuration with Azure AD credentials', () => {
    const output = readAzureBlobStorageIntegrationConfig(
      buildConfig({
        accountName: 'mystorageaccount',
        aadCredential: {
          clientId: 'someClientId',
          tenantId: 'someTenantId',
          clientSecret: 'someClientSecret',
        },
      }),
    );
    expect(output).toEqual({
      host: 'blob.core.windows.net',
      endpoint: undefined,
      accountName: 'mystorageaccount',
      accountKey: undefined,
      sasToken: undefined,
      connectionString: undefined,
      endpointSuffix: undefined,
      aadCredential: {
        clientId: 'someClientId',
        tenantId: 'someTenantId',
        clientSecret: 'someClientSecret',
      },
    });
  });

  it('reads valid configuration with a custom endpoint', () => {
    const output = readAzureBlobStorageIntegrationConfig(
      buildConfig({
        endpoint: 'https://custom.blob.core.windows.net',
        accountName: 'customaccount',
      }),
    );
    expect(output).toEqual({
      host: 'custom.blob.core.windows.net',
      endpoint: 'https://custom.blob.core.windows.net',
      accountName: 'customaccount',
      accountKey: undefined,
      sasToken: undefined,
      connectionString: undefined,
      endpointSuffix: undefined,
      aadCredential: undefined,
    });
  });

  it('throws error for invalid endpoint URL', () => {
    const config = buildConfig({
      endpoint: 'invalid-url',
      accountName: 'invalidaccount',
    });

    expect(() => readAzureBlobStorageIntegrationConfig(config)).toThrow(
      `invalid azureBlobStorage integration config, endpoint 'invalid-url' is not a valid URL`,
    );
  });

  it('throws error if endpoint has a path', () => {
    const config = buildConfig({
      endpoint: 'https://blob.core.windows.net/path',
      accountName: 'accountwithpath',
    });

    expect(() => readAzureBlobStorageIntegrationConfig(config)).toThrow(
      `invalid azureBlobStorage integration config, endpoints cannot contain path, got 'https://blob.core.windows.net/path'`,
    );
  });

  it('throws error if both accountKey and sasToken are provided', () => {
    const config = buildConfig({
      accountName: 'mystorageaccount',
      accountKey: 'someAccountKey',
      sasToken: 'someSASToken',
    });

    expect(() => readAzureBlobStorageIntegrationConfig(config)).toThrow(
      `Invalid Azure Blob Storage config for mystorageaccount: Both account key and SAS token cannot be used simultaneously.`,
    );
  });

  it('throws error if both aadCredential and accountKey/sasToken are provided', () => {
    const config = buildConfig({
      accountName: 'mystorageaccount',
      accountKey: 'someAccountKey',
      aadCredential: {
        clientId: 'someClientId',
        tenantId: 'someTenantId',
        clientSecret: 'someClientSecret',
      },
    });

    expect(() => readAzureBlobStorageIntegrationConfig(config)).toThrow(
      `Invalid Azure Blob Storage config for mystorageaccount: Cannot use both Azure AD credentials and account keys/SAS tokens for the same account.`,
    );
  });
});

describe('readAzureBlobStorageIntegrationConfigs', () => {
  function buildConfigs(
    data: Partial<AzureBlobStorageIntegrationConfig>[],
  ): Config[] {
    return data.map(item => new ConfigReader(item));
  }

  it('reads all provided configurations', () => {
    const output = readAzureBlobStorageIntegrationConfigs(
      buildConfigs([
        {
          host: 'blob.core.windows.net',
          accountName: 'account1',
          accountKey: 'someAccountKey',
        },
        {
          endpoint: 'https://custom.blob.core.windows.net',
          accountName: 'account2',
        },
      ]),
    );
    expect(output).toEqual([
      {
        host: 'blob.core.windows.net',
        endpoint: undefined,
        accountName: 'account1',
        accountKey: 'someAccountKey',
        sasToken: undefined,
        connectionString: undefined,
        endpointSuffix: undefined,
        aadCredential: undefined,
      },
      {
        host: 'custom.blob.core.windows.net',
        endpoint: 'https://custom.blob.core.windows.net',
        accountName: 'account2',
        accountKey: undefined,
        sasToken: undefined,
        connectionString: undefined,
        endpointSuffix: undefined,
        aadCredential: undefined,
      },
    ]);
  });

  it('adds default integration for blob.core.windows.net when missing', () => {
    const output = readAzureBlobStorageIntegrationConfigs(
      buildConfigs([
        {
          endpoint: 'https://custom.blob.core.windows.net',
          accountName: 'account2',
        },
      ]),
    );

    expect(output).toEqual([
      {
        host: 'custom.blob.core.windows.net',
        endpoint: 'https://custom.blob.core.windows.net',
        accountName: 'account2',
        accountKey: undefined,
        sasToken: undefined,
        connectionString: undefined,
        endpointSuffix: undefined,
        aadCredential: undefined,
      },
      {
        host: 'blob.core.windows.net',
        endpoint: undefined,
        accountName: undefined,
        accountKey: undefined,
        sasToken: undefined,
        connectionString: undefined,
        endpointSuffix: undefined,
        aadCredential: undefined,
      },
    ]);
  });

  it('does not add default integration if blob.core.windows.net already exists', () => {
    const output = readAzureBlobStorageIntegrationConfigs(
      buildConfigs([
        { host: 'blob.core.windows.net', accountName: 'account1' },
      ]),
    );
    expect(output).toEqual([
      {
        host: 'blob.core.windows.net',
        endpoint: undefined,
        accountName: 'account1',
        accountKey: undefined,
        sasToken: undefined,
        connectionString: undefined,
        endpointSuffix: undefined,
        aadCredential: undefined,
      },
    ]);
  });
});
