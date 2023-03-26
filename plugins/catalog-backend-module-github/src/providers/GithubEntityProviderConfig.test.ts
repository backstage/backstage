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
import { readProviderConfigs } from './GithubEntityProviderConfig';

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
          github: {
            organization: 'test-org',
          },
        },
      },
    });
    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(1);
    expect(providerConfigs[0].id).toEqual('default');
    expect(providerConfigs[0].organization).toEqual('test-org');
  });

  it('multiple provider configs', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            providerOrganizationOnly: {
              organization: 'test-org1',
            },
            providerCustomCatalogPath: {
              organization: 'test-org2',
              catalogPath: 'custom/path/catalog-info.yaml',
            },
            providerWithRepositoryFilter: {
              organization: 'test-org3',
              filters: {
                repository: 'repository.*filter',
              },
            },
            providerWithBranchFilter: {
              organization: 'test-org4',
              filters: {
                branch: 'branch-name',
              },
            },
            providerWithTopicFilter: {
              organization: 'test-org5',
              filters: {
                topic: {
                  exclude: ['backstage-exclude'],
                  include: ['backstage-include'],
                },
              },
            },
            providerWithForkFilter: {
              organization: 'test-org6',
              filters: {
                allowForks: false,
              },
            },
            providerWithVisibilitiesFilter: {
              organization: 'test-org6',
              filters: {
                visibilities: ['public', 'internal'],
              },
            },
            providerWithHost: {
              organization: 'test-org1',
              host: 'ghe.internal.com',
            },
            providerWithSchedule: {
              organization: 'test-org1',
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

    expect(providerConfigs).toHaveLength(9);
    expect(providerConfigs[0]).toEqual({
      id: 'providerOrganizationOnly',
      organization: 'test-org1',
      catalogPath: '/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: undefined,
        allowForks: true,
        topic: {
          include: undefined,
          exclude: undefined,
        },
        visibilities: undefined,
      },
      schedule: undefined,
      validateLocationsExist: false,
    });
    expect(providerConfigs[1]).toEqual({
      id: 'providerCustomCatalogPath',
      organization: 'test-org2',
      catalogPath: 'custom/path/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: undefined,
        allowForks: true,
        topic: {
          include: undefined,
          exclude: undefined,
        },
        visibilities: undefined,
      },
      schedule: undefined,
      validateLocationsExist: false,
    });
    expect(providerConfigs[2]).toEqual({
      id: 'providerWithRepositoryFilter',
      organization: 'test-org3', // organization
      catalogPath: '/catalog-info.yaml', // file
      host: 'github.com',
      filters: {
        repository: /^repository.*filter$/, // repo
        branch: undefined, // branch
        allowForks: true,
        topic: {
          include: undefined,
          exclude: undefined,
        },
        visibilities: undefined,
      },
      schedule: undefined,
      validateLocationsExist: false,
    });
    expect(providerConfigs[3]).toEqual({
      id: 'providerWithBranchFilter',
      organization: 'test-org4',
      catalogPath: '/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: 'branch-name',
        allowForks: true,
        topic: {
          include: undefined,
          exclude: undefined,
        },
        visibilities: undefined,
      },
      schedule: undefined,
      validateLocationsExist: false,
    });
    expect(providerConfigs[4]).toEqual({
      id: 'providerWithTopicFilter',
      organization: 'test-org5',
      catalogPath: '/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: undefined,
        allowForks: true,
        topic: {
          include: ['backstage-include'],
          exclude: ['backstage-exclude'],
        },
        visibilities: undefined,
      },
      schedule: undefined,
      validateLocationsExist: false,
    });
    expect(providerConfigs[5]).toEqual({
      id: 'providerWithForkFilter',
      organization: 'test-org6',
      catalogPath: '/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: undefined,
        allowForks: false,
        topic: {
          include: undefined,
          exclude: undefined,
        },
        visibilities: undefined,
      },
      schedule: undefined,
      validateLocationsExist: false,
    });
    expect(providerConfigs[6]).toEqual({
      id: 'providerWithVisibilitiesFilter',
      organization: 'test-org6',
      catalogPath: '/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: undefined,
        allowForks: true,
        topic: {
          include: undefined,
          exclude: undefined,
        },
        visibilities: ['public', 'internal'],
      },
      schedule: undefined,
      validateLocationsExist: false,
    });
    expect(providerConfigs[7]).toEqual({
      id: 'providerWithHost',
      organization: 'test-org1',
      catalogPath: '/catalog-info.yaml',
      host: 'ghe.internal.com',
      filters: {
        repository: undefined,
        branch: undefined,
        allowForks: true,
        topic: {
          include: undefined,
          exclude: undefined,
        },
        visibilities: undefined,
      },
      validateLocationsExist: false,
      schedule: undefined,
    });
    expect(providerConfigs[8]).toEqual({
      id: 'providerWithSchedule',
      organization: 'test-org1',
      catalogPath: '/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: undefined,
        allowForks: true,
        topic: {
          include: undefined,
          exclude: undefined,
        },
        visibilities: undefined,
      },
      schedule: {
        frequency: Duration.fromISO('PT30M'),
        timeout: {
          minutes: 3,
        },
      },
      validateLocationsExist: false,
    });
  });

  it('defaults validateLocationsExist to false', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            organization: 'test-org',
          },
        },
      },
    });
    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs[0].validateLocationsExist).toEqual(false);
  });

  it('throws an error when a wildcard catalog path is configured with validation of locations', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            organization: 'test-org',
            validateLocationsExist: true,
            catalogPath: '/*/catalog-info.yaml',
          },
        },
      },
    });

    expect(() => readProviderConfigs(config)).toThrow();
  });
});
