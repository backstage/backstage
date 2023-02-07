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

import { getVoidLogger } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { Config, ConfigReader } from '@backstage/config';
import { ObjectsByEntityResponse } from '@backstage/plugin-kubernetes-common';
import express from 'express';
import request from 'supertest';
import {
  ClusterDetails,
  FetchResponseWrapper,
  KubernetesClustersSupplier,
  KubernetesFetcher,
  KubernetesServiceLocator,
  ObjectFetchParams,
} from '../types/types';
import { KubernetesBuilder } from './KubernetesBuilder';
import { KubernetesFanOutHandler } from './KubernetesFanOutHandler';
import { CatalogApi } from '@backstage/catalog-client';
import {
  HEADER_KUBERNETES_CLUSTER,
  HEADER_KUBERNETES_AUTH,
} from './KubernetesProxy';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { rest } from 'msw';
import {
  AuthorizeResult,
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';

describe('KubernetesBuilder', () => {
  let app: express.Express;
  let kubernetesFanOutHandler: jest.Mocked<KubernetesFanOutHandler>;
  let config: Config;
  let catalogApi: CatalogApi;
  let permissions: jest.Mocked<PermissionEvaluator>;

  beforeAll(async () => {
    const logger = getVoidLogger();
    config = new ConfigReader({
      kubernetes: {
        serviceLocatorMethod: { type: 'multiTenant' },
        clusterLocatorMethods: [{ type: 'config', clusters: [] }],
      },
    });

    const clusters: ClusterDetails[] = [
      {
        name: 'some-cluster',
        authProvider: 'serviceAccount',
        url: 'https://localhost:1234',
        serviceAccountToken: 'someToken',
      },
      {
        name: 'some-other-cluster',
        url: 'https://localhost:1235',
        authProvider: 'google',
      },
    ];
    const clusterSupplier: KubernetesClustersSupplier = {
      async getClusters() {
        return clusters;
      },
    };

    kubernetesFanOutHandler = {
      getKubernetesObjectsByEntity: jest.fn(),
    } as any;

    permissions = {
      authorize: jest.fn(),
      authorizeConditional: jest.fn(),
    };

    const { router } = await KubernetesBuilder.createBuilder({
      config,
      logger,
      catalogApi,
      permissions,
    })
      .setObjectsProvider(kubernetesFanOutHandler)
      .setClusterSupplier(clusterSupplier)
      .build();

    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('get /clusters', () => {
    it('happy path: lists clusters', async () => {
      const response = await request(app).get('/clusters');

      expect(response.status).toEqual(200);
      expect(response.body).toStrictEqual({
        items: [
          {
            name: 'some-cluster',
            authProvider: 'serviceAccount',
          },
          {
            name: 'some-other-cluster',
            authProvider: 'google',
          },
        ],
      });
    });
  });
  describe('post /services/:serviceId', () => {
    it('happy path: lists kubernetes objects without auth in request body', async () => {
      const result = {
        clusterOne: {
          pods: [
            {
              metadata: {
                name: 'pod1',
              },
            },
          ],
        },
      } as any;
      kubernetesFanOutHandler.getKubernetesObjectsByEntity.mockReturnValueOnce(
        Promise.resolve(result),
      );

      const response = await request(app).post('/services/test-service');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(result);
    });

    it('happy path: lists kubernetes objects with auth in request body', async () => {
      const result = {
        clusterOne: {
          pods: [
            {
              metadata: {
                name: 'pod1',
              },
            },
          ],
        },
      } as any;
      kubernetesFanOutHandler.getKubernetesObjectsByEntity.mockReturnValueOnce(
        Promise.resolve(result),
      );

      const response = await request(app)
        .post('/services/test-service')
        .send({
          auth: {
            google: 'google_token_123',
          },
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(result);
    });

    it('internal error: lists kubernetes objects', async () => {
      kubernetesFanOutHandler.getKubernetesObjectsByEntity.mockRejectedValue(
        Error('some internal error'),
      );

      const response = await request(app).post('/services/test-service');

      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ error: 'some internal error' });
    });

    it('custom service locator', async () => {
      const logger = getVoidLogger();
      const someCluster: ClusterDetails = {
        name: 'some-cluster',
        authProvider: 'serviceAccount',
        url: 'https://localhost:1234',
        serviceAccountToken: 'someToken',
      };
      const clusters: ClusterDetails[] = [
        someCluster,
        {
          name: 'some-other-cluster',
          url: 'https://localhost:1235',
          authProvider: 'google',
        },
      ];
      const clusterSupplier: KubernetesClustersSupplier = {
        async getClusters() {
          return clusters;
        },
      };
      const pod = {
        metadata: {
          name: 'pod1',
        },
      };
      const result: ObjectsByEntityResponse = {
        items: [
          {
            cluster: {
              name: someCluster.name,
            },
            errors: [],
            podMetrics: [],
            resources: [
              {
                type: 'pods',
                resources: [pod],
              },
            ],
          },
        ],
      };

      const serviceLocator: KubernetesServiceLocator = {
        getClustersByEntity(
          _entity: Entity,
        ): Promise<{ clusters: ClusterDetails[] }> {
          return Promise.resolve({ clusters: [someCluster] });
        },
      };

      const fetcher: KubernetesFetcher = {
        fetchPodMetricsByNamespaces(
          _clusterDetails: ClusterDetails,
          _namespaces: Set<string>,
        ): Promise<FetchResponseWrapper> {
          return Promise.resolve({ errors: [], responses: [] });
        },
        fetchObjectsForService(
          _params: ObjectFetchParams,
        ): Promise<FetchResponseWrapper> {
          return Promise.resolve({
            errors: [],
            responses: [
              {
                type: 'pods',
                resources: [pod],
              },
            ],
          });
        },
      };

      const { router } = await KubernetesBuilder.createBuilder({
        logger,
        config,
        catalogApi,
        permissions,
      })
        .setClusterSupplier(clusterSupplier)
        .setServiceLocator(serviceLocator)
        .setFetcher(fetcher)
        .build();
      app = express().use(router);

      const response = await request(app)
        .post('/services/test-service')
        .send({
          entity: {
            metadata: {
              name: 'thing',
            },
          },
        });

      expect(response.body).toEqual(result);
      expect(response.status).toEqual(200);
    });
  });

  describe('post /proxy', () => {
    const worker = setupServer();
    setupRequestMockHandlers(worker);

    beforeEach(() => {
      worker.use(
        rest.post(
          'https://localhost:1234/api/v1/namespaces',
          (req, res, ctx) => {
            if (!req.headers.get('Authorization')) {
              return res(ctx.status(401));
            }
            return req
              .arrayBuffer()
              .then(body =>
                res(
                  ctx.set('content-type', `${req.headers.get('content-type')}`),
                  ctx.body(body),
                ),
              );
          },
        ),
      );
    });

    it('returns the given request body with permission set to allow', async () => {
      const requestBody = {
        kind: 'Namespace',
        apiVersion: 'v1',
        metadata: {
          name: 'new-ns',
        },
      };

      permissions.authorize.mockReturnValue(
        Promise.resolve([{ result: AuthorizeResult.ALLOW }]),
      );

      const proxyEndpointRequest = request(app)
        .post('/proxy/api/v1/namespaces')
        .set(HEADER_KUBERNETES_CLUSTER, 'some-cluster')
        .set(HEADER_KUBERNETES_AUTH, 'randomtoken')
        .send(requestBody);

      worker.use(rest.all(proxyEndpointRequest.url, req => req.passthrough()));

      const response = await proxyEndpointRequest;

      expect(response.body).toStrictEqual(requestBody);
    });

    it('supports yaml content type with permission set to allow', async () => {
      const requestBody = `---
    kind: Namespace
    apiVersion: v1
    metadata:
      name: new-ns
    `;

      permissions.authorize.mockReturnValue(
        Promise.resolve([{ result: AuthorizeResult.ALLOW }]),
      );

      const proxyEndpointRequest = request(app)
        .post('/proxy/api/v1/namespaces')
        .set(HEADER_KUBERNETES_CLUSTER, 'some-cluster')
        .set(HEADER_KUBERNETES_AUTH, 'randomtoken')
        .set('content-type', 'application/yaml')
        .send(requestBody);

      worker.use(rest.all(proxyEndpointRequest.url, req => req.passthrough()));

      const response = await proxyEndpointRequest;
      expect(response.text).toEqual(requestBody);
    });

    it('returns a 403 response if Permission Policy is in place that blocks endpoint', async () => {
      const requestBody = {
        kind: 'Namespace',
        apiVersion: 'v1',
        metadata: {
          name: 'new-ns',
        },
      };

      permissions.authorize.mockReturnValue(
        Promise.resolve([{ result: AuthorizeResult.DENY }]),
      );

      const proxyEndpointRequest = request(app)
        .post('/proxy/api/v1/namespaces')
        .set(HEADER_KUBERNETES_CLUSTER, 'some-cluster')
        .set(HEADER_KUBERNETES_AUTH, 'randomtoken')
        .send(requestBody);

      worker.use(rest.all(proxyEndpointRequest.url, req => req.passthrough()));

      const response = await proxyEndpointRequest;

      expect(response.status).toEqual(403);
    });
  });
});
