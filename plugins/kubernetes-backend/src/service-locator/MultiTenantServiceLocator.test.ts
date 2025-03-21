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

import '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { ServiceLocatorRequestContext } from '../types/types';
import { MultiTenantServiceLocator } from './MultiTenantServiceLocator';

describe('MultiTenantConfigClusterLocator', () => {
  it('empty clusters returns empty cluster details', async () => {
    const sut = new MultiTenantServiceLocator({
      getClusters: async () => [],
    });

    const result = await sut.getClustersByEntity(
      {} as Entity,
      {} as ServiceLocatorRequestContext,
    );

    expect(result).toStrictEqual({ clusters: [] });
  });

  it('one clusters returns one cluster details', async () => {
    const sut = new MultiTenantServiceLocator({
      getClusters: async () => {
        return [
          {
            name: 'cluster1',
            url: 'http://localhost:8080',
            authMetadata: {},
          },
        ];
      },
    });

    const result = await sut.getClustersByEntity(
      {} as Entity,
      {} as ServiceLocatorRequestContext,
    );

    expect(result).toStrictEqual({
      clusters: [
        {
          name: 'cluster1',
          url: 'http://localhost:8080',
          authMetadata: {},
        },
      ],
    });
  });

  it('two clusters returns two cluster details', async () => {
    const sut = new MultiTenantServiceLocator({
      getClusters: async () => {
        return [
          {
            name: 'cluster1',
            url: 'http://localhost:8080',
            authMetadata: {},
          },
          {
            name: 'cluster2',
            url: 'http://localhost:8081',
            authMetadata: {},
          },
        ];
      },
    });

    const result = await sut.getClustersByEntity(
      {} as Entity,
      {} as ServiceLocatorRequestContext,
    );

    expect(result).toStrictEqual({
      clusters: [
        {
          name: 'cluster1',
          url: 'http://localhost:8080',
          authMetadata: {},
        },
        {
          name: 'cluster2',
          url: 'http://localhost:8081',
          authMetadata: {},
        },
      ],
    });
  });
});
