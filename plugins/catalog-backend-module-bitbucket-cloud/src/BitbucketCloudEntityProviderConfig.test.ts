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
import { readProviderConfigs } from './BitbucketCloudEntityProviderConfig';

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
          bitbucketCloud: {
            workspace: 'test-ws',
          },
        },
      },
    });
    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(1);
    expect(providerConfigs[0].id).toEqual('default');
    expect(providerConfigs[0].workspace).toEqual('test-ws');
  });

  it('multiple provider configs', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          bitbucketCloud: {
            providerWorkspaceOnly: {
              workspace: 'test-ws1',
            },
            providerCustomCatalogPath: {
              workspace: 'test-ws2',
              catalogPath: 'custom/path/catalog-info.yaml',
            },
            providerWithProjectKeyFilter: {
              workspace: 'test-ws3',
              filters: {
                projectKey: 'projectKey.*filter',
              },
            },
            providerWithRepoSlugFilter: {
              workspace: 'test-ws4',
              filters: {
                repoSlug: 'repoSlug.*filter',
              },
            },
          },
        },
      },
    });
    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(4);
    expect(providerConfigs[0]).toEqual({
      id: 'providerWorkspaceOnly',
      workspace: 'test-ws1',
      catalogPath: '/catalog-info.yaml',
      filters: {
        projectKey: undefined,
        repoSlug: undefined,
      },
    });
    expect(providerConfigs[1]).toEqual({
      id: 'providerCustomCatalogPath',
      workspace: 'test-ws2',
      catalogPath: 'custom/path/catalog-info.yaml',
      filters: {
        projectKey: undefined,
        repoSlug: undefined,
      },
    });
    expect(providerConfigs[2]).toEqual({
      id: 'providerWithProjectKeyFilter',
      workspace: 'test-ws3',
      catalogPath: '/catalog-info.yaml',
      filters: {
        projectKey: /^projectKey.*filter$/,
        repoSlug: undefined,
      },
    });
    expect(providerConfigs[3]).toEqual({
      id: 'providerWithRepoSlugFilter',
      workspace: 'test-ws4',
      catalogPath: '/catalog-info.yaml',
      filters: {
        projectKey: undefined,
        repoSlug: /^repoSlug.*filter$/,
      },
    });
  });
});
