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

import { Entity } from '@backstage/catalog-model';
import { KafkaDashboardClient } from './KafkaDashboardClient';
import { ConfigApi, configApiRef } from '@backstage/core-plugin-api';
import { KAFKA_DASHBOARD_URL } from '../constants';

const mockConfigApi: jest.Mocked<Partial<typeof configApiRef.T>> = {
  getConfigArray: jest.fn(_ => []),
};

describe('KafkaDashboardClient', () => {
  let kafkaDashboardClient: KafkaDashboardClient;

  beforeEach(() => {
    kafkaDashboardClient = new KafkaDashboardClient({
      configApi: mockConfigApi as ConfigApi,
    });
  });

  it('Should return undefined on empty annotation', async () => {
    const mockEntity = {
      metadata: { annotations: { [KAFKA_DASHBOARD_URL]: '' } },
    } as unknown as Entity;

    expect(
      kafkaDashboardClient.getDashboardUrl('', '', mockEntity).url,
    ).toBeUndefined();
  });

  it('Should return consumer group and cluster based dashboard url', async () => {
    const mockEntity = {
      metadata: {
        annotations: {
          [KAFKA_DASHBOARD_URL]: 'cluster1/consumerGroup1/https://example.com',
        },
      },
    } as unknown as Entity;

    expect(
      kafkaDashboardClient.getDashboardUrl(
        'cluster1',
        'consumerGroup1',
        mockEntity,
      ).url,
    ).toEqual('https://example.com');
  });

  it('Should return cluster based dashboard url', async () => {
    const mockEntity = {
      metadata: {
        annotations: { [KAFKA_DASHBOARD_URL]: 'cluster1/https://example.com' },
      },
    } as unknown as Entity;

    expect(
      kafkaDashboardClient.getDashboardUrl(
        'cluster1',
        'consumerGroup1',
        mockEntity,
      ).url,
    ).toEqual('https://example.com');
  });

  it('Should return one dashboard url for list of dashboards', async () => {
    const mockEntity = {
      metadata: {
        annotations: {
          [KAFKA_DASHBOARD_URL]:
            'cluster1/https://example.com,cluster2/https://example2.com',
        },
      },
    } as unknown as Entity;

    expect(
      kafkaDashboardClient.getDashboardUrl('cluster2', '', mockEntity).url,
    ).toEqual('https://example2.com');
  });

  it('Should return most specific dashboard url for list of dashboards', async () => {
    const mockEntity = {
      metadata: {
        annotations: {
          [KAFKA_DASHBOARD_URL]:
            'cluster1/https://example.com,cluster1/consumerGroup1/https://example2.com',
        },
      },
    } as unknown as Entity;

    expect(
      kafkaDashboardClient.getDashboardUrl(
        'cluster1',
        'consumerGroup1',
        mockEntity,
      ).url,
    ).toEqual('https://example2.com');
  });

  it('Should return dashboard url with query parameters', async () => {
    const mockEntity = {
      metadata: {
        annotations: {
          [KAFKA_DASHBOARD_URL]:
            'cluster1/https://example.com?consumer-group=consumergroup1',
        },
      },
    } as unknown as Entity;

    expect(
      kafkaDashboardClient.getDashboardUrl('cluster1', '', mockEntity).url,
    ).toEqual('https://example.com?consumer-group=consumergroup1');
  });

  it('Should return should fallback to config', async () => {
    const mockEntity = {
      metadata: {
        annotations: { [KAFKA_DASHBOARD_URL]: 'cluster1/https://example.com' },
      },
    } as unknown as Entity;

    kafkaDashboardClient.getDashboardUrl('cluster2', '', mockEntity);
    expect(mockConfigApi.getConfigArray).toHaveBeenCalled();
  });
});
