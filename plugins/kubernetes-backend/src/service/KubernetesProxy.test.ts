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
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { Request } from 'express';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { ClusterDetails, KubernetesClustersSupplier } from '../types/types';
import { KubernetesProxy } from './KubernetesProxy';
import { NotFoundError } from '@backstage/errors';

describe('KubernetesProxy', () => {
  let proxy: KubernetesProxy;
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  const buildEncodedRequest = (
    clustersHeader: any,
    query: string,
    body?: unknown,
  ): Request => {
    const encodedQuery = encodeURIComponent(query);
    const encodedClusters = Buffer.from(
      JSON.stringify(clustersHeader),
    ).toString('base64');

    const req = {
      params: {
        encodedQuery,
      },
      header: (key: string) => {
        let value: string = '';
        switch (key) {
          case 'Content-Type': {
            value = 'application/json';
            break;
          }
          case 'X-Kubernetes-Clusters': {
            value = encodedClusters;
            break;
          }
          default: {
            break;
          }
        }
        return value;
      },
    } as unknown as Request;

    if (body) {
      req.body = body;
    }

    return req;
  };

  const buildClustersSupplierWithClusters = (
    clusters: ClusterDetails[],
  ): KubernetesClustersSupplier => ({
    getClusters: async () => {
      return clusters;
    },
  });

  beforeEach(() => {
    proxy = new KubernetesProxy(getVoidLogger());
  });

  it('should return a ERROR_NOT_FOUND if no clusters are found', async () => {
    const clustersSupplier = buildClustersSupplierWithClusters([]);
    const req = buildEncodedRequest({}, 'api');

    await expect(
      proxy.handleProxyRequest(req, clustersSupplier),
    ).rejects.toThrow(NotFoundError);
  });

  it('should match the response code of the Kubernetes response (single cluster)', async () => {
    const clusters: ClusterDetails[] = [
      {
        name: 'cluster1',
        url: 'http://localhost:9999',
        serviceAccountToken: 'token',
        authProvider: 'serviceAccount',
        skipTLSVerify: true,
      },
    ];

    const clustersSupplier = buildClustersSupplierWithClusters(clusters);
    const req = buildEncodedRequest({ cluster1: 'token' }, 'api');

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

    worker.use(
      rest.get(`${clusters[0].url}/${req.params.encodedQuery}`, (_, res, ctx) =>
        res(ctx.status(299), ctx.body(JSON.stringify(apiResponse))),
      ),
    );

    const result = await proxy.handleProxyRequest(req, clustersSupplier);

    expect(result.code).toEqual(299);
  });

  it('should match the response code of the best Kubernetes response (multi cluster)', async () => {
    const clusters: ClusterDetails[] = [
      {
        name: 'cluster1',
        url: 'http://localhost:9998',
        serviceAccountToken: 'token',
        authProvider: 'serviceAccount',
        skipTLSVerify: true,
      },
      {
        name: 'cluster2',
        url: 'http://localhost:9999',
        serviceAccountToken: 'token',
        authProvider: 'serviceAccount',
        skipTLSVerify: true,
      },
    ];

    const clustersSupplier = buildClustersSupplierWithClusters(clusters);
    const req = buildEncodedRequest(
      { cluster1: 'token', cluster2: 'token' },
      'api',
    );

    const apiResponse1 = {
      kind: 'APIVersions',
      versions: ['v1'],
      serverAddressByClientCIDRs: [
        {
          clientCIDR: '0.0.0.0/0',
          serverAddress: '192.168.0.1:3333',
        },
      ],
    };

    const apiResponse2 = {
      kind: 'Status',
      apiVersion: 'v1',
      metadata: {},
      status: 'Failure',
      message: 'Unauthorized',
      reason: 'Unauthorized',
      code: 401,
    };

    worker.use(
      rest.get(`${clusters[0].url}/${req.params.encodedQuery}`, (_, res, ctx) =>
        res(ctx.status(200), ctx.body(JSON.stringify(apiResponse1))),
      ),
      rest.get(`${clusters[1].url}/${req.params.encodedQuery}`, (_, res, ctx) =>
        res(ctx.status(401), ctx.body(JSON.stringify(apiResponse2))),
      ),
    );

    const result = await proxy.handleProxyRequest(req, clustersSupplier);

    expect(result.code).toEqual(200);
  });

  it('should pass the exact response data from Kubernetes (single cluster)', async () => {
    const clusters: ClusterDetails[] = [
      {
        name: 'cluster1',
        url: 'http://localhost:9999',
        serviceAccountToken: 'token',
        authProvider: 'serviceAccount',
        skipTLSVerify: true,
      },
    ];

    const clustersSupplier = buildClustersSupplierWithClusters(clusters);
    const req = buildEncodedRequest({ cluster1: 'token' }, 'api');

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

    worker.use(
      rest.get(`${clusters[0].url}/${req.params.encodedQuery}`, (_, res, ctx) =>
        res(ctx.status(200), ctx.body(JSON.stringify(apiResponse))),
      ),
    );

    const result = await proxy.handleProxyRequest(req, clustersSupplier);

    const resultString = JSON.stringify(result.data);
    const expectedString = JSON.stringify({
      cluster1: {
        kind: 'APIVersions',
        versions: ['v1'],
        serverAddressByClientCIDRs: [
          {
            clientCIDR: '0.0.0.0/0',
            serverAddress: '192.168.0.1:3333',
          },
        ],
      },
    });

    expect(resultString).toEqual(expectedString);
  });

  it('should pass the exact response data from Kubernetes (multi cluster)', async () => {
    const clusters: ClusterDetails[] = [
      {
        name: 'cluster1',
        url: 'http://localhost:9998',
        serviceAccountToken: 'token',
        authProvider: 'serviceAccount',
        skipTLSVerify: true,
      },
      {
        name: 'cluster2',
        url: 'http://localhost:9999',
        serviceAccountToken: 'token',
        authProvider: 'serviceAccount',
        skipTLSVerify: true,
      },
    ];

    const clustersSupplier = buildClustersSupplierWithClusters(clusters);
    const req = buildEncodedRequest(
      { cluster1: 'token', cluster2: 'token' },
      'api',
    );

    const apiResponse1 = {
      kind: 'APIVersions',
      versions: ['v1'],
      serverAddressByClientCIDRs: [
        {
          clientCIDR: '0.0.0.0/0',
          serverAddress: '192.168.0.1:3333',
        },
      ],
    };

    const apiResponse2 = {
      kind: 'Status',
      apiVersion: 'v1',
      metadata: {},
      status: 'Failure',
      message: 'Unauthorized',
      reason: 'Unauthorized',
      code: 401,
    };

    worker.use(
      rest.get(`${clusters[0].url}/${req.params.encodedQuery}`, (_, res, ctx) =>
        res(ctx.status(200), ctx.body(JSON.stringify(apiResponse1))),
      ),
      rest.get(`${clusters[1].url}/${req.params.encodedQuery}`, (_, res, ctx) =>
        res(ctx.status(401), ctx.body(JSON.stringify(apiResponse2))),
      ),
    );

    const result = await proxy.handleProxyRequest(req, clustersSupplier);

    const resultString = JSON.stringify(result.data);
    const expectedString = JSON.stringify({
      cluster1: {
        kind: 'APIVersions',
        versions: ['v1'],
        serverAddressByClientCIDRs: [
          {
            clientCIDR: '0.0.0.0/0',
            serverAddress: '192.168.0.1:3333',
          },
        ],
      },
      cluster2: {
        kind: 'Status',
        apiVersion: 'v1',
        metadata: {},
        status: 'Failure',
        message: 'Unauthorized',
        reason: 'Unauthorized',
        code: 401,
      },
    });

    expect(resultString).toEqual(expectedString);
  });
});
