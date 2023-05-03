/*
 * Copyright 2023 The Backstage Authors
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

  it('reads all values', () => {
    const output = readAzureBlobStorageIntegrationConfig(
      buildConfig({
        accountName: 'fake-account',
        secretAccessKey: '?fake-secret-key',
      }),
    );
    expect(output).toEqual({
      host: 'fake-account.blob.core.windows.net',
      accountName: 'fake-account',
      secretAccessKey: '?fake-secret-key',
    });
  });
});

describe('readAzureBlobStorageIntegrationConfigs', () => {
  function buildConfig(
    data: Partial<AzureBlobStorageIntegrationConfig>[],
  ): Config[] {
    return data.map(item => new ConfigReader(item));
  }

  it('reads all values', () => {
    const output = readAzureBlobStorageIntegrationConfigs(
      buildConfig([
        {
          accountName: 'fake-account',
          secretAccessKey: '?fake-secret-key',
        },
        {
          accountName: 'fake-account-2',
          secretAccessKey: '?fake-secret-key-2',
        },
      ]),
    );
    expect(output).toEqual([
      {
        host: 'fake-account.blob.core.windows.net',
        accountName: 'fake-account',
        secretAccessKey: '?fake-secret-key',
      },
      {
        host: 'fake-account-2.blob.core.windows.net',
        accountName: 'fake-account-2',
        secretAccessKey: '?fake-secret-key-2',
      },
    ]);
  });
});
