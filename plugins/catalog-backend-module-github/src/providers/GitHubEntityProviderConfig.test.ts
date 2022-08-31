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
import { readProviderConfigs } from './GitHubEntityProviderConfig';

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
            providerWithHost: {
              organization: 'test-org1',
              host: 'ghe.internal.com',
            },
          },
        },
      },
    });
    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(5);
    expect(providerConfigs[0]).toEqual({
      id: 'providerOrganizationOnly',
      organization: 'test-org1',
      catalogPath: '/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: undefined,
      },
    });
    expect(providerConfigs[1]).toEqual({
      id: 'providerCustomCatalogPath',
      organization: 'test-org2',
      catalogPath: 'custom/path/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: undefined,
      },
    });
    expect(providerConfigs[2]).toEqual({
      id: 'providerWithRepositoryFilter',
      organization: 'test-org3', // organization
      catalogPath: '/catalog-info.yaml', // file
      host: 'github.com',
      filters: {
        repository: /^repository.*filter$/, // repo
        branch: undefined, // branch
      },
    });
    expect(providerConfigs[3]).toEqual({
      id: 'providerWithBranchFilter',
      organization: 'test-org4',
      catalogPath: '/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: 'branch-name',
      },
    });
    expect(providerConfigs[4]).toEqual({
      id: 'providerWithHost',
      organization: 'test-org1',
      catalogPath: '/catalog-info.yaml',
      host: 'ghe.internal.com',
      filters: {
        repository: undefined,
        branch: undefined,
      },
    });
  });
});
