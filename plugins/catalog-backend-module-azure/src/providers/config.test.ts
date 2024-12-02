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

import { ConfigReader } from '@backstage/config';
import { readAzureBlobStorageConfigs, readAzureDevOpsConfigs } from './config';

describe('readAzureDevOpsConfigs', () => {
  it('reads all provider configs and set default values', () => {
    const provider1 = {
      host: 'azure.mycompany.com',
      organization: 'mycompany',
      project: 'myproject',
    };
    const provider2 = {
      organization: 'mycompany',
      project: 'myproject',
    };
    const provider3 = {
      organization: 'mycompany',
      project: 'myproject',
      repository: 'service-*',
    };
    const provider4 = {
      organization: 'mycompany',
      project: 'myproject',
      schedule: {
        frequency: 'PT30M',
        timeout: {
          minutes: 3,
        },
      },
    };
    const provider5 = {
      host: 'azure.mycompany.com',
      organization: 'mycompany',
      project: 'myproject',
      branch: 'mybranch',
    };

    const config = {
      catalog: {
        providers: {
          azureDevOps: {
            provider1,
            provider2,
            provider3,
            provider4,
            provider5,
          },
        },
      },
    };

    const actual = readAzureDevOpsConfigs(new ConfigReader(config));

    expect(actual).toHaveLength(5);
    expect(actual[0]).toEqual({
      ...provider1,
      path: '/catalog-info.yaml',
      repository: '*',
      id: 'provider1',
    });
    expect(actual[1]).toEqual({
      ...provider2,
      host: 'dev.azure.com',
      path: '/catalog-info.yaml',
      repository: '*',
      id: 'provider2',
    });
    expect(actual[2]).toEqual({
      ...provider3,
      host: 'dev.azure.com',
      path: '/catalog-info.yaml',
      id: 'provider3',
    });
    expect(actual[3]).toEqual({
      ...provider4,
      host: 'dev.azure.com',
      path: '/catalog-info.yaml',
      repository: '*',
      id: 'provider4',
      schedule: {
        ...provider4.schedule,
        frequency: { minutes: 30 },
      },
    });
    expect(actual[4]).toEqual({
      ...provider5,
      branch: 'mybranch',
      path: '/catalog-info.yaml',
      repository: '*',
      id: 'provider5',
    });
  });
});

describe('readAzureBlobStorageConfigs', () => {
  it('reads single and multiple Azure Blob Storage provider configs', () => {
    const provider1 = {
      accountName: 'account-1',
      containerName: 'container-1',
      schedule: {
        frequency: 'PT30M',
        timeout: {
          minutes: 3,
        },
      },
    };
    const provider2 = {
      accountName: 'account-1',
      containerName: 'container-2',
    };

    const configSingle = {
      catalog: {
        providers: {
          azureBlob: provider2,
        },
      },
    };

    const configMulti = {
      catalog: {
        providers: {
          azureBlob: {
            provider1,
            provider2,
          },
        },
      },
    };

    // Single provider case
    const actualSingle = readAzureBlobStorageConfigs(
      new ConfigReader(configSingle),
    );
    expect(actualSingle).toHaveLength(1);
    expect(actualSingle[0]).toEqual({
      id: 'default',
      accountName: 'account-1',
      containerName: 'container-2',
      schedule: undefined, // no schedule provided in this case
    });

    // Multiple providers case
    const actualMulti = readAzureBlobStorageConfigs(
      new ConfigReader(configMulti),
    );
    expect(actualMulti).toHaveLength(2);
    expect(actualMulti[0]).toEqual({
      id: 'provider1',
      accountName: 'account-1',
      containerName: 'container-1',
      schedule: {
        ...provider1.schedule,
        frequency: { minutes: 30 },
      },
    });
    expect(actualMulti[1]).toEqual({
      id: 'provider2',
      accountName: 'account-1',
      containerName: 'container-2',
      schedule: undefined, // no schedule provided
    });
  });
});
