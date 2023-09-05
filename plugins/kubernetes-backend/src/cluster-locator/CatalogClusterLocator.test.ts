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
import {
  ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE,
  ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID,
  ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER,
} from '@backstage/plugin-kubernetes-common';
import { CatalogClusterLocator } from './CatalogClusterLocator';
import { CatalogApi } from '@backstage/catalog-client';
import { ClusterDetails } from '../types/types';

const mockCatalogApi = {
  getEntityByRef: jest.fn(),
  getEntities: async () => ({
    items: [
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Resource',
        metadata: {
          annotations: {
            'kubernetes.io/api-server': 'https://apiserver.com',
            'kubernetes.io/api-server-certificate-authority': 'caData',
            'kubernetes.io/auth-provider': 'oidc',
            [ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER]: 'google',
            'kubernetes.io/skip-metrics-lookup': 'true',
            'kubernetes.io/skip-tls-verify': 'true',
            'kubernetes.io/dashboard-url': 'my-url',
            'kubernetes.io/dashboard-app': 'my-app',
          },
          name: 'owned',
          namespace: 'default',
        },
      },
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Resource',
        metadata: {
          annotations: {
            'kubernetes.io/api-server': 'https://apiserver.com',
            'kubernetes.io/api-server-certificate-authority': 'caData',
            'kubernetes.io/auth-provider': 'aws',
            [ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE]: 'my-role',
            [ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID]: 'my-id',
            [ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER]: 'google',
            'kubernetes.io/dashboard-url': 'my-url',
            'kubernetes.io/dashboard-app': 'my-app',
          },
          name: 'owned',
          namespace: 'default',
        },
      },
    ],
  }),
} as unknown as CatalogApi;

describe('CatalogClusterLocator', () => {
  it('returns empty cluster details when the cluster is empty', async () => {
    const emptyMockCatalogApi = {
      getEntityByRef: jest.fn(),
      getEntities: async () => ({
        items: [],
      }),
    } as Partial<CatalogApi> as CatalogApi;

    const clusterSupplier =
      CatalogClusterLocator.fromConfig(emptyMockCatalogApi);

    const result = await clusterSupplier.getClusters();

    expect(result).toHaveLength(0);
    expect(result).toStrictEqual([]);
  });

  it('returns the cluster details provided by annotations', async () => {
    const clusterSupplier = CatalogClusterLocator.fromConfig(mockCatalogApi);

    const result = await clusterSupplier.getClusters();

    expect(result).toHaveLength(2);
    expect(result[0]).toStrictEqual<ClusterDetails>({
      name: 'owned',
      url: 'https://apiserver.com',
      caData: 'caData',
      authProvider: 'oidc',
      authMetadata: {
        'kubernetes.io/api-server': 'https://apiserver.com',
        'kubernetes.io/api-server-certificate-authority': 'caData',
        'kubernetes.io/auth-provider': 'oidc',
        [ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER]: 'google',
        'kubernetes.io/skip-metrics-lookup': 'true',
        'kubernetes.io/skip-tls-verify': 'true',
        'kubernetes.io/dashboard-url': 'my-url',
        'kubernetes.io/dashboard-app': 'my-app',
      },
      skipMetricsLookup: true,
      skipTLSVerify: true,
      dashboardUrl: 'my-url',
      dashboardApp: 'my-app',
    });
  });

  it('returns the aws cluster details provided by annotations', async () => {
    const clusterSupplier = CatalogClusterLocator.fromConfig(mockCatalogApi);

    const result = await clusterSupplier.getClusters();

    expect(result).toHaveLength(2);
    expect(result[1]).toStrictEqual<ClusterDetails>({
      name: 'owned',
      url: 'https://apiserver.com',
      caData: 'caData',
      authProvider: 'aws',
      authMetadata: {
        'kubernetes.io/api-server': 'https://apiserver.com',
        'kubernetes.io/api-server-certificate-authority': 'caData',
        'kubernetes.io/auth-provider': 'aws',
        [ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE]: 'my-role',
        [ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID]: 'my-id',
        [ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER]: 'google',
        'kubernetes.io/dashboard-url': 'my-url',
        'kubernetes.io/dashboard-app': 'my-app',
      },
      skipMetricsLookup: false,
      skipTLSVerify: false,
      dashboardUrl: 'my-url',
      dashboardApp: 'my-app',
    });
  });
});
