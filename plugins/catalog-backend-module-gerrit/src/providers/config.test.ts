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
import { readGerritConfigs } from './config';

describe('readGerritConfigs', () => {
  it('reads all provider configs', () => {
    const provider1 = {
      host: 'gerrit1.com',
      query: 'state=ACTIVE',
      branch: 'main',
    };
    const provider2 = {
      host: 'gerrit2.com',
      query: 'state=ACTIVE',
      branch: 'main',
      catalogPath: 'catalog-*.yaml',
    };
    const provider3 = {
      host: 'gerrit1.com',
      query: 'state=ACTIVE',
      branch: 'main',
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
          gerrit: {
            'active-g1': provider1,
            'active-g2': provider2,
            'active-g3': provider3,
          },
        },
      },
    };

    const actual = readGerritConfigs(new ConfigReader(config));

    expect(actual).toHaveLength(3);
    expect(actual[0]).toEqual({
      ...provider1,
      id: 'active-g1',
      catalogPath: 'catalog-info.yaml',
    });
    expect(actual[1]).toEqual({
      ...provider2,
      id: 'active-g2',
      catalogPath: 'catalog-*.yaml',
    });
    expect(actual[2]).toEqual({
      ...provider3,
      id: 'active-g3',
      catalogPath: 'catalog-info.yaml',
      schedule: {
        ...provider3.schedule,
        frequency: { minutes: 30 },
      },
    });
  });

  it('provides default values', () => {
    const provider = {
      host: 'gerrit1.com',
      query: 'state=ACTIVE',
    };
    const config = {
      catalog: {
        providers: {
          gerrit: {
            'active-g1': provider,
          },
        },
      },
    };
    const actual = readGerritConfigs(new ConfigReader(config));
    expect(actual).toHaveLength(1);
    expect(actual[0]).toEqual({
      catalogPath: 'catalog-info.yaml',
      id: 'active-g1',
      ...provider,
    });
  });
});
