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
            providerId: {
              target: 'mock-target',
            },
          },
        },
      },
    });
    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(1);
    expect(providerConfigs[0].id).toEqual('providerId');
    expect(providerConfigs[0].target).toEqual('mock-target');
  });

  it('multiple provider configs', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            providerTarget: {
              target: 'mock-target',
            },
            secondProviderTarget: {
              target: 'mock-target-2',
            },
          },
        },
      },
    });
    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(2);
    expect(providerConfigs[0]).toEqual({
      id: 'providerTarget',
      target: 'mock-target',
    });
    expect(providerConfigs[1]).toEqual({
      id: 'secondProviderTarget',
      target: 'mock-target-2',
    });
  });
});
