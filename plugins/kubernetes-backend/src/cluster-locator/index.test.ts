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
  ANNOTATION_KUBERNETES_API_SERVER,
  ANNOTATION_KUBERNETES_API_SERVER_CA,
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
} from '@backstage/plugin-kubernetes-common';
import { getCombinedClusterSupplier } from './index';
import { ClusterDetails } from '../types/types';
import { AuthenticationStrategy, DispatchStrategy } from '../auth';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';

describe('getCombinedClusterSupplier', () => {
  it('should retrieve cluster details from config', async () => {
    const config = mockServices.rootConfig({
      data: {
        kubernetes: {
          clusterLocatorMethods: [
            {
              type: 'config',
              clusters: [
                {
                  name: 'cluster1',
                  serviceAccountToken: 'token',
                  url: 'http://localhost:8080',
                  authProvider: 'serviceAccount',
                },
                {
                  name: 'cluster2',
                  url: 'http://localhost:8081',
                  authProvider: 'google',
                },
              ],
            },
          ],
        },
      },
    });
    const mockStrategy: jest.Mocked<AuthenticationStrategy> = {
      getCredential: jest.fn(),
      validateCluster: jest.fn().mockReturnValue([]),
      presentAuthMetadata: jest.fn(),
    };

    const auth = mockServices.auth();
    const credentials = mockCredentials.user();

    const clusterSupplier = getCombinedClusterSupplier(
      config,
      catalogServiceMock.mock(),
      mockStrategy,
      mockServices.logger.mock(),
      undefined,
      auth,
    );
    const result = await clusterSupplier.getClusters({ credentials });

    expect(result).toStrictEqual<ClusterDetails[]>([
      {
        name: 'cluster1',
        url: 'http://localhost:8080',
        authMetadata: {
          [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'serviceAccount',
          serviceAccountToken: 'token',
        },
        skipMetricsLookup: false,
        skipTLSVerify: false,
        caData: undefined,
        caFile: undefined,
      },
      {
        name: 'cluster2',
        url: 'http://localhost:8081',
        authMetadata: { [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google' },
        skipMetricsLookup: false,
        skipTLSVerify: false,
        caData: undefined,
        caFile: undefined,
      },
    ]);
  });

  it('throws an error when using an unsupported cluster locator', async () => {
    const config = mockServices.rootConfig({
      data: { kubernetes: { clusterLocatorMethods: [{ type: 'magic' }] } },
    });

    const auth = mockServices.auth();

    expect(() =>
      getCombinedClusterSupplier(
        config,
        catalogServiceMock(),
        new DispatchStrategy({ authStrategyMap: {} }),
        mockServices.logger.mock(),
        undefined,
        auth,
      ),
    ).toThrow(
      new Error('Unsupported kubernetes.clusterLocatorMethods: "magic"'),
    );
  });

  it('logs a warning when two clusters have the same name', async () => {
    const logger = mockServices.logger.mock();
    const warn = jest.spyOn(logger, 'warn');
    const config = mockServices.rootConfig({
      data: {
        kubernetes: {
          clusterLocatorMethods: [
            {
              type: 'config',
              clusters: [
                { name: 'cluster', url: 'url', authProvider: 'authProvider' },
              ],
            },
            { type: 'catalog' },
          ],
        },
      },
    });
    const mockStrategy: jest.Mocked<AuthenticationStrategy> = {
      getCredential: jest.fn(),
      validateCluster: jest.fn().mockReturnValue([]),
      presentAuthMetadata: jest.fn(),
    };

    const auth = mockServices.auth();
    const credentials = mockCredentials.user();

    const clusterSupplier = getCombinedClusterSupplier(
      config,
      catalogServiceMock({
        entities: [
          {
            kind: 'Resource',
            metadata: {
              name: 'cluster',
              annotations: {
                [ANNOTATION_KUBERNETES_API_SERVER]: 'mock',
                [ANNOTATION_KUBERNETES_API_SERVER_CA]: 'mock',
                [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'mock',
              },
            },
            spec: {
              type: 'kubernetes-cluster',
            },
          } as any,
        ],
      }),
      mockStrategy,
      logger,
      undefined,
      auth,
    );

    await clusterSupplier.getClusters({ credentials });

    expect(warn).toHaveBeenCalledWith(`Duplicate cluster name 'cluster'`);
  });
});
