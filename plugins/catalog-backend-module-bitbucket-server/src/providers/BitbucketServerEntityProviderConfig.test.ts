/*
 * Copyright 2022 The Backstage Authors
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
import { Duration } from 'luxon';
import { readProviderConfigs } from './BitbucketServerEntityProviderConfig';

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
          bitbucketServer: {
            host: 'bitbucket.mycompany.com',
          },
        },
      },
    });
    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(1);
    expect(providerConfigs[0]).toEqual({
      id: 'default',
      catalogPath: '/catalog-info.yaml',
      host: 'bitbucket.mycompany.com',
      filters: {
        projectKey: undefined,
        repoSlug: undefined,
      },
    });
  });

  it('multiple provider configs', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          bitbucketServer: {
            mainProvider: {
              host: 'bitbucket.mycompany.com',
            },
            secondaryProvider: {
              host: 'bitbucket2.mycompany.com',
              catalogPath: 'custom/path/catalog-info.yaml',
            },
            thirdProvider: {
              host: 'bitbucket3.mycompany.com',
              schedule: {
                frequency: 'PT30M',
                timeout: {
                  minutes: 3,
                },
              },
            },
          },
        },
      },
    });
    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(3);
    expect(providerConfigs[0]).toEqual({
      id: 'mainProvider',
      catalogPath: '/catalog-info.yaml',
      host: 'bitbucket.mycompany.com',
      filters: {
        projectKey: undefined,
        repoSlug: undefined,
      },
    });
    expect(providerConfigs[1]).toEqual({
      id: 'secondaryProvider',
      catalogPath: 'custom/path/catalog-info.yaml',
      host: 'bitbucket2.mycompany.com',
      filters: {
        projectKey: undefined,
        repoSlug: undefined,
      },
    });
    expect(providerConfigs[2]).toEqual({
      id: 'thirdProvider',
      catalogPath: '/catalog-info.yaml',
      host: 'bitbucket3.mycompany.com',
      filters: {
        projectKey: undefined,
        repoSlug: undefined,
      },
      schedule: {
        frequency: Duration.fromISO('PT30M'),
        timeout: {
          minutes: 3,
        },
      },
    });
  });

  it('single provider config with filters', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          bitbucketServer: {
            mainProvider: {
              host: 'bitbucket.mycompany.com',
              filters: {
                projectKey: 'project1',
                repoSlug: '.*',
              },
            },
          },
        },
      },
    });
    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(1);
    expect(providerConfigs[0]).toEqual({
      id: 'mainProvider',
      catalogPath: '/catalog-info.yaml',
      host: 'bitbucket.mycompany.com',
      filters: {
        projectKey: /project1/,
        repoSlug: /.*/,
      },
    });
  });
});
