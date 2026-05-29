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
import { CatalogClusterLocator } from './CatalogClusterLocator';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { Entity } from '@backstage/catalog-model';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';

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

const allowedClusterUrls = ['https://apiserver.com'];

describe('CatalogClusterLocator', () => {
  it('returns empty cluster details when the cluster is empty', async () => {
    const credentials = mockCredentials.user();
    const clusterSupplier = CatalogClusterLocator.fromConfig(
      catalogServiceMock({ entities: [] }),
      mockServices.auth(),
      { allowedClusterUrls },
    );

    const result = await clusterSupplier.getClusters({ credentials });
    expect(result).toHaveLength(0);
    expect(result).toStrictEqual([]);
  });

  it('returns the cluster details provided by annotations', async () => {
    const credentials = mockCredentials.user();
    const clusterSupplier = CatalogClusterLocator.fromConfig(
      catalogServiceMock({ entities }),
      mockServices.auth(),
      { allowedClusterUrls },
    );

    const result = await clusterSupplier.getClusters({ credentials });
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchSnapshot();
  });

  it('returns the aws cluster details provided by annotations', async () => {
    const credentials = mockCredentials.user();
    const clusterSupplier = CatalogClusterLocator.fromConfig(
      catalogServiceMock({ entities }),
      mockServices.auth(),
      { allowedClusterUrls },
    );

    const result = await clusterSupplier.getClusters({ credentials });
    expect(result).toHaveLength(2);
    expect(result[1]).toMatchSnapshot();
  });

  describe('URL allowlist', () => {
    it('falls back to the legacy (unsafe) behaviour and logs a deprecation warning when no allowlist is configured', async () => {
      const credentials = mockCredentials.user();
      const logger = mockServices.logger.mock();
      const warnSpy = jest.spyOn(logger, 'warn');
      const clusterSupplier = CatalogClusterLocator.fromConfig(
        catalogServiceMock({ entities }),
        mockServices.auth(),
        { logger },
      );

      const result = await clusterSupplier.getClusters({ credentials });
      expect(result).toHaveLength(2);
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0][0]).toMatch(/allowedClusterUrls/);

      // The warning must only be logged once per process, not on every call.
      await clusterSupplier.getClusters({ credentials });
      expect(warnSpy).toHaveBeenCalledTimes(1);
    });

    it('does not log the deprecation warning when allowUnsafeClusterUrls is acknowledged', async () => {
      const credentials = mockCredentials.user();
      const logger = mockServices.logger.mock();
      const warnSpy = jest.spyOn(logger, 'warn');
      const clusterSupplier = CatalogClusterLocator.fromConfig(
        catalogServiceMock({ entities }),
        mockServices.auth(),
        { allowUnsafeClusterUrls: true, logger },
      );

      const result = await clusterSupplier.getClusters({ credentials });
      expect(result).toHaveLength(2);
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('filters out entities whose api-server origin is not in the allowlist', async () => {
      const credentials = mockCredentials.user();
      const logger = mockServices.logger.mock();
      const warnSpy = jest.spyOn(logger, 'warn');
      const clusterSupplier = CatalogClusterLocator.fromConfig(
        catalogServiceMock({
          entities: [
            ...entities,
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Resource',
              metadata: {
                annotations: {
                  'kubernetes.io/api-server': 'https://attacker.example.com',
                  'kubernetes.io/api-server-certificate-authority': 'caData',
                  [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'aws',
                },
                name: 'evil',
                namespace: 'default',
              },
              spec: {
                type: 'kubernetes-cluster',
              },
            },
          ],
        }),
        mockServices.auth(),
        { allowedClusterUrls, logger },
      );

      const result = await clusterSupplier.getClusters({ credentials });

      expect(result).toHaveLength(2);
      expect(result.map(c => c.name)).toEqual(['owned', 'owned']);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /Ignoring catalog Kubernetes cluster 'evil'.*allowedClusterUrls/s,
        ),
      );
    });

    it('matches origins regardless of path/query suffix', async () => {
      const credentials = mockCredentials.user();
      const clusterSupplier = CatalogClusterLocator.fromConfig(
        catalogServiceMock({
          entities: [
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Resource',
              metadata: {
                annotations: {
                  'kubernetes.io/api-server':
                    'https://apiserver.com:6443/api?x=y',
                  'kubernetes.io/api-server-certificate-authority': 'caData',
                  [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'aws',
                },
                name: 'with-port-and-path',
                namespace: 'default',
              },
              spec: {
                type: 'kubernetes-cluster',
              },
            },
          ],
        }),
        mockServices.auth(),
        { allowedClusterUrls: ['https://apiserver.com:6443/anything'] },
      );

      const result = await clusterSupplier.getClusters({ credentials });
      expect(result).toHaveLength(1);
      expect(result[0].url).toEqual('https://apiserver.com:6443/api?x=y');
    });

    it('treats different ports as different origins', async () => {
      const credentials = mockCredentials.user();
      const clusterSupplier = CatalogClusterLocator.fromConfig(
        catalogServiceMock({
          entities: [
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Resource',
              metadata: {
                annotations: {
                  'kubernetes.io/api-server': 'https://apiserver.com:8443',
                  'kubernetes.io/api-server-certificate-authority': 'caData',
                  [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'aws',
                },
                name: 'wrong-port',
                namespace: 'default',
              },
              spec: {
                type: 'kubernetes-cluster',
              },
            },
          ],
        }),
        mockServices.auth(),
        { allowedClusterUrls: ['https://apiserver.com'] },
      );

      const result = await clusterSupplier.getClusters({ credentials });
      expect(result).toEqual([]);
    });

    it('rejects malformed allowlist entries up-front', () => {
      expect(() =>
        CatalogClusterLocator.fromConfig(
          catalogServiceMock({ entities }),
          mockServices.auth(),
          { allowedClusterUrls: ['not-a-url'] },
        ),
      ).toThrow(/allowedClusterUrls/);
    });
  });
});
