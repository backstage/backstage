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

import {
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
  ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE,
  ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID,
  ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER,
} from '@backstage/plugin-kubernetes-common';
import type { LookupAddress } from 'node:dns';
import { CatalogClusterLocator } from './CatalogClusterLocator';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { Entity } from '@backstage/catalog-model';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import * as dns from 'node:dns/promises';

jest.mock('node:dns/promises');
const mockDnsLookup = dns.lookup as jest.MockedFunction<typeof dns.lookup>;

function mockDnsLookupAddresses(addresses: LookupAddress[]) {
  mockDnsLookup.mockResolvedValue(addresses as any);
}

const entities: Entity[] = [
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Resource',
    metadata: {
      annotations: {
        'kubernetes.io/api-server': 'https://apiserver.com',
        'kubernetes.io/api-server-certificate-authority': 'caData',
        [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'oidc',
        [ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER]: 'google',
        'kubernetes.io/skip-metrics-lookup': 'true',
        'kubernetes.io/skip-tls-verify': 'true',
        'kubernetes.io/dashboard-url': 'my-url',
        'kubernetes.io/dashboard-app': 'my-app',
        serviceAccountToken: 'must-not-pass-through',
      },
      name: 'owned',
      title: 'title',
      namespace: 'default',
    },
    spec: {
      type: 'kubernetes-cluster',
    },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Resource',
    metadata: {
      annotations: {
        'kubernetes.io/api-server': 'https://apiserver.com',
        'kubernetes.io/api-server-certificate-authority': 'caData',
        [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'aws',
        [ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE]: 'my-role',
        [ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID]: 'my-id',
        [ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER]: 'google',
        'kubernetes.io/dashboard-url': 'my-url',
        'kubernetes.io/dashboard-app': 'my-app',
      },
      name: 'owned',
      namespace: 'default',
    },
    spec: {
      type: 'kubernetes-cluster',
    },
  },
];

const catalogLocatorConfig = mockServices
  .rootConfig({
    data: {
      kubernetes: {
        clusterLocatorMethods: [{ type: 'catalog' }],
      },
    },
  })
  .getConfigArray('kubernetes.clusterLocatorMethods')[0];

function createLocator(entitiesList: Entity[] = entities) {
  const logger = mockServices.logger.mock();
  return {
    logger,
    clusterSupplier: CatalogClusterLocator.fromConfig(
      catalogServiceMock({ entities: entitiesList }),
      mockServices.auth(),
      catalogLocatorConfig,
      logger,
    ),
  };
}

describe('CatalogClusterLocator', () => {
  beforeEach(() => {
    mockDnsLookupAddresses([{ address: '93.184.216.34', family: 4 }]);
  });

  it('returns empty cluster details when the cluster is empty', async () => {
    const credentials = mockCredentials.user();
    const { clusterSupplier } = createLocator([]);

    const result = await clusterSupplier.getClusters({ credentials });
    expect(result).toHaveLength(0);
    expect(result).toStrictEqual([]);
  });

  it('returns the cluster details provided by annotations', async () => {
    const credentials = mockCredentials.user();
    const { clusterSupplier } = createLocator();

    const result = await clusterSupplier.getClusters({ credentials });
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchSnapshot();
    expect(result[0].authMetadata.serviceAccountToken).toBeUndefined();
  });

  it('returns the aws cluster details provided by annotations', async () => {
    const credentials = mockCredentials.user();
    const { clusterSupplier } = createLocator();

    const result = await clusterSupplier.getClusters({ credentials });
    expect(result).toHaveLength(2);
    expect(result[1]).toMatchSnapshot();
  });

  it('ignores clusters with private API server URLs', async () => {
    const credentials = mockCredentials.user();
    const { logger, clusterSupplier } = createLocator([
      {
        ...entities[0],
        metadata: {
          ...entities[0].metadata,
          name: 'private-cluster',
          annotations: {
            ...entities[0].metadata.annotations!,
            'kubernetes.io/api-server': 'https://127.0.0.1:6443',
          },
        },
      },
    ]);

    const warn = jest.spyOn(logger, 'warn');
    const result = await clusterSupplier.getClusters({ credentials });
    expect(result).toHaveLength(0);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('private-cluster'),
    );
  });

  it('accepts loopback API server URLs when dangerouslyAllowClusterUrls is configured', async () => {
    const credentials = mockCredentials.user();
    const logger = mockServices.logger.mock();
    const config = mockServices.rootConfig({
      data: {
        kubernetes: {
          clusterLocatorMethods: [
            {
              type: 'catalog',
              dangerouslyAllowClusterUrls: ['127.0.0.1'],
            },
          ],
        },
      },
    });
    const clusterSupplier = CatalogClusterLocator.fromConfig(
      catalogServiceMock({
        entities: [
          {
            ...entities[0],
            metadata: {
              ...entities[0].metadata,
              name: 'local-cluster',
              annotations: {
                ...entities[0].metadata.annotations!,
                'kubernetes.io/api-server': 'http://127.0.0.1:6443',
              },
            },
          },
        ],
      }),
      mockServices.auth(),
      config.getConfigArray('kubernetes.clusterLocatorMethods')[0],
      logger,
    );

    const result = await clusterSupplier.getClusters({ credentials });
    expect(result).toHaveLength(1);
    expect(result[0].url).toBe('http://127.0.0.1:6443');
  });

  it('rejects all catalog clusters when one uses service account authentication', async () => {
    const credentials = mockCredentials.user();
    const { clusterSupplier } = createLocator([
      entities[0],
      {
        ...entities[0],
        metadata: {
          ...entities[0].metadata,
          name: 'service-account-cluster',
          annotations: {
            ...entities[0].metadata.annotations!,
            [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'serviceAccount',
          },
        },
      },
    ]);

    await expect(clusterSupplier.getClusters({ credentials })).rejects.toThrow(
      "Invalid cluster 'service-account-cluster': authProvider 'serviceAccount' is not supported by the catalog cluster locator",
    );
  });

  it('honors skip TLS verify only when dangerouslyAllowSkipTLSVerify is enabled', async () => {
    const credentials = mockCredentials.user();
    const logger = mockServices.logger.mock();
    const config = mockServices.rootConfig({
      data: {
        kubernetes: {
          clusterLocatorMethods: [
            {
              type: 'catalog',
              dangerouslyAllowSkipTLSVerify: true,
            },
          ],
        },
      },
    });
    const clusterSupplier = CatalogClusterLocator.fromConfig(
      catalogServiceMock({ entities: [entities[0]] }),
      mockServices.auth(),
      config.getConfigArray('kubernetes.clusterLocatorMethods')[0],
      logger,
    );

    const result = await clusterSupplier.getClusters({ credentials });
    expect(result).toHaveLength(1);
    expect(result[0].skipTLSVerify).toBe(true);
  });
});
