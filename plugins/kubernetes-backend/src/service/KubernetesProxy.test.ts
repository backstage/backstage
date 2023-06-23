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
import { errorHandler, getVoidLogger } from '@backstage/backend-common';
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
import {
  KubernetesAuthTranslator,
  NoopKubernetesAuthTranslator,
} from '../kubernetes-auth-translator';
import Router from 'express-promise-router';
import { LocalKubectlProxyClusterLocator } from '../cluster-locator/LocalKubectlProxyLocator';

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

  it('should return a ERROR_NOT_FOUND if multi-cluster & no cluster selected', async () => {
    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'local',
        url: 'http:/localhost:8001',
        authProvider: 'localKubectlProxy',
        skipMetricsLookup: true,
      } as ClusterDetails,
      {
        name: 'cluster1',
        url: 'https://localhost:9999',
        serviceAccountToken: 'tokenA',
        authProvider: 'googleServiceAccount',
      } as ClusterDetails,
    ]);

    permissionApi.authorize.mockReturnValue(
      Promise.resolve([{ result: AuthorizeResult.ALLOW }]),
    );

    const req = buildMockRequest(undefined, 'api');
    const { res, next } = getMockRes();

    await expect(
      proxy.createRequestHandler({ permissionApi })(req, res, next),
    ).rejects.toThrow(NotFoundError);
  });

  it('should return a ERROR_NOT_FOUND if selected cluster not in config', async () => {
    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'cluster1',
        url: 'https://localhost:9999',
        serviceAccountToken: 'tokenA',
        authProvider: 'googleServiceAccount',
      } as ClusterDetails,
    ]);

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

    const router = Router();
    router.use('/mountpath', proxy.createRequestHandler({ permissionApi }));
    const app = express().use(router);
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

  it('should pass the exact response from Kubernetes default cluster & no cluster selected in single cluster setup', async () => {
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

    const router = Router();
    router.use('/mountpath', proxy.createRequestHandler({ permissionApi }));
    const app = express().use(router);
    const requestPromise = request(app).get('/mountpath/api');
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

  it('sets host header to support clusters behind name-based virtual hosts', async () => {
    worker.use(
      rest.get(
        'http://localhost:9999/api/v1/namespaces',
        (req: any, res: any, ctx: any) => {
          const host = req.headers.get('Host');
          return host === 'localhost:9999'
            ? res(ctx.status(200))
            : res.networkError(`Host '${host}' is not in the cert's altnames`);
        },
      ),
    );
    permissionApi.authorize.mockResolvedValue([
      { result: AuthorizeResult.ALLOW },
    ]);
    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'cluster1',
        url: 'http://localhost:9999',
        authProvider: '',
      },
    ]);
    authTranslator.decorateClusterDetailsWithAuth.mockImplementation(
      async x => x,
    );
    const app = express().use(
      Router().use('/mountpath', proxy.createRequestHandler({ permissionApi })),
    );

    const requestPromise = request(app)
      .get('/mountpath/api/v1/namespaces')
      .set(HEADER_KUBERNETES_CLUSTER, 'cluster1');
    worker.use(rest.all(requestPromise.url, (req: any) => req.passthrough()));
    const response = await requestPromise;

    expect(response.status).toEqual(200);
  });

  it('should default to using a authTranslator provided serviceAccountToken as authorization headers to kubeapi when backstage-kubernetes-auth field is not provided', async () => {
    worker.use(
      rest.get(
        'https://localhost:9999/api/v1/namespaces',
        (req: any, res: any, ctx: any) => {
          if (!req.headers.get('Authorization')) {
            return res(ctx.status(401));
          }

          if (
            req.headers.get('Authorization') !==
            'Bearer translator-provided-token'
          ) {
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
      serviceAccountToken: 'translator-provided-token',
      authProvider: 'serviceAccount',
    } as ClusterDetails);

    const router = Router();
    router.use('/mountpath', proxy.createRequestHandler({ permissionApi }));
    const app = express().use(router);

    const requestPromise = request(app)
      .get('/mountpath/api/v1/namespaces')
      .set(HEADER_KUBERNETES_CLUSTER, 'cluster1');

    worker.use(rest.all(requestPromise.url, (req: any) => req.passthrough()));

    const response = await requestPromise;

    expect(response.status).toEqual(200);
  });

  it('should add a authTranslator provided serviceAccountToken as authorization headers to kubeapi if one isnt provided in request and one isnt set up in cluster details', async () => {
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

    const router = Router();
    router.use('/mountpath', proxy.createRequestHandler({ permissionApi }));
    const app = express().use(router);

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

    const router = Router();
    router.use('/mountpath', proxy.createRequestHandler({ permissionApi }));
    const app = express().use(router);

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

  it('should not invoke authTranslator if Backstage-Kubernetes-Authorization field is provided', async () => {
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

    const router = Router();
    router.use('/mountpath', proxy.createRequestHandler({ permissionApi }));
    const app = express().use(router);

    const requestPromise = request(app)
      .get('/mountpath/api/v1/namespaces')
      .set(HEADER_KUBERNETES_CLUSTER, 'cluster1')
      .set(HEADER_KUBERNETES_AUTH, 'tokenB');

    worker.use(rest.all(requestPromise.url, (req: any) => req.passthrough()));

    const response = await requestPromise;

    expect(authTranslator.decorateClusterDetailsWithAuth).toHaveBeenCalledTimes(
      0,
    );
    expect(response.status).toEqual(200);
    expect(response.body).toStrictEqual({
      kind: 'NamespaceList',
      apiVersion: 'v1',
      items: [],
    });
  });

  it('returns a response with a localKubectlProxy auth provider configuration', async () => {
    proxy = new KubernetesProxy({
      logger: getVoidLogger(),
      clusterSupplier: new LocalKubectlProxyClusterLocator(),
      authTranslator: new NoopKubernetesAuthTranslator(),
    });

    worker.use(
      rest.get('http://localhost:8001/api/v1/namespaces', (_req, res, ctx) => {
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

    const router = Router();
    router.use('/mountpath', proxy.createRequestHandler({ permissionApi }));
    const app = express().use(router);

    const requestPromise = request(app)
      .get('/mountpath/api/v1/namespaces')
      .set(HEADER_KUBERNETES_CLUSTER, 'local');

    worker.use(rest.all(requestPromise.url, (req: any) => req.passthrough()));

    const response = await requestPromise;

    expect(response.status).toEqual(200);
    expect(response.body).toStrictEqual({
      kind: 'NamespaceList',
      apiVersion: 'v1',
      items: [],
    });
  });

  it('returns a 500 error if authTranslator errors out and Backstage-Kubernetes-Authorization field is not provided', async () => {
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

    permissionApi.authorize.mockResolvedValue([
      { result: AuthorizeResult.ALLOW },
    ]);

    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'cluster1',
        url: 'https://localhost:9999',
        authProvider: 'google',
        serviceAccountToken: 'client-side-token',
      },
    ] as ClusterDetails[]);

    authTranslator.decorateClusterDetailsWithAuth.mockRejectedValue(
      Error('some internal error'),
    );

    const router = Router();
    router.use('/mountpath', proxy.createRequestHandler({ permissionApi }));
    router.use(errorHandler());
    const app = express().use(router);

    const requestPromise = request(app)
      .get('/mountpath/api/v1/namespaces')
      .set(HEADER_KUBERNETES_CLUSTER, 'cluster1');

    worker.use(rest.all(requestPromise.url, (req: any) => req.passthrough()));

    const response = await requestPromise;

    expect(response.status).toEqual(500);
  });
});
