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
import { readAzureDevOpsConfigs } from './config';

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
    const config = {
      catalog: {
        providers: {
          azureDevOps: { provider1, provider2, provider3 },
        },
      },
    };

    const actual = readAzureDevOpsConfigs(new ConfigReader(config));

    expect(actual).toHaveLength(3);
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
  });
});
