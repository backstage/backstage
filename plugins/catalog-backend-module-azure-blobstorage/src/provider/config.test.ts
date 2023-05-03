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

import { ConfigReader } from '@backstage/config';
import { readAzureBlobStorageConfigs } from './config';
import { Duration } from 'luxon';

describe('readAzureBlobStorageIntegrationConfig', () => {
  it('no provider empty', () => {
    const config = {
      catalog: {
        providers: {},
      },
    };
    const actual = readAzureBlobStorageConfigs(new ConfigReader(config));
    expect(actual).toHaveLength(0);
  });

  it('read single provider config', () => {
    const provider = {
      accountName: 'account',
      containerName: 'container',
      prefix: 'sub/dir/',
    };
    const config = {
      catalog: {
        providers: {
          azureBlobStorage: provider,
        },
      },
    };

    const actual = readAzureBlobStorageConfigs(new ConfigReader(config));
    expect(actual).toHaveLength(1);
    expect(actual[0]).toEqual({
      ...provider,
      id: 'default',
    });
  });

  it('read multiple configs', () => {
    const provider1 = {
      accountName: 'account',
      containerName: 'container',
      prefix: 'sub/dir/',
    };
    const provider2 = {
      accountName: 'account',
      containerName: 'container',
    };
    const provider3 = {
      accountName: 'account',
      containerName: 'container',
      schedule: {
        frequency: 'PT30M',
        timeout: {
          minutes: 3,
        },
      },
    };
    const config = {
      catalog: {
        providers: {
          azureBlobStorage: { provider1, provider2, provider3 },
        },
      },
    };
    const actual = readAzureBlobStorageConfigs(new ConfigReader(config));
    expect(actual).toHaveLength(3);

    expect(actual[0]).toEqual({
      ...provider1,
      id: 'provider1',
    });
    expect(actual[1]).toEqual({
      ...provider2,
      id: 'provider2',
    });
    expect(actual[2]).toEqual({
      ...provider3,
      id: 'provider3',
      schedule: {
        ...provider3.schedule,
        frequency: Duration.fromISO(provider3.schedule.frequency),
      },
    });
  });
});
