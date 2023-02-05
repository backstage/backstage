/*
 * Copyright 2021 The Backstage Authors
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
import { readProviderConfigs } from './PuppetDBEntityProviderConfig';
import { Duration } from 'luxon';

describe('readProviderConfigs', () => {
  afterEach(() => jest.resetAllMocks());

  it('no provider config', () => {
    const config = new ConfigReader({});
    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(0);
  });

  it('single simple provider config', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          puppetdb: {
            host: 'https://puppetdb',
          },
        },
      },
    });

    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(1);
    expect(providerConfigs[0].id).toEqual('default');
    expect(providerConfigs[0].host).toEqual('https://puppetdb');
  });

  it('single specific provider config', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          puppetdb: {
            'my-provider': {
              host: 'https://puppetdb',
            },
          },
        },
      },
    });

    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(1);
    expect(providerConfigs[0].id).toEqual('my-provider');
    expect(providerConfigs[0].host).toEqual('https://puppetdb');
  });

  it('multiple provider configs', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          puppetdb: {
            'my-provider': {
              host: 'https://my-puppet/',
              query: 'my-query',
            },
            'your-provider': {
              host: 'https://your-puppet',
              query: 'your-query',
            },
          },
        },
      },
    });

    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(2);
    expect(providerConfigs[0]).toEqual({
      id: 'my-provider',
      host: 'https://my-puppet',
      query: 'my-query',
    });
    expect(providerConfigs[1]).toEqual({
      id: 'your-provider',
      host: 'https://your-puppet',
      query: 'your-query',
    });
  });

  it('provider config with schedule', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          puppetdb: {
            host: 'https://puppetdb',
            schedule: {
              frequency: 'PT30M',
              timeout: {
                minutes: 10,
              },
            },
          },
        },
      },
    });

    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(1);
    expect(providerConfigs[0].schedule).toEqual({
      frequency: Duration.fromISO('PT30M'),
      timeout: {
        minutes: 10,
      },
    });
  });
});
