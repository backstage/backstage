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

import 'buffer';
import { getVoidLogger } from '@backstage/backend-common';
import { NotFoundError } from '@backstage/errors';
import { getMockReq, getMockRes } from '@jest-mock/express';
import type { Request } from 'express';
import express from 'express';
import request from 'supertest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ClusterDetails, KubernetesClustersSupplier } from '../types/types';
import {
  APPLICATION_JSON,
  HEADER_KUBERNETES_CLUSTER,
  HEADER_KUBERNETES_AUTH,
  KubernetesProxy,
} from './KubernetesProxy';
import {
  AuthorizeResult,
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';
import { KubernetesAuthTranslator } from '../kubernetes-auth-translator';

describe('KubernetesProxy', () => {
  let proxy: KubernetesProxy;
  const worker = setupServer();
  const logger = getVoidLogger();

  setupRequestMockHandlers(worker);

  const buildMockRequest = (clusterName: any, path: string): Request => {
    const req = getMockReq({
      params: {
        path,
      },
      header: jest.fn((key: string) => {
        switch (key) {
          case 'Content-Type': {
            return APPLICATION_JSON;
          }
          case HEADER_KUBERNETES_CLUSTER: {
            return clusterName;
          }
          default: {
            return '';
          }
        }
      }),
    });

    return req;
  };

  const clusterSupplier: jest.Mocked<KubernetesClustersSupplier> = {
    getClusters: jest.fn(),
  };

  const permissionApi: jest.Mocked<PermissionEvaluator> = {
    authorize: jest.fn(),
    authorizeConditional: jest.fn(),
  };

  const authTranslator: jest.Mocked<KubernetesAuthTranslator> = {
    decorateClusterDetailsWithAuth: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    proxy = new KubernetesProxy({ logger, clusterSupplier, authTranslator });
  });

  it('should return a ERROR_NOT_FOUND if no clusters are found', async () => {
    clusterSupplier.getClusters.mockResolvedValue([]);
    permissionApi.authorize.mockReturnValue(
      Promise.resolve([{ result: AuthorizeResult.ALLOW }]),
    );

    const req = buildMockRequest('test', 'api');
    const { res, next } = getMockRes();

    await expect(
      proxy.createRequestHandler({ permissionApi })(req, res, next),
    ).rejects.toThrow(NotFoundError);
  });

  it('should pass the exact response from Kubernetes', async () => {
    const apiResponse = {
      kind: 'APIVersions',
      versions: ['v1'],
      serverAddressByClientCIDRs: [
        {
          clientCIDR: '0.0.0.0/0',
          serverAddress: '192.168.0.1:3333',
        },
      ],
    };

    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'cluster1',
        url: 'https://localhost:9999',
        serviceAccountToken: '',
        authProvider: 'serviceAccount',
      },
    ] as ClusterDetails[]);

    permissionApi.authorize.mockReturnValue(
      Promise.resolve([{ result: AuthorizeResult.ALLOW }]),
    );

    authTranslator.decorateClusterDetailsWithAuth.mockResolvedValue({
      name: 'cluster1',
      url: 'https://localhost:9999',
      serviceAccountToken: '',
      authProvider: 'serviceAccount',
    } as ClusterDetails);

    const app = express().use(
      '/mountpath',
      proxy.createRequestHandler({ permissionApi }),
    );
    const requestPromise = request(app)
      .get('/mountpath/api')
      .set(HEADER_KUBERNETES_CLUSTER, 'cluster1');
    worker.use(
      rest.get('https://localhost:9999/api', (_: any, res: any, ctx: any) =>
        res(ctx.status(299), ctx.json(apiResponse)),
      ),
      rest.all(requestPromise.url, (req: any) => req.passthrough()),
    );

    const response = await requestPromise;

    expect(response.status).toEqual(299);
    expect(response.body).toStrictEqual(apiResponse);
  });

  it('should default to using a provided authorization header', async () => {
    worker.use(
      rest.get(
        'https://localhost:9999/api/v1/namespaces',
        (req: any, res: any, ctx: any) => {
          if (!req.headers.get('Authorization')) {
            return res(ctx.status(401));
          }

          if (req.headers.get('Authorization') !== 'my-token') {
            return res(ctx.status(403));
          }

          return res(
            ctx.status(200),
            ctx.json({
              kind: 'NamespaceList',
              apiVersion: 'v1',
              items: [],
            }),
          );
        },
      ),
    );

    permissionApi.authorize.mockReturnValue(
      Promise.resolve([{ result: AuthorizeResult.ALLOW }]),
    );

    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'cluster1',
        url: 'https://localhost:9999',
        serviceAccountToken: '',
        authProvider: 'serviceAccount',
      },
    ] as ClusterDetails[]);

    authTranslator.decorateClusterDetailsWithAuth.mockResolvedValue({
      name: 'cluster1',
      url: 'https://localhost:9999',
      serviceAccountToken: 'random-token',
      authProvider: 'serviceAccount',
    } as ClusterDetails);

    const app = express().use(
      '/mountpath',
      proxy.createRequestHandler({ permissionApi }),
    );
    const requestPromise = request(app)
      .get('/mountpath/api/v1/namespaces')
      .set(HEADER_KUBERNETES_CLUSTER, 'cluster1')
      .set('Authorization', 'my-token');

    worker.use(rest.all(requestPromise.url, (req: any) => req.passthrough()));

    const response = await requestPromise;

    expect(response.status).toEqual(200);
  });

  it('should add a serviceAccountToken to the request headers if one isnt provided in request and one isnt set up in cluster details', async () => {
    worker.use(
      rest.get('https://localhost:9999/api/v1/namespaces', (req, res, ctx) => {
        if (!req.headers.get('Authorization')) {
          return res(ctx.status(401));
        }

        if (req.headers.get('Authorization') !== 'Bearer my-token') {
          return res(ctx.status(403));
        }

        return res(
          ctx.status(200),
          ctx.json({
            kind: 'NamespaceList',
            apiVersion: 'v1',
            items: [],
          }),
        );
      }),
    );

    permissionApi.authorize.mockReturnValue(
      Promise.resolve([{ result: AuthorizeResult.ALLOW }]),
    );

    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'cluster1',
        url: 'https://localhost:9999',
        authProvider: 'googleServiceAccount',
      },
    ] as ClusterDetails[]);

    authTranslator.decorateClusterDetailsWithAuth.mockResolvedValue({
      name: 'cluster1',
      url: 'https://localhost:9999',
      serviceAccountToken: 'my-token',
      authProvider: 'googleServiceAccount',
    } as ClusterDetails);

    const app = express().use(
      '/mountpath',
      proxy.createRequestHandler({ permissionApi }),
    );
    const requestPromise = request(app)
      .get('/mountpath/api/v1/namespaces')
      .set(HEADER_KUBERNETES_CLUSTER, 'cluster1');

    worker.use(rest.all(requestPromise.url, (req: any) => req.passthrough()));

    const response = await requestPromise;

    expect(response.status).toEqual(200);
    expect(response.body).toStrictEqual({
      kind: 'NamespaceList',
      apiVersion: 'v1',
      items: [],
    });
  });

  it('should append the Backstage-Kubernetes-Auth field to the requests authorization header if one is provided', async () => {
    worker.use(
      rest.get('https://localhost:9999/api/v1/namespaces', (req, res, ctx) => {
        if (!req.headers.get('Authorization')) {
          return res(ctx.status(401));
        }

        if (req.headers.get('Authorization') !== 'tokenB') {
          return res(ctx.status(403));
        }

        return res(
          ctx.status(200),
          ctx.json({
            kind: 'NamespaceList',
            apiVersion: 'v1',
            items: [],
          }),
        );
      }),
    );

    permissionApi.authorize.mockReturnValue(
      Promise.resolve([{ result: AuthorizeResult.ALLOW }]),
    );

    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'cluster1',
        url: 'https://localhost:9999',
        authProvider: 'googleServiceAccount',
      },
    ] as ClusterDetails[]);

    authTranslator.decorateClusterDetailsWithAuth.mockResolvedValue({
      name: 'cluster1',
      url: 'https://localhost:9999',
      serviceAccountToken: 'tokenA',
      authProvider: 'googleServiceAccount',
    } as ClusterDetails);

    const app = express().use(
      '/mountpath',
      proxy.createRequestHandler({ permissionApi }),
    );
    const requestPromise = request(app)
      .get('/mountpath/api/v1/namespaces')
      .set(HEADER_KUBERNETES_CLUSTER, 'cluster1')
      .set(HEADER_KUBERNETES_AUTH, 'tokenB');

    worker.use(rest.all(requestPromise.url, (req: any) => req.passthrough()));

    const response = await requestPromise;

    expect(response.status).toEqual(200);
    expect(response.body).toStrictEqual({
      kind: 'NamespaceList',
      apiVersion: 'v1',
      items: [],
    });
  });
});
